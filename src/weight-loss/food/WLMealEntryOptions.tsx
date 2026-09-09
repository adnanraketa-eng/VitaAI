import React from 'react';
import { ArrowLeft, Camera, Search, ImagePlus, Plus, ChevronRight, Utensils } from 'lucide-react';

interface Props {
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  onSelectMealType?: (type: 'breakfast' | 'lunch' | 'dinner' | 'snack') => void;
  onSelectOption: (option: 'scan' | 'search' | 'gallery' | 'manual', image?: string) => void;
  onBack: () => void;
}

export function WLMealEntryOptions({
  mealType,
  onSelectMealType,
  onSelectOption,
  onBack,
}: Props) {
  const galleryInputRef = React.useRef<HTMLInputElement>(null);

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onSelectOption('gallery', result);
    };
    reader.readAsDataURL(file);
  };
  return (
    <div className="fixed inset-0 bg-[#F6FAF7] text-[#1B2B24] z-50 overflow-y-auto pb-20 font-sans animate-in fade-in duration-200">
      {/* Header */}
      <header className="sticky top-0 bg-[#F6FAF7]/95 backdrop-blur-md px-4 pt-4 pb-3 border-b border-[#DCE6E0] flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white border border-[#DCE6E0] flex items-center justify-center text-[#1B2B24] hover:bg-[#EFF6F1] transition-colors"
            aria-label="Back to Weight Loss Home"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A9A92]">Food & Nutrition</span>
            <h1 className="text-base font-bold text-[#1B2B24]">Meal Entry</h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#DCE6E0] rounded-full text-xs font-bold text-[#1F7A5C] capitalize">
          <Utensils className="w-3.5 h-3.5" />
          <span>{mealType}</span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Meal Type Context Switcher */}
        {onSelectMealType && (
          <div className="grid grid-cols-4 gap-2">
            {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onSelectMealType(t)}
                className={`py-2 px-1 text-center rounded-2xl border text-xs font-bold capitalize transition-all ${
                  mealType === t
                    ? 'bg-[#1F7A5C] border-[#1F7A5C] text-white shadow-xs'
                    : 'bg-white border-[#DCE6E0] text-[#4C5F55] hover:bg-[#EFF6F1]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* The 4 Meal Entry Option Cards in Exact Requested Order */}
        <div className="space-y-3 pt-1">
          {/* Option 1: Scan Food (TOP / FIRST OPTION) */}
          <button
            type="button"
            onClick={() => onSelectOption('scan')}
            className="w-full bg-white rounded-3xl p-5 border border-[#E7EEE9] shadow-xs flex items-center justify-between text-left hover:border-[#1F7A5C] hover:shadow-sm active:scale-[0.99] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E8F4EE] flex items-center justify-center shrink-0">
                <Camera className="w-5 h-5 text-[#1F7A5C]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1B2B24] tracking-tight">Scan Food</h3>
                <p className="text-xs text-[#8A9A92] mt-0.5">Analyze food instantly</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8A9A92] group-hover:text-[#1B2B24] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>

          {/* Option 2: Search Food */}
          <button
            type="button"
            onClick={() => onSelectOption('search')}
            className="w-full bg-white rounded-3xl p-5 border border-[#E7EEE9] shadow-xs flex items-center justify-between text-left hover:border-[#1F7A5C] hover:shadow-sm active:scale-[0.99] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E8F4EE] flex items-center justify-center shrink-0">
                <Search className="w-5 h-5 text-[#1F7A5C]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1B2B24] tracking-tight">Search Food</h3>
                <p className="text-xs text-[#8A9A92] mt-0.5">Find a meal from our food database</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8A9A92] group-hover:text-[#1B2B24] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>

          {/* Option 3: Gallery / Add Photo */}
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="w-full bg-white rounded-3xl p-5 border border-[#E7EEE9] shadow-xs flex items-center justify-between text-left hover:border-[#1F7A5C] hover:shadow-sm active:scale-[0.99] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E8F4EE] flex items-center justify-center shrink-0">
                <ImagePlus className="w-5 h-5 text-[#1F7A5C]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1B2B24] tracking-tight">Gallery / Add Photo</h3>
                <p className="text-xs text-[#8A9A92] mt-0.5">Choose a photo from your gallery</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8A9A92] group-hover:text-[#1B2B24] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>

          {/* Hidden file input for native device gallery picker */}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            onChange={handleGalleryChange}
            className="hidden"
          />

          {/* Option 4: Manual */}
          <button
            type="button"
            onClick={() => onSelectOption('manual')}
            className="w-full bg-white rounded-3xl p-5 border border-[#E7EEE9] shadow-xs flex items-center justify-between text-left hover:border-[#7C3AED] hover:shadow-sm active:scale-[0.99] transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#E8F4EE] flex items-center justify-center shrink-0">
                <Plus className="w-5 h-5 text-[#7C3AED] stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1B2B24] tracking-tight">Manual</h3>
                <p className="text-xs text-[#8A9A92] mt-0.5">Enter meal details manually</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#8A9A92] group-hover:text-[#1B2B24] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
          </button>
        </div>
      </main>
    </div>
  );
}
