import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import TreeFlow from './components/TreeFlow';

function App() {
  return (
    <ReactFlowProvider>
      <TreeFlow />
    </ReactFlowProvider>
  );
}

export default App;
