import { useState, useCallback } from 'react';
import { errorHandler } from '../services/errorHandler';
import { ErrorType } from '../types';

interface UseLoadingErrorReturn {
  loading: boolean;
  error: ErrorType | null;
  handleError: (error: any) => void;
  clearError: () => void;
  withErrorHandling: <T>(fn: () => Promise<T>) => Promise<T | undefined>;
}

export function useLoadingError(): UseLoadingErrorReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ErrorType | null>(null);

  const handleError = useCallback((error: any) => {
    const formattedError = errorHandler.handleError(error);
    setError(formattedError);
    errorHandler.showError(formattedError);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const withErrorHandling = useCallback(async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
    try {
      setLoading(true);
      clearError();
      const result = await fn();
      return result;
    } catch (error) {
      handleError(error);
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [clearError, handleError]);

  return {
    loading,
    error,
    handleError,
    clearError,
    withErrorHandling,
  };
} 