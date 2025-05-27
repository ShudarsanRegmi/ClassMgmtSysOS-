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

// Helper function to merge profile data
const mergeProfileData = (firebaseUser, mongoProfile) => {
    if (!mongoProfile) return null;
    
    // Keep the MongoDB profile structure but ensure critical fields are from Firebase
    return {
        ...mongoProfile,
        // Use Firebase email as it's authoritative
        email: firebaseUser.email || mongoProfile.email,
        // Ensure UID matches
        uid: firebaseUser.uid,
        // Keep MongoDB specific fields as is
        name: mongoProfile.name,
        role: mongoProfile.role,
        classId: mongoProfile.classId,
        phone: mongoProfile.phone,
        photoUrl: mongoProfile.photoUrl,
        courses: mongoProfile.courses || []
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
            console.log('Profile Response:', response.data);
            const mongoProfile = response.data.user;
            
            // Merge Firebase and MongoDB data
            const mergedProfile = mergeProfileData(user, mongoProfile);

            // Log detailed auth and profile information
            console.group('🔐 Auth Details');
            console.log('Firebase User:', extractUserDetails(user));
            console.log('MongoDB Profile:', mongoProfile);
            console.log('Merged Profile:', mergedProfile);
            console.log('Auth State:', {
                isAuthenticated: !!user,
                hasProfile: !!mergedProfile,
                roles: mergedProfile?.role || [],
                permissions: {
                    isAdmin: mergedProfile?.role === 'ADMIN',
                    isFaculty: mergedProfile?.role === 'FACULTY',
                    isStudent: mergedProfile?.role === 'STUDENT'
                }
            });
            console.groupEnd();

            return mergedProfile;
        } catch (err) {
            console.error('Error fetching user profile:', err);
            setError('Failed to fetch user profile');
            return null;
        }
    };

    useEffect(() => {
        const auth = getAuth();
        console.log('Auth:', auth);
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
            const updatedMongoProfile = response.data.user;
            // Merge the updated profile with Firebase data
            const mergedProfile = mergeProfileData(currentUser, updatedMongoProfile);
            setUserProfile(mergedProfile);

            // Log profile update
            console.group('👤 Profile Updated');
            console.log('New Profile Data:', mergedProfile);
            console.log('Update Timestamp:', new Date().toISOString());
            console.groupEnd();

            return mergedProfile;
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
        userProfile,          // Merged MongoDB profile with Firebase data
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
        userId: userProfile?.uid || currentUser?.uid,
        userEmail: currentUser?.email,  // Always use Firebase email
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