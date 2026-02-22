import type { Trade } from '../types';

interface TradeHistoryProps {
  trades: Trade[];
}

export default function TradeHistory({ trades }: TradeHistoryProps) {
  if (trades.length === 0) {
    return (
      <div className="card p-8 text-center" style={{ color: 'var(--color-muted)' }}>
        <p className="text-4xl mb-2">📋</p>
        <p className="font-medium">No trades yet</p>
        <p className="text-sm mt-1">Execute a trade to see it here</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--color-border)' }}>
        <h2 className="font-bold text-base" style={{ color: 'var(--color-text)' }}>
          Trade History
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg)' }}>
              {['Pair', 'Direction', 'Amount', 'Rate', 'Total', 'Time', 'Status'].map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-2.5 font-semibold text-xs uppercase tracking-wide"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, i) => (
              <tr
                key={trade.id}
                className="border-t transition-colors hover:bg-gray-50"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <td className="px-4 py-3 font-bold" style={{ color: 'var(--color-text)' }}>
                  {trade.pair}
                </td>
                <td className="px-4 py-3">
                  <span className={trade.direction === 'BUY' ? 'badge-buy' : 'badge-sell'}>
                    {trade.direction}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-text)' }}>
                  {trade.amount.toLocaleString()}
                </td>
                <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--color-text)' }}>
                  {trade.rate.toFixed(5)}
                </td>
                <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-primary)' }}>
                  {trade.total.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-muted)' }}>
                  {trade.timestamp.toLocaleTimeString()}
                </td>
                <td className="px-4 py-3">
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {trade.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
