import {useEffect, useState} from 'react';
import {Navigate} from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from '../firebase';


export default function Profile({children}) {
    const [user, setUser] = useState(null);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(()=> {
        const unsubscribe = onAuthStateChanged(auth, (currentUser)=>{
            setUser(currentUser);
            setCheckingStatus(false);
    });
        
        return ()=> unsubscribe(); // cleanup
    }, []);

    
    if(checkingStatus) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="spinner" style={{
                width: '50px',
                height: '50px',
                border: '5px solid #f3f3f3',
                borderTop: '5px solid #3498db',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }}></div>
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
            </div>
        );
    }

    return user ? children : <Navigate to="/login" />; // Redirect to login if not authenticated

}
