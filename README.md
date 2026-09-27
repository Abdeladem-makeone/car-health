<div align="center">

# CNC Pattern Generator

**Générateur de motifs paramétriques pour découpe CNC et laser**

Une application web mono-fichier qui génère des motifs décoratifs
(ondes, tressage, courbes de Lissajous, rosaces, spirales, pavages de
Truchet, treillis d'étoiles zellige, nid d'abeille) pour panneaux
découpés au CNC ou au laser — MDF, plexiglass, contreplaqué — et les
exporte en SVG ou DXF, prêts pour un logiciel de CAM.

</div>

---

## Aperçu

`cnc-pattern-generator.html` est une page HTML/CSS/JavaScript unique,
sans dépendance, sans étape de build et sans serveur : elle s'ouvre
directement dans un navigateur et fonctionne entièrement en local. Tout
se passe côté client — aucune donnée n'est envoyée où que ce soit.

Le principe : on choisit un **type de motif**, un **motif** précis dans
ce type, on ajuste quelques paramètres numériques (taille de
cellule/pas, espacement, rotation ou phase, échelle), on dispose un ou
plusieurs **panneaux** côte à côte, puis on exporte le résultat en SVG
(vecteur) ou DXF (pour CAM/CNC).

## Fonctionnalités

- **Unités** : millimètres ou pouces.
- **Taille de panneau** libre (largeur × hauteur).
- **7 types de motifs, 33 variantes au total**, chacun basé sur des
  mathématiques différentes — pas seulement des ondes sinusoïdales :

  | Type | Variantes | Principe |
  |---|---|---|
  | **Wave / Weave** | 6 | Bandes de sinusoïdes qui se croisent (tressage, motif "œil"/lens classique) |
  | **Lissajous Curves** | 6 | Courbes paramétriques `x=sin(a·t)`, `y=sin(b·t)`, boucles fermées répétées en grille |
  | **Rose Curves** | 6 | Courbes polaires `r=cos(k·θ)` (rosaces à 3, 4, 5, 7, 8 pétales) |
  | **Spirals** | 5 | Spirales d'Archimède (rayon linéaire) ou logarithmiques (rayon exponentiel), 1 à 3 bras |
  | **Truchet Tiles** | 3 | Orientation pseudo-aléatoire *déterministe* par tuile — le seul motif volontairement non répétitif |
  | **Zellige Star Lattice** | 4 | Étoiles à 5/6/8/12 pointes sur grille triangulaire, dans l'esprit des motifs géométriques marocains |
  | **Hex Honeycomb** | 3 | Pavage hexagonal nid d'abeille, bord à bord |

- **Panneaux multiples** disposés en ligne, avec décalage manuel
  (haut/bas/gauche/droite) par panneau, et un mode **"Continuous
  Pattern"** qui aligne parfaitement le motif d'un panneau à l'autre
  (utile pour un ensemble de panneaux qui doivent former un seul grand
  motif continu une fois posés côte à côte).
- **Zoom** sur l'aperçu SVG en temps réel.
- **Export SVG** (chemins vectoriels, à l'échelle en millimètres) et
  **Export DXF** (R12 ASCII, entités `LWPOLYLINE`, calques `PANEL` et
  `WAVE`) — les deux fonctionnent de la même façon pour tous les types
  de motifs.

## Démarrage rapide

Aucune installation nécessaire :

1. Télécharger ou cloner ce dépôt.
2. Ouvrir `cnc-pattern-generator.html` dans un navigateur (double-clic,
   ou glisser-déposer dans une fenêtre du navigateur).
3. Ajuster les paramètres dans le panneau de gauche, prévisualiser à
   droite, puis exporter en SVG ou DXF.

## Guide d'utilisation

1. **Units** — choisir mm ou pouces (les champs numériques sont alors
   interprétés dans cette unité).
2. **Panel Size** — largeur et hauteur du panneau.
3. **Pattern Settings** :
   - **Pattern Type** — le type de motif (Wave, Lissajous, Rose,
     Spiral, Truchet, Zellige, Hex).
   - **Motif** — la variante précise à l'intérieur de ce type.
   - Les 6 champs numériques qui suivent (Step, Gap, Offset, Wave
     Offset, Width/Height Scale) sont **partagés par tous les types**
     mais changent de sens et d'étiquette selon le type choisi — par
     exemple *Wave Offset* devient *Random Seed* pour les pavages de
     Truchet, ou *Rotation (deg)* pour les rosaces/spirales/zellige.
     **Offset** est toujours calculé automatiquement (lecture seule) :
     c'est le pas de répétition réel du motif.
4. **Panel Layout** — ajouter/dupliquer/supprimer des panneaux, les
   déplacer avec le pavé directionnel, activer *Continuous Pattern*
   pour un raccord parfait entre panneaux adjacents.
5. **Export SVG / Export DXF** — télécharge le résultat final, prêt à
   importer dans un logiciel de CAM/CNC.

## Pile technique

- HTML + CSS + JavaScript (ES6) pur, dans un IIFE unique — aucune
  dépendance, aucun bundler.
- Rendu : SVG inline (`<polyline>` par ligne de motif, `<rect>` par
  panneau).
- Export : chaînes SVG et DXF construites à la main (pas de librairie
  DXF externe).
- Thème sombre "atelier", accent orange sécurité, aperçu sur fond
  "papier" pour évoquer un plan technique posé sur un tapis de découpe.

## Architecture du code

Le script est organisé autour de **types de motifs**, chacun avec sa
propre liste de **familles** (les variantes) et sa propre fonction
génératrice. Chaque génératrice renvoie une simple liste de polylignes
déjà découpées aux limites du panneau, en coordonnées millimétriques
locales au panneau — c'est le seul contrat que le rendu et les
exports SVG/DXF exigent, donc ajouter un type de motif ne touche
jamais au code de rendu ou d'export.

Les types basés sur une grille (Lissajous, Rose, Spiral, Truchet,
Zellige, Hex) partagent une fonction `gridCells()` qui positionne les
centres de cellules sur le panneau — ancrée sur la position absolue X
du panneau quand *Continuous Pattern* est actif, pour un raccord
parfait entre panneaux, exactement comme la phase du motif Wave.
Une fonction générique `clipPolylineRect()` (découpe sur Y puis sur X,
en interpolant les deux coordonnées à chaque frontière) remplace
l'ancien découpage limité à Y et fonctionne pour tous les types, y
compris les boucles fermées qui sortent et rentrent dans le panneau
par n'importe quel bord.

Ajouter un nouveau type de motif : une entrée `{ id, families }` dans
`PATTERN_TYPES`, une fonction génératrice, une entrée dans
`PATTERN_FIELD_CONFIG` (comment étiqueter/afficher les 6 champs
partagés pour ce type), et un `case` dans le dispatcher
`generatePanelLines()` — rien d'autre à modifier. Ajouter une variante
à un type existant : un seul objet de plus dans le tableau de familles
de ce type.

<details>
<summary>Détail mathématique de chaque type de motif</summary>

### Wave / Weave

Bandes horizontales de `n` lignes sinusoïdales. `taper: 'lens'` fait
varier l'amplitude linéairement de `+A` à `-A` sur les `n` lignes (les
lignes se croisent et se pincent aux mêmes nœuds, effet "œil").
`taper: 'zigzag'` alterne simplement `+A`/`-A`.

```
y(x) = yBase + Ak * sin(2π·(globalX + x)/λ + parity + phaseShift)
```

- `λ` = `2 * step * (widthScale/100)`
- `A` = `0.9 * step * (heightScale/100)`
- `parity` = `π` toutes les deux bandes (décalage type "brique")
- `phaseShift` = `(waveOffset / λ) * 2π`
- Pas de bande (**Offset**) = `(n - 1) * step + gap`

### Lissajous Curves

Une boucle fermée par cellule : `x = R·sin(a·t + phase)`,
`y = R·sin(b·t)`. Le ratio entier `a:b` (3:2, 5:4, 2:1, 5:2, 7:6, 4:3)
détermine la forme de la boucle.

### Rose Curves

Courbe polaire `r = R·cos(k·θ)`, une rosace par cellule sur une grille
en quinconce pour un bon entrelacement. `k` détermine le nombre de
pétales.

### Spirals

1 à 3 bras entrelacés par cellule, en spirale d'Archimède
(`r = maxR·t`, linéaire) ou logarithmique (`r = r₀·e^(b·θ)`,
exponentielle/équiangulaire).

### Truchet Tiles

Chaque tuile de la grille reçoit une orientation pseudo-aléatoire mais
déterministe (fonction de hachage des coordonnées de la tuile et de
**Random Seed**) : arcs de cercle, diagonale, ou mélange des deux. Le
même seed reproduit toujours le même pavage.

### Zellige Star Lattice

Un polygone étoilé à `N` pointes (rayons alternés) à chaque point
d'une grille triangulaire, dans l'esprit des motifs géométriques
marocains/islamiques (variantes 5/6/8/12 pointes).

### Hex Honeycomb

Pavage hexagonal "flat-top" bord à bord classique, avec variante à
hexagone intérieur concentrique ou à entretoises radiales.

</details>

## Limites connues / pistes d'évolution

- La disposition des panneaux est actuellement en une seule ligne —
  pas de grille (lignes × colonnes), pas de glisser-déposer.
- Aucune persistance : recharger la page réinitialise tous les
  réglages et panneaux.
- L'export DXF reste minimal (R12, deux calques, pas de gestion des
  couleurs/types de ligne).
- Aucun avertissement de collision quand le pas choisi est plus petit
  qu'un diamètre de fraise plausible.
- Pas de modulation d'amplitude par image (relief piloté par niveaux de
  gris).
- Pas d'undo/historique.
- Le treillis zellige est une version simplifiée (polygones étoilés
  tuilés), pas la construction géométrique complète au compas avec
  entrelacs.
- Le seed des pavages de Truchet se règle manuellement — pas de bouton
  "mélanger" dédié.

## Contexte

Développé pour remplacer un outil de bureau fermé ("Wave 5", panneau
500×500 mm, Step 23 / Offset 44 en référence) utilisé pour générer des
motifs de panneaux ondulés réutilisables destinés à l'agencement
décoratif et à la production, dans un atelier CNC + laser.
