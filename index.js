let scena = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz y modelo
const ambientLight = new THREE.AmbientLight(0x404040, 3);
scena.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 10, 7);
scena.add(directionalLight);

const loader = new THREE.GLTFLoader();
let gltfModel = null;
loader.load('./models/car.glb', function (gltf) {
  gltfModel = gltf.scene;
  gltfModel.scale.set(0.1, 0.1, 0.1);
  scena.add(gltf.scene);
});

const loader2 = new THREE.GLTFLoader();
let gltfModel2 = null;
loader.load('./models/cityWall2.glb', function (gltf) {
  gltfModel2 = gltf.scene;
  gltfModel2.scale.set(0.5, 0.5, 0.5);
})

const loader3 = new THREE.GLTFLoader();
let gltfModel3 = null;
loader.load('./models/stoneWall.glb', function (gltf) {
  gltfModel3 = gltf.scene;
  gltfModel3.scale.set(0.68, 1, 4);
  //prueba()
  console.log("modelo",gltfModel3)

  const targetMesh = gltfModel3.getObjectByName("Wall_SecondAge_1");
  const targetMesh2 = gltfModel3.getObjectByName("Wall_SecondAge_2"); 
  gltfModel3.traverse((child) => {
    if (targetMesh && targetMesh.material) {
      console.log("MESHH", child.name)
      targetMesh.material = targetMesh.material.clone(); // Importante: clona para no afectar otros clones
      targetMesh.material.color.set("#686C7F"); // Color nuevo (puede ser string o THREE.Color)
    }
    if (targetMesh2 && targetMesh2.material) {
      console.log("MESHH", child.name)
      targetMesh2.material = targetMesh2.material.clone(); // Importante: clona para no afectar otros clones
      targetMesh2.material.color.set("#D9D9D9"); // Color nuevo (puede ser string o THREE.Color)
    }
  });


})

const loader4 = new THREE.GLTFLoader();
let gltfModel4 = null;
loader.load('./models/building.glb', function (gltf) {
  gltfModel4 = gltf.scene;
  gltfModel4.scale.set(2, 1, 2);
})


// Celdas actuales
let jsonActual;
let celdas = [];
let positionPlayer = {}
let positionPlayerFinal = {}
let paredes = []
let suelo = []
let route = []
let reiniciar = false
let camPredeterminado = {}
// Función para generar el tablero
function cargarTablero(json) {
  console.log("el json", json)
  const size = 1;
  // Limpiar celdas anteriores
  celdas.forEach(c => scena.remove(c));
  celdas = [];
  paredes.forEach(p => scena.remove(p))
  paredes = []

  let ocupados = []
  for (let y = 0; y < json.alto; y++) {
    for (let x = 0; x < json.ancho; x++) {
      let color = "#6d6d6d";

      const isInicio = x === json.inicio[0] && y === json.inicio[1];
      const isFin = x === json.fin[0] && y === json.fin[1];
      const isPared = json.paredes.some(p => p[0] === x && p[1] === y);

      if (isInicio) {
        color = "#00ff00"; // verde
        positionPlayer.x = json.inicio[0]
        positionPlayer.y = json.inicio[1]
        gltfModel.position.x = positionPlayer.x
        gltfModel.position.z = positionPlayer.y
      } else if (isFin) {
        color = "#ff0000";
      } else if (isPared) {
        color = "#666666";

        const clone = gltfModel2.clone()
        clone.position.set(x, 0, y)
        scena.add(clone);
        paredes.push(clone)

      }

      const geometry = new THREE.PlaneGeometry(size, size);
      const material = new THREE.MeshBasicMaterial({ color: color, side: THREE.DoubleSide });
      const cell = new THREE.Mesh(geometry, material);
      cell.rotation.x = -Math.PI / 2;
      cell.position.set(x * size, 0, y * size);
      scena.add(cell);
      celdas.push(cell);
      ocupados.push([x, y])

    }
  }

  // Centrar la cámara sobre el tablero
  let y_pos = 0
  if (json.alto < 7) {
    y_pos = 8
  } else {
    y_pos = 12
  }

  cargarSuelo(json, ocupados)

  camera.position.z = json.alto;
  camera.position.y = y_pos;
  camera.position.x = json.ancho / 2
  camera.rotation.x = -1.2

  camPredeterminado.z = json.alto;
  camPredeterminado.y = y_pos;
  camPredeterminado.x = json.ancho / 2
}

function cargarSuelo(json, ocupados) {
  console.log("entre")
  suelo.forEach(p => scena.remove(p))
  suelo = []


  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshBasicMaterial({ color: "#768294", side: THREE.DoubleSide });

  //esquinas
  const cellEsquina1 = new THREE.Mesh(geometry, material);
  cellEsquina1.rotation.x = -Math.PI / 2;
  cellEsquina1.position.set(- 1, 0, -1);
  scena.add(cellEsquina1)
  suelo.push(cellEsquina1)
  const cloneEsquina = gltfModel4.clone()
  cloneEsquina.position.set(- 1, 0, -1)
  scena.add(cloneEsquina);
  suelo.push(cloneEsquina)


  const cellEsquina2 = new THREE.Mesh(geometry, material);
  cellEsquina2.rotation.x = -Math.PI / 2;
  cellEsquina2.position.set(json.ancho, 0, -1);
  scena.add(cellEsquina2)
  suelo.push(cellEsquina2)
  const cloneEsquina2 = gltfModel4.clone()
  cloneEsquina2.position.set(json.ancho, 0, -1)
  scena.add(cloneEsquina2);
  suelo.push(cloneEsquina2)


  for (let x = 0; x < json.ancho; x++) {
    const clone = gltfModel3.clone()
    clone.position.set(x, 0.1, -1)
    scena.add(clone);
    suelo.push(clone)

    const cell = new THREE.Mesh(geometry, material);
    cell.rotation.x = -Math.PI / 2;
    cell.position.set(x, 0, -1);
    scena.add(cell)
    suelo.push(cell)
  }

  for (let y = 0; y < json.alto; y++) {
    const clone = gltfModel3.clone()
    clone.position.set(-1, 0.1, y)
    clone.rotation.y = 1.57
    scena.add(clone);
    suelo.push(clone)

    const cell = new THREE.Mesh(geometry, material);
    cell.rotation.x = -Math.PI / 2;
    cell.position.set(-1, 0, y);
    scena.add(cell)
    suelo.push(cell)


    const clone2 = gltfModel3.clone()
    clone2.position.set(json.ancho, 0.1, y)
    clone2.rotation.y = 1.57
    scena.add(clone2);
    suelo.push(clone2)

    const cell2 = new THREE.Mesh(geometry, material);
    cell2.rotation.x = -Math.PI / 2;
    cell2.position.set(json.ancho, 0, y);
    scena.add(cell2)
    suelo.push(cell2)
  }



  // for (let y = 0; y < json.alto + 20; y++) {
  //   for (let x = 0; x < json.ancho ; x++) {
  //     const isInicio = x === json.inicio[0] && y === json.inicio[1];
  //     const isFin = x === json.fin[0] && y === json.fin[1];
  //     const isPared = json.paredes.some(p => p[0] === x && p[1] === y);
  //     const isOcupado = ocupados.some(([ox, oy]) => ox === x && oy === y);
  //     if (!isOcupado) {
  //       const clone = gltfModel3.clone()
  //       clone.position.set(x, 0.1, y)
  //       scena.add(clone);
  //       suelo.push(clone)
  //     }
  //   }
  // }


  // for (let y = -20; y < 0; y++) {
  //   for (let x = -20; x < 0; x++) {
  //       const clone = gltfModel3.clone()
  //       clone.position.set(x, 0.1, y)
  //       scena.add(clone);
  //       suelo.push(clone)
  //   }
  // }


}


function moveTowards(target, current, speed = 0.02) {
  if (Math.abs(target - current) < speed) return target;
  return current + Math.sign(target - current) * speed;
}

// Render loop
function render() {
  if (gltfModel) {
    gltfModel.position.y = positionPlayer.y;

    if (reiniciar) {
      reiniciar = false;
      gltfModel.position.x = positionPlayer.x;
      gltfModel.position.z = positionPlayer.y;
    }

    if (positionPlayerFinal.x !== undefined && positionPlayerFinal.y !== undefined) {
      const currentX = gltfModel.position.x;
      const currentZ = gltfModel.position.z;
      const targetX = positionPlayerFinal.x;
      const targetZ = positionPlayerFinal.y;

      // Calcular dirección del movimiento
      const dx = targetX - currentX;
      const dz = targetZ - currentZ;

      // Solo girar si hay movimiento
      if (dx !== 0 || dz !== 0) {
        const angle = Math.atan2(dx, dz); // Nota: atan2(dx, dz) para orientar correctamente en Y
        gltfModel.rotation.y = angle  + Math.PI;
      }

      // Movimiento suave
      gltfModel.position.x = moveTowards(targetX, currentX);
      gltfModel.position.z = moveTowards(targetZ, currentZ);
    }
  }

  requestAnimationFrame(render);
  renderer.render(scena, camera);
}

render();



document.getElementById("cargarButtom").addEventListener("click", function () {
  document.getElementById("fileInput").click();
});


document.getElementById("fileInput").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const jsonData = JSON.parse(e.target.result);
      console.log("JSON cargado:", jsonData);
      cargarTablero(jsonData)
      jsonActual = jsonData
      cargarAlgoritmo()

    } catch (err) {
      alert("El archivo no es un JSON válido.");
    }
  };
  reader.readAsText(file);

});

document.getElementById("empezarButtom").addEventListener("click", function () {
  cargarAlgoritmo()
})

let position = 1
function cargarAlgoritmo() {
  const opcion = document.getElementById("algoritmoSelect").value
  console.log(opcion)
  //reiniciamos la posicion incial
  positionPlayer.x = jsonActual.inicio[0]
  positionPlayer.y = jsonActual.inicio[1]
  positionPlayerFinal.x = undefined
  positionPlayerFinal.y = undefined
  position = 1;
  reiniciar = true

  g = new Graph();
  g.buildFromGrid(jsonActual);
  const inicio = jsonActual.inicio.join(",");
  const fin = jsonActual.fin.join(",");

  if (opcion === "BFS") {
    const camino = g.bfs(inicio, fin);
    console.log("Camino encontrado por bfs:", camino);
    route = camino
    alert("Algoritmo BFS cargado")
  } else if (opcion === "DIKSTRARETROCESO") {
    const camino2 = g.dijkstraConRegresos(inicio, fin);
    console.log("Camino encontrado por DIKSTRARETROCESO:", camino2);
    route = camino2
    alert("Algoritmo DIKSTRARETROCESO / cargado")


  } else if (opcion === "DIKSTRA") {
    const camino3 = g.dijkstra(inicio, fin);
    console.log("Camino encontrado por DIJKSTRA:", camino3);
    route = camino3
    alert("Algoritmo DIKSTRA / cargado")

  } else if (opcion === "STARRETROCESO"){ 
    const camino4 = g.aStarConRegresos(inicio, fin);
    console.log("Camino encontrado por STARRETROCESO:", camino4);
    route = camino4
    alert("Algoritmo STARRETROCESO / cargado")

  } else if (opcion === "STAR") {
    const caminoA = g.aStar(inicio, fin);
    console.log("Camino A*:", caminoA);
    alert("Algoritmo STAR cargado")
    route = caminoA
  }
}



document.getElementById("atrasButtom").addEventListener("click", function () {
  console.log("Mover hacia atrás");
  // Nos aseguramos de no ir más allá del inicio
  if (!route || position <= 1) return;

  position--;
  positionPlayerFinal.x = route[position - 1][0];
  positionPlayerFinal.y = route[position - 1][1];

  console.log("Posición final:", positionPlayerFinal);
});

document.getElementById("adelanteButtom").addEventListener("click", function () {
  console.log("Mover hacia adelante");
  if (!route || position >= route.length) return;

  positionPlayerFinal.x = route[position][0]
  positionPlayerFinal.y = route[position][1]
  position++;

  console.log(positionPlayerFinal)

});

document.getElementById("camLeft").addEventListener("click", () => {
  camera.position.x -= 1;
});

document.getElementById("camRight").addEventListener("click", () => {
  camera.position.x += 1;
});

document.getElementById("camUp").addEventListener("click", () => {
  camera.position.z -= 1;
});

document.getElementById("camDown").addEventListener("click", () => {
  camera.position.z += 1;
});

document.getElementById("camReset").addEventListener("click", () => {
  camera.position.set(camPredeterminado.x, camPredeterminado.y, camPredeterminado.z); // ajusta según tus valores por defecto
});

function prueba() {


  const json2 = {
    "ancho": 5,
    "alto": 5,
    "inicio": [0, 0],
    "fin": [4, 4],
    "paredes": [
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
  }

  cargarTablero(json2)
}
