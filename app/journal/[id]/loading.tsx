import React from 'react';

/**
 * Displays a loading indicator while a journal entry is being loaded.
 * This component is shown as a fallback while the content of a specific journal entry page is being fetched.
 */
export default function JournalEntryLoading() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="text-center">
        <div className="loader" />
      </div>
    </div>
  );
}
