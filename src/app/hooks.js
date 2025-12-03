import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export function useDebouncedValue(value, delayMs) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}