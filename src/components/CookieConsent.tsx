import React, { useState, useEffect } from 'react';
import type { CookieConsent } from '../types';

export function CookieConsent() {
  const [show, setShow] = useState(false);
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setShow(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const newConsent = { necessary: true, analytics: true, marketing: true };
    setConsent(newConsent);
    localStorage.setItem('cookieConsent', JSON.stringify(newConsent));
    setShow(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50 p-6 border-t">
      <div className="max-w-7xl mx-auto">
        <div className="md:flex items-center justify-between">
          <div className="mb-4 md:mb-0 md:mr-4">
            <h3 className="text-lg font-semibold mb-2">Cookie Preferences</h3>
            <p className="text-gray-600">
              We use cookies to enhance your browsing experience and analyze our traffic.
            </p>
          </div>
          <div className="space-y-2 md:space-y-0 md:space-x-4 flex flex-col md:flex-row">
            <button
              onClick={handleAcceptAll}
              className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              Accept All
            </button>
            <button
              onClick={handleSavePreferences}
              className="border border-black px-6 py-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="necessary"
              checked={consent.necessary}
              disabled
              className="rounded border-gray-300"
            />
            <label htmlFor="necessary" className="ml-2 text-sm text-gray-700">
              Necessary (Required)
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="analytics"
              checked={consent.analytics}
              onChange={(e) => setConsent({ ...consent, analytics: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="analytics" className="ml-2 text-sm text-gray-700">
              Analytics
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="marketing"
              checked={consent.marketing}
              onChange={(e) => setConsent({ ...consent, marketing: e.target.checked })}
              className="rounded border-gray-300"
            />
            <label htmlFor="marketing" className="ml-2 text-sm text-gray-700">
              Marketing
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}