"use client";

import { useEffect, useState } from "react";
import { MODES, type ModeId } from "@/data/modes";
import { readDefaultMode, writeDefaultMode } from "@/features/chat/preferences";

export function SettingsPanel() {
  const [defaultMode, setDefaultMode] = useState<ModeId>("general");

  useEffect(() => {
    setDefaultMode(readDefaultMode());
  }, []);

  function handleModeChange(mode: ModeId) {
    setDefaultMode(mode);
    writeDefaultMode(mode);
  }

  return (
    <section className="w-full max-w-2xl">
      <div className="border-b border-foreground/10 pb-5">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="mt-6 space-y-6">
        <label className="block">
          <span className="text-sm font-medium">Default assistant mode</span>
          <select
            value={defaultMode}
            onChange={(event) => handleModeChange(event.target.value as ModeId)}
            className="mt-2 w-full rounded-xl border border-foreground/15 bg-background px-3 py-2 outline-none transition focus:border-pink-400"
          >
            {MODES.map((mode) => (
              <option key={mode.id} value={mode.id}>
                {mode.label}
              </option>
            ))}
          </select>
        </label>

        <p className="text-sm text-foreground/55">Saved on this device.</p>
      </div>
    </section>
  );
}
