import { Injectable, effect } from '@angular/core';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { FloatingEquipment } from '../../classes/FloatingEquipment';
import { ConfigService } from '../config/config.service';
import { FrameRateLimiterService } from '../frameRateLimiter/frame-rate-limiter.service';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ThreeSceneService {
    private scene!: THREE.Scene
    private camera!: THREE.PerspectiveCamera
    private renderer!: THREE.WebGLRenderer
    private rayCaster = new THREE.Raycaster()
    private pointer = new THREE.Vector2()
    private floatingEquipments: FloatingEquipment[] = []
    private composer!: EffectComposer
    private outlinePass!: OutlinePass
    private outputPass!: OutputPass
    private objectsLoaded = 0
    private running = false
    private loaded = false
    loadedSubject = new Subject<boolean>()
    private themeEffect = effect(() => {
        this.configService.theme()
        if(this.scene) {
            this.changeSceneBackground(this.configService.theme())
        }
    })

    constructor(private frameRateLimiterService: FrameRateLimiterService, private configService: ConfigService) { }

    create(): void {
        
        const canvas = document.getElementById('threeScene') as HTMLCanvasElement
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 2000)
        this.renderer = new THREE.WebGLRenderer({ canvas: canvas })

        // inganno il renderer per essere sicuro di avere i modelli gltf caricati con le texture giuste anche col resize
        this.renderer.setSize(1406.25, 1054.6875)
        this.renderer.shadowMap.enabled = true
        this.camera.position.set(-2.976, -5.309, 4.389)
        const controls = new OrbitControls(this.camera, this.renderer.domElement)
        controls.enabled = false

        const ambientLight = new THREE.AmbientLight(0xffffff, 1)
        this.scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
        directionalLight.castShadow = true
        directionalLight.shadow.mapSize.width = 1024
        directionalLight.shadow.mapSize.height = 1024
        directionalLight.position.set(0, -2, 10)
        this.scene.add(directionalLight)

        // const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
        // this.scene.add(directionalLightHelper)

        const planeGeometry = new THREE.PlaneGeometry(100, 100)
        const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.2 })
        const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
        planeMesh.receiveShadow = true
        planeMesh.name = 'basePlane'
        this.scene.add(planeMesh)

        this.changeSceneBackground(this.configService.theme())

        this.loadModel('assets/models/kettlebell/scene.gltf', 0.9, -3, 2, 0.3, 0.005, 0.0045, 0.001)
        this.loadModel('assets/models/dumbell/scene.gltf', -1, -1.6, 3, 0.65, 0.004, 0.004, 0.001)
        this.loadModel('assets/models/dumbellHigh/scene.gltf', -2, -3.6, 2.7, 6.5, 0.002, 0.0018, 0.001)
        this.loadModel('assets/models/shaker/scene.gltf', 4, 2, 5, 1.5, 0.001, 0.01, 0.001)

        this.composer = new EffectComposer(this.renderer)
        const renderPass = new RenderPass(this.scene, this.camera)
        this.composer.addPass(renderPass)
        this.outlinePass = new OutlinePass(new THREE.Vector2(canvas.offsetWidth, canvas.offsetHeight), this.scene, this.camera)
        this.outlinePass.edgeStrength = 3.0;
        this.outlinePass.edgeGlow = 1.0;
        this.outlinePass.edgeThickness = 3.0;
        this.outlinePass.pulsePeriod = 0;
        this.outlinePass.usePatternTexture = false; // patter texture for an object mesh
        this.outlinePass.visibleEdgeColor.set("#1abaff"); // set basic edge color
        this.outlinePass.hiddenEdgeColor.set("#1abaff"); // set edge color when it hidden by other objects
        this.outlinePass.overlayMaterial.blending = THREE.CustomBlending // per evitare che su superfici bianche non si veda l'outline 
        this.composer.addPass(this.outlinePass);
        this.outputPass = new OutputPass()
        this.composer.addPass(this.outputPass)

        // this.composer.render()
        // this.animateScene()

        canvas.addEventListener('pointermove', e => { this.onPointerMove(e) })
        canvas.addEventListener('click', e => { this.onPointerClick(e) })
        window.addEventListener('resize', () => { this.onWindowResize() })

        //chiamo subito la funzione resize e termino l'inganno
        this.onWindowResize()
    }

    private animateScene() {
        if (this.running && this.frameRateLimiterService.needToRender()) {
            this.floatingEquipments.forEach(equip => {
                equip.rotate()
            })
            this.composer.render()
        }
        requestAnimationFrame(() => this.animateScene())
    }

    private loadModel(url: string, x: number, y: number, z: number, scale: number, xSpeed: number, ySpeed: number, zSpeed: number) {
        const loader = new GLTFLoader()
        loader.load(url, gltf => {
            const objectScene = gltf.scene
            objectScene.traverse(node => {
                if (node instanceof THREE.Mesh) {
                    node.castShadow = true
                    node.receiveShadow = true
                }
            })
            objectScene.position.set(x, y, z)
            objectScene.scale.set(scale, scale, scale)
            this.floatingEquipments.push(new FloatingEquipment(objectScene, xSpeed, ySpeed, zSpeed))
            this.scene.add(objectScene)
            this.objectsLoaded++;
            this.renderer.domElement.parentElement?.classList.remove('pointer-events-none')
            this.checkIfSceneIsFullyLoaded()
        })
    }

    private changeSceneBackground(theme: string) {
        switch (theme) {
            case 'light':
                this.scene.background = new THREE.Color(0xffffff)
                break
            case 'garden':
                this.scene.background = new THREE.Color(0xe9e7e7)
                break
            case 'retro':
                this.scene.background = new THREE.Color(0xece3ca)
                break
            case 'dark':
                this.scene.background = new THREE.Color(0x1d232a)
                break
            case 'dracula':
                this.scene.background = new THREE.Color(0x282a36)
                break
            case 'coffee':
                this.scene.background = new THREE.Color(0x20161f)
                break
        }
    }

    private onPointerMove(event: MouseEvent) {

        const canvasBounds = this.renderer.domElement.getBoundingClientRect()
        this.pointer.x = ((event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1;
        this.pointer.y = - (((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 - 1);

        this.rayCaster.setFromCamera(this.pointer, this.camera)
        const selectedObjects: THREE.Object3D<THREE.Object3DEventMap>[] = []
        const intersects = this.rayCaster.intersectObjects(this.scene.children)
        if (intersects.length > 0 && intersects[0].object.name != 'basePlane') {
            document.body.style.cursor = 'pointer'
            const parent = this.getParent(intersects[0].object)
            parent.traverse(node => {

                if (node instanceof THREE.Mesh && node.material instanceof THREE.MeshStandardMaterial) {
                    selectedObjects.push(node)
                }
            })
            this.outlinePass.selectedObjects = selectedObjects
        } else {
            document.body.style.cursor = 'auto'
            this.outlinePass.selectedObjects = []
        }
    }

    private getParent(obj: THREE.Object3D): THREE.Object3D {
        let result = obj
        if (obj.parent && obj.parent.type != 'Scene') {
            result = this.getParent(obj.parent as THREE.Object3D)
        }
        return result
    }

    private getFloatingEquipmentFromObject(obj: THREE.Group<THREE.Object3DEventMap> | THREE.Object3D<THREE.Object3DEventMap>) {
        let result: FloatingEquipment | null = null
        for (let i = 0; i < this.floatingEquipments.length && !result; i++) {
            if (this.floatingEquipments[i].object.id == obj.id) {
                result = this.floatingEquipments[i]
            }
        }

        return result
    }

    private onPointerClick(event: MouseEvent) {
        const canvasBounds = this.renderer.domElement.getBoundingClientRect()
        this.pointer.x = ((event.clientX - canvasBounds.left) / (canvasBounds.right - canvasBounds.left)) * 2 - 1;
        this.pointer.y = - (((event.clientY - canvasBounds.top) / (canvasBounds.bottom - canvasBounds.top)) * 2 - 1);

        this.rayCaster.setFromCamera(this.pointer, this.camera)
        const selectedObjects: THREE.Object3D<THREE.Object3DEventMap>[] = []
        const intersects = this.rayCaster.intersectObjects(this.scene.children)
        if (intersects.length > 0 && intersects[0].object.name != 'basePlane') {
            const parent = this.getParent(intersects[0].object)
            const equip = this.getFloatingEquipmentFromObject(parent)
            equip?.clicked()
        }
    }

    private onWindowResize() {
        const canvas = this.composer.renderer.domElement
        canvas.width = canvas.parentElement?.offsetWidth as number
        canvas.height = canvas.parentElement?.offsetHeight as number
        canvas.style.width = canvas.width + 'px'
        canvas.style.height = canvas.height + 'px'

        this.camera.aspect = canvas.width / canvas.height
        this.camera.updateProjectionMatrix()

        this.composer.renderer.setSize(canvas.width, canvas.height)
    }

    private checkIfSceneIsFullyLoaded() {
        if (this.objectsLoaded >= 4) {
            this.loaded = true
            this.loadedSubject.next(true)
            this.running = true
            this.animateScene()
        }
    }

    stop() {
        if(this.camera && this.renderer) {
            this.camera.position.set(10000, 10000, 10000)
            this.running = false
            this.renderer.domElement.style.opacity = "0";
            (this.renderer.domElement.parentElement as HTMLElement).style.pointerEvents = 'none'
        }
    }

    start() {
        this.camera.position.set(-2.976, -5.309, 4.389)
        this.running = true
        this.renderer.domElement.style.opacity = "1";
        (this.renderer.domElement.parentElement as HTMLElement).style.pointerEvents = ''
    }

    isLoaded() {
        return this.loaded
    }
}
