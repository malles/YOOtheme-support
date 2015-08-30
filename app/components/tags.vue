<template>

        <div class="uk-button-group">
            <button v-attr="class: buttonClass(noTag)"
                    data-uk-tooltip="{delay:500, pos: 'bottom'}" title="Hide/show {{ noTag.text }}"
                    v-on="click: toggleTagFilter(noTag)">
                <i class="uk-icon-{{ noTag.icon }} uk-margin-small-right"></i></button>
            <template v-repeat="tag: tagOptions">
                <button v-attr="class: buttonClass(tag)"
                        data-uk-tooltip="{delay:500, pos: 'bottom'}" title="Hide/show {{ tag.value }}"
                        v-on="click: toggleTagFilter(tag)">
                    <i class="uk-icon-{{ tag.icon }} uk-margin-small-right"></i></button>
            </template>
        </div>

</template>

<script>

    module.exports = {

        data: function () {
            return {
                noTag: {value: 'notags', text: 'No tags', cls: '', icon: 'tags'}
            };
        },

        props: ['selected', 'tagOptions'],

        methods: {
            buttonClass: function (tag) {
                return 'uk-button uk-button-small uk-button-' + tag.cls + (this.selected.indexOf(tag.value) > -1 ? ' uk-active' : '');
            },
            toggleTagFilter: function (tag) {
                var idx = this.selected.indexOf(tag.value);
                if (idx === -1) {
                    this.selected.push(tag.value);
                } else {
                    this.selected.splice(idx, 1);
                }

            }
        }

    };

</script>
