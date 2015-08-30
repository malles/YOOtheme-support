<template>

        <div class="uk-width-1-1 uk-margin-top">
            <template v-repeat="tag: question.tags">
                <div v-attr="class: 'uk-badge uk-badge-' + tagValue(tag, 'cls')">
                    <i class="uk-icon-{{ tagValue(tag, 'icon') }} uk-icon-small uk-margin-small-right"></i>{{ tagValue(tag, 'text') }}</div>
            </template>
        </div>

</template>

<script>

    module.exports = {

        props: ['question'],

        methods: {
            tagValue: function (tag, key) {
                return this.$parent.getTag(tag)[key];
            }
        },

        watch: {
            'question.tags': function () {
                this.$saveQuestion(this.question, this);
            }
        }
    };

</script>
