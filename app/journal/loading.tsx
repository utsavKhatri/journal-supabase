import React from "react";

/**
 * Displays a loading indicator for the main journal page.
 * This component is shown as a fallback while the journal entries are being loaded.
 */
export default function JournalLoading() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="text-center">
        <div className="loader" />
      </div>
    </div>
  );
}
