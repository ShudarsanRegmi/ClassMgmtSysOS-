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
        return <div>Loading....</div>; 
    }

    return user ? children : <Navigate to="/login" />; // Redirect to login if not authenticated

}
