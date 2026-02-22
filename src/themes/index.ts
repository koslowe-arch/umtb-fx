import type { TenantTheme } from '../types';

export const themes: Record<string, TenantTheme> = {
  default: {
    name: 'FX Trading Platform',
    primaryColor: '#1a3c6e',
    secondaryColor: '#2563eb',
    accentColor: '#f59e0b',
    bgColor: '#f0f4f8',
    surfaceColor: '#ffffff',
    borderColor: '#e2e8f0',
    textColor: '#1e293b',
    mutedColor: '#64748b',
  },
  umtb: {
    name: 'UMTB - FX Trading Platform',
    primaryColor: '#003366',
    secondaryColor: '#005baa',
    accentColor: '#e8a020',
    bgColor: '#f5f7fa',
    surfaceColor: '#ffffff',
    borderColor: '#dce3ec',
    textColor: '#1a2332',
    mutedColor: '#5a6a7e',
  },
  mizrahi: {
    name: 'Mizrahi Tefahot - FX Trading Platform',
    primaryColor: '#1a1a6e',
    secondaryColor: '#2525aa',
    accentColor: '#e8b420',
    bgColor: '#f0f0fa',
    surfaceColor: '#ffffff',
    borderColor: '#e0e0f0',
    textColor: '#1a1a2e',
    mutedColor: '#6060a0',
  },
};

export function applyTheme(theme: TenantTheme): void {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', theme.primaryColor);
  root.style.setProperty('--color-secondary', theme.secondaryColor);
  root.style.setProperty('--color-accent', theme.accentColor);
  root.style.setProperty('--color-bg', theme.bgColor);
  root.style.setProperty('--color-surface', theme.surfaceColor);
  root.style.setProperty('--color-border', theme.borderColor);
  root.style.setProperty('--color-text', theme.textColor);
  root.style.setProperty('--color-muted', theme.mutedColor);
  if (theme.fontFamily) {
    root.style.setProperty('--font-family', theme.fontFamily);
  }
}

export function getTenantFromUrl(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('tenant') || 'default';
}
