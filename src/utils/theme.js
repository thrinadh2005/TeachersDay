// Dual Theme Manager for GMRIT CSE Teachers' Day
export const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem('td_theme');
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  return 'dark'; // Default: Midnight Dark Fest
};

export const applyTheme = (theme) => {
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.remove('dark');
    root.classList.add('light');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
  }
  localStorage.setItem('td_theme', theme);
};
