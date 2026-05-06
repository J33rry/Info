# Tree View Visualizer

A high-performance, interactive, and dual-mode tree visualizer built with React Flow. 

## Features

- **Dual-Mode Visualization:**
  - **Tree Mode:** A clean, hierarchical dagre-based layout for structured data viewing.
  - **Gource Mode:** A dynamic, physics-driven force simulation using `d3-force`. Features glowing circular nodes, organic movement, and depth-based radial attraction.
- **Interactive Tree Management:**
  - Full CRUD support: Add (+), Delete (×), and inline Rename (Double-click) nodes.
  - Expand and collapse tree branches.
- **Search & Highlight:** Search for specific nodes and see them highlighted in real-time.
- **Keyboard Shortcuts:**
  - <kbd>Space</kbd>: Center the tree view.
  - <kbd>Shift</kbd> + <kbd>E</kbd>: Expand all nodes.
  - <kbd>Shift</kbd> + <kbd>C</kbd>: Collapse all nodes.
- **Polished UI/UX:** Dark mode glassmorphism design, smooth CSS transitions, and an action-on-hover approach to reduce interface clutter.

## Tech Stack

- **Framework:** React 19 + Vite
- **Graphing & Nodes:** `@xyflow/react`
- **Layout Engines:** `@dagrejs/dagre` (Tree mode), `d3-force` (Gource mode)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:
- **Node.js** (v18 or higher recommended)
- **npm** (usually comes with Node.js)

## Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd tree-view
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Running the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open the app:**
   Open your browser and navigate to `http://localhost:5173/` to interact with the visualizer.

## Building for Production

If you want to build the app for production, run:
```bash
npm run build
```
The optimized production build will be generated in the `dist` folder. You can preview it using:
```bash
npm run preview
```
