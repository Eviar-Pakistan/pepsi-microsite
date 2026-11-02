# Young Stunners × Pepsi Microsite

Mobile-first React frontend for the Pepsi × Young Stunners personalized video campaign.

## Stack

- Vite + React
- PepsiOwners2 fonts (Regular + Extended)
- Screen state in-app (no router yet)

## Screens

1. **Home** — hero + CTA
2. **Form** — name / email / city
3. **Loading** — “Let them cook” vinyl progress (clears on refresh → Home)
4. **How It Works** — 4-step cards

T&C’s nav item is visible but does not navigate yet. Video API is deferred.

## Develop

```bash
npm install
npm run dev
```

## Structure

```
src/
  assets/
    fonts/
    images/
      home/
      form/
      how-it-works/
  components/   # Header, CtaButton
  screens/      # Home, Form, Loading, HowItWorks
  App.jsx
```
