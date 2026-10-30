import { useState } from 'react'
import Markdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css' // Import the math styles
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [chats, setChats] = useState([
    { id: 1, title: 'React UI Design Tips' },
    { id: 2, title: 'CSS Flexbox vs Grid' },
    { id: 3, title: 'Gemini API Setup' }
  ])
  const [isLoading, setIsLoading] = useState(false)

  async function handleSend(customText) {
    const textToSend = customText || input

    if (!textToSend.trim() || isLoading) return

    const userMessageId = Date.now()
    const assistantMessageId = userMessageId + 1

    const newMessage = {
      id: userMessageId,
      text: textToSend,
      sender: 'user',
    }

    setMessages((prev) => [
      ...prev, 
      newMessage,
      { id: assistantMessageId, text: '', sender: 'assistant' }
    ])
    
    setIsLoading(true)

    if (!customText) setInput('')

    try {
     const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5001').replace(/\/$/, '')
    console.log('Calling:', `${API_URL}/api/chat`)
    const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
        }),
      })
    if (!response.ok) {
      const errorText = await response.text()

      throw new Error(
        errorText || `Server error: ${response.status} ${response.statusText}`
      )
    }
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let accumulatedText = ''
      let buffer = ''

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        
        if (value) {
          buffer += decoder.decode(value, { stream: true })
          
          const lines = buffer.split('\n')
          buffer = lines.pop()

          for (const line of lines) {
            const trimmedLine = line.trim()
            if (!trimmedLine.startsWith('data: ')) continue

            const dataStr = trimmedLine.replace('data: ', '').trim()
            if (dataStr === '[DONE]') {
              done = true
              break
            }

            try {
              const parsed = JSON.parse(dataStr)
              if (parsed.text) {
                accumulatedText += parsed.text
                setMessages((prev) => 
                  prev.map((msg) => 
                    msg.id === assistantMessageId 
                      ? { ...msg, text: accumulatedText } 
                      : msg
                  )
                )
              }
            } catch (e) {}
          }
        }
      }

    } catch (error) {
      console.error('Chat Error:', error)
      setMessages((prev) => 
        prev.map((msg) => 
          msg.id === assistantMessageId 
            ? { ...msg, text: error.message } 
            : msg
        )
      )
    } finally {
      setIsLoading(false)
    }
  }

  const suggestions = [
    'Create a modern React component',
    'Explain async/await in JS',
    'Write a sleek dark mode CSS layout',
    'Help me debug my code'
  ]

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand">
            <span className="logo-sparkle">✨</span>
            <h2>MiniGPT</h2>
          </div>
          <button className="new-chat-btn" onClick={() => setMessages([])}>
            <span>+</span> New Chat
          </button>
        </div>

        <div className="history-section">
          <p className="history-title">Recent Chats</p>
          <div className="history-list">
            {chats.map((chat) => (
              <button key={chat.id} className="history-item">
                <span className="chat-icon">💬</span>
                <span className="chat-text">{chat.title}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">U</div>
            <span>User Account</span>
          </div>
        </div>
      </aside>

      <main className="chat-area">
        <header className="topbar">
          <div className="model-selector">
            <h3>MiniGPT</h3>
            <span className="version-badge">v2.0 Pro</span>
          </div>
          <span className="badge">Gemini AI</span>
        </header>

        <section className="messages">
          {messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-icon">✨</div>
              <h1>What can I help with?</h1>
              <p>Your AI assistant, ready to chat, code, and generate ideas.</p>

              <div className="suggestions-grid">
                {suggestions.map((item, idx) => (
                  <button key={idx} className="suggestion-card" onClick={() => handleSend(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`message-wrapper ${message.sender}`}>
                <div className="message-avatar">
                  {message.sender === 'assistant' ? '🤖' : '👤'}
                </div>
                <div className={`message ${message.sender}`}>
                  
                  {/* Render Markdown and Math */}
                  {message.text ? (
                    <Markdown 
                      remarkPlugins={[remarkMath]} 
                      rehypePlugins={[rehypeKatex]}
                    >
                      {message.text}
                    </Markdown>
                  ) : message.sender === 'assistant' && isLoading ? (
                    <span className="typing-indicator">Thinking...</span>
                  ) : null}
                  
                </div>
              </div>
            ))
          )}
        </section>

        <form
          className="chat-input-wrapper"
          onSubmit={(event) => {
            event.preventDefault()
            handleSend()
          }}
        >
          <div className="chat-input">
            <input
              type="text"
              placeholder="Message MiniGPT..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
            <button type="submit" disabled={!input.trim() || isLoading}>
              ↑
            </button>
          </div>
        </form>

        <footer className="disclaimer">
          MiniGPT can make mistakes. Verify important information.
        </footer>
      </main>
    </div>
  )
}

export default App