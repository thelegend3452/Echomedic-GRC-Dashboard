# 1 Last ned:
Beskrivelsene er satt opp for intellij

clone repositoried fra git med denne lenken
https://github.com/Nyllooc/Echomedic-GRC-Dashboard.git

# 2 Sette opp mongoDb:
### Vikig ikke bruk vpn under prossessen mongo db bruker ip adresse for å passe på at ikke uønskede brukere kommer på

gå til https://www.mongodb.com/ og trykk på get started for å lage en bruker

under oppstart vil du bli promtet til å lage en cluster da for å starte, ellers må du trykke på create cluster.

Du må velge tier for å fortsette, for nå velg free tier for å teste programmet, kan hende for komersiell bruk at et betalt nivå er
nødvendig. 

Navngi clusteren noe som er relevant til programmet (DashboardData burkes i eksempelet)
og trykk på create deployment.

Tyrkk på create database user og så choose connection method

Velg drivers som din connection method

kopier den connection stringen som blir gitt og ta vare på den, ikke push den til git
eller andre steder hvor fremmede får tak i den og trykk done

eksempel streng
mongodb+srv://username:<db_password>@cluster0.bummjrs.mongodb.net/?appName=Cluster0


# 3 Gjøre klar server:
gå in i server mappen i prosjektet og lag en fil som heter .env

i env filen putter du:

MONGODB_URL=connection string fra mongodb DIN STRING

mongodb+srv://username:<db_password>@cluster0.bummjrs.mongodb.net/?appName=Cluster0

hvis du vil endre navnet på db kan du gjøre det i starten av server.ts filen
med å endre på
* const databaseName = "Dashboard_Data"

og for å endre på navnet på samlingene endre på toppen av databaseApi.ts

* const riskdata = "riskdata";
* const complianceData = "complianceData";


# 4 Starte programmet:

1. instaler NodeJs hvis det ikke er instalert https://nodejs.org/en/download (for å teste i console ```npm -v```)
2. i console: ```npm install```
3. i console:  ```npm run dev```
4. gå til http://localhost:5173/
5. Inne på siden trykk på SjekkListe
6. inne på SjekkListe trykk på Importer JSON og importer den tildelte json filen for å fylle inn i db

