# Parami - Daily Buddhist Wisdom App

A React Native mobile app that delivers one of the 10 Buddhist Paramis (perfections) each day with inspiring quotes and practical suggestions.

## Features

- **Daily Parami Delivery**: Universal randomized rotation ensures all users see the same Parami each day
- **Rich Content**: Each Parami includes:
  - Full description and meaning
  - Inspiring quote from Buddhist teachings
  - 3 practical suggestions for daily life
- **Daily Notifications**: Customizable reminders to check today's Parami
- **Beautiful Design**: Sophisticated UI inspired by Buddhist aesthetics with warm earth tones

## The 10 Paramis

1. **Dana** — Generosity
2. **Sila** — Virtue
3. **Nekkhamma** — Renunciation
4. **Panna** — Wisdom
5. **Viriya** — Energy
6. **Khanti** — Patience
7. **Sacca** — Truthfulness
8. **Adhitthana** — Determination
9. **Metta** — Loving-kindness
10. **Upekkha** — Equanimity

## Tech Stack

- **Framework**: React Native with Expo SDK 54
- **Navigation**: Expo Router (file-based routing)
- **Language**: TypeScript
- **Storage**: AsyncStorage
- **Notifications**: expo-notifications
- **Icons**: @expo/vector-icons (Feather icons)

## Project Structure

```
parami-app/
├── app/                      # Expo Router pages
│   ├── (tabs)/              # Tab navigation
│   │   ├── index.tsx        # Home screen
│   │   ├── settings.tsx     # Settings screen
│   │   └── _layout.tsx      # Tab layout
│   └── _layout.tsx          # Root layout
├── components/              # Reusable components (future)
├── constants/               # Design system
│   ├── Colors.ts           # Color palette
│   └── Typography.ts       # Typography system
├── data/                    # Static data
│   └── paramis.ts          # All 10 Paramis with content
├── hooks/                   # Custom React hooks
│   └── useNotifications.ts # Notification management
├── services/                # Business logic
│   ├── notificationService.ts
│   └── storageService.ts
├── types/                   # TypeScript definitions
│   └── index.ts
└── utils/                   # Helper functions
    └── paramiRotation.ts   # Daily rotation algorithm
```

## Design System

### Color Palette

The app uses a sophisticated "Bodhi Stone & Sacred Saffron" palette:

- **Primary Colors**:
  - Deep Charcoal (#2B2520) - Main text
  - Warm Stone (#F5F0E8) - Background
  - Pure White (#FFFFFF) - Cards

- **Accent Colors**:
  - Saffron Gold (#D97706) - Primary accent
  - Burnt Sienna (#A0522D) - Secondary accent

- **Semantic Colors**:
  - Lotus Pink (#E89B9B) - Highlights
  - Deep Moss (#3D4E3A) - Success states
  - Shadow Indigo (#4A4458) - Subtle shadows

### Typography

- **Display**: 44px bold for Parami names
- **Headings**: 24px, 18px, 13px with varied weights
- **Body**: 17px (large), 15px (standard) with generous line-height
- **Special**: 19px italic for quotes

### Key Design Elements

- **Circular practice numbers** with subtle background
- **Left accent border** on practice cards (Saffron Gold)
- **Elevated cards** with subtle shadows
- **Gradient quote backgrounds** (Lotus Pink)
- **Generous whitespace** for breathing room

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
# Navigate to project directory
cd parami-app

# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

### Building for Production

```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Rotation Algorithm

The app uses a seeded random number generator to ensure universal consistency:

1. Takes the current date (YYYY-MM-DD)
2. Converts it to a consistent seed
3. Generates a "random" Parami ID (1-10)
4. All users see the same Parami on the same date

This creates a shared experience while maintaining variety and unpredictability.

## Notifications

The app uses local notifications (no backend required):

- Daily notification at user-selected time (default: 9:00 AM)
- Shows today's Parami name and short description
- Tapping opens the app to the full content
- Fully customizable in Settings

## Future Enhancements

Potential features for future versions:

- [ ] Multiple quotes per Parami with rotation
- [ ] Progress tracking and streaks
- [ ] Favorites and personal notes
- [ ] Reflection journal
- [ ] Home screen widgets
- [ ] Meditation timer
- [ ] Dark mode
- [ ] Additional languages
- [ ] Parami symbol iconography

## License

Copyright © 2025. All rights reserved.

## Acknowledgments

- Buddhist teachings and quotes from traditional sources
- Design inspired by Buddhist aesthetics and sacred architecture
- Built with love and mindfulness
