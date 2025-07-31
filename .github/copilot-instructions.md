<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# MegBoard PWA - Custom Instructions

This is a modern React + TypeScript + Vite PWA soundboard app called "MegBoard". 

## Project Overview
- **Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS
- **PWA Features**: Service worker, installable, offline support
- **Audio**: MediaRecorder API for recording, Web Audio API for playback
- **Storage**: IndexedDB via idb-keyval for persistent audio file storage
- **UI/UX**: Fun, playful, goofy design with neon/retro colors
- **Animations**: Framer Motion for microinteractions, confetti effects
- **Components**: Radix UI for accessible base components

## Key Features to Implement
1. **Sound Grid**: Grid/list of playable sound buttons
2. **Audio Recording**: Record new sounds via microphone 
3. **Audio Management**: Play, pause, rename, delete sounds
4. **Floating Action Button**: Prominent FAB for adding new sounds
5. **Microinteractions**: Confetti, pops, wiggles on user actions
6. **Offline Support**: Full PWA with persistent storage

## Design Guidelines
- Use neon/retro color palette (defined in Tailwind config)
- Playful fonts: Comic Neue, Luckiest Guy, Indie Flower
- Blobby/cartoon-like buttons with animations
- Mobile-first responsive design
- Accessible despite fun styling

## Code Standards
- Use TypeScript for all components
- Modular, reusable components
- Well-commented code
- Use Tailwind CSS for styling
- Framer Motion for animations
- IndexedDB for audio storage
- React hooks for state management
