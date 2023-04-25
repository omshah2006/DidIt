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
<<<<<<< HEAD:app.json
<<<<<<< HEAD
=======
      "bundleIdentifier": "com.mycompany.didit",
>>>>>>> 27227b0a2b3ffd16bad5420861063f399a0f3643
=======
      "bundleIdentifier": "com.didit.didit",
>>>>>>> de15e34bfca208bf0f78d7935e6c390467999c0d:app.config.js
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
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID
    }
  }
}
