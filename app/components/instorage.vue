<template>
    <div id="instorage-modal" class="uk-modal">
        <div class="uk-modal-dialog uk-modal-dialog-large">
            <a href="" class="uk-modal-close uk-close"></a>
            <div class="uk-modal-header uk-form">
                <div class="uk-margin-top-small uk-flex uk-flex-middle uk-flex-space-between">
                    <div>
                        <div class="uk-button-dropdown" data-uk-dropdown="{delay:200}">
                            <button class="uk-button uk-button-small uk-button-danger"><i
                                    class="uk-icon-history uk-margin-small-right"></i>Purge
                            </button>
                            <div class="uk-dropdown uk-dropdown-small">
                                <ul class="uk-nav uk-nav-dropdown">
                                    <li><a href="#" v-on="click: purgeStorage($event, 0)">All</a></li>
                                    <li><a href="#" v-on="click: purgeStorage($event, 5)">> 1 days</a></li>
                                    <li><a href="#" v-on="click: purgeStorage($event, 15)">> 15 days</a></li>
                                    <li><a href="#" v-on="click: purgeStorage($event, 30)">> 30 days</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div>
                        <tags selected="{{@ filters.tags }}" tag-options="{{ $parent.tagOptions }}"></tags>
                    </div>
                    <div>
                        <div class="uk-search">
                            <input class="uk-search-field" v-model="filters.searchText" type="search" placeholder="Search...">
                        </div>
                    </div>
                    <div>
                        <select v-model="filters.ordering">
                            <option value="lastSeen">Last seen</option>
                            <option value="lastActive">Last active</option>
                            <option value="title">Title</option>
                        </select>
                    </div>
                </div>

            </div>


            <div class="uk-grid uk-list-line">
                <div class="uk-width-1-1"
                     v-repeat="question: instorage | filterTags | filterBy filters.searchText in 'title' 'description' | limit 0 filters.limit | orderBy filters.ordering orderingBy">
                    <div class="uk-panel">
                        <div class="uk-panel-badge">
                            <div v-repeat="tag: question.yooTags" class="uk-badge uk-margin-small-left">{{ tag }}</div>
                            <template v-repeat="tag: question.tags">
                                <div v-attr="class: 'uk-badge uk-margin-small-left uk-badge-' + tagValue(tag, 'cls')"
                                     data-uk-tooltip="{delay:200}" title="{{tagValue(tag, 'text')}}">
                                    <i class="uk-icon-{{tagValue(tag, 'icon')}} uk-icon-justify"></i></div>
                            </template>
                        </div>
                        <a v-attr="href: question.url" target="_blank" class="uk-icon-hover uk-text-small uk-icon-external-link uk-margin-small-right"></a>
                        <a v-attr="href: question.url" class="uk-h4">{{ question.title }}</a><br/>
                        <p class="uk-text-truncate">{{ question.description }}</p>
                        <ul class="uk-margin-top-small uk-subnav uk-subnav-line uk-text-small uk-flex-center">
                            <li><span>A: <strong>{{ question.answers }}</strong> | V: <strong>{{ question.votes }}</strong></span></li>
                            <li><span>Created: {{ question.created | datetime }}</span></li>
                            <li><span>Last seen: {{ question.lastSeen | datetime }}</span></li>
                            <li><span>Last active: {{ question.lastActive | datetime }}</span></li>
                        </ul>

                    </div>
                    <hr class="uk-margin-top-small uk-margin-bottom">
                </div>
                <div class="uk-width-1-1 uk-text-center">
                    <button class="uk-button uk-button-link" v-on="click: filters.limit += 10">Show more...</button>
                </div>
            </div>

        </div>
    </div>

</template>

<script>

    module.exports = {

        data: function () {
            return {
                filters: {
                    tags: [],
                    searchText: '',
                    ordering: 'lastSeen',
                    limit: 50
                },
                instorage: []
            };
        },

        created: function () {
            //default filters
            this.filters.tags.push('notags');
            _.forEach(this.$parent.tagOptions, function (tag) {
                this.filters.tags.push(tag.value);
            }.bind(this));
            //merge from localstorage filters
            this.filters = UIkit.$.extend(true, this.filters, JSON.parse((this.$localstorage('instorage.filters') || '{}')));
        },

        ready: function () {
            this.load()
        },

        watch: {
            filters: {
                handler: function (value) {
                    this.$localstorage('instorage.filters', JSON.stringify(value));
                },
                deep: true
            }
        },

        computed: {
            orderingBy: function () {
                return this.filters.ordering == 'title' ? 1 : -1;
            }
        },

        filters: {
            filterTags: function (questions) {
                return questions.filter(function (question) {
                    return _.intersection(question.tags, this.filters.tags).length > 0  || (question.tags.length === 0 && this.filters.tags.indexOf('notags') > -1);
                }.bind(this));
            },
            limit: function (questions, start, limit) {
console.log(limit);
                return questions.slice(start, limit)
            }
        },

        methods: {
            load: function () {
                _.forIn(this.$localstorage(), function (data, key) {
                    if (key.substr(0,2) === 'q.') {
                        this.instorage.push(JSON.parse(data));
                    }
                }.bind(this));

            },
            tagValue: function (tag, key) {
                return this.$parent.getTag(tag)[key];
            },
            purgeStorage: function (e, days) {
                e.preventDefault();
                console.log(days);
                var purgeFrom = new Date().getTime() - (days * 24 * 60 * 60); //good'ld unix
                _.forEach(this.instorage, function (question) {
                    if (days === 0 || !question.lastSeen || (new Date(question.lastSeen).getTime() < purgeFrom)) {
                        this.$localstorage.remove('q.' + question.id)
                    }
                }.bind(this));
                UIkit.notify('Localstorage purged', 'success')
                this.instorage = [];
                this.load()
            }
        }

    };

</script>
