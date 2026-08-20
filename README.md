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

Les boutons tactiles apparaissent automatiquement sur téléphone et tablette.

## Ressources

Les deux photographies de l’écran d’ouverture sont dans **assets**. Les drapeaux détaillés sont chargés depuis FlagCDN ; un code pays reste visible si la connexion n’est pas disponible.
