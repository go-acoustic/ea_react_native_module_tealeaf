# Migration Guide

## 1 - Importing

Before
```
import {NativeModules, findNodeHandle, Platform} from 'react-native';
const Tealeaf = NativeModules.RNCxa;
import {TLTRN} from "../node_modules/react-native-acoustic-ea-tealeaf/lib/TLTRN";
```

After
```
import { Tealeaf, TLTRN, RNCxa } from 'react-native-acoustic-ea-tealeaf';
```

Note that Tealeaf is no longer a pointer to the native module, it is a react component. If you need to access the native module directly use RNCxa.


## 2 - Usage

Before
```
export default () => {
  const navigationRef = useRef();
  const routeNameRef = useRef();

  return (
    <Root>
      <NavigationContainer
        ref={navigationRef}
        onReady={() =>
          (routeNameRef.current = navigationRef.current.getCurrentRoute().name)
        }
        onStateChange={async () => {
          const previousRouteName = routeNameRef.current;
          const currentRouteName = navigationRef.current.getCurrentRoute().name;

          if (previousRouteName !== currentRouteName) {
            // The line below uses the expo-firebase-analytics tracker
            // https://docs.expo.io/versions/latest/sdk/firebase-analytics/
            // Change this line to use another Mobile analytics SDK
            console.log("currentScreen:", currentRouteName);
            // set page name
            TLTRN.currentScreen = currentRouteName;
            // screen capture page
            if (Platform.OS === 'ios' || Platform.OS === 'android') {
              await Tealeaf.logScreenLayout(currentRouteName);
            }
          }

          // Save the current route name for later comparison
          routeNameRef.current = currentRouteName;
        }}
      >
        <StackNav/>
      </NavigationContainer>
    </Root>
  );
};
```

After
```
export default () => {
  const navigationRef = useRef();

  return (
    <Tealeaf captureKeyEvents={true}>
      <NavigationContainer ref={navigationRef}>
        <StackNav/>
      </NavigationContainer>
    </Tealeaf>
  );
};
```