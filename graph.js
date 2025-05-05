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
        const pasos = [];

        while (queue.length > 0) {
            const path = queue.shift(); // camino actual
            const node = path[path.length - 1]; // último nodo

            if (!visited.has(node)) {
                visited.add(node);
                pasos.push(node); // registrar visita

                if (node === goal) {
                    return pasos.map(coord => coord.split(',').map(Number));
                }

                let hasUnvisited = false;

                for (let neighbor of this.adjacency[node] || []) {
                    if (!visited.has(neighbor)) {
                        hasUnvisited = true;
                        queue.push([...path, neighbor]);
                    }
                }

                if (!hasUnvisited && path.length > 1) {
                    // simulamos retroceso al nodo anterior
                    const previous = path[path.length - 2];
                    pasos.push(previous);
                }
            }
        }

        return pasos.map(coord => coord.split(',').map(Number));
    }







    dfs(start, goal) {
        const visited = new Set();
        const pasos = [];

        console.log(`Iniciando DFS desde ${start} hasta ${goal}`);

        const dfsHelper = (node) => {
            visited.add(node);
            pasos.push({ tipo: 'visita', nodo: node });
            console.log(`Visitando nodo: ${node}`);

            if (node === goal) {
                console.log(`Meta encontrada: ${node}`);
                pasos.push({ tipo: 'meta', nodo: node });
                return true;
            }

            for (let neighbor of this.adjacency[node] || []) {
                if (!visited.has(neighbor)) {
                    console.log(`→ Explorando vecino: ${neighbor}`);
                    if (dfsHelper(neighbor)) {
                        return true;
                    }
                }
            }

            pasos.push({ tipo: 'retroceso', nodo: node });
            console.log(`Retrocediendo desde: ${node}`);
            return false;
        };

        dfsHelper(start);

        return pasos.map(p => ({
            tipo: p.tipo,
            nodo: p.nodo.split(',').map(Number)
        }));
    }



    aStar(start, goal) {
        const openSet = [start];
        const cameFrom = {};

        const gScore = { [start]: 0 };
        const fScore = { [start]: this.heuristic(start, goal) };

        const nodosVisitados = [];

        console.log(`Iniciando A* desde ${start} hasta ${goal}`);

        while (openSet.length > 0) {
            openSet.sort((a, b) => (fScore[a] ?? Infinity) - (fScore[b] ?? Infinity));
            const current = openSet.shift();

            console.log(`Explorando nodo: ${current}`);
            nodosVisitados.push(current);

            if (current === goal) {
                console.log("Meta alcanzada");
                return nodosVisitados.map(coord => coord.split(',').map(Number));
            }

            for (let neighbor of this.adjacency[current] || []) {
                const tentativeG = gScore[current] + 1;
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
        return nodosVisitados.map(coord => coord.split(',').map(Number));
    }


    heuristic(a, b) {
        const [x1, y1] = a.split(',').map(Number);
        const [x2, y2] = b.split(',').map(Number);
        return Math.abs(x1 - x2) + Math.abs(y1 - y2); // Heurística Manhattan
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

    aStarConRegresos(start, goal) {
        const openSet = [start];
        const cameFrom = {};
        const gScore = { [start]: 0 };
        const fScore = { [start]: this.heuristic(start, goal) };
        const pasos = [];
        const visitados = new Set();

        while (openSet.length > 0) {
            openSet.sort((a, b) => (fScore[a] ?? Infinity) - (fScore[b] ?? Infinity));
            const current = openSet.shift();

            pasos.push(current);
            visitados.add(current);
            console.log(`Explorando nodo: ${current}`);

            if (current === goal) {
                console.log("Meta alcanzada");
                return pasos.map(coord => coord.split(',').map(Number));
            }

            let progreso = false;

            for (let neighbor of this.adjacency[current] || []) {
                const tentativeG = gScore[current] + 1;

                if (tentativeG < (gScore[neighbor] ?? Infinity)) {
                    cameFrom[neighbor] = current;
                    gScore[neighbor] = tentativeG;
                    fScore[neighbor] = tentativeG + this.heuristic(neighbor, goal);

                    if (!visitados.has(neighbor) && !openSet.includes(neighbor)) {
                        openSet.push(neighbor);
                        console.log(`  → Añadido a la cola: ${neighbor}`);
                        progreso = true;
                    }
                }
            }

            if (!progreso && cameFrom[current]) {
                pasos.push(cameFrom[current]);
                console.log(`  → Sin progreso. Regresando a: ${cameFrom[current]}`);
            }
        }

        console.log("No se encontró un camino");
        return pasos.map(coord => coord.split(',').map(Number));
    }


    dijkstra(start, goal) {
        const distances = { [start]: 0 };
        const visited = new Set();
        const cameFrom = {};
        const queue = [start];
        const nodosVisitados = [];

        console.log(`Iniciando Dijkstra desde ${start} hasta ${goal}`);

        while (queue.length > 0) {
            // Ordenar por distancia acumulada
            queue.sort((a, b) => (distances[a] ?? Infinity) - (distances[b] ?? Infinity));
            const current = queue.shift();

            if (visited.has(current)) continue;
            visited.add(current);
            nodosVisitados.push(current);
            console.log(`Explorando nodo: ${current}, distancia: ${distances[current]}`);

            if (current === goal) {
                console.log("Meta alcanzada");
                return nodosVisitados.map(coord => coord.split(',').map(Number));
            }

            for (let neighbor of this.adjacency[current] || []) {
                const tentative = (distances[current] ?? Infinity) + 1; // Peso uniforme
                console.log(`  Evaluando vecino: ${neighbor}, distancia tentativa: ${tentative}`);

                if (tentative < (distances[neighbor] ?? Infinity)) {
                    distances[neighbor] = tentative;
                    cameFrom[neighbor] = current;
                    queue.push(neighbor);
                    console.log(`  → Distancia actualizada. Nuevo valor: ${tentative}`);
                }
            }
        }

        console.log("No se encontró un camino");
        return nodosVisitados.map(coord => coord.split(',').map(Number));
    }


    dijkstraConRegresos(start, goal) {
        const distances = { [start]: 0 };
        const cameFrom = {};
        const visited = new Set();
        const pasos = [];

        const queue = [start];

        while (queue.length > 0) {
            // Elegir el nodo con menor distancia acumulada
            queue.sort((a, b) => (distances[a] ?? Infinity) - (distances[b] ?? Infinity));
            const current = queue.shift();

            pasos.push(current);
            visited.add(current);
            console.log(`Explorando nodo: ${current}`);

            if (current === goal) {
                console.log("Meta alcanzada");
                return pasos.map(c => c.split(',').map(Number));
            }

            let progreso = false;

            for (let neighbor of this.adjacency[current] || []) {
                const alt = distances[current] + 1;

                if (alt < (distances[neighbor] ?? Infinity)) {
                    distances[neighbor] = alt;
                    cameFrom[neighbor] = current;

                    if (!visited.has(neighbor) && !queue.includes(neighbor)) {
                        queue.push(neighbor);
                        progreso = true;
                        console.log(`  → Añadido vecino: ${neighbor} con distancia: ${alt}`);
                    }
                }
            }

            // Simular retroceso si no hubo progreso
            if (!progreso && cameFrom[current]) {
                pasos.push(cameFrom[current]);
                console.log(`  → Sin progreso. Regresando a: ${cameFrom[current]}`);
            }
        }

        console.log("No se encontró un camino");
        return pasos.map(c => c.split(',').map(Number));
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
