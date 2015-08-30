<template>
        <label>{{ label }}:</label>
        <div class="uk-button-group">
            <template v-repeat="tag: tagOptions">
                <button v-attr="class: buttonClass(tag), disabled: disabled"
                        data-uk-tooltip="{delay:500, pos: 'bottom'}" title=" {{ ttipText + ' ' + tag.text }}"
                        v-on="click: toggleTagFilter(tag)">
                    <i class="uk-icon-{{ tag.icon }}"></i></button>
            </template>
        </div>

</template>

<script>

    module.exports = {

        data: function () {
            return {
                label: '',
                ttipText: ''
            };
        },

        props: ['selected', 'tagOptions', 'page'],

        created: function () {
            this.label =  this.page === 'question' ? 'Toggle' : 'Filter';
            this.ttipText =  this.page === 'question' ? 'Hide/show' : 'Toggle tag';
        },

        calculated: {
            disabled: function () {
                return ['default', 'question'].indexOf(this.page) === -1;
            }
        },
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
