export class ArrayTree<T> {
  root: tree_node<T>;
  constructor(root: tree_node<T>) { this.root = root; }

  getNode(path: number[]): tree_node<T> | null {
    let travelNode = this.root;
    if (!travelNode)
      return null;
    for (const pathIndex of path) {
      travelNode = travelNode.children[pathIndex];
      if (!travelNode)
        return null;
    }
    return travelNode;
  }
  get_children(path: number[]): tree_node<T>[] {
    const node = this.getNode(path);
    if (!node || !node.children)
    return [];
    return node.children;
  }
}

export type tree_node<T> = {
  value: T;
  children: tree_node<T>[];
};
