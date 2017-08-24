<template>
    <div class="tag is-medium is-primary">
        <i v-for="n in 5" :class="['fa star', n > this.rating ? 'fa-star':'fa-star']" @click="emit(n)"></i>
    </div>
</template>
<script>
    export default {
        name: 'starpanel',
        props: ['rating'],
        methods: {
            emit(n) {
                this.$emit('rating',n)
            }
        }
 }
</script>
<style>
    i.star:hover{
        color: #fff
    }
</style>