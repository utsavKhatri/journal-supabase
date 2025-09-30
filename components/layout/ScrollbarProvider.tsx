'use client';

import { useHasScrollbar } from '@/lib/hooks/use-has-scrollbar';
import React from 'react';

export function ScrollbarProvider({ children }: { children: React.ReactNode }) {
  useHasScrollbar();
  return <>{children}</>;
}
