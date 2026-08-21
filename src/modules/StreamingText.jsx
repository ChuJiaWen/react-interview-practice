import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import './StreamingText.css';

const StreamingText = forwardRef(({
  text,
  speed = 1000,          // 每个字符的延迟（毫秒）
  onComplete = () => {},
  onChar = () => {},
  className = '',
}, ref) => {
  // ---------- 状态 ----------
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  // 使用 ref 存储可变数据，避免闭包问题
  const indexRef = useRef(0);
  const timerRef = useRef(null);
  const isMountedRef = useRef(true);

  // ---------- 核心方法 ----------
  const stopTimer = () => {
    console.log("Stopping timer");
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startTimer = () => {
    stopTimer();
    if (indexRef.current >= text.length) {
      setIsComplete(true);
      setIsStreaming(false);
      onComplete();
      return;
    }
    setIsStreaming(true);
    timerRef.current = setTimeout(typeNextChar, speed);
  };

  const typeNextChar = () => {
    if (!isMountedRef.current) return;

    if (indexRef.current < text.length) {
      const char = text.charAt(indexRef.current);
      setDisplayText(prev => prev + char);
      onChar(char, indexRef.current);
      indexRef.current++;
      // 继续下一个字符
      if (indexRef.current < text.length) {
        timerRef.current = setTimeout(typeNextChar, speed);
      } else {
        // 全部显示完成
        setIsComplete(true);
        setIsStreaming(false);
        onComplete();
      }
    }
  };

  // ---------- 控制方法（暴露给父组件） ----------
  const pause = () => {
    if (!isStreaming || isPaused || isComplete) return;
    stopTimer();
    setIsPaused(true);
    setIsStreaming(false);
  };

  const resume = () => {
    if (!isPaused || isComplete) return;
    setIsPaused(false);
    setIsStreaming(true);
    startTimer(); // 从当前索引继续
  };

  const reset = () => {
    stopTimer();
    setDisplayText('');
    indexRef.current = 0;
    setIsComplete(false);
    setIsPaused(false);
    setIsStreaming(false);
    // 可选：自动开始播放
    // startTimer();
  };

  const skip = () => {
    if (isComplete) return;
    stopTimer();
    // 一次性显示全部剩余文本
    const remaining = text.substring(indexRef.current);
    setDisplayText(prev => prev + remaining);
    indexRef.current = text.length;
    setIsComplete(true);
    setIsPaused(false);
    setIsStreaming(false);
    onComplete();
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
  useEffect(() => {
    isMountedRef.current = true;
    // 开始自动播放
    startTimer();

    return () => {
      isMountedRef.current = false;
      stopTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed]); // 当 text 或 speed 变化时重新开始

  // 如果外部改变 text，重置所有状态（由 effect 处理）
  useEffect(() => {
    // 当 text 改变时重置
    setDisplayText('');
    indexRef.current = 0;
    setIsComplete(false);
    setIsPaused(false);
    setIsStreaming(false);
    stopTimer();
    startTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  // ---------- 渲染 ----------
  return (
    <div className={`streaming-text-container ${className}`}>
      <div className="streaming-text-content">
        {displayText}
        {!isComplete && (
          <span className={`cursor ${isPaused ? 'paused' : 'blinking'}`}>
            |
          </span>
        )}
      </div>
    </div>
  );
});

StreamingText.displayName = 'StreamingText';

export default StreamingText;