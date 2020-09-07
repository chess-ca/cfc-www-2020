<!--
    Component:  cfcPhotoBox
    - (notes)
-->

<template>
    <div :id="'ws-photobox-'+_uid" class="ws-photobox">
        <transition-group name="ws-photobox" tag="ul">
            <li v-for="photo in photo_list" :key="photo.key">
                <img :src="photo.img">
                <p v-if="photo.text"><span v-html="photo.text"></span></p>
            </li>
        </transition-group>
    </div>
</template>

<script>
    /**
     * @file VueJS component for <ws-photobox> tag
     * @author Don Parakin, 2020
     */
    const url_cloud = 'https://storage.googleapis.com/cfc-public';
    const wait_time = 10 * 1000;

    const vue_props = {
        photos: { type:Array, required:true },
        wait: { type:Number, default:10 }
    };

    const vue_data = function() {
        return {
            photo_list: [],
            max_photos: 10,
            removed_photo: null
        };
    };
    const vue_beforeMount = function() {
        let cloud_re = /cloud:/g;
        let link_re = /\[(.*?)\]\((.*?)\)/g;
        for (let i=0; i<this.photos.length; i++) {
            let p = this.photos[i];
            p.key = i;
            if (p.img) {
                p.img = p.img.replace('cloud:', url_cloud);
            }
            p.text = p.text || "";
            let match;
            while ((match = cloud_re.exec(p.text))) {
                p.text = p.text.replace(match[0], url_cloud);
            }
            while ((match = link_re.exec(p.text)) !== null) {
                let link_html = '<a href="'+match[2]+'">'+match[1]+'</a>';
                p.text = p.text.replace(match[0], link_html);
            }
            this.photo_list.push(p);
        }
        this.wait = Number(this.wait);
        window.setTimeout(rotate_photos, wait_time, this);
    };

    function rotate_photos(vue_vm) {
        vue_vm.removed_photo = vue_vm.photo_list.shift();
        vue_vm.photo_list.push(vue_vm.removed_photo);
        //setSleep();
        window.setTimeout(rotate_photos, wait_time, vue_vm);
    }

    export default {
        props: vue_props,
        data: vue_data,
        beforeMount: vue_beforeMount
    }
</script>
