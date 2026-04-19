# XLS.studio – Architecture

This document describes the internal architecture of the project.

The goal is to keep the codebase **modular, maintainable, and scalable** while supporting interactive 3D content.

---

# 1. Architecture Overview

The application follows a **component-driven architecture** combined with **custom React hooks** for system logic.

Main principles:

• Separation of concerns
• Isolated rendering systems
• Reusable UI components
• Performance-aware rendering

---

# 2. Rendering System

The application renders **two main layers**:

### Layer 1 — 3D Canvas

The Spline scene is rendered inside a fixed `<canvas>` element.

Responsibilities:

• Load Spline scene
• Manage device pixel ratio
• Monitor performance
• Adjust rendering resolution dynamically

This logic is isolated in:

useSplineScene()

This prevents UI components from being coupled to the 3D engine.

---

### Layer 2 — UI Sections

The user interface is built as vertical sections.

Scrolling transitions are handled by:

useSectionScroll()

Responsibilities:

• Detect wheel events
• Control page section state
• Synchronize Spline variables with UI navigation

Example:

Section 0 → Welcome
Section 1 → Knowledge
Section 2 → Sandbox

Each section corresponds to a **Spline variable state**.

---

# 3. Scroll Navigation System

Instead of default page scrolling, navigation uses a **controlled section system**.

Process:

1. User scrolls
2. Wheel event is captured
3. Section index updates
4. UI transforms vertically
5. Spline variable updates

Result:

Smooth synchronized UI + 3D transitions.

---

# 4. Performance System

The application includes a **dynamic performance monitor**.

Purpose:

Adapt rendering quality depending on device performance.

Metrics tracked:

• FPS
• frame time

Behavior:

Low FPS → reduce canvas DPR
High FPS → increase canvas DPR

Limits:

Minimum DPR: 0.8
Maximum DPR: 1.5

This ensures stable performance across devices.

---

# 5. Animation Control

Animations can be disabled through the interface.

When disabled:

• Spline rendering stops
• scroll transitions are disabled
• canvas DPR is reduced

This improves accessibility and low-power device performance.

---

# 6. Accessibility

The application respects the system preference:

prefers-reduced-motion

If detected:

Animations are automatically disabled.

---

# 7. Deployment Architecture

Deployment uses **GitHub Pages**.

Build pipeline:

Source → Vite build → dist/ → GitHub Pages

Important configuration:

vite.config.ts

base: "/XLS.studio/"

This ensures correct asset loading on GitHub Pages.

---

# 8. Future Architectural Improvements

Planned improvements include:

• global animation manager
• project data API
• dynamic content loading
• GPU performance detection
• progressive rendering system

---

# 9. Design Philosophy

The architecture is designed around three principles:

**Clarity**
Each system has a single responsibility.

**Performance**
Rendering cost is monitored and adapted.

**Scalability**
The structure allows easy addition of new sections and tools.

---

XLS.studio explores the intersection between **cognitive science, system design, and interactive environments**.
