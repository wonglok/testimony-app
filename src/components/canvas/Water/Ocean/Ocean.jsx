import { Water } from 'three/examples/jsm/objects/Water.js';
import { Sky } from 'three/examples/jsm/objects/Sky.js';
import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei'
import waterdudv from '../asset/waterdudv.jpg'
import waternormals from '../asset/waternormals.jpg'
// import waterMap from '../asset/water.jpg'
import { MathUtils, RepeatWrapping } from 'three';
import { Vector3 } from 'three';
import { PlaneGeometry } from 'three';

export function Ocean({ ...props }) {
    let scene = useThree(r => r.scene)
    let { distortionTexture, normalMap } = useTexture({
        distortionTexture: waterdudv.src,
        normalMap: waternormals.src,
        // colorMap: waterMap.src,
    })

    normalMap.wrapS = normalMap.wrapT = RepeatWrapping
    distortionTexture.wrapS = distortionTexture.wrapT = RepeatWrapping

    normalMap.repeat.set(4, 4)
    normalMap.needsUpdate = true
    distortionTexture.repeat.set(4, 4)

    distortionTexture.needsUpdate = true

    let { sun, water, sky, skyDisplay, waterDisplay } = useMemo(() => {

        const sun = new Vector3(0, 0, 0);

        const waterGeometry = new PlaneGeometry(10000, 10000);

        let water = new Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: normalMap,
                sunDirection: new Vector3().copy(sun).normalize(),
                sunColor: 0xff7700,
                waterColor: 0x008888,
                distortionScale: 1,
                fog: scene.fog !== undefined
            }
        );

        water.rotation.x = - Math.PI / 2;

        const sky = new Sky();
        sky.scale.setScalar(10000);

        return {
            sky,
            skyDisplay: <primitive object={sky}></primitive>,
            sun,
            water,
            waterDisplay: <primitive object={water}></primitive>
        }
    }, [])

    let parameters = { elevation: 90 - 10, azimuth: 180 - 180 }

    useFrame((st, dt) => {
        water.material.uniforms['time'].value += dt;

        const phi = MathUtils.degToRad(parameters.elevation);
        const theta = MathUtils.degToRad(parameters.azimuth);

        sun.setFromSphericalCoords(1, phi, theta);

        sky.material.uniforms['sunPosition'].value.copy(sun);
        water.material.uniforms['sunDirection'].value.copy(sun).normalize();
    })

    return <>
        {skyDisplay}
        <group {...props}>
            {waterDisplay}
        </group>
    </>
}