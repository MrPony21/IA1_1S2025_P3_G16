
const mapa = {
    ancho: 5,
    alto: 5,
    inicio: [0, 0],
    fin: [4, 4],
    paredes: [
      [0, 4],
      [1, 0],
      [1, 1],
      [1, 2],
      [2, 4],
      [3, 1],
      [3, 2],
      [3, 3],
      [3, 4]
    ]
  };








g = new Graph();
g.buildFromGrid(mapa);


g.showGraph();

const inicio = mapa.inicio.join(","); // "0,0"
const fin = mapa.fin.join(",");       // "4,4"

const camino = g.bfs(inicio, fin);
console.log("Camino encontrado por bfs:", camino);

const camino2 = g.dfs(inicio, fin);
console.log("Camino encontrado por dfs:", camino);


const caminoA = g.aStar(inicio, fin);
console.log("Camino A*:", caminoA);