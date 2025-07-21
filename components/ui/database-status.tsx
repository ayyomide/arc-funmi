"use client";

import { useEffect, useState } from 'react';
import { checkDatabaseSetup, getSetupInstructions, DatabaseStatus } from '@/lib/database-checker';

export function DatabaseStatusBanner() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [isChecking, setIsChecking] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    checkDatabaseSetup()
      .then(setStatus)
      .finally(() => setIsChecking(false));
  }, []);

  // Only show in development and if database isn't fully set up
  if (process.env.NODE_ENV === 'production' || !status || status.isSetup) {
    return null;
  }

  if (isChecking) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              🔍 Checking database setup...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
      <div className="flex">
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800">
            ⚠️ Database Setup Required
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>
              Your Supabase database needs to be configured before you can use authentication and data features.
            </p>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-500 underline"
            >
              {showDetails ? 'Hide' : 'Show'} setup instructions
            </button>
          </div>
          
          {showDetails && (
            <div className="mt-4 p-4 bg-white rounded border border-red-200">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono">
                {getSetupInstructions().join('\n')}
              </pre>
              
              {(() => {
                const errors = [
                  status.userCheck.error,
                  status.insertionTest.error,
                  status.relationshipTest.error
                ].filter(Boolean) as string[];
                return errors.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-red-800 mb-2">Detected Issues:</h4>
                    <ul className="text-xs text-red-600 space-y-1">
                      {errors.map((error: string, index: number) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 