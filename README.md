# 🚀 Next.js 16 Dynamic Developer Portfolio & Admin Panel 2.0

> A production-grade, highly aesthetic developer portfolio and full-featured content management dashboard built with Next.js 16 (App Router), TypeScript, Tailwind CSS, Prisma ORM, Supabase PostgreSQL, Google Gemini AI, Resend API, and NextAuth.js.

![Portfolio Banner](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Highlights & Features

### 💻 Public Visitor Experience
- 🤖 **AI Recruiter Assistant ("Ask My AI Twin")**: Embedded AI chat widget powered by **Google Gemini AI** (`gemini-2.0-flash`) that retrieves real-time portfolio projects, skills, and bio from Supabase PostgreSQL to answer recruiter questions dynamically.
- ⌨️ **Interactive macOS/Zsh CLI Terminal (`Ctrl+K`)**: Keyboard-driven interactive terminal modal supporting command history navigation, themes, whoami, skills, projects, and custom interactive commands.
- 📄 **In-Page PDF Resume Preview Drawer**: High-res glassmorphic modal with embedded PDF viewer, instant download, and open-in-tab capabilities.
- 🏆 **Gamified Visitor Achievement Badges**: 7 visitor achievement badges (*Terminal Master*, *Theme Explorer*, *Recruiter Special*, *AI Collaborator*, *Inquirer*, *Night Owl*, and secret *Explorer Supreme*) with unlock toasts and progress tracking.
- 🎨 **Custom Accent Glow Theme Picker**: Real-time CSS variable engine supporting 5 preset themes (`Indigo`, `Emerald`, `Violet`, `Amber`, `Ocean`) with `localStorage` persistence.
- 🖼️ **Dynamic OpenGraph (OG) Social Preview Cards**: Real-time 1200x630px social card generator (`next/og`) for dynamic Twitter and LinkedIn link previews.

---

### 🛡️ Full-Featured Admin Panel (`/admin`)
- 📊 **Analytics & Visitor Insights Dashboard**: Real-time traffic metrics, demo launch counters, CTR %, contact submissions, and timeframe filters (*Today*, *Past 7 Days*, *Past 30 Days*, *All Time*).
- 📧 **Direct Email Reply & Template Builder**: Reply to recruiter messages directly from `/admin/messages` using pre-saved professional email response templates via the **Resend API**.
- 🔒 **Admin Security & Credential Manager**: Change Admin credentials securely with `bcryptjs` password hashing and monitor environment API key integration health.
- ↕️ **Project & Skill Position Reordering Grids**: Move projects and skills up/down with 1 click to instantly re-arrange their display order on the public showcase grid.
- 📦 **1-Click Data Backup & JSON Import/Export**: Export full portfolio database snapshots (`portfolio-backup-YYYY-MM-DD.json`) with Overwrite vs Merge restore options.
- 📝 **Admin Quick Notes & To-Do Scratchpad**: In-dashboard persistent notepad with priority task checklist (*High 🔥*, *Medium ⚡*, *Low ☕*) and auto-save capabilities.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server Actions, Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS Glassmorphism
- **Database & ORM**: [Supabase PostgreSQL](https://supabase.com/) & [Prisma ORM](https://www.prisma.io/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (JWT Strategy)
- **AI Twin Engine**: [Google Gemini AI API](https://ai.google.dev/) (`gemini-2.0-flash`)
- **Email Service**: [Resend API](https://resend.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & Lucide Icons

---

## 📁 Repository Structure

```
MyPortfolio2.0/
├── prisma/
│   └── schema.prisma         # Database schema (User, Project, Skill, Achievement, Message, AnalyticsLog)
├── public/
│   └── resume.pdf            # PDF Resume document
├── src/
│   ├── app/
│   │   ├── (public)/         # Public portfolio route
│   │   ├── admin/            # Admin Panel routes (Dashboard, Projects, Skills, Inbox, Security)
│   │   └── api/              # Route Handlers (ai-chat, backup, messages, projects, security, og)
│   ├── components/
│   │   ├── admin/            # Admin widgets (AnalyticsCharts, ImageUploader, DataBackupManager, AdminNotesWidget)
│   │   ├── public/           # Public widgets (AiAssistantWidget, TerminalModal, ResumeModal, ThemePicker)
│   │   └── common/           # Shared UI components
│   └── lib/                  # Database client, Auth config, and utility functions
├── .env                      # Environment configuration
└── README.md
```

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or Supabase project)

### 2. Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/my-portfolio.git
cd my-portfolio

# Install dependencies
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:password@db.supabase.co:5432/postgres"

NEXTAUTH_SECRET="your-random-32-char-secret"
NEXTAUTH_URL="http://localhost:3000"

ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="admin123password"

RESEND_API_KEY="re_123456789"
CONTACT_RECEIVER_EMAIL="your-email@example.com"

GEMINI_API_KEY="AIzaSyYourGeminiApiKey"
```

### 4. Database Setup & Sync

```bash
# Push Prisma schema to your PostgreSQL database
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

### 5. Run Local Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view your portfolio! Access the admin panel at [http://localhost:3000/admin](http://localhost:3000/admin).

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
