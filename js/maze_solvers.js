"use strict";

function distance(point_1, point_2) {
    return Math.sqrt(
        Math.pow(point_2[0] - point_1[0], 2) +
        Math.pow(point_2[1] - point_1[1], 2)
    );
}

function get_neighbours(cell, distance) {
    var up = [cell[0], cell[1] - distance];
    var right = [cell[0] + distance, cell[1]];
    var down = [cell[0], cell[1] + distance];
    var left = [cell[0] - distance, cell[1]];
    return [up, right, down, left];
}

function maze_solvers_interval() {
    var _done = false;
    function tick() {
        if (_done) return;
        if (!path) {
            if (node_list_index < node_list.length) {
                place_to_cell(node_list[node_list_index][0], node_list[node_list_index][1]).classList.add("cell_algo");
                node_list_index++;
            }
            if (node_list_index === node_list.length) {
                if (!found) { _done = true; return; }
                else { path = true; place_to_cell(start_pos[0], start_pos[1]).classList.add("cell_path"); }
            }
        } else {
            if (path_list_index === path_list.length) {
                place_to_cell(target_pos[0], target_pos[1]).classList.add("cell_path");
                _done = true; return;
            }
            place_to_cell(path_list[path_list_index][0], path_list[path_list_index][1]).classList.add("cell_path");
            path_list_index++;
        }
    }
    var last_time = 0;
    function animate(timestamp) {
        if (_done) return;
        var delay = 101 - visualization_speed;
        if (timestamp - last_time >= delay) { last_time = timestamp; tick(); }
        if (!_done) { my_interval = requestAnimationFrame(animate); }
    }
    cancelAnimationFrame(my_interval);
    clearInterval(my_interval);
    my_interval = requestAnimationFrame(animate);
}

function breadth_first() {
    var frontier = [start_pos];
    var head = 0;
    grid[start_pos[0]][start_pos[1]] = 1;
    node_list = []; found = false;
    while (head < frontier.length && !found) {
        var curr = frontier[head++];
        var list = get_neighbours(curr, 1);
        for (var i = 0; i < list.length; i++) {
            if (get_node(list[i][0], list[i][1]) === 0) {
                frontier.push(list[i]);
                grid[list[i][0]][list[i][1]] = i + 1;
                if (list[i][0] === target_pos[0] && list[i][1] === target_pos[1]) { found = true; break; }
                node_list.push(list[i]);
            }
        }
    }
    path_list = found ? reconstruct_path(target_pos, start_pos) : [];
    node_list_index = 0; path_list_index = 0; path = false;
    maze_solvers_interval();
}

function maze_solvers() {
    clear_grid();
    grid_clean = false;
    if ((Math.abs(start_pos[0] - target_pos[0]) === 0 && Math.abs(start_pos[1] - target_pos[1]) === 1) ||
        (Math.abs(start_pos[0] - target_pos[0]) === 1 && Math.abs(start_pos[1] - target_pos[1]) === 0)) {
        place_to_cell(start_pos[0], start_pos[1]).classList.add("cell_path");
        place_to_cell(target_pos[0], target_pos[1]).classList.add("cell_path");
        return;
    }
    var solver_value = document.getElementById("slct_1").value;
    switch (solver_value) {
        case "1": breadth_first(); break;
    }
}
