import { useEffect, useState } from 'react'

const INPUT_TEMPLATE = `You are a {{role}} expert. Please help me {{task}}.

Requirements:
- Target audience: {{audience}}
- Output format: {{format}}
- Language: {{language}}`

const REGEX_VARIABLES = /\{\{(\w+)\}\}/g

function useDebounce(value,waitTime){
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(()=>{
        const timerId = setTimeout(()=> setDebouncedValue(value), waitTime);
        return () => clearTimeout(timerId);
    }, [value, waitTime]);
    return debouncedValue;
    
}

export function AITemplate() {
    const [template, setTemplate] = useState(INPUT_TEMPLATE)
    const [templateVars, setTemplateVars] = useState({})

    useEffect(() => {
        const timerId = setTimeout(() => {
            const temp = template.matchAll(REGEX_VARIABLES);
            console.log("temp",...temp)
            const vars = [...template.matchAll(REGEX_VARIABLES)].map(
                (match) => match[1],
            )

            setTemplateVars((prevVars) =>
                Object.fromEntries(
                    vars.map((varName) => [varName, prevVars[varName] || '']),
                ),
            )
        }, 300)

        return () => clearTimeout(timerId)
    }, [template])

    const handleTemplateChange = (event) => {
        setTemplate(event.target.value)
    }

    return (
        <main className="app-shell">
            <button
                className="back-button"
                type="button"
                onClick={() => window.history.back()}
            >
                ← 返回主页
            </button>
            <header className="hero">
                <p className="eyebrow">AI 工具</p>
                <h1>Prompt 模板</h1>
                <p className="intro">编辑并复用你的 AI 提示词模板。</p>
            </header>
            <section className="topics" aria-labelledby="template-title">
                <h2 id="template-title">模板内容</h2>
                <textarea rows={20} value={template} onChange={handleTemplateChange} />

            </section>
            <section className='variables'>
                <h2>Variables ({Object.keys(templateVars).length})</h2>
                {Object.keys(templateVars).map((varName) => (
                    <div key={varName}>
                        <label htmlFor={varName}>{varName}</label>
                        <input
                            type="text"
                            id={varName}
                            value={templateVars[varName]}
                            onChange={(event) =>
                                setTemplateVars((prevVars) => ({
                                    ...prevVars,
                                    [varName]: event.target.value,
                                }))
                            }
                        />
                    </div>
                ))}
            </section>

            {/* <div></div>
                <input
                    type="text"
                    aria-label="Prompt 模板内容"
                    value={template}
                    onChange={(event) => setTemplate(event.target.value)}
                /> */}
            <section>
                <h2>PREVIEW</h2>
                <textarea disabled rows={20} value={template.replace(REGEX_VARIABLES, (match, varName) => templateVars[varName] || match)} />
            </section>
        </main>
    )
}