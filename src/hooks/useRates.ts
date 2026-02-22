import { useState, useEffect, useCallback } from 'react';
import type { CurrencyPair } from '../types';

const BASE_RATES: Omit<CurrencyPair, 'bid' | 'ask' | 'spread' | 'change24h' | 'changePercent'>[] = [
  { id: 'USD/ILS', base: 'USD', quote: 'ILS' },
  { id: 'EUR/USD', base: 'EUR', quote: 'USD' },
  { id: 'GBP/USD', base: 'GBP', quote: 'USD' },
  { id: 'EUR/ILS', base: 'EUR', quote: 'ILS' },
  { id: 'USD/JPY', base: 'USD', quote: 'JPY' },
  { id: 'GBP/ILS', base: 'GBP', quote: 'ILS' },
];

const MID_PRICES: Record<string, number> = {
  'USD/ILS': 3.72,
  'EUR/USD': 1.0845,
  'GBP/USD': 1.2720,
  'EUR/ILS': 4.035,
  'USD/JPY': 149.85,
  'GBP/ILS': 4.731,
};

const SPREADS: Record<string, number> = {
  'USD/ILS': 0.005,
  'EUR/USD': 0.0003,
  'GBP/USD': 0.0004,
  'EUR/ILS': 0.006,
  'USD/JPY': 0.03,
  'GBP/ILS': 0.008,
};

function randomJitter(value: number, maxPct: number = 0.0015): number {
  const delta = value * maxPct * (Math.random() * 2 - 1);
  return parseFloat((value + delta).toFixed(5));
}

function buildPairs(mids: Record<string, number>): CurrencyPair[] {
  return BASE_RATES.map((r) => {
    const mid = mids[r.id];
    const half = SPREADS[r.id] / 2;
    const bid = parseFloat((mid - half).toFixed(5));
    const ask = parseFloat((mid + half).toFixed(5));
    const change24h = parseFloat((mid * (Math.random() * 0.02 - 0.01)).toFixed(5));
    const changePercent = parseFloat(((change24h / mid) * 100).toFixed(3));
    return { ...r, bid, ask, spread: SPREADS[r.id], change24h, changePercent };
  });
}

export function useRates(intervalMs = 2000) {
  const [mids] = useState<Record<string, number>>(() => ({ ...MID_PRICES }));
  const [pairs, setPairs] = useState<CurrencyPair[]>(() => buildPairs(mids));

  const tick = useCallback(() => {
    const updated: Record<string, number> = {};
    for (const key of Object.keys(mids)) {
      updated[key] = randomJitter(mids[key]);
      mids[key] = updated[key];
    }
    setPairs(buildPairs(mids));
  }, [mids]);

  useEffect(() => {
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [tick, intervalMs]);

  return pairs;
}
