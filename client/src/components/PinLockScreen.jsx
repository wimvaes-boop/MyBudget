import React, { useState, useEffect } from 'react';
import { Shield, Delete, Lock, Unlock, AlertCircle } from 'lucide-react';

export default function PinLockScreen({ onUnlock, correctPin }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === correctPin || !correctPin) {
        onUnlock();
      } else {
        setError(true);
        setShake(true);
        setTimeout(() => {
          setPin('');
          setShake(false);
        }, 600);
      }
    }
  }, [pin, correctPin, onUnlock]);

  const handleDigit = (digit) => {
    if (pin.length < 4) {
      setError(false);
      setPin(prev => prev + digit);
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center justify-between py-12 px-6 text-white select-none">
      {/* Top Header */}
      <div className="flex flex-col items-center mt-6">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/10 backdrop-blur-md">
          <Shield className="w-8 h-8 text-emerald-400" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-100">MyBudget Beveiligd</h1>
        <p className="text-sm text-slate-400 mt-1">Voer je 4-cijferige pincode in</p>
      </div>

      {/* PIN Dots */}
      <div className={`flex gap-5 my-8 ${shake ? 'animate-bounce' : ''}`}>
        {[0, 1, 2, 3].map((index) => {
          const filled = pin.length > index;
          return (
            <div
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-200 ${
                error
                  ? 'bg-rose-500 scale-110 shadow-lg shadow-rose-500/40'
                  : filled
                  ? 'bg-emerald-400 scale-125 shadow-lg shadow-emerald-400/50'
                  : 'border-2 border-slate-600 bg-transparent'
              }`}
            />
          );
        })}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium -mt-4 mb-4">
          <AlertCircle className="w-4 h-4" />
          <span>Onjuiste pincode, probeer opnieuw</span>
        </div>
      )}

      {/* Number Pad (iPhone style) */}
      <div className="grid grid-cols-3 gap-6 w-full max-w-xs mb-4">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleDigit(num.toString())}
            className="w-18 h-18 rounded-full bg-slate-800/80 hover:bg-slate-700/80 active:bg-emerald-600/60 active:scale-95 text-2xl font-semibold text-slate-100 transition-all flex items-center justify-center border border-slate-700/50 shadow-sm"
          >
            {num}
          </button>
        ))}
        <div className="w-18 h-18 flex items-center justify-center"></div>
        <button
          type="button"
          onClick={() => handleDigit('0')}
          className="w-18 h-18 rounded-full bg-slate-800/80 hover:bg-slate-700/80 active:bg-emerald-600/60 active:scale-95 text-2xl font-semibold text-slate-100 transition-all flex items-center justify-center border border-slate-700/50 shadow-sm"
        >
          0
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="w-18 h-18 rounded-full active:bg-slate-700/50 active:scale-95 text-slate-400 hover:text-white transition-all flex items-center justify-center"
        >
          <Delete className="w-6 h-6" />
        </button>
      </div>

      {/* Footer info */}
      <div className="text-xs text-slate-500 flex items-center gap-1">
        <Lock className="w-3.5 h-3.5" />
        <span>Versleuteld op je NUC via Tailscale</span>
      </div>
    </div>
  );
}
