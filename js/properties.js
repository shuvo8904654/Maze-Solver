"use strict";

var initial_max_grid_size = 47;
var menu_width = 323;

var cell_size;
var grid_size_x;
var grid_size_y;
var grid;
var weights;
var cell_cache;
var current_tool = "wall";
var clicking = false;
var moving_start = false;
var moving_target = false;
var start_pos;
var target_pos;
var grid_clean = true;
var my_interval;

var node_list;
var node_list_index;
var path_list;
var path_list_index;
var found = false;
var path = false;
var total_cost = 0;

var generating = false;
var timeouts = [];
var visualization_speed = 50;
var is_mobile = false;

function MinHeap(compareFn) {
    this.data = [];
    this.compare = compareFn;
}

MinHeap.prototype.size = function () {
    return this.data.length;
};

MinHeap.prototype.push = function (val) {
    this.data.push(val);
    this._bubbleUp(this.data.length - 1);
};

MinHeap.prototype.pop = function () {
    var top = this.data[0];
    var bottom = this.data.pop();
    if (this.data.length > 0) {
        this.data[0] = bottom;
        this._sinkDown(0);
    }
    return top;
};

MinHeap.prototype.peek = function () {
    return this.data[0];
};

MinHeap.prototype._bubbleUp = function (idx) {
    var element = this.data[idx];
    while (idx > 0) {
        var parentIdx = Math.floor((idx - 1) / 2);
        var parent = this.data[parentIdx];
        if (this.compare(element, parent) >= 0) break;
        this.data[idx] = parent;
        idx = parentIdx;
    }
    this.data[idx] = element;
};

MinHeap.prototype._sinkDown = function (idx) {
    var length = this.data.length;
    var element = this.data[idx];

    while (true) {
        var leftIdx = 2 * idx + 1;
        var rightIdx = 2 * idx + 2;
        var smallest = idx;

        if (leftIdx < length && this.compare(this.data[leftIdx], this.data[smallest]) < 0) {
            smallest = leftIdx;
        }
        if (rightIdx < length && this.compare(this.data[rightIdx], this.data[smallest]) < 0) {
            smallest = rightIdx;
        }
        if (smallest === idx) break;

        this.data[idx] = this.data[smallest];
        this.data[smallest] = element;
        idx = smallest;
    }
};

function UnionFind(size) {
    this.parent = new Array(size);
    this.rank = new Array(size);
    this.count = size;
    for (var i = 0; i < size; i++) {
        this.parent[i] = i;
        this.rank[i] = 0;
    }
}

UnionFind.prototype.find = function (x) {
    while (this.parent[x] !== x) {
        this.parent[x] = this.parent[this.parent[x]];
        x = this.parent[x];
    }
    return x;
};

UnionFind.prototype.union = function (a, b) {
    var rootA = this.find(a);
    var rootB = this.find(b);
    if (rootA === rootB) return false;

    if (this.rank[rootA] < this.rank[rootB]) {
        this.parent[rootA] = rootB;
    } else if (this.rank[rootA] > this.rank[rootB]) {
        this.parent[rootB] = rootA;
    } else {
        this.parent[rootB] = rootA;
        this.rank[rootA]++;
    }
    this.count--;
    return true;
};

UnionFind.prototype.connected = function (a, b) {
    return this.find(a) === this.find(b);
};

function reconstruct_path(target, start) {
    var path_list = [];
    var current_node = target;

    while (current_node[0] !== start[0] || current_node[1] !== start[1]) {
        switch (grid[current_node[0]][current_node[1]]) {
            case 1: current_node = [current_node[0], current_node[1] + 1]; break;
            case 2: current_node = [current_node[0] - 1, current_node[1]]; break;
            case 3: current_node = [current_node[0], current_node[1] - 1]; break;
            case 4: current_node = [current_node[0] + 1, current_node[1]]; break;
            default: return path_list;
        }
        path_list.push(current_node);
    }

    path_list.pop();
    path_list.reverse();
    return path_list;
}

