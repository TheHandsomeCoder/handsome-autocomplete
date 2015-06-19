var app=angular.module("autocomplete",[]);app.directive("autocomplete",function(){var e=-1;return{restrict:"E",scope:{searchParam:"=ngModel",suggestions:"=data",onType:"=onType",onSelect:"=onSelect",autocompleteRequired:"="},controller:["$scope",function(e){e.selectedIndex=-1,e.initLock=!0,e.setIndex=function(t){e.selectedIndex=parseInt(t)},this.setIndex=function(t){e.setIndex(t),e.$apply()},e.getIndex=function(t){return e.selectedIndex};var t=!0;e.completing=!1,e.$watch("searchParam",function(n,i){i===n||!i&&e.initLock||(t&&"undefined"!=typeof e.searchParam&&null!==e.searchParam&&(e.completing=!0,e.searchFilter=e.searchParam,e.selectedIndex=-1),e.onType&&e.onType(e.searchParam))}),this.preSelect=function(n){t=!1,e.$apply(),t=!0},e.preSelect=this.preSelect,this.preSelectOff=function(){t=!0},e.preSelectOff=this.preSelectOff,e.select=function(n){n&&(e.searchParam=n,e.searchFilter=n,e.onSelect&&e.onSelect(n)),t=!1,e.completing=!1,setTimeout(function(){t=!0},1e3),e.setIndex(-1)}}],link:function(t,n,i){setTimeout(function(){t.initLock=!1,t.$apply()},250);var a="";t.attrs={placeholder:"start typing...","class":"",id:"",inputclass:"",inputid:""};for(var r in i)a=r.replace("attr","").toLowerCase(),0===r.indexOf("attr")&&(t.attrs[a]=i[r]);i.clickActivation&&(n[0].onclick=function(e){t.searchParam||setTimeout(function(){t.completing=!0,t.$apply()},200)});var l={left:37,up:38,right:39,down:40,enter:13,esc:27,tab:9};document.addEventListener("keydown",function(e){var n=e.keyCode||e.which;switch(n){case l.esc:t.select(),t.setIndex(-1),t.$apply(),e.preventDefault()}},!0),document.addEventListener("blur",function(e){setTimeout(function(){t.select(),t.setIndex(-1),t.$apply()},150)},!0),n[0].addEventListener("keydown",function(n){var i=n.keyCode||n.which,a=angular.element(this).find("li").length;if(t.completing&&0!=a)switch(i){case l.up:if(e=t.getIndex()-1,-1>e)e=a-1;else if(e>=a){e=-1,t.setIndex(e),t.preSelectOff();break}t.setIndex(e),-1!==e&&t.preSelect(angular.element(angular.element(this).find("li")[e]).text()),t.$apply();break;case l.down:if(e=t.getIndex()+1,-1>e)e=a-1;else if(e>=a){e=-1,t.setIndex(e),t.preSelectOff(),t.$apply();break}t.setIndex(e),-1!==e&&t.preSelect(angular.element(angular.element(this).find("li")[e]).text());break;case l.left:break;case l.right:case l.enter:case l.tab:e=t.getIndex(),-1!==e?(t.select(angular.element(angular.element(this).find("li")[e]).text()),i==l.enter&&n.preventDefault()):i==l.enter&&t.select(),t.setIndex(-1),t.$apply();break;case l.esc:t.select(),t.setIndex(-1),t.$apply(),n.preventDefault();break;default:return}})},template:'        <div class="autocomplete {{ attrs.class }}" id="{{ attrs.id }}">          <input            type="text"            ng-model="searchParam"            placeholder="{{ attrs.placeholder }}"            class="{{ attrs.inputclass }}"            id="{{ attrs.inputid }}"            ng-required="{{ autocompleteRequired }}" />          <ul ng-show="completing && (suggestions | filter:searchFilter).length > 0">            <li              suggestion              ng-repeat="suggestion in suggestions | filter:searchFilter | orderBy:\'toString()\' track by $index"              index="{{ $index }}"              val="{{ suggestion }}"              ng-class="{ active: ($index === selectedIndex) }"              ng-click="select(suggestion)"              ng-bind-html="suggestion | highlight:searchParam"></li>          </ul>        </div>'}}),app.filter("highlight",["$sce",function(e){return function(t,n){if("function"==typeof t)return"";if(n){var i="("+n.split(/\ /).join(" |")+"|"+n.split(/\ /).join("|")+")",a=new RegExp(i,"gi");i.length&&(t=t.replace(a,'<span class="highlight">$1</span>'))}return e.trustAsHtml(t)}}]),app.directive("suggestion",function(){return{restrict:"A",require:"^autocomplete",link:function(e,t,n,i){t.bind("mouseenter",function(){i.preSelect(n.val),i.setIndex(n.index)}),t.bind("mouseleave",function(){i.preSelectOff()})}}});