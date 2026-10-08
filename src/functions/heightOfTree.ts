class TreeNode {
  val: number | string;
  children: TreeNode[];

  constructor(val: number | string, children: TreeNode[] = []) {
    this.val = val;
    this.children = children;
  }
}

function heightOfTree(root: TreeNode) {
  if (root == null) return 0;

  let maxHeight = 0;
  for (let tree of root.children) {
    maxHeight = Math.max(maxHeight, heightOfTree(tree));
  }
  return maxHeight + 1;
}

const root = new TreeNode('A', [
  new TreeNode('B', [new TreeNode('E')]),
  new TreeNode('C'),
  new TreeNode('D', [new TreeNode('F')]),
]);

console.log(heightOfTree(root)); // 3
