import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState, useContext} from "react";
import { ThemeContext } from './ThemeContext.jsx';

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

export function useTheme() {
    return useContext(ThemeContext);
}
