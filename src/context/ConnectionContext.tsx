import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Connection } from '../types';

interface ConnectionContextType {
  connections: Connection[];
  pendingRequests: Connection[];
  sendConnectionRequest: (receiverId: string) => Promise<void>;
  acceptConnectionRequest: (connectionId: string) => Promise<void>;
  rejectConnectionRequest: (connectionId: string) => Promise<void>;
  isConnected: (userId: string) => boolean;
  isPendingConnection: (userId: string) => boolean;
  getConnectedUsers: () => string[];
}

const ConnectionContext = createContext<ConnectionContextType | undefined>(undefined);

type ConnectionAction =
  | { type: 'SEND_REQUEST'; payload: Connection }
  | { type: 'ACCEPT_REQUEST'; payload: string }
  | { type: 'REJECT_REQUEST'; payload: string }
  | { type: 'SET_CONNECTIONS'; payload: Connection[] };

const connectionReducer = (state: Connection[], action: ConnectionAction): Connection[] => {
  switch (action.type) {
    case 'SEND_REQUEST':
      return [...state, action.payload];
    case 'ACCEPT_REQUEST':
      return state.map(conn =>
        conn.id === action.payload ? { ...conn, status: 'accepted' } : conn
      );
    case 'REJECT_REQUEST':
      return state.filter(conn => conn.id !== action.payload);
    case 'SET_CONNECTIONS':
      return action.payload;
    default:
      return state;
  }
};

const mockConnections: Connection[] = [
  {
    id: '1',
    requesterId: '1',
    receiverId: '2',
    status: 'accepted',
    createdAt: new Date('2024-03-01'),
  },
  {
    id: '2',
    requesterId: '3',
    receiverId: '1',
    status: 'pending',
    createdAt: new Date('2024-03-10'),
  },
];

export const ConnectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [connections, dispatch] = useReducer(connectionReducer, mockConnections);

  const sendConnectionRequest = async (receiverId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newConnection: Connection = {
        id: Date.now().toString(),
        requesterId: '1', // Assuming current user is '1' for demo
        receiverId,
        status: 'pending',
        createdAt: new Date(),
      };
      dispatch({ type: 'SEND_REQUEST', payload: newConnection });
    } catch (error) {
      console.error('Failed to send connection request:', error);
    }
  };

  const acceptConnectionRequest = async (connectionId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'ACCEPT_REQUEST', payload: connectionId });
    } catch (error) {
      console.error('Failed to accept connection request:', error);
    }
  };

  const rejectConnectionRequest = async (connectionId: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'REJECT_REQUEST', payload: connectionId });
    } catch (error) {
      console.error('Failed to reject connection request:', error);
    }
  };

  const isConnected = (userId: string): boolean => {
    return connections.some(
      conn => conn.status === 'accepted' && 
      ((conn.requesterId === '1' && conn.receiverId === userId) ||
       (conn.requesterId === userId && conn.receiverId === '1'))
    );
  };

  const isPendingConnection = (userId: string): boolean => {
    return connections.some(
      conn => conn.status === 'pending' && 
      ((conn.requesterId === '1' && conn.receiverId === userId) ||
       (conn.requesterId === userId && conn.receiverId === '1'))
    );
  };

  const getConnectedUsers = (): string[] => {
    return connections
      .filter(conn => conn.status === 'accepted')
      .map(conn => conn.requesterId === '1' ? conn.receiverId : conn.requesterId);
  };

  const pendingRequests = connections.filter(
    conn => conn.status === 'pending' && conn.receiverId === '1'
  );

  return (
    <ConnectionContext.Provider
      value={{
        connections,
        pendingRequests,
        sendConnectionRequest,
        acceptConnectionRequest,
        rejectConnectionRequest,
        isConnected,
        isPendingConnection,
        getConnectedUsers,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
};
