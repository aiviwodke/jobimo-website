# JOBIMO – Website-MVP

**Positionierung:** Minijobs und Studentenjobs gleichberechtigt  
**Startgebiet:** Mecklenburg-Vorpommern; später schrittweise deutschlandweit

## Dateien

- `index.html` – Startseite, Suche und Filter
- `styles.css` – Gestaltung und mobile Darstellung
- `app.js` – Suche, Filter, Beispieldaten und optionaler Live-Abruf
- `supabase-config.js` – öffentliche Supabase-Projekt-URL und öffentlicher anon-/publishable-Key
- `schema.sql` – Grundschema für eine komplett neue Supabase-Datenbank
- `supabase/migrations/20261117_public_jobs_view.sql` – sichere Leseschnittstelle für ein bereits bestehendes Supabase-Projekt

## Was funktioniert?

- Minijobs und Studentenjobs sind gleichberechtigt dargestellt.
- Suche nach Stichwort und Stadt.
- Filter nach Jobart und Branche.
- Mobile und Desktop-Ansicht.
- Wenn Supabase konfiguriert ist, lädt die Website freigegebene Stellen aus `public_jobs`.
- Wenn Supabase noch nicht konfiguriert ist, werden klar gekennzeichnete Beispieldaten angezeigt.
- Live-Stellen verlinken auf die hinterlegte Bewerbungsseite.

## Supabase für das bestehende Projekt verbinden

1. Öffne dein bestehendes Projekt im Supabase-Dashboard.
2. Öffne den **SQL Editor**.
3. Öffne die Datei `supabase/migrations/20261117_public_jobs_view.sql`, kopiere den gesamten Inhalt in den SQL Editor und führe ihn aus.
4. Öffne `supabase-config.js`.
5. Trage dort deine Supabase Project URL und den öffentlichen anon-/publishable-Key ein. Du findest beides in den API-Einstellungen deines Supabase-Projekts.
6. Speichere die Datei und veröffentliche die Änderungen über dein bestehendes GitHub-/Hosting-Projekt.

**Wichtig:** Verwende ausschließlich den öffentlichen anon-/publishable-Key. Der `service_role`- oder ein anderer Secret-Key darf niemals in `supabase-config.js`, `app.js` oder sonstigen Browserdateien stehen.

## Datenbank-Hinweis

`schema.sql` ist nur für eine neue Datenbank gedacht. Da das JOBIMO-Supabase-Projekt bereits Tabellen besitzt, führe `schema.sql` nicht erneut aus. Verwende für dieses Update nur die separate Migration unter `supabase/migrations/`.

Die Migration stellt eine öffentliche Leseschnittstelle bereit. Sie veröffentlicht nur aktive, freigegebene und nicht abgelaufene Jobs und gibt keine Arbeitgeber-E-Mail-Adressen aus.

## Was noch nicht enthalten ist

- Es gibt noch kein Arbeitgeber-Formular, das direkt in Supabase speichert.
- Es gibt noch keinen Adminbereich zur Freigabe von Stellen.
- Neue Jobs müssen derzeit über einen gesicherten Admin-/Serverprozess in die Datenbank eingetragen und auf `active` gesetzt werden.
- Es gibt noch keinen automatischen Job-Feed. Nur Anzeigen, für die eine rechtmäßige Veröffentlichungsgrundlage besteht, dürfen übernommen werden.

Öffentliche Schreibzugriffe und der Supabase-Service-Role-Key im Browser sind ausdrücklich nicht vorgesehen.

## Lokal testen

Die `index.html` kann im Browser geöffnet werden. Für den Live-Abruf sollte die Website über deinen normalen Hosting-Anbieter bereitgestellt werden, damit externe Skripte und die Supabase-Verbindung zuverlässig geladen werden.

## Bestehendes GitHub-Projekt aktualisieren

Die Dateien aus dem ZIP in das Hauptverzeichnis deines bestehenden Website-Repositories kopieren und gleichnamige Dateien ersetzen. Den Ordner `supabase/migrations/` mit hochladen. Danach Änderungen committen. Das bestehende Repository und Hosting-Projekt müssen nicht neu angelegt werden.
