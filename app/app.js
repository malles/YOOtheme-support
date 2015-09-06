var Vue = require('vue'),
    _ = require('lodash');

Vue.use(require('./plugins/localstorage'));
Vue.use(require('./plugins/question'));
Vue.use(require('./plugins/pin'));

jQuery(function ($) {

    "use strict";

    var page = $('[data-view]').data('view');

    //insert components in dom
    $('body').prepend('<toolbar></toolbar>')
        .prepend('<pinbar></pinbar>')
        //.prepend('<pre>{{ $data.pins | json }}</pre>')
        .append('<instorage></instorage>');

    if (page === 'question') {
        $('[data-question] .info').append('<question-tags question="{{@ question }}"></question-tags>');
    }

    window.$yoosupport = new Vue({

        el: 'body',

        data: {
            page: '',
            showPins: false,
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
            pins: {},
            questions: {},
            filters: {
                showAccepted: false,
                tags: []
            },
            bottomTemplate: '<div class="uk-position-absolute uk-position-bottom-right">\n    <ul class="uk-subnav uk-subnav-line uk-margin-right uk-text-small">\n        {{newMessages}}\n        {{user}}\n        <li><span>Created: {{created}}</span></li>\n    </ul>\n    \n</div>',
            tagTemplate: '<span class="uk-badge uk-badge-{{cls}}" data-uk-tooltip="{delay: 200}" title="{{text}}"><i class="uk-icon-{{icon}} uk-icon-justify"></i></span>\n',
            tagOptionTemplate: '<li class="uk-dropdown-close"><a href="#" data-addtag="{{value}}"><i class="uk-icon-{{icon}} uk-text-{{cls}} uk-margin-small-right"></i>{{text}}</a></li>\n',
            topTemplate: '<div class="uk-margin-small-top uk-flex uk-flex-space-around"> \n    <a href="#" class="uk-icon-thumb-tack {{pinnedClass}}" data-pinquestion></a>\n    <div class="uk-position-relative" data-uk-dropdown="{delay: 100}">\n        <i class="uk-icon-tags"></i>\n        <div class="uk-dropdown uk-text-left">\n            <ul class="uk-nav uk-nav-dropdown">\n                {{tagOptions}}\n            </ul>\n        </div> \n    </div>\n</div>\n{{tags}}<br/>\n<small>{{user}}</small>\n'
        },

        created: function () {
            this.page = page;

            //default filters
            _.forEach(this.tagOptions, function (tag) {
                this.filters.tags.push(tag.value);
            }.bind(this));
            //merge from localstorage filters
            this.filters = UIkit.$.extend(true, this.filters, JSON.parse((this.$localstorage('default.filters') || '{}')));
            this.showPins = this.$localstorage('showPins') || false;
            this.pins = this.$getPins();
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
                this.$saveQuestion(this.questions[id]);
                this.questions[id].decorateDefault(UIkit.$('[data-id="' + this.questions[id].selector + '"]'), this);
            },
            pinQuestion: function (id) {
                var pinned;
                if (this.pins[id]) {
                    this.$deletePin(id);
                    this.pins.$delete(id);
                    pinned = false;
                } else {
                    this.pins.$set(id, this.$getPin(id));
                    pinned = true;
                }
                if (this.questions[id]) {
                    this.questions[id].pinned = pinned;
                } else {
                    this.question.pinned = pinned;
                }
                this.$saveQuestion(this.questions[id]);
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
            },
            showPins: function (value) {
                this.$localstorage('showPins', value ? 1 : 0);
            }
        },

        filters: {
            datetime: function (date) {
                return this.$questionDateformat(date);
            },
            dateshort: function (date) {
                if (date) {
                    var d = new Date(date);
                    return d.getDate() + '-' + (d.getMonth() + 1);
                }
                return '';
            }
        },

        components: {
            'toolbar': require('./components/toolbar.vue'),
            'pinbar': require('./components/pinbar.vue'),
            'instorage': require('./components/instorage.vue'),
            'question-tags': require('./components/question-tags.vue'),
            'tags': require('./components/tags.vue')
        }

    });
});


