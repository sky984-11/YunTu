import{H as i,I as l,d as o,e as n,K as a,J as r,f as s,h as c}from"./index-D7gtUUeB.js";var p=function(d){var t=d.dt;return`
.p-card {
    background: `.concat(t("card.background"),`;
    color: `).concat(t("card.color"),`;
    box-shadow: `).concat(t("card.shadow"),`;
    border-radius: `).concat(t("card.border.radius"),`;
    display: flex;
    flex-direction: column;
}

.p-card-caption {
    display: flex;
    flex-direction: column;
    gap: `).concat(t("card.caption.gap"),`;
}

.p-card-body {
    padding: `).concat(t("card.body.padding"),`;
    display: flex;
    flex-direction: column;
    gap: `).concat(t("card.body.gap"),`;
}

.p-card-title {
    font-size: `).concat(t("card.title.font.size"),`;
    font-weight: `).concat(t("card.title.font.weight"),`;
}

.p-card-subtitle {
    color: `).concat(t("card.subtitle.color"),`;
}
`)},u={root:"p-card p-component",header:"p-card-header",body:"p-card-body",caption:"p-card-caption",title:"p-card-title",subtitle:"p-card-subtitle",content:"p-card-content",footer:"p-card-footer"},m=i.extend({name:"card",theme:p,classes:u}),f={name:"BaseCard",extends:l,style:m,provide:function(){return{$pcCard:this,$parentInstance:this}}},b={name:"Card",extends:f,inheritAttrs:!1};function $(e,d,t,h,y,v){return o(),n("div",a({class:e.cx("root")},e.ptmi("root")),[e.$slots.header?(o(),n("div",a({key:0,class:e.cx("header")},e.ptm("header")),[r(e.$slots,"header")],16)):s("",!0),c("div",a({class:e.cx("body")},e.ptm("body")),[e.$slots.title||e.$slots.subtitle?(o(),n("div",a({key:0,class:e.cx("caption")},e.ptm("caption")),[e.$slots.title?(o(),n("div",a({key:0,class:e.cx("title")},e.ptm("title")),[r(e.$slots,"title")],16)):s("",!0),e.$slots.subtitle?(o(),n("div",a({key:1,class:e.cx("subtitle")},e.ptm("subtitle")),[r(e.$slots,"subtitle")],16)):s("",!0)],16)):s("",!0),c("div",a({class:e.cx("content")},e.ptm("content")),[r(e.$slots,"content")],16),e.$slots.footer?(o(),n("div",a({key:1,class:e.cx("footer")},e.ptm("footer")),[r(e.$slots,"footer")],16)):s("",!0)],16)],16)}b.render=$;export{b as s};
