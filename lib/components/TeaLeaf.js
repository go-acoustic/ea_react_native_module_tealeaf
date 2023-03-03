/********************************************************************************************
* Copyright (C) 2023 Acoustic, L.P. All rights reserved.
*
* NOTICE: This file contains material that is confidential and proprietary to
* Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
* industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
* Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
* prohibited.
********************************************************************************************/
import React, {useCallback, useEffect, useRef} from "react";
import { View, StyleSheet, Platform } from "react-native";
import TLTRN from '../TLTRN';

const Tealeaf = (props) => {
    const { children, captureKeyboardEvents } = props;
    const navigation = children.ref;
    const currentRoute = useRef();
    const initial = useRef(false);
    
    useEffect(() => { TLTRN.interceptKeyboardEvents(captureKeyboardEvents); }, [captureKeyboardEvents]);
    
    useEffect(() => {
        if(!navigation || typeof navigation.current.addListener !== 'function' || typeof navigation.current.getCurrentRoute !== 'function'){
            console.warn('Tealeaf: The Tealeaf components first child must be a NavigationContainer with a ref.');
            return;
        }
        
        const unsubscribe = navigation.current.addListener('state', () => {
            currentRoute.current = extractName(navigation) || navigation.current.getCurrentRoute().name;
            console.log('State change - ', currentRoute.current);
            if (Platform.OS === 'ios') {
                TLTRN.logScreenLayout(currentRoute.current);
            } else if (Platform.OS === 'android') {
                TLTRN.logScreenLayout(currentRoute.current);
            }
        });
        
        return unsubscribe;
    }, [navigation]);

    const onStartShouldSetResponderCapture = useCallback((event) => {
        TLTRN.logClickEvent(event);
        return false; // Must be false; true means this component becomes the touch responder and events dont bubble
    }, []);
    
    const onLayout = useCallback(() => {
        if(initial.current){ return false; }
        initial.current = true;

        currentRoute.current = navigation.current.getCurrentRoute().name;

        if (Platform.OS === 'ios') {
            TLTRN.logScreenLayout(currentRoute.current);
        } else if (Platform.OS === 'android') {
            TLTRN.logScreenLayout(currentRoute.current);
        }
    }, [navigation]);

    return (
            <View style={styles.tealeaf_main} 
                onLayout={onLayout}
                onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}>
                    {children}
            </View>
    );
};
function extractName(navigation){
    if(navigation.current.getCurrentRoute().params){
        const { name } =  navigation.current.getCurrentRoute().params
        return name
    }
    return ""
}
export default Tealeaf;

const styles = StyleSheet.create({
    tealeaf_main: {
        flex: 1
    }
})
