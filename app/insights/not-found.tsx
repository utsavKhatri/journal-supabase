import React from "react";
import Link from "next/link";

export default function InsightsNotFound() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Insights not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn&#39;t find any insights to show.
        </p>
        <div className="mt-4">
          <Link href="/" className="underline">
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
