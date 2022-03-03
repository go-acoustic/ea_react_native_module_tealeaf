/*!
 * Copyright (c) 2020 Acoustic, L.P. All rights reserved.
 *
 * NOTICE: This file contains material that is confidential and proprietary to
 * Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
 * industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
 * Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
 * prohibited.
 *
 * @version 1.0.0
 */


import {NativeModules, findNodeHandle, Platform} from "react-native";
import MessageQueue from "react-native/Libraries/BatchedBridge/MessageQueue.js";

const RNCxa = NativeModules.RNCxa;

export default class TLTRN {
    
    static currentScreen = "***initialCurrentScreen not set in TealeafLogger constructor***";
    static lastJSBridgeMessageTime = 0;
    static totalRenderTime = 0;
    static messageRenderTime = 0;
    static countMsgs = 0;
    static messageConsole = 0;
    static lastMessageConsole = 0;
    static isLoggingData = 0;
    static displayDebug = 0;
    
    static myTimer = {
        handle: 0,
        started: 0,
        time: 1000,
        start: function() {
            this.started = 1;
            this.handle = setInterval(checkTime, this.time);
        },
        stop: function() {
            if (this.handle) {
                clearInterval(this.handle);
                this.handle = 0;
                this.started = 0;
            }
        }
    }
    
    static init = (initialCurrentScreen, showDebugConsoleMessages) => { 
        TLTRN.currentScreen = initialCurrentScreen === undefined ? currentScreenMsg : initialCurrentScreen;
        MessageQueue.spy(TLTRN.listenToBridge);
        TLTRN.displayDebug = showDebugConsoleMessages === undefined ? 0 : showDebugConsoleMessages;
    }
    
    static logScreenLayout = async (name) => {
        TLTRN.currentScreen = name;
        
        if (Platform.OS === 'ios' || Platform.OS === 'android') {
            await RNCxa.logScreenLayout(name);
        }
    }
    
    static listenToBridge = (message) => {
        if (TLTRN.displayDebug) {
            console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&:isLoggingData:" + TLTRN.isLoggingData);
        }
        if (TLTRN.isLoggingData == 1) {
            return;
        }

        var now = new Date().getTime();
        if (TLTRN.lastJSBridgeMessageTime === 0) {
            TLTRN.lastJSBridgeMessageTime = now;
        }
        
        if (TLTRN.messageConsole > 0) {
            TLTRN.lastMessageConsole = TLTRN.messageConsole;
        }
        TLTRN.messageConsole = now;
        TLTRN.countMsgs++;

        if (TLTRN.myTimer.started === 0) {
            TLTRN.myTimer.start();
        }

        TLTRN.messageRenderTime = now - TLTRN.lastJSBridgeMessageTime;
        TLTRN.totalRenderTime = TLTRN.totalRenderTime + TLTRN.messageRenderTime;
        if (TLTRN.displayDebug) {
            console.log("*after:countMsgs: " + TLTRN.countMsgs + ":tTotal:" + TLTRN.totalRenderTime + ":messageDuration:" + TLTRN.messageRenderTime);
        }
        TLTRN.lastJSBridgeMessageTime = now;

        const from = message.type === 0 ? "N->JS" : "JS->N";
        const data = from + " : " + message.module + "." + message.method + "(" + JSON.stringify(message.args) + ")";

        
        if (TLTRN.displayDebug) {
            if (message.module !== "UIManager") {
                console.log("Message", message);
            }
            console.log("Message data:", data);
        }

        if (message.module === "ExceptionsManager") {
            RNCxa.logExceptionEvent(message.args[0], JSON.stringify(message.args[1]), true);
        }
    }
    
    static checkTime = () => {
        var now = new Date().getTime();
        if (TLTRN.displayDebug) {
            console.log("======>Done compare total:" + TLTRN.totalRenderTime + " :lastMessageConsole:" + TLTRN.lastMessageConsole + ":now:" + now + ":diff:" + (now - TLTRN.lastMessageConsole) + ":" + ((now - TLTRN.lastMessageConsole) > 50));
        }
        if (TLTRN.lastMessageConsole == 0) {
            return;
        }

        if ((now - TLTRN.lastMessageConsole) > 20) {
            if (TLTRN.displayDebug) {
                console.log("======>Done capture:" + new Date().getTime());
            }
            TLTRN.messageConsole = 0;
            TLTRN.lastMessageConsole = 0;
            TLTRN.myTimer.stop();
            logTeal();
        }
    }

    static logTeal = async () => {
        try {
            TLTRN.isLoggingData = 1;
            var res = await RNCxa.logScreenLayout(TLTRN.currentScreen);
            var dict = { ReactLayoutTime: TLTRN.totalRenderTime };
            var result = await RNCxa.logCustomEvent("ReactPlugin", dict, 1);
            if (TLTRN.displayDebug) {
                console.log("======>logTeal:" + TLTRN.currentScreen + ":" + res + ":time:" + TLTRN.totalRenderTime);
            }
            TLTRN.isLoggingData = 0;
            TLTRN.lastJSBridgeMessageTime = 0;
            TLTRN.totalRenderTime = 0;
        } catch (e) {
            console.error(e);
        }
    }
}
