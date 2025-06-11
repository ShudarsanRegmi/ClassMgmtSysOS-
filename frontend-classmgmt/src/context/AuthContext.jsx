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
    const [currentSemester, setCurrentSemester] = useState(null);
    const [availableSemesters, setAvailableSemesters] = useState([]);

    // Global semester state management
    const setActiveSemester = (semesterId) => {
        const semester = availableSemesters.find(sem => 
            sem.id === semesterId || sem._id === semesterId
        );
        if (semester) {
            setCurrentSemester(semester);
            // Store in localStorage instead of sessionStorage for persistence
            localStorage.setItem('currentSemesterId', semester.id || semester._id);
            // Dispatch custom event for cross-component communication
            window.dispatchEvent(new CustomEvent('semesterChanged', { 
                detail: { semester } 
            }));
        }
    };

    // Get current semester info with additional helper methods
    const getSemesterInfo = () => ({
        ...currentSemester,
        isActive: true, // You can add more complex logic here
        formattedDates: currentSemester ? {
            start: new Date(currentSemester.startDate).toLocaleDateString(),
            end: new Date(currentSemester.endDate).toLocaleDateString()
        } : null,
        displayName: currentSemester ? `${currentSemester.name} (${currentSemester.code})` : '',
    });

    // Semester utility functions
    const semesterUtils = {
        getAvailableYears: () => [...new Set(availableSemesters.map(sem => sem.year))],
        getSemestersByYear: (year) => availableSemesters.filter(sem => sem.year === year),
        findSemesterById: (id) => availableSemesters.find(sem => sem.id === id || sem._id === id),
        getCurrentSemesterCourses: () => currentSemester?.courses || []
    };

    // Restore semester from localStorage on mount and when availableSemesters changes
    useEffect(() => {
        const storedSemesterId = localStorage.getItem('currentSemesterId');
        if (storedSemesterId && availableSemesters.length > 0) {
            const semester = availableSemesters.find(sem => 
                sem.id === storedSemesterId || sem._id === storedSemesterId
            );
            if (semester) {
                setCurrentSemester(semester);
            }
        }
    }, [availableSemesters]);

    // Listen for semester changes from other parts of the app
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'currentSemesterId' && e.newValue) {
                const semester = availableSemesters.find(sem => 
                    sem.id === e.newValue || sem._id === e.newValue
                );
                if (semester) {
                    setCurrentSemester(semester);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [availableSemesters]);

    // Fetch class details including current semester
    const fetchClassDetails = async (classId) => {
        if (!classId) return null;
        try {
            const response = await api.get(`/class/${classId}/details`);
            const classData = response.data;
            
            // Fetch available semesters for the class
            const semestersResponse = await api.get(`/sem/class/${classId}`);
            const semesters = semestersResponse.data.semesters;
            
            // Set available semesters
            setAvailableSemesters(semesters);

            // Check session storage first for current semester
            const storedSemesterId = sessionStorage.getItem('currentSemesterId');
            if (storedSemesterId) {
                const storedSemester = semesters.find(sem => 
                    sem.id === storedSemesterId || sem._id === storedSemesterId
                );
                if (storedSemester) {
                    setCurrentSemester(storedSemester);
                    return classData;
                }
            }

            // If no stored semester, use the one from class data
            if (classData.currentSemester) {
                const currentSem = semesters.find(
                    sem => sem.id === classData.currentSemester.id || sem._id === classData.currentSemester._id
                );
                if (currentSem) {
                    setCurrentSemester(currentSem);
                    sessionStorage.setItem('currentSemesterId', currentSem.id || currentSem._id);
                }
            }

            return classData;
        } catch (err) {
            console.error('Error fetching class details:', err);
            return null;
        }
    };

    // Add helper functions for semester operations
    const isSemesterActive = (semester) => {
        if (!semester) return false;
        const now = new Date();
        return semester.dates.start <= now && now <= semester.dates.end;
    };

    const getSemesterStatus = (semester) => {
        if (!semester) return 'UNKNOWN';
        const now = new Date();
        if (now < semester.dates.start) return 'UPCOMING';
        if (now > semester.dates.end) return 'COMPLETED';
        return 'ONGOING';
    };

    // Fetch user profile from MongoDB
    const fetchUserProfile = async (user) => {
        if (!user) return null;
        
        try {
            const response = await api.get('/profile');
            // console.log('Profile Response:', response.data);
            const mongoProfile = response.data.user;
            
            // Merge Firebase and MongoDB data
            const mergedProfile = mergeProfileData(user, mongoProfile);

            // If user has a classId, fetch class details
            if (mergedProfile?.classId) {
                await fetchClassDetails(mergedProfile.classId);
            }

            // Log detailed auth and profile information
            // console.group('🔐 Auth Details');
            // console.log('Firebase User:', extractUserDetails(user));
            // console.log('MongoDB Profile:', mongoProfile);
            // console.log('Merged Profile:', mergedProfile);
            // console.log('Auth State:', {
            //     isAuthenticated: !!user,
            //     hasProfile: !!mergedProfile,
            //     roles: mergedProfile?.role || [],
            //     permissions: {
            //         isAdmin: mergedProfile?.role === 'ADMIN',
            //         isFaculty: mergedProfile?.role === 'FACULTY',
            //         isStudent: mergedProfile?.role === 'STUDENT'
            //     }
            // });
            // console.groupEnd();

            return mergedProfile;
        } catch (err) {
            console.error('Error fetching user profile:', err);
            setError('Failed to fetch user profile');
            return null;
        }
    };

    // Update current semester
    const updateCurrentSemester = async (semesterId) => {
        if (!userProfile?.classId) return;

        try {
            await api.put(`/class/${userProfile.classId}/current-semester`, {
                semesterId
            });
            setCurrentSemester(semesterId);
            
            // Log semester update
            console.group('📚 Semester Updated');
            console.log('New Semester:', semesterId);
            console.log('Update Timestamp:', new Date().toISOString());
            console.groupEnd();
        } catch (err) {
            console.error('Error updating current semester:', err);
            throw err;
        }
    };

    useEffect(() => {
        const auth = getAuth();
        // console.log('Auth:', auth);
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                if (user) {
                    // Get user profile from MongoDB when Firebase auth state changes
                    const profile = await fetchUserProfile(user);
                    setCurrentUser(user);
                    setUserProfile(profile);

                    // Log auth state changes
                    // console.group('🔄 Auth State Changed');
                    // console.log('User Signed In:', {
                    //     timestamp: new Date().toISOString(),
                    //     user: extractUserDetails(user),
                    //     profile: profile
                    // });
                    // console.groupEnd();
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

    const value = {
        // User-related information
        currentUser,          // Firebase user object
        userProfile,          // Merged MongoDB profile with Firebase data
        userId: userProfile?.uid || currentUser?.uid,
        userEmail: currentUser?.email,
        userName: userProfile?.name,
        userRole: userProfile?.role,
        classId: userProfile?.classId,
        
        // Auth state
        loading,
        error,
        isAuthenticated: !!currentUser,
        isProfileComplete: !!userProfile,
        
        // Role-based checks
        isAdmin: hasRole('ADMIN'),
        isFaculty: hasRole('FACULTY'),
        isStudent: hasRole('STUDENT'),
        hasRole,
        
        // Enhanced semester information and management
        currentSemester,
        availableSemesters,
        setActiveSemester,
        semesterInfo: getSemesterInfo(),
        ...semesterUtils,
        
        // Functions
        refreshUserProfile,
        updateUserProfile,
        updateCurrentSemester
    };

    // Log the actual context value object
    console.group('🔄 Auth Context Value (Exported)');
    console.log('Context Value:', value);
    console.groupEnd();
    

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