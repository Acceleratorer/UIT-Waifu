# UIT Waifu

<p align="center">
  <img src="https://img.shields.io/badge/AI-Student_Assistant-ff69b4?style=for-the-badge" alt="AI Student Assistant" />
  <img src="https://img.shields.io/badge/University-UIT-blue?style=for-the-badge" alt="UIT" />
  <img src="https://img.shields.io/badge/Status-In_Development-yellow?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

<p align="center">
  <b>Your friendly AI companion for University of Information Technology students.</b>
</p>

<p align="center">
  <i>Study smarter, code better, understand documents faster, and organize university life with an AI assistant built for UIT students.</i>
</p>

<p align="center">
  <a href="https://github.com/Acceleratorer/UIT-Waifu">
    <img src="https://img.shields.io/badge/GitHub-UIT--Waifu-black?style=for-the-badge&logo=github" alt="GitHub Repository" />
  </a>
</p>

---

## Table Of Contents

- [Overview](#overview)
- [Project Vision](#project-vision)
- [Core Features](#core-features)
- [AI Features](#ai-features)
- [Student Productivity Features](#student-productivity-features)
- [UIT Knowledge Features](#uit-knowledge-features)
- [Use Cases](#use-cases)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [RAG Pipeline](#rag-pipeline)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Design](#api-design)
- [Prompt Design](#prompt-design)
- [Database Design Ideas](#database-design-ideas)
- [Development Roadmap](#development-roadmap)
- [Security And Privacy](#security-and-privacy)
- [Contributing](#contributing)
- [License](#license)
- [Disclaimer](#disclaimer)

---

## Overview

**UIT Waifu** is an AI-powered student assistant designed for students at the **University of Information Technology**.

The project combines a friendly chatbot experience with practical academic features such as study support, code explanation, document summarization, schedule planning, task organization, and university-related assistance.

UIT Waifu is designed to be more than a normal chatbot. The long-term goal is to build a useful AI companion that can understand student needs, support learning workflows, and help users manage academic life more efficiently.

---

## Project Vision

Students often deal with multiple sources of information at the same time: lecture slides, PDFs, course schedules, exam plans, assignments, coding projects, university announcements, and personal notes.

UIT Waifu aims to become a single assistant that helps students:

- Learn difficult topics faster.
- Debug and understand code more clearly.
- Summarize academic documents.
- Plan study sessions and project milestones.
- Search through university-related materials.
- Manage daily academic productivity.
- Interact in both Vietnamese and English.

The assistant should be friendly and fun, but the main priority is always usefulness, clarity, and real academic value.

---

## Core Features

### 1. AI Chat Assistant

UIT Waifu can chat naturally with students and answer academic, technical, and productivity-related questions.

```txt
User: Explain inheritance in C++ for my OOP exam.
UIT Waifu: Inheritance allows one class to reuse properties and methods from another class. Here is a simple example...
```

The assistant should provide clear explanations, step-by-step reasoning, examples, and practical guidance.

### 2. Study Support

UIT Waifu can help students study topics such as:

- Programming fundamentals
- Object-Oriented Programming
- Data Structures and Algorithms
- Database Systems
- Computer Networks
- Operating Systems
- Artificial Intelligence
- Machine Learning
- Deep Learning
- Data Science
- Linear Algebra
- Discrete Mathematics
- Probability and Statistics
- Software Engineering
- Web Development
- Backend Development
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

### 3. Code Explanation And Debugging

Students can paste code and ask UIT Waifu to explain, debug, optimize, or refactor it.

Supported coding tasks:

- Explain code logic.
- Find bugs and runtime errors.
- Explain compiler errors.
- Improve algorithm complexity.
- Refactor messy code.
- Convert code between languages.
- Add comments and documentation.
- Explain data structures.
- Explain SQL queries and triggers.
- Suggest better project architecture.

Potential supported languages:

- C
- C++
- Python
- Java
- JavaScript
- TypeScript
- SQL
- Bash

### 4. Document Understanding

UIT Waifu can be extended to process uploaded files such as:

- PDF lecture notes
- PowerPoint slides
- Word documents
- Excel files
- Course materials
- Timetables
- University announcements
- Student regulation documents
- Project requirement documents

Document actions:

- Summarize documents.
- Extract key points.
- Extract deadlines and important dates.
- Generate study notes.
- Create checklists.
- Translate between Vietnamese and English.
- Answer questions based on uploaded content.
- Generate quizzes from lecture files.

### 5. Personalized Student Workspace

The project can include a dashboard where students manage their academic workflow.

Possible dashboard modules:

- Chat history
- Saved notes
- Uploaded documents
- Study plans
- Tasks
- Course list
- Exam preparation progress
- Project milestones
- User settings

---

## AI Features

### Conversational AI

- Natural chat interface
- Context-aware conversations
- Multi-turn memory for current session
- Clear explanations with examples
- Vietnamese and English responses
- Friendly assistant personality

### Academic Tutor Mode

- Explain concepts step by step
- Generate examples
- Create exercises
- Check answers
- Provide hints before full solutions
- Summarize lessons
- Build revision notes

### Coding Assistant Mode

- Debug code
- Explain algorithms
- Analyze complexity
- Review code style
- Suggest improvements
- Generate starter code
- Explain errors from compiler logs

### Document QA Mode

- Upload document
- Extract text
- Chunk content
- Search relevant sections
- Generate grounded answers
- Include source snippets when possible

### Study Planner Mode

- Break large goals into smaller tasks
- Suggest daily study plans
- Prepare exam revision schedules
- Track progress
- Recommend focus areas

---

## Student Productivity Features

Planned productivity features:

- Task management
- Deadline tracking
- Study schedule planning
- Course-based organization
- Project milestone planning
- Exam preparation checklist
- Notes management
- Calendar integration
- Progress tracking
- Smart study recommendations

Example productivity prompts:

```txt
Create a 3-day study plan for my OOP exam.
Break my AI project into weekly milestones.
Make a checklist from this course announcement.
Help me prepare for my database presentation.
```

---

## UIT Knowledge Features

UIT Waifu can be connected to a university-specific knowledge base.

Possible knowledge sources:

- Academic calendar
- Course information
- Faculty information
- Student regulations
- Official announcements
- Timetables
- Exam schedules
- Frequently asked questions
- Public university documents

Possible features:

- Search UIT-related documents
- Explain announcements in simple language
- Extract important dates
- Summarize student regulations
- Answer questions based on trusted sources
- Provide links to official references when available

Important academic or administrative information should always be checked with official university channels.

---

## Use Cases

### Academic Support

```txt
Explain recursion with a simple C++ example.
Help me understand database normalization.
Give me practice problems for data structures.
Explain backpropagation in neural networks.
Compare supervised learning and unsupervised learning.
Explain object-oriented programming for exam revision.
```

### Code Debugging

```txt
Why does my C++ program have a segmentation fault?
Optimize this Python code.
Explain this SQL trigger.
Convert this Java code to Python.
Analyze the time complexity of this algorithm.
Fix my TypeScript API error.
```

### Document Understanding

```txt
Summarize this lecture file.
Extract important dates from this announcement.
Make a checklist from this document.
Turn this PDF into study notes.
Explain this academic regulation in simple words.
```

### Project Planning

```txt
Create a roadmap for my machine learning project.
Break this web app into frontend, backend, and database tasks.
Suggest a clean architecture for my AI assistant app.
Help me design a RAG pipeline for course documents.
```

---

## Tech Stack

This repository can be implemented using a modern AI web application stack.

### Frontend

- **Next.js** for full-stack React development
- **React** for component-based UI
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **ShadCN UI** for reusable UI components
- **Framer Motion** for animations
- **Lucide React** for icons
- **React Hook Form** for forms
- **Zod** for validation

### Backend

- **FastAPI** for Python-based AI backend
- **Node.js** or **Express.js** for JavaScript backend services
- **REST API** for standard client-server communication
- **WebSocket** for streaming chat responses
- **Pydantic** for backend data validation
- **Uvicorn** for FastAPI serving

### AI And LLM

- **OpenAI API** for LLM responses
- **Local LLMs** for offline or private deployment experiments
- **LangChain** for chains, tools, and retrieval workflows
- **LlamaIndex** for document indexing and RAG
- **Prompt engineering** for assistant behavior
- **Embedding models** for semantic search
- **RAG** for grounded document answers

### Data And Storage

- **PostgreSQL** for relational data
- **MongoDB** for flexible document data
- **Supabase** for hosted database and authentication
- **Firebase** for auth and realtime features
- **Redis** for caching and session data
- **S3-compatible storage** for uploaded files

### Vector Search

- **FAISS** for local vector search
- **ChromaDB** for lightweight vector storage
- **Pinecone** for hosted vector database
- **Weaviate** for semantic search
- **PostgreSQL pgvector** for vector search inside PostgreSQL

### Authentication

- **NextAuth.js** for Next.js authentication
- **Supabase Auth** for managed auth
- **Firebase Auth** for managed auth
- **JWT** for API authentication
- **OAuth** for external login providers

### DevOps And Deployment

- **Vercel** for frontend deployment
- **Railway** for backend and database deployment
- **Render** for backend services
- **Docker** for containerization
- **Docker Compose** for local multi-service development
- **GitHub Actions** for CI/CD
- **ESLint** for linting
- **Prettier** for formatting
- **Pytest** for Python backend tests
- **Vitest** or **Jest** for frontend tests

---

## System Architecture

```txt
User
 │
 ▼
Frontend App
 │
 ├── Chat UI
 ├── Dashboard
 ├── Document Upload UI
 ├── Study Planner UI
 └── Settings UI
 │
 ▼
Backend API
 │
 ├── Auth Service
 ├── User Service
 ├── Conversation Service
 ├── Document Service
 ├── Planner Service
 ├── Search Service
 └── AI Service
        │
        ├── Prompt Manager
        ├── LLM Provider
        ├── Embedding Service
        ├── Retrieval Service
        └── Response Generator
 │
 ▼
Storage Layer
 │
 ├── Relational Database
 ├── Object Storage
 ├── Vector Database
 └── Cache
```

---

## RAG Pipeline

UIT Waifu can use **Retrieval-Augmented Generation** to answer questions using uploaded documents or UIT-specific materials.

```txt
Document Upload
      │
      ▼
File Validation
      │
      ▼
Text Extraction
      │
      ▼
Text Cleaning
      │
      ▼
Chunking
      │
      ▼
Embedding Generation
      │
      ▼
Vector Storage
      │
      ▼
Semantic Retrieval
      │
      ▼
Context Building
      │
      ▼
LLM Answer Generation
      │
      ▼
Grounded Response
```

Benefits of RAG:

- Answers are based on real documents.
- The assistant can work with course-specific materials.
- Users can ask questions about uploaded files.
- The system can cite retrieved sections in future versions.

---

## Project Structure

Suggested structure:

```txt
UIT-Waifu
├── frontend/
│   ├── app/
│   ├── components/
│   ├── features/
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
│   ├── schemas/
│   ├── database/
│   ├── middleware/
│   └── main.py
│
├── ai/
│   ├── prompts/
│   ├── rag/
│   ├── embeddings/
│   ├── vector_store/
│   ├── tools/
│   └── configs/
│
├── docs/
│   ├── architecture.md
│   ├── api.md
│   ├── database.md
│   ├── prompts.md
│   └── roadmap.md
│
├── public/
│   ├── images/
│   └── assets/
│
├── tests/
│   ├── frontend/
│   ├── backend/
│   └── ai/
│
├── .env.example
├── .gitignore
├── docker-compose.yml
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

Optional tools:

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

Using npm:

```bash
npm install
```

Using pnpm:

```bash
pnpm install
```

### Run The Development Server

Using npm:

```bash
npm run dev
```

Using pnpm:

```bash
pnpm dev
```

Open the app:

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

For file storage:

```env
STORAGE_BUCKET=your_storage_bucket
STORAGE_ACCESS_KEY=your_access_key
STORAGE_SECRET_KEY=your_secret_key
```

Never commit real environment variables to GitHub.

---

## API Design

Possible API routes:

```txt
/api/chat
/api/auth
/api/users
/api/conversations
/api/messages
/api/documents
/api/documents/upload
/api/documents/search
/api/planner
/api/courses
/api/notes
/api/settings
/api/health
```

Example chat request:

```json
{
  "userId": "user_123",
  "conversationId": "conversation_123",
  "message": "Explain polymorphism in C++",
  "mode": "study"
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

Example document query request:

```json
{
  "documentId": "doc_123",
  "question": "What are the important deadlines in this document?"
}
```

---

## Prompt Design

Example system prompt:

```txt
You are UIT Waifu, a friendly AI assistant for students at the University of Information Technology.

Your responsibilities:
- Help students understand academic topics clearly.
- Explain programming, AI, data science, and university subjects.
- Support both Vietnamese and English.
- Use examples when helpful.
- Be friendly, encouraging, and practical.
- Ask for clarification only when necessary.
- Avoid pretending to know official university information without sources.
- Tell users to verify important academic or administrative information from official UIT channels.

User message:
{message}
```

Prompt modes can include:

- General chat mode
- Study tutor mode
- Code debugging mode
- Document QA mode
- Exam revision mode
- Project planning mode

---

## Database Design Ideas

Possible tables or collections:

```txt
users
conversations
messages
documents
document_chunks
courses
notes
tasks
study_plans
settings
feedback
```

Example relational structure:

```txt
users
 └── conversations
      └── messages

users
 └── documents
      └── document_chunks

users
 └── study_plans
      └── tasks
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

- [ ] Add code explanation mode
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
- [ ] Add progress tracking

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
- [ ] Add multi-agent workflows

---

## Development Guidelines

### Branch Naming

```txt
feature/chat-ui
feature/auth-system
feature/rag-pipeline
feature/document-upload
feature/study-planner
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
- Keep prompts version-controlled.
- Add tests for important logic.

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
- Check file size and file type before processing uploads.

Privacy principles:

- Do not share user conversations publicly.
- Do not expose uploaded documents.
- Allow users to delete their data.
- Be transparent about AI-generated content.
- Store only the data needed for the product.

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
__pycache__
.venv
```

---

## Testing Ideas

Recommended tests:

- Unit tests for utility functions
- API tests for backend endpoints
- Prompt regression tests
- RAG retrieval tests
- Upload validation tests
- Authentication flow tests
- UI component tests

Possible tools:

- Vitest
- Jest
- React Testing Library
- Pytest
- Playwright

---

## Deployment Ideas

Simple deployment path:

```txt
Frontend: Vercel
Backend: Railway or Render
Database: Supabase PostgreSQL
Vector Database: pgvector, ChromaDB, or Pinecone
File Storage: Supabase Storage or S3-compatible storage
CI/CD: GitHub Actions
```

Docker-based deployment:

```txt
frontend container
backend container
database service
vector database service
cache service
```

---

## Limitations

UIT Waifu may sometimes generate incorrect, incomplete, or outdated information.

Users should verify important information from official sources, especially:

- Exam schedules
- Tuition information
- Graduation requirements
- University policies
- Official announcements
- Administrative procedures

UIT Waifu should not be treated as an official university representative.

---

## Contributing

Contributions are welcome.

You can contribute by:

- Improving the UI
- Building backend APIs
- Adding AI features
- Improving prompts
- Adding RAG support
- Writing documentation
- Fixing bugs
- Suggesting new features

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
  <b>UIT Waifu — Your AI companion for studying, coding, productivity, and university life.</b>
</p>
