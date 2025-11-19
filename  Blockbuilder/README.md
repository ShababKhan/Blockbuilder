# Workflow Builder Kit (POC)

🚧 **Work In Progress** 🚧

A "Project Foundation Kit" for a web-based workflow builder app that allows users to visually construct and execute Python workflows using a drag-and-drop interface.

## 🎯 Concept

The goal is to make Python scripting accessible through a "Simple & Accessible" visual interface, inspired by tools like Scratch and Blockly. Users can chain together nodes where each node represents a step in a process (e.g., Load Data -> Filter -> Save).

**Key Features:**
*   **Visual Canvas**: Drag-and-drop nodes to create dependencies.
*   **3-Tab Node Configuration**:
    1.  **Natural Language**: Describe the intent.
    2.  **Pseudocode**: Define the logic structure.
    3.  **Python Script**: Write the actual executable code.
*   **File Handoff**: Nodes communicate by passing file paths, not in-memory variables.
*   **Local Execution**: The backend runs Python scripts directly on the host machine.

## 🛠 Tech Stack

*   **Frontend**: React, React Flow
*   **Backend**: Python, FastAPI
*   **Style**: Custom CSS (Blocky, colorful aesthetic)

## 🚀 Getting Started

### Prerequisites
*   Node.js & npm
*   Python 3.8+

### 1. Start the Backend
The backend handles script execution and file saving.

```bash
cd backend
pip install -r requirements.txt
python main.py
```
*Server runs on `http://localhost:8000`*

### 2. Start the Frontend
The frontend provides the visual builder interface.

```bash
cd frontend
npm install
npm start
```
*App opens at `http://localhost:3000`*

## 📂 Project Structure

```
workflow-builder-kit/
├── backend/            # FastAPI server
│   ├── main.py         # API endpoints (/execute-node, /save-workflow)
│   └── saved_workflows/# Output directory for saved projects
├── frontend/           # React application
│   ├── src/
│   │   ├── components/ # Custom Node, Modal, Welcome Screen
│   │   └── App.jsx     # Main canvas logic
├── architecture.md     # High-level data model & API specs
└── design_specs.md     # UI/UX design guidelines
```

## 📝 Current Status

This project is currently a **Proof of Concept (POC)**.
- [x] Basic Canvas & Node Drag-and-Drop
- [x] 3-Tab Configuration Modal
- [x] Local Python Script Execution
- [x] Save Workflow to Disk
- [ ] Advanced Error Handling
- [ ] Node Library / Templates
- [ ] Complex Dependency Management

## 📄 License

[MIT](LICENSE)
