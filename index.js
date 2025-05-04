let scena = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Luz y modelo
const ambientLight = new THREE.AmbientLight(0x404040, 3);
scena.add(ambientLight);

const loader = new THREE.GLTFLoader();
let gltfModel = null;
loader.load('Bob.glb', function (gltf) {
  gltfModel = gltf.scene;
  scena.add(gltf.scene);
});

// Celdas actuales 
let celdas = [];
let positionPlayer = {}

// Función para generar el tablero
function cargarTablero(json) {
  const size = 1;
  // Limpiar celdas anteriores
  celdas.forEach(c => scena.remove(c));
  celdas = [];

  for (let y = 0; y < json.alto; y++) {
    for (let x = 0; x < json.ancho; x++) {
      let color = "#ff5c28";

      if (x === json.inicio[0] && y === json.inicio[1]) {
        color = "#00ff00"; // verde
        positionPlayer.x =  json.inicio[0]
        positionPlayer.y =  json.inicio[1]
      } else if (x === json.fin[0] && y === json.fin[1]) {
        color = "#ff0000"; 
      } else if (json.paredes.some(p => p[0] === x && p[1] === y)) {
        color = "#666666"; 
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
  camera.position.z = json.alto + 2;
  camera.position.y = 9;
  camera.position.x =  json.ancho/2
  camera.rotation.x = -1
}

// Render loop
function render() {
  if (gltfModel) {
    gltfModel.position.x = positionPlayer.x
    gltfModel.position.y = positionPlayer.y
    gltfModel.rotation.y += 0.01;
  }
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
  
      } catch (err) {
        alert("El archivo no es un JSON válido.");
      }
    };
    reader.readAsText(file);

});

document.getElementById("empezarButtom").addEventListener("click", function() {

    positionPlayer.x += 1
    //positionPlayer.y += 1

})
