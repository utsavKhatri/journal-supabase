'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { FormEvent, useRef, useState } from 'react';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

/**
 * The SearchForm component provides an interactive search bar for finding journal entries.
 * It features an integrated search icon, a clear button that appears when typing,
 * and performs a search without a page reload when the user presses Enter.
 */
export function SearchForm({ initialQuery = '' }: { initialQuery?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Clears the search query and updates the URL to remove the search parameter.
   */
  const handleClear = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    router.push(`?${params.toString()}`);
    inputRef.current?.focus();
  };

  /**
   * Handles the form submission, updating the URL with the new search query.
   */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search mood or content..."
          className="w-full pl-10 pr-10"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
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