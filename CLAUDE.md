# CLAUDE.md

Ce fichier fournit des indications à Claude Code (claude.ai/code) pour travailler dans ce dépôt.

## Présentation du projet

**Kadja Health** est une application React SPA mobile-first pour la gestion de la santé dans le contexte africain (Tchad). C'est un prototype utilisant des données fictives — il n'y a ni backend, ni base de données, ni système d'authentification.

L'application est déployée via **Google AI Studio** (`metadata.json` y fait référence). La `GEMINI_API_KEY` est injectée au moment de l'exécution par AI Studio ; en local, il faut la définir dans `.env.local`.

## Commandes

```bash
npm install          # Installer les dépendances
npm run dev          # Démarrer le serveur de développement sur http://localhost:3000
npm run build        # Build de production (Vite)
npm run preview      # Prévisualiser le build de production
npm run lint         # Vérification TypeScript uniquement (tsc --noEmit)
npm run clean        # Supprimer le dossier dist/
```

Aucune suite de tests n'est configurée.

## Architecture

### Frontend en fichier unique

Toute l'interface est dans **`src/App.tsx`** (~3 300 lignes). C'est intentionnel pour la phase prototype — chaque écran, composant, interface et jeu de données fictif y est défini. Il n'existe pas de structure de dossiers pour les composants.

`src/main.tsx` monte `<App />` dans `#root`. `src/index.css` importe Tailwind et définit les variables CSS du thème.

### Gestion de l'état

Tout l'état est géré avec `useState` dans le composant racine `App` — pas de Context, reducers ni bibliothèque externe. Le routage entre écrans est assuré par une variable `currentScreen` de type `Screen` (union de littéraux de chaîne). La navigation met à jour cette valeur ; le rendu retourne conditionnellement le composant correspondant.

### Couche de données

Toutes les données sont fictives et en mémoire. Tableaux principaux : `MOCK_DOCTORS` et `MOCK_PATIENTS`. Il n'y a aucune persistance — l'état est réinitialisé à chaque rechargement de page. Les packages `@google/genai` et `express` sont listés en dépendances mais ne sont pas utilisés dans le code actuel.

### Intégration externe

L'écran **SIS** intègre un tableau de bord gouvernemental externe via iframe : `https://sis.sante.gouv.td/sisr/dhis-web-dashboard/`.

## Types principaux

```typescript
type Screen = 'Accueil' | 'SSR' | 'Soins' | 'Données' | 'ZLECAf' | 'SIS' |
              'PatientDetail' | 'AddPatient' | 'Assurance' | 'Profile' |
              'DoctorProfile' | 'StaffRegistration' | 'Telemedicine' | 'Vaccination';

interface Patient { id, name, age, gender, bloodType, phone, email, address,
                    medicalHistory, recentConsultations, labResults, status, registeredAt }
interface Doctor  { id, name, specialty, location, experience, patientsCount, rating, bio, availability }
interface Consultation { date, reason, doctor, notes, type, reminderDate, reminderTime, medicationReminders }
```

## Styles

Tailwind CSS v4 (via `@tailwindcss/vite`). Les tokens du thème sont définis comme variables CSS dans `src/index.css` :

| Token | Valeur | Usage |
|---|---|---|
| `--color-sleek-bg` | `#f0f2f5` | Fond de page |
| `--color-sleek-sidebar` | `#1e293b` | Surfaces sombres |
| `--color-sleek-accent` | `#3b82f6` | Bleu principal |
| `--color-sleek-status` | `#10b981` | Vert succès/actif |

Police : Inter via Google Fonts. Largeur max du conteneur : 768px (mobile-first).

## Notes sur la config Vite

- `GEMINI_API_KEY` est injectée dans `import.meta.env` via `define` dans `vite.config.ts`
- Le HMR est désactivé quand `DISABLE_HMR=true` (utilisé lors des modifications par les agents AI Studio)
- La surveillance des fichiers est également désactivée dans ce cas pour éviter les scintillements

## Écrans / Navigation

Six onglets en bas : **Accueil** (tableau de bord), **Assurance**, **SSR** (santé sexuelle & reproductive), **Soins** (services médicaux), **Données** (placeholder), **SIS** (iframe externe).

Écrans supplémentaires accessibles via `setCurrentScreen` : `PatientDetail`, `AddPatient`, `DoctorProfile`, `StaffRegistration`, `Telemedicine`, `Vaccination`, `Profile`.
