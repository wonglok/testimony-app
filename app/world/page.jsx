'use client'

// import { Common } from "@/components/canvas/View";
// import { View } from "@react-three/drei";

import { Common } from "@/components/canvas/View";
import { Effects, PerspectiveCamera } from "@react-three/drei";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Ocean } from "@/components/canvas/Water/Ocean/Ocean";
import { GameContent } from "./_game/GameContent";

const View = dynamic(() => import('@/components/canvas/View').then((mod) => mod.View), {
    ssr: false,
    loading: () => (
        <div className='flex h-full w-full flex-col items-center justify-center'>
            <svg className='-ml-1 mr-3 h-5 w-5 animate-spin text-black scale-150' fill='none' viewBox='0 0 24 24'>
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
            <div className='w-full' style={{ height: `calc(100%)` }}>
                <View className='flex h-full w-full flex-col items-center justify-center'>
                    <Suspense fallback={null}>
                        {/* <Grass position={[0, -3, 0]} /> */}

                        <Common />

                        <group position={[0, -9.5, 0]}>
                            <Ocean></Ocean>
                        </group>

                        <group position={[0, 0, 0]}>
                            <GameContent></GameContent>
                        </group>

                        <PerspectiveCamera makeDefault fov={55} position={[0, 0, 5]}></PerspectiveCamera>

                    </Suspense>
                </View>
            </div>
        </div>

    </>
}