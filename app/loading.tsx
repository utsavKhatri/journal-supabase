import React from "react";

/**
 * Displays a loading indicator for the homepage.
 * This component is shown as a fallback while the main content of the homepage is being loaded.
 */
export default function HomePageLoading() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="text-center">
        <div className="loader" />
      </div>
    </div>
  );
}
