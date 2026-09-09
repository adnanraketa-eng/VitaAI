import React, { useState } from 'react';
import { User, Calendar, Ruler, Mail } from 'lucide-react';
import { 
  OnboardingScaffold, 
  OnboardingTextField, 
  OnboardingPrimaryButton,
  OnboardingStickyFooter 
} from '../components/OnboardingComponents';

interface Props {
  initialData: {
    fullName: string;
    email: string;
    dob: string;
    gender: string;
    heightCm: number;
    units: 'imperial' | 'metric';
  };
  onNext: (data: {
    fullName: string;
    email: string;
    dob: string;
    age: number;
    gender: string;
    heightCm: number;
  }) => void;
  onBack: () => void;
}

export function OnboardingPersonalDetailsScreen({
  initialData,
  onNext,
  onBack,
}: Props) {
  const [fullName, setFullName] = useState(initialData.fullName || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [dob, setDob] = useState(initialData.dob || '1992-09-14');
  const [gender, setGender] = useState(initialData.gender || 'Woman');
  const [heightCm, setHeightCm] = useState(initialData.heightCm || 168);
  const [unitMode, setUnitMode] = useState<'metric' | 'imperial'>(initialData.units || 'imperial');

  // Imperial height helper (feet & inches)
  const totalInches = Math.round((heightCm || 168) / 2.54);
  const [feet, setFeet] = useState(Math.floor(totalInches / 12));
  const [inches, setInches] = useState(totalInches % 12);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateAge = (dateString: string): number => {
    if (!dateString) return 30;
    const birthday = new Date(dateString);
    if (isNaN(birthday.getTime())) return 30;
    const ageDifMs = Date.now() - birthday.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const currentAge = calculateAge(dob);

  const handleValidateAndContinue = () => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) {
      errs.fullName = 'Please enter your full name';
    } else if (fullName.trim().length < 2) {
      errs.fullName = 'Name must be at least 2 characters';
    }

    if (!email.trim() || !email.includes('@')) {
      errs.email = 'Please enter a valid email address';
    }

    if (!dob) {
      errs.dob = 'Please select your date of birth';
    } else if (currentAge < 13 || currentAge > 120) {
      errs.dob = 'Please enter a realistic date of birth (age 13-120)';
    }

    let finalHeightCm = heightCm;
    if (unitMode === 'imperial') {
      const calcCm = Math.round(((feet * 12) + inches) * 2.54);
      if (calcCm < 90 || calcCm > 250) {
        errs.height = 'Please enter a valid height';
      }
      finalHeightCm = calcCm;
    } else {
      if (heightCm < 90 || heightCm > 250) {
        errs.height = 'Height must be between 90 cm and 250 cm';
      }
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    onNext({
      fullName: fullName.trim(),
      email: email.trim(),
      dob,
      age: currentAge,
      gender,
      heightCm: finalHeightCm,
    });
  };

  return (
    <OnboardingScaffold
      onBack={onBack}
      stepCurrent={1}
      stepTotal={8}
      title="Personal Details"
      subtitle="Your profile connects across all VitaAI modules, keeping your information centralized and private."
    >
      <div className="space-y-4 pb-6">
        {/* Full Name */}
        <OnboardingTextField
          label="Full Name"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
          }}
          placeholder="e.g. Maya Patel"
          error={errors.fullName}
        />

        {/* Email Address */}
        <OnboardingTextField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
          }}
          placeholder="e.g. maya@example.com"
          error={errors.email}
        />

        {/* Date of Birth & Auto Age */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#12324A] uppercase tracking-wider">
              Date of Birth
            </label>
            {currentAge > 0 && currentAge <= 120 && (
              <span className="text-[11px] font-bold text-[#39A982] bg-[#EAF8F2] px-2 py-0.5 rounded-full">
                {currentAge} years old
              </span>
            )}
          </div>
          <input
            type="date"
            value={dob}
            onChange={(e) => {
              setDob(e.target.value);
              if (errors.dob) setErrors((prev) => ({ ...prev, dob: '' }));
            }}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-3 bg-white rounded-xl border border-[#DCE7EE] text-sm text-[#12324A] focus:outline-none focus:border-[#1769AA]"
          />
          {errors.dob && (
            <p className="text-xs text-[#D95C5C] font-medium">{errors.dob}</p>
          )}
        </div>

        {/* Gender Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#12324A] uppercase tracking-wider">
            Biological Sex / Gender
          </label>
          <div className="grid grid-cols-2 gap-2">
            {['Woman', 'Man', 'Non-binary', 'Prefer not to say'].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                  gender === g
                    ? 'bg-[#1769AA] text-white border-[#1769AA] shadow-2xs'
                    : 'bg-white text-[#12324A] border-[#DCE7EE] hover:border-[#4DA3D9]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Height Input with Units Toggle */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-[#12324A] uppercase tracking-wider">
              Height
            </label>
            <div className="flex items-center bg-[#EAF5FB] p-0.5 rounded-lg border border-[#DCE7EE]">
              <button
                type="button"
                onClick={() => setUnitMode('imperial')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${
                  unitMode === 'imperial'
                    ? 'bg-white text-[#1769AA] shadow-2xs'
                    : 'text-[#536675]'
                }`}
              >
                ft / in
              </button>
              <button
                type="button"
                onClick={() => setUnitMode('metric')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded-md transition-all ${
                  unitMode === 'metric'
                    ? 'bg-white text-[#1769AA] shadow-2xs'
                    : 'text-[#536675]'
                }`}
              >
                cm
              </button>
            </div>
          </div>

          {unitMode === 'imperial' ? (
            <div className="grid grid-cols-2 gap-3">
              <OnboardingTextField
                label="Feet"
                type="number"
                min="3"
                max="8"
                value={feet}
                onChange={(e) => setFeet(Number(e.target.value))}
                suffix="ft"
              />
              <OnboardingTextField
                label="Inches"
                type="number"
                min="0"
                max="11"
                value={inches}
                onChange={(e) => setInches(Number(e.target.value))}
                suffix="in"
              />
            </div>
          ) : (
            <OnboardingTextField
              label="Centimeters"
              type="number"
              min="90"
              max="250"
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              suffix="cm"
              error={errors.height}
            />
          )}
        </div>
      </div>

      <OnboardingStickyFooter>
        <OnboardingPrimaryButton onClick={handleValidateAndContinue}>
          Continue
        </OnboardingPrimaryButton>
      </OnboardingStickyFooter>
    </OnboardingScaffold>
  );
}
