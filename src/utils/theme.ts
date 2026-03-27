export type Theme = 'light' | 'dark' | 'system';

export function initTheme() {
  const savedTheme = (localStorage.getItem('theme') as Theme) || 'system';
  applyTheme(savedTheme);

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (localStorage.getItem('theme') === 'system') {
      applyTheme('system');
    }
  });
}

export function applyTheme(theme: Theme) {
  localStorage.setItem('theme', theme);
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

export function toggleTheme() {
  const current = (localStorage.getItem('theme') as Theme) || 'system';
  const newThemeMap: Record<Theme, Theme> = {
    light: 'dark',
    dark: 'system',
    system: 'light'
  };
  const newTheme = newThemeMap[current];
  applyTheme(newTheme);
  return newTheme;
}

export function getCurrentTheme(): Theme {
  return (localStorage.getItem('theme') as Theme) || 'system';
}
