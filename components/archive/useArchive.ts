"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useState } from "react";

/* Search, one chip filter and load more, shared by every archive. Items arrive as small card shapes with a `search` string. */
export function useArchive<T extends { search: string }>(items: T[], filterOf: (item: T) => string, pageSize: number) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [shown, setShown] = useState(pageSize);
  const filters = useMemo(() => ["All", ...Array.from(new Set(items.map(filterOf)))], [items, filterOf]);
  const results = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return items.filter((item) => (filter === "All" || filterOf(item) === filter) && words.every((w) => item.search.includes(w)));
  }, [items, filter, query, filterOf]);
  useEffect(() => { setShown(pageSize); }, [query, filter, pageSize]);
  // Page height changes as cards come and go, so scroll-driven reveals below re-measure.
  useEffect(() => { requestAnimationFrame(() => ScrollTrigger.refresh()); }, [shown, results.length]);
  return { query, setQuery, filter, setFilter, filters, results, visible: results.slice(0, shown), more: results.length > shown, loadMore: () => setShown((n) => n + pageSize) };
}
