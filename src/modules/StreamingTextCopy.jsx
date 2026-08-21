import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import './StreamingText.css';

const StreamingText = forwardRef(({
  text,
  speed = 1000,          // 每个字符的延迟（毫秒）
  onComplete = () => { },
  onChar = () => { },
  className = '',
}, ref) => {
  // ---------- 状态 ----------
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const indexRef = useRef(0);
  const timerRef = useRef(null);
  useEffect(()=>{
    startTimer();
  },[])

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = null;
    indexRef.current = null;
    setDisplayText('');
    setIsComplete(false);
    setIsPaused(false);
    setIsStreaming(false);
    startTimer();
  }, [text])


  // ---------- 核心方法 ----------
  const stopTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    if (indexRef.current < text.length) {
      timerRef.current = setTimeout(() => typeNextChar(), speed);
      setIsComplete(false);
      setIsPaused(false);
      setIsStreaming(true);
    } else {
      setIsComplete(true);
      setIsStreaming(false);
    }
  };

  const typeNextChar = () => {
    const char = text.charAt(indexRef.current);
    setDisplayText((prev)=> prev+char);
    indexRef.current++;
    if (indexRef.current < text.length) {
      timerRef.current = setTimeout(() => typeNextChar(), speed);
    } else {
      setIsComplete(true);
      setIsPaused(true);
      setIsStreaming(false);
    }
  };

  // ---------- 控制方法（暴露给父组件） ----------
  const pause = () => {
    if (isComplete || isPaused ) return;
    stopTimer();
    setIsPaused(true);
    setIsStreaming(false);
  };

  const resume = () => {
    if (!isPaused || isComplete) return;
    setIsPaused(false);
    setIsStreaming(true);
    startTimer();
  };

  const reset = () => {
    stopTimer();
    setDisplayText('');
    indexRef.current = 0;
    setIsComplete(false);
    setIsPaused(false);
    setIsStreaming(false);
  };

  const skip = () => {

  };

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    pause,
    resume,
    reset,
    skip,
    getStatus: () => ({ isComplete, isPaused, isStreaming, progress: indexRef.current / text.length }),
  }));

  // ---------- 生命周期 ----------

  // 如果外部改变 text，重置所有状态（由 effect 处理）
  useEffect(() => {
  }, [text]);

  // ---------- 渲染 ----------
  return (
    <div className={`streaming-text-container ${className}`}>
      <div className="streaming-text-content">
        {displayText}
        <span className={!isPaused ? 'blinking':'paused'}>|</span>
      </div>
    </div>
  );
});

StreamingText.displayName = 'StreamingText';

export default StreamingText;