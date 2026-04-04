# iBag iOS 앱 빌드 가이드

**버전**: v5.3.4  
**작성일**: 2026-04-04  
**작성자**: Manus AI

---

## 1. 개요

iBag iOS 앱은 Capacitor 기반의 하이브리드 앱으로, 기존 웹 소스(HTML/CSS/JS)를 iOS 네이티브 WebView에서 실행합니다. Mac이 없는 환경에서는 **Codemagic** 클라우드 빌드 서비스를 사용하여 iOS IPA 파일을 생성하고 TestFlight 또는 App Store에 배포할 수 있습니다.

---

## 2. 사전 준비

### 2.1 Apple Developer 계정

Apple Developer Program에 가입해야 합니다. 연간 $99(약 13만원)의 비용이 발생합니다.

| 항목 | 내용 |
|------|------|
| 가입 URL | https://developer.apple.com/programs/ |
| 비용 | $99/년 |
| 필요 정보 | Apple ID, 신용카드, 본인 인증 |
| 승인 소요 시간 | 보통 24~48시간 |

가입 후 다음 정보를 준비합니다:

- **Team ID**: Apple Developer 포털 > Membership에서 확인
- **Bundle Identifier**: `com.alphabag.ibag` (이미 설정됨)
- **App Store Connect API Key**: Codemagic 자동 서명에 필요

### 2.2 Codemagic 계정

Codemagic(https://codemagic.io)에 가입합니다. GitHub, GitLab, Bitbucket 계정으로 로그인 가능하며, 무료 플랜에서 월 500분의 빌드 시간을 제공합니다.

| 플랜 | 빌드 시간 | Mac 인스턴스 | 비용 |
|------|-----------|-------------|------|
| Free | 500분/월 | M2 Mac mini | 무료 |
| Pay as you go | 무제한 | M2 Mac mini | $0.095/분 |

---

## 3. 프로젝트 구조

iOS 프로젝트는 `/ios` 디렉토리에 위치하며, 다음과 같은 구조를 갖습니다:

```
ios/
├── App/
│   ├── App/
│   │   ├── AppDelegate.swift          ← 앱 진입점 (알림 권한 요청 포함)
│   │   ├── Info.plist                 ← 권한 설정 및 앱 메타데이터
│   │   ├── capacitor.config.json      ← Capacitor 설정
│   │   ├── Assets.xcassets/
│   │   │   ├── AppIcon.appiconset/    ← 앱 아이콘 (1024x1024)
│   │   │   └── Splash.imageset/       ← 스플래시 스크린
│   │   ├── Base.lproj/
│   │   │   ├── LaunchScreen.storyboard
│   │   │   └── Main.storyboard
│   │   └── public/                    ← 웹 소스 (app.js, styles.css 등)
│   ├── App.xcodeproj/
│   ├── App.xcworkspace/
│   └── Podfile                        ← CocoaPods 의존성
└── capacitor-cordova-ios-plugins/
```

---

## 4. 설정된 권한 목록

Info.plist에 다음 권한이 사전 설정되어 있습니다. 앱 설치 후 해당 기능을 처음 사용할 때 iOS가 자동으로 권한 요청 팝업을 표시합니다.

| 권한 | 키 | 용도 |
|------|-----|------|
| 카메라 | NSCameraUsageDescription | QR 코드 스캔, 사진 촬영 |
| 마이크 | NSMicrophoneUsageDescription | 음성 녹음, AI 음성 채팅 |
| 사진 라이브러리 (읽기) | NSPhotoLibraryUsageDescription | 이미지 가져오기 |
| 사진 라이브러리 (저장) | NSPhotoLibraryAddUsageDescription | 스크린샷/이미지 저장 |
| Face ID | NSFaceIDUsageDescription | Vault 보안 인증 |
| 위치 | NSLocationWhenInUseUsageDescription | 지역 콘텐츠, Web3 서비스 |
| 클립보드 | NSPasteboardUsageDescription | 지갑 주소 복사/붙여넣기 |
| 푸시 알림 | UIBackgroundModes (remote-notification) | 알림 수신 |

---

## 5. Codemagic으로 빌드하기

### 5.1 GitHub 저장소 연결

1. iBag 프로젝트를 GitHub에 push합니다:
   ```bash
   cd /home/ubuntu/alphabag-web
   git init
   git add .
   git commit -m "iBag v5.3.4 - iOS build ready"
   git remote add origin https://github.com/YOUR_USERNAME/ibag-app.git
   git push -u origin main
   ```

2. Codemagic(https://codemagic.io)에 로그인 후 "Add application"을 클릭합니다.

3. GitHub 저장소를 선택합니다.

### 5.2 코드 서명 설정

Codemagic에서 자동 코드 서명을 설정합니다:

1. **Settings > Code signing > iOS** 로 이동
2. **App Store Connect API Key** 추가:
   - Apple Developer 포털 > Users and Access > Keys에서 API Key 생성
   - Key ID, Issuer ID, .p8 파일을 Codemagic에 업로드
3. Codemagic이 자동으로 프로비저닝 프로파일과 인증서를 관리합니다

### 5.3 빌드 실행

프로젝트 루트에 `codemagic.yaml` 파일이 이미 포함되어 있습니다. 두 가지 워크플로우가 설정되어 있습니다:

| 워크플로우 | 용도 | 배포 대상 |
|-----------|------|----------|
| `ios-build` | App Store / TestFlight 배포 | TestFlight 자동 업로드 |
| `ios-adhoc` | 테스트용 IPA 직접 다운로드 | Ad Hoc 설치 |

**빌드 시작 방법:**
1. Codemagic 대시보드에서 프로젝트 선택
2. "Start new build" 클릭
3. 워크플로우 선택 (ios-build 또는 ios-adhoc)
4. "Start build" 클릭

빌드 완료까지 약 10~15분 소요됩니다.

### 5.4 TestFlight 배포

`ios-build` 워크플로우로 빌드하면 IPA가 자동으로 TestFlight에 업로드됩니다. App Store Connect에서 테스터를 초대하면 바로 설치할 수 있습니다.

**TestFlight 테스터 초대:**
1. App Store Connect(https://appstoreconnect.apple.com) 로그인
2. 앱 선택 > TestFlight 탭
3. "External Testing" 또는 "Internal Testing" 그룹에 테스터 이메일 추가
4. 테스터가 TestFlight 앱에서 iBag을 설치

---

## 6. App Store 출시

TestFlight 테스트 완료 후 App Store에 출시하려면:

1. **App Store Connect**에서 앱 정보 입력:
   - 앱 이름: iBag
   - 카테고리: 금융 또는 유틸리티
   - 스크린샷: iPhone 6.7" (1290x2796), iPhone 6.5" (1242x2688)
   - 앱 설명, 키워드, 지원 URL 등

2. **심사 제출**: 빌드 선택 후 "Submit for Review"

3. **심사 소요 시간**: 보통 24~48시간 (첫 심사는 더 오래 걸릴 수 있음)

---

## 7. 버전 업데이트 방법

새 버전을 출시할 때:

1. `public/` 디렉토리의 웹 소스 파일 업데이트 (app.js, styles.css 등)
2. Capacitor 동기화:
   ```bash
   npx cap copy ios
   ```
3. `codemagic.yaml`에서 버전 번호 변경 (agvtool 라인)
4. GitHub에 push
5. Codemagic에서 빌드 실행

---

## 8. 문제 해결

### 빌드 실패 시

| 에러 | 원인 | 해결 방법 |
|------|------|----------|
| Code signing error | 인증서/프로파일 문제 | Codemagic에서 API Key 재설정 |
| Pod install failed | CocoaPods 의존성 오류 | Podfile.lock 삭제 후 재빌드 |
| Provisioning profile | Bundle ID 불일치 | Apple Developer에서 App ID 확인 |

### iOS 전용 이슈

- **Safe Area**: 상단 노치와 하단 홈 인디케이터 영역은 CSS `env(safe-area-inset-*)` 로 이미 대응되어 있습니다.
- **WebView 제한**: iOS WebView에서는 일부 Web API(예: 블루투스, NFC)가 제한됩니다.
- **쿠키/로컬스토리지**: iOS 14+ Safari의 ITP 정책으로 인해 서드파티 쿠키가 차단될 수 있습니다. Capacitor의 `capacitor://` 스킴을 사용하여 이를 우회합니다.

---

## 9. 비용 요약

| 항목 | 비용 | 주기 |
|------|------|------|
| Apple Developer Program | $99 | 연간 |
| Codemagic Free Plan | $0 | 월 500분 |
| Codemagic Pay-as-you-go | ~$1/빌드 | 빌드당 |
| **총 최소 비용** | **$99/년** | |

---

## 참고 자료

- [Capacitor iOS Documentation](https://capacitorjs.com/docs/ios)
- [Codemagic iOS Build Guide](https://docs.codemagic.io/yaml-quick-start/building-a-native-ios-app/)
- [Apple Developer Program](https://developer.apple.com/programs/)
- [App Store Connect](https://appstoreconnect.apple.com)
