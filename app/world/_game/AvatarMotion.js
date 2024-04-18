'use client'
import path from 'path'
export const AvatarMotion = []

function importSeries({ gender, category, webp, fbx }) {
    function importAllFBX(r, wp) {
        r.keys().forEach((key) => {
            let obj = {
                gender,
                category,
                item: path.basename(key).replace('.fbx', '')
            }

            let url = r(key)

            obj.fbx = url
            AvatarMotion.push(obj)
        });

        wp.keys().forEach((key) => {
            let obj = AvatarMotion.find(o => {
                return o.gender === gender && o.category === category && o.item === path.basename(key).replace('.webp', '')
            })

            let url = wp(key)
            obj.webp = url.default.src

            // console.log(obj)
        });

    }

    importAllFBX(fbx, webp);
}

importSeries({
    category: 'dance',
    gender: 'masculine',
    fbx: require.context('./rpm-avatar-motion/masculine/fbx/dance', false, /\.fbx$/),
    webp: require.context('./rpm-avatar-motion/masculine/webp/dance', false, /\.webp$/)
});
importSeries({
    category: 'expression',
    gender: 'masculine',
    fbx: require.context('./rpm-avatar-motion/masculine/fbx/expression', false, /\.fbx$/),
    webp: require.context('./rpm-avatar-motion/masculine/webp/expression', false, /\.webp$/)
});
importSeries({
    category: 'idle',
    gender: 'masculine',
    fbx: require.context('./rpm-avatar-motion/masculine/fbx/idle', false, /\.fbx$/),
    webp: require.context('./rpm-avatar-motion/masculine/webp/idle', false, /\.webp$/)
});
importSeries({
    category: 'locomotion',
    gender: 'masculine',
    fbx: require.context('./rpm-avatar-motion/masculine/fbx/locomotion', false, /\.fbx$/),
    webp: require.context('./rpm-avatar-motion/masculine/webp/locomotion', false, /\.webp$/)
});

importSeries({
    category: 'dance',
    gender: 'feminine',
    fbx: require.context('./rpm-avatar-motion/feminine/fbx/dance', false, /\.fbx$/),
    webp: require.context('./rpm-avatar-motion/feminine/webp/dance', false, /\.webp$/)
});
importSeries({
    category: 'expression',
    gender: 'feminine',
    fbx: require.context('./rpm-avatar-motion/feminine/fbx/expression', false, /\.fbx$/),
    webp: require.context('./rpm-avatar-motion/feminine/webp/expression', false, /\.webp$/)
});
importSeries({
    category: 'idle',
    gender: 'feminine',
    fbx: require.context('./rpm-avatar-motion/feminine/fbx/idle', false, /\.fbx$/),
    webp: require.context('./rpm-avatar-motion/feminine/webp/idle', false, /\.webp$/)
});
importSeries({
    category: 'locomotion',
    gender: 'feminine',
    fbx: require.context('./rpm-avatar-motion/feminine/fbx/locomotion', false, /\.fbx$/),
    webp: require.context('./rpm-avatar-motion/feminine/webp/locomotion', false, /\.webp$/)
});
