import { useState, useEffect } from 'react';
import { themes, applyTheme, getTenantFromUrl } from './themes';
import { useRates } from './hooks/useRates';
import Header from './components/Header';
import CurrencyCard from './components/CurrencyCard';
import TradeModal from './components/TradeModal';
import TradeHistory from './components/TradeHistory';
import type { CurrencyPair, Trade, TradeDirection, TenantTheme } from './types';

let tradeCounter = 0;

export default function App() {
  const [theme, setTheme] = useState<TenantTheme>(themes.default);
  const [activeTenant, setActiveTenant] = useState('default');
  const pairs = useRates(2000);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [modal, setModal] = useState<{ pair: CurrencyPair; direction: TradeDirection } | null>(null);

  // Apply tenant theme on mount / URL change
  useEffect(() => {
    const tenant = getTenantFromUrl();
    const t = themes[tenant] ?? themes.default;
    setTheme(t);
    setActiveTenant(tenant in themes ? tenant : 'default');
    applyTheme(t);
  }, []);

  function switchTenant(key: string) {
    const t = themes[key] ?? themes.default;
    setTheme(t);
    setActiveTenant(key);
    applyTheme(t);
  }

  function handleTrade(pair: CurrencyPair, direction: TradeDirection) {
    setModal({ pair, direction });
  }

  function confirmTrade(amount: number) {
    if (!modal) return;
    const rate = modal.direction === 'BUY' ? modal.pair.ask : modal.pair.bid;
    const newTrade: Trade = {
      id: `TRD-${String(++tradeCounter).padStart(4, '0')}`,
      pair: modal.pair.id,
      direction: modal.direction,
      amount,
      rate,
      total: parseFloat((amount * rate).toFixed(2)),
      timestamp: new Date(),
      status: 'EXECUTED',
    };
    setTrades((prev) => [newTrade, ...prev]);
    setModal(null);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
      <Header theme={theme} />

      {/* Tenant switcher (dev/demo tool) */}
      <div
        className="flex items-center gap-2 px-6 py-2 border-b text-xs"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <span style={{ color: 'var(--color-muted)' }}>Demo tenant:</span>
        {Object.keys(themes).map((key) => (
          <button
            key={key}
            onClick={() => switchTenant(key)}
            className="px-3 py-1 rounded-full font-medium transition-colors"
            style={
              activeTenant === key
                ? { backgroundColor: 'var(--color-primary)', color: '#fff' }
                : { backgroundColor: 'var(--color-bg)', color: 'var(--color-muted)' }
            }
          >
            {key}
          </button>
        ))}
      </div>

      <main className="flex-1 px-4 py-6 max-w-7xl w-full mx-auto">
        {/* Section label */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
            Live Rates
          </h1>
          <span className="text-xs" style={{ color: 'var(--color-muted)' }}>
            Auto-refreshing every 2s
          </span>
        </div>

        {/* Currency cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {pairs.map((pair) => (
            <CurrencyCard key={pair.id} pair={pair} onTrade={handleTrade} />
          ))}
        </div>

        {/* Trade history */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: 'var(--color-text)' }}>
            Trade History
          </h2>
          {trades.length > 0 && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--color-secondary)', color: '#fff' }}
            >
              {trades.length} trade{trades.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        <TradeHistory trades={trades} />
      </main>

      {/* Trade confirmation modal */}
      {modal && (
        <TradeModal
          pair={modal.pair}
          direction={modal.direction}
          onConfirm={confirmTrade}
          onCancel={() => setModal(null)}
          accentColor={theme.accentColor}
        />
      )}
    </div>
  );
}
