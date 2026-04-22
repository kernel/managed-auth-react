import { useState, type FormEvent, type ReactNode } from "react";
import { useSlot } from "../appearance/context";
import { useLocalization } from "../localization/context";
import { extractDomainName } from "../lib/profile-name";
import type {
  AppearanceLayout,
} from "../appearance/types";
import type {
  DiscoveredField,
  MFAOption,
  MFAType,
  SignInOption,
  SSOButton,
} from "../lib/types";
import { Button } from "./primitives/Button";
import { Input } from "./primitives/Input";
import { Label } from "./primitives/Label";
import { Divider } from "./Divider";
import { ErrorBanner } from "./ErrorBanner";
import { getSSOProviderInfo } from "./sso-provider";
import {
  ChevronRightIcon,
  EyeIcon,
  EyeOffIcon,
  FingerprintIcon,
  KeyIcon,
  MailIcon,
  PhoneIcon,
  ShieldCheckIcon,
  SmartphoneIcon,
} from "./icons";

interface UnifiedAuthFormProps {
  targetDomain: string;
  ssoProvider?: string | null;
  fields?: DiscoveredField[];
  ssoButtons?: SSOButton[];
  mfaOptions?: MFAOption[];
  signInOptions?: SignInOption[];
  onSubmitFields: (credentials: Record<string, string>) => void;
  onSSOClick: (ssoButton: SSOButton) => void;
  onMFASelect: (mfaType: MFAType) => void;
  onSignInOptionSelect: (optionId: string) => void;
  isLoading?: boolean;
  errorMessage?: string | null;
  layout?: AppearanceLayout;
}

function getMFAIcon(type: MFAType): ReactNode {
  switch (type) {
    case "sms":
      return <SmartphoneIcon />;
    case "call":
      return <PhoneIcon />;
    case "email":
      return <MailIcon />;
    case "totp":
      return <KeyIcon />;
    case "push":
      return <ShieldCheckIcon />;
    case "password":
      return <FingerprintIcon />;
    default:
      return <KeyIcon />;
  }
}

function getInputType(field: DiscoveredField): string {
  switch (field.type) {
    case "code":
    case "totp":
      return "text";
    default:
      return field.type;
  }
}

function getAutocomplete(field: DiscoveredField): string | undefined {
  const name = field.name.toLowerCase();
  switch (field.type) {
    case "email":
      return "email";
    case "password":
      return "current-password";
    case "tel":
      return "tel";
    case "code":
    case "totp":
      return "one-time-code";
    default:
      if (name.includes("user") || name.includes("identifier")) return "username";
      return undefined;
  }
}

export function UnifiedAuthForm({
  targetDomain,
  ssoProvider,
  fields = [],
  ssoButtons = [],
  mfaOptions = [],
  signInOptions = [],
  onSubmitFields,
  onSSOClick,
  onMFASelect,
  onSignInOptionSelect,
  isLoading = false,
  errorMessage,
  layout,
}: UnifiedAuthFormProps) {
  const slot = useSlot();
  const l = useLocalization();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const siteName = extractDomainName(targetDomain);
  const ssoProviderInfo = ssoProvider ? getSSOProviderInfo(ssoProvider) : null;

  const hasFields = fields.length > 0;
  const hasSSO = ssoButtons.length > 0;
  const hasMFA = mfaOptions.length > 0;
  const hasSignIn = signInOptions.length > 0;

  const onlySignIn = hasSignIn && !hasMFA && !hasFields && !hasSSO;
  const onlyMFA = hasMFA && !hasSignIn && !hasFields && !hasSSO;

  let title: ReactNode;
  let subtitle: string | undefined;

  if (onlySignIn) {
    title = l.signInSelectTitle;
    subtitle = l.signInSelectSubtitle;
  } else if (onlyMFA) {
    title = l.mfaSelectTitle;
    subtitle = l.mfaSelectSubtitle;
  } else if (ssoProviderInfo) {
    title = (
      <span className="kma-title__sso">
        {ssoProviderInfo.icon}
        <span>{l.ssoLoginTitle(ssoProviderInfo.label)}</span>
      </span>
    );
    subtitle = l.ssoLoginSubtitle(siteName);
  } else {
    title = l.loginTitle(siteName);
  }

  const socialsTop = layout?.socialButtonsPlacement === "top";

  const renderSignInOptions = () => (
    <div className="kma-options" data-kma-element="signInOption">
      {signInOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onSignInOptionSelect(option.id)}
          disabled={isLoading}
          {...slot("signInOption", "kma-button kma-button--secondary kma-option")}
        >
          <div className="kma-option__text">
            <div {...slot("signInOptionLabel", "kma-option__label")}>
              {option.label}
            </div>
            {option.description && (
              <div {...slot("signInOptionDescription", "kma-option__description")}>
                {option.description}
              </div>
            )}
          </div>
          <span
            {...slot("signInOptionChevron", "kma-option__chevron")}
            aria-hidden="true"
          >
            <ChevronRightIcon />
          </span>
        </button>
      ))}
    </div>
  );

  const renderMFAOptions = () => (
    <div className="kma-options">
      {mfaOptions.map((option, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onMFASelect(option.type)}
          disabled={isLoading}
          {...slot("mfaOption", "kma-button kma-button--secondary kma-option")}
        >
          <span {...slot("mfaOptionIcon", "kma-option__icon")} aria-hidden="true">
            {getMFAIcon(option.type)}
          </span>
          <div className="kma-option__text">
            <div {...slot("mfaOptionLabel", "kma-option__label")}>
              {option.label || l.mfaTypeLabels[option.type] || option.type}
            </div>
            {option.target && (
              <div {...slot("mfaOptionTarget", "kma-option__target")}>
                {option.target}
              </div>
            )}
            {option.description && (
              <div {...slot("mfaOptionDescription", "kma-option__description")}>
                {option.description}
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );

  const renderFields = () => (
    <form
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmitFields(formData);
      }}
      {...slot("form", "kma-form")}
    >
      {fields.map((field) => (
        <div key={field.name} {...slot("formField", "kma-form-field")}>
          <Label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="kma-label__required">*</span>}
          </Label>
          {field.type === "password" ? (
            <div {...slot("inputWrapper", "kma-input-wrapper")}>
              <Input
                id={field.name}
                name={field.name}
                type={showPassword[field.name] ? "text" : "password"}
                placeholder={field.placeholder}
                required={field.required}
                autoComplete={getAutocomplete(field)}
                value={formData[field.name] || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
                }
                className="kma-input--with-toggle"
              />
              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    [field.name]: !prev[field.name],
                  }))
                }
                tabIndex={-1}
                aria-label={showPassword[field.name] ? l.passwordHide : l.passwordShow}
                {...slot("passwordToggle", "kma-password-toggle")}
              >
                {showPassword[field.name] ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          ) : (
            <Input
              id={field.name}
              name={field.name}
              type={getInputType(field)}
              placeholder={field.placeholder}
              required={field.required}
              autoComplete={getAutocomplete(field)}
              value={formData[field.name] || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [field.name]: e.target.value }))
              }
            />
          )}
          {field.hint && (
            <p {...slot("inputHint", "kma-input-hint")}>{field.hint}</p>
          )}
        </div>
      ))}
      <Button type="submit" variant="primary" disabled={isLoading} className="kma-button--full">
        {isLoading ? l.submittingButton : l.submitButton}
      </Button>
    </form>
  );

  const renderSSO = () => (
    <div className="kma-options">
      {ssoButtons.map((sso, idx) => {
        const info = getSSOProviderInfo(sso.provider);
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onSSOClick(sso)}
            disabled={isLoading}
            {...slot("ssoButton", "kma-button kma-button--secondary kma-sso-button")}
          >
            {info.icon && (
              <span
                {...slot("ssoButtonIcon", "kma-sso-button__icon")}
                aria-hidden="true"
              >
                {info.icon}
              </span>
            )}
            <span {...slot("ssoButtonLabel", "kma-sso-button__label")}>
              {l.ssoButtonLabel(info.label)}
            </span>
          </button>
        );
      })}
    </div>
  );

  const sections: ReactNode[] = [];
  if (hasSignIn) sections.push(<div key="sign-in">{renderSignInOptions()}</div>);
  if (hasMFA) sections.push(<div key="mfa">{renderMFAOptions()}</div>);
  if (socialsTop && hasSSO) sections.push(<div key="sso">{renderSSO()}</div>);
  if (hasFields) sections.push(<div key="fields">{renderFields()}</div>);
  if (!socialsTop && hasSSO) sections.push(<div key="sso">{renderSSO()}</div>);

  return (
    <div className="kma-step">
      <div className="kma-step__header">
        <h1 {...slot("title", "kma-title")}>{title}</h1>
        {subtitle && <p {...slot("subtitle", "kma-subtitle")}>{subtitle}</p>}
      </div>

      {errorMessage && <ErrorBanner message={errorMessage} />}

      <div className="kma-sections">
        {sections.map((section, i) => (
          <div key={i} className="kma-sections__item">
            {i > 0 && <Divider />}
            {section}
          </div>
        ))}
      </div>

      <p {...slot("description", "kma-legal")}>{l.credentialSafetyNotice}</p>
    </div>
  );
}
