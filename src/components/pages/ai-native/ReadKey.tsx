"use client";

import type { AiNativeContent } from "@/content/ai-native";
import { selectOnCircuit } from "@/components/circuit/circuit-data";

/** "How to read it": one line per layer; each term selects its component on the board. */
export function ReadKey({ copy }: { copy: AiNativeContent["key"] }) {
  return (
    <div className="mb-6 border-y border-night-line py-5">
      <h3 className="eyebrow mb-4">{copy.title}</h3>
      <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2 xl:grid-cols-4">
        {copy.items.map((item) => (
          <div key={item.id} className="min-w-0">
            <dt>
              <button
                type="button"
                onClick={() => selectOnCircuit(item.id)}
                className="text-left text-sm font-medium text-night-ink underline decoration-night-line underline-offset-4 hover:decoration-accent"
              >
                {item.term}
              </button>
            </dt>
            <dd className="mt-0.5 text-sm text-night-mute">= {item.means}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
