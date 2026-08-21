import React, { useRef, useState } from 'react';
import StreamingText from './StreamingTextCopy';

// 基础用法
const BasicExample = () => {
  const message = "你好！我是AI助手，很高兴为你服务。我可以帮你解答问题、编写代码、分析数据等等。请问有什么我可以帮你的吗？";

  return (
    <div style={{ padding: '20px' }}>
      <StreamingText 
        text={message} 
        // speed={25}
        onComplete={() => console.log('输出完成！')}
      />
    </div>
  );
};


// 高级用法：多条消息按顺序显示
const MultiMessageExample = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "AI：你好！我是智能助手。", completed: false },
    { id: 2, text: "AI：今天有什么可以帮你的吗？", completed: false }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleMessageComplete = () => {
    setMessages(prev => {
      const updated = [...prev];
      updated[currentIndex].completed = true;
      return updated;
    });

    // 播放下一条消息
    if (currentIndex < messages.length - 1) {
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 500);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      {messages.map((msg, index) => (
        <div key={msg.id} style={{ marginBottom: '12px' }}>
          {index < currentIndex ? (
            // 已完成的消息直接显示完整文本
            <div className="streaming-text-container" style={{ background: '#2d2d2d' }}>
              <div className="streaming-text-content">{msg.text}</div>
            </div>
          ) : index === currentIndex ? (
            // 当前正在输出的消息
            <StreamingText 
              text={msg.text}
              // speed={20}
              onComplete={handleMessageComplete}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
};

// 带控制按钮的示例
const ControlledExample = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [text] = useState("这是一个可控制的流式文本显示组件。你可以点击按钮暂停或继续输出。");
  const streamingTextRef = useRef(null);

  const togglePlayback = () => {
    if (isPlaying) {
      streamingTextRef.current?.pause();
    } else {
      streamingTextRef.current?.resume();
    }
    setIsPlaying((playing) => !playing);
  };

  return (
    <div style={{ padding: '20px' }}>
      <StreamingText 
        ref={streamingTextRef}
        text={text}
        // speed={30} 
        onComplete={() => console.log('完成！')}
      />
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={togglePlayback}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: '#4fc3f7',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {isPlaying ? '暂停' : '继续'}
        </button>
        <button 
          onClick={() => window.location.reload()}
          style={{
            padding: '8px 16px',
            borderRadius: '6px',
            border: 'none',
            background: '#ff6b6b',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          重置
        </button>
      </div>
    </div>
  );
};

export { BasicExample, MultiMessageExample, ControlledExample };