import { useMemo } from 'react';

export function useQueryParams(): Record<string, string> {
  return useMemo(() => {
    var queryString = window.location.search; // ?mode=easy&debug=true
    var params = new URLSearchParams(queryString);
    var result: Record<string, string> = {};

    for (var [key, value] of params.entries()) result[key] = value;

    return result;
  }, []);
}