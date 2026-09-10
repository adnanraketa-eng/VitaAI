import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { supabase } from '../core/supabase';

type AuthMode = 'signin' | 'signup';

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setErrorMessage(null);
    setInfoMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (mode === 'signup' && !fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password,
        });

        if (error) {
          setErrorMessage(error.message || 'Failed to sign in. Please verify your credentials.');
        }
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (error) {
          setErrorMessage(error.message || 'Failed to create account. Please try again.');
        } else if (!data.session && data.user) {
          // If Supabase project requires email confirmation
          setInfoMessage('Account created successfully! Please check your email to confirm your account, then sign in.');
          setMode('signin');
          setPassword('');
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected authentication error occurred.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] text-[#12324A] flex flex-col justify-between font-sans selection:bg-[#1769AA] selection:text-white">
      {/* Top Brand Bar */}
      <header className="px-6 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-[#1769AA] text-white flex items-center justify-center font-black text-sm shadow-xs">
            V
          </div>
          <div>
            <span className="font-extrabold text-base text-[#12324A] tracking-tight block">VitaAI</span>
            <span className="text-[10px] font-semibold text-[#536675] -mt-0.5 block">
              Personalized Health & Wellness
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold text-[#1769AA] bg-[#EAF5FB] px-2.5 py-1 rounded-full border border-[#DCE7EE]">
          Secure Session
        </span>
      </header>

      {/* Main Authentication Card */}
      <main className="flex-1 max-w-md w-full mx-auto px-6 py-4 flex flex-col justify-center space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-black tracking-tight text-[#12324A]">
            {mode === 'signin' ? 'Sign In to VitaAI' : 'Create Your Account'}
          </h1>
          <p className="text-xs text-[#536675] max-w-xs mx-auto leading-relaxed">
            {mode === 'signin'
              ? 'Access your personalized health dashboard, weight progress, and AI coaching.'
              : 'Join VitaAI to unlock unified nutrition, weight management, and health insights.'}
          </p>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex bg-[#EAF2F6] p-1 rounded-2xl border border-[#DCE7EE]">
          <button
            type="button"
            id="auth-tab-signin"
            onClick={() => handleSwitchMode('signin')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signin'
                ? 'bg-white text-[#1769AA] shadow-xs'
                : 'text-[#536675] hover:text-[#12324A]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            id="auth-tab-signup"
            onClick={() => handleSwitchMode('signup')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'signup'
                ? 'bg-white text-[#1769AA] shadow-xs'
                : 'text-[#536675] hover:text-[#12324A]'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div
            id="auth-error-banner"
            className="p-3.5 bg-[#FFF4F2] border border-[#FADBD8] rounded-2xl flex items-start gap-2.5 text-[#B93826] text-xs leading-relaxed"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#B93826]" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Info / Success Notification */}
        {infoMessage && (
          <div
            id="auth-info-banner"
            className="p-3.5 bg-[#EAF8F2] border border-[#C5E9D8] rounded-2xl flex items-start gap-2.5 text-[#1F7A5C] text-xs leading-relaxed"
          >
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#1F7A5C]" />
            <div className="flex-1 font-medium">{infoMessage}</div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label
                htmlFor="auth-fullname-input"
                className="text-xs font-bold text-[#12324A] flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-[#536675]" />
                Full Name
              </label>
              <input
                id="auth-fullname-input"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Maya Patel"
                required
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#DCE7EE] text-sm text-[#12324A] placeholder:text-[#8A9A92] focus:outline-none focus:border-[#1769AA] focus:ring-1 focus:ring-[#1769AA] transition-colors disabled:opacity-50"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="auth-email-input"
              className="text-xs font-bold text-[#12324A] flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#536675]" />
              Email Address
            </label>
            <input
              id="auth-email-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              disabled={isSubmitting}
              className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#DCE7EE] text-sm text-[#12324A] placeholder:text-[#8A9A92] focus:outline-none focus:border-[#1769AA] focus:ring-1 focus:ring-[#1769AA] transition-colors disabled:opacity-50"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="auth-password-input"
              className="text-xs font-bold text-[#12324A] flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-[#536675]" />
              Password
            </label>
            <div className="relative">
              <input
                id="auth-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                disabled={isSubmitting}
                className="w-full px-3.5 py-2.5 bg-white rounded-xl border border-[#DCE7EE] text-sm text-[#12324A] placeholder:text-[#8A9A92] focus:outline-none focus:border-[#1769AA] focus:ring-1 focus:ring-[#1769AA] transition-colors disabled:opacity-50 pr-10"
              />
              <button
                type="button"
                id="auth-toggle-password-visibility"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#536675] hover:text-[#12324A]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {mode === 'signup' && (
              <p className="text-[10px] text-[#536675]">Minimum 6 characters</p>
            )}
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            disabled={isSubmitting}
            className="w-full py-3.5 px-7 bg-[#1769AA] hover:bg-[#13568C] text-white rounded-2xl font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security / Privacy Trust Pill */}
        <div className="p-3 bg-white rounded-2xl border border-[#DCE7EE] flex items-center gap-3 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-[#EAF8F2] text-[#39A982] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#12324A]">Encrypted Session</div>
            <div className="text-[10px] text-[#536675]">
              Real authentication powered securely by Supabase.
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="px-6 py-4 text-center text-[11px] text-[#536675] border-t border-[#DCE7EE] bg-white/80 backdrop-blur-xs max-w-md w-full mx-auto">
        {mode === 'signin' ? (
          <p>
            Don't have an account?{' '}
            <button
              type="button"
              id="auth-switch-to-signup"
              onClick={() => handleSwitchMode('signup')}
              className="font-bold text-[#1769AA] hover:underline"
            >
              Sign up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <button
              type="button"
              id="auth-switch-to-signin"
              onClick={() => handleSwitchMode('signin')}
              className="font-bold text-[#1769AA] hover:underline"
            >
              Sign in
            </button>
          </p>
        )}
      </footer>
    </div>
  );
}
