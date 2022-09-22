<template>
    <v-avatar
        color="primary"
        :size="size"
        :left="left ? true : false"
    >
        <img
            :src="avatar_img"
            :alt="alt"
        >
    </v-avatar>
</template>

<script>

// Using gravatar, if doesn't gravatar found then own picto
import { MD5 } from 'crypto-js'

export default {
    props: [
        'email',
        'size',
        'alt',
        'left',
    ],
    computed: {
        avatar_img() {
            const hash = MD5(this.email)
            return `https://www.gravatar.com/avatar/${hash}?s=${this.size}`
        }
    },
}

</script>

