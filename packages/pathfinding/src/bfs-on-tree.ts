type TreeNode = {
  name: string;
  children?: TreeNode[]
}

const exampleTree: TreeNode[] = [
  {
    name: 'A',
    children: [
      {
        name: 'B',
        children: [
          {
            name: 'D',
            children: [
              { name: 'I', children: [ { name: 'N' } ] },
              { name: 'J' },
            ]
          },
          { name: 'E' },
          { name: 'F', children: [ { name: 'K', children: [ { name: 'O' }, { name: 'P', children: [ { name: 'R' } ] } ] }] }
        ]
      },
      {
        name: 'C',
        children: [
          { name: 'G', children: [ { name: 'L' }, { name: 'M' } ] },
          { name: 'H' },
        ]
      }
    ]
  }
];

class BfsOnTree {
  public result: TreeNode[] = [];
  public paths: string[] = [];
  public target!: string;

  constructor(private tree: TreeNode[]) {
  }

  /**
   * Returns true if result found, false if not.
   *
   * @param node
   * @private
   */
  private visit(node: TreeNode): boolean {
    console.log(node.name);
    return node.name === this.target;
  }

  public search(target: string) {
    this.target = target;

    const rootNode = this.tree[0];
    const queue: TreeNode[] = [rootNode];

    while(queue.length > 0) {
      const node = queue.shift();
      if (!node) {
        break;
      }

      const resultFound = this.visit(node);

      if (resultFound) {
        break;
      }

      // Add children to queue.
      if ('children' in node && typeof node.children !== 'undefined') {
        (node.children as TreeNode[]).forEach((node) => queue.push(node));
      }
    }


  }
}


const bfs = new BfsOnTree(exampleTree);
bfs.search('D');
