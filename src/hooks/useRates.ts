import { useState, useEffect, useCallback, useRef } from 'react';
import type { CurrencyPair } from '../types';

const BASE_RATES: Omit<CurrencyPair, 'bid' | 'ask' | 'spread' | 'change24h' | 'changePercent'>[] = [
  { id: 'USD/ILS', base: 'USD', quote: 'ILS' },
  { id: 'EUR/USD', base: 'EUR', quote: 'USD' },
  { id: 'GBP/USD', base: 'GBP', quote: 'USD' },
  { id: 'EUR/ILS', base: 'EUR', quote: 'ILS' },
  { id: 'USD/JPY', base: 'USD', quote: 'JPY' },
  { id: 'GBP/ILS', base: 'GBP', quote: 'ILS' },
];

// Fallback used when the live API is unreachable
const FALLBACK_MIDS: Record<string, number> = {
  'USD/ILS': 3.11,
  'EUR/USD': 1.0475,
  'GBP/USD': 1.2630,
  'EUR/ILS': 3.257,
  'USD/JPY': 150.20,
  'GBP/ILS': 3.928,
};

const SPREADS: Record<string, number> = {
  'USD/ILS': 0.005,
  'EUR/USD': 0.0003,
  'GBP/USD': 0.0004,
  'EUR/ILS': 0.006,
  'USD/JPY': 0.03,
  'GBP/ILS': 0.008,
};

// Frankfurter uses ECB reference rates — free, no key, CORS-friendly
const FRANKFURTER_URL =
  'https://api.frankfurter.app/latest?from=USD&to=ILS,EUR,GBP,JPY';

// Fawaz-ahmed CDN as secondary fallback
const FAWAZ_URLS = [
  'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
  'https://latest.currency-api.pages.dev/v1/currencies/usd.json',
];

async function fetchLiveRates(): Promise<Record<string, number>> {
  // Try Frankfurter first
  try {
    const res = await fetch(FRANKFURTER_URL);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const data = await res.json();
    const r = data.rates as Record<string, number>;
    if (!r?.ILS) throw new Error('Missing ILS in Frankfurter response');
    return {
      'USD/ILS': r.ILS,
      'EUR/USD': 1 / r.EUR,
      'GBP/USD': 1 / r.GBP,
      'EUR/ILS': r.ILS / r.EUR,   // (USD/ILS) / (EUR/USD inverted) = ILS per EUR
      'USD/JPY': r.JPY,
      'GBP/ILS': r.ILS / r.GBP,  // (USD/ILS) / (GBP/USD inverted) = ILS per GBP
    };
  } catch {
    // fall through to fawaz-ahmed
  }

  // Try fawaz-ahmed mirrors
  let lastError: Error | null = null;
  for (const url of FAWAZ_URLS) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      const r = data.usd as Record<string, number>;
      if (!r) throw new Error('Invalid fawaz response');
      return {
        'USD/ILS': r.ils,
        'EUR/USD': 1 / r.eur,
        'GBP/USD': 1 / r.gbp,
        'EUR/ILS': r.ils / r.eur,
        'USD/JPY': r.jpy,
        'GBP/ILS': r.ils / r.gbp,
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
    }
  }
  throw lastError;
}

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
  const mids = useRef<Record<string, number>>({ ...FALLBACK_MIDS });
  const [pairs, setPairs] = useState<CurrencyPair[]>(() => buildPairs(mids.current));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLiveRates = useCallback(async () => {
    try {
      const live = await fetchLiveRates();
      Object.assign(mids.current, live);
      setPairs(buildPairs(mids.current));
      setError(null);
    } catch {
      setError('Live rates unavailable — showing cached rates');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch on mount and refresh every 60 seconds
  useEffect(() => {
    loadLiveRates();
    const id = setInterval(loadLiveRates, 60_000);
    return () => clearInterval(id);
  }, [loadLiveRates]);

  // Tick jitter for live-trading feel between API refreshes
  const tick = useCallback(() => {
    for (const key of Object.keys(mids.current)) {
      mids.current[key] = randomJitter(mids.current[key]);
    }
    setPairs(buildPairs(mids.current));
  }, []);

  useEffect(() => {
    const id = setInterval(tick, intervalMs);
    return () => clearInterval(id);
  }, [tick, intervalMs]);

  return { pairs, loading, error };
}
