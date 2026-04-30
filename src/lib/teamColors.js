// Palette partagée entre App.jsx et AdminPanel.jsx
export const TEAM_COLORS = [
  { accent: '#e74c3c', dark: '#c0392b', light: '#fdeaea', bg: '#fdf6f6', headerText: '#fff' },                                                              // 0 Rouge
  { accent: '#2980b9', dark: '#1a5276', light: '#d6eaf8', bg: '#f0f6fc', headerText: '#fff' },                                                              // 1 Bleu
  { accent: '#27ae60', dark: '#1e8449', light: '#d5f5e3', bg: '#f0fdf6', headerText: '#fff' },                                                              // 2 Vert
  { accent: '#e67e22', dark: '#ca6f1e', light: '#fdebd0', bg: '#fdf6ee', headerText: '#fff' },                                                              // 3 Orange
  { accent: '#e91e8c', dark: '#c2186e', light: '#fce4f2', bg: '#fdf3f9', headerText: '#fff' },                                                              // 4 Fuschia
  { accent: '#f1c40f', dark: '#d4ac0d', light: '#fef9e7', bg: '#fffef5', headerText: '#5a3e00', logoFilter: 'brightness(0) saturate(0) opacity(0.6)' },     // 5 Jaune
  { accent: '#8e44ad', dark: '#6c3483', light: '#f4ecf7', bg: '#fdf8ff', headerText: '#fff', rainbow: true },                                               // 6 Arc-en-ciel
];

export const RAINBOW_GRADIENT =
  'linear-gradient(135deg, #e74c3c, #e67e22, #f1c40f, #27ae60, #2980b9, #e91e8c, #e74c3c)';
