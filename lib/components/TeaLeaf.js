import React, {useCallback, useEffect, useRef} from "react";
import { View, StyleSheet } from "react-native";
import TLTRN from 'react-native-acoustic-ea-tealeaf/lib/TLTRN';

const Tealeaf = ({ children }) => {
    const navigation = children.ref;
    const currentRoute = useRef();
    
    useEffect(() => {
        if(!navigation || typeof navigation.current.addListener !== 'function' || typeof navigation.current.getCurrentRoute !== 'function'){
            throw new Error('Tealeaf: The Tealeaf components first child must be a NavigationContainer with a ref.');
        }

        const unsubscribe = navigation.current.addListener('state', () => {
            
            currentRoute.current = navigation.current.getCurrentRoute().name;
            
            console.log('State change - ', currentRoute.current);
            
            TLTRN.logScreenLayout(currentRoute.current);
        });
        
        return unsubscribe;
    }, [navigation]);

    const onStartShouldSetResponderCapture = useCallback((event) => {
        // console.log('event._targetInst.memoizedProps.id ', event._targetInst.memoizedProps.id);
        TLTRN.logClickEvent(event.target._nativeTag);
        
        return false; // Must be false; true means this component becomes the touch responder and events dont bubble
    }, []);
    
    return (
        <View style={styles.tealeaf_main} 
              onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}>
                {children}
        </View>
    );
};

export default Tealeaf;


const styles = StyleSheet.create({
    tealeaf_main: {
        flex: 1
    }
})
