# 🌻 RISA — Remaja Indonesia Sehat

RISA (Remaja Indonesia Sehat) is an interactive educational platform designed to make reproductive health education easier, more engaging, and more accessible for Indonesian teenagers.

Instead of presenting information only through long articles, RISA combines **microlearning, interactive activities, and educational games** to create a more enjoyable learning experience.

## ✨ Features

RISA currently provides seven learning chapters covering topics such as:

* Getting to know the body
* Healthy menstruation
* Personal hygiene
* Safe personal boundaries
* Nutrition and body health
* Sexually transmitted infections (STIs)
* Knowledge review and assessment

The platform also includes:

* Interactive educational games
* Chapter progress tracking
* Post-test assessment
* Guest learning access
* Child profiles
* Guardian authentication
* Parental consent flow
* Character/avatar selection

## 🛠️ Tech Stack

The frontend is built with:

* Next.js
* React
* TypeScript
* Tailwind CSS
* Supabase
* Zustand
* Motion
* Lucide React

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/RISA-Remaja-Indonesia-Sehat/risa-v3.git
cd risa-v3
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root.

```env
NEXT_PUBLIC_API_URL=your_backend_api_url
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Never commit private credentials or secret keys to the repository.

### 4. Start the development server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

in your browser.

## 📜 Available Scripts

```bash
npm run dev
```

Starts the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Starts the production server.

```bash
npm run lint
```

Runs ESLint.

## 📁 Project Structure

```text
app/
├── chapters/
├── child/
├── guardian/
├── post-test/
└── store/

components/
hooks/
lib/
public/
```

* `app/` — Next.js routes and pages
* `components/` — reusable UI components
* `hooks/` — custom React hooks
* `lib/` — API, authentication, Supabase, and game utilities
* `public/` — images, audio, avatars, and other static assets

## 🔐 Child Safety & Parental Consent

RISA includes a guardian and child account flow designed to support safer access for younger users.

Guardian authentication is handled separately from child profiles, and child account creation uses a parental consent process through the RISA backend.

## 🌱 Learning Progress

Users can progress through RISA's learning chapters and educational activities.

Registered child profiles can store chapter completion and post-test progress through the backend API.

## 🌐 Deployment

The frontend can be deployed using platforms that support Next.js, such as Vercel.

Production website:

https://risa-v2.vercel.app

## 🔗 Backend Repository

RISA's backend API is maintained separately:

https://github.com/RISA-Remaja-Indonesia-Sehat/server-v3

## 🎯 Project Goal

RISA aims to provide reproductive health education that is:

* Easy to understand
* Age-appropriate
* Interactive
* Engaging
* Accessible to Indonesian young people

The project continues to evolve as new learning experiences, safety features, and educational content are developed.

## 📌 Project Status

RISA is currently under active development.

Features, content, user flows, and APIs may change as the project continues to improve.

---

Made for **RISA — Remaja Indonesia Sehat** 🌻