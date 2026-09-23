# 📘 MyBudget — Gebruikershandleiding

Welkom bij **MyBudget** (v1.2.0), jouw persoonlijke en privacy-vriendelijke financiële assistent. Deze handleiding legt stap voor stap uit hoe je het maximale uit de app haalt op je iPhone, pc of NUC.

---

## 📑 Inhoudsopgave

1. [Wat is MyBudget?](#1-wat-is-mybudget)
2. [Installeren op je iPhone (Beginscherm / WebApp)](#2-installeren-op-je-iphone-beginscherm--webapp)
3. [Twee manieren van gebruik](#3-twee-manieren-van-gebruik)
4. [Eerste gebruik: De Setup Wizard (Schone Lei)](#4-eerste-gebruik-de-setup-wizard-schone-lei)
5. [Het Dashboard & Dagbudget begrijpen](#5-het-dashboard--dagbudget-begrijpen)
6. [Snel Uitgaven & Inkomsten Invoeren](#6-snel-uitgaven--inkomsten-invoeren)
7. [📷 De Automatische Kassaticket Scanner](#7--de-automatische-kassaticket-scanner)
8. [Variabele Inkomsten (Kunst, Opdrachten, Workshops)](#8-variabele-inkomsten-kunst-opdrachten-workshops)
9. [Financieel Advies (50 / 30 / 20 & Gezondheidsscore)](#9-financieel-advies-50--30--20--gezondheidsscore)
10. [Instellingen, Pincode & Backups](#10-instellingen-pincode--backups)
11. [Veelgestelde Vragen (FAQ)](#11-veelgestelde-vragen-faq)

---

## 1. Wat is MyBudget?

MyBudget is ontworpen rond drie kernprincipes:
1. **Volledige Privacy:** Geen bankkoppelingen die meekijken, geen reclame, geen externe servers die jouw data analyseren. Alles draait op je eigen NUC thuisserver of lokaal in je eigen mobiele browser.
2. **Praktische Dagelijkse Rust:** In plaats van ingewikkelde boekhouding zie je direct: *Wat is mijn dagbudget?*, *Wat heb ik vandaag uitgegeven?* en *Wat schiet er vandaag nog over?*
3. **Moeiteloos Invoeren:** Dankzij de slimme camera-scanner voor kassatickets en snelle bedragknoppen kost het bijhouden van je budget slechts enkele seconden per dag.

---

## 2. Installeren op je iPhone (Beginscherm / WebApp)

Je kunt MyBudget als een echte app op je iPhone gebruiken zonder de Safari-balken:

1. Open **Safari** op je iPhone.
2. Surf naar je MyBudget link:
   - **Voor privégebruik thuis:** `http://192.168.0.10:3001` of via Tailscale.
   - **Voor openbaar / standalone gebruik:** `https://wimvaes-boop.github.io/MyBudget/`
3. Tik onderaan in het midden op de **Deelknop** (het vierkantje met het pijltje omhoog: ⎋ of ⇪).
4. Veeg een stukje naar beneden en tik op **'Zet op beginscherm'** (Add to Home Screen).
5. Tik rechtsboven op **'Voeg toe'**.

Er verschijnt nu een **MyBudget-icoon** op je iPhone beginscherm. Als je hierop tikt, opent de app schermvullend zoals een gewone app uit de App Store.

---

## 3. Twee manieren van gebruik

| Eigenschap | 🏠 NUC Thuisserver | 🌐 Standalone (GitHub Pages) |
|---|---|---|
| **Adres** | `http://192.168.0.10:3001` (of `/budget/`) | `https://wimvaes-boop.github.io/MyBudget/` |
| **Geschikt voor** | Jouw eigen centrale dashboard thuis | Delen met vrienden, familie of buitenshuis zonder Tailscale |
| **Opslag** | Lokaal JSON-bestand op je NUC server | 100% privé in de `localStorage` van jouw mobiele browser |
| **Synchronisatie** | Gedeeld tussen pc en mobiel op hetzelfde netwerk | Standalone op dat specifieke toestel |

---

## 4. Eerste gebruik: De Setup Wizard (Schone Lei)

Wanneer een nieuwe gebruiker de app voor de eerste keer opent (of na een reset), start automatisch de **Setup Wizard** met een schone lei (alle velden beginnen op 0):

* **Stap 1: Inkomsten**
  * *Netto Maandloon:* Jouw vaste basissalaris (bv. € 2.850).
  * *Maaltijdcheques / Extralegaal:* Maandelijks bedrag aan cheques (bv. € 160).
  * *Salarisdag:* De dag van de maand waarop je loon gestort wordt (standaard de 25e).
* **Stap 2: Vaste Lasten**
  * *Wonen (Hypotheek / Huur):* Jouw vaste maandelijkse woonkost (bv. € 1.306,74).
  * *Energie, Verzekeringen, Telecom:* Voorschotten voor gas/elektriciteit, internet, etc.
  * *(Tip: Laat op 0 staan als een post niet op jou van toepassing is).*
* **Stap 3: Sparen & Optionele Pincode**
  * *Gewenst spaarbedrag:* Wat je maandelijks opzij wilt zetten (bv. € 250).
  * *Pincode:* Optionele 4-cijferige code om de app te vergrendelen op je telefoon.

Tik op **'Alles Klaarzetten & Starten'** om direct naar je persoonlijke dashboard te gaan.

---

## 5. Het Dashboard & Dagbudget begrijpen

Het dashboard is rustig en overzichtelijk opgebouwd in duidelijke blokken:

### Het zwarte Analysevenster (Bovenaan)
* **📅 Dagbudget (links):** Dit is het bedrag dat je vandaag kunt uitgeven aan variabele zaken (zoals terrasje, kleding, hobby, boodschappen) zonder in de problemen te komen tot je volgende loonstrook.
* **💳 Vandaag uitgegeven (rechts):** Het totaalbedrag van alle uitgaven die je vandaag hebt geregistreerd.
  * *Nog over:* Geeft in het groen direct aan hoeveel er vandaag nog overschiet (bijv. *Nog € 25,00 over*).
  * *Boven budget:* Kleurt oranje als je vandaag meer hebt uitgegeven dan je dagbudget.
* **Tempo tot volgend salaris (banner):** Toont hoeveel dagen er nog resten tot je salarisdag en hoeveel bestedingsruimte je hebt.

### De Categorieën
De categorieën zijn logisch gescheiden in twee groepen:
1. **Dagelijkse & Populaire Uitgaven (Bovenaan):**
   * Boodschappen, Horeca & Terras, Vervoer, Ontspanning, Kleding, etc.
   * Dit zijn de posten die je regelmatig gebruikt. De voortgangsbalk toont hoeveel je deze maand al hebt opgebruikt van je richtbudget.
2. **Vaste Maandlasten (Onderaan):**
   * Hypotheek/Huur, Energie, Telecom, Verzekeringen.
   * Omdat dit vaste kosten zijn die maar één keer per maand voorkomen, tonen deze rustig **`✓ Betaald / Voldaan`** in plaats van alarmerende uitroeptekens.

---

## 6. Snel Uitgaven & Inkomsten Invoeren

1. Tik onderaan op de grote **groene `+` knop**.
2. Kies of het een **Uitgave** of een **Inkomst** is.
3. Typ het bedrag in, of gebruik de handige snelknoppen (`+5`, `+10`, `+20`, `+50`).
4. Selecteer de juiste categorie (bv. *Boodschappen* of *Horeca*).
5. Kies je betaalmethode (Bancontact, Kredietkaart, Contant of **Maaltijdcheque**).
6. Tik op **'Transactie Opslaan'**.

Je dashboard en dagbudget worden onmiddellijk herberekend!

---

## 7. 📷 De Automatische Kassaticket Scanner

Heb je een kassabon van de supermarkt, bakker of winkel? Laat MyBudget het werk doen:

1. Tik op de **groene `+` knop** en kies bovenaan op **'📷 Scan Kassaticket'** (of via de knop op het dashboard).
2. Tik op **'Foto Maken / Uploaden'**.
3. Maak een duidelijke foto van het bonnetje of kies een foto uit je filmrol.
4. De scanner analyseert de tekst direct op jouw telefoon:
   * Hij herkent automatisch het **totaalbedrag**.
   * Hij herkent de **winkelnaam** (bijv. Delhaize, Colruyt, Albert Heijn, Lidl, Kruidvat, Shell, etc.).
   * Hij herkent de **datum** op het ticket.
   * Hij koppelt automatisch de juiste **categorie** (bijv. Colruyt → *Boodschappen & Voeding*).
   * Als er met maaltijdcheques betaald is (Monizze, Edenred, Sodexo/Pluxee), selecteert hij automatisch *Maaltijdcheque*.
5. Controleer de velden en tik op **'Kassaticket Opslaan'**.

---

## 8. Variabele Inkomsten (Kunst, Opdrachten, Workshops)

Verkoop je sporadisch een tekening of schilderij, geef je een workshop of doe je een freelance opdracht?

1. Tik op de **`+` knop** en kies **Inkomst**.
2. Kies de categorie:
   * **Verkoop Tekeningen / Kunst**
   * **Opdrachten & Projecten**
   * **Workshops & Cursussen**
   * **13e Maand / Bonus** of **Overige Inkomsten**
3. Vul het bedrag in en sla op.

### Wat gebeurt er met je budget?
* Je **beschikbare dagbudget stijgt direct**, omdat er extra geld binnenkomt dat niet gereserveerd hoeft te worden voor vaste lasten.
* De financieel adviseur geeft je een felicitatiebericht op het dashboard met je extra verdiensten.

---

## 9. Financieel Advies (50 / 30 / 20 & Gezondheidsscore)

Tik onderaan op het tabblad **'Advies'** om dieper inzicht te krijgen:

* **Financiële Gezondheidsscore (0 - 100):** Geeft in één oogopslag aan hoe stabiel en evenwichtig je financiën deze maand zijn.
* **De 50 / 30 / 20 Regel:**
  * **50% Behoeften:** Vaste lasten, hypotheek, energie, basisvoeding.
  * **30% Wensen:** Horeca, hobby's, reizen, ontspanning.
  * **20% Sparen & Buffer:** Noodfonds, beleggingen, pensioensparen.
* **Burn-rate alerts:** Waarschuwingen als een variabele categorie sneller leegloopt dan de maand vordert, zodat je tijdig kunt bijsturen.

---

## 10. Instellingen, Pincode & Backups

Tik onderaan op **'Instellingen'**:

* **Basisgegevens:** Pas je netto maandloon, maaltijdcheques of salarisdag aan.
* **Categoriebudgetten Aanpassen:** Tik op een categorie om het richtbudget per maand te verhogen of te verlagen.
* **Pincode Beveiliging:** Schakel een 4-cijferige pincode in. Zodra je de app verlaat en terugkeert, vraagt MyBudget netjes om je code.
* **Backup Downloaden:** Download een `.json` bestand met al je transacties, categorieën en instellingen.
* **Backup Herstellen:** Upload een eerder gedownload `.json` bestand om je gegevens op elk moment terug te zetten.
* **Start Wizard Opnieuw:** Doorloop de configuratiewizard opnieuw om je basisbedragen aan te passen.

---

## 11. Veelgestelde Vragen (FAQ)

### Waarom zie ik bij mijn hypotheek geen waarschuwingskleuren als het budget bereikt is?
Omdat een hypotheek of vaste huur een vaste maandlast is die je eenmalig per maand betaalt. Het is volstrekt normaal dat 100% hiervan bereikt is. MyBudget toont daarom rustig `✓ Betaald / Voldaan` in plaats van een waarschuwing.

### Wat als ik de app op een andere iPhone wil gebruiken?
Stuur de GitHub link (`https://wimvaes-boop.github.io/MyBudget/`) door. Die persoon opent de link, doorloopt de blanco wizard met zijn/haar eigen cijfers, en heeft een 100% privé eigen budgetapp op zijn telefoon.

### Hoe reset ik alles naar een schone lei?
Ga naar *Instellingen* → scrol naar beneden → tik op *'Data wissen / Resetten'*. Alles wordt gewist en de wizard start weer blanco op 0.
