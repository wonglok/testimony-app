import { Object3D } from "three";
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { sceneToCollider } from "./sceneToCollider";
import { AvatarSelf } from "./AvatarSelf";



export class Game extends Object3D {

    constructor({ glb, camera, controls }) {
        super()

        const params = {

            firstPerson: false,

            displayCollider: false,
            displayBVH: false,
            visualizeDepth: 10,
            gravity: - 30,
            playerSpeed: 10,
            physicsSteps: 5,

        };

        let self = this


        this.camera = camera

        let clock;
        clock = new THREE.Clock();
        let collider, player;
        let playerIsOnGround = false;
        let keyboardState = {}
        keyboardState.fwdPressed = false;
        keyboardState.bkdPressed = false;
        keyboardState.lftPressed = false;
        keyboardState.rgtPressed = false;

        let playerVelocity = new THREE.Vector3();
        let upVector = new THREE.Vector3(0, 1, 0);
        let tempVector = new THREE.Vector3();
        let tempVector2 = new THREE.Vector3();
        let tempBox = new THREE.Box3();
        let tempMat = new THREE.Matrix4();
        let tempSegment = new THREE.Line3();

        // character
        player = new THREE.Mesh(
            new RoundedBoxGeometry(1.0, 2.0, 1.0, 10, 0.5),
            new THREE.MeshStandardMaterial()
        );
        this.player = player
        player.geometry.translate(0, - 0.5, 0);
        player.capsuleInfo = {
            radius: 0.5,
            segment: new THREE.Line3(new THREE.Vector3(), new THREE.Vector3(0, - 1.0, 0.0))
        };
        player.castShadow = true;
        player.receiveShadow = true;
        player.material.shadowSide = 2;

        // self.add(player);
        reset();

        controls.rotateSpeed = -1
        controls.enableDamping = true

        function reset() {

            playerVelocity.set(0, 0, 0);
            player.position.set(0, 2, 0);

            controls.object.position.set(0, 5, 10)
            controls.target.set(0, 1, 0)

            camera.position.sub(controls.target);
            controls.target.copy(player.position);
            camera.position.add(player.position);
            controls.update();
        }

        function keyboard() {
            let hhkeyDown = function (e) {

                switch (e.code) {

                    case 'KeyW': keyboardState.fwdPressed = true; break;
                    case 'KeyS': keyboardState.bkdPressed = true; break;
                    case 'KeyD': keyboardState.rgtPressed = true; break;
                    case 'KeyA': keyboardState.lftPressed = true; break;
                    case 'Space':
                        if (playerIsOnGround) {

                            playerVelocity.y = 20.0;
                            playerIsOnGround = false;

                        }

                        break;

                }

            }

            let hhKeyUp = function (e) {

                switch (e.code) {

                    case 'KeyW': keyboardState.fwdPressed = false; break;
                    case 'KeyS': keyboardState.bkdPressed = false; break;
                    case 'KeyD': keyboardState.rgtPressed = false; break;
                    case 'KeyA': keyboardState.lftPressed = false; break;

                }

            }

            window.addEventListener('keydown', hhkeyDown);
            window.addEventListener('keyup', hhKeyUp);

            return () => {
                window.removeEventListener('keydown', hhkeyDown);
                window.removeEventListener('keyup', hhKeyUp);
            }
        }

        function updatePlayer(delta) {

            if (playerIsOnGround) {

                playerVelocity.y = delta * params.gravity;

            } else {

                playerVelocity.y += delta * params.gravity;

            }

            player.position.addScaledVector(playerVelocity, delta);

            // move the player
            const angle = controls.getAzimuthalAngle();

            if (keyboardState.fwdPressed) {

                tempVector.set(0, 0, - 1).applyAxisAngle(upVector, angle);
                player.position.addScaledVector(tempVector, params.playerSpeed * delta);

            }

            if (keyboardState.bkdPressed) {

                tempVector.set(0, 0, 1).applyAxisAngle(upVector, angle);
                player.position.addScaledVector(tempVector, params.playerSpeed * delta);

            }

            if (keyboardState.lftPressed) {

                tempVector.set(0, 0, -1).applyAxisAngle(upVector, angle + Math.PI / 2);
                player.position.addScaledVector(tempVector, params.playerSpeed * delta);

            }

            if (keyboardState.rgtPressed) {

                tempVector.set(0, 0, -1).applyAxisAngle(upVector, angle - Math.PI / 2);
                player.position.addScaledVector(tempVector, params.playerSpeed * delta);

            }
            player.rotation.y = angle;

            player.updateMatrixWorld();

            // adjust player position based on collisions
            const capsuleInfo = player.capsuleInfo;
            tempBox.makeEmpty();
            tempMat.copy(collider.matrixWorld).invert();
            tempSegment.copy(capsuleInfo.segment);

            // get the position of the capsule in the local space of the collider
            tempSegment.start.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat);
            tempSegment.end.applyMatrix4(player.matrixWorld).applyMatrix4(tempMat);

            // get the axis aligned bounding box of the capsule
            tempBox.expandByPoint(tempSegment.start);
            tempBox.expandByPoint(tempSegment.end);

            tempBox.min.addScalar(- capsuleInfo.radius);
            tempBox.max.addScalar(capsuleInfo.radius);

            collider.geometry.boundsTree.shapecast({

                intersectsBounds: box => box.intersectsBox(tempBox),

                intersectsTriangle: tri => {

                    // check if the triangle is intersecting the capsule and adjust the
                    // capsule position if it is.
                    const triPoint = tempVector;
                    const capsulePoint = tempVector2;

                    const distance = tri.closestPointToSegment(tempSegment, triPoint, capsulePoint);
                    if (distance < capsuleInfo.radius) {

                        const depth = capsuleInfo.radius - distance;
                        const direction = capsulePoint.sub(triPoint).normalize();

                        tempSegment.start.addScaledVector(direction, depth);
                        tempSegment.end.addScaledVector(direction, depth);

                    }

                }

            });

            // get the adjusted position of the capsule collider in world space after checking
            // triangle collisions and moving it. capsuleInfo.segment.start is assumed to be
            // the origin of the player model.
            const newPosition = tempVector;
            newPosition.copy(tempSegment.start).applyMatrix4(collider.matrixWorld);

            // check how much the collider was moved
            const deltaVector = tempVector2;
            deltaVector.subVectors(newPosition, player.position);

            // if the player was primarily adjusted vertically we assume it's on something we should consider ground
            playerIsOnGround = deltaVector.y > Math.abs(delta * playerVelocity.y * 0.25);

            const offset = Math.max(0.0, deltaVector.length() - 1e-5);
            deltaVector.normalize().multiplyScalar(offset);

            // adjust the player model
            player.position.add(deltaVector);

            if (!playerIsOnGround) {

                deltaVector.normalize();
                playerVelocity.addScaledVector(deltaVector, - deltaVector.dot(playerVelocity));

            } else {

                playerVelocity.set(0, 0, 0);

            }

            // adjust the camera
            camera.position.sub(controls.target);
            controls.target.copy(player.position);
            camera.position.add(player.position);

            // if the player has fallen too far below the level reset their position to the start
            if (player.position.y < - 25) {

                reset();

            }

        }

        let loops = []
        this.loop = () => {


            // stats.update();

            const delta = Math.min(clock.getDelta(), 0.1);

            if (params.firstPerson) {


                controls.minDistance = 1e-4;
                controls.maxDistance = 1e-4;

            } else {

                controls.minDistance = 1;
                controls.maxDistance = 100;

            }

            if (collider) {

                collider.visible = params.displayCollider;

                const physicsSteps = params.physicsSteps;

                for (let i = 0; i < physicsSteps; i++) {

                    updatePlayer(delta / physicsSteps);

                }

            }

            controls.update();

            let isNear = camera.position.distanceTo(player.position) >= 1.5

            player.visible = isNear

            if (isNear) {
                controls.maxPolarAngle = THREE.MathUtils.lerp(controls.maxPolarAngle, Math.PI / 2, 0.1)
            } else {
                controls.maxPolarAngle = THREE.MathUtils.lerp(controls.maxPolarAngle, Math.PI, 0.1)
            }


            loops.forEach(l => {
                return l()
            })
        }

        keyboard();

        sceneToCollider({ scene: glb.scene })
            .then(result => {
                collider = result
            });


        this.start = () => {
            this.add(glb.scene);
        }
        this.stop = () => {
            this.remove(glb.scene);
        }

        params.reset = reset

        let avatar = new AvatarSelf({
            parent: this,
            onLoop: (v) => {
                loops.push(v)
            }
        })

        this.add(avatar)


    }

}
