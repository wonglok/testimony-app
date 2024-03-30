import { useThree } from "@react-three/fiber"
import { useEffect } from "react"
import { EquirectangularReflectionMapping, SRGBColorSpace, TextureLoader } from "three"
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { suspend } from "suspend-react"

export function LightingFile({ url, background }) {
    let scene = useThree(r => r.scene)

    let tex = suspend(async () => {
        if (!url) {
            return null
        }

        if (url.includes('.hdr')) {
            let rgbeLoader = new RGBELoader()

            let tex = await rgbeLoader.loadAsync(url)
            tex.mapping = EquirectangularReflectionMapping

            return tex
        }

        if (url.includes('.png') || url.includes('.jpg')) {
            let texLoader = new TextureLoader()

            let tex = await texLoader.loadAsync(url)
            tex.mapping = EquirectangularReflectionMapping
            tex.colorSpace = SRGBColorSpace
            return tex
        }
    }, [url])

    useEffect(() => {
        scene.environment = tex
        if (background) {
            scene.background = tex
        }
        return () => {
            tex?.dispose()
            scene.background = null
            scene.environment = null
        }
    }, [tex, background, scene])

    return <></>
}

