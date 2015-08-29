var Vue = require('vue'),
    _ = require('lodash');

Vue.use(require('./plugins/localstorage'));

jQuery(function ($) {

    //insert toolbar
    $('body').prepend('<toolbar></toolbar>');

    var vm = new Vue({

        el: 'body',

        data: {
            tagOptions: [
                {value: 'read', text: 'Read', cls: 'success'},
                {value: 'solved', text: 'Solved', cls: 'success'},
                {value: 'followup', text: 'Follow up', cls: 'warning'},
                {value: 'userwait', text: 'Wait for user', cls: 'warning'},
                {value: 'bug', text: 'Valid bug', cls: 'danger'}
            ]
        },

        ready: function () {
            console.log('hiQ');
            console.log(UIkit);
            UIkit.init(this.$el);

        },

        components: {
            'toolbar': require('./components/toolbar.vue'),
            'tags': require('./components/tags.vue')
        }

    });});


