import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Cake, ChevronLeft, ChevronRight, Volume2, VolumeX, PartyPopper } from 'lucide-react';

// --- Magical Components ---

const FloatingHearts = ({ intense = false }) => (
  <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
    {[...Array(intense ? 40 : 15)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute text-pink-400/40"
        initial={{ x: Math.random() * 100 + '%', y: '110%', rotate: 0 }}
        animate={{ y: '-10%', rotate: 360, opacity: [0, 0.6, 0] }}
        transition={{ duration: Math.random() * 8 + 7, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 5 }}
      >
        <Heart size={Math.random() * 20 + 10} fill="currentColor" />
      </motion.div>
    ))}
  </div>
);

// --- Main Application ---

export default function App() {
  const [step, setStep] = useState<'intro' | 'slides' | 'final'>('intro');
  const [slideIndex, setSlideIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showCake, setShowCake] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState([false, false, false]);
  const [allCandlesBlown, setAllCandlesBlown] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const slides = [
    { image: 'photo1.jpg', title: 'How It Started 💫' },
    { image: 'photo2.jpg', title: 'Beautiful Moments 🌸' },
    { image: 'photo3.jpg', title: 'You Are My Happiness ❤️' },
    { image: 'photo4.jpg', title: 'Happy Birthday ❤️' },
  ];

  const handleStart = () => {
    setStep('slides');
    audioRef.current?.play().catch(() => {});
  };

  const handleBlowCandle = (i: number) => {
    if (candlesBlown[i]) return;
    const newBlown = [...candlesBlown];
    newBlown[i] = true;
    setCandlesBlown(newBlown);
    if (newBlown.every(b => b)) setTimeout(() => setAllCandlesBlown(true), 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden selection:bg-pink-500">
      <audio ref={audioRef} src="music.mp3" loop />
      <div className="fixed inset-0 bg-gradient-to-br from-rose-950 via-black to-indigo-950 z-[-1]" />
      <FloatingHearts intense={allCandlesBlown} />

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div key="intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-screen flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-3xl md:text-6xl font-light mb-8 text-transparent bg-clip-text bg-gradient-to-r from-rose-200 to-pink-400">
              Tonight is not just a night ✨
            </h1>
            <button onClick={handleStart} className="px-10 py-4 rounded-full bg-rose-500 text-white font-medium text-lg shadow-xl">
              Tap to Begin 💖
            </button>
          </motion.div>
        )}

        {step === 'slides' && (
          <motion.div key="slides" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen w-full relative">
            <img src={slides[slideIndex].image} className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center text-center p-8">
              <h2 className="text-4xl md:text-7xl font-serif italic">{slides[slideIndex].title}</h2>
            </div>
            <div className="absolute bottom-12 w-full flex justify-center gap-8">
              <button onClick={() => slideIndex > 0 ? setSlideIndex(slideIndex - 1) : setStep('intro')} className="p-4 rounded-full bg-white/10"><ChevronLeft size={32}/></button>
              <button onClick={() => slideIndex < slides.length - 1 ? setSlideIndex(slideIndex + 1) : setStep('final')} className="p-4 rounded-full bg-white/10"><ChevronRight size={32}/></button>
            </div>
          </motion.div>
        )}

        {step === 'final' && (
          <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-screen flex flex-col items-center justify-center px-6">
            {!allCandlesBlown ? (
              <div className="flex flex-col items-center">
                <h2 className="text-3xl md:text-5xl mb-12 text-rose-200">Tonight is all about you ❤️</h2>
                <button onClick={() => setShowCake(true)} className="px-8 py-3 rounded-full bg-amber-500 text-white flex items-center gap-2 mb-12">
                  <Cake size={20} /> Show Cake
                </button>
                {showCake && (
                  <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative flex flex-col items-center">
                    {/* Enhanced Cake UI */}
                    <div className="w-48 h-24 bg-rose-100 rounded-t-3xl relative shadow-2xl z-10">
                      <div className="absolute top-0 left-0 right-0 h-6 bg-rose-200 rounded-t-3xl" />
                      <div className="absolute -top-12 left-0 right-0 flex justify-center gap-8">
                        {candlesBlown.map((blown, i) => (
                          <div key={i} onClick={() => handleBlowCandle(i)} className="relative cursor-pointer">
                            <div className="w-3 h-12 bg-indigo-400 rounded-full" />
                            {!blown && <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity }} className="absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-8 bg-orange-500 rounded-full shadow-[0_0_15px_orange]" />}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="w-64 h-4 bg-white/20 rounded-full mt-2" />
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="text-center max-w-2xl">
                <h1 className="text-4xl md:text-6xl font-serif italic text-rose-300 mb-6">Happy Birthday ❤️</h1>
                <p className="text-xl font-light">May your life be filled with love, dreams and magic ✨</p>
                <button onClick={() => window.location.reload()} className="mt-12 px-8 py-3 rounded-full border border-white/20 text-white/50">Replay</button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}