import sys
import os
import subprocess
import tempfile
import json
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ExecuteRequest(BaseModel):
    nodeId: str
    script: str
    inputPath: str
    outputPath: str

class SaveRequest(BaseModel):
    name: str
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/save-workflow")
def save_workflow(req: SaveRequest):
    """
    Saves the workflow as a directory containing:
    - workflow.json (the graph structure)
    - src/ (individual python scripts for each node)
    """
    try:
        # Define base path for saved workflows
        base_path = os.path.join(os.getcwd(), "saved_workflows")
        workflow_path = os.path.join(base_path, req.name)
        src_path = os.path.join(workflow_path, "src")

        # Create directories
        os.makedirs(src_path, exist_ok=True)

        # 1. Save workflow.json
        workflow_data = {
            "name": req.name,
            "nodes": req.nodes,
            "edges": req.edges
        }
        with open(os.path.join(workflow_path, "workflow.json"), "w") as f:
            json.dump(workflow_data, f, indent=2)

        # 2. Save individual Python scripts
        for node in req.nodes:
            node_id = node.get("id")
            script = node.get("data", {}).get("config", {}).get("pythonScript", "")
            
            if script:
                script_filename = f"{node_id}.py"
                with open(os.path.join(src_path, script_filename), "w") as f:
                    f.write(script)

        return {
            "status": "success",
            "message": f"Workflow saved to {workflow_path}",
            "path": workflow_path
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/execute-node")
def execute_node(req: ExecuteRequest):
    """
    Executes the provided Python script.
    The script is expected to define a function: def run(input_path, output_path):
    """
    
    # 1. Create a temporary wrapper script
    # We append code to call the user's 'run' function with the provided paths.
    wrapper_code = f"""
import sys
import os

# User Code Start
{req.script}
# User Code End

if __name__ == "__main__":
    try:
        # Ensure output directory exists
        output_dir = os.path.dirname(r"{req.outputPath}")
        if output_dir and not os.path.exists(output_dir):
            os.makedirs(output_dir)
            
        # Call the user's run function
        run(r"{req.inputPath}", r"{req.outputPath}")
        print("Execution successful")
    except Exception as e:
        print(f"Error: {{e}}", file=sys.stderr)
        sys.exit(1)
"""

    try:
        # Write to a temp file
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as tmp:
            tmp.write(wrapper_code)
            tmp_path = tmp.name

        # 2. Execute the script
        result = subprocess.run(
            [sys.executable, tmp_path],
            capture_output=True,
            text=True
        )

        # Cleanup
        os.remove(tmp_path)

        if result.returncode == 0:
            return {
                "status": "success",
                "logs": result.stdout,
                "error": None
            }
        else:
            return {
                "status": "error",
                "logs": result.stdout,
                "error": result.stderr
            }

    except Exception as e:
        return {
            "status": "error",
            "logs": "",
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
