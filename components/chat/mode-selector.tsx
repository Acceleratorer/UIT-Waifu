"use client";

import { MODES, type ModeId } from "@/data/modes";

interface ModeSelectorProps {
  value: ModeId;
  onChange: (mode: ModeId) => void;
  disabled?: boolean;
}

export function ModeSelector({ value, onChange, disabled }: ModeSelectorProps) {
  const active = MODES.find((m) => m.id === value);
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="mode" className="sr-only">
        Assistant mode
      </label>
      <select
        id="mode"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as ModeId)}
        title={active?.description}
        className="rounded-xl border border-foreground/15 bg-background px-3 py-1.5 text-sm outline-none transition focus:border-pink-400 disabled:opacity-50"
      >
        {MODES.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label}
          </option>
        ))}
      </select>
    </div>
  );
}
