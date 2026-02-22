import type { TenantTheme } from '../types';

interface HeaderProps {
  theme: TenantTheme;
}

export default function Header({ theme }: HeaderProps) {
  return (
    <header
      className="flex items-center justify-between px-6 py-3 shadow-md"
      style={{ backgroundColor: theme.primaryColor }}
    >
      <div className="flex items-center gap-3">
        {theme.logo ? (
          <img src={theme.logo} alt={theme.name} className="h-8 w-auto" />
        ) : (
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: theme.accentColor }}
          >
            {theme.name.charAt(0)}
          </div>
        )}
        <span className="text-white font-bold text-lg tracking-wide">
          {theme.name}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-white/70 text-sm">Live Rates</span>
        <span className="flex items-center gap-1.5 text-emerald-300 text-sm font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
          Connected
        </span>
      </div>
    </header>
  );
}
