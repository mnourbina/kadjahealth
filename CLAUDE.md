# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Kadja Health** is a mobile-first, frontend-only React SPA for healthcare management in the African context (Chad). It is a prototype using mock data — there is no backend, database, or authentication system.

The app is deployed via **Google AI Studio** (`metadata.json` references it). The `GEMINI_API_KEY` is injected at runtime by AI Studio; locally, set it in `.env.local`.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build (Vite)
npm run preview      # Preview production build
npm run lint         # TypeScript type checking only (tsc --noEmit)
npm run clean        # Remove dist/
```

There is no test suite configured.

## Architecture

### Single-File Frontend

All UI lives in **`src/App.tsx`** (~3,300 lines). This is intentional for the prototype phase — every screen, component, interface, and mock dataset is defined here. There is no component folder structure.

`src/main.tsx` renders `<App />` into `#root`. `src/index.css` imports Tailwind and defines CSS custom properties for the theme.

### State Management

All state is managed with `useState` in the top-level `App` component — no Context, reducers, or external state libraries. Screen routing is handled by a `currentScreen` state variable of type `Screen` (a union of string literals). Navigation updates this value; the render section conditionally returns the matching screen component.

### Data Layer

All data is mock/in-memory. Key mock arrays: `MOCK_DOCTORS` and `MOCK_PATIENTS`. There is no persistence — state resets on page refresh. The `@google/genai` and `express` packages are listed as dependencies but are not currently used in the codebase.

### External Integration

The **SIS screen** embeds an external government dashboard via iframe: `https://sis.sante.gouv.td/sisr/dhis-web-dashboard/`.

## Key Types

```typescript
type Screen = 'Accueil' | 'SSR' | 'Soins' | 'Données' | 'ZLECAf' | 'SIS' |
              'PatientDetail' | 'AddPatient' | 'Assurance' | 'Profile' |
              'DoctorProfile' | 'StaffRegistration' | 'Telemedicine' | 'Vaccination';

interface Patient { id, name, age, gender, bloodType, phone, email, address,
                    medicalHistory, recentConsultations, labResults, status, registeredAt }
interface Doctor  { id, name, specialty, location, experience, patientsCount, rating, bio, availability }
interface Consultation { date, reason, doctor, notes, type, reminderDate, reminderTime, medicationReminders }
```

## Styling

Tailwind CSS v4 (via `@tailwindcss/vite`). Custom theme tokens are defined as CSS variables in `src/index.css`:

| Token | Value | Use |
|---|---|---|
| `--color-sleek-bg` | `#f0f2f5` | Page background |
| `--color-sleek-sidebar` | `#1e293b` | Dark surfaces |
| `--color-sleek-accent` | `#3b82f6` | Primary blue |
| `--color-sleek-status` | `#10b981` | Success/active green |

Font: Inter via Google Fonts. Max container width: 768px (mobile-first).

## Vite Config Notes

- `GEMINI_API_KEY` is injected into `import.meta.env` via `define` in `vite.config.ts`
- HMR is disabled when `DISABLE_HMR=true` (used by AI Studio agent edits)
- File watching is disabled in the same condition to prevent flickering

## Screens / Navigation

Six bottom-nav tabs: **Accueil** (home/dashboard), **Assurance** (insurance), **SSR** (sexual & reproductive health), **Soins** (medical services), **Données** (data — placeholder), **SIS** (external iframe).

Additional screens pushed via `setCurrentScreen`: `PatientDetail`, `AddPatient`, `DoctorProfile`, `StaffRegistration`, `Telemedicine`, `Vaccination`, `Profile`.
