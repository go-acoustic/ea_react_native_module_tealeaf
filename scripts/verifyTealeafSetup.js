/********************************************************************************************
* Copyright (C) 2023 Acoustic, L.P. All rights reserved.
*
* NOTICE: This file contains material that is confidential and proprietary to
* Acoustic, L.P. and/or other developers. No license is granted under any intellectual or
* industrial property rights of Acoustic, L.P. except as may be provided in an agreement with
* Acoustic, L.P. Any unauthorized copying or distribution of content from this file is
* prohibited.
********************************************************************************************/

/**
 * Verify React Native SDK integration to capture screen tracking.
 * 
 * cd node_modules/react-native-acoustic-ea-tealeaf folder
 * 
 * yarn run verifyTealeafSetup
 * 
 */
const fs = require('fs');

//const filePath = "../../src/components/RootComponent.tsx"
const filePath = "Example/nativebase-v3-kitchensink/src/components/RootComponent.tsx"

function log(message) {
    console.log(message);
}

function isAppFileAvailable() {
    return fs.existsSync(filePath);
}

function isTealeafTagAvailable() {
    try {
        log("Looking for Tealeaf tag...");
        let data = fs.readFileSync(filePath, 'utf8');
        const re = new RegExp(/<Tealeaf/, "g");
        const found = re.test(data);

        return found;
    } catch (err) {
        console.error(err);
    }
}

if (isAppFileAvailable()) {
    if (isTealeafTagAvailable()) {
        log("Tealeaf tag found. You are ready to go!");
    } else {
        log("Missing Tealeaf tag. Please refer to SDK integration without React Navigation.");
    };
} else {
    console.error("App.js file not found in root app folder.");
}










