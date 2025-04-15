# Upcheck Codebase Documentation

Welcome to the Upcheck project! This document will help you understand the structure, conventions, and workflows of the codebase so you can quickly become a productive contributor.

---

## Table of Contents

- [Upcheck Codebase Documentation](#upcheck-codebase-documentation)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
  - [Tech Stack](#tech-stack)
  - [Directory Structure](#directory-structure)
  - [Key App Flows](#key-app-flows)
  - [Development Setup](#development-setup)
  - [Code Style \& Conventions](#code-style--conventions)
  - [Common Patterns](#common-patterns)
  - [Testing](#testing)
  - [Localization](#localization)
  - [API Integration](#api-integration)
  - [AsyncStorage Usage](#asyncstorage-usage)
  - [Navigation](#navigation)
  - [Adding Features](#adding-features)
  - [Troubleshooting](#troubleshooting)
  - [Contributing](#contributing)
  - [Contact](#contact)

---

## Project Overview

Upcheck is a React Native (Expo) app for Indian shrimp farmers, providing real-time monitoring, analytics, and community features. It uses a freemium model and supports multiple languages.

---

## Tech Stack

- **React Native** (Expo)
- **React Navigation** (via `expo-router`)
- **AsyncStorage** for local persistence
- **REST API** backend (`upcheck-server.onrender.com`)
- **i18n** for localization
- **CryptoJS** for hashing
- **react-native-vector-icons** for icons
- **react-native-magnus**, **react-native-paper** for UI components

---

## Directory Structure

```
app/
  ├── addpond/         # Add pond form
  ├── email_verif/     # Email verification flow
  ├── farm/            # Farm details (dynamic route)
  ├── forgotpassword/  # Password reset
  ├── home/            # Dashboard/home screen
  ├── login/           # Login screen
  ├── pondform/        # Pond details form
  ├── ponds/           # Pond listing and grouping
  ├── profile/         # User profile
  ├── profileform/     # Profile setup form
  ├── signup/          # Signup screen
  ├── (tabs)/          # Tabbed navigation (profile, settings, inventory, social)
  └── TestScreen/      # Test screens
assets/
  └── images/          # App images and icons
components/            # Shared React components
src/
  ├── i18n.js          # i18n initialization
  └── locales/         # Translation files
scripts/               # Utility scripts (e.g., reset-project.js)
```

---

## Key App Flows

- **Signup:** `/signup` → `/email_verif` → `/profileform` → `/pondform`
- **Login:** `/login` → `/home` (dashboard)
- **Profile:** `/profile` (view/edit), `/profileform` (edit details)
- **Pond Management:** `/pondform` (add), `/ponds` (list/group), `/farm/[farmId]` (farm details)
- **Inventory:** `/inventory` (manage feed)
- **Settings:** `/settings` (language, storage, logout)
- **Social:** `/social` (community features)

---

## Development Setup

1. **Clone the repo:**  
   `git clone <repo-url> && cd upcheck`

2. **Install dependencies:**  
   `npm install`

3. **Start Expo:**  
   `npx expo start`

4. **Run on device/emulator:**  
   Use Expo Go app or Android/iOS emulator.

---

## Code Style & Conventions

- **Functional Components** with React Hooks
- **Async/Await** for async logic
- **Consistent Naming:**  
  - Components: `PascalCase`
  - Variables/Functions: `camelCase`
- **Styles:**  
  - Use `StyleSheet.create` in each file
  - Keep styles at the bottom of the file

---

## Common Patterns

- **API Calls:**  
  Use `fetch` with async/await. Handle errors and show user feedback via `Alert`.

- **AsyncStorage:**  
  Used for persisting user/session data. Always check for null/undefined before using.

- **Navigation:**  
  Use `useRouter` from `expo-router` for navigation.  
  Example: `router.replace('/profile')`

- **Modals:**  
  Use `Modal` from `react-native` for popups (e.g., language selection, profile picture).

- **Forms:**  
  Validate inputs before submitting. Use `Alert` for error messages.

---

## Testing

- **Manual Testing:**  
  Use Expo Go or emulator for UI/UX and flow testing.
- **Automated Testing:**  
  (Add instructions here if you have Jest or Detox tests.)

---

## Localization

- **i18n:**  
  - Configured in [`src/i18n.js`](src/i18n.js)
  - Translation files in [`src/locales/`](src/locales/)
  - Language can be changed in the Settings tab.

---

## API Integration

- **Base URL:**  
  `https://upcheck-server.onrender.com/api/`
- **Endpoints:**  
  - Auth: `/v2/auth/register`, `/v1/auth/verify-email`, `/v1/auth/verify-code`
  - User: `/users/email/:email`, `/users/:userId`
  - Ponds: `/ponds`
  - Mailing: `/v1/mailing/welcome`
- **Token Generation:**  
  Uses SHA-256 hash of user info for registration.

---

## AsyncStorage Usage

- **Keys:**  
  - `userDetails`: User profile/session info
  - `userId`: User's unique ID
  - `ponds`: Pond data (object keyed by pond ID)
  - `farms`: Farm data (array)
  - `language`: Selected language

- **Best Practices:**  
  - Always check for existence before reading.
  - Update after any profile/pond/farm change.

---

## Navigation

- **expo-router** is used for navigation.
- **Dynamic routes:**  
  - `/farm/[farmId].js` for farm details
- **Tabs:**  
  - Defined in `/app/(tabs)/_layout.tsx`

---

## Adding Features

- **New Screen:**  
  1. Create a new folder/file in `app/`
  2. Add to navigation if needed (tabs or stack)
  3. Follow code style and patterns

- **New API Call:**  
  1. Use `fetch` with async/await
  2. Handle errors and loading state
  3. Update AsyncStorage if needed

- **New Language:**  
  1. Add a JSON file in `src/locales/`
  2. Update language selection in Settings

---

## Troubleshooting

- **Metro Bundler issues:**  
  `npx expo start -c` to clear cache
- **Android/iOS build issues:**  
  Check for missing dependencies or run `npm install`
- **API errors:**  
  Check server logs and endpoint URLs

---

## Contributing

- **Branching:**
  - Create a new branch from `main` for each feature, bugfix, or improvement.
  - Use descriptive branch names, e.g., `feature/add-language-support`, `bugfix/login-crash`.
- **Pull Requests:**
  - Ensure your branch is up to date with `main` before opening a PR.
  - Submit a pull request to the `main` branch.
  - Provide a clear, concise description of your changes and reference related issues if applicable.
  - Include screenshots or screen recordings for UI changes.
  - Ensure your code passes all tests and lint checks.
- **Code Reviews:**
  - Address all review comments and suggestions.
  - Add comments for complex logic or decisions.
- **Issues:**
  - Use GitHub Issues for bugs, feature requests, or questions.
  - Reference issues in your PRs using `Fixes #issue_number` or `Closes #issue_number`.

---

## Contact

- **Email:** [care@upcheck.in](mailto:care@upcheck.in)
- **Website:** [www.upcheck.in](https://www.upcheck.in)
- **Instagram:** [@UpCheckIndia](https://instagram.com/UpCheckIndia)
- **LinkedIn:** [UpCheck India](https://linkedin.com/company/UpCheckIndia)

---

Happy coding! 🚀