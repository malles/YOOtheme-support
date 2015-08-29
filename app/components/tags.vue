<template>

    <select options="tagOptions" v-model="guestion.tags"></select>

</template>

<script>

    module.exports = {

        props: ['question', 'tagOptions'],

        ready: function () {


        }

    };

</script>
