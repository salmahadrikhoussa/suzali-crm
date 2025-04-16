import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Define the context type
interface ProfileContextType {
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  updateProfileImage: (image: string | null) => void;
}

// Create context with default values
const ProfileContext = createContext<ProfileContextType>({
  profileImage: null,
  setProfileImage: () => {},
  updateProfileImage: () => {}
});

// Custom hook to use the profile context
export const useProfile = () => useContext(ProfileContext);

// Provider component
interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Load profile image from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedImage = localStorage.getItem('profileImage');
      if (savedImage) {
        setProfileImage(savedImage);
      }
    }
  }, []);

  // Function to update profile image and save to localStorage
  const updateProfileImage = (image: string | null) => {
    setProfileImage(image);
    
    if (image) {
      localStorage.setItem('profileImage', image);
    } else {
      localStorage.removeItem('profileImage');
    }
  };

  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage, updateProfileImage }}>
      {children}
    </ProfileContext.Provider>
  );
};