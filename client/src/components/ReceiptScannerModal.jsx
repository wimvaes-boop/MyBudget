import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Loader2, Sparkles, AlertCircle, RefreshCw, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { createWorker } from 'tesseract.js';
import { parseReceiptText } from '../services/receiptParser';
import DynamicIcon from './DynamicIcon';
import { formatCurrency } from '../services/formatters';

export default function ReceiptScannerModal({ isOpen, onClose, onSave, categories = [] }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [showRawText, setShowRawText] = useState(false);
  const [error, setError] = useState(null);

  // Form states after parse
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('bank');

  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  if (!isOpen) return null;

  const expenseCategories = categories.filter(c => c.type === 'expense');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const previewUrl = URL.createObjectURL(file);
    setImageSrc(previewUrl);
    await processImage(file);
  };

  const processImage = async (imageFile) => {
    setIsScanning(true);
    setScanProgress(10);
    setStatusMessage('Kassaticket laden & initialiseren...');
    setError(null);

    let worker = null;
    try {
      // Initialize Tesseract Worker
      worker = await createWorker('nld+fra+eng');
      
      setScanProgress(40);
      setStatusMessage('Tekst, bedrag en winkel herkennen...');

      const ret = await worker.recognize(imageFile);
      const text = ret.data.text;

      setScanProgress(85);
      setStatusMessage('Slimme categorie en gegevens koppelen...');

      const result = parseReceiptText(text, categories);

      setAmount(result.amount);
      setCategoryId(result.categoryId);
      setNote(result.note);
      setDate(result.date);
      setPaymentMethod(result.paymentMethod);
      setParsedData(result);

      setScanProgress(100);
      setStatusMessage('Scan voltooid!');
    } catch (err) {
      console.error('OCR Error:', err);
      // Fallback: still show form with defaults so user can complete manually
      setError('Kon de tekst niet volledig automatisch lezen. Je kunt het bedrag hieronder zelf invullen.');
      setCategoryId(expenseCategories[0]?.id || 'exp_groceries');
      setNote('Winkelbon');
      setParsedData({ rawText: '' });
    } finally {
      if (worker) {
        try {
          await worker.terminate();
        } catch (e) {
          // ignore
        }
      }
      setIsScanning(false);
    }
  };

  const handleSaveTransaction = async (e) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (!num || num <= 0) {
      setError('Vul een geldig bedrag in.');
      return;
    }

    try {
      await onSave({
        amount: num,
        type: 'expense',
        categoryId: categoryId || expenseCategories[0]?.id,
        note: note.trim() || 'Kassaticket',
        paymentMethod,
        date
      });
      handleClose();
    } catch (err) {
      console.error('Error saving scanned receipt:', err);
    }
  };

  const handleReset = () => {
    setImageSrc(null);
    setParsedData(null);
    setAmount('');
    setNote('');
    setError(null);
    setScanProgress(0);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const selectedCategory = categories.find(c => c.id === categoryId);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/65 backdrop-blur-sm transition-opacity">
      <div className="w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Kassaticket Scannen</h3>
              <span className="text-[11px] text-slate-400">Automatische OCR & Categorie herkenning</span>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Hidden inputs for camera & file upload */}
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* STATE 1: Geen foto gekozen */}
          {!imageSrc && (
            <div className="text-center py-6 space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-100/80 flex items-center justify-center mx-auto shadow-inner">
                <Camera className="w-10 h-10 stroke-[1.5]" />
              </div>

              <div>
                <h4 className="text-base font-bold text-slate-800">Maak een foto van je bonnetje</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                  De scanner herkent automatisch het totaalbedrag, de winkel en de juiste categorie (boodschappen, tankbeurt, horeca, etc.).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="py-3 px-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex flex-col items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  <Camera className="w-5 h-5" />
                  <span>Foto Maken</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-3 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex flex-col items-center justify-center gap-1.5 border border-slate-200 active:scale-95 transition-all"
                >
                  <Upload className="w-5 h-5 text-slate-500" />
                  <span>Bestand Kiezen</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-left text-[11px] text-slate-500 space-y-1">
                <span className="font-semibold text-slate-700 block flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Tips voor het beste resultaat:
                </span>
                <span>• Zorg voor voldoende licht en een vlakke ondergrond.</span><br />
                <span>• Zorg dat het totaalbedrag en de winkelnaam duidelijk zichtbaar zijn.</span>
              </div>
            </div>
          )}

          {/* STATE 2: Bezig met scannen (OCR loader) */}
          {imageSrc && isScanning && (
            <div className="py-8 text-center space-y-4">
              <div className="relative w-36 h-48 mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-md">
                <img src={imageSrc} alt="Preview" className="w-full h-full object-cover filter brightness-75" />
                
                {/* Laser scan line animation */}
                <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_#10b981] animate-bounce" />
                
                <div className="absolute inset-0 bg-emerald-950/30 backdrop-blur-[1px] flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-800">{statusMessage}</h4>
                <div className="w-48 bg-slate-100 h-2 rounded-full mx-auto mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">100% lokaal & veilig verwerkt</span>
              </div>
            </div>
          )}

          {/* STATE 3: Scan voltooid -> Controleer & Opslaan formulier */}
          {imageSrc && !isScanning && (
            <form onSubmit={handleSaveTransaction} className="space-y-4">
              
              {/* Mini Preview Header with Re-scan button */}
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={imageSrc}
                    alt="Ticket thumbnail"
                    className="w-10 h-12 object-cover rounded-lg border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate block">
                      {note || 'Gescand kassaticket'}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Gegevens automatisch uitgelezen
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all flex items-center gap-1 shrink-0"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Opnieuw</span>
                </button>
              </div>

              {error && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Amount Field (Big) */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100 flex flex-col items-center">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  Herkend Totaalbedrag
                </span>
                <div className="flex items-center justify-center gap-1 w-full">
                  <span className="text-3xl font-bold text-slate-400">€</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-44 text-center text-3xl font-extrabold text-slate-900 bg-transparent focus:outline-none placeholder-slate-300"
                    required
                  />
                </div>
              </div>

              {/* Category Picker */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Toegewezen Categorie
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {expenseCategories.slice(0, 6).map((cat) => {
                    const isSelected = categoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategoryId(cat.id)}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs'
                            : 'border-slate-100 bg-slate-50 hover:bg-slate-100/70 text-slate-700'
                        }`}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
                          style={{ backgroundColor: cat.color || '#64748b' }}
                        >
                          <DynamicIcon name={cat.icon} className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-xs font-semibold truncate">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* More categories dropdown */}
                {expenseCategories.length > 6 && (
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full mt-2 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {expenseCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Store & Date row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Winkel / Omschrijving
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="bv. Delhaize"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    Datum
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 font-semibold"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                  Betaalmethode
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  {[
                    { id: 'bank', label: 'Bankkaart' },
                    { id: 'meal_voucher', label: 'Maaltijdcheque' },
                    { id: 'cash', label: 'Cash' },
                    { id: 'credit_card', label: 'Kredietkaart' }
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`py-1.5 px-1 rounded-xl text-[11px] font-semibold border transition-all truncate ${
                        paymentMethod === m.id
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Collapsible raw OCR text for transparency */}
              {parsedData?.rawText && (
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowRawText(!showRawText)}
                    className="text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{showRawText ? 'Verberg gescande tekst' : 'Bekijk ruwe ticket tekst'}</span>
                    {showRawText ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {showRawText && (
                    <pre className="mt-1 p-2.5 bg-slate-100 rounded-xl text-[10px] text-slate-600 overflow-x-auto max-h-32 leading-tight">
                      {parsedData.rawText}
                    </pre>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Check className="w-5 h-5 stroke-[2.5]" />
                  <span>Uitgave Opslaan ({amount ? formatCurrency(parseFloat(amount)) : '€ 0.00'})</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
