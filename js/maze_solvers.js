"use strict";

function distance(point_1, point_2) {
    return Math.sqrt(Math.pow(point_2[0] - point_1[0], 2) + Math.pow(point_2[1] - point_1[1], 2));
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

function run_solver(type, silent) {
    var results = { nodes: [], path: [], found: false, cost: 0, time: 0 };
    var original_grid = silent ? JSON.parse(JSON.stringify(grid)) : null;
    var startTime = Date.now();
    var frontier;
    var cost_grid = new Array(grid.length).fill(0).map(() => new Array(grid[0].length).fill(Infinity));

    if (type === "1") {
        frontier = [start_pos]; var head = 0;
        grid[start_pos[0]][start_pos[1]] = 1;
        while (head < frontier.length && !results.found) {
            var curr = frontier[head++];
            var list = get_neighbours(curr, 1);
            for (var i = 0; i < list.length; i++) {
                if (get_node(list[i][0], list[i][1]) === 0) {
                    frontier.push(list[i]);
                    grid[list[i][0]][list[i][1]] = i + 1;
                    if (list[i][0] === target_pos[0] && list[i][1] === target_pos[1]) { results.found = true; break; }
                    results.nodes.push(list[i]);
                }
            }
        }
    } else if (type === "3" || type === "4" || type === "5") {
        var compareFn;
        if (type === "3") compareFn = (a, b) => distance(a, target_pos) - distance(b, target_pos);
        else if (type === "4") compareFn = (a, b) => cost_grid[a[0]][a[1]] - cost_grid[b[0]][b[1]];
        else compareFn = (a, b) => (cost_grid[a[0]][a[1]] + distance(a, target_pos)) - (cost_grid[b[0]][b[1]] + distance(b, target_pos));

        frontier = new MinHeap(compareFn);
        frontier.push(start_pos);
        cost_grid[start_pos[0]][start_pos[1]] = 0;
        grid[start_pos[0]][start_pos[1]] = 1;
        while (frontier.size() > 0 && !results.found) {
            var current = frontier.pop();
            var list = get_neighbours(current, 1);
            for (var i = 0; i < list.length; i++) {
                if (get_node(list[i][0], list[i][1]) === 0) {
                    var w = weights[list[i][0]][list[i][1]];
                    var new_cost = cost_grid[current[0]][current[1]] + w;
                    if (new_cost < cost_grid[list[i][0]][list[i][1]]) {
                        cost_grid[list[i][0]][list[i][1]] = new_cost;
                        frontier.push(list[i]);
                        grid[list[i][0]][list[i][1]] = i + 1;
                        if (list[i][0] === target_pos[0] && list[i][1] === target_pos[1]) { results.found = true; break; }
                        results.nodes.push(list[i]);
                    }
                }
            }
        }
    }

    if (results.found) {
        results.path = reconstruct_path(target_pos, start_pos);
        results.cost = results.path.reduce((acc, curr) => acc + weights[curr[0]][curr[1]], 0) + weights[target_pos[0]][target_pos[1]];
    }
    results.time = Date.now() - startTime;
    if (silent) { grid = original_grid; }
    return results;
}

function breadth_first() {
    var res = run_solver("1", false);
    node_list = res.nodes; path_list = res.path; found = res.found; total_cost = res.cost;
    node_list_index = 0; path_list_index = 0; path = false;
    maze_solvers_interval();
}

function greedy_best_first() {
    var res = run_solver("3", false);
    node_list = res.nodes; path_list = res.path; found = res.found; total_cost = res.cost;
    node_list_index = 0; path_list_index = 0; path = false;
    maze_solvers_interval();
}

function dijkstra() {
    var res = run_solver("4", false);
    node_list = res.nodes; path_list = res.path; found = res.found; total_cost = res.cost;
    node_list_index = 0; path_list_index = 0; path = false;
    maze_solvers_interval();
}

function a_star() {
    var res = run_solver("5", false);
    node_list = res.nodes; path_list = res.path; found = res.found; total_cost = res.cost;
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
        case "3": greedy_best_first(); break;
        case "4": dijkstra(); break;
        case "5": a_star(); break;
    }
}
