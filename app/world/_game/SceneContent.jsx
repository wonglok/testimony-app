'use client'

import { Box, Gltf, MapControls, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { Game } from "./Game";
import { useFrame, useThree } from "@react-three/fiber";
import meadow1k from '../_content/hdr/meadow1k.hdr'
import sceneURL from '../_content/church/church-visual.glb'
import lightingURL from '../_content/church/church-light.glb'
import { LightingFile } from "./LightingFile";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PerspectiveCamera } from "three";

export function SceneContent() {

    let scene = useThree(r => r.scene)
    let events = useThree(r => r.events)

    let glb = useGLTF(sceneURL)
    let dom = events.connected
    let [run, setRun] = useState({})
    useEffect(() => {
        if (!scene) {
            return
        }
        if (!dom) {
            return
        }

        let cloned = glb;

        let camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 500)
        let hh = () => {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
        }
        window.addEventListener('rezie', hh)

        let controls = new OrbitControls(camera, dom)
        let game = new Game({
            glb: cloned,
            camera,
            controls,
        })

        setRun(game)

        game.start();
        scene.add(game)
        scene.add(camera)

        return () => {
            camera.removeFromParent()
            window.removeEventListener('rezie', hh)
            controls.dispose()
            game.stop();
            game.removeFromParent()
        }
        //
    }, [scene, dom])

    useFrame(({ camera: systemCamera }) => {
        if (typeof run.render === 'function') {
            run.render()
            run.camera

            systemCamera.position.lerp(run.camera.position, 1.0)
            systemCamera.quaternion.slerp(run.camera.quaternion, 1.0)
        }
    })

    return <>
        <LightingFile background={true} url={meadow1k}></LightingFile>
        <Gltf src={`${lightingURL}`}></Gltf>
    </>
}