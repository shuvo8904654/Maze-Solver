"use strict";

function get_neighbours(cell, distance) {
    var up = [cell[0], cell[1] - distance];
    var right = [cell[0] + distance, cell[1]];
    var down = [cell[0], cell[1] + distance];
    var left = [cell[0] - distance, cell[1]];
    return [up, right, down, left];
}

function random_int(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function in_bounds(x, y) {
    return x >= 0 && x < grid.length && y >= 0 && y < grid[0].length;
}

function gen_interval_ms() {
    return Math.max(1, Math.floor(81 - visualization_speed * 0.8));
}

function fill() {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[0].length; j++) {
            add_wall(i, j);
        }
    }
}

function fill_walls() {
    for (var i = 0; i < grid.length; i++) {
        for (var j = 0; j < grid[0].length; j++) {
            if (i % 2 === 0 || j % 2 === 0) {
                add_wall(i, j);
            }
        }
    }
}

function randomized_depth_first() {
    fill();
    var current_cell = [1, 1];
    remove_wall(current_cell[0], current_cell[1]);
    grid[current_cell[0]][current_cell[1]] = 1;
    var stack = [current_cell];
    my_interval = window.setInterval(function () {
        if (stack.length === 0) { clearInterval(my_interval); clear_grid(); generating = false; return; }
        current_cell = stack.pop();
        var neighbours = [];
        var list = get_neighbours(current_cell, 2);
        for (var i = 0; i < list.length; i++) {
            var n = get_node(list[i][0], list[i][1]);
            if (n === -1 || n === 0) { neighbours.push(list[i]); }
        }
        if (neighbours.length > 0) {
            stack.push(current_cell);
            var chosen_cell = neighbours[random_int(0, neighbours.length)];
            var wallX = (current_cell[0] + chosen_cell[0]) / 2;
            var wallY = (current_cell[1] + chosen_cell[1]) / 2;
            if (in_bounds(wallX, wallY)) { remove_wall(wallX, wallY); }
            remove_wall(chosen_cell[0], chosen_cell[1]);
            grid[chosen_cell[0]][chosen_cell[1]] = 1;
            stack.push(chosen_cell);
        } else {
            remove_wall(current_cell[0], current_cell[1]);
            grid[current_cell[0]][current_cell[1]] = 2;
            var cell = place_to_cell(current_cell[0], current_cell[1]);
            if (cell) cell.classList.add("visited_cell");
            for (var i = 0; i < list.length; i++) {
                var wall = [(current_cell[0] + list[i][0]) / 2, (current_cell[1] + list[i][1]) / 2];
                if (in_bounds(wall[0], wall[1]) && in_bounds(list[i][0], list[i][1])) {
                    if (get_node(list[i][0], list[i][1]) === 2 && get_node(wall[0], wall[1]) > -1) {
                        var wCell = place_to_cell(wall[0], wall[1]);
                        if (wCell) wCell.classList.add("visited_cell");
                    }
                }
            }
        }
    }, gen_interval_ms());
}

function prim_algorithm() {
	fill();
	var first_cell = [1, 1];
	remove_wall(first_cell[0], first_cell[1]);
	var fc = place_to_cell(first_cell[0], first_cell[1]);
	if (fc) fc.classList.add("visited_cell");
	grid[first_cell[0]][first_cell[1]] = 1;
    var wall_list = [];
    var list = get_neighbours(first_cell, 1);
    for (var i = 0; i < list.length; i++) {
        if (in_bounds(list[i][0], list[i][1]) && list[i][0] > 0 && list[i][0] < grid.length - 1 && list[i][1] > 0 && list[i][1] < grid[0].length - 1) {
            wall_list.push(list[i]);
            }
    }
    my_interval = window.setInterval(function () {
        while (true) {
            if (wall_list.length === 0) { clearInterval(my_interval); clear_grid(); generating = false; return; }
            var index = random_int(0, wall_list.length);
            var wall = wall_list[index];
            wall_list.splice(index, 1);
            var cell_pair;
            if (wall[0] % 2 === 0) { cell_pair = [[wall[0] - 1, wall[1]], [wall[0] + 1, wall[1]]]; }
            else { cell_pair = [[wall[0], wall[1] - 1], [wall[0], wall[1] + 1]]; }
            if (!in_bounds(cell_pair[0][0], cell_pair[0][1]) || !in_bounds(cell_pair[1][0], cell_pair[1][1])) { continue; }
            var new_cell; var valid = false;
            if (grid[cell_pair[0][0]][cell_pair[0][1]] < 1) { new_cell = cell_pair[0]; valid = true; }
            else if (grid[cell_pair[1][0]][cell_pair[1][1]] < 1) { new_cell = cell_pair[1]; valid = true; }
            if (valid) {
                remove_wall(wall[0], wall[1]); remove_wall(new_cell[0], new_cell[1]);
                var wc = place_to_cell(wall[0], wall[1]); if (wc) wc.classList.add("visited_cell");
                var nc = place_to_cell(new_cell[0], new_cell[1]); if (nc) nc.classList.add("visited_cell");
                grid[new_cell[0]][new_cell[1]] = 1;
                var nbrs = get_neighbours(new_cell, 1);
                for (var i = 0; i < nbrs.length; i++) {
                    if (in_bounds(nbrs[i][0], nbrs[i][1]) && nbrs[i][0] > 0 && nbrs[i][0] < grid.length - 1 && nbrs[i][1] > 0 && nbrs[i][1] < grid[0].length - 1) {
                        wall_list.push(nbrs[i]);
                        }
                }
                return;
            }
        }
    }, gen_interval_ms());
}

function maze_generators() {
    var start_temp = [start_pos[0], start_pos[1]];
    var target_temp = [target_pos[0], target_pos[1]];
    hidden_clear();
    generating = true;
    if (start_temp[0] % 2 === 0) { start_temp[0] += (start_temp[0] === grid.length - 1) ? -1 : 1; }
    if (start_temp[1] % 2 === 0) { start_temp[1] += (start_temp[1] === 0) ? 1 : -1; }
    if (target_temp[0] % 2 === 0) { target_temp[0] += (target_temp[0] === grid.length - 1) ? -1 : 1; }
    if (target_temp[1] % 2 === 0) { target_temp[1] += (target_temp[1] === 0) ? 1 : -1; }
    var oldStart = place_to_cell(start_pos[0], start_pos[1]); if (oldStart) oldStart.classList.remove("start");
    var newStart = place_to_cell(start_temp[0], start_temp[1]); if (newStart) newStart.classList.add("start");
    var oldTarget = place_to_cell(target_pos[0], target_pos[1]); if (oldTarget) oldTarget.classList.remove("target");
    var newTarget = place_to_cell(target_temp[0], target_temp[1]); if (newTarget) newTarget.classList.add("target");
    start_pos = start_temp; target_pos = target_temp; grid_clean = false;
    var gen_value = document.getElementById("slct_2").value;
    switch (gen_value) {
        case "1": randomized_depth_first(); break;
        case "3": prim_algorithm(); break;
    }
}
