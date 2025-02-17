import clsx from 'clsx';

/** 
 * StepWizardSidebar: 
 * Renders a vertical or horizontal progress bar with 
 * the step names and highlighting the current step 
 */
function StepWizardSidebar({
  currentStep,
  steps,
}: {
  currentStep: number;
  steps: { number: number; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-2 md:gap-4">
      {steps.map((st) => {
        const isActive = st.number === currentStep;
        const isCompleted = st.number < currentStep;
        return (
          <div key={st.number} className="flex items-center gap-2">
            <div
              className={clsx(
                'w-4 h-4 rounded-full border-2 border-gray-300',
                isActive && 'border-blue-500 bg-blue-500',
                isCompleted && 'border-green-500 bg-green-500'
              )}
            />
            <span
              className={clsx(
                'text-sm',
                isActive && 'font-semibold text-blue-600',
                isCompleted && 'text-green-600 line-through'
              )}
            >
              {st.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}