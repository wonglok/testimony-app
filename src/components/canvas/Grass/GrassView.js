'use client'

import { Grass } from "./Grass";
import { PerspectiveCamera, Sky } from "@react-three/drei";

export function GrassView() {
    return <>
        <group rotation={[0, -0.25 * 0.5 * Math.PI, 0]}>
            <Grass></Grass>
        </group>

        <Sky rotation-y={1 * Math.PI}></Sky>

        <PerspectiveCamera makeDefault position={[0, 4, 15]} rotation={[-0.3, 0, 0]}></PerspectiveCamera>
    </>
}