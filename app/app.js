var Vue = require('vue'),
    _ = require('lodash');

Vue.use(require('./plugins/localstorage'));
Vue.use(require('./plugins/question'));

jQuery(function ($) {

    //insert components in dom
    $('body').prepend('<toolbar></toolbar>')
        //.prepend('<pre>{{ $data | json }}</pre>')
        .append('<instorage></instorage>');

    window.$yoosupport = new Vue({

        el: 'body',

        data: {
            page: '',
            tagOptions: [
                {value: 'read', text: 'Read', cls: 'success', icon: 'eye'},
                {value: 'solved', text: 'Solved', cls: 'success', icon: 'check'},
                {value: 'followup', text: 'Follow up', cls: 'warning', icon: 'reply'},
                {value: 'userwait', text: 'Wait for user', cls: 'warning', icon: 'user'},
                {value: 'invald', text: 'Invalid', cls: 'danger', icon: 'ban'},
                {value: 'bug', text: 'Valid bug', cls: 'danger', icon: 'bug'}
            ],
            questions: {},
            filters: {
                tags: []
            },
            tagTemplate: '<span class="uk-badge uk-badge-{{cls}}" data-uk-tooltip="{delay: 200}" title="{{text}}"><i class="uk-icon-{{icon}} uk-icon-justify"></i></span>\n',
            tagOptionTemplate: '<li class="uk-dropdown-close"><a href="#" data-addtag="{{value}}"><i class="uk-icon-{{icon}} uk-text-{{cls}} uk-margin-small-right"></i>{{text}}</a></li>\n',
            topTemplate: '<div class="uk-margin-small-top uk-flex uk-flex-space-around"> \n    <a href="#" class="uk-icon-hover uk-icon-thumb-tack" data-pinquestion></a>\n    <div class="uk-position-relative" data-uk-dropdown="{delay: 200}">\n        <i class="uk-icon-tags"></i>\n        <div class="uk-dropdown uk-text-left">\n            <ul class="uk-nav uk-nav-dropdown">\n                {{tagOptions}}\n            </ul>\n        </div> \n    </div>\n</div>\n{{tags}}'
        },

        created: function () {
            if ($('.questions').length) {
                this.page = 'index';
            }
            //default filters
            this.filters.tags.push('notags');
            _.forEach(this.tagOptions, function (tag) {
                this.filters.tags.push(tag.value);
            }.bind(this));
            //merge from localstorage filters
            this.filters = UIkit.$.extend(true, this.filters, JSON.parse((this.$localstorage('index.filters') || '{}')));
        },

        ready: function () {
            UIkit.init(this.$el);
            switch (this.page) {
            case 'index':
                this.loadQuestions();
                //observe new questions
                UIkit.domObserve('.questions', this.loadQuestions);
                break;
            default:
                break;

            }

            console.log('app');
        },

        methods: {
            loadQuestions: function () {
                var vm = this;
                console.log('load');
                //fill questions object
                $('[data-id]').each(function () {
                    var $el = $(this), id = $el.data('id');
                    vm.questions.$set(id, vm.questions[id] || vm.$getQuestion(id, $el));
                    if (!$el.hasClass('ys-init')) {
                        vm.questions[id].decorate($el, vm);
                    }
                });
                if (this.filters.tags.indexOf('notags') === -1) { //prevent never ending ajax load
                    this.filterQuestions();
                }
            },
            filterQuestions: function () {
                _.forEach(this.questions, function (question) {
                    if (_.intersection(question.tags, this.filters.tags).length > 0 || (question.tags.length === 0 && this.filters.tags.indexOf('notags') > -1)) {
                        UIkit.$('[data-id="' + question.id + '"]').removeClass('uk-hidden');
                    } else {
                        UIkit.$('[data-id="' + question.id + '"]').addClass('uk-hidden');
                    }
                }.bind(this));
            },
            toggleTag: function (id, tag) {
                var idx = this.questions[id].tags.indexOf(tag);
                if (idx === -1) {
                    this.questions[id].tags.push(tag);
                } else {
                    this.questions[id].tags.splice(idx, 1);
                }
                this.$saveQuestion(this.questions[id], this);
                this.questions[id].decorate(UIkit.$('[data-id="' + id + '"]'), this);
            },
            pinQuestion: function (id) {
                console.log(this.questions[id].title);
            },
            getTag: function (tag) {
                return (_.find(this.tagOptions, 'value', tag) || {value: '', text: 'Not found', cls: '', icon: 'exclamation'});
            }

        },

        watch: {
            filters: {
                handler: function (value) {
                    this.$localstorage('index.filters', JSON.stringify(value));
                    this.filterQuestions();
                },
                deep: true
            }
        },

        filters: {
            datetime: function (date) {
                if (date) {
                    var d = new Date(date);
                    return d.toLocaleDateString() + ', ' + d.toLocaleTimeString();
                }
                return 'No date';
            }
        },

        components: {
            'toolbar': require('./components/toolbar.vue'),
            'instorage': require('./components/instorage.vue'),
            'tags': require('./components/tags.vue')
        }

    });
});


