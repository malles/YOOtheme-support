exports.install = function (Vue) {

    var Question = function Question(id, data) {

        this.title = null;
        this.id = id;
        this.selector = '';
        this.yooTags = [];
        this.tags = [];
        this.url = '';
        this.description = '';
        this.user = '';
        this.fulltext = '';
        this.accepted = false;
        this.accepted_id = 0;
        this.answers = 0;
        this.votes = 0;
        this.favorite = false;
        this.created = '';
        this.lastUpdated = '';
        this.lastSeen = '';
        this.lastSeenAnswers = 0;
        this.lastActive = '';
        //set data
        _.forIn((data || {}), function (value, key) {
            this[key] = value;
        }.bind(this));
        if (!this.selector) {
            this.selector = this.id + ':' + (((new Date(this.created)).getTime()) / 1000);
        }
    };

    _.extend(Question.prototype, {

        loadFromDefault: function (element) {

            var self = this;
            this.title = element.find('h2.title a').text();
            this.url = element.find('h2.title a').attr('href');
            this.description = element.find('p.description').text();
            this.accepted  = element.hasClass('accepted'); //keep id from details
            this.answers = element.find('.info .top strong').text();
            this.votes = element.find('.info .bottom strong').text();

            this.yooTags = [];
            element.find('ul.tags li').each(function () {
                self.yooTags.push(UIkit.$(this).text());
            });
            this.lastActive = element.find('.body time').attr('datetime');
            this.lastUpdated = (new Date()).toISOString();

        },

        loadFromQuestion: function (element) {
            var self = this, questionInfo = UIkit.Utils.options(element.attr('data-question'));
            this.title = element.find('h1.title').text();
            this.url = window.location.pathname;
            this.fulltext = element.find('.content').text();
            this.user  = element.find('a.user').text();
            this.accepted  = questionInfo.answered > 0;
            this.accepted_id  = questionInfo.answered;
            this.answers = (UIkit.$('[data-answer]').length).toString();
            this.votes = (element.find('[data-vote]').data('vote')).toString();
            this.favorite = element.hasClass('is-favorite');

            this.yooTags = [];
            element.find('ul.tags li').each(function () {
                self.yooTags.push(UIkit.$(this).text());
            });
            this.created = element.find('.body time').attr('datetime');
            this.selector = this.id + ':' + (((new Date(this.created)).getTime()) / 1000);
            this.lastSeen = (new Date()).toISOString();
            this.lastSeenAnswers = this.answers;
            this.lastUpdated = (new Date()).toISOString();
        },

        decorateDefault: function (element, vm) {
            var self = this, tagOptions = '', tags = '';
            //create tag dom
            _.forEach(vm.tagOptions, function (tag) {
                var active = false;
                if (self.tags.indexOf(tag.value) > -1) {
                    tags += vm.tagTemplate.replace('{{text}}', tag.text).replace('{{cls}}', tag.cls).replace('{{icon}}', tag.icon);
                    active = true;
                }
                tagOptions += vm.tagOptionTemplate
                    .replace('{{value}}', tag.value)
                    .replace('{{text}}', tag.text)
                    .replace('{{cls}}', (active ? 'muted' : tag.cls))
                    .replace('{{icon}}', tag.icon);
            });
            //set info dom
            element.find('.info .bottom').html(
                (this.favorite ? '<i class="uk-icon-star uk-text-primary uk-icon-justify"></i> |' : '') +
                    'A: <strong class="' + (this.accepted ? ' uk-text-success' : '') + '">' + (this.answers) + '</strong> | V: <strong>' + (this.votes) + '</strong>'
            );
            element.find('.info .top').css('overflow', 'visible').html(
                vm.topTemplate.replace('{{tagOptions}}', tagOptions).replace('{{tags}}', tags).replace('{{user}}', this.user)
            );
            //no vue here :(
            element.find('[data-pinquestion]').click(function (e) {
                e.preventDefault();
                $yoosupport.pinQuestion(self.id);
            });
            element.find('[data-addtag]').click(function (e) {
                e.preventDefault();
                $yoosupport.toggleTag(self.id, UIkit.$(this).data('addtag'));
            });
            if (!element.hasClass('ys-init')) {
                //external link
                element.find('h2.title').prepend('<a target="_blank" class="uk-icon-hover uk-text-small uk-icon-external-link uk-margin-small-right" href="' + this.url + '"></a>');
            }
            element.addClass('ys-init');
        },

        decorateQuestion: function (element, vm) {
            if (!element.hasClass('ys-init')) {
                element.find('a.favorite').click(function () {
                    this.favorite = !this.favorite;
                    vm.$saveQuestion(this);
                }.bind(this));
            }
            element.addClass('ys-init');

        }

    });

    function saveQuestion(question, vm) {
        vm.$localstorage('q.' + question.id, JSON.stringify(question));
    }

    function getQuestion(id, vm, element, type) {
        var question, idParts, created;
        if (element) { //init
            switch (type) {
            case 'default':
                idParts = id.split(':');
                created = (new Date(parseInt(idParts[1], 10) * 1000)).toISOString();
                question = new Question(idParts[0], _.assign({created: created, selector: id}, JSON.parse(vm.$localstorage('q.' + idParts[0]) || '{}')));
                question.loadFromDefault(element);
                break;
            case 'question':
                question = new Question(id, JSON.parse(vm.$localstorage('q.' + id) || '{}'));
                question.loadFromQuestion(element);
                break;
            }
            saveQuestion(question, vm);
        }
        return question;
    }

    Vue.prototype.$getQuestion = function (id, element, type) {
        return getQuestion(id, this, element, type);
    };
    Vue.prototype.$saveQuestion = function (question) {
        return saveQuestion(question, this);
    };
};
