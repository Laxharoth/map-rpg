export class ArrayTree<T> {
  root: tree_node<T>;
  constructor(root: tree_node<T>) { this.root = root; }

  get_node(path: number[]): tree_node<T> {
    let travel_node = this.root;
    if (!travel_node)
      return null;
    for (const path_index of path) {
      travel_node = travel_node.children[path_index];
      if (!travel_node)
        return null;
    }
    return travel_node;
  }
  get_children(path: number[]): tree_node<T>[] {
    const node = this.get_node(path);
    if (!node || !node.children)
    return [];
    return node.children;
  }
}

export type tree_node<T> = {
  value: T;
  children: tree_node<T>[];
};
