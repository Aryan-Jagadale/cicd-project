// textNode.js

import React, { useRef, useState, useEffect } from "react";
import { withNodeWrapper } from "../commonComponents/AbstractNode.js";
import { Handle, Position } from "reactflow";
import Input from "../commonComponents/Input.js";
import CancelIcon from '@mui/icons-material/Cancel';
import { Tooltip } from "@mui/material";

const TextNodeComponent = ({ id, data, onChange,onClick }) => {
  const [nodeWidth, setNodeWidth] = useState(200); 
  const [nodeHeight, setNodeHeight] = useState(25);
  const textRef = useRef(null);
  const [handles, setHandles] = useState([]);

  const handleTextChange = (e) => {
    onChange("text", e.target.value);
  };
  useEffect(() => {
    if (textRef.current) {
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      const textWidth = context.measureText(data?.text || "").width;
      const textHeight = 16;
      setNodeWidth(Math.max(150, textWidth + 20));
      setNodeHeight(Math.min(35, textHeight + 30)); 
    }
  }, [data?.text]);

  useEffect(() => {
    const variablePattern = /\{\{\s*(\w+)\s*\}\}/g;
    const variables = [];
    let match;
    while ((match = variablePattern.exec(data?.text || "")) !== null) {
      variables.push(match[1]);
    }
    setHandles(variables);
  }, [data?.text]);

  return (
    <div className="wrapper-node">
      <div className="header-node">
        <span>Text</span>
        <Tooltip title={"Remove"} placement="right" arrow>
          <CancelIcon onClick={onClick} />
        </Tooltip>
      </div>
      <div
        className="form-node">
       
        <Input
          labelName={"Name"}
          data={data}
          id={id}
          outputName={data?.text}
          onChange={handleTextChange}
          style={{ width: `${nodeWidth}px`, height: `${nodeHeight}px` }}
          placeholder={"{{input}}"}
          ref={textRef}
        />
      </div>
      {handles.map((handle, index) => (
        <Handle
          key={`${handle}-${index}`}
          type="target"
          position={Position.Left}
          id={`handle-${handle}`}
          style={{
            top: `${(index + 1) * (90 / (handles.length + 1))}px`,
          }}
        />
      ))}
    </div>
  );
};

export const TextNode = withNodeWrapper(TextNodeComponent, { text: "" }, [
  { type: "source", position: Position.Right, id: "output" },
]);
