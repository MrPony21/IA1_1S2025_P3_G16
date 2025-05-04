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
loader.load('car.glb', function (gltf) {
    gltfModel = gltf.scene;
    gltfModel.scale.set(0.1, 0.1, 0.1);
    scena.add(gltf.scene);
});

const loader2 = new THREE.GLTFLoader();
let gltfModel2 = null;
loader.load('cityWall2.glb', function(gltf) {
    gltfModel2 = gltf.scene;
    gltfModel2.scale.set(0.5, 0.5, 0.5);
    //prueba()
})



// Celdas actuales
let jsonActual; 
let celdas = [];
let positionPlayer = {}
let positionPlayerFinal = {}
let paredes = []
let route = []
// Función para generar el tablero
function cargarTablero(json) {
    console.log("el json",json)
  const size = 1;
  // Limpiar celdas anteriores
  celdas.forEach(c => scena.remove(c));
  celdas = [];
  paredes.forEach(p => scena.remove(p))
  paredes = []

  for (let y = 0; y < json.alto; y++) {
    for (let x = 0; x < json.ancho; x++) {
      let color = "#6d6d6d";

      const isInicio = x === json.inicio[0] && y === json.inicio[1];
      const isFin = x === json.fin[0] && y === json.fin[1];
      const isPared = json.paredes.some(p => p[0] === x && p[1] === y);

      if (isInicio) {
        color = "#00ff00"; // verde
        positionPlayer.x =  json.inicio[0]
        positionPlayer.y =  json.inicio[1]
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



    }
  }

  // Centrar la cámara sobre el tablero
  let y_pos = 0
  if (json.alto < 7){
    y_pos = 8
  }else{ 
    y_pos = 12
  }

  camera.position.z = json.alto;
  camera.position.y = y_pos;
  camera.position.x =  json.ancho/2
  camera.rotation.x = -1.2
}


function moveTowards(target, current, speed = 0.02) {
    if (Math.abs(target - current) < speed) return target;
    return current + Math.sign(target - current) * speed;
  }

// Render loop
function render() {
  if (gltfModel) {
    //gltfModel.position.x = positionPlayer.x    
    gltfModel.position.y = positionPlayer.y
    gltfModel.rotation.y += 0.01;

    if (positionPlayerFinal.x !== undefined && positionPlayerFinal.y !== undefined) {
        gltfModel.position.x = moveTowards(positionPlayerFinal.x, gltfModel.position.x);
        gltfModel.position.z = moveTowards(positionPlayerFinal.y, gltfModel.position.z); 
    }


    
  }

//   if(gltfModel2){
//     paredes.forEach(element => {
//         gltfModel2.position.x = element.x
//         gltfModel2.position.z = element.y
//     });

//   }

  requestAnimationFrame(render);
  renderer.render(scena, camera);
}
render();



document.getElementById("cargarButtom").addEventListener("click", function() {
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
  
      } catch (err) {
        alert("El archivo no es un JSON válido.");
      }
    };
    reader.readAsText(file);

});

document.getElementById("empezarButtom").addEventListener("click", function() {

    const opcion = document.getElementById("algoritmoSelect").value
    console.log(opcion)
   // positionPlayer.x += 1
    g = new Graph();
    g.buildFromGrid(jsonActual);        
    const inicio = jsonActual.inicio.join(","); 
    const fin = jsonActual.fin.join(",");       

    if(opcion === "BFS"){
        const camino = g.bfs(inicio, fin);
        console.log("Camino encontrado por bfs:", camino);
        route = camino
    }else if(opcion === "DFS"){

    }else if (opcion === "STAR"){

    }
})

document.getElementById("atrasButtom").addEventListener("click", function () {
    // Acción para mover hacia atrás
    console.log("Mover hacia atrás");

  });
  
  let position = 1
  document.getElementById("adelanteButtom").addEventListener("click", function () {
    // Acción para mover hacia adelante
    console.log("Mover hacia adelante");
    console.log(route[1][0])
   if(!route || position >= route.length) return;

   positionPlayerFinal.x = route[position][0]
    positionPlayerFinal.y = route[position][1]
    position++;

    console.log(positionPlayerFinal)

  });

function prueba(){

    
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
