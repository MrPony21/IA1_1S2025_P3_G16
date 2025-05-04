class Graph {
    constructor() {
        this.adjacency = {};
    }

    addVertex(vertex) {
        if (!this.adjacency[vertex]) {
            this.adjacency[vertex] = [];
        }
    }

    addEdge(v1, v2) {
        this.addVertex(v1);
        this.addVertex(v2);
        this.adjacency[v1].push(v2);
        this.adjacency[v2].push(v1); // No dirigido
    }

    showGraph() {
        for (let vertex in this.adjacency) {
            console.log(`${vertex} -> ${this.adjacency[vertex].join(", ")}`);
        }
    }

    bfs(start, goal) {
        const visited = new Set();
        const queue = [[start]];
        console.log(`Iniciando BFS desde ${start} hasta ${goal}`);

        while (queue.length > 0) {
            const path = queue.shift();
            const node = path[path.length - 1];
            console.log(`Explorando nodo: ${node}, camino actual: ${path}`);

            if (node === goal) {
                console.log(`Meta encontrada: ${node}`);
                return path.map(coord => coord.split(',').map(Number));
            }

            if (!visited.has(node)) {
                visited.add(node);
                console.log(`Marcando ${node} como visitado`);

                for (let neighbor of this.adjacency[node] || []) {
                    console.log(`→ Encolando vecino: ${neighbor}`);
                    queue.push([...path, neighbor]);
                }
            }
        }

        console.log("No se encontró un camino");
        return null;
    }


    dfs(start, goal) {
        const visited = new Set();

        console.log(`Iniciando DFS desde ${start} hasta ${goal}`);

        const dfsHelper = (node, path) => {
            console.log(`Visitando nodo: ${node}, camino actual: ${path}`);

            if (node === goal) {
                console.log(`Meta encontrada: ${node}`);
                return path.map(coord => coord.split(',').map(Number));
            }

            visited.add(node);
            console.log(`Marcando ${node} como visitado`);

            for (let neighbor of this.adjacency[node] || []) {
                if (!visited.has(neighbor)) {
                    console.log(`→ Explorando vecino: ${neighbor}`);
                    const result = dfsHelper(neighbor, [...path, neighbor]);
                    if (result) return result;
                }
            }

            console.log(`Retrocediendo desde: ${node}`);
            return null;
        };

        return dfsHelper(start, [start]);
    }

    aStar(start, goal) {
        const openSet = [start]; // nodos por explorar
        const cameFrom = {};     // para reconstruir el camino

        const gScore = { [start]: 0 }; // coste real
        const fScore = { [start]: this.heuristic(start, goal) }; // coste estimado total

        console.log(`Iniciando A* desde ${start} hasta ${goal}`);

        while (openSet.length > 0) {
            // Elegir el nodo con menor fScore
            openSet.sort((a, b) => (fScore[a] ?? Infinity) - (fScore[b] ?? Infinity));
            const current = openSet.shift();
            console.log(`Explorando nodo: ${current}`);

            if (current === goal) {
                console.log("Meta alcanzada");
                return this.reconstructPath(cameFrom, current);
            }

            for (let neighbor of this.adjacency[current] || []) {
                const tentativeG = gScore[current] + 1; // cada paso cuesta 1
                console.log(`  Evaluando vecino: ${neighbor}, costo tentativo: ${tentativeG}`);

                if (tentativeG < (gScore[neighbor] ?? Infinity)) {
                    cameFrom[neighbor] = current;
                    gScore[neighbor] = tentativeG;
                    fScore[neighbor] = tentativeG + this.heuristic(neighbor, goal);
                    console.log(`  → Actualizado: g=${gScore[neighbor]}, h=${this.heuristic(neighbor, goal)}, f=${fScore[neighbor]}`);

                    if (!openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                        console.log(`  → Añadido a la cola: ${neighbor}`);
                    }
                }
            }
        }

        console.log("No se encontró un camino");
        return null;
    }

    heuristic(a, b) {
        const [x1, y1] = a.split(',').map(Number);
        const [x2, y2] = b.split(',').map(Number);
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    reconstructPath(cameFrom, current) {
        const totalPath = [current];
        while (cameFrom[current]) {
            current = cameFrom[current];
            totalPath.unshift(current);
        }
        console.log("Camino reconstruido:", totalPath);
        return totalPath.map(coord => coord.split(',').map(Number));
    }
    



    buildFromGrid(mapa) {
        const { ancho, alto, paredes } = mapa;
        const wallSet = new Set(paredes.map(p => `${p[0]},${p[1]}`));

        // Solo mover derecha y abajo para evitar duplicados
        const directions = [
            [0, 1], // derecha
            [1, 0]  // abajo
        ];

        for (let x = 0; x < alto; x++) {
            for (let y = 0; y < ancho; y++) {
                const current = `${x},${y}`;
                if (wallSet.has(current)) continue;

                for (let [dx, dy] of directions) {
                    const nx = x + dx;
                    const ny = y + dy;
                    const neighbor = `${nx},${ny}`;

                    if (
                        nx >= 0 && nx < alto &&
                        ny >= 0 && ny < ancho &&
                        !wallSet.has(neighbor)
                    ) {
                        this.addEdge(current, neighbor);
                    }
                }
            }
        }
    }

}
