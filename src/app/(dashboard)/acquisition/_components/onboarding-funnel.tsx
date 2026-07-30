import type { FunnelStep } from "@/lib/queries";

// Labels for the iOS OnboardingStep enum's analyticsName values.
// Step 1 (authentication) happens before the tracked flow starts.
const STEP_LABELS: Record<string, string> = {
  showcaseTrack: "Showcase: Track",
  showcasePlans: "Showcase: Plans",
  showcaseCoach: "Showcase: Coach",
  showcaseCommunity: "Showcase: Community",
  primaryGoal: "Primary Goal",
  primarySport: "Primary Sport",
  experienceLevel: "Experience Level",
  bodyMetrics: "Body Metrics",
  trainingFrequency: "Training Frequency",
  workoutDuration: "Workout Duration",
  restTime: "Rest Time",
  equipment: "Equipment",
  injuries: "Injuries",
  completeProfile: "Complete Profile",
  aboutYou: "About You",
};

export function OnboardingFunnel({ steps }: { steps: FunnelStep[] }) {
  const max = steps.length > 0 ? Math.max(...steps.map((s) => s.users)) : 0;

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h2 className="mb-1 text-sm font-medium text-gray-400">
        Onboarding Funnel (30d) — users completing each step
      </h2>
      <p className="mb-4 text-xs text-gray-500">
        Where users drop off between finishing one step and the next.
      </p>

      {steps.length === 0 ? (
        <p className="py-8 text-center text-sm text-gray-500">
          No step events yet — per-step tracking ships with the next app
          update.
        </p>
      ) : (
        <div className="space-y-1.5">
          {steps.map((s, i) => {
            const prev = i > 0 ? steps[i - 1].users : null;
            const dropPct =
              prev && prev > 0
                ? Math.round(((prev - s.users) / prev) * 100)
                : null;
            return (
              <div key={s.stepNumber} className="flex items-center gap-3">
                <span className="w-6 text-right text-xs text-gray-500">
                  {s.stepNumber}
                </span>
                <span className="w-40 truncate text-sm text-gray-300">
                  {STEP_LABELS[s.step] ?? s.step}
                </span>
                <div className="h-5 flex-1 rounded bg-gray-800">
                  <div
                    className="h-5 rounded bg-primary/80"
                    style={{ width: `${max > 0 ? (s.users / max) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-12 text-right text-sm font-medium">
                  {s.users.toLocaleString()}
                </span>
                <span
                  className={`w-14 text-right text-xs ${
                    dropPct !== null && dropPct > 0
                      ? "text-red-400"
                      : "text-gray-600"
                  }`}
                >
                  {dropPct !== null && dropPct !== 0
                    ? `${dropPct > 0 ? "−" : "+"}${Math.abs(dropPct)}%`
                    : ""}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
