import { useState } from 'react';
import type { CurrencyPair, TradeDirection } from '../types';

interface CurrencyCardProps {
  pair: CurrencyPair;
  onTrade: (pair: CurrencyPair, direction: TradeDirection) => void;
}

export default function CurrencyCard({ pair, onTrade }: CurrencyCardProps) {
  const [prevBid, setPrevBid] = useState(pair.bid);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  if (pair.bid !== prevBid) {
    setFlash(pair.bid > prevBid ? 'up' : 'down');
    setPrevBid(pair.bid);
    setTimeout(() => setFlash(null), 600);
  }

  const isPositive = pair.change24h >= 0;
  const decimals = pair.quote === 'JPY' ? 3 : 5;

  return (
    <div
      className={`card p-4 transition-all duration-300 ${
        flash === 'up' ? 'ring-2 ring-emerald-400' : flash === 'down' ? 'ring-2 ring-red-400' : ''
      }`}
    >
      {/* Pair header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-bold text-lg text-brand-text" style={{ color: 'var(--color-text)' }}>
            {pair.base}
            <span className="text-brand-muted font-normal" style={{ color: 'var(--color-muted)' }}>
              /{pair.quote}
            </span>
          </p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
            Spread: {pair.spread.toFixed(decimals)}
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            isPositive ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {isPositive ? '+' : ''}{pair.changePercent.toFixed(2)}%
        </span>
      </div>

      {/* Rates */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-emerald-50 rounded-lg p-2 text-center">
          <p className="text-xs text-emerald-600 font-medium mb-0.5">BID</p>
          <p className="text-base font-bold text-emerald-700">{pair.bid.toFixed(decimals)}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-2 text-center">
          <p className="text-xs text-red-600 font-medium mb-0.5">ASK</p>
          <p className="text-base font-bold text-red-700">{pair.ask.toFixed(decimals)}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button className="btn-buy text-sm" onClick={() => onTrade(pair, 'BUY')}>
          Buy
        </button>
        <button className="btn-sell text-sm" onClick={() => onTrade(pair, 'SELL')}>
          Sell
        </button>
      </div>
    </div>
  );
}
