# 💎 MyBudget (v1.2.0) • Financiële Adviseur & Budget WebApp

Een high-end persoonlijke budgetbeheerder en financieel adviseur, ontworpen om te draaien op je **NUC** thuisserver en te bedienen vanaf je **iPhone** (via Tailscale of lokaal netwerk) én als kaartje/widget op je NUC dashboard.

---

## 📱 Kenmerken & Functionaliteiten

1. **📷 Automatische Kassaticket Scanner (OCR):**
   - Maak direct een foto met je mobiele camera of upload een kassabon.
   - Herkent automatisch het **totaalbedrag**, de **winkel** (bv. Delhaize, Colruyt, Shell, Kruidvat) en de **datum**.
   - Koppelt het ticket automatisch aan de juiste categorie en betaalmethode (inclusief maaltijdcheques).
   - 100% lokale en private verwerking via on-device OCR (`tesseract.js`).

2. **High-End Financieel Advies & Rustige Indeling:**
   - **Logische indeling:** Populaire en dagelijkse uitgaven staan direct bovenaan; vaste maandlasten (zoals hypotheek) rustig onderaan.
   - **Geen valse alarmen:** Vaste contracten en hypotheek die voldaan zijn worden rustig weergegeven zonder storende gevarenkleuren.
   - **Variabele Inkomsten:** Volledige ondersteuning voor wisselende inkomsten (verkoop van kunst/tekeningen, opdrachten, workshops) met directe verhoging van je veilige bestedingsruimte.
   - **Veilig Dagbudget:** Berekent op basis van je vaste lasten en variabele uitgaven hoeveel je dagelijks vrij kunt besteden tot je volgende salaris.
   - **50 / 30 / 20 Verdeling:** Analyseert of je uitgaven in balans zijn (50% behoeften, 30% plezier/wensen, 20% sparen & beleggen).
   - **Noodfonds Buffer:** Bewaakt hoeveel maanden vaste lasten gedekt zijn op je direct opvraagbare spaarrekening.

2. **iPhone-First Snelle Invoer (PWA):**
   - Binnen enkele seconden een uitgave of inkomst invoeren onderweg.
   - Directe feedback hoeveel budget er nog overblijft in de gekozen categorie.
   - Groot numeriek invoerveld met snelle `+5`, `+10`, `+20`, `+50` toetsen.

3. **Licht & Luchtig Design:**
   - Apple/Fintech look & feel met zachte schaduwen, vloeiende overgangen en lichte kleuren.
   - Responsief voor zowel kleine iPhone schermen als brede NUC dashboard widgets.

4. **Veiligheid & Privacy:**
   - **100% Lokaal:** Alle data wordt veilig opgeslagen in een lokaal JSON-bestand op je NUC.
   - **Pincode Beveiliging:** Optioneel in te stellen 4-cijferige iOS-stijl pincode.
   - **Tailscale Ready:** Veilig onderweg bereikbaar zonder open poorten op je router.
   - **Backups:** Met één klik een complete JSON-backup downloaden of herstellen.

---

## 🚀 Starten op je NUC

### Manier 1: Dubbelklik op het opstartbestand
Dubbelklik simpelweg op `start.bat` in de projectmap.

### Manier 2: Via Terminal / PowerShell
```bash
npm start
```
De app start automatisch op: **`http://localhost:3001`** (en op je Tailscale IP, bv. `http://100.x.y.z:3001`).

---

## 📲 Installeren op je iPhone als App (Kaartje op je Home Screen)

1. Open **Safari** op je iPhone.
2. Surf naar je Tailscale NUC adres: `http://[jouw-nuc-ip]:3001`.
3. Tik onderaan in Safari op de **Deelknop** (het vierkantje met het pijltje omhoog).
4. Kies in de lijst voor **'Zet op beginscherm'** (Add to Home Screen).
5. Tik op **'Voeg toe'**.

Nu staat MyBudget als een volwaardige native app op je iPhone zonder browserbalken!
