const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let s=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=o.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o.set(i,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1],t[0]);return new s(o,t,i)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:n,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:h,getPrototypeOf:u}=Object,p=globalThis,v=p.trustedTypes,m=v?v.emptyScript:"",g=p.reactiveElementPolyfillSupport,b=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},f=(t,e)=>!n(t,e),_={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:f};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=_){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(t,i,e);void 0!==o&&l(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){const{get:o,set:s}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const a=o?.call(this);s?.call(this,e),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??_}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...d(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,o)=>{if(e)i.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),s=t.litNonce;void 0!==s&&o.setAttribute("nonce",s),o.textContent=e.cssText,i.appendChild(o)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,i);if(void 0!==o&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,o=i._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=i.getPropertyOptions(o),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=o;const a=s.fromAttribute(e,t.type);this[o]=a??this._$Ej?.get(o)??a,this._$Em=null}}requestUpdate(t,e,i,o=!1,s){if(void 0!==t){const a=this.constructor;if(!1===o&&(s=this[t]),i??=a.getPropertyOptions(t),!((i.hasChanged??f)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:o,wrapped:s},a){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==s||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,i,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[b("elementProperties")]=new Map,x[b("finalized")]=new Map,g?.({ReactiveElement:x}),(p.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,$=t=>t,k=w.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,A="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+E,P=`<${C}>`,q=document,M=()=>q.createComment(""),z=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,N="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,I=/-->/g,R=/>/g,B=RegExp(`>|${N}(?:([^\\s"'>=/]+)(${N}*=${N}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),F=/'/g,H=/"/g,L=/^(?:script|style|textarea|title)$/i,O=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),j=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),D=new WeakMap,Q=q.createTreeWalker(q,129);function W(t,e){if(!T(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const K=(t,e)=>{const i=t.length-1,o=[];let s,a=2===e?"<svg>":3===e?"<math>":"",r=U;for(let e=0;e<i;e++){const i=t[e];let n,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===U?"!--"===l[1]?r=I:void 0!==l[1]?r=R:void 0!==l[2]?(L.test(l[2])&&(s=RegExp("</"+l[2],"g")),r=B):void 0!==l[3]&&(r=B):r===B?">"===l[0]?(r=s??U,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,n=l[1],r=void 0===l[3]?B:'"'===l[3]?H:F):r===H||r===F?r=B:r===I||r===R?r=U:(r=B,s=void 0);const h=r===B&&t[e+1].startsWith("/>")?" ":"";a+=r===U?i+P:c>=0?(o.push(n),i.slice(0,c)+A+i.slice(c)+E+h):i+E+(-2===c?e:h)}return[W(t,a+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class Z{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let s=0,a=0;const r=t.length-1,n=this.parts,[l,c]=K(t,e);if(this.el=Z.createElement(l,i),Q.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=Q.nextNode())&&n.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(A)){const e=c[a++],i=o.getAttribute(t).split(E),r=/([.?@])?(.*)/.exec(e);n.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?tt:"?"===r[1]?et:"@"===r[1]?it:X}),o.removeAttribute(t)}else t.startsWith(E)&&(n.push({type:6,index:s}),o.removeAttribute(t));if(L.test(o.tagName)){const t=o.textContent.split(E),e=t.length-1;if(e>0){o.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],M()),Q.nextNode(),n.push({type:2,index:++s});o.append(t[e],M())}}}else if(8===o.nodeType)if(o.data===C)n.push({type:2,index:s});else{let t=-1;for(;-1!==(t=o.data.indexOf(E,t+1));)n.push({type:7,index:s}),t+=E.length-1}s++}}static createElement(t,e){const i=q.createElement("template");return i.innerHTML=t,i}}function Y(t,e,i=t,o){if(e===j)return e;let s=void 0!==o?i._$Co?.[o]:i._$Cl;const a=z(e)?void 0:e._$litDirective$;return s?.constructor!==a&&(s?._$AO?.(!1),void 0===a?s=void 0:(s=new a(t),s._$AT(t,i,o)),void 0!==o?(i._$Co??=[])[o]=s:i._$Cl=s),void 0!==s&&(e=Y(t,s._$AS(t,e.values),s,o)),e}class G{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,o=(t?.creationScope??q).importNode(e,!0);Q.currentNode=o;let s=Q.nextNode(),a=0,r=0,n=i[0];for(;void 0!==n;){if(a===n.index){let e;2===n.type?e=new J(s,s.nextSibling,this,t):1===n.type?e=new n.ctor(s,n.name,n.strings,this,t):6===n.type&&(e=new ot(s,this,t)),this._$AV.push(e),n=i[++r]}a!==n?.index&&(s=Q.nextNode(),a++)}return Q.currentNode=q,o}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class J{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,o){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Y(this,t,e),z(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==j&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>T(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(q.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,o="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(W(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new G(o,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=D.get(t.strings);return void 0===e&&D.set(t.strings,e=new Z(t)),e}k(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const s of t)o===e.length?e.push(i=new J(this.O(M()),this.O(M()),this,this.options)):i=e[o],i._$AI(s),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=$(t).nextSibling;$(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,o,s){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=V}_$AI(t,e=this,i,o){const s=this.strings;let a=!1;if(void 0===s)t=Y(this,t,e,0),a=!z(t)||t!==this._$AH&&t!==j,a&&(this._$AH=t);else{const o=t;let r,n;for(t=s[0],r=0;r<s.length-1;r++)n=Y(this,o[i+r],e,r),n===j&&(n=this._$AH[r]),a||=!z(n)||n!==this._$AH[r],n===V?t=V:t!==V&&(t+=(n??"")+s[r+1]),this._$AH[r]=n}a&&!o&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends X{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class et extends X{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class it extends X{constructor(t,e,i,o,s){super(t,e,i,o,s),this.type=5}_$AI(t,e=this){if((t=Y(this,t,e,0)??V)===j)return;const i=this._$AH,o=t===V&&i!==V||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==V&&(i===V||o);o&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Y(this,t)}}const st=w.litHtmlPolyfillSupport;st?.(Z,J),(w.litHtmlVersions??=[]).push("3.3.2");const at=globalThis;class rt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const o=i?.renderBefore??e;let s=o._$litPart$;if(void 0===s){const t=i?.renderBefore??null;o._$litPart$=s=new J(e.insertBefore(M(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return j}}rt._$litElement$=!0,rt.finalized=!0,at.litElementHydrateSupport?.({LitElement:rt});const nt=at.litElementPolyfillSupport;nt?.({LitElement:rt}),(at.litElementVersions??=[]).push("4.2.2");const lt=a`
  /* ── Quality tier colors ──────────────────────────────────── */
  :host {
    --volumio-quality-hires: #D4A017;
    --volumio-quality-hires-bg: rgba(212, 160, 23, 0.12);
    --volumio-quality-lossless: #00ACC1;
    --volumio-quality-lossless-bg: rgba(0, 172, 193, 0.12);
    --volumio-quality-lossy: #9E9E9E;
    --volumio-quality-lossy-bg: rgba(158, 158, 158, 0.08);
    --volumio-quality-basic: #616161;
    --volumio-quality-stream: #42A5F5;
    --volumio-quality-stream-bg: rgba(66, 165, 245, 0.12);

    /* ── Layout dimensions ────────────────────────────────── */
    --volumio-nav-width-pinned: 240px;
    --volumio-nav-width-collapsed: 56px;
    --volumio-queue-width: 320px;
    --volumio-topbar-height: 48px;
    --volumio-breadcrumb-height: 32px;
    --volumio-player-bar-height: 80px;

    /* ── Spacing scale (4px grid) ─────────────────────────── */
    --volumio-space-xs: 4px;
    --volumio-space-sm: 8px;
    --volumio-space-md: 16px;
    --volumio-space-lg: 24px;
    --volumio-space-xl: 32px;
    --volumio-space-xxl: 48px;

    /* ── Now Playing ──────────────────────────────────────── */
    --volumio-now-playing-bg: var(--primary-background-color, #000000);
  }

  /* ── Reduced motion ─────────────────────────────────────── */
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* ── Focus indicators (accessibility) ───────────────────── */
  :focus-visible {
    outline: 2px solid var(--primary-color, #03a9f4);
    outline-offset: 2px;
  }

  /* ── Common utility classes ─────────────────────────────── */
  .ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`,ct=new Set(["flac","alac","wav","aiff","ape","wv","wavpack","dsf","dff","dsd"]),dt=new Set(["mp3","ogg","aac","opus","vorbis","wma","m4a"]),ht=new Set(["qobuz","tidal","spotify","spop","pandora","youtube","youtube2","webradio","mpd","upnp","airplay","snapcast","bluetooth"]);function ut({trackType:t,samplerate:e,bitdepth:i,bitrate:o,isStream:s}){const a=(r=t)?String(r).trim().toLowerCase().replace(/\s+/g,""):"";var r;const n=function(t){if(null==t)return null;if("number"==typeof t)return t;const e=String(t).trim().toLowerCase().match(/([\d.]+)/);if(!e)return null;const i=parseFloat(e[1]);return i>1e3?i/1e3:i}(e),l=function(t){if(null==t)return null;if("number"==typeof t)return t;const e=String(t).trim().match(/(\d+)/);return e?parseInt(e[1],10):null}(i),c=function(t){if(null==t)return null;if("number"==typeof t)return t;const e=String(t).trim().match(/([\d.]+)/);return e?parseFloat(e[1]):null}(o),d=ht.has(a)?"":a,h=ct.has(d),u=dt.has(d);if(s){return pt("stream",d?`${d.toUpperCase()}${c?` ${Math.round(c)}`:""}`:"STREAM","STREAM","var(--volumio-quality-stream)","var(--volumio-quality-stream-bg, rgba(66, 165, 245, 0.12))")}if(h&&(null!=l&&l>16||null!=n&&n>44.1))return pt("hires",vt(d,l,n),"HI-RES","var(--volumio-quality-hires)","var(--volumio-quality-hires-bg, rgba(212, 160, 23, 0.12))");if(h)return pt("lossless",vt(d,l,n),"LOSSLESS","var(--volumio-quality-lossless)","var(--volumio-quality-lossless-bg, rgba(0, 172, 193, 0.12))");if(!u&&(null!=l||null!=n)){if(null!=l&&l>16||null!=n&&n>44.1){return pt("hires",vt(d||"HI-RES",l,n),"HI-RES","var(--volumio-quality-hires)","var(--volumio-quality-hires-bg, rgba(212, 160, 23, 0.12))")}return pt("lossless",vt(d||"LOSSLESS",l,n),"LOSSLESS","var(--volumio-quality-lossless)","var(--volumio-quality-lossless-bg, rgba(0, 172, 193, 0.12))")}if(u){if(null!=c&&c<256)return pt("basic",`${d.toUpperCase()} ${Math.round(c)}`,"BASIC","var(--volumio-quality-basic, #616161)","rgba(97, 97, 97, 0.08)");return pt("high",d?`${d.toUpperCase()}${c?` ${Math.round(c)}`:""}`:"HIGH","HIGH","var(--volumio-quality-lossy)","var(--volumio-quality-lossy-bg, rgba(158, 158, 158, 0.08))")}return d&&null!=c?c<256?pt("basic",`${Math.round(c)} kbps`,"BASIC","var(--volumio-quality-basic, #616161)","rgba(97, 97, 97, 0.08)"):pt("high",`${Math.round(c)} kbps`,"HIGH","var(--volumio-quality-lossy)","var(--volumio-quality-lossy-bg, rgba(158, 158, 158, 0.08))"):pt("unknown","","","var(--secondary-text-color)","transparent")}function pt(t,e,i,o,s){return{tier:t,label:e,tierLabel:i,color:o,colorBg:s}}function vt(t,e,i){const o=t.toUpperCase();return e&&i?`${o} ${e}/${i}`:e?`${o} ${e}-bit`:i?`${o} ${i}kHz`:o}const mt=[{key:"now-playing",label:"Now Playing"},{key:"browse",label:"Browse"},{key:"playlists",label:"Playlists"},{key:"favorites",label:"Favorites"}];customElements.define("volumio-top-bar",class extends rt{static get properties(){return{activeView:{type:String,attribute:"active-view"},breadcrumb:{type:Array},showBackButton:{type:Boolean,attribute:"show-back-button"},narrow:{type:Boolean}}}static get styles(){return a`
      :host {
        display: block;
        position: relative;
        z-index: 100;
      }

      .topbar {
        display: flex;
        align-items: center;
        height: var(--volumio-topbar-height, 48px);
        padding: 0 var(--volumio-space-sm, 8px);
        background: var(--card-background-color, #1e1e1e);
        border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.12));
        gap: var(--volumio-space-xs, 4px);
      }

      .icon-btn {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        border: none;
        background: transparent;
        color: var(--primary-text-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        padding: 0;
      }

      .icon-btn:hover {
        background: var(--divider-color, rgba(255,255,255,0.08));
      }

      ha-icon {
        --mdc-icon-size: 24px;
      }

      .tabs {
        display: flex;
        gap: 2px;
        flex-shrink: 0;
      }

      .tab {
        padding: 6px 14px;
        border-radius: 6px;
        border: none;
        background: transparent;
        color: var(--secondary-text-color, #aaa);
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
        white-space: nowrap;
      }

      .tab:hover {
        background: var(--divider-color, rgba(255,255,255,0.08));
        color: var(--primary-text-color);
      }

      .tab.active {
        background: var(--primary-color, #03a9f4);
        color: #fff;
      }

      .spacer {
        flex: 1;
      }

      .search-field {
        display: flex;
        align-items: center;
        background: var(--primary-background-color, #121212);
        border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
        border-radius: 20px;
        padding: 0 12px;
        height: 34px;
        min-width: 180px;
        max-width: 300px;
        flex-shrink: 1;
        gap: 6px;
        cursor: text;
      }

      .search-field ha-icon {
        --mdc-icon-size: 18px;
        color: var(--secondary-text-color);
        flex-shrink: 0;
      }

      .search-field input {
        flex: 1;
        border: none;
        background: transparent;
        color: var(--primary-text-color);
        font-size: 13px;
        outline: none;
        min-width: 0;
      }

      .search-field input::placeholder {
        color: var(--secondary-text-color, #888);
      }

      .search-field input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .breadcrumb-row {
        display: flex;
        align-items: center;
        height: var(--volumio-breadcrumb-height, 32px);
        padding: 0 var(--volumio-space-md, 16px);
        background: var(--card-background-color, #1e1e1e);
        border-bottom: 1px solid var(--divider-color, rgba(255,255,255,0.06));
        font-size: 13px;
        color: var(--secondary-text-color);
        gap: 4px;
        overflow: hidden;
      }

      .breadcrumb-segment {
        cursor: pointer;
        color: var(--secondary-text-color);
        text-decoration: none;
        white-space: nowrap;
      }

      .breadcrumb-segment:hover {
        color: var(--primary-text-color);
        text-decoration: underline;
      }

      .breadcrumb-segment.current {
        color: var(--primary-text-color);
        font-weight: 600;
        cursor: default;
      }

      .breadcrumb-segment.current:hover {
        text-decoration: none;
      }

      .breadcrumb-sep {
        color: var(--secondary-text-color);
        opacity: 0.5;
        flex-shrink: 0;
      }

      @media (max-width: 768px) {
        .search-field {
          min-width: 120px;
        }
        .tab {
          padding: 6px 10px;
          font-size: 13px;
        }
      }
    `}constructor(){super(),this.activeView="now-playing",this.breadcrumb=[],this.showBackButton=!1,this.narrow=!1}render(){return O`
      <div class="topbar">
        <button
          class="icon-btn"
          @click=${this._toggleNav}
          title="Toggle navigation"
          aria-label="Toggle navigation sidebar"
        >
          <ha-icon icon="mdi:menu"></ha-icon>
        </button>

        ${this.showBackButton?O`
          <button
            class="icon-btn"
            @click=${this._goBack}
            title="Back"
            aria-label="Go back"
          >
            <ha-icon icon="mdi:arrow-left"></ha-icon>
          </button>
        `:""}

        <div class="tabs">
          ${mt.map(t=>O`
            <button
              class="tab ${this.activeView===t.key?"active":""}"
              @click=${()=>this._navigate(t.key)}
            >
              ${t.label}
            </button>
          `)}
        </div>

        <div class="spacer"></div>

        <div class="search-field" @click=${this._focusSearch} title="Search coming in a future update">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="text"
            placeholder="Search (coming soon)..."
            aria-label="Search music — coming soon"
            disabled
          />
        </div>

        <button
          class="icon-btn"
          @click=${this._toggleQueue}
          title="Toggle queue"
          aria-label="Toggle queue panel"
        >
          <ha-icon icon="mdi:playlist-music"></ha-icon>
        </button>
      </div>

      ${this.breadcrumb.length>0?this._renderBreadcrumb():""}
    `}_renderBreadcrumb(){const t=this.breadcrumb,e=t.length>5?[t[0],{label:"...",path:null},...t.slice(-3)]:t;return O`
      <div class="breadcrumb-row">
        ${e.map((t,i)=>{const o=i===e.length-1;return O`
            ${i>0?O`<span class="breadcrumb-sep"><ha-icon icon="mdi:chevron-right" style="--mdc-icon-size:14px"></ha-icon></span>`:""}
            <span
              class="breadcrumb-segment ${o?"current":""}"
              @click=${()=>!o&&null!=t.path&&this._navigate(t.path)}
            >${t.label}</span>
          `})}
      </div>
    `}_navigate(t){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:t},bubbles:!0,composed:!0}))}_toggleNav(){this.dispatchEvent(new CustomEvent("volumio-toggle-nav",{bubbles:!0,composed:!0}))}_toggleQueue(){this.dispatchEvent(new CustomEvent("volumio-toggle-queue",{bubbles:!0,composed:!0}))}_goBack(){this.dispatchEvent(new CustomEvent("volumio-back",{bubbles:!0,composed:!0}))}_focusSearch(){const t=this.shadowRoot.querySelector(".search-field input");t&&t.focus()}_onSearchFocus(){this.dispatchEvent(new CustomEvent("volumio-search-focus",{bubbles:!0,composed:!0}))}});const gt=[{key:"favorites",label:"Favorites",icon:"mdi:heart"},{key:"playlists",label:"Playlists",icon:"mdi:playlist-music-outline"},{key:"history",label:"History",icon:"mdi:history"}],bt={music_service:"mdi:music-box",mpd:"mdi:folder-music",webradio:"mdi:radio",podcast:"mdi:podcast"};customElements.define("volumio-left-nav",class extends rt{static get properties(){return{sources:{type:Array},activeSource:{type:String,attribute:"active-source"},mode:{type:String},activeView:{type:String,attribute:"active-view"}}}static get styles(){return a`
      :host {
        display: block;
        height: 100%;
      }

      /* ── Pinned nav ──────────────────────────────── */
      .nav {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: var(--card-background-color, #1e1e1e);
        border-right: 1px solid var(--divider-color, rgba(255,255,255,0.08));
        overflow: hidden;
      }

      .nav.pinned {
        width: var(--volumio-nav-width-pinned, 240px);
      }

      .nav.collapsed {
        width: var(--volumio-nav-width-collapsed, 56px);
      }

      .nav.flyout {
        width: var(--volumio-nav-width-pinned, 240px);
      }

      .nav-scroll {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: var(--volumio-space-sm, 8px) 0;
      }

      .nav-section-label {
        padding: var(--volumio-space-md, 16px) var(--volumio-space-md, 16px) var(--volumio-space-xs, 4px);
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color, #888);
      }

      .nav-section-label.collapsed {
        display: none;
      }

      .nav-item {
        display: flex;
        align-items: center;
        height: 44px;
        padding: 0 var(--volumio-space-md, 16px);
        cursor: pointer;
        color: var(--primary-text-color);
        font-size: 14px;
        transition: background 0.15s;
        gap: 12px;
        text-decoration: none;
        border: none;
        background: none;
        width: 100%;
        text-align: left;
        position: relative;
      }

      .nav-item:hover {
        background: var(--divider-color, rgba(255,255,255,0.08));
      }

      .nav-item.active {
        color: var(--primary-color, #03a9f4);
      }

      .nav-item.active::before {
        content: "";
        position: absolute;
        left: 0;
        top: 8px;
        bottom: 8px;
        width: 3px;
        background: var(--primary-color, #03a9f4);
        border-radius: 0 2px 2px 0;
      }

      .nav-item ha-icon {
        --mdc-icon-size: 22px;
        flex-shrink: 0;
        width: 24px;
      }

      .nav-item-label {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .collapsed .nav-item {
        justify-content: center;
        padding: 0;
      }

      .collapsed .nav-item-label {
        display: none;
      }

      .collapsed .nav-item ha-icon {
        margin: 0;
      }

      .nav-divider {
        height: 1px;
        background: var(--divider-color, rgba(255,255,255,0.08));
        margin: var(--volumio-space-sm, 8px) var(--volumio-space-md, 16px);
      }

      .nav-footer {
        border-top: 1px solid var(--divider-color, rgba(255,255,255,0.08));
        padding: var(--volumio-space-sm, 8px) 0;
      }

      .pin-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 36px;
        border: none;
        background: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        font-size: 12px;
        gap: 6px;
      }

      .pin-btn:hover {
        color: var(--primary-text-color);
        background: var(--divider-color, rgba(255,255,255,0.08));
      }

      .pin-btn ha-icon {
        --mdc-icon-size: 18px;
      }

      /* Collapsed: pin button icon only */
      .collapsed .pin-btn span {
        display: none;
      }
    `}constructor(){super(),this.sources=[],this.activeSource="",this.mode="pinned",this.activeView=""}render(){const t="collapsed"===this.mode;return O`
      <nav class="nav ${this.mode}" aria-label="Music sources">
        <div class="nav-scroll">
          <div class="nav-section-label ${t?"collapsed":""}">Sources</div>
          ${this.sources.map(t=>{const e=bt[t.plugin_name]||bt[t.plugin_type]||"mdi:music-box",i=this.activeSource===t.plugin_name;return O`
              <button
                class="nav-item ${i?"active":""}"
                @click=${()=>this._selectSource(t)}
                title="${t.name}"
                aria-label="${t.name}"
              >
                <ha-icon icon="${e}"></ha-icon>
                <span class="nav-item-label">${t.name}</span>
              </button>
            `})}

          <div class="nav-divider"></div>
          <div class="nav-section-label ${t?"collapsed":""}">Shortcuts</div>

          ${gt.map(t=>O`
            <button
              class="nav-item ${this.activeView===t.key?"active":""}"
              @click=${()=>this._navigate(t.key)}
              title="${t.label}"
              aria-label="${t.label}"
            >
              <ha-icon icon="${t.icon}"></ha-icon>
              <span class="nav-item-label">${t.label}</span>
            </button>
          `)}

          <div class="nav-divider"></div>

          <button
            class="nav-item"
            @click=${()=>this._navigate("settings")}
            title="Settings"
            aria-label="Panel Settings"
          >
            <ha-icon icon="mdi:cog"></ha-icon>
            <span class="nav-item-label">Settings</span>
          </button>
        </div>

        <div class="nav-footer">
          <button class="pin-btn" @click=${this._togglePin} title="${t?"Pin sidebar":"Collapse sidebar"}">
            <ha-icon icon="${t?"mdi:pin":"mdi:pin-off"}"></ha-icon>
            <span>${t?"Pin":"Collapse"}</span>
          </button>
        </div>
      </nav>
    `}_selectSource(t){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"browse",source:t.plugin_name,sourceUri:t.uri},bubbles:!0,composed:!0}))}_navigate(t){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:t},bubbles:!0,composed:!0}))}_togglePin(){const t="collapsed"===this.mode;this.dispatchEvent(new CustomEvent("volumio-nav-pin",{detail:{pinned:t},bubbles:!0,composed:!0}))}});customElements.define("volumio-quality-badge",class extends rt{static get properties(){return{quality:{type:Object},size:{type:String}}}static get styles(){return a`
      :host {
        display: inline-block;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        line-height: 1;
        white-space: nowrap;
      }

      .badge.normal {
        font-size: 11px;
        height: 22px;
      }

      .badge.small {
        font-size: 10px;
        height: 18px;
        padding: 1px 6px;
      }

      .badge.large {
        font-size: 13px;
        height: 26px;
        padding: 3px 12px;
      }
    `}constructor(){super(),this.quality=null,this.size="normal"}render(){if(!this.quality||"unknown"===this.quality.tier||!this.quality.label)return O``;const t=this.quality,e="small"===this.size?"small":"large"===this.size?"large":"normal";return O`
      <span
        class="badge ${e}"
        style="color: ${t.color}; background: ${t.colorBg};"
        aria-label="Audio quality: ${t.label}"
        title="${t.tierLabel}: ${t.label}"
      >
        ${t.label}
      </span>
    `}});const yt={qobuz:"Qobuz",tidal:"TIDAL",mpd:"Local",webradio:"Radio",spotify:"Spotify",spop:"Spotify",pandora:"Pandora",youtube:"YouTube",youtube2:"YouTube"},ft={mpd:"mdi:folder-music",webradio:"mdi:radio"};customElements.define("volumio-source-badge",class extends rt{static get properties(){return{source:{type:String}}}static get styles(){return a`
      :host {
        display: inline-flex;
        align-items: center;
      }

      .source {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        color: var(--secondary-text-color, #727272);
        white-space: nowrap;
      }

      ha-icon {
        --mdc-icon-size: 14px;
        width: 14px;
        height: 14px;
      }
    `}constructor(){super(),this.source=""}render(){if(!this.source)return O``;const t=yt[this.source]||this.source,e=ft[this.source]||null;return O`
      <span class="source">
        ${e?O`<ha-icon icon="${e}"></ha-icon>`:""}
        ${t}
      </span>
    `}});customElements.define("volumio-player-bar",class extends rt{static get properties(){return{playerState:{type:String,attribute:"player-state"},title:{type:String},artist:{type:String},albumArt:{type:String,attribute:"album-art"},duration:{type:Number},position:{type:Number},positionUpdatedAt:{type:String,attribute:"position-updated-at"},volume:{type:Number},muted:{type:Boolean},shuffle:{type:Boolean},repeat:{type:String},quality:{type:Object},source:{type:String},volumeEnabled:{type:Boolean,attribute:"volume-enabled"},isFavorite:{type:Boolean,attribute:"is-favorite"},_displayPosition:{type:Number,state:!0},_isDragging:{type:Boolean,state:!0}}}static get styles(){return a`
      :host {
        display: block;
        position: relative;
        z-index: 100;
      }

      .player-bar {
        display: flex;
        align-items: center;
        height: var(--volumio-player-bar-height, 80px);
        padding: 0 var(--volumio-space-md, 16px);
        background: var(--card-background-color, #1e1e1e);
        border-top: 1px solid var(--divider-color, rgba(255,255,255,0.12));
        gap: var(--volumio-space-md, 16px);
      }

      /* ── Album art ─────────────────────────────── */
      .art {
        width: 56px;
        height: 56px;
        border-radius: 4px;
        object-fit: cover;
        cursor: pointer;
        flex-shrink: 0;
        background: var(--divider-color, #333);
      }

      .art-placeholder {
        width: 56px;
        height: 56px;
        border-radius: 4px;
        flex-shrink: 0;
        background: var(--divider-color, #333);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
      }

      .art-placeholder ha-icon {
        --mdc-icon-size: 28px;
        color: var(--secondary-text-color);
      }

      /* ── Track info ────────────────────────────── */
      .track-info {
        flex: 0 1 200px;
        min-width: 0;
        cursor: pointer;
      }

      .track-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.3;
      }

      .track-artist {
        font-size: 12px;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.3;
      }

      .track-info-wrap {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 0 1 220px;
        min-width: 0;
      }

      .fav-btn {
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        color: var(--secondary-text-color);
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
      }

      .fav-btn ha-icon {
        --mdc-icon-size: 20px;
      }

      .fav-btn.active {
        color: #e91e63;
      }

      /* ── Progress section ──────────────────────── */
      .progress-section {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 200px;
        gap: 2px;
      }

      .controls-row {
        display: flex;
        align-items: center;
        gap: var(--volumio-space-sm, 8px);
      }

      .ctrl-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background: transparent;
        color: var(--primary-text-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        transition: background 0.15s;
      }

      .ctrl-btn:hover {
        background: var(--divider-color, rgba(255,255,255,0.08));
      }

      .ctrl-btn.play-pause {
        width: 42px;
        height: 42px;
      }

      .ctrl-btn.play-pause ha-icon {
        --mdc-icon-size: 28px;
      }

      .ctrl-btn.active {
        color: var(--primary-color, #03a9f4);
      }

      .ctrl-btn ha-icon {
        --mdc-icon-size: 22px;
      }

      .ctrl-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .progress-row {
        display: flex;
        align-items: center;
        width: 100%;
        gap: 6px;
      }

      .time-label {
        font-size: 11px;
        color: var(--secondary-text-color);
        min-width: 36px;
        text-align: center;
        font-variant-numeric: tabular-nums;
      }

      .progress-track {
        flex: 1;
        height: 4px;
        background: var(--divider-color, rgba(255,255,255,0.15));
        border-radius: 2px;
        cursor: pointer;
        position: relative;
        transition: height 0.1s;
      }

      .progress-track:hover {
        height: 6px;
      }

      .progress-fill {
        height: 100%;
        background: var(--primary-color, #03a9f4);
        border-radius: 2px;
        transition: none;
        position: relative;
      }

      .progress-thumb {
        position: absolute;
        right: -6px;
        top: 50%;
        transform: translateY(-50%);
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--primary-color, #03a9f4);
        opacity: 0;
        transition: opacity 0.1s;
      }

      .progress-track:hover .progress-thumb {
        opacity: 1;
      }

      /* ── Right section (quality, volume) ────────── */
      .right-section {
        display: flex;
        align-items: center;
        gap: var(--volumio-space-sm, 8px);
        flex-shrink: 0;
      }

      .quality-source {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 2px;
      }

      .volume-section {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .vol-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: none;
        background: transparent;
        color: var(--primary-text-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }

      .vol-btn:hover {
        background: var(--divider-color, rgba(255,255,255,0.08));
      }

      .vol-btn ha-icon {
        --mdc-icon-size: 20px;
      }

      .vol-slider {
        width: 100px;
        height: 4px;
        -webkit-appearance: none;
        appearance: none;
        background: var(--divider-color, rgba(255,255,255,0.15));
        border-radius: 2px;
        outline: none;
        cursor: pointer;
      }

      .vol-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--primary-color, #03a9f4);
        cursor: pointer;
      }

      .vol-slider::-moz-range-thumb {
        width: 14px;
        height: 14px;
        border-radius: 50%;
        background: var(--primary-color, #03a9f4);
        cursor: pointer;
        border: none;
      }

      /* ── Empty state ────────────────────────────── */
      .empty-state {
        display: flex;
        align-items: center;
        justify-content: center;
        height: var(--volumio-player-bar-height, 80px);
        background: var(--card-background-color, #1e1e1e);
        border-top: 1px solid var(--divider-color, rgba(255,255,255,0.12));
        color: var(--secondary-text-color);
        font-size: 14px;
        gap: 8px;
      }

      .empty-state ha-icon {
        --mdc-icon-size: 20px;
      }

      /* ── Responsive ─────────────────────────────── */
      @media (max-width: 1024px) {
        .quality-source {
          display: none;
        }
      }

      @media (max-width: 768px) {
        .player-bar {
          flex-wrap: wrap;
          height: auto;
          min-height: var(--volumio-player-bar-height, 80px);
          padding: var(--volumio-space-sm, 8px) var(--volumio-space-md, 16px);
          gap: var(--volumio-space-sm, 8px);
        }

        .progress-section {
          order: 10;
          width: 100%;
          flex: 1 1 100%;
          min-width: 0;
        }

        .volume-section {
          display: none;
        }
      }

      /* ── Skeleton / loading state ──────────────── */
      @keyframes shimmer {
        0% { opacity: 0.3; }
        50% { opacity: 0.15; }
        100% { opacity: 0.3; }
      }

      .skeleton-bar-row {
        display: flex;
        align-items: center;
        gap: var(--volumio-space-md, 16px);
        height: var(--volumio-player-bar-height, 80px);
        padding: var(--volumio-space-sm, 8px) var(--volumio-space-md, 16px);
        background: var(--card-background-color, #1e1e1e);
        border-top: 1px solid var(--divider-color, rgba(255,255,255,0.12));
      }

      .skeleton-art {
        width: 56px;
        height: 56px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
        flex: 0 0 auto;
      }

      .skeleton-info {
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 0 1 220px;
      }

      .skeleton-bar {
        height: 12px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-bar.title { width: 70%; height: 14px; }
      .skeleton-bar.artist { width: 50%; }

      .skeleton-progress {
        flex: 1;
        height: 4px;
        border-radius: 2px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }
    `}constructor(){super(),this.playerState="idle",this.title="",this.artist="",this.albumArt="",this.duration=0,this.position=0,this.positionUpdatedAt="",this.volume=0,this.muted=!1,this.shuffle=!1,this.repeat="off",this.quality=null,this.source="",this.volumeEnabled=!0,this.isFavorite=!1,this._displayPosition=0,this._isDragging=!1,this._rafId=null}connectedCallback(){super.connectedCallback(),this._startProgressAnimation()}disconnectedCallback(){super.disconnectedCallback(),this._stopProgressAnimation()}updated(t){(t.has("position")||t.has("positionUpdatedAt")||t.has("playerState"))&&(this._isDragging||(this._displayPosition=this.position||0))}_startProgressAnimation(){const t=()=>{if("playing"===this.playerState&&!this._isDragging&&this.positionUpdatedAt){const t=new Date(this.positionUpdatedAt).getTime(),e=(Date.now()-t)/1e3,i=(this.position||0)+e;this._displayPosition=Math.min(i,this.duration||1/0)}this._rafId=requestAnimationFrame(t)};this._rafId=requestAnimationFrame(t)}_stopProgressAnimation(){this._rafId&&(cancelAnimationFrame(this._rafId),this._rafId=null)}render(){if("unavailable"===this.playerState)return O`
        <div class="skeleton-bar-row" aria-busy="true" aria-label="Loading">
          <div class="skeleton-art"></div>
          <div class="skeleton-info">
            <div class="skeleton-bar title"></div>
            <div class="skeleton-bar artist"></div>
          </div>
          <div class="skeleton-progress"></div>
        </div>
      `;if(!("playing"===this.playerState||"paused"===this.playerState)&&!this.title)return O`
        <div class="empty-state">
          <ha-icon icon="mdi:music-note-off"></ha-icon>
          <span>Nothing playing</span>
        </div>
      `;const t="playing"===this.playerState,e=this.duration>0?Math.min(100,this._displayPosition/this.duration*100):0,i="one"===this.repeat?"mdi:repeat-once":"mdi:repeat",o="off"!==this.repeat,s=this.muted?"mdi:volume-mute":"mdi:volume-high";return O`
      <div class="player-bar">
        ${this.albumArt?O`<img
              class="art"
              src="${this.albumArt}"
              alt="Album art"
              @click=${this._goToNowPlaying}
              @error=${this._onArtError}
            />`:O`<div class="art-placeholder" @click=${this._goToNowPlaying}>
              <ha-icon icon="mdi:music-note"></ha-icon>
            </div>`}

        <div class="track-info-wrap">
          <div class="track-info" @click=${this._goToNowPlaying}>
            <div class="track-title">${this.title||"—"}</div>
            <div class="track-artist">${this.artist||""}</div>
          </div>
          <button
            class="fav-btn ${this.isFavorite?"active":""}"
            @click=${this._toggleFavorite}
            aria-label="${this.isFavorite?"Remove from favorites":"Add to favorites"}"
            title="${this.isFavorite?"Remove from favorites":"Add to favorites"}"
          >
            <ha-icon icon="${this.isFavorite?"mdi:heart":"mdi:heart-outline"}"></ha-icon>
          </button>
        </div>

        <div class="progress-section">
          <div class="controls-row">
            <button
              class="ctrl-btn ${this.shuffle?"active":""}"
              @click=${()=>this._command("shuffle_set",!this.shuffle)}
              title="Shuffle ${this.shuffle?"on":"off"}"
              aria-label="Shuffle: ${this.shuffle?"on":"off"}"
            >
              <ha-icon icon="mdi:shuffle-variant"></ha-icon>
            </button>

            <button class="ctrl-btn" @click=${()=>this._command("prev")} aria-label="Previous track">
              <ha-icon icon="mdi:skip-previous"></ha-icon>
            </button>

            <button class="ctrl-btn play-pause" @click=${()=>this._command("play_pause")} aria-label="${t?"Pause":"Play"}">
              <ha-icon icon="${t?"mdi:pause":"mdi:play"}"></ha-icon>
            </button>

            <button class="ctrl-btn" @click=${()=>this._command("next")} aria-label="Next track">
              <ha-icon icon="mdi:skip-next"></ha-icon>
            </button>

            <button
              class="ctrl-btn ${o?"active":""}"
              @click=${()=>this._cycleRepeat()}
              title="Repeat: ${this.repeat}"
              aria-label="Repeat: ${this.repeat}"
            >
              <ha-icon icon="${i}"></ha-icon>
            </button>
          </div>

          <div class="progress-row">
            <span class="time-label">${this._formatTime(this._displayPosition)}</span>
            <div
              class="progress-track"
              @click=${this._onProgressClick}
              aria-label="Playback progress: ${this._formatTime(this._displayPosition)} of ${this._formatTime(this.duration)}"
              role="slider"
              aria-valuemin="0"
              aria-valuemax="${this.duration||0}"
              aria-valuenow="${Math.floor(this._displayPosition)}"
            >
              <div class="progress-fill" style="width: ${e}%">
                <div class="progress-thumb"></div>
              </div>
            </div>
            <span class="time-label">${this._formatTime(this.duration)}</span>
          </div>
        </div>

        <div class="right-section">
          <div class="quality-source">
            <volumio-quality-badge .quality=${this.quality}></volumio-quality-badge>
            <volumio-source-badge .source=${this.source}></volumio-source-badge>
          </div>

          ${this.volumeEnabled?O`
            <div class="volume-section">
              <button
                class="vol-btn"
                @click=${()=>this._command("mute_toggle")}
                aria-label="Volume: ${this.muted?"muted":this.volume+"%"}"
              >
                <ha-icon icon="${s}"></ha-icon>
              </button>
              <input
                class="vol-slider"
                type="range"
                min="0"
                max="100"
                .value=${String(this.volume)}
                @input=${this._onVolumeInput}
                @change=${this._onVolumeChange}
                aria-label="Volume: ${this.volume}%"
              />
            </div>
          `:""}
        </div>
      </div>
    `}_command(t,e){this.dispatchEvent(new CustomEvent("volumio-command",{detail:{command:t,value:e},bubbles:!0,composed:!0}))}_cycleRepeat(){const t="off"===this.repeat?"all":"all"===this.repeat?"one":"off";this._command("repeat_set",t)}_onProgressClick(t){const e=t.currentTarget.getBoundingClientRect(),i=Math.max(0,Math.min(1,(t.clientX-e.left)/e.width)),o=Math.floor(i*(this.duration||0));this._command("seek",o)}_onVolumeInput(t){}_onVolumeChange(t){const e=parseInt(t.target.value,10);this._command("volume_set",e)}_goToNowPlaying(){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"now-playing"},bubbles:!0,composed:!0}))}_toggleFavorite(t){t.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-toggle-favorite",{bubbles:!0,composed:!0}))}_onArtError(t){t.target.style.display="none";const e=document.createElement("div");e.className="art-placeholder",e.innerHTML='<ha-icon icon="mdi:music-note"></ha-icon>',t.target.parentNode.insertBefore(e,t.target)}_formatTime(t){if(!t||t<=0)return"0:00";const e=Math.floor(t);return`${Math.floor(e/60)}:${(e%60).toString().padStart(2,"0")}`}});customElements.define("volumio-now-playing",class extends rt{static get properties(){return{playerState:{type:String,attribute:"player-state"},title:{type:String},artist:{type:String},album:{type:String},albumArt:{type:String,attribute:"album-art"},quality:{type:Object},source:{type:String},isFavorite:{type:Boolean,attribute:"is-favorite"},_dominantColor:{type:String,state:!0},_showLightbox:{type:Boolean,state:!0}}}static get styles(){return a`
      :host {
        display: block;
        height: 100%;
        position: relative;
        overflow: hidden;
      }

      .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100%;
        padding: var(--volumio-space-xl, 32px);
        position: relative;
        z-index: 1;
      }

      /* ── UltraBlur background ──────────────────── */
      .ultra-blur {
        position: absolute;
        inset: 0;
        z-index: 0;
        pointer-events: none;
      }

      .ultra-blur-gradient {
        position: absolute;
        inset: 0;
        opacity: 0.5;
        filter: blur(120px);
        transition: background 1s ease;
      }

      .ultra-blur-overlay {
        position: absolute;
        inset: 0;
        background: radial-gradient(
          ellipse at center,
          transparent 30%,
          var(--primary-background-color, #121212) 100%
        );
      }

      /* ── Album art ─────────────────────────────── */
      .art-container {
        position: relative;
        margin-bottom: var(--volumio-space-lg, 24px);
        max-width: 400px;
        width: 50%;
        min-width: 200px;
        aspect-ratio: 1;
        cursor: pointer;
      }

      .art {
        width: 100%;
        height: 100%;
        border-radius: 6px;
        object-fit: cover;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5);
        transition: opacity 0.3s, box-shadow 4s ease;
      }

      .art.playing {
        animation: artPulse 4s ease-in-out infinite;
      }

      .art.paused {
        opacity: 0.85;
      }

      @keyframes artPulse {
        0%, 100% { box-shadow: 0 4px 24px rgba(0, 0, 0, 0.5); }
        50% { box-shadow: 0 6px 32px rgba(0, 0, 0, 0.6); }
      }

      .art-placeholder {
        width: 100%;
        height: 100%;
        border-radius: 6px;
        background: var(--card-background-color, #2a2a2a);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .art-placeholder ha-icon {
        --mdc-icon-size: 80px;
        color: var(--secondary-text-color);
        opacity: 0.3;
      }

      /* ── Track info ────────────────────────────── */
      .info {
        text-align: center;
        max-width: 500px;
        width: 100%;
      }

      .title-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--volumio-space-sm, 8px);
        margin-bottom: var(--volumio-space-sm, 8px);
      }

      .track-title {
        font-size: 24px;
        font-weight: 700;
        color: var(--primary-text-color);
        line-height: 1.3;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .fav-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: none;
        background: transparent;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        padding: 0;
        transition: transform 0.3s ease;
      }

      .fav-btn:hover {
        transform: scale(1.1);
      }

      .fav-btn ha-icon {
        --mdc-icon-size: 24px;
      }

      .fav-btn.active ha-icon {
        color: #e91e63;
      }

      .fav-btn:not(.active) ha-icon {
        color: var(--secondary-text-color);
      }

      .track-artist {
        font-size: 18px;
        font-weight: 500;
        color: var(--secondary-text-color);
        line-height: 1.3;
        margin-bottom: var(--volumio-space-xs, 4px);
        cursor: pointer;
      }

      .track-artist:hover {
        color: var(--primary-text-color);
        text-decoration: underline;
      }

      .track-album {
        font-size: 16px;
        color: var(--secondary-text-color);
        line-height: 1.3;
        margin-bottom: var(--volumio-space-md, 16px);
        cursor: pointer;
      }

      .track-album:hover {
        color: var(--primary-text-color);
        text-decoration: underline;
      }

      .quality-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--volumio-space-sm, 8px);
      }

      /* ── Empty / stopped state ─────────────────── */
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100%;
        padding: var(--volumio-space-xxl, 48px);
        text-align: center;
        gap: var(--volumio-space-md, 16px);
      }

      .empty-state ha-icon {
        --mdc-icon-size: 48px;
        color: var(--secondary-text-color);
        opacity: 0.4;
      }

      .empty-state .message {
        font-size: 16px;
        color: var(--secondary-text-color);
      }

      .browse-btn {
        padding: 10px 24px;
        border-radius: 20px;
        border: none;
        background: var(--primary-color, #03a9f4);
        color: #fff;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: opacity 0.2s;
      }

      .browse-btn:hover {
        opacity: 0.85;
      }

      /* ── Lightbox ──────────────────────────────── */
      .lightbox {
        position: fixed;
        inset: 0;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(0, 0, 0, 0.9);
        cursor: pointer;
      }

      .lightbox img {
        max-width: 90vw;
        max-height: 90vh;
        border-radius: 8px;
        box-shadow: 0 8px 48px rgba(0, 0, 0, 0.8);
      }

      @media (prefers-reduced-motion: reduce) {
        .art.playing {
          animation: none;
        }
      }

      /* ── Skeleton / loading state ──────────────── */
      @keyframes shimmer {
        0% { opacity: 0.3; }
        50% { opacity: 0.15; }
        100% { opacity: 0.3; }
      }

      .skeleton {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: var(--volumio-space-xxl, 48px);
        gap: var(--volumio-space-md, 16px);
      }

      .skeleton-art {
        width: 50%;
        max-width: 400px;
        min-width: 200px;
        aspect-ratio: 1;
        border-radius: 6px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-bar {
        height: 14px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-bar.title { width: 60%; height: 22px; }
      .skeleton-bar.artist { width: 40%; }
      .skeleton-bar.album { width: 30%; }
    `}constructor(){super(),this.playerState="idle",this.title="",this.artist="",this.album="",this.albumArt="",this.quality=null,this.source="",this.isFavorite=!1,this._dominantColor=null,this._showLightbox=!1,this._canvas=null}updated(t){t.has("albumArt")&&this.albumArt&&this._extractDominantColor(this.albumArt)}render(){if("unavailable"===this.playerState)return this._renderSkeleton();return"playing"===this.playerState||"paused"===this.playerState||this.title?O`
      <div class="ultra-blur">
        <div
          class="ultra-blur-gradient"
          style="background: ${this._dominantColor?`radial-gradient(ellipse at 50% 40%, ${this._dominantColor} 0%, transparent 85%)`:"transparent"}"
        ></div>
        <div class="ultra-blur-overlay"></div>
      </div>

      <div class="container">
        <div class="art-container" @click=${this._toggleLightbox}>
          ${this.albumArt?O`<img
                class="art ${this.playerState}"
                src="${this.albumArt}"
                alt="Album art for ${this.album||this.title}"
                @error=${this._onArtError}
              />`:O`<div class="art-placeholder">
                <ha-icon icon="mdi:music-note"></ha-icon>
              </div>`}
        </div>

        <div class="info">
          <div class="title-row">
            <span class="track-title">${this.title||"—"}</span>
            <button
              class="fav-btn ${this.isFavorite?"active":""}"
              @click=${this._toggleFavorite}
              aria-label="${this.isFavorite?"Remove from favorites":"Add to favorites"}"
            >
              <ha-icon icon="${this.isFavorite?"mdi:heart":"mdi:heart-outline"}"></ha-icon>
            </button>
          </div>

          ${this.artist?O`
            <div class="track-artist" @click=${this._goToArtist}>${this.artist}</div>
          `:""}

          ${this.album?O`
            <div class="track-album" @click=${this._goToAlbum}>${this.album}</div>
          `:""}

          <div class="quality-row">
            <volumio-quality-badge .quality=${this.quality} size="large"></volumio-quality-badge>
            <volumio-source-badge .source=${this.source}></volumio-source-badge>
          </div>
        </div>
      </div>

      ${this._showLightbox&&this.albumArt?O`
        <div class="lightbox" @click=${this._toggleLightbox} @keydown=${this._onLightboxKey}>
          <img src="${this.albumArt}" alt="Full size album art" />
        </div>
      `:""}
    `:this._renderEmpty()}_renderEmpty(){return O`
      <div class="empty-state">
        <ha-icon icon="mdi:music-note-off"></ha-icon>
        <div class="message">Nothing playing</div>
        <button class="browse-btn" @click=${this._goToBrowse}>Browse Music</button>
      </div>
    `}_renderSkeleton(){return O`
      <div class="skeleton" aria-busy="true" aria-label="Loading">
        <div class="skeleton-art"></div>
        <div class="skeleton-bar title"></div>
        <div class="skeleton-bar artist"></div>
        <div class="skeleton-bar album"></div>
      </div>
    `}async _extractDominantColor(t){if(t)try{const e=new Image;e.src=t,await new Promise((t,i)=>{e.onload=t,e.onerror=i}),this._canvas||(this._canvas=document.createElement("canvas"));const i=this._canvas,o=i.getContext("2d",{willReadFrequently:!0}),s=10;i.width=s,i.height=s,o.drawImage(e,0,0,s,s);const a=o.getImageData(0,0,s,s).data;let r=0,n=0,l=0;const c=s*s;for(let t=0;t<a.length;t+=4)r+=a[t],n+=a[t+1],l+=a[t+2];r=Math.round(r/c),n=Math.round(n/c),l=Math.round(l/c);const d=Math.max(r,n,l)/255,h=Math.min(r,n,l)/255;let u=0,p=0,v=(d+h)/2;if(d!==h){const t=d-h;p=v>.5?t/(2-d-h):t/(d+h);const e=r/255,i=n/255,o=l/255;u=e===d?((i-o)/t+(i<o?6:0))/6:i===d?((o-e)/t+2)/6:((e-i)/t+4)/6}v=Math.max(v,.4),p=Math.min(1.3*p,1);const m=(t,e,i)=>(i<0&&(i+=1),i>1&&(i-=1),i<1/6?t+6*(e-t)*i:i<.5?e:i<2/3?t+(e-t)*(2/3-i)*6:t),g=v<.5?v*(1+p):v+p-v*p,b=2*v-g;r=Math.round(255*m(b,g,u+1/3)),n=Math.round(255*m(b,g,u)),l=Math.round(255*m(b,g,u-1/3)),this._dominantColor=`rgb(${r}, ${n}, ${l})`,console.debug("[volumio-panel] UltraBlur color extracted:",this._dominantColor)}catch{this._dominantColor=null}else this._dominantColor=null}_toggleFavorite(){this.dispatchEvent(new CustomEvent("volumio-toggle-favorite",{bubbles:!0,composed:!0}))}_toggleLightbox(){this._showLightbox=!this._showLightbox}_onLightboxKey(t){"Escape"===t.key&&(this._showLightbox=!1)}_goToArtist(){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"artist-detail",artist:this.artist},bubbles:!0,composed:!0}))}_goToAlbum(){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"album-detail",album:this.album},bubbles:!0,composed:!0}))}_goToBrowse(){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"browse"},bubbles:!0,composed:!0}))}_onArtError(t){t.target.style.display="none"}});customElements.define("volumio-panel",class extends rt{static get properties(){return{hass:{type:Object},narrow:{type:Boolean},route:{type:Object},panel:{type:Object},_entityId:{type:String,state:!0},_configEntryId:{type:String,state:!0},_queue:{type:Array,state:!0},_queueUnsub:{state:!0},_activeView:{type:String,state:!0},_navMode:{type:String,state:!0},_showQueue:{type:Boolean,state:!0},_showNavFlyout:{type:Boolean,state:!0},_sensorBase:{type:String,state:!0},_isFavorite:{type:Boolean,state:!0}}}static get styles(){return[lt,a`
        :host {
          display: block;
          height: 100%;
          background: var(--primary-background-color, #121212);
          color: var(--primary-text-color, #e0e0e0);
          font-family: var(--ha-font-family, Roboto, sans-serif);
          box-sizing: border-box;
          overflow: hidden;
        }

        *,
        *::before,
        *::after {
          box-sizing: border-box;
        }

        .shell {
          display: grid;
          grid-template-rows: auto 1fr auto;
          height: 100%;
        }

        /* ── Three-zone content area ─────────────── */
        .content-area {
          display: grid;
          grid-template-columns: auto 1fr auto;
          overflow: hidden;
          position: relative;
        }

        .left-zone {
          overflow: hidden;
          transition: width 0.2s ease;
        }

        .left-zone.pinned {
          width: var(--volumio-nav-width-pinned, 240px);
        }

        .left-zone.collapsed {
          width: var(--volumio-nav-width-collapsed, 56px);
        }

        .left-zone.hidden {
          width: 0;
        }

        .center-zone {
          overflow-y: auto;
          overflow-x: hidden;
          min-width: 0;
        }

        .right-zone {
          overflow: hidden;
          transition: width 0.2s ease;
        }

        .right-zone.pinned {
          width: var(--volumio-queue-width, 320px);
          border-left: 1px solid var(--divider-color, rgba(255,255,255,0.08));
        }

        .right-zone.hidden {
          width: 0;
        }

        /* ── Flyout overlay ──────────────────────── */
        .flyout-scrim {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 190;
        }

        .flyout-panel {
          position: fixed;
          top: 0;
          bottom: 0;
          z-index: 200;
          transition: transform 0.2s ease-out;
        }

        .flyout-panel.left {
          left: 0;
          width: var(--volumio-nav-width-pinned, 240px);
        }

        .flyout-panel.right {
          right: 0;
          width: var(--volumio-queue-width, 320px);
        }

        /* ── Queue placeholder ───────────────────── */
        .queue-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: var(--volumio-space-lg, 24px);
          color: var(--secondary-text-color);
          text-align: center;
          gap: var(--volumio-space-sm, 8px);
        }

        .queue-placeholder ha-icon {
          --mdc-icon-size: 32px;
          opacity: 0.4;
        }

        .queue-placeholder .count {
          font-size: 13px;
        }

        /* ── Placeholder views ───────────────────── */
        .placeholder-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: var(--volumio-space-xxl, 48px);
          text-align: center;
          gap: var(--volumio-space-md, 16px);
        }

        .placeholder-view ha-icon {
          --mdc-icon-size: 48px;
          color: var(--secondary-text-color);
          opacity: 0.3;
        }

        .placeholder-view .view-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--primary-text-color);
        }

        .placeholder-view .view-desc {
          font-size: 14px;
          color: var(--secondary-text-color);
        }
      `]}constructor(){super(),this._entityId=null,this._configEntryId=null,this._queue=[],this._queueUnsub=null,this._activeView="now-playing",this._navMode="collapsed",this._showQueue=!1,this._showNavFlyout=!1,this._sensorBase=null,this._isFavorite=!1,this._favoritesCache=[],this._lastUri=null,this._keyHandler=this._onKeyDown.bind(this)}connectedCallback(){super.connectedCallback(),this._applyBreakpoint(),window.addEventListener("resize",this._onResize),window.addEventListener("keydown",this._keyHandler)}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeQueue(),window.removeEventListener("resize",this._onResize),window.removeEventListener("keydown",this._keyHandler)}_onResize=()=>{this._applyBreakpoint()};_applyBreakpoint(){const t=window.innerWidth;t>=1400?(this._navMode="pinned",this._showQueue=!0):t>=1024?this._navMode="collapsed":(this._navMode="hidden",this._showQueue=!1)}updated(t){if(t.has("hass")&&this.hass){this._resolveIds(),this._queueUnsub||this._subscribeQueue();const t=this._getEntity(),e=t?.attributes?.uri??null;e!==this._lastUri&&(this._lastUri=e,e&&this._configEntryId?this._checkFavorite():this._isFavorite=!1)}}_resolveIds(){if(!this._entityId||!this._configEntryId){if(!this._entityId){let t=Object.keys(this.hass.states).find(t=>t.startsWith("media_player.")&&!0===this.hass.states[t].attributes?.volumio_ws);t||(t=Object.keys(this.hass.states).find(t=>t.startsWith("media_player.")&&t.includes("volumio"))),t&&(this._entityId=t,this._sensorBase=t.replace("media_player.",""))}!this._configEntryId&&this.panel?.config?.config_entry_id&&(this._configEntryId=this.panel.config.config_entry_id)}}async _subscribeQueue(){if(!this._queueUnsub&&this.hass){try{this._queueUnsub=await this.hass.connection.subscribeMessage(t=>{t.queue&&(console.debug("[volumio-panel] Queue push received:",t.queue.length,"items"),this._queue=t.queue)},{type:"volumio_ws/subscribe_queue"}),console.debug("[volumio-panel] Queue subscription active")}catch(t){console.warn("[volumio-panel] Queue subscription failed:",t)}if(this._configEntryId)try{const t=await this.hass.connection.sendMessagePromise({type:"call_service",domain:"volumio_ws",service:"queue_get",service_data:{config_entry_id:this._configEntryId},return_response:!0});t?.response?.queue&&(console.debug("[volumio-panel] Queue fetched via service:",t.response.queue.length,"items"),this._queue=t.response.queue)}catch(t){console.debug("[volumio-panel] queue_get fallback failed (non-fatal):",t.message)}}}_unsubscribeQueue(){this._queueUnsub&&("function"==typeof this._queueUnsub&&this._queueUnsub(),this._queueUnsub=null)}async _callService(t,e={}){return await this.hass.connection.sendMessagePromise({type:"call_service",domain:"volumio_ws",service:t,service_data:{config_entry_id:this._configEntryId,...e},return_response:!0})}async _callMediaPlayerService(t,e={}){return await this.hass.callService("media_player",t,{entity_id:this._entityId,...e})}_getEntity(){return this._entityId?this.hass?.states[this._entityId]:null}_getSensorValue(t){const e={trackType:"track_type",samplerate:"sample_rate",bitdepth:"bit_depth",channels:"channels"}[t];if(!e||!this._sensorBase)return null;const i=`sensor.${this._sensorBase}_${e}`,o=this.hass?.states[i];return"unknown"!==o?.state&&"unavailable"!==o?.state?o?.state:null}_getQualityInfo(){const t=this._getEntity();if(!t)return null;const e=t.attributes||{},i={trackType:this._getSensorValue("trackType"),samplerate:this._getSensorValue("samplerate"),bitdepth:this._getSensorValue("bitdepth"),bitrate:e.bitrate||null,isStream:"channel"===e.media_content_type},o=JSON.stringify(i);return this._lastQualityInputKey!==o&&(console.debug("[volumio-panel] Quality inputs:",i),this._lastQualityInputKey=o),ut(i)}_isVolumeEnabled(){const t=this._getEntity();if(!t)return!1;const e=t.attributes?.supported_features||0,i=!!(4&e);return this._lastVolumeEnabled!==i&&(console.debug("[volumio-panel] Volume enabled:",i,"supported_features:",e,"& 4 =",4&e),this._lastVolumeEnabled=i),i}render(){const t=this._getEntity(),e=t?.attributes||{},i=t?.state||"unavailable",o=this._getQualityInfo(),s=(a=e.entity_picture)?(a.startsWith("http"),a):"";var a;const r=e.source_list||[];this.panel;const n=r.map(t=>({name:t,plugin_name:t.toLowerCase().replace(/\s+/g,""),plugin_type:"music_service"}));return O`
      <div class="shell">
        <volumio-top-bar
          active-view="${this._activeView}"
          .breadcrumb=${[]}
          ?narrow=${this.narrow}
          @volumio-navigate=${this._onNavigate}
          @volumio-toggle-nav=${this._onToggleNav}
          @volumio-toggle-queue=${this._onToggleQueue}
          @volumio-back=${this._onBack}
        ></volumio-top-bar>

        <div class="content-area">
          ${this._renderLeftZone(n)}

          <div class="center-zone">
            ${this._renderCenterContent(t,e,i,o,s)}
          </div>

          ${this._renderRightZone()}
        </div>

        <volumio-player-bar
          player-state="${i}"
          title="${e.media_title||""}"
          artist="${e.media_artist||""}"
          album-art="${s}"
          .duration=${e.media_duration||0}
          .position=${e.media_position||0}
          position-updated-at="${e.media_position_updated_at||""}"
          .volume=${null!=e.volume_level?Math.round(100*e.volume_level):0}
          ?muted=${e.is_volume_muted||!1}
          ?shuffle=${e.shuffle||!1}
          repeat="${e.repeat||"off"}"
          .quality=${o}
          source="${e.source||""}"
          .volumeEnabled=${this._isVolumeEnabled()}
          .isFavorite=${this._isFavorite}
          @volumio-command=${this._onCommand}
          @volumio-navigate=${this._onNavigate}
          @volumio-toggle-favorite=${this._onToggleFavorite}
        ></volumio-player-bar>
      </div>

      ${this._showNavFlyout?O`
        <div class="flyout-scrim" @click=${()=>this._showNavFlyout=!1}></div>
        <div class="flyout-panel left">
          <volumio-left-nav
            .sources=${n}
            mode="flyout"
            active-view="${this._activeView}"
            @volumio-navigate=${this._onNavigate}
            @volumio-nav-pin=${this._onNavPin}
          ></volumio-left-nav>
        </div>
      `:""}
    `}_renderLeftZone(t){return"hidden"===this._navMode?O``:O`
      <div class="left-zone ${this._navMode}">
        <volumio-left-nav
          .sources=${t}
          mode="${this._navMode}"
          active-view="${this._activeView}"
          @volumio-navigate=${this._onNavigate}
          @volumio-nav-pin=${this._onNavPin}
        ></volumio-left-nav>
      </div>
    `}_renderRightZone(){return this._showQueue?O`
      <div class="right-zone pinned">
        <div class="queue-placeholder">
          <ha-icon icon="mdi:playlist-music"></ha-icon>
          <span>Queue</span>
          <span class="count">${this._queue.length} tracks</span>
        </div>
      </div>
    `:O``}_renderCenterContent(t,e,i,o,s){switch(this._activeView){case"now-playing":return O`
          <volumio-now-playing
            player-state="${i}"
            title="${e.media_title||""}"
            artist="${e.media_artist||""}"
            album="${e.media_album_name||""}"
            album-art="${s}"
            .quality=${o}
            source="${e.source||""}"
            .isFavorite=${this._isFavorite}
            @volumio-command=${this._onCommand}
            @volumio-navigate=${this._onNavigate}
            @volumio-toggle-favorite=${this._onToggleFavorite}
          ></volumio-now-playing>
        `;case"browse":return this._renderPlaceholder("Browse","mdi:folder-music","Browse your music sources — coming in T18");case"playlists":return this._renderPlaceholder("Playlists","mdi:playlist-music-outline","Your playlists — coming in T20");case"favorites":return this._renderPlaceholder("Favorites","mdi:heart","Your favorites — coming in T20");case"history":return this._renderPlaceholder("History","mdi:history","Recently played — coming in T20");case"settings":return this._renderPlaceholder("Settings","mdi:cog","Panel settings — coming in T20");default:return this._renderPlaceholder("","mdi:help-circle",`Unknown view: ${this._activeView}`)}}_renderPlaceholder(t,e,i){return O`
      <div class="placeholder-view">
        <ha-icon icon="${e}"></ha-icon>
        <div class="view-title">${t}</div>
        <div class="view-desc">${i}</div>
      </div>
    `}_onNavigate(t){const{view:e}=t.detail;e&&(this._activeView=e,this._showNavFlyout=!1)}_onToggleNav(){"hidden"===this._navMode?this._showNavFlyout=!this._showNavFlyout:"collapsed"===this._navMode?this._navMode="pinned":this._navMode="collapsed"}_onNavPin(t){this._navMode=t.detail.pinned?"pinned":"collapsed",this._showNavFlyout=!1}_onToggleQueue(){this._showQueue=!this._showQueue}_onBack(){"now-playing"!==this._activeView&&(this._activeView="now-playing")}async _onCommand(t){const{command:e,value:i}=t.detail,o=this._getEntity();if(o&&this._entityId)try{switch(e){case"play_pause":"playing"===o.state?await this._callMediaPlayerService("media_pause"):await this._callMediaPlayerService("media_play");break;case"next":await this._callMediaPlayerService("media_next_track");break;case"prev":await this._callMediaPlayerService("media_previous_track");break;case"seek":await this._callMediaPlayerService("media_seek",{seek_position:i});break;case"volume_set":this._isVolumeEnabled()?await this._callMediaPlayerService("set_volume_level",{volume_level:i/100}):console.debug("[volumio-panel] Volume set ignored — volume control disabled");break;case"mute_toggle":this._isVolumeEnabled()?await this._callMediaPlayerService("volume_mute",{is_volume_muted:!o.attributes?.is_volume_muted}):console.debug("[volumio-panel] Mute ignored — volume control disabled");break;case"shuffle_set":await this._callMediaPlayerService("shuffle_set",{shuffle:i});break;case"repeat_set":await this._callMediaPlayerService("repeat_set",{repeat:i});break;default:console.warn("[volumio-panel] Unknown command:",e)}}catch(t){console.error("[volumio-panel] Command failed:",e,t)}}async _checkFavorite(){if(this.hass&&this._configEntryId)try{const t=await this.hass.connection.sendMessagePromise({type:"call_service",domain:"volumio_ws",service:"favorites_list",service_data:{config_entry_id:this._configEntryId},return_response:!0}),e=t?.response?.items||[];this._favoritesCache=e;const i=this._getEntity(),o=i?.attributes?.uri;this._isFavorite=!(!o||!e.some(t=>t?.uri===o))}catch(t){console.error("[volumio-panel] favorites_list failed:",t)}}async _onToggleFavorite(){const t=this._getEntity();if(!t||!this._configEntryId)return;const e=t.attributes||{},i=e.uri;if(!i)return;const o=this._isFavorite;this._isFavorite=!o,console.debug("[volumio-panel] Toggle favorite:",{wasFavorite:o,uri:i,title:e.media_title,service:e.source,configEntryId:this._configEntryId});try{o?await this._callService("favorites_remove",{uri:i,service:e.source||""}):await this._callService("favorites_add",{uri:i,title:e.media_title||"",service:e.source||""}),console.debug("[volumio-panel] Favorite service call completed"),setTimeout(()=>this._checkFavorite(),500)}catch(t){console.error("[volumio-panel] Favorite toggle failed:",t),this._isFavorite=o}}_onKeyDown(t){if("INPUT"===t.target.tagName||"TEXTAREA"===t.target.tagName)return;if(!this.isConnected)return;const e=this._getEntity();if(e)switch(t.key){case" ":t.preventDefault(),this._onCommand({detail:{command:"play_pause"}});break;case"ArrowRight":if(t.shiftKey)t.preventDefault(),this._onCommand({detail:{command:"next"}});else{t.preventDefault();const i=(e.attributes?.media_position||0)+10;this._onCommand({detail:{command:"seek",value:i}})}break;case"ArrowLeft":if(t.shiftKey)t.preventDefault(),this._onCommand({detail:{command:"prev"}});else{t.preventDefault();const i=Math.max(0,(e.attributes?.media_position||0)-10);this._onCommand({detail:{command:"seek",value:i}})}break;case"ArrowUp":t.preventDefault();{const t=Math.min(100,Math.round(100*(e.attributes?.volume_level||0))+2);this._onCommand({detail:{command:"volume_set",value:t}})}break;case"ArrowDown":t.preventDefault();{const t=Math.max(0,Math.round(100*(e.attributes?.volume_level||0))-2);this._onCommand({detail:{command:"volume_set",value:t}})}break;case"m":case"M":this._onCommand({detail:{command:"mute_toggle"}});break;case"s":case"S":this._onCommand({detail:{command:"shuffle_set",value:!e.attributes?.shuffle}});break;case"r":case"R":{const t=e.attributes?.repeat||"off",i="off"===t?"all":"all"===t?"one":"off";this._onCommand({detail:{command:"repeat_set",value:i}})}break;case"/":t.preventDefault(),this.shadowRoot?.querySelector("volumio-top-bar")?.shadowRoot?.querySelector(".search-field input")?.focus();break;case"Escape":this._showNavFlyout=!1}}});
