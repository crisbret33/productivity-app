# KanbanFlow - Full Stack Project Management Tool

A robust Kanban-style productivity application (inspired by Trello) built with the **MERN Stack** (MongoDB, Express, React, Node.js).

This project features advanced capabilities such as fluid **Drag & Drop**, secure authentication, real-time UI updates (Optimistic UI), and a responsive modern design.

## Key Features

### Authentication & Security
* **User System:** Complete user registration and login.
* **Security:** Passwords hashed with `bcryptjs` and sessions managed via **JWT (JSON Web Tokens)**.
* **Protected Routes:** Middleware on the Backend and route guards on the Frontend.

### Drag & Drop System
* **Boards:** Reorder your projects on the main Dashboard.
* **Lists:** Move columns horizontally to organize workflow stages.
* **Tasks:** Drag cards between columns or reorder them within a list.
* *Tech:* Powered by `@hello-pangea/dnd` for a native and smooth experience.

### 🛠️ Board Management
* **Smart Creation:** Modal to create boards with custom initial columns.
* **CRUD Operations:** Full capability to Create, Read, Update (Reorder), and Delete Boards, Lists, and Tasks.
* **Modern UX/UI:**
    * Clean interface using *Inter* typography.
    * Hover-only action buttons to keep the UI clutter-free.
    * Visual feedback during drag operations.

---

## Tech Stack

### Frontend (Client)
* **React:** UI Library (initialized with Vite).
* **React Router DOM:** SPA Navigation.
* **Axios:** HTTP Client with interceptors for automatic Token handling.
* **@hello-pangea/dnd:** Modern library for Drag & Drop logic.
* **CSS3:** Custom styling, transitions, and responsive layout.

### Backend (Server)
* **Node.js & Express:** Server runtime and framework.
* **MongoDB & Mongoose:** NoSQL Database and Object Data Modeling (ODM).
* **JWT & Bcrypt:** Authentication and Security.
* **Cors & Dotenv:** Environment configuration and cross-origin resource sharing.

---

## Getting Started

Follow these steps to run the project locally on your machine.

### 1. Clone the repository
```bash
git clone <GITHUB_REPO_URL>
cd productivity-app
```

### 2. Install Dependencies
We have configured a master script to install dependencies for the root, backend, and frontend with a single command:
```bash
npm run setup
```
*(If this fails, you can install them manually by running `npm install` inside the root, backend, and frontend folders).*

### 3. Environment Variables
Create a `.env` file inside the `/backend` folder with the following keys:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development
```

*(Optional) Create a `.env` file in `/frontend` if you need to specify the API URL:*
```env
VITE_API_URL=http://localhost:5001/api
```

### 4. Run the Application
Start both the Backend (Server) and Frontend (Client) simultaneously from the root folder:

```bash
npm run dev
```

* **Frontend:** http://localhost:5173
* **Backend:** http://localhost:5001

---

## 📂 Project Structure

```text
productivity-app/
├── backend/                # Node.js/Express Server
│   ├── config/             # DB Connection
│   ├── controllers/        # Route Logic
│   ├── middlewares/        # Auth Middleware (JWT)
│   ├── models/             # Mongoose Schemas (User, Board)
│   ├── routes/             # API Endpoints
│   └── server.js           # Entry Point
│
├── frontend/               # React Client (Vite)
│   ├── src/
│   │   ├── api/            # Axios Setup
│   │   ├── components/     # UI Components (List, Task, Modal...)
│   │   ├── pages/          # Views (Login, Dashboard, Board)
│   │   └── App.jsx         # Main Router
│   └── index.css           # Global Styles
│
└── package.json            # Root configuration
```

---

## 🔮 Roadmap / Future Improvements

* [ ] Inline editing for Task and List titles.
* [ ] Assign users to specific tasks (Collaboration).
* [ ] Due dates and color labels.

