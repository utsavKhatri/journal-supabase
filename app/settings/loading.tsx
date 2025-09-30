import React from 'react';

/**
 * Displays a loading indicator for the settings page.
 * This component is shown as a fallback while the content of the settings page is being loaded.
 */
export default function SettingsLoading() {
  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <div className="text-center">
        <div className="loader" />
      </div>
    </div>
  );
}
