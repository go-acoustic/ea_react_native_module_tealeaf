import React, {useEffect, useRef} from "react";
import TLTRN from 'react-native-acoustic-ea-tealeaf/lib/TLTRN';

const Tealeaf = ({ children }) => {
    const navigation = children.ref;
    const currentRoute = useRef();
    
    useEffect(() => {
        if(!navigation || typeof navigation.current.addListener !== 'function' || typeof navigation.current.getCurrentRoute !== 'function'){
            throw new Error('Tealeaf: The Tealeaf components first child must be a NavigationContainer with a ref.');
        }
        
        const unsubscribe = navigation.current.addListener('state', async () => {
            
            currentRoute.current = navigation.current.getCurrentRoute().name;
            
            console.log('State change - ', currentRoute.current);
            
            await TLTRN.logScreenLayout(currentRoute.current);
        });

        return unsubscribe;
    }, [navigation]);

    return children;
};

export default Tealeaf;

