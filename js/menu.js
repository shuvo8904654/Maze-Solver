"use strict";

function hidden_clear() {
    for (var i = 0; i < timeouts.length; i++) {
        clearTimeout(timeouts[i]);
    }
    timeouts = [];

    cancelAnimationFrame(my_interval);
    clearInterval(my_interval);

    delete_grid();

    var available_width = is_mobile ? window.innerWidth : window.innerWidth - menu_width;

    if (available_width > 50) {
        init_css_properties_before();
        generate_grid();
        init_css_properties_after();
        visualizer_event_listeners();
    }

    reset_stats();
}

function clear() {
    document.getElementById("slct_2").value = "0";
    hidden_clear();
}

function menu_event_listeners() {
    document.getElementById("slct_2").addEventListener("change", function () {
        if (this.value !== "0") {
            maze_generators();
        }
    });

    document.getElementById("clear").addEventListener("click", function () {
        var start_temp = [start_pos[0], start_pos[1]];
        var target_temp = [target_pos[0], target_pos[1]];
        clear();

        var oldStart = place_to_cell(start_pos[0], start_pos[1]);
        if (oldStart) oldStart.classList.remove("start");
        var newStart = place_to_cell(start_temp[0], start_temp[1]);
        if (newStart) newStart.classList.add("start");

        var oldTarget = place_to_cell(target_pos[0], target_pos[1]);
        if (oldTarget) oldTarget.classList.remove("target");
        var newTarget = place_to_cell(target_temp[0], target_temp[1]);
        if (newTarget) newTarget.classList.add("target");

        start_pos = start_temp;
        target_pos = target_temp;
    });

    var solveBtn = document.getElementById("btn_solve") || document.getElementById("play");
    if (solveBtn) {
        solveBtn.addEventListener("click", function () {
            if (generating) {
                document.getElementById("slct_2").value = "0";
            }
            generating = false;
            clear_grid();
            maze_solvers();
        });
    }

    document.getElementById("btn_compare")?.addEventListener("click", function () {
        compare_all_algorithms();
    });

    document.getElementById("btn_pause")?.addEventListener("click", function () {
        is_paused = !is_paused;
        this.textContent = is_paused ? "Resume" : "Pause";
        this.classList.toggle("secondary_btn", is_paused);
    });

    document.getElementById("btn_step")?.addEventListener("click", function () {
        is_paused = true;
        step_clicked = true;
        var pauseBtn = document.getElementById("btn_pause");
        if (pauseBtn) {
            pauseBtn.textContent = "Resume";
            pauseBtn.classList.add("secondary_btn");
        }
    });

    document.getElementById("btn_export")?.addEventListener("click", function () { export_maze(); });
    document.getElementById("btn_import")?.addEventListener("click", function () { import_maze(); });

    document.querySelector(".close_modal")?.addEventListener("click", function () { close_comparison_modal(); });
    window.addEventListener("click", function (event) {
        var modal = document.getElementById("compare_modal");
        if (event.target === modal) {
            close_comparison_modal();
        }
    });

    document.getElementById("speed_slider").addEventListener("input", function (event) {
        visualization_speed = parseInt(event.target.value, 10);
    });

    document.getElementById("slct_cursor").addEventListener("change", function () {
        current_tool = this.value;
    });
}
