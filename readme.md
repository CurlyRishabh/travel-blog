# SHSHA Project

A full-stack web application built with Next.js and Express.js, featuring blog functionality with authentication, likes, and comments.

## Project Structure

The project is divided into two main parts:

### Frontend (`/frontend`)
- Built with Next.js 15.3.2
- Uses Mantine UI components
- Tailwind CSS for styling
- Modern React (v19) with hooks

### Backend (`/backend`)
- Express.js server
- Sequelize ORM for database management
- Authentication system
- File upload functionality
- Blog post management with likes and comments

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn package manager
- A SQL database (configured with Sequelize)

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure your environment variables (create a `.env` file):
```env
PORT=3001
DATABASE_URL=your_database_url
```

4. Start the server:
```bash
npm start
```

The backend server will run on port 3001 by default.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend development server will start with Turbopack enabled.

## Features

- User authentication
- Blog post creation and management
- Like and comment functionality
- File upload support
- Responsive UI with Mantine components
- Modern styling with Tailwind CSS

## API Endpoints

The backend provides the following main endpoints:

- `/auth` - Authentication routes
- `/blog` - Blog post management
- `/likeComment` - Handling likes and comments
- `/uploads` - File upload management

## Technology Stack

### Frontend
- Next.js
- React
- Mantine UI
- Tailwind CSS
- Date-fns for date formatting
- Tabler icons

### Backend
- Express.js
- Sequelize ORM
- CORS enabled
- File upload handling
- SQL database

## Development

### Frontend Development
```bash
npm run dev
```

### Backend Development
```bash
npm run start
```

## Building for Production

### Frontend
```bash
npm run build
npm run start
```

### Backend
```bash
npm start
```


### Add the .env in backedn
DB_NAME=db_name
DB_USER=db_user
DB_PASSWORD=mysecret1234
DB_HOST=localhost
DB_PORT=5432
DB_DIALECT=postgres

# JWT Configuration
JWT_SECRET=my_secret
