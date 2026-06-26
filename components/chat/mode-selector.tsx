"use client";

import { MODES, getModeById, type ModeId } from "@/data/modes";
import { Select } from "@/components/ui/select";

interface ModeSelectorProps {
  value: ModeId;
  onChange: (mode: ModeId) => void;
  disabled?: boolean;
}

export function ModeSelector({ value, onChange, disabled }: ModeSelectorProps) {
  const active = getModeById(value);
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="mode" className="sr-only">
        Assistant mode
      </label>
      <Select
        id="mode"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as ModeId)}
        title={active?.description}
      >
        {MODES.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
