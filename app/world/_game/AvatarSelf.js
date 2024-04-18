import { Object3D } from "three";
import { DRACOLoader, FBXLoader, GLTFLoader } from "three-stdlib";
import { AvatarMotion, AvatarMotionMale } from "./AvatarMotion";
import { AnimationMixer } from "three";
import { Clock } from "three";
import { SkeletonHelper } from "three";

export class Avatar extends Object3D {
    constructor({ parent, onLoop }) {
        super({ parent })
        this.parent = parent

        let avatarURL = `https://models.readyplayer.me/65a7a1d2edd978fd4b6a86aa.glb`

        let clock = new Clock()
        let fbxLoader = new FBXLoader()
        let loader = new GLTFLoader()
        let draco = new DRACOLoader()
        draco.setDecoderPath('/draco/')
        loader.setDRACOLoader(draco)
        this.mixer = new AnimationMixer()
        this.actions = AvatarMotion
        onLoop(() => {
            this.mixer.setTime(clock.getElapsedTime())
        })
        //.webp

        //
        let idleM = AvatarMotion.find(r => r.item === 'M_Dances_005')

        //
        this.avatarScene = new Object3D()

        Promise.all([
            loader.loadAsync(avatarURL),
            fbxLoader.loadAsync(idleM.fbx),
        ])
            .then(([glb, fbx]) => {
                this.add(this.avatarScene)

                this.avatarScene.add(glb.scene)
                // let helper = new SkeletonHelper(glb.scene)
                // this.add(helper)

                setTimeout(() => {
                    fbx.animations.forEach(animation => {
                        let action = this.mixer.clipAction(animation, fbx)
                        action.play()

                        fbx.scale.set(0.01, 0.01, 0.01)

                        // let helper2 = new SkeletonHelper(fbx)
                        this.add(fbx)
                        // this.add(helper2)

                        let fbxBones = fbx.getObjectsByProperty('isBone', true)
                        let glbBones = glb.scene.getObjectsByProperty('isBone', true)
                        onLoop(() => {
                            glbBones.forEach((glbBone1) => {
                                console.log(glbBone1.name)
                                let foundFBX = fbxBones.find(r => r.name === glbBone1.name)

                                if (foundFBX) {
                                    glbBone1.rotation.copy(foundFBX.rotation)
                                }

                                if (foundFBX) {
                                    glbBone1.scale.copy(foundFBX.scale)
                                }

                                if (foundFBX.name === 'Hips') {
                                    glbBone1.position.copy(foundFBX.position).multiplyScalar(1 / 100)
                                }
                            })
                        })
                    })

                    // action.reset().play()
                })

            })
    }
}

// F_Standing_Idle_001

export class AvatarSelf extends Avatar {
    constructor({ parent = null, onLoop = () => { } }) {
        super({ parent, onLoop })
        this.parent = parent
        this.target = new Object3D()

        parent.player.position.copy(this.target.position)

        this.needsRotate = false

        onLoop(() => {
            if (Math.abs(this.rotation.y - this.parent.player.rotation.y + Math.PI) < 0.5) {
                this.needsRotate = true
            }

            this.avatarScene.rotation.y = this.parent.player.rotation.y + Math.PI
            this.avatarScene.position.x = this.parent.player.position.x
            this.avatarScene.position.y = this.parent.player.position.y - 1.515
            this.avatarScene.position.z = this.parent.player.position.z
        })

        console.log(AvatarMotion)


    }
}

