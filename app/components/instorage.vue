<template>
    <div id="instorage-modal" class="uk-modal">
        <div class="uk-modal-dialog uk-modal-dialog-large">
            <a href="" class="uk-modal-close uk-close"></a>
            <div class="uk-modal-header uk-form">
                <div class="uk-margin-small-top uk-flex uk-flex-middle uk-flex-space-between">
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
                        <button class="uk-button uk-button-small" v-on="click: load"
                                data-uk-tooltip="{delay:500, pos: 'bottom'}" title="Reload">
                            <i class="uk-icon-refresh"></i></button>
                        <button class="uk-button uk-button-small" v-on="click: showAll"
                                data-uk-tooltip="{delay:500, pos: 'bottom'}" title="Show all">
                            <i class="uk-icon-eye"></i></button>
                    </div>
                    <div>
                        <div class="uk-search">
                            <input class="uk-search-field uk-form-width-medium" v-model="filters.searchText" type="search" placeholder="Search...">
                        </div>
                    </div>
                    <div>
                        <select v-model="filters.ordering">
                            <option value="lastSeen">Last seen</option>
                            <option value="lastUpdated">Last updated data</option>
                            <option value="lastActive">Last active</option>
                            <option value="created">Creation date</option>
                            <option value="title">Title</option>
                        </select>
                    </div>
                </div>
                <div class="uk-margin-small-top uk-flex uk-flex-middle uk-flex-space-between">
                    <div>
                        <tags selected="{{@ filters.tags }}" tag-options="{{ $parent.tagOptions }}" page="instorage"></tags>
                    </div>
                    <div>
                        <button v-attr="class: filters.showNotag ? 'uk-button uk-button-small uk-active': 'uk-button uk-button-small'"
                                data-uk-tooltip="{delay:500, pos: 'bottom'}" title="Show/Hide no tags"
                                v-on="click: filters.showNotag = !filters.showNotag">
                            <i class="uk-icon-tags uk-text-danger"></i></button>

                        <button v-attr="class: filters.showAccepted ? 'uk-button uk-button-small uk-active': 'uk-button uk-button-small'"
                                data-uk-tooltip="{delay:500, pos: 'bottom'}" title="Show/Hide accepted"
                                v-on="click: filters.showAccepted = !filters.showAccepted">
                            <i class="uk-icon-check uk-text-success"></i></button>

                    </div>
                </div>

            </div>


            <div class="uk-grid uk-list-line">
                <div class="uk-width-1-1"
                     v-repeat="question: instorage | filterTags | showAccepted | filterBy filters.searchText in 'title' 'description' | questionOrdering filters.ordering | limit 0 filters.limit">
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
                            <li v-if="question.favorite"><span><i class="uk-icon-star uk-text-primary uk-icon-justify"></i></span></li>
                            <li v-if="question.accepted"><span><i class="uk-icon-check uk-text-success uk-icon-justify"></i></span></li>
                            <li><span>A: <strong>{{ (question.answers) }}</strong></span></li>
                            <li><span>V: <strong>{{ (question.votes) }}</strong></span></li>
                            <li><span>Created: {{ question.created | datetime }}</span></li>
                            <li><span>Last active: {{ question.lastActive | datetime }}</span></li>
                            <li><span>Last seen: {{ question.lastSeen | datetime }}</span></li>
                            <li><span>Last updated: {{ question.lastUpdated | datetime }}</span></li>
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

        defaultFilters: {
            tags: [],
            searchText: '',
            ordering: 'lastSeen',
            showAccepted: true,
            showNotag: true,
            limit: 50
        },

        data: function () {
            return {
                filters: {},
                instorage: []
            };
        },

        created: function () {

            //merge from localstorage filters
            this.filters = _.assign({}, this.$options.defaultFilters, JSON.parse((this.$localstorage('instorage.filters') || '{}')));
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

        filters: {
            filterTags: function (questions) {
                if (!this.filters.tags.length) {
                    return questions;
                }
                return questions.filter(function (question) {
                    return ((question.tags.length === 0 && this.filters.showNotag) || _.intersection(question.tags, this.filters.tags).length > 0);
                }.bind(this));
            },
            showAccepted: function (questions) {
                return questions.filter(function (question) {
                    return !(!this.filters.showAccepted && question.accepted);
                }.bind(this));
            },
            questionOrdering: function (questions, orderBy) {
                return questions.sort(function (a, b) {
                    if (['lastSeen', 'lastUpdated', 'lastActive', 'created'].indexOf(orderBy) > -1) {
                        if (a[orderBy] > b[orderBy]) {
                            return -1
                        }
                        if (!a[orderBy] || !b[orderBy] || a[orderBy] < b[orderBy]) {
                            return 1;
                        }
                        return 0;
                    } else {
                        return a[orderBy] <= b[orderBy] ? -1 : 1;
                    }
                }.bind(this));
            },
            limit: function (questions, start, limit) {
                return questions.slice(start, limit)
            }
        },

        methods: {
            load: function () {
                this.instorage = [];
                _.forIn(this.$localstorage(), function (data, key) {
                    if (key.substr(0,2) === 'q.') {
                        this.instorage.push(JSON.parse(data));
                    }
                }.bind(this));
            },
            showAll: function () {
                this.$set('filters', _.assign({}, this.$options.defaultFilters));
            },
            tagValue: function (tag, key) {
                return this.$parent.getTag(tag)[key];
            },
            purgeStorage: function (e, days) {
                e.preventDefault();
                var purgeFrom = new Date().getTime() - (days * 24 * 60 * 60); //good'ld unix
                _.forEach(this.instorage, function (question) {
                    if (days === 0 || !question.created || (new Date(question.created).getTime() < purgeFrom)) {
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
