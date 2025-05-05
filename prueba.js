
const mapa = {
  "ancho": 10,
  "alto": 10,
  "inicio": [1, 0],
  "fin": [1, 9],
  "paredes": [
    [0, 0],         [2, 0], [3, 0], [4, 0], [5, 0],         [7, 0], [8, 0], [9, 0],  
    [0, 1],                                                                 [9, 1],
    [0, 2],         [2, 2], [3, 2], [4, 2], [5, 2],         [7, 2],         [9, 2],
    [0, 3],         [2, 3],         [4, 3], [5, 3],         [7, 3],
                                    [4, 4],                 [7, 4],         [9, 4],
    [0, 5], [1, 5], [2, 5], [3, 5], [4, 5],         [6, 5], [7, 5],         [9, 5],
                                    [4, 6], [5, 6], [6, 6],                 [9, 6],
    [0, 7], [1, 7], [2, 7],                                         [8, 7], [9, 7],
    [0, 8],                         [4, 8], [5, 8], [6, 8],                 [9, 8],
    [0, 9],         [2, 9], [3, 9], [4, 9], [5, 9], [6, 9], [7, 9],         [9, 9]
  ]
}


g = new Graph();
g.buildFromGrid(mapa);

const inicio = mapa.inicio.join(","); // "0,0"
const fin = mapa.fin.join(",");       // "4,4"

const camino = g.bfs(inicio, fin);
console.log("Camino encontrado por bfs:", camino);

const camino2 = g.dfs(inicio, fin);
console.log("Camino encontrado por dfs:", camino);


const caminoA = g.aStar(inicio, fin);
console.log("Camino A*:", caminoA);

const caminoB = g.aStarConRegresos(inicio, fin);
console.log("Camino b*:", caminoB);


const caminoD = g.dijkstra(inicio, fin);
console.log("Camino Dijkstra:", caminoD);

const caminoD2 = g.dijkstraConRegresos(inicio, fin);
console.log("Camino Dijkstra con regresos:", caminoD2);