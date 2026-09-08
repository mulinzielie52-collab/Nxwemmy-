// // Menu latéral
const drawer = document.getElementById('drawer');
document.getElementById('openMenuBtn').addEventListener('click', () => drawer.classList.add('open'));
document.getElementById('closeMenuBtn').addEventListener('click', () => drawer.classList.remove('open'));

// Gestion de l'import d'image (Photo de chat / image perso)
const fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    // 1. Appliquer l'image comme texture sur le cube 3D du site
    const reader = new FileReader();
    reader.onload = function(event) {
      const texture = new THREE.TextureLoader().load(event.target.result);
      objet3D.material = new THREE.MeshStandardMaterial({ map: texture });
    };
    reader.readAsDataURL(file);

    // 2. Proposer d'ouvrir ItsLitho pour l'impression 3D
    setTimeout(() => {
      const ouvrir = confirm("Photo chargée ! Veux-tu ouvrir ItsLitho pour la convertir en fichier 3D imprimable (.STL) ?");
      if (ouvrir) {
        window.open('https://itslitho.com/', '_blank');
      }
    }, 500);
  }
});

// Interactions liens et recherche
document.getElementById('linkOption').addEventListener('click', () => {
  const url = prompt("Lien de l'image :");
  if (url) {
    const texture = new THREE.TextureLoader().load(url);
    objet3D.material = new THREE.MeshStandardMaterial({ map: texture });
  }
});

document.getElementById('searchSubmit').addEventListener('click', () => {
  const query = document.getElementById('searchInput').value;
  if (query) alert("Recherche : " + query);
});

// Scène Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('canvas-container').appendChild(renderer.domElement);

// Lumières néon
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const lightCyan = new THREE.PointLight(0x00f2fe, 2, 10);
lightCyan.position.set(-3, 2, 2);
scene.add(lightCyan);

const lightMagenta = new THREE.PointLight(0xff007f, 2, 10);
lightMagenta.position.set(3, -2, 2);
scene.add(lightMagenta);

// Objet 3D
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshStandardMaterial({ color: 0x7928ca, roughness: 0.3 });
let objet3D = new THREE.Mesh(geometry, material);
scene.add(objet3D);

camera.position.z = 5;

// Animations / Emotes
let animationActive = 'rotation';
let temps = 0;

function jouerEmote(nom) {
  animationActive = nom;
  if (nom === 'reset') {
    objet3D.rotation.set(0, 0, 0);
    objet3D.position.set(0, 0, 0);
    objet3D.scale.set(1, 1, 1);
  }
}

function animate() {
  requestAnimationFrame(animate);
  temps += 0.05;

  if (animationActive === 'rotation') {
    objet3D.rotation.y += 0.02;
    objet3D.rotation.x += 0.01;
  } else if (animationActive === 'saut') {
    objet3D.position.y = Math.abs(Math.sin(temps)) * 1.5;
  } else if (animationActive === 'pulsation') {
    const scale = 1 + Math.sin(temps * 2) * 0.2;
    objet3D.scale.set(scale, scale, scale);
  }

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});