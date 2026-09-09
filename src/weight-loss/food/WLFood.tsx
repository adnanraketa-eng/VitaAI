import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, Camera, Search, Utensils, Trash2, Check, 
  AlertCircle, ImagePlus, X 
} from 'lucide-react';
import { WLRepository } from '../data/WLRepository';
import { WLMealEntry } from '../data/WLTypes';

interface Props {
  initialMealType?: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  initialMode?: 'scan' | 'search' | 'gallery' | 'manual' | 'log';
  initialImage?: string | null;
  onClose: () => void;
  onMealAdded?: () => void;
}

export function WLFood({ 
  initialMealType = 'breakfast', 
  initialMode = 'manual', 
  initialImage = null,
  onClose,
  onMealAdded 
}: Props) {
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>(initialMealType);
  const [foodName, setFoodName] = useState('');
  const [caloriesInput, setCaloriesInput] = useState('');
  const [proteinInput, setProteinInput] = useState('');
  const [carbsInput, setCarbsInput] = useState('');
  const [fatInput, setFatInput] = useState('');
  const [notes, setNotes] = useState('');
  const [showSearchList, setShowSearchList] = useState(initialMode === 'search');
  
  // Attached Photo & Live Camera state
  const [capturedImage, setCapturedImage] = useState<string | null>(initialImage);
  const [isLiveCameraOpen, setIsLiveCameraOpen] = useState<boolean>(initialMode === 'scan');
  const [cameraError, setCameraError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const [todayMeals, setTodayMeals] = useState<WLMealEntry[]>(() => WLRepository.getTodayMeals());
  const [error, setError] = useState<string | null>(null);

  const stopCameraStream = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  };

  const startLiveCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        mediaStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } else {
        setCameraError('Direct camera streaming is unavailable on this device browser.');
      }
    } catch (err) {
      console.warn('Live camera stream error:', err);
      setCameraError('Camera access required. Please allow camera permissions or tap below.');
    }
  };

  // Trigger respective mode on entry
  useEffect(() => {
    if (initialMode === 'scan') {
      setIsLiveCameraOpen(true);
      startLiveCamera();
    } else if (initialMode === 'gallery') {
      if (!initialImage) {
        galleryInputRef.current?.click();
      }
    } else if (initialMode === 'search') {
      searchInputRef.current?.focus();
      setShowSearchList(true);
    }

    return () => {
      stopCameraStream();
    };
  }, [initialMode]);

  const handleCaptureFrame = () => {
    if (videoRef.current && videoRef.current.videoWidth > 0) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setCapturedImage(dataUrl);
          stopCameraStream();
          setIsLiveCameraOpen(false);
          return;
        }
      } catch (e) {
        console.warn('Canvas capture error:', e);
      }
    }
    // Fallback: trigger native device camera picker
    fileInputRef.current?.click();
  };

  // Common food database for search suggestions
  const FOOD_DATABASE: { name: string; cal: number; p: number; c: number; f: number }[] = [
    { name: 'Greek Yogurt with Berries (200g)', cal: 170, p: 18, c: 15, f: 2 },
    { name: 'Grilled Chicken Breast (150g)', cal: 240, p: 46, c: 0, f: 5 },
    { name: 'Quinoa & Veggie Bowl (250g)', cal: 320, p: 11, c: 54, f: 6 },
    { name: 'Hard Boiled Eggs (2 whole)', cal: 140, p: 12, c: 1, f: 10 },
    { name: 'Steel Cut Oatmeal with Chia (1 bowl)', cal: 260, p: 9, c: 45, f: 5 },
    { name: 'Salmon Fillet, Baked (160g)', cal: 340, p: 34, c: 0, f: 22 },
    { name: 'Avocado Toast with Sourdough (1 slice)', cal: 230, p: 6, c: 24, f: 12 },
    { name: 'Whey Protein Shake (1 scoop + water)', cal: 130, p: 25, c: 3, f: 2 },
    { name: 'Mixed Green Salad with Olive Oil (1 bowl)', cal: 160, p: 3, c: 8, f: 14 },
    { name: 'Apple with 1 tbsp Peanut Butter', cal: 190, p: 4, c: 26, f: 8 },
  ];

  const filteredSuggestions = foodName.trim()
    ? FOOD_DATABASE.filter((f) => f.name.toLowerCase().includes(foodName.toLowerCase()))
    : [];

  const handleSelectFood = (item: (typeof FOOD_DATABASE)[0]) => {
    setFoodName(item.name);
    setCaloriesInput(item.cal.toString());
    setProteinInput(item.p.toString());
    setCarbsInput(item.c.toString());
    setFatInput(item.f.toString());
    setShowSearchList(false);
  };

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setCapturedImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) {
      setError('Please provide a food name or title.');
      return;
    }
    const cal = parseInt(caloriesInput) || 0;
    const p = parseInt(proteinInput) || 0;
    const c = parseInt(carbsInput) || 0;
    const f = parseInt(fatInput) || 0;

    const newMeal = WLRepository.addMealEntry({
      type: mealType,
      name: foodName.trim(),
      calories: cal,
      proteinG: p,
      carbsG: c,
      fatG: f,
      serving: 'per 1 serving',
      notes: notes.trim() || undefined,
      photoUrl: capturedImage || undefined,
      aiStatus: 'Not analyzed',
    });

    setTodayMeals([newMeal, ...todayMeals]);
    onMealAdded?.();
    onClose();
  };

  const handleDeleteMeal = (id: string) => {
    WLRepository.deleteMealEntry(id);
    setTodayMeals((prev) => prev.filter((m) => m.id !== id));
    onMealAdded?.();
  };

  if (isLiveCameraOpen && !capturedImage) {
    return (
      <div className="fixed inset-0 bg-black text-white z-50 flex flex-col font-sans select-none animate-in fade-in duration-150">
        {/* Hidden fallback file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleImageCapture}
          className="hidden"
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageCapture}
          className="hidden"
        />

        {/* Top Header */}
        <div className="absolute top-0 inset-x-0 z-20 px-4 pt-4 pb-3 flex items-center justify-between bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <button
            type="button"
            onClick={() => {
              stopCameraStream();
              onClose();
            }}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#5EEAD4]">Live Camera</span>
            <h1 className="text-sm font-bold text-white">Scan Food</h1>
          </div>
          <div className="w-10" />
        </div>

        {/* Camera Viewport */}
        <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Viewfinder Reticle Overlay */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 border-2 border-white/40 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#1F7A5C] rounded-tl-2xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#1F7A5C] rounded-tr-2xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#1F7A5C] rounded-bl-2xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#1F7A5C] rounded-br-2xl" />
            </div>
            <p className="mt-4 text-xs font-semibold text-white/90 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 shadow-sm">
              Align meal or plate inside frame
            </p>
          </div>

          {/* Fallback / Permission Notice if camera stream error */}
          {cameraError && (
            <div className="absolute inset-x-6 top-24 bg-black/85 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-center z-30">
              <p className="text-xs text-amber-300 font-semibold mb-2">{cameraError}</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-[#1F7A5C] text-white text-xs font-bold rounded-xl hover:bg-[#15533E] transition-colors"
              >
                Use Device Camera App
              </button>
            </div>
          )}
        </div>

        {/* Bottom Shutter Controls */}
        <div className="relative z-20 px-6 pt-4 pb-8 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-around">
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-all"
            title="Choose from Gallery"
          >
            <ImagePlus className="w-5 h-5" />
          </button>

          {/* Large Shutter Button */}
          <button
            type="button"
            onClick={handleCaptureFrame}
            className="w-20 h-20 rounded-full border-4 border-white p-1 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg cursor-pointer"
            aria-label="Capture Food Photo"
          >
            <div className="w-full h-full rounded-full bg-[#1F7A5C] flex items-center justify-center shadow-inner">
              <Camera className="w-7 h-7 text-white" />
            </div>
          </button>

          <div className="w-12 h-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#F6FAF7] text-[#1B2B24] z-50 overflow-y-auto pb-20 font-sans selection:bg-[#1F7A5C] selection:text-white">
      {/* Hidden file inputs for Camera and Gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleImageCapture}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageCapture}
        className="hidden"
      />

      {/* Header */}
      <header className="sticky top-0 bg-[#F6FAF7]/95 backdrop-blur-md px-4 pt-4 pb-3 border-b border-[#DCE6E0] flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white border border-[#DCE6E0] flex items-center justify-center text-[#1B2B24] hover:bg-[#EFF6F1] transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A9A92]">Food & Nutrition</span>
            <h1 className="text-base font-bold text-[#1B2B24]">Meal Details</h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-[#DCE6E0] rounded-full text-xs font-bold text-[#1F7A5C] capitalize">
          <Utensils className="w-3.5 h-3.5" />
          <span>{mealType}</span>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Meal Type Selector */}
        <div className="grid grid-cols-4 gap-2">
          {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setMealType(t)}
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

        {/* Attached Photo Card (if photo captured/selected) */}
        {capturedImage && (
          <div className="relative bg-white rounded-3xl p-3 border border-[#DCE6E0] shadow-xs">
            <img
              src={capturedImage}
              alt="Meal Photo"
              className="w-full h-44 object-cover rounded-2xl"
            />
            <div className="absolute top-5 right-5 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  if (initialMode === 'gallery') {
                    galleryInputRef.current?.click();
                  } else {
                    setIsLiveCameraOpen(true);
                    startLiveCamera();
                  }
                }}
                className="bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-xs hover:bg-black/80 font-bold flex items-center gap-1"
              >
                <Camera className="w-3 h-3" />
                Retake
              </button>
              <button
                type="button"
                onClick={() => setCapturedImage(null)}
                className="bg-black/60 text-white p-1 rounded-full backdrop-blur-xs hover:bg-black/80"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* SINGLE REUSABLE MEAL DETAILS FORM */}
        <form onSubmit={handleSaveMeal} className="bg-white rounded-3xl p-5 border border-[#DCE6E0] shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#1B2B24]">Meal Details</h2>

          {error && (
            <div className="p-2.5 bg-[#FFF1E8] border border-[#FF8B5E]/30 rounded-xl text-xs text-[#C84A22] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-[#4C5F55] block mb-1">Food or Recipe Name</label>
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="e.g. Grilled Chicken Salad"
                value={foodName}
                onFocus={() => setShowSearchList(true)}
                onChange={(e) => {
                  setFoodName(e.target.value);
                  setShowSearchList(true);
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-sm font-semibold text-[#1B2B24] focus:outline-none focus:border-[#1F7A5C]"
              />
              <Search className="w-4 h-4 text-[#8A9A92] absolute left-3 top-3" />
            </div>

            {/* Food Search Suggestions */}
            {(filteredSuggestions.length > 0 || (showSearchList && !foodName.trim())) && (
              <div className="mt-1 bg-white border border-[#DCE6E0] rounded-2xl shadow-lg max-h-44 overflow-y-auto divide-y divide-[#E7EEE9]">
                <div className="px-3 py-1.5 bg-[#F6FAF7] text-[10px] font-bold uppercase text-[#8A9A92] tracking-wider">
                  {foodName.trim() ? 'Search Results' : 'Suggested Foods'}
                </div>
                {(filteredSuggestions.length > 0 ? filteredSuggestions : FOOD_DATABASE).map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleSelectFood(item)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-[#EFF6F1] flex items-center justify-between transition-colors"
                  >
                    <span className="font-medium text-[#1B2B24]">{item.name}</span>
                    <span className="text-[11px] text-[#8A9A92]">{item.cal} kcal · {item.p}g P</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Macro Inputs Grid */}
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-[#4C5F55] block mb-1">Calories</label>
              <input
                type="number"
                placeholder="kcal"
                value={caloriesInput}
                onChange={(e) => setCaloriesInput(e.target.value)}
                className="w-full px-2.5 py-2 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-xs font-bold text-[#1B2B24] focus:outline-none focus:border-[#1F7A5C]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#1F7A5C] block mb-1">Protein (g)</label>
              <input
                type="number"
                placeholder="g"
                value={proteinInput}
                onChange={(e) => setProteinInput(e.target.value)}
                className="w-full px-2.5 py-2 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-xs font-bold text-[#1B2B24] focus:outline-none focus:border-[#1F7A5C]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#2E8B8B] block mb-1">Carbs (g)</label>
              <input
                type="number"
                placeholder="g"
                value={carbsInput}
                onChange={(e) => setCarbsInput(e.target.value)}
                className="w-full px-2.5 py-2 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-xs font-bold text-[#1B2B24] focus:outline-none focus:border-[#1F7A5C]"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-[#FF8B5E] block mb-1">Fat (g)</label>
              <input
                type="number"
                placeholder="g"
                value={fatInput}
                onChange={(e) => setFatInput(e.target.value)}
                className="w-full px-2.5 py-2 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-xs font-bold text-[#1B2B24] focus:outline-none focus:border-[#1F7A5C]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#4C5F55] block mb-1">Notes (optional)</label>
            <input
              type="text"
              placeholder="e.g. Prepared with olive oil dressing"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-[#F6FAF7] border border-[#DCE6E0] rounded-xl text-xs text-[#1B2B24] focus:outline-none focus:border-[#1F7A5C]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#1F7A5C] text-white rounded-xl font-bold text-xs shadow-xs hover:bg-[#15533E] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            Log {mealType.toUpperCase()}
          </button>
        </form>

        {/* Today's Logged Items */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#1B2B24]">Today's Logged Food</h2>
            <span className="text-xs text-[#8A9A92]">{todayMeals.length} logged</span>
          </div>

          {todayMeals.length === 0 ? (
            <div className="bg-white rounded-3xl p-6 border border-[#DCE6E0] text-center space-y-1">
              <p className="text-xs font-bold text-[#1B2B24]">No meals logged today yet</p>
              <p className="text-[11px] text-[#8A9A92]">Add breakfast or lunch above to start tracking your daily calories.</p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-[#DCE6E0] shadow-xs divide-y divide-[#E7EEE9] overflow-hidden">
              {todayMeals.map((meal) => (
                <div key={meal.id} className="p-3.5 flex items-center justify-between hover:bg-[#F6FAF7] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-[#EFF6F1] text-[#1F7A5C] flex items-center justify-center shrink-0">
                      <Utensils className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1B2B24] capitalize">
                        <span className="text-[#1F7A5C] mr-1">[{meal.type}]</span> {meal.name}
                      </div>
                      <div className="text-[11px] text-[#8A9A92]">
                        {meal.calories} kcal · {meal.proteinG}g P · {meal.carbsG}g C · {meal.fatG}g F
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteMeal(meal.id)}
                    className="p-1.5 text-[#8A9A92] hover:text-[#D65A5A] rounded-lg transition-colors"
                    title="Delete meal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
