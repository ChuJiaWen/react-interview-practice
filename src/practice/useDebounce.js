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

export function myDebounce(fn, delay) {
    let timer = null;
    return function(...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(()=>{
            fn.apply(this,args);
            timer = null;
        }, delay)
    }
}