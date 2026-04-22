import { useSlot } from "../appearance/context";
import { SpinnerIcon } from "./icons";

interface LoadingStateProps {
  message: string;
}

export function LoadingState({ message }: LoadingStateProps) {
  const slot = useSlot();
  return (
    <div className="kma-step kma-step--center kma-loading">
      <div className="kma-step__icon-wrap">
        <span {...slot("spinner", "kma-spinner")}>
          <SpinnerIcon />
        </span>
      </div>
      <p {...slot("loadingText", "kma-loading-text")}>{message}</p>
    </div>
  );
}
