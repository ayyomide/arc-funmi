"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Create debug function locally
function debugSupabase() {
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return {
    hasValidConfig: hasUrl && hasAnonKey,
    hasUrl,
    hasAnonKey,
    url: hasUrl ? process.env.NEXT_PUBLIC_SUPABASE_URL : 'Missing',
    anonKey: hasAnonKey ? 'Set' : 'Missing'
  };
}

interface DebugInfo {
  environment: string;
  hasValidConfig: boolean;
  authLoading: boolean;
  user: any;
  session: any;
  domain: string;
  timestamp: string;
  userAgent: string;
}

export function DeploymentDebug() {
  const { user, session, loading } = useAuth();
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or if there's an issue
    const shouldShow = process.env.NODE_ENV === 'development' || 
                       !process.env.NEXT_PUBLIC_SUPABASE_URL || 
                       !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    setIsVisible(shouldShow);

    if (typeof window !== 'undefined') {
      const debug = debugSupabase();
      setDebugInfo({
        environment: process.env.NODE_ENV || 'unknown',
        hasValidConfig: debug.hasValidConfig,
        authLoading: loading,
        user: user ? { id: user.id, email: user.email } : null,
        session: session ? { user: session.user?.email, expires_at: session.expires_at } : null,
        domain: window.location.origin,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent.includes('Vercel') ? 'Vercel' : 'Local'
      });
    }
  }, [user, session, loading]);

  // Only render if there's an issue or in development
  if (!isVisible && debugInfo?.hasValidConfig) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg border border-gray-700 max-w-md text-xs font-mono z-50">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-yellow-400">🔧 Debug Info</span>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>
      
      {debugInfo && (
        <div className="space-y-1">
          <div className="flex justify-between">
            <span>Environment:</span>
            <span className={debugInfo.environment === 'production' ? 'text-red-400' : 'text-green-400'}>
              {debugInfo.environment}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Config Valid:</span>
            <span className={debugInfo.hasValidConfig ? 'text-green-400' : 'text-red-400'}>
              {debugInfo.hasValidConfig ? '✅' : '❌'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Auth Loading:</span>
            <span className={debugInfo.authLoading ? 'text-yellow-400' : 'text-green-400'}>
              {debugInfo.authLoading ? 'Yes' : 'No'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>User:</span>
            <span className={debugInfo.user ? 'text-green-400' : 'text-gray-400'}>
              {debugInfo.user ? '✅ Logged In' : '❌ Not Logged'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Session:</span>
            <span className={debugInfo.session ? 'text-green-400' : 'text-gray-400'}>
              {debugInfo.session ? '✅ Active' : '❌ None'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span>Platform:</span>
            <span className="text-blue-400">{debugInfo.userAgent}</span>
          </div>
          
          <div className="border-t border-gray-700 pt-2 mt-2">
            <div className="text-gray-400">Domain: {debugInfo.domain}</div>
            <div className="text-gray-400">Time: {new Date(debugInfo.timestamp).toLocaleTimeString()}</div>
          </div>

          {/* Show specific error messages */}
          {!debugInfo.hasValidConfig && (
            <div className="border-t border-red-700 pt-2 mt-2 text-red-400">
              <div className="font-bold">❌ Configuration Error</div>
              <div>Missing environment variables!</div>
              {process.env.NODE_ENV === 'production' && (
                <div>Check Vercel environment settings</div>
              )}
            </div>
          )}

          {debugInfo.hasValidConfig && !debugInfo.user && !debugInfo.authLoading && (
            <div className="border-t border-yellow-700 pt-2 mt-2 text-yellow-400">
              <div className="font-bold">⚠️ Auth Issue</div>
              <div>Session not restoring properly</div>
            </div>
          )}
        </div>
      )}
      
      <div className="border-t border-gray-700 pt-2 mt-2">
        <button 
          onClick={() => {
            console.log('🔍 Full Debug Info:', debugInfo);
            if (typeof window !== 'undefined') {
              console.log('🔍 localStorage auth:', localStorage.getItem('sb-' + process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0] + '-auth-token'));
            }
          }}
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Log Full Debug Info
        </button>
      </div>
    </div>
  );
} 