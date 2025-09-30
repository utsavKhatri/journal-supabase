'use client';

import { generateCsv, generatePdf } from '@/lib/file-export';
import { getEntriesForExport } from '@/lib/dal.client';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

/**
 * The ExportButtons component provides users with options to export their journal entries
 * as either a CSV or a PDF file. It handles the data fetching, file generation, and download process.
 */
export function ExportButtons() {
  const [loadingFormat, setLoadingFormat] = useState<'csv' | 'pdf' | null>(
    null,
  );

  /**
   * Handles the export process for the specified format (CSV or PDF).
   * It fetches all journal entries for the current user, then uses either `papaparse` to create a CSV
   * or `jspdf` to generate a PDF, and triggers a download of the resulting file.
   */
  const handleExport = async (format: 'csv' | 'pdf') => {
    setLoadingFormat(format);
    const entries = await getEntriesForExport();

    if (entries) {
      if (format === 'csv') {
        generateCsv(entries);
      } else if (format === 'pdf') {
        generatePdf(entries);
      }
    }

    setLoadingFormat(null);
  };

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => handleExport('csv')}
        disabled={loadingFormat !== null}
      >
        {loadingFormat === 'csv' && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {loadingFormat === 'csv' ? 'Exporting...' : 'Export to CSV'}
      </Button>
      <Button
        onClick={() => handleExport('pdf')}
        disabled={loadingFormat !== null}
        variant={'outline'}
      >
        {loadingFormat === 'pdf' && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {loadingFormat === 'pdf' ? 'Exporting...' : 'Export to PDF'}
      </Button>
    </div>
  );
}
