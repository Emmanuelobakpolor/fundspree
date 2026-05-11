'use client';

import { useAuth } from '../../components/AuthContext';
import VerificationStatus from '../../components/VerificationStatus';
import { useEffect, useState } from 'react';

export default function VerificationPage() {
  const { isAuthenticated, markVerificationScreenSeen } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mark the verification screen as seen
    markVerificationScreenSeen();
    setIsLoading(false);
  }, [markVerificationScreenSeen]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please Sign In
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You need to be logged in to view your account verification status.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return <VerificationStatus />;
}
