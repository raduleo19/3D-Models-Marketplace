<template>
    <template v-if="this.loading">
        <div class="container-fluid d-flex align-items-center justify-content-center"
            style="min-height: calc(100vh - 54px);">
            <scaling-squares-spinner :animation-duration="1250" :size="65" color="#ff1d5e" />
        </div>
    </template>

    <section v-show="!this.loading" class="py-5 text-center container">
        <div class="row">
            <div class="col-lg-6">
                <Carousel :items-to-show="1" snap-align="center" :mouse-drag="false" :mouseDrag="false">
                    <Slide v-for="image in product.images" :key="image">
                        <img width="450" height="450" style=" object-fit: cover;" :src="image" alt="Product image" />
                    </Slide>
                    <Slide key="render">
                        <div class="d-flex justify-content-center mx-auto">
                            <div id="canvas-container" style="height: 450px; width: 450px;">
                                <canvas id="canvas" style="height: 450px; width: 450px;"></canvas>
                            </div>
                        </div>

                    </Slide>
                    <template #addons>
                        <Navigation />
                        <Pagination />
                    </template>
                </Carousel>
            </div>



            <div class="col-lg-6">
                <div class="product-details">
                    <h1 class="fw-light">{{ product.name }}</h1>

                    <p class="published-by">Published by: {{ this.name }}</p>
                    <div class="product-info">
                        <p>
                            <strong>Rating</strong>
                            <star-rating :star-size="20" v-model:rating="product.rating"></star-rating>
                        </p>
                        <p><strong>Description:</strong> {{ product.description }}</p>
                        <p><strong>Price:</strong> {{ product.price }} Tokens</p>
                    </div>
                    <button class="btn btn-lg btn-success btn-block mt-3" type="submit" v-on:click.prevent="handleOrder">Add
                        to cart!</button>
                </div>
            </div>
        </div>
    </section>
</template>
  
<style>
.product-details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    background-color: #f8f8f8;
    padding: 2rem;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-info {
    margin-top: 2rem;
    text-align: left;
}

.product-info p {
    font-size: 1.2rem;
    color: #333;
}

.published-by {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
}

.button-group {
    margin-top: 1.5rem;
}

.btn-like,
.btn-share {
    background-color: #007bff;
    color: #fff;
    margin-right: 1rem;
    padding: 0.75rem 2rem;
    border-radius: 5px;
    font-size: 1.2rem;
    transition: background-color 0.3s ease;
}

.btn-like:hover,
.btn-share:hover {
    background-color: #0069d9;
}
</style>
  
<script>


import 'vue3-carousel/dist/carousel.css';
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel';
import StarRating from 'vue-star-rating';
import axios from 'axios'; // Import axios for making API calls
import { ScalingSquaresSpinner } from 'epic-spinners'

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

let containerEl;
let canvasEl;
let renderer, scene, mainCamera, mainOrbit, lightHolder;
let instancedMesh, voxelGeometry, voxelMaterial;
let dummy;

let voxels = [];

const params = {
    boxSize: .2,
    boxRoundness: .05,
};

window.addEventListener('resize', updateSceneSize, { passive: true });

function createMainScene() {
    renderer = new THREE.WebGLRenderer({
        canvas: canvasEl,
        alpha: true,
        antialias: true,
    });

    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    scene = new THREE.Scene();

    mainCamera = new THREE.PerspectiveCamera(45, containerEl.clientWidth / containerEl.clientHeight, .01, 1000);
    mainCamera.position.set(0, .5, 2).multiplyScalar(8);

    dummy = new THREE.Object3D();

    const ambientLight = new THREE.AmbientLight(0xffffff, .3);
    scene.add(ambientLight);

    lightHolder = new THREE.Group();
    const topLight = new THREE.SpotLight(0xffffff, .2);
    topLight.position.set(0, 15, 2);
    topLight.castShadow = true;
    topLight.shadow.camera.near = 10;
    topLight.shadow.camera.far = 30;
    topLight.shadow.mapSize = new THREE.Vector2(2048, 2048);
    lightHolder.add(topLight);
    const sideLight = new THREE.SpotLight(0xffffff, .4);
    sideLight.position.set(0, -4, 5);
    lightHolder.add(sideLight);
    scene.add(lightHolder);

    mainOrbit = new OrbitControls(mainCamera, containerEl);
    mainOrbit.enablePan = false;
    mainOrbit.autoRotate = true;
    mainOrbit.minDistance = 5;
    mainOrbit.maxDistance = 40;
    mainOrbit.autoRotateSpeed *= .5;
    mainOrbit.enableDamping = true;

    voxelGeometry = new RoundedBoxGeometry(params.boxSize, params.boxSize, params.boxSize, 1, params.boxRoundness);
    voxelMaterial = new THREE.MeshLambertMaterial({});

    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const shadowPlaneMaterial = new THREE.ShadowMaterial({
        opacity: .1
    });
    const shadowPlaneMesh = new THREE.Mesh(planeGeometry, shadowPlaneMaterial);
    shadowPlaneMesh.position.y = -4;
    shadowPlaneMesh.rotation.x = -.5 * Math.PI;
    shadowPlaneMesh.receiveShadow = true;
    lightHolder.add(shadowPlaneMesh);
}

function loadModel() {
    createInstancedMesh(voxels.length);
    recreateVoxels();

    updateSceneSize();
    render();
}

function createInstancedMesh(cnt) {
    instancedMesh = new THREE.InstancedMesh(voxelGeometry, voxelMaterial, cnt);
    instancedMesh.castShadow = true;
    instancedMesh.receiveShadow = true;
    scene.add(instancedMesh);
}

function recreateVoxels() {
    for (let i = 0; i < voxels.length; i++) {
        let color = new THREE.Color();
        color.setHSL(voxels[i].color.h, voxels[i].color.s, voxels[i].color.l);

        instancedMesh.setColorAt(i, color);

        dummy.position.copy(voxels[i].position);
        dummy.updateMatrix();
        instancedMesh.setMatrixAt(i, dummy.matrix);
    }
    instancedMesh.instanceColor.needsUpdate = true;
    instancedMesh.instanceMatrix.needsUpdate = true;
}

function render() {
    mainOrbit.update();
    lightHolder.quaternion.copy(mainCamera.quaternion);
    renderer.render(scene, mainCamera);
    requestAnimationFrame(render);
}

function updateSceneSize() {
    mainCamera.aspect = containerEl.clientWidth / containerEl.clientHeight;
    mainCamera.updateProjectionMatrix();
    renderer.setSize(containerEl.clientWidth, containerEl.clientHeight);
}

export default {
    name: 'ProductDetailPage',
    components: {
        Carousel,
        Slide,
        Pagination,
        Navigation,
        StarRating,
        ScalingSquaresSpinner
    },
    data() {
        return {
            loading: 1,
            name: '',
            product: {} // Initialize an empty object for the product data
        };
    },
    mounted() {
        containerEl = document.querySelector('#canvas-container');
        canvasEl = document.querySelector('#canvas');
        this.fetchProductDetails();

    },
    methods: {
        async fetchProductDetails() {
            const productId = this.$route.params.id; // Get the product ID from the route parameter

            createMainScene();
            await axios.get(`http://localhost:8000/api/products/${productId}`)
                .then(response => {
                    this.product = response.data;
                    voxels = this.product.voxels;
                    this.name = this.product.publisher.name;
                    this.loading = 0;
                })
                .catch(error => {
                    console.error(error);
                });

            loadModel();
        }
    }
};
</script>