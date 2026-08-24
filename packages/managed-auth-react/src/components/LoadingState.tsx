import { useEffect, useState, type ReactNode } from "react";
import { useSlot } from "../appearance/context";
import { useLocalization } from "../localization/context";
import {
  BrainIcon,
  GlobeIcon,
  KeyIcon,
  LockIcon,
  SearchIcon,
  ShieldCheckIcon,
  SpinnerIcon,
} from "./icons";

interface LoadingStateProps {
  message: string;
  variant?: "initializing" | "discovering" | "authenticating";
}

const INITIALIZING_ICONS: Array<(props: { className?: string }) => ReactNode> =
  [LockIcon];
const DISCOVERY_ICONS: Array<(props: { className?: string }) => ReactNode> = [
  GlobeIcon,
  SearchIcon,
  BrainIcon,
];
const AUTH_ICONS: Array<(props: { className?: string }) => ReactNode> = [
  KeyIcon,
  LockIcon,
  ShieldCheckIcon,
];
const STEP_INTERVAL_MS = 6000;

export function LoadingState({
  message,
  variant = "discovering",
}: LoadingStateProps) {
  const slot = useSlot();
  const l = useLocalization();
  const [currentStep, setCurrentStep] = useState(0);

  let steps: string[];
  let icons: Array<(props: { className?: string }) => ReactNode>;
  if (variant === "initializing") {
    steps = [l.initializingStep];
    icons = INITIALIZING_ICONS;
  } else if (variant === "discovering") {
    steps = l.loadingDiscoverySteps;
    icons = DISCOVERY_ICONS;
  } else {
    steps = l.loadingAuthSteps;
    icons = AUTH_ICONS;
  }
  const stepCount = Math.min(steps.length, icons.length);

  useEffect(() => {
    setCurrentStep(0);
    if (stepCount <= 1) return;
    const id = setInterval(() => {
      setCurrentStep((prev) => (prev < stepCount - 1 ? prev + 1 : prev));
    }, STEP_INTERVAL_MS);
    return () => clearInterval(id);
  }, [stepCount, variant]);

  const CurrentIcon = icons[Math.min(currentStep, icons.length - 1)];

  return (
    <div className="kma-step kma-step--center kma-loading">
      <div className="kma-step__icon-wrap">
        <div className="kma-loading__spinner-wrap">
          <span {...slot("spinner", "kma-spinner kma-spinner--lg")}>
            <SpinnerIcon />
          </span>
          <span className="kma-loading__inner-icon">
            <CurrentIcon />
          </span>
        </div>
      </div>

      <div className="kma-step__header">
        <h2 {...slot("loadingText", "kma-loading-title")}>{message}</h2>
        <p className="kma-loading-step">{steps[currentStep]}</p>
      </div>

      {stepCount > 1 && (
        <div className="kma-loading-dots" aria-hidden="true">
          {Array.from({ length: stepCount }).map((_, i) => (
            <span
              key={i}
              className={
                "kma-loading-dot" +
                (i === currentStep ? " kma-loading-dot--active" : "")
              }
            />
          ))}
        </div>
      )}

      {variant !== "initializing" && (
        <p className="kma-loading-hint">{l.loadingTimeHint}</p>
      )}
    </div>
  );
}
