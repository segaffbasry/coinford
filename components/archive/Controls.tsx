"use client";

import type { ReactNode } from "react";

export function Controls({ label, query, setQuery, filters, filter, setFilter, count, noun }: {
  label: string; query: string; setQuery: (q: string) => void; filters: string[]; filter: string; setFilter: (f: string) => void; count: number; noun: [string, string];
}) {
  return <div className="archive-controls" data-reveal="label">
    <label className="search"><span className="sr-only">Search {label}</span>
      <input type="search" placeholder={`Search ${label}`} value={query} onChange={(e) => setQuery(e.target.value)} />
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="m11 11 3.5 3.5" stroke="currentColor" strokeWidth="1.4" /></svg>
    </label>
    <div className="chips" role="group" aria-label={`Filter ${label}`}>{filters.map((f) => <button key={f} className="chip" aria-pressed={f === filter} onClick={() => setFilter(f)}>{f}</button>)}</div>
    <p className="results-count" aria-live="polite">{count} {count === 1 ? noun[0] : noun[1]}</p>
  </div>;
}

/* New cards use the same "card" move as the scroll reveals, as a CSS animation so load-more batches animate too. */
export function Cards({ className, children }: { className: string; children: ReactNode }) {
  return <ul className={`${className} archive-grid`}>{children}</ul>;
}

export function More({ more, onMore, empty }: { more: boolean; onMore: () => void; empty: boolean }) {
  return <>
    {empty && <p className="empty">Nothing matches that search. Try another word or clear the filter.</p>}
    {more && <div className="load-more"><button className="crop" onClick={onMore}>
      <i className="crop-c tl" /><i className="crop-c tr" /><i className="crop-c bl" /><i className="crop-c br" />
      <span className="crop-box"><span className="crop-size">Load more</span><span className="crop-flip" aria-hidden="true"><span className="crop-one">Load more</span><span className="crop-two">Load more</span></span></span>
    </button></div>}
  </>;
}
