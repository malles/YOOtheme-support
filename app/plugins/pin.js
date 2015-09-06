exports.install = function (Vue) {

    var pins;

    var Pin = function Question(id, data) {

        this.id = id;
        this.title = '';
        this.url = '';
        this.note = '';
        this.created = '';
        //set data
        _.forIn((data || {}), function (value, key) {
            this[key] = value;
        }.bind(this));
    };

    function storedPins(vm) {
        if (!pins) {
            pins = JSON.parse(vm.$localstorage('pins') || '{}');
        }
        return pins;
    }

    function storedPin(id, vm) {
        return storedPins(vm)[id] || {};
    }

    function savePin(pin, vm) {
        storedPins(vm);
        pins[pin.id] = {id: pin.id, note: pin.note};
        vm.$localstorage('pins', JSON.stringify(pins));
    }

    function deletePin(id, vm) {
        storedPins(vm);
        delete pins[id];
        vm.$localstorage('pins', JSON.stringify(pins));
    }

    function getPin(id, vm, data) {
        var question = vm.$getQuestion(id),
            stored = data || storedPin(id, vm),
            pin = new Pin(id, {
                title: question.title,
                url: question.url,
                note: stored.note || '',
                created: question.created
            });
        savePin(pin, vm);
        return pin;
    }

    Vue.prototype.$getPins = function () {
        var ret = {};
        _.forIn(storedPins(this), function (data, id) {
            ret[id] = getPin(id, this, data);
        }.bind(this));
        return ret;
    };
    Vue.prototype.$getPin = function (id) {
        return getPin(id, this);
    };
    Vue.prototype.$isPinned = function (id) {
        return storedPin(id, this).id === id;
    };
    Vue.prototype.$savePin = function (pin) {
        return savePin(pin, this);
    };
    Vue.prototype.$deletePin = function (id) {
        return deletePin(id, this);
    };
};
