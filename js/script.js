"use strict";



function init_css_properties_before() {
    var menu = document.getElementById("menu");
    var visualizer = document.getElementById("visualizer");

    if (is_mobile) {
        menu.style.width = "";
        visualizer.style.width = "";
        visualizer.style.left = "";
    } else {
        menu.style.width = menu_width.toString(10) + "px";
        visualizer.style.width = (window.innerWidth - menu_width).toString(10) + "px";
        visualizer.style.left = menu_width.toString(10) + "px";
    }
}

function init_css_properties_after() {
    var gridEl = document.getElementById("grid");
    gridEl.style.width = (cell_size * grid_size_x).toString(10) + "px";
    gridEl.style.height = (cell_size * grid_size_y).toString(10) + "px";
}


window.onload = function () {
    // detect mobile
    is_mobile = window.innerWidth <= 700;

    init_css_properties_before();
    generate_grid();
    init_css_properties_after();



    visualizer_event_listeners();
    menu_event_listeners();

    // hide the loading overlay
    var hider = document.getElementById("hider");
    hider.style.visibility = "hidden";

    // initialize stats
    reset_stats();
};

function show_toast(msg) {
    var x = document.getElementById("toast");
    if (x) {
        x.textContent = msg;
        x.classList.add("show");
        setTimeout(function () { x.classList.remove("show"); }, 3000);
    }
}



function toggle_playback_ui(show) {
    var controls = document.getElementById("playback_controls");
    if (controls) controls.style.display = show ? "block" : "none";
}

function show_comparison_modal(results) {
    var modal = document.getElementById("compare_modal");
    var tbody = modal.querySelector("tbody");
    tbody.innerHTML = "";

    results.forEach(res => {
        var tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${res.name}</td>
            <td>${res.visited}</td>
            <td>${res.path}</td>
            <td>${res.cost}</td>
            <td>${res.time}ms</td>
        `;
        tbody.appendChild(tr);
    });

    modal.classList.add("show");
}

function close_comparison_modal() {
    document.getElementById("compare_modal").classList.remove("show");
}



function export_maze() {
    var data = {
        w: grid_size_x,
        h: grid_size_y,
        start: start_pos,
        target: target_pos,
        walls: [],
        weights: []
    };

    for (var x = 0; x < grid_size_x; x++) {
        for (var y = 0; y < grid_size_y; y++) {
            if (grid[x][y] === -1) data.walls.push([x, y]);
            if (weights[x][y] === 5) data.weights.push([x, y]);
        }
    }

    var str = btoa(JSON.stringify(data));
    if (navigator.clipboard) {
        navigator.clipboard.writeText(str).then(() => {
            show_toast("Maze copied to clipboard!");
        }).catch(() => {
            prompt("Copy this maze data:", str);
        });
    } else {
        prompt("Copy this maze data:", str);
    }
}

function import_maze() {
    var str = prompt("Paste maze data:");
    if (!str) return;

    try {
        var data = JSON.parse(atob(str));
    } catch (e) {
        show_toast("Invalid maze data!");
        return;
    }

    if (!data.w || !data.h) {
        show_toast("Invalid maze data!");
        return;
    }

    grid_size_x = data.w;
    grid_size_y = data.h;
    start_pos = data.start;
    target_pos = data.target;

    generate_grid();
    init_css_properties_after();

    if (data.walls) {
        data.walls.forEach(function (p) {
            grid[p[0]][p[1]] = -1;
            var cell = cell_cache[p[0]][p[1]];
            if (cell) cell.className = "cell cell_wall";
        });
    }

    if (data.weights) {
        data.weights.forEach(function (p) {
            weights[p[0]][p[1]] = 5;
            var cell = cell_cache[p[0]][p[1]];
            if (cell) cell.className = "cell cell_weight";
        });
    }

    show_toast("Maze imported!");
}
