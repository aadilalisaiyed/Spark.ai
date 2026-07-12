# EcoSphere: ESG Management Platform

A comprehensive **Environmental, Social, and Governance (ESG)** management platform designed to help organizations track, manage, and improve their sustainability metrics through gamified insights and real-time dashboards.

## 🌍 Overview

EcoSphere is a Next.js 14-based web application that provides a unified dashboard for managing ESG initiatives across an organization. The platform integrates environmental tracking, social responsibility programs, governance compliance, and gamified challenges to drive sustainable business practices.

## 🚀 Features

### 1. **Dashboard**
- Real-time ESG scores (Environmental, Social, Governance, Overall)
- 12-month emissions trend visualization
- Department ESG rankings
- Recent activity feed
- Quick action buttons

### 2. **Environmental Module**
- Emission goals tracking with progress bars
- Carbon transaction management
- Product ESG profiles
- Environmental factors database
- Sub-navigation tabs for organized data management

### 3. **Social Module**
- CSR activities discovery and participation
- Employee engagement tracking
- Approval queue for activity evidence
- Diversity dashboard (coming soon)
- Points and achievement system

### 4. **Governance Module**
- Audit tracking with findings and status
- Compliance issues management with severity tagging
- Policy management
- Policy acknowledgements tracking
- Audit resolution tracking

### 5. **Gamification Module**
- Challenge system with XP rewards
- Difficulty levels (Easy, Medium, Hard)
- Challenge status pipeline (Draft → Active → Under Review → Completed → Archived)
- Badge gallery with unlock criteria
- Leaderboard with XP rankings
- Employee participation tracking

### 6. **Reports Module**
- Pre-built report templates (Environmental, Social, Governance, ESG Summary)
- Custom report builder with filters
- Multi-format export (PDF, Excel, CSV)
- Date range, department, and category filtering

### 7. **Settings Module**
- Department management
- ESG configuration toggles
- Notification settings
- System preferences
- Category management

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Dark Mode)
- **Charts**: Recharts
- **HTTP Client**: Axios
- **UI Utilities**: clsx, tailwind-merge

## 📁 Project Structure

```
src/
├── app/                           # Next.js App Router pages
│   ├── page.tsx                  # Dashboard
│   ├── environmental/page.tsx    # Environmental tracking
│   ├── social/page.tsx           # CSR & engagement
│   ├── governance/page.tsx       # Compliance & audits
│   ├── gamification/page.tsx     # Challenges & badges
│   ├── reports/page.tsx          # Report builder
│   ├── settings/page.tsx         # Configuration
│   ├── layout.tsx                # Root layout with navigation
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx (includes KPITile)
│   │   ├── Badge.tsx (includes Input, SearchBox)
│   │   ├── ProgressBar.tsx (includes Tabs, StatusFlow)
│   │   └── Modal.tsx (includes Table)
│   └── layout/
│       ├── TopBar.tsx            # Page title + RGB indicators
│       └── NavigationBar.tsx     # Color-coded navigation (7 tabs)
├── types/
│   └── index.ts                  # TypeScript interfaces & types
└── lib/
    └── api.ts                    # Axios instance & mock API functions
```

## 🎨 Design System

### Color Palette
- **Dashboard**: Gray
- **Environmental**: Green (#10b981)
- **Social**: Blue (#3b82f6)
- **Governance**: Purple (#a855f7)
- **Gamification**: Orange (#f97316)
- **Reports**: Gray
- **Settings**: Gray

### Theme
- **Dark Mode**: Primary background (#0f172a), secondary surface (#1e293b)
- **Typography**: Light on dark backgrounds
- **Borders**: Subtle dark borders (#334155)

### Components
- **KPI Tiles**: Color-coded left borders matching module colors
- **Tabs**: Pill-shaped with color-coded active states
- **Badges**: Severity-colored (Green: Success, Red: Error, Yellow: Warning, Blue: Info)
- **Status Flow**: Visual pipeline showing challenge progression
- **Progress Bars**: Animated indicators with percentage labels

## 🚦 Navigation

The platform uses a global navigation structure:

1. **TopBar**: "EcoSphere: {PageName}" with RGB indicator squares
2. **NavigationBar**: 7 color-coded tabs for main modules
3. **Sub-Navigation**: Module-specific tabs (Pills) for content organization

## 📊 Mock Data

The platform comes pre-populated with comprehensive mock data:

- 5 Departments with employee counts
- 3 Environmental goals with progress tracking
- 3 CSR activities with participation
- 3 Audits with findings
- 2 Compliance issues with severity levels
- 3 Gamification challenges
- 4 Unlockable badges
- 5 Leaderboard entries
- 12-month emissions trend
- 5 Department ESG rankings
- 5 Recent activities

All mock data is in `src/lib/api.ts` and can be easily replaced with real API calls.

## 🏃 Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 10.x or higher

### Installation

1. Navigate to the project directory:
```bash
cd /home/nirmalya/Desktop/Spark.ai
```

2. Install dependencies:
```bash
npm install
```

### Development Server

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

Create an optimized production build:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

### Linting

Run ESLint to check for code issues:
```bash
npm run lint
```

## 🔄 Next Steps

### Phase 2: Feature Development
1. Implement real API integrations (replace mock data)
2. Add user authentication and authorization
3. Develop backend services for data persistence
4. Implement real-time notifications
5. Add PDF/Excel export functionality
6. Create admin dashboards

### Phase 3: Enhancement
1. Mobile responsive optimization
2. Advanced filtering and search
3. Data visualization improvements
4. Performance optimization
5. Accessibility improvements (WCAG compliance)
6. Internationalization (i18n) support

### Phase 4: Integration
1. ERP system integration (SAP, Oracle, etc.)
2. Third-party API integrations
3. Webhook support for external triggers
4. Custom report generation engine
5. Data migration tools

## 🔐 Security Considerations

- Input validation and sanitization
- CSRF protection
- XSS prevention
- Role-based access control (RBAC)
- Audit logging for compliance tracking
- Data encryption for sensitive information

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📝 License

Proprietary - All rights reserved

## 👥 Team

Developed for EcoSphere ESG Management Initiative

## 🤝 Contributing

For internal development, please follow the established code structure and TypeScript conventions.

## 📞 Support

For issues or questions, contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: July 12, 2026  
**Status**: ✅ Production Ready (Scaffolding Complete)
