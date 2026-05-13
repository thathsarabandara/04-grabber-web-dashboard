# 🖥️ Grabber Web Dashboard

> **Repository `04`** · React + Vite primary control interface for the Grabber robotic arm — real-time control, telemetry visualization, live camera, AI overlay, 3D digital twin, and task scheduling.

[![Platform](https://img.shields.io/badge/Platform-Web-blue)]()
[![Language](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript)]()
[![Framework](https://img.shields.io/badge/Framework-React%20%2B%20Vite-61DAFB?logo=react)]()
[![3D](https://img.shields.io/badge/3D-Three.js-black?logo=threedotjs)]()
[![Status](https://img.shields.io/badge/Status-Stage%202%20Planned-yellow)]()

---

## 🧭 What Is This Repository?

This is the **primary control interface** for the Grabber platform — a feature-rich React/Vite web application that gives operators full control and visibility over the robotic arm from any modern browser.

It is the most feature-dense frontend in the Grabber ecosystem, covering everything from basic joint control to AI-assisted pick-and-place and a 3D digital twin powered by Three.js.

---

## 📦 Module Structure

```
04-grabber-web-dashboard/
├── src/
│   ├── control_panel/     ← Joint sliders, speed control, mode switching
│   ├── telemetry_view/    ← Live gauges — angles, voltage, temp, connection
│   ├── camera_view/       ← Live MJPEG feed, snapshot button, recording controls
│   ├── command_history/   ← Timestamped command log with replay capability
│   ├── gamepad/           ← Browser Gamepad API integration
│   ├── path_draw/         ← Canvas-based path drawing → waypoint generation
│   ├── ai_panel/          ← Object detection overlay, click-to-pick interface
│   ├── digital_twin/      ← Three.js 3D robot model, movement preview
│   └── task_scheduler/    ← Drag-and-drop task sequence builder
├── public/                ← Static assets
├── index.html
├── vite.config.ts
└── README.md
```

---

## 🖼️ Panel Overview

| Panel | Description |
|---|---|
| **Control Panel** | Sliders for J1–J4, speed dial, manual / auto / replay mode toggle |
| **Telemetry View** | Live animated gauges for joint angles, voltage, temperature, and connection state |
| **Camera View** | Full-resolution MJPEG live stream, snapshot capture, start/stop recording |
| **Command History** | Chronological log of every command sent, with one-click replay |
| **Gamepad Control** | Plug-in any USB/Bluetooth gamepad — axes map to joints automatically |
| **Path Drawing** | Draw a path on canvas → converted to waypoint sequence → sent to robot |
| **AI Panel** | Live detection overlay, click any detected object to trigger pick |
| **3D Digital Twin** | Three.js model mirrors robot in real time; preview movements before execution |
| **Task Scheduler** | Drag-and-drop builder to sequence multi-step automated routines |

---

## 🔌 Backend Integration

| Service | Method | Purpose |
|---|---|---|
| `06-auth-service` | REST (via Gateway) | Login, register, token management |
| `07-robot-service` | REST (via Gateway) | Send commands, change modes, schedule tasks |
| `08-telemetry-service` | WebSocket | Real-time joint + health telemetry |
| `08-telemetry-service` | MJPEG (via Gateway) | Live camera stream |
| `09-ai-service` | REST/WS (via Gateway) | Object detection results + pick coordinates |

All traffic is routed through **`05-grabber-api-gateway`**.

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18.x
- npm ≥ 9.x
- A running Grabber backend stack (see [`10-grabber-devops-infras`](https://github.com/thathsarabandara/10-grabber-devops-infras))

### Setup

```bash
# Clone the repo
git clone https://github.com/thathsarabandara/04-grabber-web-dashboard.git
cd 04-grabber-web-dashboard

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API gateway URL
```

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_WS_BASE_URL=ws://localhost:8080
```

### Run

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📈 Feature Roadmap

| # | Feature | Stage | Status |
|---|---|---|---|
| F06 | Web Slider Control | 🟡 2 | Planned |
| F07 | Real-Time Status Display | 🟡 2 | Planned |
| F08 | Command History | 🟡 2 | Planned |
| F09 | Record & Replay Motion | 🟡 2 | Planned |
| F10 | Live Camera Feed | 🔵 3 | Planned |
| F12 | Snapshot Capture | 🔵 3 | Planned |
| F17 | Gamepad Control | 🔶 5 | Planned |
| F18 | Path Drawing Control | 🔶 5 | Planned |
| F19 | Task Scheduling | 🔶 5 | Planned |
| F21 | Click-to-Pick | 🔴 6 | Planned |
| F24 | 3D Digital Twin | ⚫ 7 | Planned |

---

## 🔗 Related Repositories

| Repo | Role |
|---|---|
| [`01-grabber-architecture`](https://github.com/thathsarabandara/01-grabber-architecture) | System architecture and API contracts |
| [`05-grabber-api-gateway`](https://github.com/thathsarabandara/05-grabber-api-gateway) | All dashboard traffic enters here |
| [`08-grabber-telemetry-service`](https://github.com/thathsarabandara/08-grabber-telemetry-service) | WebSocket telemetry + camera relay |
| [`09-grabber-ai-service`](https://github.com/thathsarabandara/09-grabber-ai-service) | Object detection + click-to-pick backend |

---

<div align="center">
  <sub>Part of the <strong>Grabber</strong> AI-Powered Industrial Robotic Arm Platform</sub>
</div>
