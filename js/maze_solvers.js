"use strict";



function distance(point_1, point_2) {
    return Math.sqrt(
        Math.pow(point_2[0] - point_1[0], 2) +
        Math.pow(point_2[1] - point_1[1], 2)
    );
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
                if (!found) {
                    _done = true;
                    
                    
                    
                    
                    
                    return;
                } else {
                    path = true;
                    place_to_cell(start_pos[0], start_pos[1]).classList.add("cell_path");
                    
                }
            }
        } else {
            if (path_list_index === path_list.length) {
                place_to_cell(target_pos[0], target_pos[1]).classList.add("cell_path");
                _done = true;
                
                                
                
                
                return;
            }

            place_to_cell(path_list[path_list_index][0], path_list[path_list_index][1]).classList.add("cell_path");
            path_list_index++;
                    }
    }

    var last_time = 0;
    function animate(timestamp) {
        if (_done) return;

        var delay = 101 - visualization_speed;
        if (timestamp - last_time >= delay) {
            last_time = timestamp;
            tick();
        }

        if (!_done) {
            my_interval = requestAnimationFrame(animate);
        }
    }

    cancelAnimationFrame(my_interval);
    clearInterval(my_interval);
    my_interval = requestAnimationFrame(animate);
}


function run_solver(type, silent) {
    var results = {
        nodes: [],
        path: [],
        found: false,
        cost: 0,
        time: 0
    };

    // save real grid state to restore later if silent
    var original_grid = silent ? JSON.parse(JSON.stringify(grid)) : null;
    var startTime = Date.now();

    var frontier;
    var cost_grid = new Array(grid.length).fill(0).map(() => new Array(grid[0].length).fill(Infinity));

    if (type === "1") { // bfs
        frontier = [start_pos];
        var head = 0;
        grid[start_pos[0]][start_pos[1]] = 1;
        while (head < frontier.length && !results.found) {
            var curr = frontier[head++];
            var list = get_neighbours(curr, 1);
            for (var i = 0; i < list.length; i++) {
                if (get_node(list[i][0], list[i][1]) === 0) {
                    frontier.push(list[i]);
                    grid[list[i][0]][list[i][1]] = i + 1;
                    if (list[i][0] === target_pos[0] && list[i][1] === target_pos[1]) {
                        results.found = true; break;
                    }
                    results.nodes.push(list[i]);
                }
            }
        }
    } else if (type === "2") { // bidirectional bfs

    } else if (type === "6") { // dfs
        frontier = [start_pos];
        grid[start_pos[0]][start_pos[1]] = 1;
        while (frontier.length > 0 && !results.found) {
            var curr = frontier.pop();

            if (curr[0] !== start_pos[0] || curr[1] !== start_pos[1]) {
                results.nodes.push(curr);
            }

            if (curr[0] === target_pos[0] && curr[1] === target_pos[1]) {
                results.found = true;
                break;
            }

            var list = get_neighbours(curr, 1);
            for (var i = 0; i < list.length; i++) {
                if (get_node(list[i][0], list[i][1]) === 0) {
                    frontier.push(list[i]);
                    grid[list[i][0]][list[i][1]] = i + 1;
                }
            }
        }
    } else if (type === "9") { // randomized routing
        frontier = [start_pos];
        grid[start_pos[0]][start_pos[1]] = 1;
        while (frontier.length > 0 && !results.found) {
            var curr = frontier.pop();

            if (curr[0] !== start_pos[0] || curr[1] !== start_pos[1]) {
                results.nodes.push(curr);
            }

            if (curr[0] === target_pos[0] && curr[1] === target_pos[1]) {
                results.found = true;
                break;
            }

            var list = get_neighbours(curr, 1);
            // shuffle the neighbors for a random path
            for (let i = list.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [list[i], list[j]] = [list[j], list[i]];
            }
            for (var i = 0; i < list.length; i++) {
                if (get_node(list[i][0], list[i][1]) === 0) {
                    frontier.push(list[i]);
                    grid[list[i][0]][list[i][1]] = i + 1;
                }
            }
        }
    } else if (type === "9") { // randomized routing
        frontier = [start_pos];
        grid[start_pos[0]][start_pos[1]] = 1;
        while (frontier.length > 0 && !results.found) {
            var curr = frontier.pop();

            if (curr[0] !== start_pos[0] || curr[1] !== start_pos[1]) {
                results.nodes.push(curr);
            }

            if (curr[0] === target_pos[0] && curr[1] === target_pos[1]) {
                results.found = true;
                break;
            }

            var list = get_neighbours(curr, 1);
            // shuffle the neighbors for a random path
            for (let i = list.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [list[i], list[j]] = [list[j], list[i]];
            }
            for (var i = 0; i < list.length; i++) {
                if (get_node(list[i][0], list[i][1]) === 0) {
                    frontier.push(list[i]);
                    grid[list[i][0]][list[i][1]] = i + 1;
                }
            }
        }
    } else if (type === "7" || type === "8") { // wall follower left/right
        var current = [start_pos[0], start_pos[1]];
        var directions = [[0, -1], [1, 0], [0, 1], [-1, 0]]; // Up, Right, Down, Left
        var dir_to_grid_val = [1, 2, 3, 4];
        var dir_idx = 1;

        var max_steps = grid.length * grid[0].length * 4;
        var steps = 0;

        grid[start_pos[0]][start_pos[1]] = 1;

        while (!results.found && steps < max_steps) {
            steps++;

            var next_node = null;
            var move_dir = -1;

            // 1. Try lateral (left or right)
            var lateral_idx;
            if (type === "7") {
                lateral_idx = (dir_idx + 3) % 4; // Left
            } else {
                lateral_idx = (dir_idx + 1) % 4; // Right
            }

            var lateral_node = [current[0] + directions[lateral_idx][0], current[1] + directions[lateral_idx][1]];

            if (in_bounds(lateral_node[0], lateral_node[1]) && get_node(lateral_node[0], lateral_node[1]) !== -1) {
                move_dir = lateral_idx;
                next_node = lateral_node;
            } else {                // 2. Try straight
                var straight_node = [current[0] + directions[dir_idx][0], current[1] + directions[dir_idx][1]];
                if (in_bounds(straight_node[0], straight_node[1]) && get_node(straight_node[0], straight_node[1]) !== -1) {
                    move_dir = dir_idx;
                    next_node = straight_node;
                } else {
                    // 3. Turn opposite lateral
                    if (type === "7") {
                        dir_idx = (dir_idx + 1) % 4; // Right
                    } else {
                        dir_idx = (dir_idx + 3) % 4; // Left
                    }
                    continue;
                }
            }

            dir_idx = move_dir;

            if (grid[next_node[0]][next_node[1]] <= 0 || grid[next_node[0]][next_node[1]] > 4) {
                grid[next_node[0]][next_node[1]] = dir_to_grid_val[move_dir];
            }

            results.nodes.push([next_node[0], next_node[1]]);
            current = next_node;

            if (current[0] === target_pos[0] && current[1] === target_pos[1]) {
                results.found = true;
                break;
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
                        if (list[i][0] === target_pos[0] && list[i][1] === target_pos[1]) {
                            results.found = true; break;
                        }
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

    if (silent) {
        grid = original_grid;
    }

    return results;
}



function breadth_first() {
    var res = run_solver("1", false);
    node_list = res.nodes;
    path_list = res.path;
    found = res.found;
    total_cost = res.cost;
    node_list_index = 0;
    path_list_index = 0;
    path = false;
    
    maze_solvers_interval();
}

function bidirectional_breadth_first() {

    node_list = []; node_list_index = 0; path_list = []; path_list_index = 0; found = false; path = false;
    
    var s_e, t_e;
    var frontier = [start_pos, target_pos];
    var head = 0;
    grid[target_pos[0]][target_pos[1]] = 1;
    grid[start_pos[0]][start_pos[1]] = 11;

    while (head < frontier.length && !found) {
        var curr = frontier[head++];
        var list = get_neighbours(curr, 1);
        for (var i = 0; i < list.length; i++) {
            if (get_node(list[i][0], list[i][1]) === 0) {
                frontier.push(list[i]);
                if (grid[curr[0]][curr[1]] < 10) grid[list[i][0]][list[i][1]] = i + 1;
                else grid[list[i][0]][list[i][1]] = 11 + i;
                node_list.push(list[i]);
            } else if (get_node(list[i][0], list[i][1]) > 0) {
                if (grid[curr[0]][curr[1]] < 10 && get_node(list[i][0], list[i][1]) > 10) {
                    s_e = curr; t_e = list[i]; found = true; break;
                } else if (grid[curr[0]][curr[1]] > 10 && get_node(list[i][0], list[i][1]) < 10) {
                    s_e = list[i]; t_e = curr; found = true; break;
                }
            }
        }
    }

    if (found) {
        var targets = [target_pos, start_pos], starts = [s_e, t_e];
        for (var i = 0; i < starts.length; i++) {
            var cn = starts[i];
            while (cn[0] !== targets[i][0] || cn[1] !== targets[i][1]) {
                path_list.push(cn);
                switch (grid[cn[0]][cn[1]] - (i * 10)) {
                    case 1: cn = [cn[0], cn[1] + 1]; break;
                    case 2: cn = [cn[0] - 1, cn[1]]; break;
                    case 3: cn = [cn[0], cn[1] - 1]; break;
                    case 4: cn = [cn[0] + 1, cn[1]]; break;
                    default: cn = targets[i]; break;
                }
            }
            if (i === 0) path_list.reverse();
        }
        path_list.reverse();
        total_cost = path_list.reduce((acc, curr) => acc + weights[curr[0]][curr[1]], 0) + weights[target_pos[0]][target_pos[1]];
    }
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

function depth_first() {
    var res = run_solver("6", false);
    node_list = res.nodes; path_list = res.path; found = res.found; total_cost = res.cost;
    node_list_index = 0; path_list_index = 0; path = false; 
    maze_solvers_interval();
}

function wall_follower(type) {
    var res = run_solver(type, false);
    node_list = res.nodes; path_list = res.path; found = res.found; total_cost = res.cost;
    node_list_index = 0; path_list_index = 0; path = false; 
    maze_solvers_interval();
}









function randomized_routing() {
    var res = run_solver("9", false);
    node_list = res.nodes; path_list = res.path; found = res.found; total_cost = res.cost;
    node_list_index = 0; path_list_index = 0; path = false; solve_start_time = Date.now();
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
        case "2": bidirectional_breadth_first(); break;
        case "3": greedy_best_first(); break;
        case "4": dijkstra(); break;
        case "5": a_star(); break;
        case "6": depth_first(); break;
        case "7": wall_follower("7"); break;
        case "8": wall_follower("8"); break;
        case "9": randomized_routing(); break;
        
    }
}

