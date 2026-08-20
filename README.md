# Blocky World Cup — Stadium Edition 2010

## Lancer le jeu dans VS Code

1. Ouvrir le dossier **blocky-world-cup-2010** dans VS Code.
2. Installer l’extension **Live Server** si elle n’est pas déjà installée.
3. Faire un clic droit sur **index.html**, puis **Open with Live Server**.

Sans extension, ouvrir un terminal dans ce dossier et lancer :

    python -m http.server 8000

Puis ouvrir **http://localhost:8000**.

## Mise en ligne

Le dossier peut être déposé tel quel sur Vercel ou placé à la racine d’un dépôt GitHub relié à Vercel. **index.html** doit rester à la racine et le dossier **assets** doit être conservé.

## Commandes

- ZQSD, WASD ou flèches : déplacement
- Maj : sprint
- E : passe
- Espace : tir chargé avec le ballon
- Espace : récupération directe quand un adversaire proche possède le ballon
- F : tacle classique
- C : changer de joueur
- P ou Échap : pause

Sur PC, une barre colorée récapitule les commandes dans le menu et une aide compacte reste visible pendant le match. Les boutons tactiles apparaissent automatiquement sur téléphone et tablette.

## Direction artistique

La version **Bilingual Fun Cup 2.3** adopte une ambiance de Coupe du monde destinée à un jeune joueur : couleurs lumineuses, confettis, cartes d’équipes claires, contrastes renforcés et références graphiques aux jeux de football rétro sans assombrir l’interface.

## Modes de jeu

- **Match rapide** : une rencontre classique avec les équipes et les réglages choisis.
- **Coupe mondiale** : trois tours successifs — quart de finale, demi-finale et finale — avec tirage automatique des adversaires.
- **Entraînement** : séance de cinq minutes en difficulté Découverte pour travailler les passes, les tirs, la récupération et les tacles.

Les sélecteurs d’équipes utilisent une liste personnalisée avec le drapeau de chaque pays. Un nouveau favicon coloré représentant une coupe et un ballon est fourni directement à la racine du projet.

## Français et anglais

Le bouton **FR / EN** du menu et du match traduit les modes, les réglages, les pays, les messages de jeu, la pause et l’écran final. Les principales commandes affichent aussi les mots français et anglais côte à côte — par exemple **Passe / Pass** et **Tir / Shoot** — pour permettre un apprentissage simple pendant le jeu.

## Difficulté et assistance du joueur

- **Découverte** ralentit fortement l’équipe adverse, diminue ses tacles et réduit sa précision.
- **Débutant assisté** accélère le joueur humain, améliore son endurance, agrandit la zone de récupération, facilite les tacles et aide à cadrer les tirs.
- **Joueur confirmé** conserve une aide modérée.
- **Expert sans aide** revient à un contrôle plus exigeant.

Les partenaires de l’équipe du joueur gardent un niveau utile même en mode Découverte : seule l’équipe adverse est fortement ralentie. L’ancien texte décoratif « Profil joueur · Niv. 10 » a été remplacé par ce vrai réglage d’assistance.

## Adaptation aux appareils

- **PC** : terrain complet, commandes clavier et interface large.
- **Tablette** : terrain complet en paysage, joystick et boutons tactiles agrandis.
- **Mobile paysage** : interface compacte et commandes tactiles adaptées aux pouces.
- **Mobile portrait** : menu vertical, jaquette recomposée et caméra qui suit l’action sur le terrain.

Les quatre affichages utilisent exactement le même moteur de match, les mêmes règles, la même physique du ballon et la même intelligence artificielle.

## Ressources

Les deux photographies de l’écran d’ouverture sont normalement dans **assets**. Le jeu accepte aussi automatiquement les copies placées à la racine du dépôt GitHub. Les drapeaux détaillés sont chargés depuis FlagCDN ; un code pays reste visible si la connexion n’est pas disponible.

La musique **assets/opening-theme.m4a** démarre après le premier clic ou l’appui sur Entrée, conformément aux règles des navigateurs. Elle reste active dans le menu et s’arrête progressivement au lancement du match.

Pendant le match, le jeu produit sa propre bande-son sportive électronique : batterie rapide, basse, synthés et ambiance de tribunes. Cette musique est désormais pré-calculée puis jouée comme une seule boucle légère, afin d’éviter l’accumulation d’objets audio. Le bouton Son du menu ou du match coupe simultanément la musique et les bruitages.

## Stabilité

Le décor fixe du stade est mis en cache et l’interface est actualisée à fréquence réduite pour alléger le navigateur. Un contrôle interne répare les positions invalides du ballon ou des joueurs et la boucle d’animation continue même si une erreur isolée survient.
