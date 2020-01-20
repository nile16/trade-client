
##### Installation
*npm install*

##### Starta webbserver
*npm start*

##### Stoppa webbserver
*npm stop*

##### Kör tester
*npm test*

##### Linta Javascriptet
*npm run eslint*


##### Krav 2

Tekniken blev "single-page application" (SPA) skriven i vanilla Javascript.

Valet föll på en SPA för det har nästan bara fördelar.

* Reagerar omedelbart på knapp-tryck.
* Laddas inte om i tid och otid vid varje klick.
* Är uppkopplingen långsam kan ett meddelande visas under väntetiden till
skillnad mot en PHP-baserad sida som riskerar bli helt blank.
Är datat som hämtas inte kritiskt kan webbsidan köra vidare och datat tas emot
i bakgrunden.
* Använder lite datatrafik. Endast ett minimum av data hämtas från servern till
skillnad mot tex en PHP-baserad webbsida där hela webbsidan måste laddas om vid
varje klick.
* Är sidan responsiv lämpar den sig mycket väl för att wrappas i en mobil-hybrid-app
eftersom den beter sig som en applikation.
Appen behöver bara starta webbläsaren och visa webbsidan.
En sådan app uppdateras automatisk när webbsidan uppdateras dessutom.

Valet föll på vanilla Javascript därför att användandet av ramverk har inga fördelar,
allt som ett ramverk kan göra kan skrivas i vanilla Javascript.
Däremot finns ett antal nackdelar med ramverk.

* Utvecklaren måste vara insatt i ramverket.
* Laddfilerna blir ofta mycket större och därmed laddas webbsidan långsammare.
* Oftast stora mängder med dependencies.
* Risk för buggar i ramverket som blir svåra att åtgärda.
* Ramverket kan gå ur tiden men Javascript är bakåtkompatibelt och kommer att
fungerar under överskådlig framtid.

Det fanns heller ingen anledning att använda en så kallad "router".
En router kan vara bra om det ska vara möjligt att länka till en viss
undersida men så är inte fallet här.


##### Krav 3

Realtidsaspekten implementerade jag genom en "ticker tape".
Ticker-tejpen består av sex stycken div:ar som förflyttar sig från höger
till vänster.
När en div startar längst till höger får den en aktiekurs inskriven som
den behåller hela vägen till vänsterkanten.
När den nått vänsterkanten flyttas den tillbaka till högerkanten och
processen börjar om med en ny aktiekurs.
Aktiekurserna tas en i taget från en kö, 'tapeQue'.
När kön är tom fylls den på med de senaste aktiekurserna som finns
sparade i en variabel, 'prices', som innehåller de senaste kurserna från severn.
En webbsocket-server skickar hela tiden aktuella aktiekurser i form av JSON som
sparas i variabeln 'prices'.

Ticker-tejpen fungerar men inte optimalt.
Det hade varit bättre och enklare att webbsidan anropade servern när kön började
bli tom i stället för att servern godtyckligt pushar nya aktiekurser.
Det hade dessutom sparat data-trafik.
Jag tolkade dock uppgiften som att det skulle användas webbsocket så därför
är lösningen som den är.


##### Krav 5

1. Gå till index-sidan, kolla att sidans titel är "BTH Trader" och att rubriken är "Login".

2. Logga in med användare 'nils@bth.se' och lösenord '1234'.
Kolla så inget felmeddelande syns och att portfolion syns.

3. Logga in med användare 'nils@bth.se' och lösenord '12345'.
Kolla så att felmeddelandet "Error: Wrong password" syns.

4. Logga in med användare 'nilss@bth.se' och lösenord '1234'.
Kolla så att felmeddelandet "Error: Email not registered" syns.

5. Logga in med användare 'nils@bth.se' och lösenord '1234'.
Kolla så inget felmeddelande syns.
Klicka på 'Transfer'-länken.
Klicka på deposit-knappen.
Fyll i '10000' som amount.
Klicka på 'Transfer'-knappen.
Kolla så inget felmeddelande syns.

6. Logga in med användare 'nils@bth.se' och lösenord '1234'.
Kolla så inget felmeddelande syns.
Klicka på 'Trade'-länken.
Fyll i 'BTH' som stock.
Fyll i '1' som quantity.
Klicka på 'Trade'-knappen.
Kolla så inget felmeddelande syns.

7. Logga in med användare 'nils@bth.se' och lösenord '1234'.
Kolla så inget felmeddelande syns.
Klicka på 'Trade'-länken.
Fyll i 'BTH' som stock.
Fyll i '-1' som quantity.
Klicka på 'Trade'-knappen.
Kolla så inget felmeddelande syns.

8. Logga in med användare 'nils@bth.se' och lösenord '1234'.
Kolla så inget felmeddelande syns.
Klicka på 'Transfer'-länken.
Klicka på withdraw-knappen.
Fyll i '10000' som amount.
Klicka på 'Transfer'-knappen.
Kolla så inget felmeddelande syns.
