import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { AITemplate } from './modules/AITemplate.jsx'
import { BasicExample, MultiMessageExample, ControlledExample } from './modules/StreamingExample.jsx';

const initialTopics = [
  { id: 1, title: 'React 核心概念', detail: '组件、Props、State 与单向数据流', done: false },
  { id: 2, title: 'Hooks', detail: 'useState、useEffect、useMemo 的使用场景', done: false },
  { id: 3, title: '性能优化', detail: '渲染分析、memo 与避免不必要的计算', done: false },
]

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname)
    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const [topics, setTopics] = useState(initialTopics)
  const [currentPage, setCurrentPage] = useState('home')

  const completedCount = useMemo(
    () => topics.filter((topic) => topic.done).length,
    [topics],
  )

  if (pathname === '/modules/aitemplate') {
    return <AITemplate />
  }

  const toggleTopic = (id) => {
    setTopics((currentTopics) =>
      currentTopics.map((topic) =>
        topic.id === id ? { ...topic, done: !topic.done } : topic,
      ),
    )
  }

  if (currentPage === 'greeting') {
    return (
      <main className="app-shell greeting-page">
        <button
          className="back-button"
          type="button"
          onClick={() => setCurrentPage('home')}
        >
          ← 返回主页
        </button>
        <section className="greeting-card" aria-labelledby="greeting-title">
          <p className="eyebrow">子页面</p>
          <h1 id="greeting-title">Hi ChuJiaWen</h1>
        </section>
      </main>
    )
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">React + Vite</p>
        <h1>面试练习看板</h1>
        <p className="intro">
          一个简洁的 React 起步项目：组件、状态管理和派生数据都在这里。
        </p>
        <button
          className="page-link"
          type="button"
          onClick={() => {
            window.history.pushState({}, '', '/modules/aitemplate')
            window.dispatchEvent(new PopStateEvent('popstate'))
          }}
        >
          打开 AI 模板 →
        </button>
      </header>

       <section className="progress-card" aria-labelledby="progress-title">
        <div>
          <p className="card-label" id="progress-title">AI流式文本</p>
        </div>
        <div className="" aria-hidden="true">
         <ControlledExample />
         <MultiMessageExample />
        </div>
      </section>

      <section className="progress-card" aria-labelledby="progress-title">
        <div>
          <p className="card-label" id="progress-title">本周进度</p>
          <strong>{completedCount} / {topics.length}</strong>
          <span> 个主题已完成</span>
        </div>
        <div className="progress-track" aria-hidden="true">
          <div
            className="progress-value"
            style={{ width: `${(completedCount / topics.length) * 100}%` }}
          />
        </div>
      </section>

      <section className="topics" aria-labelledby="topics-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">练习清单</p>
            <h2 id="topics-title">今天要复习什么？</h2>
          </div>
          <button type="button" onClick={() => setTopics(initialTopics)}>
            重置
          </button>
        </div>

        <ul>
          {topics.map((topic) => (
            <li className={topic.done ? 'topic done' : 'topic'} key={topic.id}>
              <label>
                <input
                  checked={topic.done}
                  onChange={() => toggleTopic(topic.id)}
                  type="checkbox"
                />
                <span className="checkmark" aria-hidden="true">✓</span>
                <span>
                  <strong>{topic.title}</strong>
                  <small>{topic.detail}</small>
                </span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <footer>
        从 <code>src/App.jsx</code> 开始，尝试添加题目、筛选和本地存储功能。
      </footer>
    </main>
  )
}

export default App
