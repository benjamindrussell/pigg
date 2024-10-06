import { useState, useEffect } from "react";
import ForceGraph2D, { GraphData, NodeObject } from "react-force-graph-2d";
import TestData from "../TestData.json";

export default function ImportGraph({ filePath }: { filePath: string }) {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<NodeObject | null>(null);

  useEffect(() => {
    // fetchGraphData();
    console.log(graphData);
    fetchGraphData();
  }, [filePath]);

  async function fetchGraphData() {
    try {
      const response = await fetch(`/api/import-graph?path=${filePath}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      // console.log(JSON.stringify(result))
      setGraphData(result);
      // setGraphData(TestData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  }

  const handleNodeClick = (node: NodeObject) => {
    setSelectedNode(node);
  };

  return (
    <div>
      {loading ?
        <span>loading...</span> :
        <ForceGraph2D
          graphData={graphData as GraphData}
          nodeLabel="label"
          nodeAutoColorBy="id"
          linkDirectionalArrowLength={3.5}
          linkDirectionalArrowRelPos={1}
          linkCurvature={0}
          onNodeClick={handleNodeClick}
        />
     }
    </div>
  )
}