# Leh Wi Learn - Mobile App

**Offline-first, production-ready mobile application for learning practical skills with verifiable NFT credentials.**

Built with Expo (managed), TypeScript, WatermelonDB, Supabase, and Zustand.

## 📋 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- `.env` file with Supabase keys (see `.env.example`)

### Setup

```bash
# Install dependencies
npm install

# Create .env from template
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server (Expo Go)
npm start

# Or run on Android/iOS
expo run:android
expo run:ios
```

## 🏗️ Project Structure

```
leh-wi-learn-mobile/
├── src/
│   ├── navigation/           # React Navigation setup
│   ├── screens/              # All app screens (Auth, Lessons, Assessment, Profile)
│   ├── components/           # Reusable UI components
│   ├── services/             # API calls (sync, auth, assessment)
│   ├── db/                   # WatermelonDB models & database setup
│   ├── store/                # Zustand state management
│   ├── types/                # TypeScript types
│   └── utils/                # Helper functions
├── __tests__/                # Unit tests
├── App.tsx                   # Root component
├── app.json                  # Expo configuration
├── package.json
└── tsconfig.json
```

## 🔐 Authentication Flow

1. **Onboarding** (3 slides) → Value prop, privacy, wallet intro
2. **Sign-in** → OTP (magic link) or Email/Password
3. **Wallet Creation** → Edge Function creates Thirdweb embedded wallet server-side
4. **Sync** → Auto-sync courses from Supabase on first login

### Auth Endpoints
- `Supabase Auth` - OTP and password authentication
- `Edge Function: create-embedded-wallet` - Creates non-custodial wallet, returns public address

## 📚 Offline-First Sync

**Architecture:**
- Local database: WatermelonDB (SQLite)
- Remote: Supabase Postgres
- Sync trigger: On login, on manual sync, when network restored

**Sync Flow:**
```
Tap Sync → Fetch courses from Edge (GET /getCourses)
         → Begin WatermelonDB transaction
         → Delete all existing courses/modules/lessons
         → Bulk create new data
         → Save lastSyncedAt timestamp
         → UI updates with new content
```

**Offline behavior:**
- All lessons available offline after sync
- Assessments stored locally, submitted when online
- Sync indicator shows current network status

## 📸 Assessment & NFT Minting

**Flow:**
1. User selects lesson → "Take Assessment"
2. Capture/pick image (device storage)
3. Upload to Supabase Storage (`submissions/` bucket)
4. Call Edge Function `POST /assess-and-mint` with JWT token
5. Edge validates JWT, calls OpenAI for assessment
6. If passed: Call Thirdweb to mint NFT
7. Return result: `{ passed, score, reason, minted, tokenId, txHash }`
8. Store submission + mint record in Supabase
9. Display result; if minted, show "View in Wallet"

### Rate Limiting
- 1 assessment per minute per user (enforced server-side)

## 🎮 Navigation Structure

```
Splash
  ↓
Auth Stack (if not authenticated)
  ├─ Onboarding (3 slides)
  ├─ SignIn (OTP + Password tabs)
  └─ OtpVerification

App Stack (if authenticated)
  ├─ Lessons (list by course/module)
  ├─ Lesson Detail (content + "Take Assessment" button)
  ├─ Assessment Flow (instructions → capture → result)
  └─ Profile (wallet + skill NFTs)
```

## 🧪 Testing

### Unit Tests
```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode
```

Tests cover:
- `syncCourses()` - fetch and WatermelonDB write
- `callAssessAndMint()` - Edge Function call with mock response
- NFT metadata generation
- Auth service methods

### Manual Acceptance Testing

```bash
# 1. Auth & Wallet
- Sign in with email OTP → confirm profiles.wallet_address populated
- Verify no seed phrase exposed in UI

# 2. Offline-First
- Sync courses (turn off network)
- Open lesson → content loads from WatermelonDB

# 3. Assessment & Mint
- Submit assessment → receive passed: true
- Verify skill_mints row exists
- Check Profile screen shows NFT

# 4. RLS Security
- Call /assess-and-mint without JWT → 401
- Try to insert course as user → RLS blocks

# 5. Admin
- Admin creates lesson → sync mobile → new lesson appears
```

## 📦 Build & Deployment

### Preview Build (Android/APK)
```bash
npm run eas-build-preview
# Opens browser to manage build
# Generates APK for testing
```

### Production Build
```bash
npm run eas-build-production
# Requires EAS project ID and authenticated account
```

### Prerequisites for EAS Build
1. Sign up at eas.expo.dev
2. Create project: `eas build --platform android --profile preview --setup`
3. Add `EAS_PROJECT_ID` to `app.json`
4. GitHub Actions can auto-build on `main` branch (optional)

### CI/CD with GitHub Actions
- Runs on push to `main` or `develop`
- Lint + TypeScript + Tests
- On `main`: builds with EAS and deploys Edge Functions

Configure secrets in GitHub:
```
EXPO_TOKEN         # Expo account token
EAS_PROJECT_ID     # EAS project ID
SUPABASE_ACCESS_TOKEN
SUPABASE_DB_PASSWORD
```

## 🌐 Environment Variables

Create `.env` in project root:
```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
EXPO_PUBLIC_EDGE_URL=https://your-project.supabase.co/functions/v1
EXPO_PUBLIC_CONTRACT_ADDRESS=0x0000...
EXPO_PUBLIC_THIRDWEB_AUTH_TOKEN=optional
```

## 🔒 Security Checklist

- ✅ OTP/magic link auth (no password stored client-side)
- ✅ JWT validation on assess-and-mint endpoint
- ✅ RLS policies: non-admin cannot create courses
- ✅ User can only submit assessments for their own ID
- ✅ Wallet address from server, not client input
- ✅ OpenAI/Thirdweb keys in Edge Function secrets only
- ✅ Rate limiting (1 assessment/min) prevents abuse
- ✅ Submission image URLs signed, time-limited
- ✅ No seed phrases exposed; wallet created server-side

## 📱 UI & Accessibility

- **Framework:** React Native Paper (Material Design)
- **Navigation:** React Navigation (native-stack)
- **Touch targets:** 44px minimum
- **Color contrast:** WCAG AA compliant
- **Font scaling:** Respects system text size setting
- **Labels:** accessibilityLabel on all buttons
- **Indicators:** Offline status, sync spinner, network errors

## 🎯 Roadmap / TODO

- [ ] Delta sync instead of full overwrite (production)
- [ ] Image compression before upload
- [ ] Biometric unlock (Face ID / Fingerprint)
- [ ] Multi-language support (i18n)
- [ ] Dark mode
- [ ] Push notifications for assessment results
- [ ] Advanced profile stats (skills by category, progress)
- [ ] Sharing NFTs on social media

## 📞 Support

For issues or questions:
1. Check GitHub Issues
2. Review `.env.example` for missing vars
3. Ensure Supabase credentials are correct
4. Run `npm run tsc` to catch TypeScript errors

## 📄 License

MIT
