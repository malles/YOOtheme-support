<template>

   <div data-uk-sticky>
       <nav class="uk-navbar">
           <div class="uk-container uk-container-center">
               <div class="uk-navbar-content uk-navbar-flip">
                   <button v-if="page === 'default'" v-attr="class: filters.showAccepted ? 'uk-button uk-button-small uk-active': 'uk-button uk-button-small'"
                           data-uk-tooltip="{delay:500, pos: 'bottom'}" title="Show/Hide accepted"
                           v-on="click: filters.showAccepted = !filters.showAccepted">
                       <i class="uk-icon-check uk-text-success"></i></button>
                   <button v-attr="class: showPins ? 'uk-button uk-button-small uk-active': 'uk-button uk-button-small'"
                           data-uk-tooltip="{delay:500, pos: 'bottom'}" title="Show/Hide pinned questions"
                           v-on="click: showPins = !showPins">
                       <i class="uk-icon-thumb-tack"></i></button>
               </div>
               <ul class="uk-navbar-nav">
                   <li>
                       <a href="/support" data-uk-tooltip="{delay: 500, pos: 'bottom'}" title="Support index">
                           <i class="uk-icon-home"></i></a>
                   </li>
                   <li>
                       <a href="#instorage-modal" data-uk-modal="" data-uk-tooltip="{delay: 500, pos: 'bottom'}" title="Manage localstorage">
                           <i class="uk-icon-database"></i></a>
                   </li>
               </ul>
               <div class="uk-navbar-content">
                   <tags v-if="page !== 'question'" selected="{{@ filters.tags }}" tag-options="{{ tagOptions }}" page="{{ page }}"></tags>
                   <tags v-if="page === 'question'" selected="{{@ question.tags }}" tag-options="{{ tagOptions }}" page="question"></tags>
               </div>
               <div v-if="page === 'question'" class="uk-navbar-content">
                   <button v-attr="class: question.pinned ? 'uk-button uk-button-small uk-button-success uk-active': 'uk-button uk-button-small uk-button-success'"
                           data-uk-tooltip="{delay:500, pos: 'bottom'}" title="Pin/Unpin question"
                           v-on="click: pinQuestion(question.id)">
                       <i class="uk-icon-thumb-tack"></i></button>
               </div>
               <div class="uk-navbar-content uk-navbar-center">
                   <i class="uk-icon-dashboard uk-margin-small-right"></i>Bazinga!
               </div>
           </div>
       </nav>

   </div>

</template>

<script>

    module.exports = {

        inherit: true

    };

</script>
