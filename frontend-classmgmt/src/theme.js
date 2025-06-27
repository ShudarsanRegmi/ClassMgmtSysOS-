import { createContext } from 'react';

export const themes = {
  dark: {
    name: 'Dark',
    bg: 'bg-gray-950',
    card: 'bg-white/5 border border-white/10 backdrop-blur-md',
    text: 'text-white',
    textMuted: 'text-gray-300',
    textAccent: 'text-blue-400',
    border: 'border-white/10',
    overlay: 'bg-black/40',
    error: 'bg-red-900/80 border border-red-700 text-red-200',
    sidebar: 'bg-gray-900 text-white',
    header: 'bg-gray-900 text-white',
    button: 'bg-blue-600 text-white hover:bg-blue-700',
    buttonAlt: 'bg-gray-800 text-white hover:bg-gray-700',
    shadow: 'shadow-xl',
    footer: 'text-gray-500',
  },
  bright: {
    name: 'Bright',
    bg: 'bg-gray-100',
    card: 'bg-white border border-gray-200',
    text: 'text-gray-900',
    textMuted: 'text-gray-500',
    textAccent: 'text-blue-600',
    border: 'border-gray-200',
    overlay: 'bg-black/10',
    error: 'bg-red-100 border border-red-400 text-red-700',
    sidebar: 'bg-white text-gray-900',
    header: 'bg-white text-gray-900',
    button: 'bg-blue-600 text-white hover:bg-blue-700',
    buttonAlt: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    shadow: 'shadow-lg',
    footer: 'text-gray-400',
  },
  // Add more custom themes here
};

export const ThemeContext = createContext(); 