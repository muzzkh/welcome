import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import GUI from 'lil-gui';

import gsap from "gsap"
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(() => {
        material.color = new THREE.Color(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const fabricAO = textureLoader.load('/textures/Wood_Wicker_010_SD/Wood_Wicker_010_ambientOcclusion.jpg');
const fabricColor = textureLoader.load('/textures/Wood_Wicker_010_SD/Wood_Wicker_010_basecolor.jpg');
const fabricHeight = textureLoader.load('/textures/Wood_Wicker_010_SD/Wood_Wicker_010_height.jpg');
const fabricNormal = textureLoader.load('/textures/Wood_Wicker_010_SD/Wood_Wicker_010_normal.jpg');
const fabricRough = textureLoader.load('/textures/Wood_Wicker_010_SD/Wood_Wicker_010_roughness.jpg');
const fabricAlpha = textureLoader.load('/textures/Wood_Wicker_010_SD/Wood_Wicker_010_opacity.jpg')

fabricColor.colorSpace = THREE.SRGBColorSpace;
fabricColor.wrapS = THREE.RepeatWrapping;
fabricColor.wrapT = THREE.RepeatWrapping;

fabricAO.wrapS = THREE.RepeatWrapping;
fabricAO.wrapT = THREE.RepeatWrapping;

fabricHeight.wrapS = THREE.RepeatWrapping;
fabricHeight.wrapT = THREE.RepeatWrapping;

fabricNormal.wrapS = THREE.RepeatWrapping;
fabricNormal.wrapT = THREE.RepeatWrapping;

fabricRough.wrapS = THREE.RepeatWrapping;
fabricRough.wrapT = THREE.RepeatWrapping;


/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()




/**
 * Lights
 */

const directionalLight = new THREE.SpotLight("#ffffff", 50, 6, Math.PI*0.2, .2)
directionalLight.position.set(2, 1, 3)
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight('#ffffff', 1)
scene.add(ambientLight)
/**
 * Objects
 */
const material = new THREE.MeshPhysicalMaterial({
    
});
material.map = fabricColor
material.aoMap  = fabricAO;
material.aoMapIntensity = 1.7
material.displacementMap = fabricHeight;
material.displacementScale = .2
material.normalMap = fabricNormal
material.normalScale.set(0.9,0.9)
material.roughness = fabricRough;
material.transparent = true;
material.alphaMap = fabricAlpha;



material.wireframe = false;

const objectsDistance = 4;
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    material
)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(7,4,50,50),
    new THREE.MeshStandardMaterial({color: "orange"})

)

plane.receiveShadow = true;

sphere.castShadow = true;
sphere.receiveShadow = true;
directionalLight.castShadow = true;

const directionalLightHelper = new THREE.SpotLightHelper(directionalLight)

plane.rotation.x = -Math.PI*.3;
plane.position.set(0,-1,-1)
sphere
scene.add(plane)
scene.add(sphere)
// scene.add(mesh1)

const sectionMeshes = [sphere]
/**
 * Particles
 */
//Text
/**
 * Fonts
 */
const fontLoader = new FontLoader()
//Geometry
const particlesGeometry = new THREE.BufferGeometry()
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    size: 0.05,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

renderer.shadowMap.enabled = true;
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
/**
 * Cursor
 *
 */

const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})

const clock = new THREE.Clock()

let previousTime = 0
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    //anime meshes
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    for (const mesh of sectionMeshes){
        mesh.rotation.x += deltaTime * 0.05
        mesh.rotation.y += deltaTime * 0.07
        
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()