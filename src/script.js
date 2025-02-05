import * as THREE from 'three'

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
const gradientTexture = textureLoader.load('./textures/gradients/3.jpg')
gradientTexture.magFilter = THREE.NearestFilter

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

const directionalLight = new THREE.DirectionalLight('#fffff', 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)
/**
 * Objects
 */
const material = new THREE.MeshToonMaterial({ color: parameters.materialColor, gradientMap: gradientTexture })

const objectsDistance = 4;
const mesh1 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(.8, .35, 100, 16),
    material
)

mesh1.position.y = - objectsDistance * 0

mesh1.position.x = 2
scene.add(mesh1)

const sectionMeshes = [mesh1]
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