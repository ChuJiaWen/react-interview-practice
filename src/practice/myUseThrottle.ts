import { useCallback, useRef } from "react";

export function myUseThrottle<T extends (...args:any[]) => any> (fn:T, delay:number=300) {
    const lastRunRef = useRef<number>(0);
    const timerRef = useRef<number|null>(null);
    
    return useCallback((...args: Parameters<T> ) => {
        const curRun = Date.now();
        if (curRun-lastRunRef.current>=delay) {
            if(timerRef.current) {
                clearTimeout(timerRef.current);
                timerRef.current = null;
            }

            lastRunRef.current = curRun;
            fn(...args);
            return
        }

        if (!timerRef.current){
            const remainingTime = delay-(curRun-lastRunRef.current);
            timerRef.current = setTimeout(()=>{
                fn(...args);
                lastRunRef.current = Date.now();
                timerRef.current = null;
            }, remainingTime)
        }
    }, [fn, delay])
    
}