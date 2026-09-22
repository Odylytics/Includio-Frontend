import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { updateAccessibilityPreferences, toast } from '@/lib/mock/mockApi'
import { useMockStore } from '@/lib/mock/mockStore'
import type { AccessibilityPreferences, ResponseMode } from '@/types/domain'

export function AccessibilityPage() {
  const prefs = useMockStore((s) => s.accessibility)
  const setPrefs = useMockStore((s) => s.setAccessibility)

  function toggle<K extends keyof AccessibilityPreferences>(key: K, value: AccessibilityPreferences[K]) {
    setPrefs({ ...prefs, [key]: value })
  }

  const toggles: { key: keyof AccessibilityPreferences; label: string; hint: string }[] = [
    { key: 'largerText', label: 'Larger text', hint: 'Increase base text size across the workspace.' },
    { key: 'reducedMotion', label: 'Reduced motion', hint: 'Limit animation and auto-advancing timers where possible.' },
    { key: 'captions', label: 'Captions', hint: 'Show captions for interviewer audio.' },
    { key: 'questionsAsText', label: 'Questions shown as text', hint: 'Always display the question in writing.' },
    { key: 'additionalThinkingTime', label: 'Additional thinking time', hint: 'Double the default thinking window.' },
    { key: 'optionalBreaks', label: 'Optional breaks', hint: 'Allow short pauses between questions.' },
    { key: 'visualClarity', label: 'Visual clarity', hint: 'Stronger borders and clearer secondary text.' },
  ]

  return (
    <div className="mx-auto max-w-[720px] space-y-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-primary-dark">
          My account
        </p>
        <h1 className="mt-1 text-[clamp(26px,3vw,34px)]">Accessibility preferences</h1>
        <p className="mt-1 text-ink-secondary">
          Customise your interview experience. No diagnosis is required.
        </p>
      </div>

      <Card className="space-y-4">
        {toggles.map((item) => (
          <label
            key={item.key}
            className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-0"
          >
            <span>
              <span className="block font-semibold">{item.label}</span>
              <span className="text-[13.5px] text-ink-muted">{item.hint}</span>
            </span>
            <input
              type="checkbox"
              className="mt-1 size-4 accent-primary"
              checked={Boolean(prefs[item.key])}
              onChange={(e) =>
                toggle(item.key, e.target.checked as AccessibilityPreferences[typeof item.key])
              }
            />
          </label>
        ))}

        <div>
          <div className="mb-2 font-semibold">Preferred response mode</div>
          <SegmentedControl
            ariaLabel="Response mode"
            value={prefs.responseMode}
            onChange={(v) => toggle('responseMode', v as ResponseMode)}
            options={[
              { value: 'voice', label: 'Voice' },
              { value: 'text', label: 'Text' },
            ]}
          />
        </div>

        <Button
          onClick={async () => {
            await updateAccessibilityPreferences(prefs)
            toast('Accessibility preferences saved', 'success')
          }}
        >
          Save preferences
        </Button>
      </Card>
    </div>
  )
}
