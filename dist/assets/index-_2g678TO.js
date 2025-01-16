import{H as g,N as d,am as c,ac as v,ak as S,I as O,c as V,d as p,e as f,F as B,g as L,m as A,aB as K,p as w,J as I,h as D,K as h,t as T}from"./index-D7gtUUeB.js";var k=function(n){var t=n.dt;return`
.p-selectbutton {
    display: inline-flex;
    user-select: none;
    vertical-align: bottom;
    outline-color: transparent;
    border-radius: `.concat(t("selectbutton.border.radius"),`;
}

.p-selectbutton .p-togglebutton {
    border-radius: 0;
    border-width: 1px 1px 1px 0;
}

.p-selectbutton .p-togglebutton:focus-visible {
    position: relative;
    z-index: 1;
}

.p-selectbutton .p-togglebutton:first-child {
    border-left-width: 1px;
    border-top-left-radius: `).concat(t("selectbutton.border.radius"),`;
    border-bottom-left-radius: `).concat(t("selectbutton.border.radius"),`;
}

.p-selectbutton .p-togglebutton:last-child {
    border-top-right-radius: `).concat(t("selectbutton.border.radius"),`;
    border-bottom-right-radius: `).concat(t("selectbutton.border.radius"),`;
}

.p-selectbutton.p-invalid {
    outline: 1px solid `).concat(t("selectbutton.invalid.border.color"),`;
    outline-offset: 0;
}
`)},x={root:function(n){var t=n.props;return["p-selectbutton p-component",{"p-invalid":t.invalid}]}},C=g.extend({name:"selectbutton",theme:k,classes:x}),$={name:"BaseSelectButton",extends:O,props:{modelValue:null,options:Array,optionLabel:null,optionValue:null,optionDisabled:null,multiple:Boolean,allowEmpty:{type:Boolean,default:!0},invalid:{type:Boolean,default:!1},disabled:Boolean,dataKey:null,ariaLabelledby:{type:String,default:null}},style:C,provide:function(){return{$pcSelectButton:this,$parentInstance:this}}};function q(e,n){var t=typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(!t){if(Array.isArray(e)||(t=y(e))||n){t&&(e=t);var a=0,s=function(){};return{s,n:function(){return a>=e.length?{done:!0}:{done:!1,value:e[a++]}},e:function(u){throw u},f:s}}throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var r,l=!0,o=!1;return{s:function(){t=t.call(e)},n:function(){var u=t.next();return l=u.done,u},e:function(u){o=!0,r=u},f:function(){try{l||t.return==null||t.return()}finally{if(o)throw r}}}}function E(e){return j(e)||R(e)||y(e)||F()}function F(){throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function y(e,n){if(e){if(typeof e=="string")return b(e,n);var t={}.toString.call(e).slice(8,-1);return t==="Object"&&e.constructor&&(t=e.constructor.name),t==="Map"||t==="Set"?Array.from(e):t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?b(e,n):void 0}}function R(e){if(typeof Symbol<"u"&&e[Symbol.iterator]!=null||e["@@iterator"]!=null)return Array.from(e)}function j(e){if(Array.isArray(e))return b(e)}function b(e,n){(n==null||n>e.length)&&(n=e.length);for(var t=0,a=Array(n);t<n;t++)a[t]=e[t];return a}var H={name:"SelectButton",extends:$,inheritAttrs:!1,emits:["update:modelValue","change"],methods:{getOptionLabel:function(n){return this.optionLabel?d(n,this.optionLabel):n},getOptionValue:function(n){return this.optionValue?d(n,this.optionValue):n},getOptionRenderKey:function(n){return this.dataKey?d(n,this.dataKey):this.getOptionLabel(n)},getPTOptions:function(n,t){return this.ptm(t,{context:{active:this.isSelected(n),disabled:this.isOptionDisabled(n),option:n}})},isOptionDisabled:function(n){return this.optionDisabled?d(n,this.optionDisabled):!1},onOptionSelect:function(n,t,a){var s=this;if(!(this.disabled||this.isOptionDisabled(t))){var r=this.isSelected(t);if(!(r&&!this.allowEmpty)){var l=this.getOptionValue(t),o;this.multiple?r?o=this.modelValue.filter(function(i){return!c(i,l,s.equalityKey)}):o=this.modelValue?[].concat(E(this.modelValue),[l]):[l]:o=r?null:l,this.focusedIndex=a,this.$emit("update:modelValue",o),this.$emit("change",{event:n,value:o})}}},isSelected:function(n){var t=!1,a=this.getOptionValue(n);if(this.multiple){if(this.modelValue){var s=q(this.modelValue),r;try{for(s.s();!(r=s.n()).done;){var l=r.value;if(c(l,a,this.equalityKey)){t=!0;break}}}catch(o){s.e(o)}finally{s.f()}}}else t=c(this.modelValue,a,this.equalityKey);return t}},computed:{equalityKey:function(){return this.optionValue?null:this.dataKey}},directives:{ripple:v},components:{ToggleButton:S}},P=["aria-labelledby"];function N(e,n,t,a,s,r){var l=V("ToggleButton");return p(),f("div",h({class:e.cx("root"),role:"group","aria-labelledby":e.ariaLabelledby},e.ptmi("root")),[(p(!0),f(B,null,L(e.options,function(o,i){return p(),A(l,{key:r.getOptionRenderKey(o),modelValue:r.isSelected(o),onLabel:r.getOptionLabel(o),offLabel:r.getOptionLabel(o),disabled:e.disabled||r.isOptionDisabled(o),unstyled:e.unstyled,onChange:function(m){return r.onOptionSelect(m,o,i)},pt:e.ptm("pcButton")},K({_:2},[e.$slots.option?{name:"default",fn:w(function(){return[I(e.$slots,"option",{option:o,index:i},function(){return[D("span",h({ref_for:!0},e.ptm("pcButton").label),T(r.getOptionLabel(o)),17)]})]}),key:"0"}:void 0]),1032,["modelValue","onLabel","offLabel","disabled","unstyled","onChange","pt"])}),128))],16,P)}H.render=N;export{H as s};
