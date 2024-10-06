import os
import ast
import networkx as nx
from typing import List, Dict, Any

def parse_imports(file_path: str, package_root: str) -> List[str]:
    try:
        with open(file_path, "r") as file:
            tree: ast.AST = ast.parse(file.read())
        imports: List[str] = []
        relative_path: str = os.path.relpath(file_path, package_root)
        current_package: str = os.path.dirname(relative_path).replace(os.sep, ".")
        for node in ast.walk(tree):
            if isinstance(node, ast.Import):
                for alias in node.names:
                    imports.append(alias.name)
            elif isinstance(node, ast.ImportFrom):
                module: str = node.module if node.module else ""
                level: int = node.level
                if level > 0:  # This is a relative import
                    parts: List[str] = current_package.split(".")
                    if level > len(parts):
                        continue  # Invalid relative import
                    module = ".".join(parts[:-level] + ([module] if module else []))
                for alias in node.names:
                    full_name: str = f"{module}.{alias.name}" if module else alias.name
                    imports.append(full_name)
        print(imports)
        return imports
    except Exception as e:
        print(f"Error parsing {file_path}: {str(e)}")
        return []

def create_import_graph(directory: str) -> nx.DiGraph:
    G: nx.DiGraph = nx.DiGraph()
    
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.py'):
                file_path: str = os.path.join(root, file)
                relative_path: str = os.path.relpath(file_path, directory)
                imports: List[str] = parse_imports(file_path, directory)
                
                for import_name in imports:
                    G.add_edge(relative_path, import_name)
    return G

def graph_to_json(G: nx.DiGraph) -> Dict[str, Any]:
    node_data: Dict[str, Dict[str, Any]] = {}
    for node in G.nodes():
        imports: List[str] = list(G.successors(node))
        imported_by: List[str] = list(G.predecessors(node))
        node_data[node] = {
            "id": node,
            "label": node,
            "imports": imports,
            "imported_by": imported_by
        }
    
    return {
        "nodes": list(node_data.values()),
        "links": [{"source": u, "target": v} for (u, v) in G.edges()]
    }