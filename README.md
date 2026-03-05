# Maze Solver

An interactive visualizer for pathfinding and maze generation algorithms. Built entirely with vanilla HTML, CSS, and modern JavaScript, this project lets you watch algorithms at work in real-time.

## Features

- **Interactive Grid**: Draw your own walls or place weighted nodes (cost of 5).
- **Moveable Targets**: Drag and drop the start and target nodes wherever you want.
- **Multiple Algorithms**: Compare how different pathfinding strategies perform.
- **Maze Generation**: Watch complex mazes being carved out step-by-step.
- **Playback Controls**: Play, pause, step forward, and adjust the simulation speed on the fly.
- **Stats Dashboard**: Live tracking of visited nodes, path length, execution time, and total cost.
- **Save & Load**: Export your custom mazes as JSON and import them back anytime.
- **Responsive Design**: Works nicely on desktop and mobile devices, including touch support for drawing.

## Pathfinding Algorithms Included

- **Breadth-First Search (BFS)**: Unweighted. Guarantees the shortest path.
- **Bidirectional BFS**: Unweighted. Explores from both start and target nodes simultaneously.
- **Dijkstra's Algorithm**: Weighted. Guarantees the shortest path.
- **Greedy Best-First Search**: Weighted. Fast, but does not guarantee the shortest path.
- **A\* Search**: Weighted. Guarantees the shortest path using a heuristic (Manhattan distance).
- **Depth-First Search (DFS)**: Unweighted. Does not guarantee the shortest path.
- **Randomized Routing**: Unweighted. Explores random paths until it finds the target.
- **Wall Follower (Left/Right)**: A simple maze-solving algorithm that keeps one hand on the wall.

## Maze Generation Algorithms Included

- **Randomized DFS** (Recursive Backtracker)
- **Kruskal's Algorithm** (using a Union-Find data structure)
- **Prim's Algorithm**
- **Wilson's Algorithm** (Loop-erased random walks)
- **Aldous-Broder Algorithm**
- **Recursive Division**
- **Hunt-and-Kill Algorithm**
- **Sidewinder Algorithm**

## Setup / Running

This visualizer uses absolutely zero external libraries or dependencies.

To run it:
1. Clone the repository or download the source code.
2. Open `index.html` in any modern web browser.
3. Everything runs locally, no server required!

## UI Details

- **White nodes**: Empty pathways
- **Black nodes**: Impassable walls
- **Grey dotted nodes**: Weighted elements (Cost = 5)
- **Hollow nodes**: Nodes that an algorithm has visited/explored
- **Red nodes**: The final detected path

---
*Maintained by [@shuvo8904654](https://github.com/shuvo8904654)*
