import React from "react";
import Link from "next/link";

/**
 * A component to be displayed when a specific journal entry is not found.
 * It provides a user-friendly message and a link to navigate back to the main journal page.
 */
export default function JournalEntryNotFound() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Entry not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&#39;t find this journal entry.
        </p>
        <div className="mt-4">
          <Link href="/journal" className="underline">
            Back to journal
          </Link>
        </div>
      </div>
    </div>
  );
}
