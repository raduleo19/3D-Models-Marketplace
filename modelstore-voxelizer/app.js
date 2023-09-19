import { JSDOM } from 'jsdom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/database.js';
import Product from './models/product.js';

connectDB();

import amqp from 'amqplib/callback_api.js';

import obj2gltf from "obj2gltf";

import path from 'path';
import os from 'os';
import fs from 'fs';
import util from 'util';
import request from 'request';
import { pipeline } from 'stream';

const { promisify } = util;
const pipelineAsync = promisify(pipeline);

const jsdom = new JSDOM();
const performance = jsdom.window.performance;
const { window } = jsdom;


global.THREE = THREE;
global.window = window;
global.ProgressEvent = window.ProgressEvent; // Define ProgressEvent

const rayCaster = new THREE.Raycaster();
var rayCasterIntersects;

const modelSize = 12;
const gridSize = .15;

function isInsideMesh(pos, dir, mesh) {
    rayCaster.set(pos, dir);
    rayCasterIntersects = rayCaster.intersectObject(mesh, false);

    return (rayCasterIntersects.length % 2 === 1 && rayCasterIntersects[0].distance <= 1.5 * gridSize);
}

async function voxelize(loader, model, next) {
    console.log('Voxelizing...');
    let voxels = [];

    loader.parse(model, '', (loadedModel) => {
        let importedScene = loadedModel.scene;
        const importedMeshes = [];
        importedScene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                importedMeshes.push(child);
            }
        });

        let boundingBox = new THREE.Box3().setFromObject(importedScene);
        const size = boundingBox.getSize(new THREE.Vector3());
        const scaleFactor = modelSize / size.length();
        const center = boundingBox.getCenter(new THREE.Vector3()).multiplyScalar(-scaleFactor);
        importedScene.scale.multiplyScalar(scaleFactor);
        importedScene.position.copy(center);

        boundingBox = new THREE.Box3().setFromObject(importedScene);
        boundingBox.min.z -= .5 * gridSize;

        for (let i = boundingBox.min.x; i < boundingBox.max.x; i += gridSize) {
            for (let j = boundingBox.min.y; j < boundingBox.max.y; j += gridSize) {
                for (let k = boundingBox.min.z; k < boundingBox.max.z; k += gridSize) {
                    for (let meshCnt = 0; meshCnt < importedMeshes.length; meshCnt++) {
                        const mesh = importedMeshes[meshCnt];
                        const pos = new THREE.Vector3(i, j, k);
                        const color = new THREE.Color();
                        const { h, s, l } = mesh.material.color.getHSL(color);
                        color.setHSL(h, s * .8, l * .8 + .2);

                        if (isInsideMesh(pos, { x: 0, y: 0, z: 1 }, mesh)) {
                            voxels.push({ color: color, position: pos });
                            break;
                        } else if (isInsideMesh(pos, { x: 0, y: 0, z: -1 }, mesh)) {
                            voxels.push({ color: color, position: pos });
                            break;
                        } else if (isInsideMesh(pos, { x: 0, y: 1, z: 0 }, mesh)) {
                            voxels.push({ color: color, position: pos });
                            break;
                        } else if (isInsideMesh(pos, { x: 0, y: -1, z: 0 }, mesh)) {
                            voxels.push({ color: color, position: pos });
                            break;
                        } else if (isInsideMesh(pos, { x: 1, y: 0, z: 0 }, mesh)) {
                            voxels.push({ color: color, position: pos });
                            break;
                        } else if (isInsideMesh(pos, { x: -1, y: 0, z: 0 }, mesh)) {
                            voxels.push({ color: color, position: pos });
                            break;
                        }
                    }
                }
            }
        }

        console.log('Voxelization done!');
        next(voxels);
    }, (error) => {
        console.error(error); // Logs any errors that occurred during parsing
    });
}

const gltfLoader = new GLTFLoader();

amqp.connect('amqp://rabbitmq', function (err, conn) {
    conn.createChannel(function (err, ch) {
        const queue = 'voxelize';

        ch.assertQueue(queue, { durable: false });

        ch.consume(queue, async function (msg) {
            let data = JSON.parse(msg.content.toString());

            let product = await Product.findById(data.productId);

            const tempFilePath = path.join(os.tmpdir(), product.name + '.obj');

            // Download the file from the bucket into a temp directory.
            await pipelineAsync(
                request(product.models),
                fs.createWriteStream(tempFilePath)
            );

            console.log(product)
            console.log(product.modelType)

            if (product.modelType == 'obj') {
                console.log("OBJ - Converting to gltf...")
                obj2gltf(tempFilePath).then(async function (gltf) {
                    console.log("Conversion succes!");

                    await voxelize(gltfLoader, gltf, async (voxels) => {
                        const updatedProduct = await Product.findByIdAndUpdate(data.productId, { voxels: voxels }, { new: true });
                        console.log(updatedProduct);
                    });

                    // Delete the file when done
                    fs.unlink(tempFilePath, (err) => {
                        if (err) throw err;
                        console.log('Temporary file was deleted');
                    });
                });
            } else if (product.modelType == 'gltf') {
                console.log("GLTF - Starting voxelize...")
                const gltf = fs.readFileSync(tempFilePath);

                await voxelize(gltfLoader, gltf, async (voxels) => {
                    const updatedProduct = await Product.findByIdAndUpdate(data.productId, { voxels: voxels }, { new: true });
                    console.log(updatedProduct);
                });

                // Delete the file when done
                fs.unlink(tempFilePath, (err) => {
                    if (err) throw err;
                    console.log('Temporary file was deleted');
                });
            } else if (product.modelType == 'glb') {
                console.log("GLB - Starting voxelize...")
                const glbBuffer = fs.readFileSync(tempFilePath);

                const gltf = Uint8Array.from(glbBuffer).buffer;

                await voxelize(gltfLoader, gltf, async (voxels) => {
                    const updatedProduct = await Product.findByIdAndUpdate(data.productId, { voxels: voxels }, { new: true });
                    console.log(updatedProduct);
                });

                // Delete the file when done
                fs.unlink(tempFilePath, (err) => {
                    if (err) throw err;
                    console.log('Temporary file was deleted');
                });
            }

        }, { noAck: true });
    });
});