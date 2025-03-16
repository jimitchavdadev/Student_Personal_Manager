# Student Personal Manager

## Description

Student Personal Manager is a comprehensive web application designed to help students organize their academic life. It provides tools for managing assignments, exams, notes, and study materials in one centralized platform.

## Tech Stack

### Frontend

- React with TypeScript
- Vite
- TailwindCSS
- Lucide React (for icons)
- Supabase (for authentication)

### Backend

- Node.js
- Express.js
- MongoDB with Mongoose
- Jest (for testing)

## Features

- **Assignment Management**

  - Create and track assignments
  - Set due dates and submission details
  - Mark assignments as completed

- **Exam Tracking**

  - Schedule and manage exams
  - Store study materials and resources
  - Track what to study

- **Note Taking**
  - Organize notes in notebooks and sections
  - Real-time auto-saving
  - Dark mode support

## Installation Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Git

### Setup Steps

1. Clone the repository

```bash
git clone https://github.com/jimitchavdadev/Student_Personal_Manager.git
cd Student_Personal_Manager
```

2. Install Backend Dependencies

```bash
cd backend-backup
npm install
```

3. Install Frontend Dependencies

```bash
cd frontend-backup
npm install
```

## Environment Variables

### Backend (.env)

```plaintext
MONGO_URI=mongodb://localhost:27017/your_database_name
```

### Frontend (.env)

```plaintext
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

## Usage

### Running the Backend

```bash
cd backend-backup
npm start
```

### Running the Frontend

```bash
cd frontend-backup
npm run dev
```

## API Documentation

### Assignments

- GET /assignments - Get all assignments
- POST /assignments - Create new assignment
- PATCH /assignments/:id - Update assignment
- DELETE /assignments/:id - Delete assignment

### Exams

- GET /exams - Get all exams
- POST /exams - Create new exam
- PATCH /exams/:id - Update exam
- DELETE /exams/:id - Delete exam

### Notes

- GET /notebooks - Get all notebooks
- POST /notebooks - Create notebook
- GET /notebooks/:id - Get specific notebook
- PATCH /notebooks/:id - Update notebook
- DELETE /notebooks/:id - Delete notebook

## Folder Structure

```plaintext
Student_Personal_Manager/
├── backend-backup/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend-backup/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AssignmentComponents/
│   │   │   └── NotesComponents/
│   │   ├── pages/
│   │   ├── services/
│   │   └── types/
│   ├── public/
│   └── index.html
```
