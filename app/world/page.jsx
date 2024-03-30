'use client'

// import { Common } from "@/components/canvas/View";
// import { View } from "@react-three/drei";

import { Logo } from "@/components/canvas/Examples";
import { Grass } from "@/components/canvas/Grass/Grass";
import { Orbit } from "@/components/canvas/Orbit/Orbit";
import { Common } from "@/components/canvas/View";
import { Box, MapControls, PerspectiveCamera } from "@react-three/drei";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
    ssr: false,
    loading: () => (
        <div className='flex h-96 w-full flex-col items-center justify-center'>
            <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black' fill='none' viewBox='0 0 24 24'>
                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                />
            </svg>
        </div>
    ),
})

export default function Page() {
    return <>
        <div className='w-full h-full flex flex-col'>
            <div className='w-full' style={{ height: `calc(100% - 250px)` }}>
                <View className='flex h-full w-full flex-col items-center justify-center'>
                    <Suspense fallback={null}>
                        <Grass position={[0, -2, -2]} />
                        <Common />
                        <Logo route='/blob' scale={0.6} ></Logo>
                    </Suspense>
                </View>
            </div>
            <div className='w-full' style={{ height: `calc(250px)` }}>
                <View className='flex h-full w-full flex-col items-center justify-center'>
                    <Suspense fallback={null}>
                        {/* <Grass position={[0, -2, -2]} />
                        <Common /> */}
                        <PerspectiveCamera makeDefault fov={15} position={[0, 0, 5]}></PerspectiveCamera>
                        <MapControls screenSpacePanning object-position={[0, 5, 5]}></MapControls>

                        <Box position={[0, 0, 0]}></Box>
                        <Box position={[1.1, 0, 0]}></Box>
                        {/* <Logo route='/blob' scale={0.6} ></Logo> */}

                        <Orbit></Orbit>
                    </Suspense>
                </View>
            </div>
        </div>

    </>
}
