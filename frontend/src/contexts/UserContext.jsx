import React, { createContext, useContext, useState, useEffect } from 'react';
import UserService from '../services/userService';

// Create the context
const UserContext = createContext();

// Context provider component
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize the user context with data from local storage
  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Check if we have a token
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        // Get user data
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
          setCurrentUser(userData);
          
          // Fetch the user profile
          const profile = await UserService.getUserProfile();
          setUserProfile(profile);
        }
      } catch (err) {
        console.error("Failed to initialize user context:", err);
        setError("Error initializing user data");
        // Clear potentially invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
      } finally {
        setLoading(false);
      }
    };

    initializeUser();
  }, []);

  // Login function
  const login = async (token, userData) => {
    try {
      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Update state
      setCurrentUser(userData);
      
      // Get user profile
      const profile = await UserService.getUserProfile();
      setUserProfile(profile);
      
      return { success: true };
    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to log in");
      return { success: false, error: err.message };
    }
  };

  // Logout function
  const logout = () => {
    // Clear stored data
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    
    // Reset state
    setCurrentUser(null);
    setUserProfile(null);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const updatedProfile = await UserService.updateUserProfile(profileData);
      setUserProfile({
        ...userProfile,
        ...updatedProfile.profile
      });
      return { success: true, profile: updatedProfile.profile };
    } catch (err) {
      console.error("Profile update error:", err);
      setError("Failed to update profile");
      return { success: false, error: err.message };
    }
  };

  // Get user's full name
  const getFullName = () => {
    if (!userProfile) return '';
    return `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim();
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser && !!localStorage.getItem('token');
  };

  // Value to be provided by the context
  const value = {
    currentUser,
    userProfile,
    loading,
    error,
    login,
    logout,
    updateProfile,
    getFullName,
    isAuthenticated
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;