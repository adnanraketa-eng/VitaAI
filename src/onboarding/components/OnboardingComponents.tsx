import { ReactNode, ChangeEvent } from 'react';
import { ChevronLeft, Check, AlertCircle } from 'lucide-react';

interface ScaffoldProps {
  children: ReactNode;
  onBack?: () => void;
  showBack?: boolean;
  stepCurrent?: number;
  stepTotal?: number;
  title?: string;
  subtitle?: string;
}

export function OnboardingScaffold({
  children,
  onBack,
  showBack = true,
  stepCurrent,
  stepTotal,
  title,
  subtitle,
}: ScaffoldProps) {
  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#12324A] flex flex-col justify-between font-sans selection:bg-[#1769AA] selection:text-white">
      {/* Header with back button & progress */}
      <header className="px-5 pt-4 pb-2 sticky top-0 bg-[#F7FAFC]/95 backdrop-blur-md z-20 border-b border-[#DCE7EE]/70">
        <div className="flex items-center justify-between min-h-[40px]">
          {showBack && onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1 text-xs font-semibold text-[#536675] hover:text-[#1769AA] p-1.5 -ml-1.5 rounded-xl hover:bg-[#EAF5FB] transition-colors"
              aria-label="Go back"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[#1769AA] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                V
              </div>
              <span className="font-bold text-sm text-[#12324A] tracking-tight">VitaAI</span>
            </div>
          )}

          {stepCurrent && stepTotal ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-[#536675]">
                Step {stepCurrent} of {stepTotal}
              </span>
            </div>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#39A982] bg-[#EAF8F2] px-2 py-0.5 rounded-full">
              Wellness
            </span>
          )}
        </div>

        {/* Linear Step Bar */}
        {stepCurrent && stepTotal && (
          <div className="w-full bg-[#DCE7EE] h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-[#1769AA] h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(stepCurrent / stepTotal) * 100}%` }}
            />
          </div>
        )}
      </header>

      {/* Main scrollable body */}
      <main className="flex-1 max-w-md w-full mx-auto px-5 py-5 overflow-y-auto">
        {(title || subtitle) && (
          <div className="mb-6 space-y-1.5">
            {title && <h1 className="text-xl font-extrabold tracking-tight text-[#12324A]">{title}</h1>}
            {subtitle && <p className="text-xs text-[#536675] leading-relaxed">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
}

export interface SelectionCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  selected: boolean;
  onClick: () => void;
  badge?: string;
}

export function OnboardingSelectionCard({
  title,
  description,
  icon,
  selected,
  onClick,
  badge,
}: SelectionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-start justify-between gap-3 ${
        selected
          ? 'bg-[#EAF5FB] border-[#1769AA] ring-2 ring-[#1769AA]/20 shadow-xs'
          : 'bg-white border-[#DCE7EE] hover:border-[#4DA3D9] hover:bg-[#F7FAFC] shadow-2xs'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
              selected ? 'bg-[#1769AA] text-white' : 'bg-[#EAF5FB] text-[#1769AA]'
            }`}
          >
            {icon}
          </div>
        )}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#12324A]">
              {title}
            </h3>
            {badge && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF8F2] text-[#39A982]">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-[#536675] leading-relaxed">{description}</p>
        </div>
      </div>

      <div
        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
          selected
            ? 'bg-[#1769AA] border-[#1769AA] text-white'
            : 'border-[#DCE7EE] bg-white'
        }`}
      >
        {selected && <Check className="w-3 h-3 stroke-[3]" />}
      </div>
    </button>
  );
}

export interface OptionChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
}

export function OnboardingOptionChip({
  label,
  selected,
  onClick,
  icon,
}: OptionChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
        selected
          ? 'bg-[#1769AA] text-white border-[#1769AA] shadow-2xs'
          : 'bg-white text-[#12324A] border-[#DCE7EE] hover:border-[#1769AA]/40'
      }`}
    >
      {icon && <span className={selected ? 'text-white' : 'text-[#1769AA]'}>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

export interface TextFieldProps {
  label: string;
  value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  error?: string;
  helperText?: string;
  suffix?: string;
  className?: string;
}

export function OnboardingTextField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  min,
  max,
  step,
  error,
  helperText,
  suffix,
  className = '',
}: TextFieldProps) {
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-[#12324A] uppercase tracking-wider">
          {label}
        </label>
        {helperText && !error && (
          <span className="text-[11px] text-[#536675]">{helperText}</span>
        )}
      </div>

      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          className={`w-full px-4 py-3 bg-white rounded-xl border text-sm text-[#12324A] placeholder-[#536675]/50 focus:outline-none focus:ring-2 focus:ring-[#1769AA]/20 transition-all ${
            error
              ? 'border-[#D95C5C] focus:border-[#D95C5C]'
              : 'border-[#DCE7EE] focus:border-[#1769AA]'
          } ${suffix ? 'pr-12' : ''} ${className}`}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#536675]">
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-[#D95C5C] font-medium pt-0.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

interface PrimaryButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
  icon?: ReactNode;
}

export function OnboardingPrimaryButton({
  onClick,
  disabled,
  loading,
  children,
  icon,
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full py-3.5 px-6 rounded-2xl bg-[#1769AA] text-white text-sm font-bold shadow-xs hover:bg-[#12558A] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          <span>{children}</span>
          {icon}
        </>
      )}
    </button>
  );
}

export function OnboardingStickyFooter({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 bg-[#F7FAFC]/95 backdrop-blur-md border-t border-[#DCE7EE] px-5 py-4 max-w-md w-full mx-auto">
      {children}
    </div>
  );
}
