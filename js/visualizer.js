"use strict";

function set_grid_properties() {
    var available_width = window.innerWidth;
    if (!is_mobile) {
        available_width -= menu_width;
    }
    var ratio = available_width / window.innerHeight;
    if (ratio > 1) {
        grid_size_x = initial_max_grid_size;
        grid_size_y = Math.floor(initial_max_grid_size / ratio);
        if (grid_size_y % 2 === 0) grid_size_y += 1;
        cell_size = Math.floor(available_width / initial_max_grid_size);
    } else {
        grid_size_x = Math.floor(initial_max_grid_size * ratio);
        grid_size_y = initial_max_grid_size;
        if (grid_size_x % 2 === 0) grid_size_x += 1;
        cell_size = Math.floor(window.innerHeight / initial_max_grid_size);
    }
    if (grid_size_x < 5) grid_size_x = 5;
    if (grid_size_y < 5) grid_size_y = 5;
    if (grid_size_x % 2 === 0) grid_size_x += 1;
    if (grid_size_y % 2 === 0) grid_size_y += 1;
}

function generate_grid() {
    set_grid_properties();
    var table = document.createElement("table");
    table.id = "my_table";
    cell_cache = new Array(grid_size_x);
    for (var x = 0; x < grid_size_x; x++) {
        cell_cache[x] = new Array(grid_size_y);
    }
    for (var i = 0; i < grid_size_y; i++) {
        var row = document.createElement("tr");
        for (var j = 0; j < grid_size_x; j++) {
            var cell = document.createElement("td");
            var class_name;
            if ((i + j) % 2 === 0) {
                class_name = "cell cell_1";
            } else {
                class_name = "cell cell_2";
            }
            class_name += " x_" + j.toString(10) + " y_" + i.toString(10);
            cell.className = class_name;
            row.appendChild(cell);
            cell_cache[j][i] = cell;
        }
        table.appendChild(row);
    }
    document.getElementById("grid").appendChild(table);
    grid = new Array(grid_size_x).fill(0).map(function () {
        return new Array(grid_size_y).fill(0);
    });
    weights = new Array(grid_size_x).fill(1).map(function () {
        return new Array(grid_size_y).fill(1);
    });
    start_pos = [Math.floor(grid_size_x / 4), Math.floor(grid_size_y / 2)];
    target_pos = [Math.floor((3 * grid_size_x) / 4), Math.floor(grid_size_y / 2)];
    if (start_pos[0] % 2 === 0) start_pos[0] += 1;
    if (start_pos[1] % 2 === 0) start_pos[1] -= 1;
    if (target_pos[0] % 2 === 0) target_pos[0] += 1;
    if (target_pos[1] % 2 === 0) target_pos[1] -= 1;
    place_to_cell(start_pos[0], start_pos[1]).classList.add("start");
    place_to_cell(target_pos[0], target_pos[1]).classList.add("target");
}

function delete_grid() {
    var table = document.getElementById("my_table");
    if (table) table.remove();
    cell_cache = null;
    weights = null;
}

function cell_to_place(cell) {
    var text_x = cell.classList[2];
    var text_y = cell.classList[3];
    text_x = text_x.split("x_")[1];
    text_y = text_y.split("y_")[1];
    return [parseInt(text_x, 10), parseInt(text_y, 10)];
}

function place_to_cell(x, y) {
    if (cell_cache && x >= 0 && x < grid_size_x && y >= 0 && y < grid_size_y) {
        return cell_cache[x][y];
    }
    return document.querySelector(".x_" + x.toString(10) + ".y_" + y.toString(10));
}

function add_wall(x, y) {
    var cell = place_to_cell(x, y);
    if (!cell) return;
    if (!cell.classList.contains("start") && !cell.classList.contains("target")) {
        grid[x][y] = -1;
        cell.classList.add("cell_wall");
    }
}

function remove_wall(x, y) {
    if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length) return;
    grid[x][y] = 0;
    var cell = place_to_cell(x, y);
    if (cell) cell.classList.remove("cell_wall");
}

function clear_grid() {
    if (!grid_clean) {
        for (var i = 0; i < timeouts.length; i++) {
            clearTimeout(timeouts[i]);
        }
        timeouts = [];
        cancelAnimationFrame(my_interval);
        clearInterval(my_interval);
        for (var x = 0; x < grid.length; x++) {
            for (var y = 0; y < grid[0].length; y++) {
                var cell = place_to_cell(x, y);
                if (!cell) continue;
                if (grid[x][y] > -1) {
                    remove_wall(x, y);
                    cell.classList.remove("cell_algo");
                    cell.classList.remove("cell_path");
                } else if (grid[x][y] < -1) {
                    add_wall(x, y);
                }
                cell.classList.remove("visited_cell");
            }
        }
        grid_clean = true;
    }
}

function get_node(x, y) {
    if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length) {
        return grid[x][y];
    }
    return -2;
}
