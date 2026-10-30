# ✨ MiniGPT – AI Chatbot

A modern AI chatbot powered by Google's Gemini API. Built with React, Vite, Node.js and Express, MiniGPT delivers real-time streaming responses with Markdown and mathematical expression rendering.

## 🚀 Features

* AI-powered conversations using Google Gemini.
* Real-time streaming responses using Server-Sent Events (SSE).
* Markdown rendering for formatted AI responses.
* Mathematical equation rendering using KaTeX.
* Modern dark-themed user interface.
* Suggested prompts for quick conversations.
* Loading indicators during AI generation.

## 🛠️ Tech Stack

**Frontend**

* React
* Vite
* CSS
* React Markdown
* Remark Math
* Rehype KaTeX

**Backend**

* Node.js
* Express.js
* Google Gemini API
* Server-Sent Events (SSE)

## 📁 Project Structure

```
MiniGPT/
├── public/
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/Ayu2803/miniGPT.git
cd miniGPT
```

### 2. Install frontend dependencies

```
npm install
```

### 3. Install backend dependencies

```
cd server
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the `server` directory.

Add your Gemini API key:

```
GEMINI_API_KEY=your_gemini_api_key
```

Never upload your API key to GitHub.

### 5. Start the backend

From the server directory:

```
node server.js
```

Backend runs at `http://localhost:5001`.

### 6. Start the frontend

Open another terminal in the project root:

```
npm run dev
```

Frontend runs at `http://localhost:5173`.

## 🔮 Future Improvements

* User authentication
* Persistent conversation history
* MongoDB integration
* Multiple AI model support
* PDF upload and analysis
* Image understanding
* Code syntax highlighting

## 👩‍💻 Developer

**Ayushi Pandey**

GitHub: [@Ayu2803](https://github.com/Ayu2803)

---

⭐ If you like this project, consider giving it a star!
