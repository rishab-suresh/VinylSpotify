export interface Theme {
  name: string;
  styles: {
    '--turntable-base-bg': string;
    '--turntable-base-bg-image'?: string;
    '--turntable-base-bg-size'?: string;
    '--playlist-bg': string;
    '--playlist-bg-image'?: string;
    '--playlist-bg-size'?: string;
    '--playlist-item-bg': string;
    '--text-color-primary': string;
    '--text-color-secondary': string;
    '--main-app-bg': string;
    '--knob-bg': string;
    '--knob-border-color': string;
    '--knob-shadow-outer-dark': string;
    '--knob-shadow-outer-light': string;
    '--knob-shadow-inner': string;
    '--knob-shadow-inset-dark': string;
    '--knob-shadow-inset-light': string;
    '--volume-knob-bg': string;
    '--volume-knob-border-color': string;
    '--volume-knob-shadow': string;
    '--volume-knob-inner-shadow': string;
    '--knob-marker-bg': string;
    '--record-bg': string;
    '--record-groove-color': string;
  };
}

export const darkTheme: Theme = {
  name: 'dark',
  styles: {
    '--turntable-base-bg': '#2c2c2c',
    '--turntable-base-bg-image': 'none',
    '--turntable-base-bg-size': 'auto',
    '--playlist-bg': '#1e1e1e',
    '--playlist-bg-image': 'none',
    '--playlist-bg-size': 'auto',
    '--playlist-item-bg': '#282828',
    '--text-color-primary': '#ffffff',
    '--text-color-secondary': '#b3b3b3',
    '--main-app-bg': '#121212',
    '--knob-bg': 'linear-gradient(145deg, #444, #222)',
    '--knob-border-color': '#111',
    '--knob-shadow-outer-dark': '#1a1a1a',
    '--knob-shadow-outer-light': '#4a4a4a',
    '--knob-shadow-inner': 'rgba(255, 255, 255, 0.1)',
    '--knob-shadow-inset-dark': '#1a1a1a',
    '--knob-shadow-inset-light': '#4a4a4a',
    '--volume-knob-bg': 'linear-gradient(to bottom, #666, #444)',
    '--volume-knob-border-color': '#222',
    '--volume-knob-shadow': 'rgba(0,0,0,0.4)',
    '--volume-knob-inner-shadow': 'rgba(255,255,255,0.1)',
    '--knob-marker-bg': '#ddd',
    '--record-bg': '#000',
    '--record-groove-color': 'rgba(255,255,255,0.02)',
  },
};

export const woodTheme: Theme = {
  name: 'wood',
  styles: {
    '--turntable-base-bg': '#4a3b2a',
    '--turntable-base-bg-image': `
      linear-gradient(90deg, rgba(255,255,255,0.07) 50%, transparent 50%),
      linear-gradient(90deg, rgba(255,255,255,0.13) 50%, transparent 50%),
      linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.17) 50%),
      linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.19) 50%)
    `,
    '--turntable-base-bg-size': '13px, 29px, 37px, 53px',
    '--playlist-bg': '#4a3b2a',
    '--playlist-bg-image': `
      linear-gradient(90deg, rgba(255,255,255,0.07) 50%, transparent 50%),
      linear-gradient(90deg, rgba(255,255,255,0.13) 50%, transparent 50%),
      linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.17) 50%),
      linear-gradient(90deg, transparent 50%, rgba(255,255,255,0.19) 50%)
    `,
    '--playlist-bg-size': '13px, 29px, 37px, 53px',
    '--playlist-item-bg': '#3a2d1e',
    '--text-color-primary': '#f5e5d3',
    '--text-color-secondary': '#d3c3b3',
    '--main-app-bg': '#2a2118',
    '--knob-bg': 'linear-gradient(145deg, #8c7853, #5a4d35)',
    '--knob-border-color': '#3b3222',
    '--knob-shadow-outer-dark': '#3b3222',
    '--knob-shadow-outer-light': '#a48e6a',
    '--knob-shadow-inner': 'rgba(255, 255, 255, 0.08)',
    '--knob-shadow-inset-dark': '#3b3222',
    '--knob-shadow-inset-light': '#a48e6a',
    '--volume-knob-bg': 'linear-gradient(to bottom, #8c7853, #5a4d35)',
    '--volume-knob-border-color': '#3b3222',
    '--volume-knob-shadow': 'rgba(0,0,0,0.4)',
    '--volume-knob-inner-shadow': 'rgba(255,255,255,0.08)',
    '--knob-marker-bg': '#f5e5d3',
    '--record-bg': '#211a12',
    '--record-groove-color': 'rgba(255,255,255,0.03)',
  },
};

export const floralTheme: Theme = {
  name: 'floral',
  styles: {
    // Backgrounds
    '--main-app-bg': '#f4f0e8',
    '--turntable-base-bg': '#e8e0d4',
    '--turntable-base-bg-image': `url('/assets/floral-pattern.jpg')`,
    '--turntable-base-bg-size': 'cover',
    '--playlist-bg': '#e8e0d4',
    '--playlist-bg-image': `url('/assets/floral-pattern.jpg')`,
    '--playlist-bg-size': 'cover',
    '--playlist-item-bg': 'rgba(212, 188, 166, 0.5)',
    
    // Text
    '--text-color-primary': '#5c4b45', // Dark earthy brown
    '--text-color-secondary': '#82736b', // Lighter brown

    // Knobs (Rose Gold)
    '--knob-bg': 'linear-gradient(145deg, #e6c0b3, #c8a395)',
    '--knob-border-color': '#a18379',
    '--knob-shadow-outer-dark': '#b09489',
    '--knob-shadow-outer-light': '#f8e0d7',
    '--knob-shadow-inner': 'rgba(255, 255, 255, 0.3)',
    '--knob-shadow-inset-dark': '#b09489',
    '--knob-shadow-inset-light': '#f8e0d7',
    '--volume-knob-bg': 'linear-gradient(to bottom, #e6c0b3, #c8a395)',
    '--volume-knob-border-color': '#a18379',
    '--volume-knob-shadow': 'rgba(100, 80, 70, 0.3)',
    '--volume-knob-inner-shadow': 'rgba(255, 255, 255, 0.3)',
    '--knob-marker-bg': '#5c4b45',
    '--record-bg': '#5c4b45',
    '--record-groove-color': 'rgba(255,255,255,0.04)',
  },
};

export const aquaTheme: Theme = {
  name: 'aqua',
  styles: {
    // Backgrounds
    '--main-app-bg': '#0f1c24',
    '--turntable-base-bg': '#1a2e3a',
    '--turntable-base-bg-image': 'none',
    '--playlist-bg': '#1a2e3a',
    '--playlist-bg-image': 'none',
    '--playlist-item-bg': 'rgba(26, 68, 92, 0.5)',
    
    // Text
    '--text-color-primary': '#a6e0e9', // Light cyan
    '--text-color-secondary': '#7ac5d8', // Deeper cyan

    // Knobs (Brushed Steel/Aqua)
    '--knob-bg': 'linear-gradient(145deg, #8ab5c1, #5e8c9a)',
    '--knob-border-color': '#4a6d7a',
    '--knob-shadow-outer-dark': '#42616d', // Darker, less intense shadow
    '--knob-shadow-outer-light': '#94c2d2', // Lighter, less intense glow
    '--knob-shadow-inner': 'rgba(255, 255, 255, 0.15)',
    '--knob-shadow-inset-dark': '#4a6d7a',
    '--knob-shadow-inset-light': '#a2d3e4',
    '--volume-knob-bg': 'linear-gradient(to bottom, #8ab5c1, #5e8c9a)',
    '--volume-knob-border-color': '#4a6d7a',
    '--volume-knob-shadow': 'rgba(30, 50, 60, 0.3)',
    '--volume-knob-inner-shadow': 'rgba(255, 255, 255, 0.15)',
    '--knob-marker-bg': '#e0f4f8',
    '--record-bg': '#0a141a',
    '--record-groove-color': 'rgba(170, 220, 230, 0.05)',
  },
};

export const themes = {
  dark: darkTheme,
  wood: woodTheme,
  floral: floralTheme,
  aqua: aquaTheme,
}; 