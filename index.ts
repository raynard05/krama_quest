import 'react-native-url-polyfill/auto';
import { TextEncoder, TextDecoder } from 'text-encoding';
(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;

// Polyfill crypto.getRandomValues for bcryptjs and other libraries
if (!(globalThis as any).crypto) {
  (globalThis as any).crypto = {
    getRandomValues(array: any) {
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
      return array;
    },
  } as any;
}

import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
