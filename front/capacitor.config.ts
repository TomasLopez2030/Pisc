import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.pisc.app',
  appName: 'Pisc',
  webDir: 'dist/front/browser',

  server: {
    cleartext: true
  }
};

export default config;

