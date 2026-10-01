# S6 Exercices — IFT359 : Programmation Fonctionnelle

## Prérequis

- [Node.js](https://nodejs.org/) (version LTS recommandée)

## Installation

Une fois Node.js installé, ouvrez un terminal à la racine du projet et exécutez la commande `npm install` pour installer les dépendances nécessaires.

## Structure du projet

- Le code source TypeScript se trouve dans le répertoire `src/` (point d'entrée : `src/index.ts`).
- Le code JavaScript compilé est généré dans le répertoire `dist/`.

## Commandes disponibles

| Commande             | Description                                                                                   |
| :------------------- | :-------------------------------------------------------------------------------------------- |
| `npm run dev`        | Exécute le code TypeScript.                                                                   |
| `npm run dev:watch`  | Exécute et surveille le code TypeScript avec rechargement automatique à chaque sauvegarde.    |
| `npm run build`      | Vérifie les types et compile le projet TypeScript vers JavaScript dans le dossier `dist/src`. |
| `npm start`          | Exécute le code JavaScript compilé (`dist/src/index.js`) avec Node.js.                        |
| `npm run clean`      | Supprime le dossier `dist/` contenant les fichiers compilés.                                  |
| `npm run test`       | Exécute les tests.                                                                            |
| `npm run test:watch` | Exécute les tests et surveille le code TypeScript                                             |

# Exercice - Machine distributrice

Nous allons modéliser une machine distributrice. Tous les prix sont en cents.

Voici la description de la machine:

- Un espresso coûte 100, un chocolat 150 et un thé 80.
- Si la machine est en_attente et qu'on insère des pièces, elle passe à credit_insere.
- On peut insèrer des pièces plusieurs fois pour augmenter le solde.
- Si on choisit une boisson avec assez de crédit, elle sert la boisson, rend la monnaie restante et repasse à l'état en_attente.
- Si le crédit est insuffisant, l'état reste inchangé et un message d'erreur est émis.
- Si la machine est hors_service, toute pièce insérée est rejetée.
- On peut annuler une opération et recevoir le solde restant.

Le fichier model.ts, définit le modèle de données.

## Partie 1 - Version avec fermeture

Dans le fichier impl-fermeture.ts, écrire la fonction `creerDistributrice`.
Ajouter des fonctions dans model.ts au besoin (pour construire la barrière d'abstraction).

Une suite de test est disponible: impl-fermeture.test.ts.

## Partie 2 - Version avec passage d'état

Dans le fichier impl-state-passing.ts, écrire les 3 fonctions qui représentent les actions possibles.
Ajouter des fonctions dans model.ts au besoin (pour construire la barrière d'abstraction).

Une suite de test est disponible: impl-state-passing.test.ts.
