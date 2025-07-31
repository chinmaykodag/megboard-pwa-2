# 📢 MegBoard - Fun Soundboard PWA

A modern, playful soundboard Progressive Web App built with React, TypeScript, and Vite. Record, play, and manage custom sounds with a fun, goofy interface featuring neon colors and smooth animations.

![MegBoard](https://img.shields.io/badge/PWA-Ready-brightgreen) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Vite](https://img.shields.io/badge/Vite-5-purple)

## ✨ Features

- 🎤 **Audio Recording** - Record custom sounds using device microphone
- 🔊 **Sound Playback** - Play recorded sounds with Web Audio API
- 💾 **Persistent Storage** - Store sounds locally using IndexedDB
- 📱 **PWA Support** - Installable, works offline, mobile-optimized
- 🎨 **Playful UI** - Neon/retro design with fun animations and microinteractions
- 🎉 **Confetti Effects** - Celebration animations on user actions
- ✏️ **Sound Management** - Rename, delete, and organize your sounds
- 📊 **Storage Info** - Track storage usage and sound count
- 🔄 **Real-time Updates** - Instant visual feedback and state updates

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS with custom neon theme
- **Animations**: Framer Motion
- **UI Components**: Radix UI primitives
- **Audio**: MediaRecorder API + Web Audio API
- **Storage**: IndexedDB via idb-keyval
- **PWA**: Vite PWA plugin with Workbox
- **Icons**: Radix Icons + Emojis

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🎯 Usage

1. **First Time**: Grant microphone permissions when prompted
2. **Record Sound**: Click the floating pink button (FAB) and select "Record Sound"
3. **Save Sound**: Give your recording a name and save it
4. **Play Sounds**: Tap any sound button to play it
5. **Manage Sounds**: Long-press or click the dots menu to rename/delete sounds
6. **Install PWA**: Use your browser's "Install App" option for offline access

## 🎨 Design Philosophy

MegBoard embraces a **fun, goofy, and energetic** design philosophy:

- **Neon Color Palette**: Bright pinks, blues, greens, yellows, and purples
- **Playful Typography**: Comic Neue, Luckiest Guy, and Indie Flower fonts
- **Smooth Animations**: Hover effects, scaling, floating elements, and confetti
- **Mobile-First**: Optimized for touch interactions and small screens
- **Accessibility**: Despite the fun design, maintains proper contrast and keyboard navigation

---

**Made with ❤️ and lots of ☕ for the love of fun, interactive web experiences!**
