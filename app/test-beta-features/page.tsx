"use client";

import React from 'react';

export default function TestBetaFeatures() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Test Beta Features
          </h1>
          <p className="text-gray-600 mb-4">
            This page is for testing beta features of the application.
          </p>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h2 className="text-xl font-semibold text-blue-900 mb-2">
                Beta Feature 1
              </h2>
              <p className="text-blue-700">
                This is a placeholder for the first beta feature.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h2 className="text-xl font-semibold text-green-900 mb-2">
                Beta Feature 2
              </h2>
              <p className="text-green-700">
                This is a placeholder for the second beta feature.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 