import React, { useState, useEffect, useMemo } from "react";
import ForceGraph2D, { GraphData, NodeObject, LinkObject } from "react-force-graph-2d";
import SearchBar from "./SearchBar";

interface ImportGraphProps {
  filePath: string;
}

interface CustomNodeObject extends NodeObject {
  id: string;
  label: string;
  imports: string[];
  imported_by: string[];
}

interface CustomLinkObject extends LinkObject {
  source: CustomNodeObject | string;
  target: CustomNodeObject | string;
}

interface CustomGraphData extends GraphData {
  nodes: CustomNodeObject[];
  links: CustomLinkObject[];
}

export default function ImportGraph({ filePath }: ImportGraphProps) {
  const [graphData, setGraphData] = useState<CustomGraphData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedNode, setSelectedNode] = useState<CustomNodeObject | null>(null);
  const [searchedNode, setSearchedNode] = useState<string>("");
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
      // console.log(JSON.stringify(result))
      setLoading(false);
    } catch (error) {
      console.error('Error fetching graph data:', error);
    }
  }

  const filteredGraphData = useMemo(() => {
    if (!graphData || !searchedNode) return graphData;

    const matchingNodes = graphData.nodes.filter(node => 
      typeof node.id ==='string' && node.id.toLowerCase().startsWith(searchedNode.toLowerCase())
    );

    const connectedNodeIds = new Set<string>();
    matchingNodes.forEach(node => {
      connectedNodeIds.add(node.id as string);
      node.imports.forEach((importId: string) => connectedNodeIds.add(importId));
      node.imported_by.forEach((importedById: string) => connectedNodeIds.add(importedById));
    });

    const filteredNodes = graphData.nodes.filter(node => 
      connectedNodeIds.has(node.id as string)
    );
    const filteredLinks = graphData.links.filter(link => {
      const source = link.source as CustomNodeObject
      const target = link.target as CustomNodeObject
      return connectedNodeIds.has(source.id) && connectedNodeIds.has(target.id)
    });

    return { nodes: filteredNodes, links: filteredLinks };
  }, [graphData, searchedNode]);

  const handleNodeClick = (node: CustomNodeObject) => {
    setSelectedNode(node);
    console.log(node);
  };

  const nodeCanvasObject = (node: NodeObject, ctx: CanvasRenderingContext2D) => {
    const label = node.label as string;
    ctx.font = `4px Sans-Serif`;

    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(node.x!, node.y!, 4, 0, 2 * Math.PI, false);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.fillText(label, node.x!, node.y! + 7);
  };

  const handleDataFromSearch = (childData: string) => {
    setSearchedNode(childData);
  };

  return (
    <div>
      {loading ? (
        <span>loading...</span>
      ) : (
        <div>
          <ForceGraph2D
            graphData={filteredGraphData as CustomGraphData}
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
          <SearchBar onInputUpdate={handleDataFromSearch} />
        </div>
      )}
    </div>
  );
}