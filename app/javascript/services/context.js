import React, { createContext, useReducer, useContext } from 'react';

// Initial state
const initialState = {
  isConnected: false,
  isAuthenticated: false,
  user: null,
  // Add more state variables as needed
};

// Create context
const AppContext = createContext();

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case 'CONNECT_WALLET':
      return {
        ...state,
        isConnected: true,
      };
    case 'DISCONNECT_WALLET':
      return {
        ...state,
        isConnected: false,
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
