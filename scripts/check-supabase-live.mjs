import { existsSync, readFileSync } from "node:fs";

const REQUIRED_PUBLIC_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
];
const PHASE3_TABLES = ["profiles", "conversations", "messages"];

function parseEnvFile(path) {
  if (!existsSync(path)) return {};

  return Object.fromEntries(
    readFileSync(path, "utf8")
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const equalsIndex = line.indexOf("=");
        if (equalsIndex === -1) return [line, ""];

        const key = line.slice(0, equalsIndex).trim();
        const rawValue = line.slice(equalsIndex + 1).trim();
        const value = rawValue.replace(/^['"]|['"]$/g, "");
        return [key, value];
      })
  );
}

function readEnv() {
  return {
    ...parseEnvFile(".env"),
    ...parseEnvFile(".env.local"),
    ...process.env,
  };
}

function getProjectLabel(url) {
  try {
    return new URL(url).host;
  } catch {
    return "unknown project";
  }
}

async function fetchTable(url, anonKey, table) {
  const endpoint = new URL(`/rest/v1/${table}`, url);
  endpoint.searchParams.set("select", "id");
  endpoint.searchParams.set("limit", "1");

  const response = await fetch(endpoint, {
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
    },
  });

  const body = await response.text();
  return { response, body };
}

async function main() {
  const env = readEnv();
  const missing = REQUIRED_PUBLIC_ENV.filter((name) => !env[name]?.trim());

  console.log("Supabase live preflight");

  if (missing.length > 0) {
    console.error(`Missing public Supabase env: ${missing.join(", ")}`);
    console.error(
      "Set these in .env.local or the shell before building/deploying production."
    );
    process.exit(1);
  }

  const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL.trim();
  const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY.trim();

  let parsedUrl;
  try {
    parsedUrl = new URL(supabaseUrl);
  } catch {
    console.error("NEXT_PUBLIC_SUPABASE_URL must be a valid URL.");
    process.exit(1);
  }

  if (parsedUrl.protocol !== "https:") {
    console.error("NEXT_PUBLIC_SUPABASE_URL must use HTTPS for production.");
    process.exit(1);
  }

  console.log(`OK public config present for ${getProjectLabel(supabaseUrl)}`);

  for (const table of PHASE3_TABLES) {
    const { response, body } = await fetchTable(supabaseUrl, anonKey, table);

    if (!response.ok) {
      console.error(
        `Table check failed for ${table}: HTTP ${response.status} ${response.statusText}`
      );
      if (body) console.error(body.slice(0, 500));
      process.exit(1);
    }

    console.log(`OK ${table} REST endpoint is reachable with the anon key`);
  }

  console.log("Next: run supabase/verify_phase3_security.sql in Supabase SQL Editor.");
  console.log("No secrets were printed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
