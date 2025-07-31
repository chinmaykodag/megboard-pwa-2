import confetti from 'canvas-confetti';

export const confettiEffects = {
  // Celebration effect when a sound is played
  playSound(): void {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#ff0080', '#00ffff', '#00ff00', '#ffff00', '#8000ff'],
      scalar: 0.8,
      drift: 0.1,
    });
  },

  // Bigger celebration when a new sound is recorded
  newSound(): void {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0080', '#00ffff', '#00ff00', '#ffff00', '#8000ff', '#ff8000'],
      scalar: 1.2,
      drift: 0.2,
      gravity: 0.8,
    });
  },

  // Subtle effect when sound is deleted
  deleteSound(): void {
    confetti({
      particleCount: 30,
      spread: 40,
      origin: { y: 0.9 },
      colors: ['#ff0080', '#00ffff'],
      scalar: 0.6,
      gravity: 1.5,
    });
  },

  // Rainbow burst for special occasions
  rainbow(): void {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#ff0080', '#00ffff', '#00ff00', '#ffff00', '#8000ff', '#ff8000'],
    };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  },

  // Heart burst for love/favorite sounds
  hearts(): void {
    const heart = confetti.shapeFromText({ text: '💖', scalar: 2 });
    
    confetti({
      particleCount: 15,
      spread: 80,
      origin: { y: 0.8 },
      shapes: [heart],
      scalar: 2,
      drift: 0.2,
      gravity: 0.8,
    });
  },

  // Stars effect
  stars(): void {
    const star = confetti.shapeFromText({ text: '⭐', scalar: 1.5 });
    
    confetti({
      particleCount: 25,
      spread: 70,
      origin: { y: 0.7 },
      shapes: [star],
      scalar: 1.5,
      drift: 0.1,
      gravity: 0.6,
    });
  },

  // Custom position confetti
  customPosition(x: number, y: number, effect: 'small' | 'medium' | 'large' = 'medium'): void {
    const configs = {
      small: { particleCount: 20, spread: 40, scalar: 0.6 },
      medium: { particleCount: 50, spread: 60, scalar: 0.8 },
      large: { particleCount: 80, spread: 80, scalar: 1.0 },
    };

    const config = configs[effect];

    confetti({
      ...config,
      origin: { x, y },
      colors: ['#ff0080', '#00ffff', '#00ff00', '#ffff00', '#8000ff'],
      drift: 0.1,
    });
  },
};
