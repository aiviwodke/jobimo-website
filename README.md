# JOBORA – MVP-Prototyp

Ein statischer, mobilfreundlicher Website-Prototyp für eine KI-gestützte Nebenjob-Suche in Mecklenburg-Vorpommern.

## Lokal starten

1. ZIP entpacken.
2. `index.html` im Browser öffnen.

Es wird kein Build-Schritt benötigt. Für lokale Entwicklung kann auch ein einfacher HTTP-Server verwendet werden.

## Was funktioniert?

- Suchfeld für Tätigkeiten und Jobbegriffe
- Ortsfilter für ausgewählte Städte in Mecklenburg-Vorpommern
- Filter für Beschäftigungsart und Branche
- Trennung zwischen direkten Treffern und ähnlichen Branchen
- Branchen-Schnellzugriffe
- Responsive Darstellung für Smartphones

## Wichtige Einschränkung

Alle enthaltenen Stellen, Unternehmen und Konditionen sind ausdrücklich erfundene Beispieldaten. Die Karten haben keine Bewerbungslinks. Es gibt noch keine Live-Datenbank, keine Arbeitgeberkonten und keine KI-API. Die Suchlogik im Browser ist eine regelbasierte Demonstration, kein echtes KI-Modell.

## Nächster Entwicklungsschritt

Supabase-Datenbank und Admin-Oberfläche anbinden, danach nur rechtmäßig bereitgestellte Stellenquellen und Arbeitgeber-Einreichungen integrieren. Vor dem öffentlichen kommerziellen Betrieb Hosting-, Datenschutz-, Impressums- und Datenlizenzfragen prüfen.

## Datenbank-Vorbereitung

`schema.sql` enthält ein erstes Supabase-PostgreSQL-Schema für Arbeitgeber, Kategorien, verwandte Kategorien, Quellen und Stellen. Es erlaubt öffentlichen Nutzern nur das Lesen aktiver, veröffentlichter Stellen. Öffentliche Schreibrechte sind absichtlich nicht eingerichtet; Arbeitgeber-Einreichungen benötigen später eine validierte, geschützte Schnittstelle.
