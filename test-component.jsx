import React from "react";

const TestComponent = () => {
  const unusedVariable = "this will trigger eslint";
  let x = 1;
  x = x + 1;

  return (
    <div>
      <h1>Test</h1>
    </div>
  );
};

// Missing export default
