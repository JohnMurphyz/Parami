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
      backgroundColor: "#ffffff"
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
      [
        "expo-notifications",
        {
          icon: "./assets/notification-icon.png",
          color: "#ffffff",
          sounds: []
        }
      ],
      [
        "sentry-expo",
        {
          organization: process.env.SENTRY_ORG || "john-murphy",
          project: process.env.SENTRY_PROJECT || "parami-app"
        }
      ]
    ],
    hooks: {
      postPublish: [
        {
          file: "sentry-expo/upload-sourcemaps",
          config: {
            organization: process.env.SENTRY_ORG || "john-murphy",
            project: process.env.SENTRY_PROJECT || "parami-app"
          }
        }
      ]
    },
    extra: {
      sentryDsn: process.env.SENTRY_DSN,
      eas: {
        projectId: "your-project-id" // Will be set when you run 'eas build:configure'
      }
    }
  }
};
