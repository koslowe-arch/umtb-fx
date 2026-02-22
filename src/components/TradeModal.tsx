import { useState } from 'react';
import type { CurrencyPair, TradeDirection } from '../types';

interface TradeModalProps {
  pair: CurrencyPair;
  direction: TradeDirection;
  onConfirm: (amount: number) => void;
  onCancel: () => void;
  accentColor: string;
}

export default function TradeModal({ pair, direction, onConfirm, onCancel, accentColor }: TradeModalProps) {
  const [amount, setAmount] = useState<string>('10000');
  const numAmount = parseFloat(amount) || 0;
  const rate = direction === 'BUY' ? pair.ask : pair.bid;
  const total = parseFloat((numAmount * rate).toFixed(2));
  const decimals = pair.quote === 'JPY' ? 3 : 5;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="card w-full max-w-md mx-4 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>
              {direction === 'BUY' ? 'Buy' : 'Sell'} {pair.base}/{pair.quote}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>
              Rate: {rate.toFixed(decimals)}
            </p>
          </div>
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full ${
              direction === 'BUY' ? 'badge-buy' : 'badge-sell'
            }`}
          >
            {direction}
          </span>
        </div>

        {/* Amount input */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>
            Amount ({pair.base})
          </label>
          <input
            type="number"
            value={amount}
            min="1"
            onChange={(e) => setAmount(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 text-lg font-semibold focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)',
              '--tw-ring-color': accentColor,
            } as React.CSSProperties}
          />
        </div>

        {/* Summary */}
        <div className="rounded-lg p-3 mb-6" style={{ backgroundColor: 'var(--color-bg)' }}>
          <div className="flex justify-between text-sm mb-1">
            <span style={{ color: 'var(--color-muted)' }}>Amount</span>
            <span className="font-medium" style={{ color: 'var(--color-text)' }}>
              {numAmount.toLocaleString()} {pair.base}
            </span>
          </div>
          <div className="flex justify-between text-sm mb-1">
            <span style={{ color: 'var(--color-muted)' }}>Rate</span>
            <span className="font-medium" style={{ color: 'var(--color-text)' }}>
              {rate.toFixed(decimals)}
            </span>
          </div>
          <div className="border-t my-2" style={{ borderColor: 'var(--color-border)' }} />
          <div className="flex justify-between font-bold">
            <span style={{ color: 'var(--color-text)' }}>Total</span>
            <span style={{ color: 'var(--color-primary)' }}>
              {total.toLocaleString()} {pair.quote}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onCancel}
            className="py-2.5 rounded-lg border font-semibold text-sm transition-colors hover:bg-gray-50"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(numAmount)}
            disabled={numAmount <= 0}
            className={`py-2.5 rounded-lg font-semibold text-sm text-white transition-opacity disabled:opacity-50 ${
              direction === 'BUY' ? 'btn-buy' : 'btn-sell'
            }`}
          >
            Confirm {direction}
          </button>
        </div>
      </div>
    </div>
  );
}
