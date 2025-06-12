# Task Management Application

A full-stack task management application built with React and Node.js.

## Project Overview

This application allows users to manage their tasks with features like:
- Create tasks (title, description, due date, priority)
- View all tasks
- Update/edit tasks
- Delete tasks
- Mark tasks as complete/incomplete
- Filter tasks (completed, pending, by priority)

## Project Structure

```
task-management-app/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── context/
│       ├── utils/
│       └── styles/
└── server/                 # Node.js backend
    ├── controllers/
    ├── models/
    ├── routes/
    ├── middleware/
    ├── config/
    └── utils/
```

## Technology Stack

### Frontend
- React
- React Router for navigation
- Axios for API calls
- Material-UI or Tailwind CSS for styling
- React Query for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication (if needed)
- Express Validator for input validation

### Development Tools
- Git for version control
- ESLint for code linting
- Prettier for code formatting
- Jest for testing

## Database Schema

```javascript
// MongoDB Schema
const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
```

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status

## Implementation Progress

### Phase 1: Project Setup
- [x] Initialize React project
- [x] Set up Node.js backend
- [x] Configure MongoDB connection
- [x] Set up project structure

### Phase 2: Backend Development
- [x] Implement task model and schema
- [x] Create API endpoints
- [x] Implement validation middleware
- [x] Set up error handling

### Phase 3: Frontend Development
- [x] Create basic UI components
- [x] Implement task creation form
- [x] Build task list view
- [x] Add task filtering functionality
- [x] Implement task status toggle

### Phase 4: Integration
- [x] Connect frontend with backend API
- [x] Implement error handling
- [x] Add loading states
- [x] Implement optimistic updates

### Phase 5: Polish & Testing
- [ ] Add form validation
- [ ] Implement error messages
- [ ] Add loading indicators
- [ ] Write unit tests
- [ ] Perform integration testing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Create `.env` file in the server directory
   - Add necessary environment variables

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd ../client
   npm start
   ```

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License
This project is licensed under the MIT License. 