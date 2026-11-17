# JOBIMO – Nebenjob-Plattform (MVP)

**Positionierung:** „Finde deinen richtigen Nebenjob.“  
**Jobarten:** Minijobs und Studentenjobs (gleichberechtigt).  
**Startregion:** Mecklenburg-Vorpommern; später schrittweise deutschlandweit.

## Inhalt

- `index.html` – Startseite und Suchoberfläche
- `styles.css` – Gestaltung und responsive Darstellung
- `app.js` – Such- und Filterlogik mit ausdrücklich gekennzeichneten Beispieldaten
- `schema.sql` – Supabase-Grundschema für eine neue Datenbank

## Lokal testen

ZIP entpacken und `index.html` im Browser öffnen. Es ist kein Build-Schritt erforderlich.

## Funktionen im aktuellen Prototyp

- Gleichberechtigte Auswahl von Minijobs und Studentenjobs
- Suche nach Tätigkeit, Stichwort und Stadt
- Filter nach Jobart und Branche
- Regionale Vorauswahl für Städte in Mecklenburg-Vorpommern
- Responsive Darstellung für Smartphone und Desktop

## Wichtig: Noch keine Live-Stellen

Die zwölf Stellen in `app.js` sind vollständig erfundene Beispieldaten. Sie dienen ausschließlich dazu, Design, Suche und Filter zu testen. Es gibt noch keinen Live-Feed und keine echte Bewerbungsfunktion. Erst nach Anbindung einer rechtmäßig nutzbaren Datenquelle oder echter Arbeitgeberanzeigen dürfen reale Stellen veröffentlicht werden.

## Bestehendes GitHub-/Cloudflare-Projekt aktualisieren

1. ZIP entpacken.
2. Im bestehenden GitHub-Repository `jobimo-website` die bisherigen Dateien `index.html`, `styles.css`, `app.js`, `README.md` und `schema.sql` durch die gleichnamigen Dateien aus diesem Paket ersetzen.
3. Die Dateien im Repository-Hauptverzeichnis ablegen (nicht den übergeordneten ZIP-Ordner als zusätzliche Unterebene hochladen).
4. Änderungen committen. Cloudflare Pages/Workers kann anschließend wie bisher aus dem bestehenden Projekt aktualisieren.

Die bestehende Cloudflare-Konfiguration und das GitHub-Repository müssen dafür nicht neu angelegt werden. Keine Zugangsschlüssel oder Secrets in diese Website-Dateien eintragen.

## Supabase-Hinweis

`schema.sql` ist für eine neue Datenbank ausgelegt und begrenzt die vorgesehenen Beschäftigungsarten auf `minijob` und `werkstudent` (im Frontend als „Studentenjob“ bezeichnet). Wenn das Schema bereits in deinem bestehenden Supabase-Projekt ausgeführt wurde, diese Datei nicht einfach erneut ausführen: `CREATE TABLE IF NOT EXISTS` ändert vorhandene Tabellen-Constraints nicht. Vor einer Datenbankmigration zuerst den aktuellen Tabellenstand und vorhandene Datensätze prüfen.

Der Supabase-Service-Role-Key darf niemals im Browsercode stehen. Öffentliche Schreibrechte sind nicht eingerichtet.
