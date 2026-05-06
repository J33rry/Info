/**
 * Hierarchical tree data for the visualizer.
 * Each node: { id, label, metadata, children[] }
 * Matches the task spec screenshots: Root with multiple children, 4-5 levels deep.
 */
const treeData = {
  id: 'root',
  label: 'Root',
  metadata: { type: 'Organization', description: 'Top-level root node' },
  children: [
    {
      id: 'child-1',
      label: 'Child 1',
      metadata: { type: 'Department', description: 'First department' },
      children: [
        {
          id: 'child-1-1',
          label: 'New Node',
          metadata: { type: 'Team', description: 'Alpha team' },
          children: [
            {
              id: 'child-1-1-1',
              label: 'New Node',
              metadata: { type: 'Member', description: 'Individual contributor' },
              children: [],
            },
            {
              id: 'child-1-1-2',
              label: 'New Node',
              metadata: { type: 'Member', description: 'Individual contributor' },
              children: [],
            },
          ],
        },
        {
          id: 'child-1-2',
          label: 'New Node',
          metadata: { type: 'Team', description: 'Beta team' },
          children: [
            {
              id: 'child-1-2-1',
              label: 'New Node',
              metadata: { type: 'Member', description: 'Individual contributor' },
              children: [],
            },
          ],
        },
        {
          id: 'child-1-3',
          label: 'New Node',
          metadata: { type: 'Team', description: 'Gamma team' },
          children: [],
        },
      ],
    },
    {
      id: 'child-2',
      label: 'Child 2',
      metadata: { type: 'Department', description: 'Second department' },
      children: [
        {
          id: 'child-2-1',
          label: 'New Node',
          metadata: { type: 'Team', description: 'Delta team' },
          children: [
            {
              id: 'child-2-1-1',
              label: 'New Node',
              metadata: { type: 'Member', description: 'Individual contributor' },
              children: [],
            },
            {
              id: 'child-2-1-2',
              label: 'New Node',
              metadata: { type: 'Member', description: 'Individual contributor' },
              children: [],
            },
            {
              id: 'child-2-1-3',
              label: 'New Node',
              metadata: { type: 'Member', description: 'Individual contributor' },
              children: [],
            },
          ],
        },
        {
          id: 'child-2-2',
          label: 'New Node',
          metadata: { type: 'Team', description: 'Epsilon team' },
          children: [
            {
              id: 'child-2-2-1',
              label: 'New Node',
              metadata: { type: 'Member', description: 'Individual contributor' },
              children: [],
            },
          ],
        },
        {
          id: 'child-2-3',
          label: 'New Node',
          metadata: { type: 'Team', description: 'Zeta team' },
          children: [],
        },
      ],
    },
    {
      id: 'child-3',
      label: 'New Node',
      metadata: { type: 'Department', description: 'Third department' },
      children: [
        {
          id: 'child-3-1',
          label: 'New Node',
          metadata: { type: 'Team', description: 'Eta team' },
          children: [],
        },
        {
          id: 'child-3-2',
          label: 'New Node',
          metadata: { type: 'Team', description: 'Theta team' },
          children: [
            {
              id: 'child-3-2-1',
              label: 'New Node',
              metadata: { type: 'Member', description: 'Individual contributor' },
              children: [],
            },
            {
              id: 'child-3-2-2',
              label: 'New Node',
              metadata: { type: 'Member', description: 'Individual contributor' },
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: 'child-4',
      label: 'New Node',
      metadata: { type: 'Department', description: 'Fourth department' },
      children: [],
    },
    {
      id: 'child-5',
      label: 'New Node',
      metadata: { type: 'Department', description: 'Fifth department' },
      children: [],
    },
    {
      id: 'child-6',
      label: 'New Node',
      metadata: { type: 'Department', description: 'Sixth department' },
      children: [],
    },
  ],
};

export default treeData;
