
# react-native-acoustic-ea-tealeaf

## Version Compatibility Warning
---
react-native-acoustic-ea-tealeaf version 13.0.0 and up is only compatible with react native 0.60 and up. If you are not yet upgraded to react native 0.60 or above, you should remain on react-native-acoustic-ea-tealeaf version 12.12.0.


## Features
---
- Will automatically capture pages after they completed by React Javascript Bridge.
- iOS will automatically capture control accessibility labels and use them as the id
- Will log ReactLayoutTime via custom event based on when component render and completion of React Javascript Bridge.


## Migration
---
Please see the [migration guide](Migration-Guide.md).

## Getting started
---
**This module uses only enhanced replay. This module is no longer supported: https://www.npmjs.com/package/react-native-wcxa**

Install package from npm

`$ npm install --save react-native-acoustic-ea-tealeaf`

or

`$ yarn add react-native-acoustic-ea-tealeaf -E`

---

#### Known issues
1) Screen capture in replay sometimes display overlapping items which is expected when Tealeaf captures UI state during animation.  It's recommended to set delay value from app's Javascript code.
2) In Logcat shows error Invalid IDs such as 0x00000001. Please ignore since React-Native app doesn't generate all resource Ids mapping.
3) Android compile issues.  Please see the example app for reference on common setup:

    NativeBase-KitchenSink/Example/android

---
## Tealeaf Configuration
In the root directory of your app create a new file called `TealeafConfig.json`, this is where you should place any module specific configuration.

```
{
    "Tealeaf": {
        "AppKey": "<YOUR_APP_KEY>",
        "PostMessageUrl": "<YOUR_POST_MESSAGE_URL>"
    }
}
```
For more in depth information on possible configuration values head over to the [acoustic configuration documentation](https://developer.goacoustic.com/acoustic-exp-analytics/docs/configuration)

Please note that TealeafConfig.json currently only supports primitive values; ie strings & booleans.

---
## React Integration

In order to correctly capture screen tracking based on [React Navigation v5](https://reactnavigation.org/docs/5.x/screen-tracking/). Please add the following:

```javascript
import { Tealeaf } from 'react-native-acoustic-ea-tealeaf';
import { useRef } from 'react';

export default () => {
  const navigationRef = useRef();

  return (
    <Tealeaf>
      <NavigationContainer ref={navigationRef}>
        <StackNav/>
      </NavigationContainer>
    </Tealeaf>
  );
};
```

#### In order to correctly capture screen tracking without React Navigation. Please add the following:

 ```javascript
import React, { Component } from "react";
import { Container, Header, Title, Content, Button, Left, Right, Body, Text } from "native-base";
import styles from "./styles";

// Add import
import {NativeModules, findNodeHandle} from 'react-native';
const Tealeaf = NativeModules.RNCxa;

class Header1 extends Component {
  render() {
    Tealeaf.setCurrentScreenName("HomePage");
    return (
      <Container style={styles.container}>
        <Header>
          <Left />
          <Body>
            <Title>Header</Title>
          </Body>
          <Right />
        </Header>

        <Content padder>
          <Button onPress={() => this.props.navigation.goBack()}>
            <Text>Back</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
export default Header1;

```
---


# Demo
## Sample Code with integrated
### Using NativeBase v3 KitchenSink
 ![demo](https://github.com/acoustic-analytics/ea_react_native_module_tealeaf/blob/develop/Example/nativebase-v3-kitchensink/assets/demo.png)

* NativeBase-KitchenSink taken from https://github.com/GeekyAnts/nativebase-v3-kitchensink which is at Example/nativebase-v3-kitchensink. 

## Installation instructions

#### In command line window
```javascript
cd ../ea_react_native_module_tealeaf/Example/nativebase-v3-kitchensink
yarn
cd ios
pod update
cd ..
```

*	**Run on iOS**
	*	Opt #1:
		*	Open the project in Xcode from `ios/KitchenSinkappnativebase.xcworkspace`
		*	Click `run` button to simulate
	*	Opt #2:
		*	Run `react-native run-ios` in your terminal


*	**Run on Android**
	*	Make sure you have an `Android emulator` installed and running
	*	Run `react-native run-android` in your terminal

## Troubleshooting

* Android App doesn't build after Tealeaf plugin uninstall
  
  Remove below line from android project's build.gradle file

  ```javascript
  apply from: project(':react-native-acoustic-ea-tealeaf').projectDir.getPath() + "/config.gradle"

* Android App Manifest merger failed : uses-sdk:minSdkVersion 16 cannot be smaller than version 21 declared in library
 
  Android 5 or API level 21 is needed.  Update android project's build.gradle file to

  minSdkVersion = 21

## Notes

There are several know issues between npm install versus yarn install. Since yarn is a Facebook tool. It normally has fixes patched for installing dependancies. 
