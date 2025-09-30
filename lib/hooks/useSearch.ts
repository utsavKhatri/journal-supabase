import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition, useCallback } from 'react';

export function useSearch(initialQuery: string = '') {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState(
    () => searchParams.get('q') || initialQuery,
  );
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 200);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const currentQueryParam = searchParams.get('q') || '';
    if (debouncedQuery !== currentQueryParam) {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (debouncedQuery) {
          params.set('q', debouncedQuery);
        } else {
          params.delete('q');
        }
        router.push(`?${params.toString()}`);
      });
    }
  }, [debouncedQuery, router, searchParams]);

  const handleClear = useCallback(() => {
    setQuery('');
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('q');
      router.push(`?${params.toString()}`);
    });
  }, [router, searchParams]);

  return {
    query,
    setQuery,
    loading: isPending,
    handleClear,
  };
}
