import React, { useState } from 'react';
import { BookOpen, X, Smartphone, Calendar, Camera, Palette, Shield, HelpCircle, Check, ChevronDown, ChevronRight, Download } from 'lucide-react';

export default function UserManualModal({ isOpen, onClose }) {
  const [activeSection, setActiveSection] = useState('install');

  if (!isOpen) return null;

  const sections = [
    {
      id: 'install',
      title: 'iPhone Installatie',
      icon: Smartphone,
      color: 'text-blue-500 bg-blue-50',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-800">
            Zet MyBudget binnen 30 seconden als app op je iPhone beginscherm:
          </p>
          <ol className="list-decimal list-inside space-y-2 pl-1">
            <li>Open de link in <strong>Safari</strong> op je iPhone.</li>
            <li>Tik onderaan op de <strong>Deelknop</strong> (vierkantje met pijltje omhoog).</li>
            <li>Kies in het menu voor <strong>'Zet op beginscherm'</strong> (Add to Home Screen).</li>
            <li>Tik rechtsboven op <strong>'Voeg toe'</strong>.</li>
          </ol>
          <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-blue-900 font-medium text-[11px]">
            💡 De app opent nu schermvullend zonder Safari-adresbalken, net zoals een gewone App Store app!
          </div>
        </div>
      )
    },
    {
      id: 'dashboard',
      title: 'Dagbudget & Dashboard',
      icon: Calendar,
      color: 'text-emerald-500 bg-emerald-50',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-800">
            Het zwarte venster bovenaan geeft je direct rust en overzicht:
          </p>
          <ul className="space-y-2">
            <li>
              <strong className="text-emerald-700">📅 Dagbudget:</strong> Het bedrag dat je vandaag zorgeloos kunt uitgeven aan wensen, boodschappen of terrasjes zonder tekort te komen tot je volgende salaris.
            </li>
            <li>
              <strong className="text-slate-900">💳 Vandaag uitgegeven:</strong> Het totaal van je uitgaven van vandaag. Daaronder zie je direct in het groen <em>wat er vandaag nog overschiet</em> van je dagbudget.
            </li>
            <li>
              <strong className="text-slate-900">⏱️ Dagen tot salaris:</strong> Telt af naar je salarisdag en berekent je actuele bestedingstempo.
            </li>
          </ul>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="font-bold text-slate-800 block text-[11px]">Rustige categorie-indeling:</span>
            <p className="text-[11px]">
              • <strong>Dagelijkse & Populaire uitgaven:</strong> Boodschappen, horeca en frequente kosten staan bovenaan.<br />
              • <strong>Vaste Maandlasten:</strong> Hypotheek, energie en abonnementen staan onderaan met de rustige status <em>'✓ Betaald / Voldaan'</em> zonder alarmerende uitroeptekens.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'scanner',
      title: 'Kassaticket Scanner',
      icon: Camera,
      color: 'text-teal-500 bg-teal-50',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-800">
            Scan automatisch een kassabonnetje met je camera:
          </p>
          <ol className="list-decimal list-inside space-y-1.5 pl-1">
            <li>Tik op de groene <strong>+ knop</strong> en kies <strong>'📷 Scan Kassaticket'</strong>.</li>
            <li>Tik op <em>'Foto Maken / Uploaden'</em> en neem een scherpe foto van het ticket.</li>
            <li>De scanner leest automatisch het <strong>totaalbedrag</strong>, de <strong>winkel</strong> en de <strong>datum</strong>.</li>
            <li>De categorie (bv. <em>Boodschappen</em>) en betaalmethode (bv. <em>Maaltijdcheques</em>) worden direct slim voorgesteld.</li>
            <li>Tik op <strong>'Kassaticket Opslaan'</strong> en je bent klaar!</li>
          </ol>
          <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-teal-900 text-[11px]">
            🔒 <strong>100% Privé:</strong> De tekstherkenning (OCR) gebeurt volledig op jouw eigen toestel. Er wordt geen foto doorgestuurd naar externe clouds.
          </div>
        </div>
      )
    },
    {
      id: 'income',
      title: 'Variabele Inkomsten',
      icon: Palette,
      color: 'text-purple-500 bg-purple-50',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-800">
            Wisselende verdiensten registreren (kunst, opdrachten, workshops):
          </p>
          <p>
            Heb je een tekening verkocht, een workshop gegeven of een bonus ontvangen?
          </p>
          <ol className="list-decimal list-inside space-y-1.5 pl-1">
            <li>Tik op de groene <strong>+ knop</strong> en kies <strong>Inkomst</strong>.</li>
            <li>Kies de categorie (bv. <em>Verkoop Tekeningen / Kunst</em> of <em>Workshops & Cursussen</em>).</li>
            <li>Vul het ontvangen bedrag in en sla op.</li>
          </ol>
          <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl text-purple-900 text-[11px]">
            ✨ <strong>Effect op je budget:</strong> Extra inkomsten verhogen direct je beschikbare dagbudget en veilige bestedingsruimte voor de rest van de maand!
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Pincode & Backups',
      icon: Shield,
      color: 'text-amber-500 bg-amber-50',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <p className="font-semibold text-slate-800">
            Beveiliging en controle over je data:
          </p>
          <ul className="space-y-2">
            <li>
              <strong>Pincode:</strong> In het tabblad <em>Instellingen</em> kun je een 4-cijferige pincode aanzetten. Zodra je de app afsluit, vraagt MyBudget netjes om je code.
            </li>
            <li>
              <strong>Backup Downloaden:</strong> Sla met één klik een <code>.json</code> bestand op met al je categorieën, transacties en spaardoelen.
            </li>
            <li>
              <strong>Backup Herstellen:</strong> Laad je backupbestand op elk moment in op een nieuwe telefoon of computer.
            </li>
            <li>
              <strong>Schone Lei:</strong> Wil je met een schone lei beginnen? Tik onderaan op <em>'Data wissen / Resetten'</em> of <em>'Start wizard opnieuw'</em>.
            </li>
          </ul>
        </div>
      )
    },
    {
      id: 'faq',
      title: 'Veelgestelde Vragen',
      icon: HelpCircle,
      color: 'text-slate-500 bg-slate-50',
      content: (
        <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block text-[11px]">
              Waarom geeft mijn hypotheek geen waarschuwingskleur?
            </span>
            <p className="text-[11px]">
              Omdat een hypotheek een vaste last is die je maandelijks betaalt. Dat het budget 100% bereikt is, is gepland en volstrekt normaal. Daarom toont MyBudget kalm <em>'✓ Betaald / Voldaan'</em>.
            </p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-900 block text-[11px]">
              Kan ik de app delen met iemand anders?
            </span>
            <p className="text-[11px]">
              Ja! Deel de openbare link <code>https://wimvaes-boop.github.io/MyBudget/</code>. De andere persoon krijgt een eigen blanco wizard en bewaart alle gegevens lokaal op zijn/haar eigen telefoon.
            </p>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Gebruikershandleiding
              </h2>
              <span className="text-[11px] text-slate-400 block">
                MyBudget v1.2.0 • Snelgids & Uitleg
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="Sluiten"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs (Pills) */}
        <div className="flex gap-1.5 overflow-x-auto py-3 no-scrollbar border-b border-slate-100 shrink-0">
          {sections.map(s => {
            const Icon = s.icon;
            const isActive = activeSection === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto py-4 px-1 space-y-4">
          {sections.find(s => s.id === activeSection)?.content}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-between items-center shrink-0">
          <span className="text-[11px] text-slate-400">
            Handleiding ook als <strong>HANDLEIDING.md</strong> in je repository
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
          >
            Begrepen
          </button>
        </div>

      </div>
    </div>
  );
}
