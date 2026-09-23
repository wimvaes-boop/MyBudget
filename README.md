# 💎 MyBudget (v1.2.0) • Financiële Adviseur & Budget WebApp

Een high-end persoonlijke budgetbeheerder en financieel adviseur, ontworpen om te draaien op je **NUC** thuisserver en te bedienen vanaf je **iPhone** (via Tailscale of lokaal netwerk) én online beschikbaar als standalone WebApp via GitHub Pages.

👉 **Lees hier de complete gebruikershandleiding:** [**HANDLEIDING.md**](HANDLEIDING.md)

---

## 🌐 Twee Manieren Om Te Gebruiken

1. **🏠 Privé op je NUC thuisserver:**
   - Adres: `http://192.168.0.10:3001` (of via Apache reverse-proxy `/budget/`).
   - Alles synchroniseert automatisch en wordt veilig opgeslagen in een lokaal JSON-bestand op je NUC.
2. **📱 Standalone Privé via GitHub Pages:**
   - Adres: [**https://wimvaes-boop.github.io/MyBudget/**](https://wimvaes-boop.github.io/MyBudget/)
   - Ideaal voor onderweg of om te delen met familie/vrienden.
   - Start automatisch met een schone lei (clean sheet) en slaat gegevens 100% privé op in de mobiele browser van het toestel.

---

## 📱 Belangrijkste Functies

1. **📷 Automatische Kassaticket Scanner (OCR):**
   - Maak een foto van een kassabonnetje met je mobiele camera.
   - Herkent automatisch het **totaalbedrag**, de **winkel** (Delhaize, Colruyt, Albert Heijn, Lidl, Kruidvat, Shell, etc.) en de **datum**.
   - Koppelt het ticket automatisch aan de juiste categorie en betaalmethode (inclusief maaltijdcheques).
   - 100% lokaal en privé op je toestel verwerkt (`tesseract.js`).

2. **Duidelijk Dagbudget & Vandaag Uitgegeven:**
   - **Dagbudget:** Het bedrag dat je vandaag zorgeloos kunt besteden aan wensen en dagelijkse kosten.
   - **Vandaag uitgegeven:** Toont exact wat je vandaag hebt uitgegeven en wat er nog overschiet van je dagbudget.
   - **Tempo tot salaris:** Volgt het aantal dagen tot je volgende salarisuitbetaling.

3. **Logische & Rustige Categorie-Indeling:**
   - *Dagelijkse & Populaire Uitgaven* (boodschappen, horeca, vervoer) direct bovenaan.
   - *Vaste Maandlasten* (hypotheek/huur, energie, verzekeringen) rustig onderaan met `✓ Betaald / Voldaan` status zonder storende alarmen.

4. **Variabele Inkomsten:**
   - Eenvoudig extra inkomsten registreren (verkoop van tekeningen/kunst, opdrachten, workshops, bonussen).
   - Verhoogt direct je veilige bestedingsruimte voor de rest van de maand.

5. **50 / 30 / 20 Financieel Advies:**
   - Meet of je uitgaven in balans zijn (50% behoeften, 30% wensen, 20% sparen & beleggen).
   - Geeft een financiële gezondheidsscore van 0 tot 100.

6. **Pincode & Data Veiligheid:**
   - Optionele 4-cijferige pincodebeveiliging in iOS-stijl.
   - Met 1 klik een complete JSON backup downloaden of herstellen.
   - Schone lei wizard voor nieuwe gebruikers.

---

## 📲 Installeren op je iPhone (Beginscherm / WebApp)

1. Open **Safari** op je iPhone.
2. Surf naar `http://192.168.0.10:3001` of `https://wimvaes-boop.github.io/MyBudget/`.
3. Tik onderaan in Safari op de **Deelknop** (het vierkantje met het pijltje omhoog).
4. Kies in de lijst voor **'Zet op beginscherm'** (Add to Home Screen).
5. Tik op **'Voeg toe'**.

Nu staat MyBudget als een volwaardige native app op je iPhone zonder browserbalken!

---

## 📖 Meer Informatie
Raadpleeg [**HANDLEIDING.md**](HANDLEIDING.md) voor de complete documentatie, veelgestelde vragen en stap-voor-stap instructies.
