<template>
    <div>
        {{ payload }}
    </div>
</template>

<script>
export default {
    name: 'ViewElement',
    props: {
        payload: String,
    },
}
</script>
