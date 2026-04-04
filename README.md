# iBag - Web3 Memory Vault Platform

**Version**: v5.3.4

iBag is a cross-platform Web3 memory vault application built with Capacitor. It securely stores your precious memories, passwords, Web3 wallet info, and important memos with AES-256 encryption.

## Project Structure

```
├── public/           ← Web source (HTML/CSS/JS)
│   ├── app.js        ← Main application logic
│   ├── styles.css    ← Application styles
│   ├── translations.js ← Multi-language support (7 languages)
│   └── index.html    ← Entry point
├── android/          ← Android (Capacitor)
├── ios/              ← iOS (Capacitor)
├── electron/         ← Desktop (Electron - Windows/Linux)
├── capacitor.config.json
├── codemagic.yaml    ← Codemagic CI/CD config
└── package.json
```

## Features

- AES-256 encrypted vault storage
- Web3 wallet management & organization charts
- AI chatbot assistant
- Real-time crypto price tracking
- Token analysis (DEX trading, security check)
- Multi-language support (KO/EN/ZH/JA/TH/VI/RU)
- Web3 Guard security monitoring
- 1page.to project directory integration
- USDT calculator
- Idea notes (text, drawing, voice, video)

## Build

### Android
```bash
npm install
cd android && ./gradlew assembleRelease
```

### iOS (requires Mac or Codemagic)
```bash
npm install
npx cap copy ios
cd ios/App && pod install
# Open App.xcworkspace in Xcode or use Codemagic
```

### Windows/Linux (Electron)
```bash
cd electron && npm install
npx electron-builder --win    # Windows
npx electron-builder --linux  # Linux
```

## Cloud Build (iOS without Mac)

This project includes `codemagic.yaml` for building iOS on Codemagic cloud service.
See [iOS Build Guide](docs/iOS-Build-Guide.md) for detailed instructions.

## License

Proprietary - All rights reserved.
