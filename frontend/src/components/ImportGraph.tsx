import { useState, useEffect} from "react";
import ForceGraph2D, { GraphData, NodeObject } from "react-force-graph-2d";
import TestData from "../TestData.json";

export default function ImportGraph({ filePath }: { filePath: string }) {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<NodeObject | null>(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    // Clean up the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchGraphData();
  }, []);

  async function fetchGraphData() {
    try {
      const response = await fetch(`/api/import-graph?path=${filePath}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setGraphData(result);
      console.log(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  }

  const handleNodeClick = (node: NodeObject) => {
    setSelectedNode(node);
    console.log(node);
  };

  const nodeCanvasObject = (node: NodeObject, ctx: CanvasRenderingContext2D) => {
    const label = node.label as string;
    ctx.font = `4px Sans-Serif`;

    // Node circle
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, 4, 0, 2 * Math.PI, false);
    ctx.fill();

    // Label text
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.fillText(label, node.x!, node.y! + 7);
  };

  return (
    <div>
      {loading ?
        <span>loading...</span> :
        <ForceGraph2D
          graphData={graphData as GraphData}
          nodeColor={() => "white"}
          linkDirectionalArrowLength={3.5}
          linkCurvature={0}
          linkColor={() => "pink"}
          onNodeClick={handleNodeClick}
          nodeCanvasObject={nodeCanvasObject}
          warmupTicks={100}
          cooldownTicks={0}
          cooldownTime={1000}
          width={windowSize.width}
          height={windowSize.height}
        />
     }
    </div>
  )
}