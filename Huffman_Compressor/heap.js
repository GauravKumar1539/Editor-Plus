export { BinaryHeap };

class BinaryHeap {
  constructor() {
    this.heap = [];
  }
  // insert the value and then heapify
  insert(value) {
    this.heap.push(value);
    this.bubbleUp();
  }
  size() {
    return this.heap.length;
  }
  empty() {
    return this.size() === 0;
  }
  // arrange the array into heap order
  heapify() {
    let index = this.size() - 1;

    while (index > 0) {
        let element = this.heap[index];
        // find parentIndex and then parent
        let parentIndex = Math.floor((index - 1) / 2);
        parent = this.heap[parentIndex];

        // compare with parent and swap
      if (parent[0] >= element[0]) break;
      this.heap[index] = parent;
      this.heap[parentIndex] = element;
      index = parentIndex;
    }
  }
  // remove the max Element from the heap
  extractMax() {
    const max = this.heap[0];
    const tmp = this.heap.pop();
    if (!this.empty()) {
      this.heap[0] = tmp;
      this.deheapify(0);
    }
    return max;
  }
// down heapify
  deheapify(index) {
    let left = 2 * index + 1,
      right = 2 * index + 2,
      largest = index;
    const length = this.size();

    // console.log(this.heap[left], left, length, this.heap[right], right, length, this.heap[largest]);

    if (left < length && this.heap[left][0] > this.heap[largest][0]) {
      largest = left;
    }
    if (right < length && this.heap[right][0] > this.heap[largest][0]) {
      largest = right;
    }
    // swap
    if (largest !== index) {
      let tmp = this.heap[largest];
      this.heap[largest] = this.heap[index];
      this.heap[index] = tmp;
      this.deheapify(largest);
    }
  }
}
