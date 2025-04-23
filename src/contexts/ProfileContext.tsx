import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react';

// Define the context type
interface ProfileContextType {
  profileImage: string | null;
  setProfileImage: (image: string | null) => void;
  updateProfileImage: (image: string | null) => void;
  userId: string | null;
}

// Create context with default values
const ProfileContext = createContext<ProfileContextType>({
  profileImage: null,
  setProfileImage: () => {},
  updateProfileImage: () => {},
  userId: null
});

// Custom hook to use the profile context
export const useProfile = () => useContext(ProfileContext);

// Provider component
interface ProfileProviderProps {
  children: ReactNode;
}

export const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Set user ID when session changes
  useEffect(() => {
    if (session?.user?.id) {
      setUserId(session.user.id);
    }
  }, [session]);

  // Load profile image from localStorage or API on initial render
  useEffect(() => {
    const loadProfileImage = async () => {
      if (session?.user?.id) {
        try {
          // First check if there's a saved image in localStorage for this user
          const storageKey = `profileImage_${session.user.id}`;
          const localImage = localStorage.getItem(storageKey);
          
          if (localImage) {
            setProfileImage(localImage);
          } else {
            // If not in localStorage, try to fetch from API
            const response = await fetch('/api/user/profile');
            if (response.ok) {
              const data = await response.json();
              if (data.profileImage) {
                setProfileImage(data.profileImage);
                // Save to localStorage for future use
                localStorage.setItem(storageKey, data.profileImage);
              }
            }
          }
        } catch (error) {
          console.error('Error loading profile image:', error);
        }
      }
    };

    if (status === 'authenticated') {
      loadProfileImage();
    }
  }, [session, status]);

  // Function to update profile image and save to localStorage
  const updateProfileImage = async (image: string | null) => {
    setProfileImage(image);
    
    // Only save if we have a user ID and an image
    if (session?.user?.id) {
      const storageKey = `profileImage_${session.user.id}`;
      
      if (image) {
        // Save to localStorage with user-specific key
        localStorage.setItem(storageKey, image);
      } else {
        localStorage.removeItem(storageKey);
      }
    }
  };

  return (
    <ProfileContext.Provider value={{ profileImage, setProfileImage, updateProfileImage, userId }}>
      {children}
    </ProfileContext.Provider>
  );
};