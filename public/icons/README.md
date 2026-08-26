# Icons für Zwanzig ab

Hier kommen die Bilddateien für die vier Farben hinein. Alles in `public/` wird
unverändert ausgeliefert und ist im Browser unter `/icons/<datei>` erreichbar.

## Erwartete Dateinamen

Die Namen müssen exakt den Trumpf-Schlüsseln aus `src/game/zwanzigAb/types.ts` entsprechen:

| Datei | Farbe |
| --- | --- |
| `eichel.png` | Eichel |
| `gruen.png` | Grün |
| `schellen.png` | Schellen |
| `herz.png` | Herz |

## Worauf es ankommt

- **Transparenter Hintergrund**, sonst steht ein Kasten um das Motiv.
- **Quadratisch** und mindestens **192 × 192 px**. Angezeigt werden sie mit rund 40 px,
  auf Handys mit dreifacher Pixeldichte werden daraus 120 px — kleinere Dateien sehen
  dort ausgefranst aus.
- **Helles Motiv**, weil der Hintergrund der App dunkel ist.

## Wichtig: die ausgewählte Kachel dreht die Farben um

Ausgewählte Kacheln werden invertiert — heller Hintergrund, dunkle Schrift. Die
gezeichneten SVG-Icons machen das automatisch mit, weil sie `currentColor` benutzen.
**Ein PNG kann das nicht.** Ein weißes Motiv würde auf der hellen Fläche verschwinden.

Zwei Wege, das zu lösen:

1. **`filter: invert(1)` auf der ausgewählten Kachel** — funktioniert bei einfarbigen
   Motiven gut, macht aus mehrfarbigen aber Falschfarben.
2. **Farbige Motive verwenden**, die auf hell wie dunkel funktionieren (etwa rote Herzen).

Sag Bescheid, welcher Weg es sein soll, sobald die Dateien hier liegen.
