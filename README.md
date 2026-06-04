# UIT Waifu

<p align="center">
  <img src="https://img.shields.io/badge/AI-Assistant-ff69b4?style=for-the-badge" alt="AI Assistant" />
  <img src="https://img.shields.io/badge/University-UIT-blue?style=for-the-badge" alt="UIT" />
  <img src="https://img.shields.io/badge/Status-In_Development-yellow?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <b>Your friendly AI companion for University of Information Technology students.</b>
</p>

<p align="center">
  <i>Study smarter, stay organized, and make university life more enjoyable with an AI assistant built for UIT students.</i>
</p>

<p align="center">
  <a href="https://github.com/Acceleratorer/UIT-Waifu">
    <img src="https://img.shields.io/badge/GitHub-UIT--Waifu-black?style=for-the-badge&logo=github" alt="GitHub Repository" />
  </a>
</p>

---

## Overview

**UIT Waifu** is an AI-powered virtual assistant designed for students at the **University of Information Technology**.

The project combines a friendly chatbot experience with practical academic tools such as study support, code explanation, document summarization, schedule planning, and university-related assistance.

The goal is to build a smart student companion that helps users learn faster, manage academic work, understand difficult subjects, and organize university life more efficiently.

---

## Why UIT Waifu?

University students often need to handle lectures, assignments, exams, projects, schedules, course documents, announcements, and personal tasks at the same time.

UIT Waifu aims to reduce that pressure by giving students one assistant that can answer questions, summarize materials, debug code, and help plan study sessions.

The project focuses on:

- **Academic support** for programming, AI, data science, mathematics, and university subjects.
- **Productivity support** for tasks, deadlines, and study schedules.
- **Friendly experience** that feels more engaging than a normal chatbot.

---

## Main Features

### AI Chat Assistant

UIT Waifu can chat naturally with students and answer academic or daily-life questions.

```txt
User: Explain inheritance in C++ for my OOP exam.
UIT Waifu: Sure! Inheritance allows one class to reuse attributes and methods from another class...
```

### Study Support

UIT Waifu can help with:

- Programming
- Object-Oriented Programming
- Data Structures and Algorithms
- Database Systems
- Computer Networks
- Operating Systems
- Artificial Intelligence
- Machine Learning
- Deep Learning
- Data Science
- Mathematics
- Software Engineering
- Web Development
- MLOps

Example prompts:

```txt
Explain polymorphism in C++ with examples.
Help me solve this SQL query.
Summarize this lecture slide.
Generate practice questions for my final exam.
Explain machine learning overfitting in simple words.
Create a study plan for my database exam.
```

### Code Explanation And Debugging

Students can paste code and ask UIT Waifu to explain, debug, or improve it.

Supported use cases:

- Explain code logic
- Find bugs
- Improve performance
- Refactor code
- Convert code between languages
- Add comments
- Analyze time complexity
- Suggest better implementation strategies

Supported languages can include C, C++, Python, Java, JavaScript, TypeScript, and SQL.

### Document Summarization

UIT Waifu can be extended to support uploaded documents such as PDF lectures, Word documents, PowerPoint slides, Excel files, course materials, timetables, announcements, and student regulations.

Possible actions:

- Summarize documents
- Extract deadlines
- Explain difficult sections
- Generate study notes
- Create practice questions
- Translate Vietnamese and English documents
- Build checklists from official files

### UIT Knowledge Assistant

UIT Waifu can be connected to a UIT-specific knowledge base to answer questions about academic calendars, courses, exam schedules, regulations, announcements, campus information, faculty information, and common student questions.

Important official information should always be verified with official university sources.

### Schedule Planning

UIT Waifu can help students create weekly study plans, exam preparation plans, assignment timelines, and personalized productivity schedules.

### Vietnamese And English Support

UIT Waifu is designed to support both Vietnamese and English conversations.

```txt
Giải thích kế thừa trong C++ cho dễ hiểu.
Explain inheritance in C++ with beginner-friendly examples.
```

---

## Use Cases

### Academic Support

```txt
Explain recursion with a simple C++ example.
Help me understand normalization in database design.
Give me practice problems for data structures.
Explain backpropagation in neural networks.
Compare supervised learning and unsupervised learning.
```

### Code Debugging

```txt
Why does my C++ program have a segmentation fault?
Optimize this Python code.
Explain this SQL trigger.
Convert this Java code to Python.
Analyze the time complexity of this algorithm.
```

### Document Understanding

```txt
Summarize this lecture file.
Extract the important dates from this announcement.
Make a checklist from this document.
Turn this PDF into study notes.
Explain this academic regulation in simple words.
```

### Productivity

```txt
Create a study plan for tomorrow.
Break this project into smaller tasks.
Help me prepare for my presentation.
Create a roadmap for my AI project.
```

---

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- ShadCN UI
- Framer Motion

### Backend

- FastAPI
- Node.js
- Express.js
- REST API
- WebSocket

### AI And NLP

- OpenAI API
- Local LLM
- LangChain
- LlamaIndex
- Prompt Engineering
- Retrieval-Augmented Generation
- Embedding Search

### Database

- PostgreSQL
- MongoDB
- Supabase
- Firebase
- Redis

### Vector Database

- FAISS
- ChromaDB
- Pinecone
- Weaviate
- PostgreSQL pgvector

### Authentication And Deployment

- NextAuth.js
- Supabase Auth
- Firebase Auth
- JWT
- Vercel
- Railway
- Render
- Docker
- GitHub Actions

---

## System Architecture

```txt
User
 │
 ▼
Frontend Application
 │
 ▼
Backend API Server
 │
 ├── Authentication Service
 ├── Conversation Service
 ├── Document Processing Service
 ├── Schedule Service
 └── AI Service
        ├── Prompt Templates
        ├── LLM Provider
        ├── RAG Pipeline
        ├── Embedding Model
        └── Vector Database
```

---

## RAG Pipeline

UIT Waifu can use **Retrieval-Augmented Generation** to answer questions based on uploaded documents or UIT-specific knowledge.

```txt
Upload Document
      │
      ▼
Extract Text
      │
      ▼
Clean Text
      │
      ▼
Split Into Chunks
      │
      ▼
Generate Embeddings
      │
      ▼
Store In Vector Database
      │
      ▼
Retrieve Relevant Chunks
      │
      ▼
Generate Grounded Answer
```

---

## Project Structure

```txt
UIT-Waifu
├── frontend/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── styles/
│   └── types/
│
├── backend/
│   ├── api/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── database/
│   ├── middleware/
│   └── main.py
│
├── ai/
│   ├── prompts/
│   ├── rag/
│   ├── embeddings/
│   ├── vector-store/
│   └── configs/
│
├── docs/
├── public/
├── tests/
├── .env.example
├── .gitignore
├── README.md
├── LICENSE
└── package.json
```

---

## Getting Started

### Prerequisites

```txt
Node.js
npm or pnpm
Git
```

Optional:

```txt
Python
Docker
PostgreSQL
Supabase CLI
```

### Clone The Repository

```bash
git clone https://github.com/Acceleratorer/UIT-Waifu.git
cd UIT-Waifu
```

### Install Dependencies

```bash
npm install
```

or:

```bash
pnpm install
```

### Run The Development Server

```bash
npm run dev
```

or:

```bash
pnpm dev
```

Open:

```txt
http://localhost:3000
```

---

## Environment Variables

Create a `.env.local` file in the root directory.

```env
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_database_url
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

For Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

For vector search:

```env
VECTOR_DATABASE_URL=your_vector_database_url
EMBEDDING_MODEL=text-embedding-model
```

Never commit real environment variables to GitHub.

---

## Example API Design

```txt
/api/chat
/api/auth
/api/users
/api/conversations
/api/messages
/api/documents
/api/schedules
/api/search
```

Example chat request:

```json
{
  "userId": "user_123",
  "message": "Explain polymorphism in C++",
  "conversationId": "conversation_123"
}
```

Example chat response:

```json
{
  "reply": "Polymorphism in C++ allows objects to be treated through a common interface...",
  "sources": [],
  "conversationId": "conversation_123"
}
```

---

## Example Prompt Design

```txt
You are UIT Waifu, a friendly AI assistant for students at the University of Information Technology.

Your responsibilities:
- Help students understand academic topics clearly.
- Explain programming, AI, data science, and university subjects.
- Support both Vietnamese and English.
- Use examples when helpful.
- Be friendly, encouraging, and practical.
- Avoid pretending to know official university information without sources.
- Tell users to verify important academic or administrative information from official UIT channels.

User message:
{message}
```

---

## Development Roadmap

### Phase 1: Core Chatbot

- [ ] Create landing page
- [ ] Build chat interface
- [ ] Connect frontend to backend
- [ ] Connect backend to LLM API
- [ ] Add basic system prompt
- [ ] Support Vietnamese and English
- [ ] Save conversation history

### Phase 2: User System

- [ ] Add authentication
- [ ] Add user profile
- [ ] Add conversation management
- [ ] Add settings page
- [ ] Add custom assistant personality
- [ ] Add dark mode

### Phase 3: Study Tools

- [ ] Add code explanation feature
- [ ] Add code debugging mode
- [ ] Add quiz generator
- [ ] Add flashcard generator
- [ ] Add study plan generator
- [ ] Add exam preparation mode

### Phase 4: Document AI

- [ ] Add PDF upload
- [ ] Add document text extraction
- [ ] Add document summarization
- [ ] Add document question answering
- [ ] Add RAG pipeline
- [ ] Add vector database
- [ ] Add citation support

### Phase 5: Productivity Tools

- [ ] Add task management
- [ ] Add deadline tracker
- [ ] Add schedule planner
- [ ] Add calendar integration
- [ ] Add notification system

### Phase 6: UIT Knowledge Base

- [ ] Add UIT FAQ data
- [ ] Add course information
- [ ] Add academic calendar data
- [ ] Add student regulation search
- [ ] Add announcement summarization
- [ ] Add official source links

### Phase 7: Advanced Experience

- [ ] Add avatar system
- [ ] Add voice interaction
- [ ] Add emotion-based responses
- [ ] Add mobile PWA support
- [ ] Add Discord bot
- [ ] Add Telegram bot
- [ ] Add multi-agent features

---

## Development Guidelines

### Branch Naming

```txt
feature/chat-ui
feature/auth-system
feature/rag-pipeline
feature/document-upload
fix/chat-api-error
docs/update-readme
refactor/ai-service
```

### Commit Message Format

```txt
feat: add chat interface
fix: resolve API error handling
docs: update README
style: improve landing page
refactor: clean AI service
test: add chat API tests
```

### Code Style

- Use TypeScript where possible.
- Keep components reusable.
- Separate business logic from UI logic.
- Keep API keys in environment variables.
- Write clear function names.
- Add comments for complex logic.
- Validate user input.
- Handle API errors properly.

---

## Security And Privacy

Security principles:

- Never commit API keys.
- Use environment variables for secrets.
- Validate uploaded files.
- Sanitize user input.
- Protect user conversations.
- Use authentication for private data.
- Apply rate limiting to API routes.

Privacy principles:

- Do not share user conversations publicly.
- Do not expose uploaded documents.
- Allow users to delete their data.
- Be transparent about AI-generated content.

Example `.gitignore`:

```gitignore
node_modules
.next
dist
build
.env
.env.local
.env.production
.env.development
.DS_Store
coverage
*.log
```

---

## Limitations

UIT Waifu may sometimes generate incorrect, incomplete, or outdated information.

Users should verify important information from official sources, especially exam schedules, tuition information, graduation requirements, university policies, official announcements, and administrative procedures.

UIT Waifu should not be treated as an official university representative.

---

## Contributing

Contributions are welcome.

You can contribute by improving the UI, building backend APIs, adding AI features, improving prompts, adding RAG support, writing documentation, fixing bugs, or suggesting new features.

### How To Contribute

```bash
git clone https://github.com/Acceleratorer/UIT-Waifu.git
cd UIT-Waifu
git checkout -b feature/your-feature-name
git add .
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
```

Then open a pull request.

---

## Contributors

<a href="https://github.com/Acceleratorer">
  <img src="https://github.com/Acceleratorer.png" width="60px;" alt="Acceleratorer" />
</a>

---

## License

This project is licensed under the MIT License.

See the `LICENSE` file for more information.

---

## Disclaimer

UIT Waifu is an independent student project.

This project is not officially affiliated with the University of Information Technology or Vietnam National University Ho Chi Minh City.

The name "UIT" is used only to describe the target student community of the project.

Important academic and administrative information should always be verified through official university sources.

---

## Acknowledgements

Special thanks to:

- UIT student community
- Open-source AI developers
- Educational technology communities
- Developers building helpful student tools
- Everyone contributing feedback and ideas

---

## Contact

```txt
GitHub: https://github.com/Acceleratorer
Repository: https://github.com/Acceleratorer/UIT-Waifu
```

---

<p align="center">
  Made with love for UIT students.
</p>

<p align="center">
  <b>UIT Waifu — Your AI companion for studying, productivity, and university life.</b>
</p>
