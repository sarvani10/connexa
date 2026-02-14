# Connexa - Social Connection Platform

A modern social connection platform built with React, TypeScript, and TailwindCSS that allows users to create profiles, connect with others, and message their connections.

## Features

- **User Authentication**: Secure login and registration system
- **Profile Management**: Customizable profiles with private/public settings
- **Connection System**: Send and accept connection requests
- **Messaging**: Real-time messaging between connected users only
- **User Discovery**: Search and discover new users with filters
- **Modern UI**: Clean, responsive design with TailwindCSS

## Key Functionality

### User Profiles
- Display user information including bio, posts count, and connections count
- Private/public account settings
- Profile customization options

### Connection System
- Send connection requests to other users
- Accept or reject incoming requests
- View connection status (pending, connected)
- Only connected users can message each other

### Messaging
- Real-time chat interface
- Message read receipts
- Conversation history
- Only available between connected users

### User Discovery
- Search users by name, username, or bio
- Filter by privacy settings (public/private only)
- Browse user profiles with connection options

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Build Tool**: Create React App

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd codeforconnection
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

### `npm start`
Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm test`
Launches the test runner in the interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder.

### `npm run eject`
**Note: this is a one-way operation. Once you `eject`, you can't go back!**

## Demo Users

For testing purposes, you can use these pre-configured accounts:

- **Email**: john@example.com | **Password**: any
- **Email**: jane@example.com | **Password**: any

## Project Structure

```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Messaging/      # Chat and messaging components
│   ├── Navigation/     # Navigation and layout
│   ├── Profile/        # User profile components
│   └── Search/         # User discovery and search
├── context/            # React Context providers
├── types/              # TypeScript type definitions
└── App.tsx            # Main application component
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
