# 💎 MyBudget (v1.3.0) • Financiële Adviseur & Budget WebApp

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

## 📱 Belangrijkste Functies in v1.3.0

1. **🔄 Flexibele Budgetperiodes (Salariscyclus vs Kalendermaand):**
   - **Salariscyclus:** Telt je periode af tussen twee salarisstortingen (bv. van de 25e tot de 24e van de volgende maand). Reset automatisch op je salarisdag!
   - **Kalendermaand:** Eenvoudig omschakelen naar strikte kalendermaanden (1e t/m 31e).

2. **📆 Flexibele Factuurtermijnen (Jaar, Kwartaal / 3 mnd, 4 mnd, Halfjaar):**
   - Stel belastingen, heffingen of verzekeringen in per jaar, kwartaal of halfjaar.
   - De adviseur berekent automatisch de maandelijkse reservering zodat je dagbudget exact klopt.

3. **🪄 Slimme Richtbudgetten (50/30/20):**
   - Met 1 klik richtbudgetten invullen voor alle categorieën op basis van je netto inkomen.
   - Nooit meer handmatig 20 categorieën op 0 moeten laten staan.

4. **📷 Automatische Kassaticket Scanner (OCR):**
   - Maak een foto van een kassabonnetje met je mobiele camera.
   - Herkent automatisch bedrag, winkel en datum. 100% lokaal en privé (`tesseract.js`).

5. **Duidelijk Dagbudget & Vandaag Uitgegeven:**
   - Toont direct: dagbudget, vandaag uitgegeven, wat er nog overschiet en dagen tot volgend salaris.

6. **Pincode & 1-Klik Data Backups:**
   - Optionele 4-cijferige pincodebeveiliging.
   - 1-klik directe JSON backup downloaden of herstellen (werkt op elk apparaat en GitHub Pages).

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
