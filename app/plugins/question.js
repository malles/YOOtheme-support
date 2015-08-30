exports.install = function (Vue) {

    var Question = function Question(id, data) {
            this.title = null;
            this.id = id;
            this.yooTags = [];
            this.tags = [];
            this.url = '';
            this.accepted  = false;
            this.answers = 0;
            this.votes = 0;
            this.created = '';
            this.lastSeen = '';
            this.lastActive = '';
            //set data
            _.forIn((data || {}), function (value, key) {
                this[key] = value;
            }.bind(this));
        };

    _.extend(Question.prototype, {
        loadFromIndex: function (element) {
            var self = this;
            this.title = element.find('h2.title a').text();
            this.url = element.find('h2.title a').attr('href');
            this.description = element.find('p.description').text();
            this.accepted  = element.hasClass('accepted');
            this.answers = element.find('.info .top strong').text();
            this.votes = element.find('.info .bottom strong').text();
            this.yooTags = [];
            element.find('ul.tags li').each(function () {
                self.yooTags.push(UIkit.$(this).text());
            });
            this.lastActive = element.find('.body time').attr('datetime');
            this.lastSeen = (new Date()).toISOString();
        },
        decorate: function (element, vm) {
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
                'A: <strong class="' + (this.accepted ? ' uk-text-success' : '') + '">' + this.answers + '</strong> | V: <strong>' + this.votes + '</strong>'
            );
            element.find('.info .top').css('overflow', 'visible').html(
                vm.topTemplate.replace('{{tagOptions}}', tagOptions).replace('{{tags}}', tags)
            );
            if (!element.hasClass('ys-init')) {
                //external link
                element.find('h2.title').prepend('<a target="_blank" class="uk-icon-hover uk-text-small uk-icon-external-link uk-margin-small-right" href="' + this.url + '"></a>');
                //no vue here :(
                element.find('[data-pinquestion]').click(function (e) {
                    e.preventDefault();
                    $yoosupport.pinQuestion(self.id);
                });
                element.find('[data-addtag]').click(function (e) {
                    e.preventDefault();
                    $yoosupport.toggleTag(self.id, UIkit.$(this).data('addtag'));
                });
                element.addClass('ys-init');
            }
        }

    });

    function saveQuestion(question, vm) {
        vm.$localstorage('q.' + question.id, JSON.stringify(question));
    }

    function getQuestion(id, vm, element) {
        var question = new Question(id, JSON.parse(vm.$localstorage('q.' + id) || '{}'));
        if (element) { //init
            question.loadFromIndex(element);
            saveQuestion(question, vm);
        }
        return question;
    }

    Vue.prototype.$getQuestion = function (id, element) {
        return getQuestion(id, this, element);
    };
    Vue.prototype.$saveQuestion = function (question) {
        return saveQuestion(question, this);
    };
};
