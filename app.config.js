import 'dotenv/config'

export default {
  "expo": {
    "plugins": ["expo-image-picker"],
    "name": "DidIt",
    "slug": "DidIt",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "bundleIdentifier": "com.didit.didit",
      "supportsTablet": true,
      "infoPlist": {
        "NSCameraUsageDescription": "This app needs access to your camera to take pictures"
      }
    },
    "android": {
      "package": "com.example.didit",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "permissions": [
        "CAMERA"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "1d11969f-39bb-4801-82a6-7b974602d32c"
      },
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseDatabaseURL: process.env.FIREBASE_DATABASE_URL,
      firebaseAppId: process.env.FIREBASE_APP_ID
    }
  }
}
