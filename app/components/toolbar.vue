<template>

   <div data-uk-sticky>
       <nav class="uk-navbar">
           <div class="uk-container uk-container-center">
               <ul class="uk-navbar-nav">
                   <li>
                       <a href="#instorage-modal" data-uk-modal="" data-uk-tooltip="{delay: 500, pos: 'bottom'}" title="Manage localstorage">
                           <i class="uk-icon-database"></i></a>
                   </li>
               </ul>
               <div class="uk-navbar-content">
                   <tags selected="{{@ filters.tags }}" tag-options="{{ tagOptions }}"></tags>
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

        inherit: true,

        ready: function () {
            console.log('tbar');


        }

    };

</script>
