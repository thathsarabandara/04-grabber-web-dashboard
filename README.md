# 🖥️ Grabber Web Dashboard

> **Repository `04`** · React + Vite primary control interface for the Grabber robotic arm — real-time control, telemetry visualization, live camera, AI overlay, 3D digital twin, and task scheduling.

[![Platform](https://img.shields.io/badge/Platform-Web-blue)]()
[![Language](https://img.shields.io/badge/Language-JavaScript-F7DF1E?logo=javascript)]()
[![Framework](https://img.shields.io/badge/Framework-React%20%2B%20Vite-61DAFB?logo=react)]()
[![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?logo=tailwindcss)]()
[![State](https://img.shields.io/badge/State%20Management-Redux%20%2B%20Zustand-764ABC?logo=redux)]()
[![Status](https://img.shields.io/badge/Status-Active%20Development-green)]()

---

## 📋 Table of Contents

- [Overview](#-what-is-this-repository)
- [Architecture](#-architecture)
- [Features](#-features)
- [Installation](#-getting-started)
- [Project Structure](#-project-structure)
- [Usage Guide](#-usage-guide)
- [API Integration](#-backend-integration)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## 🧭 What Is This Repository?

This is the **primary web control interface** for the Grabber platform — a comprehensive React/Vite web application that provides operators with full control and visibility over the robotic arm from any modern browser.

It is the most feature-rich frontend in the Grabber ecosystem, covering everything from basic joint control via joystick to AI-assisted pick-and-place operations, real-time telemetry monitoring, and a 3D digital twin visualization.

**Key Highlights:**
- ✅ Modern, minimalistic UI with full dark/light mode support
- ✅ Responsive design (mobile-first, tablet & desktop optimized)
- ✅ Real-time data streaming via WebSocket
- ✅ GSAP-powered animations for smooth transitions
- ✅ Redux Toolkit for global state management
- ✅ Axios with interceptors for API communication
- ✅ Modular architecture with separation of concerns
- ✅ TypeScript-ready (can be migrated anytime)

---

## 🏗️ Architecture

### Directory Structure

```
04-grabber-web-dashboard/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              ← Navigation with theme toggle
│   │   └── Footer.jsx              ← Footer with links & social
│   │
│   ├── layouts/
│   │   ├── PublicLayout.jsx        ← Navbar + Outlet + Footer
│   │   ├── AuthLayout.jsx          ← Centered auth forms
│   │   └── DashboardLayout.jsx     ← Sidebar + Top bar + Outlet
│   │
│   ├── pages/
│   │   ├── public/
│   │   │   ├── HomePage.jsx        ← Hero + Features CTA
│   │   │   ├── FeaturesPage.jsx    ← Feature grid
│   │   │   ├── BlogPage.jsx        ← Blog post list
│   │   │   ├── RepositoriesPage.jsx ← GitHub repos showcase
│   │   │   ├── GalleryPage.jsx     ← Image gallery
│   │   │   └── ContactPage.jsx     ← Contact form + info
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx       ← Email + Password
│   │   │   ├── RegisterPage.jsx    ← Sign-up form
│   │   │   ├── OTPPage.jsx         ← 6-digit OTP entry
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   └── ResetPasswordPage.jsx
│   │   │
│   │   └── dashboard/
│   │       ├── DashboardPage.jsx        ← Overview & stats
│   │       ├── ControlPanelPage.jsx     ← Joystick + sliders
│   │       ├── TelemetryPage.jsx        ← Gauges + AI + 3D Twin
│   │       ├── PathDrawPage.jsx         ← Canvas drawing
│   │       ├── TaskSchedulerPage.jsx    ← Task queue builder
│   │       ├── ProfilePage.jsx          ← User profile edit
│   │       └── DeviceRegistrationPage.jsx ← Robot pairing
│   │
│   ├── store/
│   │   ├── index.js               ← Zustand stores (Theme, Auth)
│   │   ├── store.js               ← Redux store config
│   │   └── slices/
│   │       └── authSlice.js       ← Auth reducer + async thunks
│   │
│   ├── api/
│   │   └── axiosInstance.js       ← Axios config + interceptors
│   │
│   ├── hooks/
│   │   └── (custom hooks)
│   │
│   ├── utils/
│   │   └── (utility functions)
│   │
│   ├── App.jsx                    ← Main router (BrowserRouter)
│   ├── main.jsx                   ← Entry point (Redux Provider)
│   └── index.css                  ← Global Tailwind styles
│
├── public/                        ← Static assets
├── index.html                     ← HTML template
├── vite.config.js                 ← Vite configuration
├── tailwind.config.js             ← Tailwind CSS config
├── postcss.config.js              ← PostCSS config
├── eslint.config.js               ← ESLint configuration
├── package.json                   ← Dependencies & scripts
└── README.md                      ← This file
```

---

## 🎨 Features

### 🌍 **Public Pages** (No Authentication Required)

| Page | Description | Features |
|------|-------------|----------|
| **Home** | Landing page with hero section | CTA buttons, feature grid, animations |
| **Features** | Feature showcase | 8+ feature cards with descriptions |
| **Blog** | Blog/news feed | Post cards with categories & dates |
| **Repositories** | GitHub repos list | Repo stats (stars, language, description) |
| **Gallery** | Photo gallery | Responsive image grid with hover effects |
| **Contact** | Contact form | Email form + contact info (phone, address) |

### 🔐 **Auth Pages** (Public, Redirects if Authenticated)

| Page | Purpose | Validation |
|------|---------|-----------|
| **Login** | User authentication | Email + password, show/hide toggle |
| **Register** | Account creation | Name, email, phone, password validation |
| **OTP Verify** | Email verification | 6-digit code entry with resend timer |
| **Forgot Password** | Password recovery | Email verification link |
| **Reset Password** | Change password | New password confirmation |

### 🎛️ **Dashboard Pages** (Protected Routes)

#### **Dashboard Overview**
- Real-time system status & health metrics
- Quick-access stat cards (status, joint angles, voltage, temperature)
- System health gauges (CPU, Memory, Disk, Network)
- Recent command history

#### **Control Panel**
- **Joystick Control**: Analog joystick for arm positioning
- **Joint Sliders**: Individual control for J1, J2, J3, J4 (±180°)
- **Speed Control**: Adjustable speed percentage
- **Camera Feed**: Live MJPEG video stream
- **Recording**: Start/stop recording capability
- **Fullscreen**: Toggle fullscreen camera view
- **Calibration**: One-click calibration & reset buttons

#### **Telemetry & Monitoring**
- **Circular Gauges**: Real-time displays for joint angles, voltage, temperature
- **AI Detection Panel**: Object detection overlay
- **Digital Twin**: 3D visualization powered by Three.js
- **Live Indicator**: Status badge showing real-time updates

#### **Path Drawing**
- **Canvas-based Drawing**: Click to draw waypoints
- **Grid Background**: Coordinate reference
- **Waypoint List**: View all points with coordinates
- **Export**: Download path data
- **Execute**: Run the saved path

#### **Task Scheduler**
- **Quick Templates**: Pick & Place, Calibrate, Test
- **Task Queue**: Drag-and-drop task reordering
- **Play/Pause**: Execute task sequences
- **Add/Remove**: Manage task list

#### **User Profile**
- **Profile Picture**: Avatar with upload
- **Edit Mode**: Toggle edit form
- **Information Fields**: First name, last name, email, phone
- **Member Since**: Account creation date

#### **Device Registration**
- **Register Robot**: Add new robotic arms
- **Robot ID**: Unique identifier (e.g., GRABBER-001)
- **Serial Number**: Hardware serial number
- **Device List**: All registered robots with status

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/thathsarabandara/04-grabber-web-dashboard.git
cd 04-grabber-web-dashboard

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your API endpoints
```

### Configuration

Create a `.env` file in the project root:

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1
VITE_WS_URL=ws://localhost:5000
VITE_ENV=development
```

### Running the Application

```bash
# Development server (hot module reload)
npm run dev

# Open browser: http://localhost:5173

# Production build
npm run build

# Preview production build
npm run preview
```

---

## 🖼️ Features Overview

| Panel | Description |
|---|---|
| **Control Panel** | Joystick and sliders for J1–J4 joint control, live camera feed with recording |
| **Telemetry View** | Live animated gauges for joint angles, voltage, temperature, digital twin |
| **AI Panel** | Object detection overlay, click-to-pick interface |
| **Task Scheduler** | Drag-and-drop task sequence builder and executor |
| **Path Drawing** | Canvas-based waypoint drawing with export capability |
| **User Profile** | Editable profile information with avatar upload |
| **Device Registration** | Register and manage multiple robotic arms |

---

## 💻 Development

### Authentication Flow

```
1. User visits home page
2. Clicks "Get Started" or "Login"
3. Routes to /auth/login
4. Enters credentials (mock: admin@grabber.local / password123)
5. Redux authSlice.loginUser() executes
6. JWT token stored in localStorage
7. Redirected to /dashboard
```

### Theme Switching

- Click Sun/Moon icon in Navbar or Dashboard sidebar
- Managed by Zustand `useThemeStore`
- Tailwind CSS `dark:` classes handle dark mode styling

### Protected Routes

The DashboardLayout checks authentication state and redirects to login if not authenticated.

---

## 🔌 Backend Integration

### API Services

Centralized Axios configuration with interceptors:

```javascript
// src/api/axiosInstance.js
const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Auto-attach JWT token
// Handle 401 unauthorized errors
```

### State Management

- **Redux Toolkit**: Auth state (user, token, loading)
- **Zustand**: Theme state (light/dark)
- **localStorage**: Token persistence

---

## 🎬 GSAP Animations

All pages feature smooth GSAP animations for:
- Page transitions
- Component entry effects
- Staggered children animations
- Interactive element responses

---

## 📱 Responsive Design

- **Mobile-first** approach with Tailwind breakpoints
- **Sidebar collapse** on mobile devices
- **Touch-friendly** button sizing (min 44x44px)
- **Fluid layouts** that adapt to all screen sizes

---

## 📦 Dependencies

### Core
- react, react-dom, react-router-dom

### State & API
- @reduxjs/toolkit, react-redux, zustand, axios

### UI & Animation
- tailwindcss, gsap, lucide-react

### Development
- vite, @vitejs/plugin-react

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
# Creates dist/ folder ready for deployment
```

### Deployment Platforms

- **Vercel**: Automatic from Git push
- **Netlify**: Drag & drop dist/ or connect Git
- **Docker**: Containerize with Dockerfile
- **Traditional Server**: Copy dist/ to web root

---

## 🔗 Related Repositories

- [01-grabber-architecture](../01-grabber-architecture) — System design
- [05-grabber-api-gateway](../05-grabber-api-gateway) — API gateway
- [06-grabber-auth-service](../06-grabber-auth-service) — Auth service
- [07-grabber-robot-service](../07-grabber-robot-service) — Robot control
- [08-grabber-telemetry-service](../08-grabber-telemetry-service) — Real-time data
- [09-grabber-ai-service](../09-grabber-ai-service) — Object detection
- [10-grabber-devops-infras](../10-grabber-devops-infras) — Infrastructure
