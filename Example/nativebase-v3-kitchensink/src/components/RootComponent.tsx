import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Box, useColorModeValue, useToken } from 'native-base';
import { RootStack } from '../../src/navigators/rootNavigator';
import { Tealeaf } from 'react-native-acoustic-ea-tealeaf';
import { useRef } from 'react';

export const Root = () => {
  const navigationRef = useRef();
  const [lightBg, darkBg] = useToken(
    'colors',
    ['coolGray.50', 'blueGray.900'],
    'blueGray.900'
  );
  const bgColor = useColorModeValue(lightBg, darkBg);

  return (
    <Tealeaf>
      <NavigationContainer
        ref={navigationRef}
        theme={{
          colors: { background: bgColor },
        }}
      >
        <Box
          flex={1}
          w="100%"
          _light={{
            bg: 'coolGray.50',
          }}
          _dark={{
            bg: 'blueGray.900',
          }}
          _web={{
            overflowX: 'hidden',
          }}
        >
          <RootStack />
        </Box>
      </NavigationContainer>
    </Tealeaf>
  );
};
