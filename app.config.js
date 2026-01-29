module.exports = {
  expo: {
    name: "Parami",
    slug: "parami-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    scheme: "parami",
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#3d4e3a"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.parami.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      package: "com.parami.app",
      permissions: [
        "android.permission.SCHEDULE_EXACT_ALARM",
        "android.permission.POST_NOTIFICATIONS"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-font",
      [
        "expo-notifications",
        {
          icon: "./assets/notification-icon.png",
          color: "#ffffff",
          sounds: []
        }
      ]
      // Sentry temporarily disabled for preview builds
      // [
      //   "sentry-expo",
      //   {
      //     organization: process.env.SENTRY_ORG || "john-murphy",
      //     project: process.env.SENTRY_PROJECT || "parami-app"
      //   }
      // ]
    ],
    // Sentry hooks temporarily disabled
    // hooks: {
    //   postPublish: [
    //     {
    //       file: "sentry-expo/upload-sourcemaps",
    //       config: {
    //         organization: process.env.SENTRY_ORG || "john-murphy",
    //         project: process.env.SENTRY_PROJECT || "parami-app"
    //       }
    //     }
    //   ]
    // },
    extra: {
      eas: {
        projectId: "9fc0324d-bbf1-4199-bea9-08902a3873d0"
      },
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID
    }
  }
};
