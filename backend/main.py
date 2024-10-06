from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from graph import graph_to_json, create_import_graph

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/hello")
async def hello():
    return {"message": "Hello from FastAPI!"}

@app.get("/api/import-graph")
async def import_graph(path: str):
	graph = create_import_graph(path)
	return graph_to_json(graph)

# Mount the React app
app.mount("/", StaticFiles(directory="../frontend/dist", html=True), name="frontend")
