import { invoke } from "@tauri-apps/api/core";
import { useState, useCallback } from "react";

interface UseTauriCommandResult<T> {
  execute: (args?: Record<string, unknown>) => Promise<T>;
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useTauriCommand<T>(command: string): UseTauriCommandResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (args?: Record<string, unknown>): Promise<T> => {
    setLoading(true);
    setError(null);
    try {
      const result = await invoke<T>(command, args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [command]);

  return { execute, data, loading, error };
}
