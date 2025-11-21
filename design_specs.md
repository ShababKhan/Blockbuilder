# UX/UI Design Specs

## 1. User Flow: Creating & Defining a Node

1.  **Drag & Drop**: User drags a "Generic Node" block from the sidebar onto the infinite canvas.
2.  **Initialization**: The node appears with a default name (e.g., "New Task") and a neutral color (Gray/Blue).
3.  **Configuration**:
    *   User double-clicks the node.
    *   A **Modal** opens, overlaying the canvas.
    *   The modal has a large header to rename the node.
4.  **The 3-Tab Workflow**:
    *   **Tab 1: Describe (Natural Language)**: User types what they want to happen. *Focus: Intent.*
    *   **Tab 2: Logic (Pseudocode)**: User breaks it down into steps. *Focus: Structure.*
    *   **Tab 3: Code (Python)**: User writes the actual code. The editor provides a template function `def run(input_path, output_path):`. *Focus: Implementation.*
5.  **Save**: User clicks "Done". The node on the canvas updates (e.g., turns Green to indicate it's configured).
6.  **Connect**: User draws a line from a previous node to this one to establish the file dependency.

## 2. Visual Guide: "Simple & Accessible" (The Scratch Aesthetic)

The goal is to make programming feel like building with toy blocks.

### Color Palette
*   **Canvas Background**: `#F0F4F8` (Soft Cloud Blue) - Easy on the eyes, not stark white.
*   **Node Backgrounds**:
    *   *Input/Source Nodes*: `#FFAB91` (Soft Orange)
    *   *Processing Nodes*: `#81D4FA` (Soft Blue)
    *   *Output/Save Nodes*: `#A5D6A7` (Soft Green)
    *   *Selected Node*: Thick border `#FFD600` (Yellow)
*   **Text**: `#37474F` (Dark Blue-Grey) - High contrast but softer than pure black.

### Typography
*   **Font Family**: 'Nunito', 'Quicksand', or 'Comic Neue' (Rounded sans-serifs).
*   **Sizes**:
    *   Node Titles: 16px, Bold.
    *   Body Text: 14px.

### Component Styling
*   **Nodes**:
    *   `border-radius: 12px` (Chunky rounded corners).
    *   `box-shadow: 4px 4px 0px rgba(0,0,0,0.1)` (Hard shadow for "physical" block feel).
    *   `border: 2px solid rgba(0,0,0,0.1)` (Subtle outline).
*   **Connections (Edges)**:
    *   Thick lines (stroke-width: 4px).
    *   Animated dash flow when executing.
*   **Modal**:
    *   Clean white card centered on screen.
    *   Large, pill-shaped tabs for navigation.
    *   "Run" button is a big green circle with a "Play" icon.
