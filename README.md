# 1.1 Generosity

## Authors: 
- Habib Mohammadi
- Sossio Giorgelli
- Azam Suleiman

## <ins>1.2 Project Info (Swedish)</ins>

### 1.2.x Project description

Projektgruppen har valt att bygga ett donations webbapplikation med JS ramverket Angular. Applikationen går ut på att en användare anger ett belopp samt namnet till ett projekt som användaren vill donera. Detta applikation inriktar alltså till projektarbeten där användare kan ge stöd till ett projekt.

Användaren donerar med hjälp av Swish API. Som en administratör, kan en admin se ett dashboard med hur många donationer som har blivit skickat under loppet av vecka, månad samt år.

Projektgruppen har byggt detta applikation för att dels bygga nya kunskaper om ramverket Angular och betalningstjänst samt att det kan vara nytta till framtiden.

### 1.2.x Framework

Projektgruppen har valt att använda JS ramverket Angular. Anledningen bakom är att den har ett strukturerat MVC\* arkitektur som underlättar förståelse för kod och moduler. Angular är skalbar, responsiv och oberoende från tredje-parts bibliotek. Däremot har angular ofullständig dokumentation och prestanda koncept.

Till Skillnad från Angular, har däremot React ett optimalt användargränssnitt samt hög effektivitet. Angular jämfört med ett annat ramverk som Vue, har vue enklare dokumentation. Å andra sidan har Vue, precis som Angular, typescript vilket inte används i React. Med typescript ges det möjlighet att öka läsbarheten, skalbarheten samt bättre felhantering till skillnad från javascript.

Samtidigt har CSS ramverket Bootstrap också använts för css delen för att förfina utseendet av hemsidan. Till skillnad från Bootstrap, ger ex. Tailwind mer utrymme att anpassa css. Bootstrap däremot get möjlighet att bygga hemsidan snabbare.

Eftersom detta projektet bygger ett donerings app, har Angular blivit den mest passande ramverk då den ger ett bra struktur av kodfiler. Samtidigt, för att bygga vårt hemsida snabbare, var valet av Bootstrap därför viktigt.

### 1.2.x Library

Som ett bibliotek valdes JS biblioteket Chart.js som är ett öppen källkod för datavisualisering, som stöder olika diagramtyper: stapel, linje, område, cirkel m.m. Detta valdes främst för stapel och cirkeldiagram för vårt projekt. Chart.js tillåter även att utföra animationer.

Bland andra bibliotek som ex. Chartlist, Plotly, HighCharts m.fl., erbjuder Chart.js en enkel import och snygg animation till skillnad från de andra bibliotek.
Då applikationen ska visualisera antal donationer i vecka, månad och år, har därför Chart.js hjälpt att visualisera och utföra snygg animation.

### 1.2.x API

Som ett API, används det API:et Swish. Den har genererad en QR-kod där användaren kan betala: Däremot, finns det begränsningar: Donering av belopp är endast en simulering som automatisk ger en PAID respons. För Mer simulering krävdes även en bank ID konto vilket har lagts vid sidan om detta projektet.

### 1.2.x Save data

Sättet att spara data utfördes med hjälp av databasen PostgreSQL. Denna databasen valdes eftersom gruppen har i tidigare kurser lärt om det.
Varje gång en ny donation ges, sparas det på databasen och sedan visas historiken med diagram. Localstorage används också för att inte ha många anrop.

### 1.2.x Responsivity

Hemsidan är anpassad för olika plattformar som Mobil, Tablet och Laptop. Eftersom sidan inte är komplex och används av ramverket Bootstrap, är responsiviteten utförs på ett enkelt sätt.

### 1.2.x Reflection of the work

Arbetet har gått väl, dels utmanande med att implementera Swish API och dels lärorikt att lära ett nytt ramverk som Angular.

Som det nämndes tidigare, hade Swish API:et begränsningar. Det hade kunnat vara roligt att detta kunde simuleras till nära verkligheten.

Samarbetet har varit produktivt, vi har delat upp arbetet och kommunicerat med varandra med nya uppdateringar osv.
Github har varit ett bra verktyg för versionshantering där vi på ett tydligt sätt hanterade applikationen till att utvecklas till denna versionen som vi kom med till.

Annars, reflektion för hela kursen skulle vi säga att det var en del repetition men också nya lärdomar som vi har lärt oss.

## <ins>1.3.1 Guide to Run the Application</ins>

### 1.3.2 Run Client side

1. Navigate to /generosity <br>
2. Install dependencies: `npm install` <br>
3. Run the clinet: `npm start`

### 1.3.3 Run Server side

1. Navigate to generosity/swish-server <br>
2. Install dependencies: `npm install` <br>
3. Run the server: `npm start` <br>
