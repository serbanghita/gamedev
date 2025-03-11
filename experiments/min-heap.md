In a min heap, nodes are stored in a flat array in such a way that the heap properties are maintained. The key to this structure is the relationship between the parent and child nodes, which can be determined using simple mathematical formulas.

Here’s how the nodes are stored and how the relationships are managed:

### Storing Nodes
Nodes in a min heap are stored in a single array, with the root node at index 0. For a node at index `i`:
- The parent node is at index `Math.floor((i - 1) / 2)`.
- The left child node is at index `2 * i + 1`.
- The right child node is at index `2 * i + 2`.

### Example
Consider the following min heap:

```
       1
     /   \
    3     5
   / \   / \
  7   9 8  10
```

This heap can be stored in an array as:
`[1, 3, 5, 7, 9, 8, 10]`

Here’s how each node relates to its parent and children:

1. Node `1` (index 0): 
   - Parent: none (root node)
   - Left child: index `1` (3)
   - Right child: index `2` (5)

2. Node `3` (index 1):
   - Parent: index `0` (1)
   - Left child: index `3` (7)
   - Right child: index `4` (9)

3. Node `5` (index 2):
   - Parent: index `0` (1)
   - Left child: index `5` (8)
   - Right child: index `6` (10)

### Visualizing the Array Representation
```
Index:  0  1  2  3  4  5  6
Value: [1, 3, 5, 7, 9, 8, 10]
```

### Key Operations
- **Insertion:** When adding a new element to the heap, it's placed at the end of the array. Then, it is "bubbled up" to its correct position to maintain the heap property.
- **Deletion:** When removing the minimum element (root) from the heap, the last element in the array is moved to the root position. Then, it is "bubbled down" to maintain the heap property.

This structure allows for efficient heap operations while using minimal space.

I hope this helps clarify how nodes are stored in a min heap using a flat array! 😊 Feel free to ask more questions if you have any!