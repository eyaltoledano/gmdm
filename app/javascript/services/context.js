import React, { createContext, useReducer, useContext } from 'react';

// Initial state
const initialState = {
  isConnected: false,
  connectedAddress: '',
  user: null,
  isLoggedIn: false,
  isUserLoading: false,
};

// Create context
const AppContext = createContext();

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isLoggedIn: !!action.payload,
        isUserLoading: false,
      };
    case 'SET_USER_LOADING':
      return {
        ...state,
        isUserLoading: action.payload,
      };
    case 'LOGIN':
      return {
        ...state,
        isConnected: true,
        isLoggedIn: true,
        isUserLoading: false,
        user: action.payload.user,
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        connectedAddress: '',
        isConnected: false,
        user: null,
      };
    case 'CONNECT_WALLET':
      return {
        ...state,
        isConnected: true,
      };
    case 'SET_CONNECTED_WALLET':
      return {
        ...state,
        isConnected: true,
        connectedAddress: action.payload,
      };
    case 'DISCONNECT_WALLET':
      return {
        ...state,
        isConnected: false,
        connectedAddress: '',
        isLoggedIn: false,
        user: null,
      };
    // Add more cases for other actions
    default:
      return state;
  }
};

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use AppContext
export const useAppContext = () => useContext(AppContext);
