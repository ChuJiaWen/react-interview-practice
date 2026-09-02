import {useState, useEffect} from 'react';

export function useDebounce(value, timeout) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(()=>{
        const timer = setTimeout(()=>{
            setDebouncedValue(value);
        }, timeout||300)

        return ()=>clearTimeout(timer);
        
    }, [value]);

    return debouncedValue;
}