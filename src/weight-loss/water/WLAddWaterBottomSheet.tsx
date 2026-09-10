import React, { useState, useEffect, useRef } from 'react';
import { Droplet, Plus, ArrowLeft } from 'lucide-react';
import { WLRepository } from '../data/WLRepository';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onWaterAdded: (amountL: number) => void;
}

export function WLAddWaterBottomSheet({ isOpen, onClose, onWaterAdded }: Props) {
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualAmountMl, setManualAmountMl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Touch handling for swipe-down to dismiss
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchCurrentY, setTouchCurrentY] = useState<number | null>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setIsManualMode(false);
      setManualAmountMl('');
      setErrorMessage(null);
      setIsSubmitting(false);
      setTouchStartY(null);
      setTouchCurrentY(null);
    }
  }, [isOpen]);

  // Handle ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectPreset = async (ml: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const amountL = ml / 1000;
    try {
      await WLRepository.addWater(amountL);
      onWaterAdded(amountL);
      onClose();
    } catch (err) {
      console.warn('Add water preset failed:', err);
      setErrorMessage('Failed to record water. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmed = manualAmountMl.trim();
    if (!trimmed) {
      setErrorMessage('Please enter an amount');
      return;
    }

    const ml = parseFloat(trimmed);
    if (isNaN(ml) || ml <= 0) {
      setErrorMessage('Please enter a valid amount greater than 0');
      return;
    }

    if (ml > 5000) {
      setErrorMessage('Amount cannot exceed 5000 ml per log');
      return;
    }

    setIsSubmitting(true);
    const amountL = parseFloat((ml / 1000).toFixed(3));
    try {
      await WLRepository.addWater(amountL);
      onWaterAdded(amountL);
      onClose();
    } catch (err) {
      console.warn('Add water manual failed:', err);
      setErrorMessage('Failed to record water. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Swipe-down touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY !== null) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - touchStartY;
      if (diff > 0) {
        setTouchCurrentY(diff);
      }
    }
  };

  const handleTouchEnd = () => {
    if (touchCurrentY && touchCurrentY > 100) {
      onClose();
    }
    setTouchStartY(null);
    setTouchCurrentY(null);
  };

  const translateY = touchCurrentY && touchCurrentY > 0 ? `${touchCurrentY}px` : '0px';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Dimmed Background Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-[1px] transition-opacity duration-300 animate-in fade-in"
        aria-hidden="true"
      />

      {/* White Rounded Bottom Sheet */}
      <div
        ref={sheetRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ transform: `translateY(${translateY})` }}
        className="relative w-full max-w-md bg-white rounded-t-[32px] shadow-2xl z-10 overflow-hidden pb-9 pt-3 px-5 animate-in slide-in-from-bottom duration-300 ease-out border-t border-[#E5E7EB]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-water-sheet-title"
      >
        {/* Centered Drag Handle */}
        <div className="flex justify-center pb-4 pt-1 cursor-grab active:cursor-grabbing">
          <div 
            className="w-12 h-1 bg-[#334155] rounded-full"
            aria-label="Drag handle to dismiss sheet"
          />
        </div>

        {/* Title */}
        <div className="pt-1 pb-4 px-1">
          <h2 
            id="add-water-sheet-title"
            className="text-xl font-bold text-[#0F172A] tracking-tight text-left"
          >
            Add Water
          </h2>
        </div>

        {/* Content: Presets or Manual */}
        {!isManualMode ? (
          <div className="space-y-3 px-1">
            {/* 100 ml */}
            <button
              type="button"
              onClick={() => handleSelectPreset(100)}
              disabled={isSubmitting}
              className="w-full flex items-center h-14 px-4 bg-[#F8F7FE] hover:bg-[#F1EEFD] active:scale-[0.99] border border-[#E7E2FA] rounded-2xl transition-all text-left group"
            >
              <div className="w-7 flex items-center justify-start shrink-0">
                <Droplet className="w-5 h-5 text-[#2563EB] fill-[#2563EB]" />
              </div>
              <span className="text-base font-semibold text-[#0F172A] ml-2">
                100 ml
              </span>
            </button>

            {/* 200 ml */}
            <button
              type="button"
              onClick={() => handleSelectPreset(200)}
              disabled={isSubmitting}
              className="w-full flex items-center h-14 px-4 bg-[#F8F7FE] hover:bg-[#F1EEFD] active:scale-[0.99] border border-[#E7E2FA] rounded-2xl transition-all text-left group"
            >
              <div className="w-7 flex items-center justify-start shrink-0">
                <Droplet className="w-5 h-5 text-[#2563EB] fill-[#2563EB]" />
              </div>
              <span className="text-base font-semibold text-[#0F172A] ml-2">
                200 ml
              </span>
            </button>

            {/* 250 ml */}
            <button
              type="button"
              onClick={() => handleSelectPreset(250)}
              disabled={isSubmitting}
              className="w-full flex items-center h-14 px-4 bg-[#F8F7FE] hover:bg-[#F1EEFD] active:scale-[0.99] border border-[#E7E2FA] rounded-2xl transition-all text-left group"
            >
              <div className="w-7 flex items-center justify-start shrink-0">
                <Droplet className="w-5 h-5 text-[#2563EB] fill-[#2563EB]" />
              </div>
              <span className="text-base font-semibold text-[#0F172A] ml-2">
                250 ml
              </span>
            </button>

            {/* 300 ml */}
            <button
              type="button"
              onClick={() => handleSelectPreset(300)}
              disabled={isSubmitting}
              className="w-full flex items-center h-14 px-4 bg-[#F8F7FE] hover:bg-[#F1EEFD] active:scale-[0.99] border border-[#E7E2FA] rounded-2xl transition-all text-left group"
            >
              <div className="w-7 flex items-center justify-start shrink-0">
                <Droplet className="w-5 h-5 text-[#2563EB] fill-[#2563EB]" />
              </div>
              <span className="text-base font-semibold text-[#0F172A] ml-2">
                300 ml
              </span>
            </button>

            {/* Manual */}
            <button
              type="button"
              onClick={() => setIsManualMode(true)}
              disabled={isSubmitting}
              className="w-full flex items-center h-14 px-4 bg-white hover:bg-[#FAF8FD] active:scale-[0.99] border border-[#E7E2FA] rounded-2xl transition-all text-left group"
            >
              <div className="w-7 flex items-center justify-start shrink-0">
                <Plus className="w-5 h-5 text-[#7C3AED] stroke-[2.5]" />
              </div>
              <span className="text-base font-semibold text-[#7C3AED] ml-2">
                Manual
              </span>
            </button>
          </div>
        ) : (
          /* Manual Water Entry Form */
          <form onSubmit={handleManualSubmit} className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#475569]">
                Enter water amount
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsManualMode(false);
                  setErrorMessage(null);
                }}
                className="text-xs font-semibold text-[#7C3AED] hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to presets
              </button>
            </div>

            <div className="relative">
              <input
                type="number"
                step="any"
                min="1"
                max="5000"
                value={manualAmountMl}
                onChange={(e) => {
                  setManualAmountMl(e.target.value);
                  setErrorMessage(null);
                }}
                placeholder="e.g. 350"
                autoFocus
                className="w-full h-14 pl-4 pr-14 bg-[#F8FAFC] border border-[#CBD5E1] rounded-2xl text-lg font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:bg-white transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#64748B]">
                ml
              </span>
            </div>

            {errorMessage && (
              <p className="text-xs text-[#DC2626] font-medium">{errorMessage}</p>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsManualMode(false);
                  setErrorMessage(null);
                }}
                className="flex-1 h-13 rounded-2xl border border-[#CBD5E1] text-[#475569] font-bold text-sm hover:bg-[#F1F5F9] transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-13 rounded-2xl bg-[#7C3AED] hover:bg-[#6D28D9] active:scale-[0.99] disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Droplet className="w-4 h-4 fill-white" />
                <span>Add Water</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
