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


function kruskal_algorithm() {
    fill_walls();

    var cell_ids = {};
    var id_count = 0;
    var wall_list = [];

    for (var i = 1; i < grid.length - 1; i++) {
        for (var j = 1; j < grid[0].length - 1; j++) {
            if (i % 2 === 1 && j % 2 === 1) {
                cell_ids[i + "," + j] = id_count;
                id_count++;
                grid[i][j] = 1;
                var c = place_to_cell(i, j);
                if (c) c.classList.add("visited_cell");
            }
            if ((i + j) % 2 === 1) {
                wall_list.push([i, j]);
            }
        }
    }

    var uf = new UnionFind(id_count);

    my_interval = window.setInterval(function () {
        while (true) {
            if (uf.count <= 1 || wall_list.length === 0) {
                clearInterval(my_interval);
                clear_grid();
                generating = false;
                return;
            }

            var index = random_int(0, wall_list.length);
            var wall = wall_list[index];
            wall_list.splice(index, 1);

            var cellA, cellB;
            if (in_bounds(wall[0] - 1, wall[1]) && in_bounds(wall[0] + 1, wall[1]) &&
                grid[wall[0] - 1][wall[1]] > -1) {
                cellA = (wall[0] - 1) + "," + wall[1];
                cellB = (wall[0] + 1) + "," + wall[1];
                } else {
                cellA = wall[0] + "," + (wall[1] - 1);
                cellB = wall[0] + "," + (wall[1] + 1);
                }

            var idA = cell_ids[cellA];
            var idB = cell_ids[cellB];

            if (idA !== undefined && idB !== undefined && !uf.connected(idA, idB)) {
                uf.union(idA, idB);
                remove_wall(wall[0], wall[1]);
                var c = place_to_cell(wall[0], wall[1]);
                if (c) c.classList.add("visited_cell");
                return;
            }
        }
    }, gen_interval_ms());
}


function wilson_algorithm() {
    fill();
    var cell_list = [];

    for (var i = 1; i < grid.length - 1; i += 2) {
        for (var j = 1; j < grid[0].length - 1; j += 2) {
            cell_list.push([i, j]);
        }
    }

    var first_cell = cell_list[0];
    cell_list.splice(0, 1);
    grid[first_cell[0]][first_cell[1]] = 10;
    var fc = place_to_cell(first_cell[0], first_cell[1]);
    if (fc) fc.classList.add("visited_cell");

    var current_cell = cell_list[random_int(0, cell_list.length)];
    var random_walk = true;
    var first_step = current_cell;
    var new_way_list = [];

    my_interval = window.setInterval(function () {
        if (cell_list.length === 0) {
            clearInterval(my_interval); clear_grid(); generating = false; return;
        }

        if (random_walk) {
            while (true) {
                var list = get_neighbours(current_cell, 2);
                var index; var chosen_cell;
                do {
                    index = random_int(0, list.length);
                    chosen_cell = list[index];
                } while (get_node(chosen_cell[0], chosen_cell[1]) === -2);
                grid[current_cell[0]][current_cell[1]] = -(index + 3);
                if (grid[chosen_cell[0]][chosen_cell[1]] === 10) {
                    random_walk = false; current_cell = first_step; return;
                } else { current_cell = chosen_cell; }
            }
        } else {
            if (grid[current_cell[0]][current_cell[1]] === 10) {
                current_cell = cell_list[random_int(0, cell_list.length)];
                random_walk = true; first_step = current_cell;
                for (var i = 0; i < new_way_list.length; i++) {
                    var c = place_to_cell(new_way_list[i][0], new_way_list[i][1]);
                    if (c) c.classList.add("visited_cell");
                }
                new_way_list = [];
            } else {
                var idx = -grid[current_cell[0]][current_cell[1]] - 3;
                var next_cell = get_neighbours(current_cell, 2)[idx];
                var wall = [(current_cell[0] + next_cell[0]) / 2, (current_cell[1] + next_cell[1]) / 2];
                new_way_list.push(current_cell); new_way_list.push(wall);
                remove_wall(current_cell[0], current_cell[1]);
                if (in_bounds(wall[0], wall[1])) { remove_wall(wall[0], wall[1]); }
                grid[current_cell[0]][current_cell[1]] = 10;
                for (var i = 0; i < cell_list.length; i++) {
                    if (cell_list[i][0] === current_cell[0] && cell_list[i][1] === current_cell[1]) {
                        cell_list.splice(i, 1); break;
                    }
                }
                current_cell = next_cell;
            }
        }
    }, gen_interval_ms());
}



function aldous_broder_algorithm() {
    fill();
    var cells_nb = ((grid.length - 1) / 2) * ((grid[0].length - 1) / 2);
    var current_cell = [1, 1];
    remove_wall(current_cell[0], current_cell[1]);
    grid[current_cell[0]][current_cell[1]] = 1;
    var c = place_to_cell(current_cell[0], current_cell[1]);
    if (c) c.classList.add("visited_cell");
    cells_nb--;

    my_interval = window.setInterval(function () {
        if (cells_nb === 0) { clearInterval(my_interval); clear_grid(); generating = false; return; }
        while (true) {
            var neighbours = [];
            var list = get_neighbours(current_cell, 2);
            for (var i = 0; i < list.length; i++) {
                if (get_node(list[i][0], list[i][1]) !== -2) { neighbours.push(list[i]); }
            }
            if (neighbours.length === 0) return;
            var chosen_cell = neighbours[random_int(0, neighbours.length)];
            if (grid[chosen_cell[0]][chosen_cell[1]] !== 1) {
                var wall = [(current_cell[0] + chosen_cell[0]) / 2, (current_cell[1] + chosen_cell[1]) / 2];
                if (in_bounds(wall[0], wall[1])) {
                    remove_wall(wall[0], wall[1]);
                    var wc = place_to_cell(wall[0], wall[1]); if (wc) wc.classList.add("visited_cell");
                }
                remove_wall(chosen_cell[0], chosen_cell[1]);
                grid[chosen_cell[0]][chosen_cell[1]] = 1;
                var cc = place_to_cell(chosen_cell[0], chosen_cell[1]); if (cc) cc.classList.add("visited_cell");
                cells_nb--; current_cell = chosen_cell; return;
            }
            current_cell = chosen_cell;
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
        case "2": kruskal_algorithm(); break;
        case "3": prim_algorithm(); break;
        case "4": wilson_algorithm(); break;
        case "5": aldous_broder_algorithm(); break;
    }
}
