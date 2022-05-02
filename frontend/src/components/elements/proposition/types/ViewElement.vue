<template>
    <div>
        {{ payload }}
    </div>
</template>

<script>
export default {
    name: 'ViewElement',
    data: () => ({
        valid: true,
        payload: '',
    }),
}
</script>
