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
    //generation algorithm change
    document.getElementById("slct_2").addEventListener("change", function () {
        if (this.value !== "0") {
            maze_generators();
        }
    });

    // clear button
    document.getElementById("clear").addEventListener("click", function () {
        playSound('click');
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

    // solve button
    var solveBtn = document.getElementById("btn_solve") || document.getElementById("play");
    if (solveBtn) {
        solveBtn.addEventListener("click", function () {
            playSound('click');
            if (generating) {
                document.getElementById("slct_2").value = "0";
            }
            generating = false;
            clear_grid();
            maze_solvers();
        });
    }

    // compare button
    document.getElementById("btn_compare")?.addEventListener("click", function () {
        playSound('click');
        compare_all_algorithms();
    });

    // playback buttons
    document.getElementById("btn_pause")?.addEventListener("click", function () {
        playSound('click');
        is_paused = !is_paused;
        this.textContent = is_paused ? "Resume" : "Pause";
        this.classList.toggle("secondary_btn", is_paused);
    });

    document.getElementById("btn_step")?.addEventListener("click", function () {
        playSound('click');
        is_paused = true;
        step_clicked = true;
        var pauseBtn = document.getElementById("btn_pause");
        if (pauseBtn) {
            pauseBtn.textContent = "Resume";
            pauseBtn.classList.add("secondary_btn");
        }
    });

    // export/import
    document.getElementById("btn_export")?.addEventListener("click", function () { playSound('click'); export_maze(); });
    document.getElementById("btn_import")?.addEventListener("click", function () { playSound('click'); import_maze(); });

    // modal close
    document.querySelector(".close_modal")?.addEventListener("click", function () { playSound('click'); close_comparison_modal(); });
    window.addEventListener("click", function (event) {
        var modal = document.getElementById("compare_modal");
        if (event.target === modal) {
            playSound('click');
            close_comparison_modal();
        }
    });

    // speed slider
    document.getElementById("speed_slider").addEventListener("input", function (event) {
        visualization_speed = parseInt(event.target.value, 10);
    });

    // tool selector
    document.getElementById("slct_cursor").addEventListener("change", function () {
        current_tool = this.value;
    });

    // mobile menu toggle
    var toggle = document.getElementById("menu_toggle");
    if (toggle) {
        toggle.addEventListener("click", function () {
            initAudio();
            playSound('click');
            var menu = document.getElementById("menu");
            menu_open = !menu_open;

            if (menu_open) {
                menu.classList.add("open");
                toggle.setAttribute("aria-expanded", "true");
            } else {
                menu.classList.remove("open");
                toggle.setAttribute("aria-expanded", "false");
            }
        });
    }

    // any interaction initializes audio 
    document.body.addEventListener("click", function () {
        initAudio();
    }, { once: true });

    //generic click sound to selects and inputs
    document.querySelectorAll("select, input[type='range']").forEach(el => {
        el.addEventListener("change", () => playSound('click'));
    });

    // keyboard shortcuts
    document.addEventListener("keydown", function (event) {
        // space enter to visualize
        if (event.target.id === "grid" && (event.key === " " || event.key === "Enter")) {
            event.preventDefault();
            initAudio();
            if (generating) {
                document.getElementById("slct_2").value = "0";
            }
            generating = false;
            clear_grid();
            maze_solvers();
        }

        // Escape to clear
        if (event.key === "Escape") {
            initAudio();
            playSound('click');
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
        }
    });
}