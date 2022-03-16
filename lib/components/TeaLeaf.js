/********************************************************************************************
* Copyright (C) 2022 Acoustic, L.P. All rights reserved.
*
* NOTICE: This file contains material that is confidential and proprietary to
* Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
* industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
* Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
* prohibited.
********************************************************************************************/
import React, {useCallback, useEffect, useRef} from "react";
import { Platform, View, StyleSheet } from "react-native";
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
        var reactId = event._targetInst.memoizedProps.id !== undefined ? event._targetInst.memoizedProps.id : null;
        if (Platform.OS === 'ios') {
            TLTRN.logClickEvent(event.target._nativeTag, reactId);
        } else {
            // TLTRN.logClickEvent(event.target._nativeTag, reactId, 
            // add the accessibility items
        }
        
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
