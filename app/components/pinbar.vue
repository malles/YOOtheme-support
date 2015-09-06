<template>

   <div class="tm-pinbar uk-position-absolute uk-position-top-right uk-width-1-5" v-show="showPins">
       <div data-uk-sticky>
           <div class="uk-block-muted uk-margin-large-top">
               <div class="uk-panel uk-panel-space uk-form">
                   <h3 class="uk-panel-title"><i class="uk-icon-thumb-tack uk-margin-small-right"></i>Pinned Questions</h3>
                   <ul id="pinlist" class="uk-list uk-list-line">
                       <li v-repeat="pin: pins | orderBy ordering orderDir">
                           <div>
                               <small class="uk-margin-small-right">{{ pin.created | dateshort }}</small><strong>
                               <a class="uk-link-muted" href="{{ pin.url }}">{{ pin.title }}</a></strong><br>
                               <div class="uk-text-small uk-text-truncate" title="{{ $getQuestion(pin.id).description }}">{{ $getQuestion(pin.id).description }}</div>
                           </div>
                           <div class="uk-flex">
                               <div>
                                   <a v-if="newMessages(pin.id)" href="{{ pin.url }}" class="uk-badge uk-badge-notification uk-badge-warning">
                                       {{newMessages(pin.id)}}</a>
                                   <small class="uk-margin-small-right">
                                       <a class="uk-icon-times uk-icon-hover" v-on="click: pinQuestion(pin.id)"></a>
                                   </small>
                               </div>
                               <div class="uk-flex-item-1">
                                   <input type="text"  class="uk-form-blank uk-form-small uk-width-1-1" placeholder="..."
                                          v-model="pin.note" v-on="change: $savePin(pin)">
                               </div>
                           </div>

                       </li>
                   </ul>
               </div>
           </div>
       </div>
   </div>
</template>

<script>

    module.exports = {

        data: function () {
            return {
                ordering: 'created',
                orderDir: -1
            }
        },

        inherit: true,

        methods: {
            newMessages: function (id) {
                return this.$getQuestion(id).newMessages();
            }
        }

    };

</script>
