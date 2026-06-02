import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cl.naturaltrekking.app',
  appName: 'NaturalTrekking',
  webDir: 'build',
  android: {
    useLegacyBridge: true
  }
};

export default config;
