import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import api from '../utils/api';

const AuthContext = createContext();

// Helper function to safely extract user details
const extractUserDetails = (user) => {
    if (!user) return null;
    return {
        uid: user.uid,
        email: user.email,
        emailVerified: user.emailVerified,
        displayName: user.displayName,
        photoURL: user.photoURL,
        phoneNumber: user.phoneNumber,
        providerData: user.providerData,
        metadata: {
            creationTime: user.metadata?.creationTime,
            lastSignInTime: user.metadata?.lastSignInTime
        }
    };
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user profile from MongoDB
    const fetchUserProfile = async (user) => {
        if (!user) return null;
        
        try {
            const response = await api.get('/profile');
            const profile = response.data.user;

            // Log detailed auth and profile information
            console.group('🔐 Auth Details');
            console.log('Firebase User:', extractUserDetails(user));
            console.log('MongoDB Profile:', profile);
            console.log('Auth State:', {
                isAuthenticated: !!user,
                hasProfile: !!profile,
                roles: profile?.role || [],
                permissions: {
                    isAdmin: profile?.role === 'ADMIN',
                    isFaculty: profile?.role === 'FACULTY',
                    isStudent: profile?.role === 'STUDENT'
                }
            });
            console.groupEnd();

            return profile;
        } catch (err) {
            console.error('Error fetching user profile:', err);
            setError('Failed to fetch user profile');
            return null;
        }
    };

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    // Get user profile from MongoDB when Firebase auth state changes
                    const profile = await fetchUserProfile(user);
                    setCurrentUser(user);
                    setUserProfile(profile);

                    // Log auth state changes
                    console.group('🔄 Auth State Changed');
                    console.log('User Signed In:', {
                        timestamp: new Date().toISOString(),
                        user: extractUserDetails(user),
                        profile: profile
                    });
                    console.groupEnd();
                } else {
                    setCurrentUser(null);
                    setUserProfile(null);
                    console.log('📤 User Signed Out', new Date().toISOString());
                }
            } catch (err) {
                console.error('Auth state change error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Refresh user profile data
    const refreshUserProfile = async () => {
        if (currentUser) {
            const profile = await fetchUserProfile(currentUser);
            setUserProfile(profile);
            return profile;
        }
        return null;
    };

    // Update user profile in MongoDB
    const updateUserProfile = async (profileData) => {
        if (!currentUser) throw new Error('No authenticated user');

        try {
            const response = await api.put('/profile', profileData);
            const updatedProfile = response.data.user;
            setUserProfile(updatedProfile);

            // Log profile update
            console.group('👤 Profile Updated');
            console.log('New Profile Data:', updatedProfile);
            console.log('Update Timestamp:', new Date().toISOString());
            console.groupEnd();

            return updatedProfile;
        } catch (err) {
            console.error('Error updating profile:', err);
            throw err;
        }
    };

    // Helper function to check if user has specific role
    const hasRole = (role) => {
        return userProfile?.role === role;
    };

    // Log whenever auth state or profile changes
    useEffect(() => {
        console.group('🔑 Auth State Update');
        console.log('Current State:', {
            timestamp: new Date().toISOString(),
            isAuthenticated: !!currentUser,
            hasProfile: !!userProfile,
            user: extractUserDetails(currentUser),
            profile: userProfile,
            roles: {
                isAdmin: hasRole('ADMIN'),
                isFaculty: hasRole('FACULTY'),
                isStudent: hasRole('STUDENT')
            }
        });
        console.groupEnd();
    }, [currentUser, userProfile]);

    const value = {
        currentUser,          // Firebase user object
        userProfile,          // MongoDB user profile
        loading,
        error,
        refreshUserProfile,   // Function to manually refresh profile
        updateUserProfile,    // Function to update profile
        
        // Role-based checks
        isAdmin: hasRole('ADMIN'),
        isFaculty: hasRole('FACULTY'),
        isStudent: hasRole('STUDENT'),
        hasRole,             // Function to check custom roles
        
        // Commonly used user properties
        userId: currentUser?.uid,
        userEmail: currentUser?.email,
        userName: userProfile?.name,
        userRole: userProfile?.role,
        classId: userProfile?.classId,
        
        // Auth state
        isAuthenticated: !!currentUser,
        isProfileComplete: !!userProfile,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

// Custom hook for using auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};