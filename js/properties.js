"use strict";

var initial_max_grid_size = 47;
var menu_width = 323;

var cell_size;
var grid_size_x;
var grid_size_y;
var grid;
var weights;
var cell_cache;
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

var generating = false;
var timeouts = [];
var visualization_speed = 50;
var is_mobile = false;

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
