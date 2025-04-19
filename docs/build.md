# **MyJournal** Build instructions

## Prerequisites

Before getting started, make sure you have the following installed:

- **Node.js**  
  If this is your first time running a JavaScript or React Native app, you'll need to install Node.js (which includes npm).  
  👉 [Download Node.js](https://nodejs.org)

- **Expo CLI**  
  This project uses Expo to streamline development. You can install Expo CLI globally using:

  ```bash
  npm install -g expo
  ```

### Install Dependencies

After cloning or copying the project, install its dependencies:

```bash
npm install
```

## Expo Go

This is the recommended way to run **MyJournal**.

- **Expo Go** must be installed on your mobile device. You can find it on the App Store (iOS) or Google Play Store (Android).

### Steps to Run

1. Make sure dependencies are installed:

   npm install

2. Start the development server:

   npx expo start

3. A QR code will appear in your terminal or browser window.  
   Open the camera app on your device and scan the QR code to launch the app.

⚠️ Your computer and mobile device must be on the same Wi-Fi network for this to work.

## iOS/Android Build

### Native Environment Setup

This is NOT required if you are using Expo Go.

- Set up your environment [using the expo instructions](https://docs.expo.dev/guides/local-app-development/).
- If you're running macOS, make sure you are running the correct versions of Ruby and Cocoapods:-
  - If you are using Apple Silicon and this is the first time you are building for RN 0.74+, you may need to run:
    - `arch -arm64 brew install llvm`
    - `sudo gem install ffi`
  - Check if you've installed Cocoapods through `homebrew`. If you have, remove it:
    - `brew info cocoapods`
    - If output says `Installed`:
    - `brew remove cocoapods`
  - If you have not installed `rbenv`:
    - `brew install rbenv`
    - `rbenv install 2.7.6`
    - `rbenv global 2.7.6`
    - Add `eval "$(rbenv init - zsh)"` to your `~/.zshrc`
  - From inside the project directory:
    - `bundler install` (this will install Cocoapods)
- After initial setup:
  - Copy `google-services.json.example` to `google-services.json` or provide your own `google-services.json`. (A real firebase project is NOT required)
  - `npx expo prebuild` -> you will also need to run this anytime `app.json` or native `package.json` deps change

### Running the Native App

- iOS: `npx expo start --ios`
  - Xcode must be installed for this to run.
    - A simulator must be preconfigured in Xcode settings.
      - if no iOS versions are available, install the iOS runtime at `Xcode > Settings > Platforms`.
      - if the simulator download keeps failing you can download it from the developer website.
        - [Apple Developer](https://developer.apple.com/download/all/?q=Simulator%20Runtime)
        - `xcode-select -s /Applications/Xcode.app`
        - `xcodebuild -runFirstLaunch`
        - `xcrun simctl runtime add "~/Downloads/iOS_17.4_Simulator_Runtime.dmg"` (adapt the path to the downloaded file)
    - In addition, ensure Xcode Command Line Tools are installed using `xcode-select --install`.
  - Expo will require you to configure Xcode Signing. Follow the linked instructions. Error messages in Xcode related to the signing process can be safely ignored when installing on the iOS Simulator; Expo merely requires the profile to exist in order to install the app on the Simulator.
    - Make sure you do have a certificate: open Xcode > Settings > Accounts > (sign-in) > Manage Certificates > + > Apple Development > Done.
    - If you still encounter issues, try `rm -rf ios` before trying to build again (`yarn ios`)
- Android: `npx expo start --android`
  - Install "Android Studio"
    - Make sure you have the Android SDK installed (Android Studio > Tools > Android SDK).
      - In "SDK Platforms": "Android x" (where x is Android's current version).
      - In "SDK Tools": "Android SDK Build-Tools" and "Android Emulator" are required.
      - Add `export ANDROID_HOME=/Users/<your_username>/Library/Android/sdk` to your `.zshrc` or `.bashrc` (and restart your terminal).
    - Setup an emulator (Android Studio > Tools > Device Manager).

### Tips

- To run on the device, add `--device` to the command (e.g. `npx expo run:ios --device`). To build in production mode (slower build, faster app), also add `--variant release`.
- If you want to use Expo EAS on your own builds without ejecting from Expo, make sure to change the `owner` and `extra.eas.projectId` properties. If you do not have an Expo account, you may remove these properties.
- `npx react-native info` Checks what has been installed.
- If the Android simulator frequently hangs or is very sluggish, [bump its memory limit](https://stackoverflow.com/a/40068396)
- The Android simulator won't be able to access localhost services unless you run `adb reverse tcp:{PORT} tcp:{PORT}`
  - For instance, the locally-hosted dev-wallet will need `adb reverse tcp:3001 tcp:3001`
- For some reason, the typescript compiler chokes on platform-specific files (e.g. `foo.native.ts`) but only when compiling for Web thus far. Therefore we always have one version of the file that doesn't use a platform specifier, and that should be the Web version. ([More info](https://stackoverflow.com/questions/44001050/platform-specific-import-component-in-react-native-with-typescript).)

## Various notes

### Debugging

- Note that since 0.70, debugging using the old debugger (which shows up using CMD+D) doesn't work anymore. Follow the instructions below to debug the code: https://reactnative.dev/docs/next/hermes#debugging-js-on-hermes-using-google-chromes-devtools

### Developer Menu

To open the [Developer Menu](https://docs.expo.dev/debugging/tools/#developer-menu) on an `expo-dev-client` app you can do the following:

- Android Device: Shake the device vertically, or if your device is connected via USB, run adb shell input keyevent 82 in your terminal
- Android Emulator: Either press Cmd ⌘ + m or Ctrl + m or run adb shell input keyevent 82 in your terminal
- iOS Device: Shake the device, or touch 3 fingers to the screen
- iOS Simulator: Press Ctrl + Cmd ⌘ + z on a Mac in the emulator to simulate the shake gesture or press Cmd ⌘ + d
