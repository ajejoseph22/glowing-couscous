import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import axios from "axios";

interface RawNodeDatum {
  name: string;
  attributes?: Record<string, string | number | boolean>;
  children?: RawNodeDatum[];
}

const Dashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [orgData, setOrgData] = useState<RawNodeDatum>({} as RawNodeDatum);

  useEffect(() => {
    (async () => {
      const data = (await axios.get("http://localhost:4000/dashboard")).data;
      setIsLoading(false);
      setOrgData(data as unknown as RawNodeDatum);
    })();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      id="tree-wrapper"
      style={{
        width: "80vw",
        height: "80vh",
        margin: "20px auto",
        border: "1px solid #c0c0c0",
      }}
    >
      <div>Tip: Click on a node to expand/collapse</div>
      <div>Tree is also zoomable and draggable</div>
      {/* todo: cast type to React component */}
      {/* @ts-ignore*/}
      <Tree
        data={orgData}
        orientation="vertical"
        pathFunc="step"
        zoom={1}
        initialDepth={1}
        translate={{ x: 590.7, y: 156.5 }}
        separation={{ siblings: 5, nonSiblings: 5 }}
      />
    </div>
  );
};

export default Dashboard;
