# Lapidim Alumni Website

A bilingual (English/Hebrew) alumni website for the Lapidim Excellence Program at the Technion - Israel Institute of Technology.

## Features

- **Bilingual Support**: Full English and Hebrew language support with RTL layout
- **Alumni Spotlight**: Showcase successful alumni and their achievements
- **Members Area**: Protected section for alumni with events and certificate management
- **Certificate Verification**: Public verification of alumni certificates
- **LinkedIn Integration**: Add certificates directly to LinkedIn profiles
- **Responsive Design**: Mobile-first design that works on all devices

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6 (Hash routing for GitHub Pages)
- **State Management**: React Context
- **Deployment**: GitHub Pages via GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/         # Header, Footer, Layout
│   ├── ui/             # Reusable UI components
│   └── features/       # Feature-specific components
├── contexts/           # React Context providers
├── data/               # Static data and translations
├── hooks/              # Custom React hooks
├── pages/              # Page components
└── utils/              # Utility functions
```

## Demo Accounts

For testing the login functionality:

- `test@lapidim.technion.ac.il`
- `alumni@example.com`

## Deployment

The site is automatically deployed to GitHub Pages when pushing to the `main` branch.

### Manual Deployment

1. Push to the `main` branch
2. GitHub Actions will automatically build and deploy
3. Access at: `https://<username>.github.io/lapidim-alumni-code/`

## Certificate Verification

Alumni certificates can be verified at:
`/#/verify/{certificate-id}`

Example: `/#/verify/LAPD-2018-2023-0001`

## License

MIT License - See LICENSE file for details
