var Vue = require('vue'),
    _ = require('lodash');

Vue.use(require('./plugins/localstorage'));
Vue.use(require('./plugins/question'));

jQuery(function ($) {

    "use strict";

    var page = $('[data-view]').data('view');

    //insert components in dom
    $('body').prepend('<toolbar></toolbar>')
        //.prepend('<pre>{{ $data.question | json }}</pre>')
        .append('<instorage></instorage>');
    if (page === 'question') {
        $('[data-question] .info').append('<question-tags question="{{@ question }}"></question-tags>');
    }

    window.$yoosupport = new Vue({

        el: 'body',

        data: {
            page: '',
            tagOptions: [
                {value: 'watch', text: 'Watch', cls: 'success', icon: 'eye'},
                {value: 'solved', text: 'Solved', cls: 'success', icon: 'check'},
                {value: 'followup', text: 'Follow up', cls: 'warning', icon: 'reply'},
                {value: 'userwait', text: 'Wait for user', cls: 'warning', icon: 'user'},
                {value: 'invalid', text: 'Invalid', cls: 'danger', icon: 'ban'},
                {value: 'bug', text: 'Valid bug', cls: 'danger', icon: 'bug'},
                {value: 'docs', text: 'Documentation', cls: 'primary', icon: 'book'},
                {value: 'install', text: 'Installation', cls: 'primary', icon: 'download'},
                {value: 'config', text: 'Configuration', cls: 'primary', icon: 'cogs'},
                {value: 'custom', text: 'Customization', cls: 'primary', icon: 'wrench'},
                {value: 'feature', text: 'Feature request', cls: 'primary', icon: 'bolt'}
            ],
            question: {tags: []},
            questions: {},
            filters: {
                showAccepted: false,
                tags: []
            },
            tagTemplate: '<span class="uk-badge uk-badge-{{cls}}" data-uk-tooltip="{delay: 200}" title="{{text}}"><i class="uk-icon-{{icon}} uk-icon-justify"></i></span>\n',
            tagOptionTemplate: '<li class="uk-dropdown-close"><a href="#" data-addtag="{{value}}"><i class="uk-icon-{{icon}} uk-text-{{cls}} uk-margin-small-right"></i>{{text}}</a></li>\n',
            topTemplate: '<div class="uk-margin-small-top uk-flex uk-flex-space-around"> \n    <a href="#" class="uk-icon-hover uk-icon-thumb-tack" data-pinquestion></a>\n    <div class="uk-position-relative" data-uk-dropdown="{delay: 100}">\n        <i class="uk-icon-tags"></i>\n        <div class="uk-dropdown uk-text-left">\n            <ul class="uk-nav uk-nav-dropdown">\n                {{tagOptions}}\n            </ul>\n        </div> \n    </div>\n</div>\n{{tags}}<br/>\n<small>{{user}}</small>\n'
        },

        created: function () {
            this.page = page;

            //default filters
            _.forEach(this.tagOptions, function (tag) {
                this.filters.tags.push(tag.value);
            }.bind(this));
            //merge from localstorage filters
            this.filters = UIkit.$.extend(true, this.filters, JSON.parse((this.$localstorage('default.filters') || '{}')));
        },

        ready: function () {
            UIkit.init(this.$el);
            switch (this.page) {
            case 'default':
                this.loadQuestions();
                //observe new questions
                UIkit.domObserve('.questions', this.loadQuestions);
                UIkit.domObserve('.filter .tags ul', function () {
                    this.$set('questions', {}); //force refresh
                }.bind(this));
                break;
            case 'question':
                var $el = $('[data-question]'), questionInfo = UIkit.Utils.options($el.attr('data-question'));
                this.$set('question', this.$getQuestion(questionInfo.id, $el, 'question'));
                this.question.decorateQuestion($el, this);
                break;
            default:
                break;
            }

        },

        methods: {
            loadQuestions: function () {
                var vm = this, domQuestions = $('[data-id]');
                if (domQuestions.length <= Object.keys(vm.questions).length) {
                    return;
                }
                //fill questions object
                domQuestions.each(function () {
                    var $el = $(this), id = $el.data('id'), question = vm.questions[id] || vm.$getQuestion(id, $el, 'default');
                    vm.questions.$set(question.id, question);
                    if (!$el.hasClass('ys-init')) {
                        vm.questions[question.id].decorateDefault($el, vm);
                    }
                });
                this.filterQuestions();
            },
            filterQuestions: function () {
                _.forEach(this.questions, function (question) {
                    if ((question.tags.length > 0 && _.intersection(question.tags, this.filters.tags).length === 0) ||
                            (!this.filters.showAccepted && question.accepted)) {

                        UIkit.$('[data-id="' + question.selector + '"]').addClass('uk-hidden');
                    } else {

                        UIkit.$('[data-id="' + question.selector + '"]').removeClass('uk-hidden');
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
                this.questions[id].decorateDefault(UIkit.$('[data-id="' + this.questions[id].selector + '"]'), this);
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
                    this.$localstorage('default.filters', JSON.stringify(value));
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
            'question-tags': require('./components/question-tags.vue'),
            'tags': require('./components/tags.vue')
        }

    });
});


