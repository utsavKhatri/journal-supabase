'use client';

import { Search, X, Loader2 } from 'lucide-react';
import React, { useRef } from 'react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useSearch } from '@/lib/hooks/useSearch';

/**
 * The SearchForm component provides an interactive search bar for finding journal entries.
 * It features an integrated search icon, a clear button that appears when typing,
 * and performs a search without a page reload when the user presses Enter.
 */
export function SearchForm({ initialQuery = '' }: { initialQuery?: string }) {
  const { query, setQuery, loading, handleClear } = useSearch(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form className="w-full">
      <div className="relative">
        {loading ? (
          <Loader2 className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 animate-spin" />
        ) : (
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        )}
        <Input
          ref={inputRef}
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search mood or content..."
          className="w-full pr-10 pl-10"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-1/2 right-1 h-8 w-8 -translate-y-1/2"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
}

export default SearchForm;
