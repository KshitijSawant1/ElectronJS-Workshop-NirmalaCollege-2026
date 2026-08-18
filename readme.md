<div align="center">

# Electron.js Workshop — Grovio

### CLYXN × SORXN | Nirmala College 2026

A hands-on desktop application development workshop using  
**Electron.js, Next.js, React.js and Node.js**

<br>

![Electron](https://img.shields.io/badge/Electron-43.4.0-47848F?style=for-the-badge&logo=electron&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.3.1-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)

<br>

![Workshop](https://img.shields.io/badge/Workshop-Nirmala_College_2026-orange?style=flat-square)
![Status](https://img.shields.io/badge/Status-In_Progress-yellow?style=flat-square)
![Repository](https://img.shields.io/badge/Repository-Public-brightgreen?style=flat-square)
![Updates](https://img.shields.io/badge/Updates-After_Every_Session-blue?style=flat-square)

</div>

---

## About the Workshop

This repository contains the source code, examples, and session-wise development work for the **CLYXN × SORXN Electron.js Workshop at Nirmala College 2026**.

The workshop follows a project-based approach where students progressively build **Grovio**, a desktop application developed using modern web technologies and Electron.js.

The repository will be updated after every workshop session so that students can access the latest version of the project.

---

## About Grovio

**Grovio** is the primary application developed throughout the workshop.

The project demonstrates how a modern Next.js application can be integrated with Electron.js and executed as a desktop application.

### Technology Stack

| Technology | Purpose |
|---|---|
| JavaScript | Application programming language |
| React.js | Component-based user interface |
| Next.js | Application framework and structure |
| Tailwind CSS | User interface styling |
| Node.js | JavaScript runtime and package environment |
| Electron.js | Desktop application environment |
| Supabase | Backend and database integration |

---

## Project Architecture

```text
Grovio
│
├── Next.js
│   ├── Pages
│   ├── Components
│   ├── Application Logic
│   └── User Interface
│
├── Electron.js
│   ├── Main Process
│   ├── BrowserWindow
│   └── Preload Script
│
└── Supabase
    ├── Database
    └── Backend Services
```

Next.js is responsible for building the application interface.

Electron.js provides the desktop environment in which the Next.js application runs.

Supabase will be integrated as the backend and database layer during the workshop.

---

## Current Project Structure

```text
grovio/
│
├── app/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
│
├── components/
│
├── electron/
│   ├── main.js
│   └── preload.js
│
├── public/
│
├── package.json
├── package-lock.json
└── README.md
```

The project structure will continue to evolve as new features are introduced during the workshop.

---

## Prerequisites

Before starting, ensure the following software is installed:

![VS Code](https://img.shields.io/badge/VS_Code-Required-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white)
![Git](https://img.shields.io/badge/Git-Required-F05032?style=flat-square&logo=git&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20.9%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white)

Verify Node.js and npm:

```bash
node -v
npm -v
```

Verify Git:

```bash
git --version
```

---

## Clone the Repository

Clone the public workshop repository:

```bash
git clone https://github.com/KshitijSawant1/ElectronJS-Workshop-NirmalaCollege-2026.git
```

Enter the repository:

```bash
cd ElectronJS-Workshop-NirmalaCollege-2026
```

Open the repository in Visual Studio Code:

```bash
code .
```

---

## Enter the Grovio Project

Move into the Grovio application:

```bash
cd grovio
```

---

## Install Dependencies

Install all dependencies defined in `package.json`:

```bash
npm install
```

The Electron development environment uses the following development packages:

```bash
npm install --save-dev electron concurrently wait-on
```

### Development Packages

| Package | Purpose |
|---|---|
| `electron` | Runs Grovio as a desktop application |
| `concurrently` | Runs Next.js and Electron together |
| `wait-on` | Waits for the Next.js server before Electron starts |

---

## Run Grovio

Start the complete development environment:

```bash
npm run dev
```

The development process is:

```text
npm run dev
     |
     v
Next.js Development Server
     |
     v
http://localhost:3000
     |
     v
wait-on
     |
     v
Electron
     |
     v
Grovio Desktop Application
```

One command starts both the Next.js development server and the Electron desktop application.

---

## Electron Configuration

### Main Process

The Electron main process is located at:

```text
electron/main.js
```

It creates the Grovio desktop window and loads the Next.js application.

```javascript
const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL("http://localhost:3000");
}

app.whenReady().then(createWindow);
```

---

### Preload Script

The preload script is located at:

```text
electron/preload.js
```

It provides a controlled bridge between Electron and the application interface.

```javascript
const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  version: process.versions.electron,
});
```

---

## Package Configuration

The Electron entry point in `package.json` is:

```json
"main": "electron/main.js"
```

The development script is:

```json
"dev": "concurrently \"next dev\" \"wait-on http://localhost:3000 && electron .\""
```

This allows the complete development environment to start using:

```bash
npm run dev
```

---

## Workshop Progress

| Session | Topics | Status |
|:---:|---|:---:|
| Session 01 | Setup, GitHub and Next.js Project Setup | ![Completed](https://img.shields.io/badge/Completed-success?style=flat-square) |
| Session 02 | Electron Setup, Main Process and Preload Script | ![In Progress](https://img.shields.io/badge/In_Progress-yellow?style=flat-square) |
| Session 03 | Grovio Development and Integration | ![Upcoming](https://img.shields.io/badge/Upcoming-lightgrey?style=flat-square) |

The progress table will be updated after every workshop session.

---

## Updating the Workshop Project

If the repository has already been cloned, **do not clone it again**.

Before the next workshop session, open the repository and run:

```bash
git pull origin main
```

Then enter the Grovio project:

```bash
cd grovio
```

Install any newly added dependencies:

```bash
npm install
```

Start the project:

```bash
npm run dev
```

### Standard Update Workflow

```bash
git pull origin main
cd grovio
npm install
npm run dev
```

---

## Essential Git Commands

### Clone the Repository

```bash
git clone https://github.com/KshitijSawant1/ElectronJS-Workshop-NirmalaCollege-2026.git
```

### Check Repository Status

```bash
git status
```

### Pull Latest Workshop Updates

```bash
git pull origin main
```

### Open the Repository in VS Code

```bash
code .
```

---

## Workshop Documentation

Workshop documentation will be progressively maintained for:

- Setup and Prerequisites
- GitHub Repository Workflow
- Creating the Grovio Project
- Next.js Project Setup
- Electron.js Integration
- `main.js`
- `preload.js`
- `package.json`
- Grovio UI Development
- Supabase Integration
- Application Development
- Final Project Integration

---

## Repository Update Policy

![Update Policy](https://img.shields.io/badge/Update_Policy-After_Every_Session-blue?style=flat-square)

The `main` branch contains the latest workshop version of Grovio.

After each workshop session, the repository may be updated with:

- Source code developed during the session
- New Grovio features
- UI components
- Electron configuration changes
- New dependencies
- Examples
- Workshop documentation
- Bug fixes and improvements

Students should pull the latest version before beginning the next session:

```bash
git pull origin main
```

---

## Troubleshooting

### Node.js or npm is not detected

Check:

```bash
node -v
npm -v
```

If the commands are not available, verify the Node.js installation and restart the terminal.

### Dependencies are missing

Run:

```bash
npm install
```

### Electron does not start

First verify that Next.js starts correctly:

```bash
npx next dev
```

Check:

```text
http://localhost:3000
```

Then stop the server and run the complete development environment:

```bash
npm run dev
```

### Local Repository is Outdated

Run:

```bash
git pull origin main
```

Then:

```bash
cd grovio
npm install
npm run dev
```

---

## Repository

[![GitHub Repository](https://img.shields.io/badge/GitHub-Workshop_Repository-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/KshitijSawant1/ElectronJS-Workshop-NirmalaCollege-2026)

**Electron.js Workshop — Nirmala College 2026**

---

<div align="center">

### CLYXN × SORXN

**Electron.js Workshop — Nirmala College 2026**

![Electron.js](https://img.shields.io/badge/Built_with-Electron.js-47848F?style=flat-square&logo=electron&logoColor=white)
![Next.js](https://img.shields.io/badge/Powered_by-Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)

**Learn. Build. Ship.**

</div>