# SkillSwap — "Student Skill Exchange Platform"🎓🔁

An Android app (built with Jetpack Compose) where students trade skills with each other — teach what you know, learn what you don't, schedule sessions, chat, and earn points along the way.



## ✨ Features

- **Skill Listings** — Post skills you can teach (title, category, level, description, tags, points required)
- **Search & Filter** — Browse listings by category or keyword (Programming, Design, Music, Public Speaking, Video Editing, Languages, Fitness, Academics, etc.)
- **Learning Requests** — Send a request to learn a skill, offering one of your own skills in exchange; track status (pending, accepted, rejected, completed, cancelled)
- **Session Scheduling** — Once a request is accepted, book a session with a time, duration, and location (online or on-campus)
- **In-App Chat** — Direct messaging between matched students, including image support
- **Notifications** — Get notified on new requests, acceptances, sessions, chats, and points earned
- **Skill Points & Ratings** — Earn points for completed sessions; rate and review mentors after a session
- **Reviews & Trust** — Leave feedback and ratings tied to specific skills/sessions
- **Reporting & Moderation** — Report a listing or user; flagged content shows up for admin review
- **Admin Dashboard** — Platform KPIs, manage reported listings, and oversee trust & safety
- **User Profiles** — Bio, college, availability, skills offered/wanted, average rating

## 🛠️ Tech Stack

| Layer          | Technology |
|----------------|------------|
| Language       | Kotlin |
| UI              | Jetpack Compose (Material 3) |
| Architecture   | MVVM (`ViewModel` + `StateFlow`) |
| Local Database | Room (SQLite) |
| Networking     | Retrofit + OkHttp |
| JSON           | Moshi |
| Images         | Coil |
| AI             | Firebase AI (Gemini API) |
| Backend infra  | Firebase (App Check / reCAPTCHA, optional Firestore/Auth) |
| Build          | Gradle (Kotlin DSL), KSP |
| Testing        | JUnit, Robolectric, Roborazzi (screenshot tests), Espresso |

## 📁 Project Structure

```
SkillSwap/
├── app/
│   └── src/
│       ├── main/
│       │   ├── java/com/example/
│       │   │   ├── data/
│       │   │   │   ├── dao/            # SkillSwapDao (Room DAO)
│       │   │   │   ├── db/             # SkillSwapDatabase
│       │   │   │   ├── model/          # Entities.kt (User, Skill, Request, Session, Chat, Notification, Review, Report)
│       │   │   │   └── repository/     # SkillSwapRepository
│       │   │   ├── ui/
│       │   │   │   ├── dialogs/        # AddSkillListingDialog, SendRequestDialog, NotificationDialog
│       │   │   │   ├── screens/        # HomeScreen, ProfileScreen, ChatScreen, RequestsAndSessionsScreen, AdminScreen
│       │   │   │   ├── theme/          # Color, Theme, Type
│       │   │   │   └── viewmodel/      # SkillSwapViewModel
│       │   │   └── MainActivity.kt
│       │   ├── AndroidManifest.xml
│       │   └── res/
│       ├── test/                       # Unit + Robolectric/screenshot tests
│       └── androidTest/                # Instrumented tests
├── build.gradle.kts
├── settings.gradle.kts
├── gradle/libs.versions.toml
└── .env.example
```

## 🗃️ Data Model (Room Entities)

- `UserEntity` — profile, college, skills offered/wanted, skill points, rating
- `SkillListingEntity` — a skill someone is offering
- `LearningRequestEntity` — a request to learn a skill, with status
- `SessionEntity` — a scheduled learning session tied to an accepted request
- `ChatMessageEntity` — messages between two users
- `NotificationEntity` — in-app notifications
- `ReviewEntity` — post-session ratings/feedback
- `ReportEntity` — reported listings/users for moderation

## 🚀 Getting Started


### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kasthuri-001/Student-Skill-Exchange-Platform.git
   cd Student-Skill-Exchange-Platform
   ```

2. **Open in Android Studio**
   Open the project root and let Android Studio sync Gradle and resolve any suggested fixes.

3. **Configure your Gemini API key**
   Create a `.env` file in the project root (see `.env.example`) and set:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Debug signing**
   The project ships with a `debugConfig` signing config for local runs. For a release build, remove/replace the `signingConfig` line pointing to `debugConfig` in `app/build.gradle.kts` and supply your own keystore via `KEYSTORE_PATH`, `STORE_PASSWORD`, and `KEY_PASSWORD` environment variables.

5. **Run**
   Select a device/emulator and hit **Run** ▶️ in Android Studio.

## 📌 Usage

1. Set up your profile — add your college, skills you can teach, and skills you want to learn.
2. Browse or search skill listings by category.
3. Send a learning request, offering one of your own skills in exchange.
4. Once accepted, schedule a session and chat with your match.
5. Complete the session, earn points, and leave a rating.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m "Add some feature"`
4. Push to the branch: `git push origin feature-name`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Kasthuri-001**
GitHub: [github.com/Kasthuri-001](https://github.com/Kasthuri-001)
