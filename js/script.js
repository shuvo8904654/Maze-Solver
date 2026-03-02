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
    is_mobile = window.innerWidth <= 700;
    init_css_properties_before();
    generate_grid();
    init_css_properties_after();
    visualizer_event_listeners();
    menu_event_listeners();
};
