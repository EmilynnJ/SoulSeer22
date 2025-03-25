# SoulSeer

SoulSeer is a full-stack web application that connects clients with spiritual readers for pay-per-minute chat, video, and voice readings. The platform includes a comprehensive marketplace for spiritual products and live streaming capabilities.

## Features

- **Pay-Per-Minute Readings**: Real-time chat, video, and voice readings with time-based billing
- **User Roles**: Client, Reader, and Admin roles with separate dashboards
- **Reader Application System**: Admin-managed reader onboarding process
- **Secure Payments**: Stripe integration for purchasing minutes and reader payouts
- **Live Streaming**: Live group readings and events with tipping functionality
- **Marketplace**: Shop for spiritual products and services
- **Community Features**: Social feed and messaging system

## Tech Stack

### Frontend
- React.js with Vite
- React Router DOM for routing
- Styled with custom CSS and utility classes
- Socket.io for real-time communication
- WebRTC for video/voice calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Socket.io for signaling and chat
- RESTful API architecture

### External Services
- Stripe for payments
- AWS S3 for file storage
- WebRTC for peer-to-peer communication

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- Stripe account
- AWS account (for production)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/soulseer.git
cd soulseer
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create environment variables
```bash
# Backend .env file
cp backend/.env.example backend/.env

# Frontend .env file
cp frontend/.env.example frontend/.env
```

4. Update the environment variables with your credentials

5. Start the development servers
```bash
# Start backend server
cd backend
npm run dev

# Start frontend development server
cd ../frontend
npm run dev
```

### Environment Variables

#### Backend
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/soulseer
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d

# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET=soulseer-uploads

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_CONNECT_CLIENT_ID=your_stripe_connect_client_id

# Admin Seed
ADMIN_EMAIL=admin@soulseer.com
ADMIN_PASSWORD=adminpassword123
ADMIN_NAME=Admin User
```

#### Frontend
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## Project Structure

```
soulseer/
│
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # API controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # MongoDB models
│   ├── routes/         # API routes
│   ├── services/       # Business logic services
│   ├── utils/          # Utility functions
│   └── server.js       # Entry point
│
├── frontend/
│   ├── public/         # Static assets
│   ├── src/
│   │   ├── assets/     # Images, fonts, etc.
│   │   ├── components/ # React components
│   │   ├── contexts/   # React contexts
│   │   ├── hooks/      # Custom hooks
│   │   ├── pages/      # Page components
│   │   ├── services/   # API services
│   │   ├── styles/     # CSS styles
│   │   ├── utils/      # Utility functions
│   │   ├── App.jsx     # App component
│   │   ├── main.jsx    # Entry point
│   │   └── routes.jsx  # Application routes
│   └── index.html      # HTML template
│
└── README.md           # Project documentation
```

## Deployment

### AWS Amplify Deployment

1. Create a new Amplify app in the AWS Management Console
2. Connect your repository and select the main branch
3. Configure build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - cd frontend
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: frontend/dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
backend:
  phases:
    preBuild:
      commands:
        - cd backend
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: backend
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

4. Add environment variables in the Amplify Console
5. Deploy your application

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Special thanks to all contributors and beta testers
- Inspired by the need for ethical spiritual guidance platforms
