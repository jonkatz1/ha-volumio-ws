const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let a=class{constructor(e,t,o){if(this._$cssResult$=!0,o!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const i=this.t;if(t&&void 0===e){const t=void 0!==i&&1===i.length;t&&(e=o.get(i)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&o.set(i,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const o=1===e.length?e[0]:t.reduce((t,i,o)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[o+1],e[0]);return new a(o,e,i)},s=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new a("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:n,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:u,getPrototypeOf:h}=Object,p=globalThis,m=p.trustedTypes,v=m?m.emptyScript:"",b=p.reactiveElementPolyfillSupport,g=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?v:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},x=(e,t)=>!n(e,t),_={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let f=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=_){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(e,i,t);void 0!==o&&l(this.prototype,e,o)}}static getPropertyDescriptor(e,t,i){const{get:o,set:a}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:o,set(t){const r=o?.call(this);a?.call(this,t),this.requestUpdate(e,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??_}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const e=h(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const e=this.properties,t=[...d(e),...u(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(s(e))}else void 0!==e&&t.push(s(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,o)=>{if(t)i.adoptedStyleSheets=o.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of o){const o=document.createElement("style"),a=e.litNonce;void 0!==a&&o.setAttribute("nonce",a),o.textContent=t.cssText,i.appendChild(o)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),o=this.constructor._$Eu(e,i);if(void 0!==o&&!0===i.reflect){const a=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(t,i.type);this._$Em=e,null==a?this.removeAttribute(o):this.setAttribute(o,a),this._$Em=null}}_$AK(e,t){const i=this.constructor,o=i._$Eh.get(e);if(void 0!==o&&this._$Em!==o){const e=i.getPropertyOptions(o),a="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=o;const r=a.fromAttribute(t,e.type);this[o]=r??this._$Ej?.get(o)??r,this._$Em=null}}requestUpdate(e,t,i,o=!1,a){if(void 0!==e){const r=this.constructor;if(!1===o&&(a=this[e]),i??=r.getPropertyOptions(e),!((i.hasChanged??x)(a,t)||i.useDefault&&i.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:o,wrapped:a},r){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,r??t??this[e]),!0!==a||void 0!==r)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===o&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,o=this[t];!0!==e||this._$AL.has(t)||void 0===o||this.C(t,void 0,i,o)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[g("elementProperties")]=new Map,f[g("finalized")]=new Map,b?.({ReactiveElement:f}),(p.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,$=e=>e,k=w.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,A="$lit$",E=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+E,q=`<${C}>`,T=document,z=()=>T.createComment(""),P=e=>null===e||"object"!=typeof e&&"function"!=typeof e,I=Array.isArray,U="[ \t\n\f\r]",M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,B=/-->/g,N=/>/g,L=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),V=/'/g,R=/"/g,Q=/^(?:script|style|textarea|title)$/i,F=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),j=Symbol.for("lit-noChange"),O=Symbol.for("lit-nothing"),D=new WeakMap,H=T.createTreeWalker(T,129);function W(e,t){if(!I(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const G=(e,t)=>{const i=e.length-1,o=[];let a,r=2===t?"<svg>":3===t?"<math>":"",s=M;for(let t=0;t<i;t++){const i=e[t];let n,l,c=-1,d=0;for(;d<i.length&&(s.lastIndex=d,l=s.exec(i),null!==l);)d=s.lastIndex,s===M?"!--"===l[1]?s=B:void 0!==l[1]?s=N:void 0!==l[2]?(Q.test(l[2])&&(a=RegExp("</"+l[2],"g")),s=L):void 0!==l[3]&&(s=L):s===L?">"===l[0]?(s=a??M,c=-1):void 0===l[1]?c=-2:(c=s.lastIndex-l[2].length,n=l[1],s=void 0===l[3]?L:'"'===l[3]?R:V):s===R||s===V?s=L:s===B||s===N?s=M:(s=L,a=void 0);const u=s===L&&e[t+1].startsWith("/>")?" ":"";r+=s===M?i+q:c>=0?(o.push(n),i.slice(0,c)+A+i.slice(c)+E+u):i+E+(-2===c?t:u)}return[W(e,r+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),o]};class K{constructor({strings:e,_$litType$:t},i){let o;this.parts=[];let a=0,r=0;const s=e.length-1,n=this.parts,[l,c]=G(e,t);if(this.el=K.createElement(l,i),H.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(o=H.nextNode())&&n.length<s;){if(1===o.nodeType){if(o.hasAttributes())for(const e of o.getAttributeNames())if(e.endsWith(A)){const t=c[r++],i=o.getAttribute(e).split(E),s=/([.?@])?(.*)/.exec(t);n.push({type:1,index:a,name:s[2],strings:i,ctor:"."===s[1]?ee:"?"===s[1]?te:"@"===s[1]?ie:X}),o.removeAttribute(e)}else e.startsWith(E)&&(n.push({type:6,index:a}),o.removeAttribute(e));if(Q.test(o.tagName)){const e=o.textContent.split(E),t=e.length-1;if(t>0){o.textContent=k?k.emptyScript:"";for(let i=0;i<t;i++)o.append(e[i],z()),H.nextNode(),n.push({type:2,index:++a});o.append(e[t],z())}}}else if(8===o.nodeType)if(o.data===C)n.push({type:2,index:a});else{let e=-1;for(;-1!==(e=o.data.indexOf(E,e+1));)n.push({type:7,index:a}),e+=E.length-1}a++}}static createElement(e,t){const i=T.createElement("template");return i.innerHTML=e,i}}function Y(e,t,i=e,o){if(t===j)return t;let a=void 0!==o?i._$Co?.[o]:i._$Cl;const r=P(t)?void 0:t._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),void 0===r?a=void 0:(a=new r(e),a._$AT(e,i,o)),void 0!==o?(i._$Co??=[])[o]=a:i._$Cl=a),void 0!==a&&(t=Y(e,a._$AS(e,t.values),a,o)),t}class Z{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,o=(e?.creationScope??T).importNode(t,!0);H.currentNode=o;let a=H.nextNode(),r=0,s=0,n=i[0];for(;void 0!==n;){if(r===n.index){let t;2===n.type?t=new J(a,a.nextSibling,this,e):1===n.type?t=new n.ctor(a,n.name,n.strings,this,e):6===n.type&&(t=new oe(a,this,e)),this._$AV.push(t),n=i[++s]}r!==n?.index&&(a=H.nextNode(),r++)}return H.currentNode=T,o}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class J{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,o){this.type=2,this._$AH=O,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Y(this,e,t),P(e)?e===O||null==e||""===e?(this._$AH!==O&&this._$AR(),this._$AH=O):e!==this._$AH&&e!==j&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>I(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==O&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,o="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=K.createElement(W(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(t);else{const e=new Z(o,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=D.get(e.strings);return void 0===t&&D.set(e.strings,t=new K(e)),t}k(e){I(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,o=0;for(const a of e)o===t.length?t.push(i=new J(this.O(z()),this.O(z()),this,this.options)):i=t[o],i._$AI(a),o++;o<t.length&&(this._$AR(i&&i._$AB.nextSibling,o),t.length=o)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=$(e).nextSibling;$(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class X{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,o,a){this.type=1,this._$AH=O,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=a,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=O}_$AI(e,t=this,i,o){const a=this.strings;let r=!1;if(void 0===a)e=Y(this,e,t,0),r=!P(e)||e!==this._$AH&&e!==j,r&&(this._$AH=e);else{const o=e;let s,n;for(e=a[0],s=0;s<a.length-1;s++)n=Y(this,o[i+s],t,s),n===j&&(n=this._$AH[s]),r||=!P(n)||n!==this._$AH[s],n===O?e=O:e!==O&&(e+=(n??"")+a[s+1]),this._$AH[s]=n}r&&!o&&this.j(e)}j(e){e===O?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ee extends X{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===O?void 0:e}}class te extends X{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==O)}}class ie extends X{constructor(e,t,i,o,a){super(e,t,i,o,a),this.type=5}_$AI(e,t=this){if((e=Y(this,e,t,0)??O)===j)return;const i=this._$AH,o=e===O&&i!==O||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,a=e!==O&&(i===O||o);o&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class oe{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Y(this,e)}}const ae=w.litHtmlPolyfillSupport;ae?.(K,J),(w.litHtmlVersions??=[]).push("3.3.2");const re=globalThis;class se extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const o=i?.renderBefore??t;let a=o._$litPart$;if(void 0===a){const e=i?.renderBefore??null;o._$litPart$=a=new J(t.insertBefore(z(),e),e,void 0,i??{})}return a._$AI(e),a})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return j}}se._$litElement$=!0,se.finalized=!0,re.litElementHydrateSupport?.({LitElement:se});const ne=re.litElementPolyfillSupport;ne?.({LitElement:se}),(re.litElementVersions??=[]).push("4.2.2");const le=r`
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
`,ce=new Set(["flac","alac","wav","aiff","ape","wv","wavpack","dsf","dff","dsd"]),de=new Set(["mp3","ogg","aac","opus","vorbis","wma","m4a"]),ue=new Set(["qobuz","tidal","spotify","spop","pandora","youtube","youtube2","webradio","mpd","upnp","airplay","snapcast","bluetooth"]);function he({trackType:e,samplerate:t,bitdepth:i,bitrate:o,isStream:a}){const r=(s=e)?String(s).trim().toLowerCase().replace(/\s+/g,""):"";var s;const n=function(e){if(null==e)return null;if("number"==typeof e)return e;const t=String(e).trim().toLowerCase().match(/([\d.]+)/);if(!t)return null;const i=parseFloat(t[1]);return i>1e3?i/1e3:i}(t),l=function(e){if(null==e)return null;if("number"==typeof e)return e;const t=String(e).trim().match(/(\d+)/);return t?parseInt(t[1],10):null}(i),c=function(e){if(null==e)return null;if("number"==typeof e)return e;const t=String(e).trim().match(/([\d.]+)/);return t?parseFloat(t[1]):null}(o),d=ue.has(r)?"":r,u=ce.has(d),h=de.has(d);if(a){return pe("stream",d?`${d.toUpperCase()}${c?` ${Math.round(c)}`:""}`:"STREAM","STREAM","var(--volumio-quality-stream)","var(--volumio-quality-stream-bg, rgba(66, 165, 245, 0.12))")}if(u&&(null!=l&&l>16||null!=n&&n>44.1))return pe("hires",me(d,l,n),"HI-RES","var(--volumio-quality-hires)","var(--volumio-quality-hires-bg, rgba(212, 160, 23, 0.12))");if(u)return pe("lossless",me(d,l,n),"LOSSLESS","var(--volumio-quality-lossless)","var(--volumio-quality-lossless-bg, rgba(0, 172, 193, 0.12))");if(!h&&(null!=l||null!=n)){if(null!=l&&l>16||null!=n&&n>44.1){return pe("hires",me(d||"HI-RES",l,n),"HI-RES","var(--volumio-quality-hires)","var(--volumio-quality-hires-bg, rgba(212, 160, 23, 0.12))")}return pe("lossless",me(d||"LOSSLESS",l,n),"LOSSLESS","var(--volumio-quality-lossless)","var(--volumio-quality-lossless-bg, rgba(0, 172, 193, 0.12))")}if(h){if(null!=c&&c<256)return pe("basic",`${d.toUpperCase()} ${Math.round(c)}`,"BASIC","var(--volumio-quality-basic, #616161)","rgba(97, 97, 97, 0.08)");return pe("high",d?`${d.toUpperCase()}${c?` ${Math.round(c)}`:""}`:"HIGH","HIGH","var(--volumio-quality-lossy)","var(--volumio-quality-lossy-bg, rgba(158, 158, 158, 0.08))")}return d&&null!=c?c<256?pe("basic",`${Math.round(c)} kbps`,"BASIC","var(--volumio-quality-basic, #616161)","rgba(97, 97, 97, 0.08)"):pe("high",`${Math.round(c)} kbps`,"HIGH","var(--volumio-quality-lossy)","var(--volumio-quality-lossy-bg, rgba(158, 158, 158, 0.08))"):pe("unknown","","","var(--secondary-text-color)","transparent")}function pe(e,t,i,o,a){return{tier:e,label:t,tierLabel:i,color:o,colorBg:a}}function me(e,t,i){const o=e.toUpperCase();return t&&i?`${o} ${t}/${i}`:t?`${o} ${t}-bit`:i?`${o} ${i}kHz`:o}function ve(e){if(!e||e<=0)return"0:00";const t=Math.floor(e),i=Math.floor(t/3600),o=Math.floor(t%3600/60),a=t%60;return i>0?`${i}:${o.toString().padStart(2,"0")}:${a.toString().padStart(2,"0")}`:`${o}:${a.toString().padStart(2,"0")}`}function be(e,t){return e?e.startsWith("http")?e:t?`${t}${e}`:e:""}const ge=[{key:"now-playing",label:"Now Playing"},{key:"browse",label:"Browse"},{key:"playlists",label:"Playlists"},{key:"favorites",label:"Favorites"}];customElements.define("volumio-top-bar",class extends se{static get properties(){return{activeView:{type:String,attribute:"active-view"},breadcrumb:{type:Array},showBackButton:{type:Boolean,attribute:"show-back-button"},narrow:{type:Boolean},searchQuery:{type:String,attribute:"search-query"},_searchValue:{type:String,state:!0},_searchFocused:{type:Boolean,state:!0}}}static get styles(){return r`
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

      .search-clear {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: none;
        background: var(--secondary-text-color, #888);
        color: var(--primary-background-color, #121212);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        flex-shrink: 0;
        font-size: 12px;
        font-weight: 700;
        line-height: 1;
      }

      .search-clear:hover {
        background: var(--primary-text-color);
      }

      .recent-searches {
        position: absolute;
        top: 100%;
        right: 0;
        left: 0;
        margin: 0 var(--volumio-space-sm, 8px);
        background: var(--card-background-color, #1e1e1e);
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        padding: var(--volumio-space-sm, 8px);
        z-index: 110;
        max-width: 320px;
        margin-left: auto;
      }

      .recent-label {
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
        padding: 4px 8px;
      }

      .recent-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        padding: 4px;
      }

      .recent-chip {
        padding: 4px 12px;
        border-radius: 14px;
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
        background: transparent;
        color: var(--primary-text-color);
        font-size: 13px;
        cursor: pointer;
        transition: background 0.15s;
      }

      .recent-chip:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
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
    `}constructor(){super(),this.activeView="now-playing",this.breadcrumb=[],this.showBackButton=!1,this.narrow=!1,this.searchQuery="",this._searchValue="",this._searchFocused=!1,this._debounceTimer=null,this._recentSearches=JSON.parse(localStorage.getItem("volumio-recent-searches")||"[]")}render(){return F`
      <div class="topbar">
        <button
          class="icon-btn"
          @click=${this._toggleNav}
          title="Toggle navigation"
          aria-label="Toggle navigation sidebar"
        >
          <ha-icon icon="mdi:menu"></ha-icon>
        </button>

        ${this.showBackButton?F`
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
          ${ge.map(e=>F`
            <button
              class="tab ${this.activeView===e.key?"active":""}"
              @click=${()=>this._navigate(e.key)}
            >
              ${e.label}
            </button>
          `)}
        </div>

        <div class="spacer"></div>

        <div class="search-field" @click=${this._focusSearch} title="Search music">
          <ha-icon icon="mdi:magnify"></ha-icon>
          <input
            type="text"
            placeholder="Search..."
            aria-label="Search music"
            .value=${this._searchValue}
            @input=${this._onSearchInput}
            @focus=${this._onSearchFieldFocus}
            @blur=${this._onSearchFieldBlur}
            @keydown=${this._onSearchKeydown}
          />
          ${this._searchValue?F`
            <button class="search-clear" @click=${this._clearSearch} title="Clear search" aria-label="Clear search">✕</button>
          `:""}
        </div>

        ${this._searchFocused&&!this._searchValue&&this._recentSearches.length>0?F`
          <div class="recent-searches">
            <div class="recent-label">Recent</div>
            <div class="recent-chips">
              ${this._recentSearches.slice(0,10).map(e=>F`
                <button class="recent-chip" @mousedown=${t=>{t.preventDefault(),this._useRecentSearch(e)}}>${e}</button>
              `)}
            </div>
          </div>
        `:""}

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
    `}_renderBreadcrumb(){const e=this.breadcrumb,t=e.length>5?[e[0],{label:"...",path:null},...e.slice(-3)]:e;return F`
      <div class="breadcrumb-row">
        ${t.map((e,i)=>{const o=i===t.length-1;return F`
            ${i>0?F`<span class="breadcrumb-sep"><ha-icon icon="mdi:chevron-right" style="--mdc-icon-size:14px"></ha-icon></span>`:""}
            <span
              class="breadcrumb-segment ${o?"current":""}"
              @click=${()=>!o&&null!=e.path&&this._navigate(e.path)}
            >${e.label}</span>
          `})}
      </div>
    `}_navigate(e){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:e},bubbles:!0,composed:!0}))}_toggleNav(){this.dispatchEvent(new CustomEvent("volumio-toggle-nav",{bubbles:!0,composed:!0}))}_toggleQueue(){this.dispatchEvent(new CustomEvent("volumio-toggle-queue",{bubbles:!0,composed:!0}))}_goBack(){this.dispatchEvent(new CustomEvent("volumio-back",{bubbles:!0,composed:!0}))}_focusSearch(){const e=this.shadowRoot.querySelector(".search-field input");e&&e.focus()}_onSearchFieldFocus(){this._searchFocused=!0}_onSearchFieldBlur(){setTimeout(()=>{this._searchFocused=!1},200)}_onSearchInput(e){this._searchValue=e.target.value,clearTimeout(this._debounceTimer),this._searchValue.trim().length<2?0===this._searchValue.trim().length&&this.dispatchEvent(new CustomEvent("volumio-search-clear",{bubbles:!0,composed:!0})):this._debounceTimer=setTimeout(()=>{this._executeSearch(this._searchValue.trim())},300)}_onSearchKeydown(e){"Escape"===e.key?(this._clearSearch(),e.target.blur()):"Enter"===e.key&&(clearTimeout(this._debounceTimer),this._searchValue.trim().length>=2&&this._executeSearch(this._searchValue.trim()))}_executeSearch(e){this._recentSearches=[e,...this._recentSearches.filter(t=>t!==e)].slice(0,10),localStorage.setItem("volumio-recent-searches",JSON.stringify(this._recentSearches)),this.dispatchEvent(new CustomEvent("volumio-search",{detail:{query:e},bubbles:!0,composed:!0}))}_clearSearch(){this._searchValue="",clearTimeout(this._debounceTimer),this.dispatchEvent(new CustomEvent("volumio-search-clear",{bubbles:!0,composed:!0}))}_useRecentSearch(e){this._searchValue=e,this._searchFocused=!1,this._executeSearch(e)}_onSearchFocus(){this.dispatchEvent(new CustomEvent("volumio-search-focus",{bubbles:!0,composed:!0}))}});const ye=[{key:"favorites",label:"Favorites",icon:"mdi:heart"},{key:"playlists",label:"Playlists",icon:"mdi:playlist-music-outline"},{key:"history",label:"History",icon:"mdi:history"}],xe={music_service:"mdi:music-box",mpd:"mdi:folder-music",webradio:"mdi:radio",podcast:"mdi:podcast"};customElements.define("volumio-left-nav",class extends se{static get properties(){return{sources:{type:Array},activeSource:{type:String,attribute:"active-source"},mode:{type:String},activeView:{type:String,attribute:"active-view"}}}static get styles(){return r`
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
    `}constructor(){super(),this.sources=[],this.activeSource="",this.mode="pinned",this.activeView=""}render(){const e="collapsed"===this.mode;return F`
      <nav class="nav ${this.mode}" aria-label="Music sources">
        <div class="nav-scroll">
          <div class="nav-section-label ${e?"collapsed":""}">Sources</div>
          ${this.sources.map(e=>{const t=xe[e.plugin_name]||xe[e.plugin_type]||"mdi:music-box",i=this.activeSource===e.uri;return F`
              <button
                class="nav-item ${i?"active":""}"
                @click=${()=>this._selectSource(e)}
                title="${e.name}"
                aria-label="${e.name}"
              >
                <ha-icon icon="${t}"></ha-icon>
                <span class="nav-item-label">${e.name}</span>
              </button>
            `})}

          <div class="nav-divider"></div>
          <div class="nav-section-label ${e?"collapsed":""}">Shortcuts</div>

          ${ye.map(e=>F`
            <button
              class="nav-item ${this.activeView===e.key?"active":""}"
              @click=${()=>this._navigate(e.key)}
              title="${e.label}"
              aria-label="${e.label}"
            >
              <ha-icon icon="${e.icon}"></ha-icon>
              <span class="nav-item-label">${e.label}</span>
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
          <button class="pin-btn" @click=${this._togglePin} title="${e?"Pin sidebar":"Collapse sidebar"}">
            <ha-icon icon="${e?"mdi:pin":"mdi:pin-off"}"></ha-icon>
            <span>${e?"Pin":"Collapse"}</span>
          </button>
        </div>
      </nav>
    `}_selectSource(e){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"browse",source:e.name,sourceUri:e.uri,pluginName:e.plugin_name},bubbles:!0,composed:!0}))}_navigate(e){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:e},bubbles:!0,composed:!0}))}_togglePin(){const e="collapsed"===this.mode;this.dispatchEvent(new CustomEvent("volumio-nav-pin",{detail:{pinned:e},bubbles:!0,composed:!0}))}});customElements.define("volumio-quality-badge",class extends se{static get properties(){return{quality:{type:Object},size:{type:String}}}static get styles(){return r`
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
    `}constructor(){super(),this.quality=null,this.size="normal"}render(){if(!this.quality||"unknown"===this.quality.tier||!this.quality.label)return F``;const e=this.quality,t="small"===this.size?"small":"large"===this.size?"large":"normal";return F`
      <span
        class="badge ${t}"
        style="color: ${e.color}; background: ${e.colorBg};"
        aria-label="Audio quality: ${e.label}"
        title="${e.tierLabel}: ${e.label}"
      >
        ${e.label}
      </span>
    `}});const _e={qobuz:"Qobuz",tidal:"TIDAL",mpd:"Local",webradio:"Radio",spotify:"Spotify",spop:"Spotify",pandora:"Pandora",youtube:"YouTube",youtube2:"YouTube"},fe={mpd:"mdi:folder-music",webradio:"mdi:radio"};customElements.define("volumio-source-badge",class extends se{static get properties(){return{source:{type:String}}}static get styles(){return r`
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
    `}constructor(){super(),this.source=""}render(){if(!this.source)return F``;const e=_e[this.source]||this.source,t=fe[this.source]||null;return F`
      <span class="source">
        ${t?F`<ha-icon icon="${t}"></ha-icon>`:""}
        ${e}
      </span>
    `}});customElements.define("volumio-player-bar",class extends se{static get properties(){return{playerState:{type:String,attribute:"player-state"},title:{type:String},artist:{type:String},albumArt:{type:String,attribute:"album-art"},duration:{type:Number},position:{type:Number},positionUpdatedAt:{type:String,attribute:"position-updated-at"},volume:{type:Number},muted:{type:Boolean},shuffle:{type:Boolean},repeat:{type:String},quality:{type:Object},source:{type:String},volumeEnabled:{type:Boolean,attribute:"volume-enabled"},isFavorite:{type:Boolean,attribute:"is-favorite"},_displayPosition:{type:Number,state:!0},_isDragging:{type:Boolean,state:!0}}}static get styles(){return r`
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
    `}constructor(){super(),this.playerState="idle",this.title="",this.artist="",this.albumArt="",this.duration=0,this.position=0,this.positionUpdatedAt="",this.volume=0,this.muted=!1,this.shuffle=!1,this.repeat="off",this.quality=null,this.source="",this.volumeEnabled=!0,this.isFavorite=!1,this._displayPosition=0,this._isDragging=!1,this._rafId=null}connectedCallback(){super.connectedCallback(),this._startProgressAnimation()}disconnectedCallback(){super.disconnectedCallback(),this._stopProgressAnimation()}updated(e){(e.has("position")||e.has("positionUpdatedAt")||e.has("playerState"))&&(this._isDragging||(this._displayPosition=this.position||0))}_startProgressAnimation(){const e=()=>{if("playing"===this.playerState&&!this._isDragging&&this.positionUpdatedAt){const e=new Date(this.positionUpdatedAt).getTime(),t=(Date.now()-e)/1e3,i=(this.position||0)+t;this._displayPosition=Math.min(i,this.duration||1/0)}this._rafId=requestAnimationFrame(e)};this._rafId=requestAnimationFrame(e)}_stopProgressAnimation(){this._rafId&&(cancelAnimationFrame(this._rafId),this._rafId=null)}render(){if("unavailable"===this.playerState)return F`
        <div class="skeleton-bar-row" aria-busy="true" aria-label="Loading">
          <div class="skeleton-art"></div>
          <div class="skeleton-info">
            <div class="skeleton-bar title"></div>
            <div class="skeleton-bar artist"></div>
          </div>
          <div class="skeleton-progress"></div>
        </div>
      `;if(!("playing"===this.playerState||"paused"===this.playerState)&&!this.title)return F`
        <div class="empty-state">
          <ha-icon icon="mdi:music-note-off"></ha-icon>
          <span>Nothing playing</span>
        </div>
      `;const e="playing"===this.playerState,t=this.duration>0?Math.min(100,this._displayPosition/this.duration*100):0,i="one"===this.repeat?"mdi:repeat-once":"mdi:repeat",o="off"!==this.repeat,a=this.muted?"mdi:volume-mute":"mdi:volume-high";return F`
      <div class="player-bar">
        ${this.albumArt?F`<img
              class="art"
              src="${this.albumArt}"
              alt="Album art"
              @click=${this._goToNowPlaying}
              @error=${this._onArtError}
            />`:F`<div class="art-placeholder" @click=${this._goToNowPlaying}>
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

            <button class="ctrl-btn play-pause" @click=${()=>this._command("play_pause")} aria-label="${e?"Pause":"Play"}">
              <ha-icon icon="${e?"mdi:pause":"mdi:play"}"></ha-icon>
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
              <div class="progress-fill" style="width: ${t}%">
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

          ${this.volumeEnabled?F`
            <div class="volume-section">
              <button
                class="vol-btn"
                @click=${()=>this._command("mute_toggle")}
                aria-label="Volume: ${this.muted?"muted":this.volume+"%"}"
              >
                <ha-icon icon="${a}"></ha-icon>
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
    `}_command(e,t){this.dispatchEvent(new CustomEvent("volumio-command",{detail:{command:e,value:t},bubbles:!0,composed:!0}))}_cycleRepeat(){const e="off"===this.repeat?"all":"all"===this.repeat?"one":"off";this._command("repeat_set",e)}_onProgressClick(e){const t=e.currentTarget.getBoundingClientRect(),i=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width)),o=Math.floor(i*(this.duration||0));this._command("seek",o)}_onVolumeInput(e){}_onVolumeChange(e){const t=parseInt(e.target.value,10);this._command("volume_set",t)}_goToNowPlaying(){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"now-playing"},bubbles:!0,composed:!0}))}_toggleFavorite(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-toggle-favorite",{bubbles:!0,composed:!0}))}_onArtError(e){e.target.style.display="none";const t=document.createElement("div");t.className="art-placeholder",t.innerHTML='<ha-icon icon="mdi:music-note"></ha-icon>',e.target.parentNode.insertBefore(t,e.target)}_formatTime(e){if(!e||e<=0)return"0:00";const t=Math.floor(e);return`${Math.floor(t/60)}:${(t%60).toString().padStart(2,"0")}`}});customElements.define("volumio-now-playing",class extends se{static get properties(){return{playerState:{type:String,attribute:"player-state"},title:{type:String},artist:{type:String},album:{type:String},albumArt:{type:String,attribute:"album-art"},quality:{type:Object},source:{type:String},isFavorite:{type:Boolean,attribute:"is-favorite"},_dominantColor:{type:String,state:!0},_showLightbox:{type:Boolean,state:!0}}}static get styles(){return r`
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
    `}constructor(){super(),this.playerState="idle",this.title="",this.artist="",this.album="",this.albumArt="",this.quality=null,this.source="",this.isFavorite=!1,this._dominantColor=null,this._showLightbox=!1,this._canvas=null}updated(e){e.has("albumArt")&&this.albumArt&&this._extractDominantColor(this.albumArt)}render(){if("unavailable"===this.playerState)return this._renderSkeleton();return"playing"===this.playerState||"paused"===this.playerState||this.title?F`
      <div class="ultra-blur">
        <div
          class="ultra-blur-gradient"
          style="background: ${this._dominantColor?`radial-gradient(ellipse at 50% 40%, ${this._dominantColor} 0%, transparent 85%)`:"transparent"}"
        ></div>
        <div class="ultra-blur-overlay"></div>
      </div>

      <div class="container">
        <div class="art-container" @click=${this._toggleLightbox}>
          ${this.albumArt?F`<img
                class="art ${this.playerState}"
                src="${this.albumArt}"
                alt="Album art for ${this.album||this.title}"
                @error=${this._onArtError}
              />`:F`<div class="art-placeholder">
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

          ${this.artist?F`
            <div class="track-artist" @click=${this._goToArtist}>${this.artist}</div>
          `:""}

          ${this.album?F`
            <div class="track-album" @click=${this._goToAlbum}>${this.album}</div>
          `:""}

          <div class="quality-row">
            <volumio-quality-badge .quality=${this.quality} size="large"></volumio-quality-badge>
            <volumio-source-badge .source=${this.source}></volumio-source-badge>
          </div>
        </div>
      </div>

      ${this._showLightbox&&this.albumArt?F`
        <div class="lightbox" @click=${this._toggleLightbox} @keydown=${this._onLightboxKey}>
          <img src="${this.albumArt}" alt="Full size album art" />
        </div>
      `:""}
    `:this._renderEmpty()}_renderEmpty(){return F`
      <div class="empty-state">
        <ha-icon icon="mdi:music-note-off"></ha-icon>
        <div class="message">Nothing playing</div>
        <button class="browse-btn" @click=${this._goToBrowse}>Browse Music</button>
      </div>
    `}_renderSkeleton(){return F`
      <div class="skeleton" aria-busy="true" aria-label="Loading">
        <div class="skeleton-art"></div>
        <div class="skeleton-bar title"></div>
        <div class="skeleton-bar artist"></div>
        <div class="skeleton-bar album"></div>
      </div>
    `}async _extractDominantColor(e){if(e)try{const t=new Image;t.src=e,await new Promise((e,i)=>{t.onload=e,t.onerror=i}),this._canvas||(this._canvas=document.createElement("canvas"));const i=this._canvas,o=i.getContext("2d",{willReadFrequently:!0}),a=10;i.width=a,i.height=a,o.drawImage(t,0,0,a,a);const r=o.getImageData(0,0,a,a).data;let s=0,n=0,l=0;const c=a*a;for(let e=0;e<r.length;e+=4)s+=r[e],n+=r[e+1],l+=r[e+2];s=Math.round(s/c),n=Math.round(n/c),l=Math.round(l/c);const d=Math.max(s,n,l)/255,u=Math.min(s,n,l)/255;let h=0,p=0,m=(d+u)/2;if(d!==u){const e=d-u;p=m>.5?e/(2-d-u):e/(d+u);const t=s/255,i=n/255,o=l/255;h=t===d?((i-o)/e+(i<o?6:0))/6:i===d?((o-t)/e+2)/6:((t-i)/e+4)/6}m=Math.max(m,.4),p=Math.min(1.3*p,1);const v=(e,t,i)=>(i<0&&(i+=1),i>1&&(i-=1),i<1/6?e+6*(t-e)*i:i<.5?t:i<2/3?e+(t-e)*(2/3-i)*6:e),b=m<.5?m*(1+p):m+p-m*p,g=2*m-b;s=Math.round(255*v(g,b,h+1/3)),n=Math.round(255*v(g,b,h)),l=Math.round(255*v(g,b,h-1/3)),this._dominantColor=`rgb(${s}, ${n}, ${l})`,console.debug("[volumio-panel] UltraBlur color extracted:",this._dominantColor)}catch{this._dominantColor=null}else this._dominantColor=null}_toggleFavorite(){this.dispatchEvent(new CustomEvent("volumio-toggle-favorite",{bubbles:!0,composed:!0}))}_toggleLightbox(){this._showLightbox=!this._showLightbox}_onLightboxKey(e){"Escape"===e.key&&(this._showLightbox=!1)}_goToArtist(){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"artist-detail",artist:this.artist},bubbles:!0,composed:!0}))}_goToAlbum(){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"album-detail",album:this.album},bubbles:!0,composed:!0}))}_goToBrowse(){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"browse"},bubbles:!0,composed:!0}))}_onArtError(e){e.target.style.display="none"}});const we={mpd:"mdi:folder-music",webradio:"mdi:radio",podcast:"mdi:podcast",spotify:"mdi:spotify",spop:"mdi:spotify",youtube:"mdi:youtube",youtube2:"mdi:youtube",tidal:"mdi:music-box",qobuz:"mdi:music-box",music_service:"mdi:music-box"};customElements.define("volumio-browse-source-grid",class extends se{static get properties(){return{sources:{type:Array},volumioUrl:{type:String,attribute:"volumio-url"}}}static get styles(){return r`
      :host {
        display: block;
        padding: var(--volumio-space-lg, 24px);
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: var(--volumio-space-md, 16px);
        max-width: 960px;
      }

      .source-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        aspect-ratio: 1;
        border-radius: 12px;
        background: var(--card-background-color, #1e1e1e);
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
        cursor: pointer;
        transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        padding: var(--volumio-space-md, 16px);
        gap: var(--volumio-space-sm, 8px);
        text-align: center;
      }

      .source-card:hover {
        transform: scale(1.03);
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      }

      .source-icon {
        width: 64px;
        height: 64px;
        border-radius: 12px;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--primary-background-color, #121212);
      }

      .source-icon img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .source-icon ha-icon {
        --mdc-icon-size: 32px;
        color: var(--secondary-text-color);
      }

      .source-name {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 100%;
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--volumio-space-xxl, 48px);
        text-align: center;
        gap: var(--volumio-space-md, 16px);
      }

      .empty-state ha-icon {
        --mdc-icon-size: 48px;
        color: var(--secondary-text-color);
        opacity: 0.3;
      }

      .empty-state .message {
        font-size: 16px;
        color: var(--secondary-text-color);
      }
    `}constructor(){super(),this.sources=[],this.volumioUrl=""}render(){return this.sources&&0!==this.sources.length?F`
      <div class="grid">
        ${this.sources.map(e=>this._renderSourceCard(e))}
      </div>
    `:F`
        <div class="empty-state">
          <ha-icon icon="mdi:music-box-multiple-outline"></ha-icon>
          <div class="message">No music sources configured</div>
        </div>
      `}_renderSourceCard(e){const t=we[e.plugin_name]||we[e.plugin_type]||"mdi:music-box",i=be(e.albumart||e.icon,this.volumioUrl);return F`
      <div
        class="source-card"
        @click=${()=>this._selectSource(e)}
        title="${e.name}"
      >
        <div class="source-icon">
          ${i?F`<img
                src="${i}"
                alt="${e.name}"
                @error=${this._onIconError}
              />`:F`<ha-icon icon="${t}"></ha-icon>`}
        </div>
        <div class="source-name">${e.name}</div>
      </div>
    `}_selectSource(e){this.dispatchEvent(new CustomEvent("volumio-source-select",{detail:{uri:e.uri,name:e.name,plugin_name:e.plugin_name},bubbles:!0,composed:!0}))}_onIconError(e){const t=e.target.parentElement;e.target.remove(),t.innerHTML='<ha-icon icon="mdi:music-box"></ha-icon>'}});customElements.define("volumio-album-card",class extends se{static get properties(){return{title:{type:String},artist:{type:String},albumart:{type:String},uri:{type:String},type:{type:String},quality:{type:Object},service:{type:String}}}static get styles(){return r`
      :host {
        display: block;
        width: 180px;
      }

      .card {
        cursor: pointer;
        border-radius: 6px;
        transition: transform 0.15s ease, box-shadow 0.15s ease;
        position: relative;
      }

      .card:hover {
        transform: scale(1.03);
      }

      .card:hover .play-overlay {
        opacity: 1;
      }

      .card:hover .art {
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
      }

      .art-container {
        position: relative;
        width: 100%;
        aspect-ratio: 1;
        border-radius: 6px;
        overflow: hidden;
        background: var(--card-background-color, #2a2a2a);
      }

      .art {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        transition: box-shadow 0.15s ease;
      }

      .art-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--card-background-color, #2a2a2a);
      }

      .art-placeholder ha-icon {
        --mdc-icon-size: 48px;
        color: var(--secondary-text-color);
        opacity: 0.3;
      }

      .play-overlay {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        background: rgba(0, 0, 0, 0.4);
        opacity: 0;
        transition: opacity 0.15s ease;
        border-radius: 6px;
      }

      .play-btn,
      .queue-btn {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .play-btn {
        background: var(--primary-color, #03a9f4);
        color: #fff;
      }

      .play-btn ha-icon {
        --mdc-icon-size: 22px;
      }

      .queue-btn {
        width: 36px;
        height: 36px;
        background: rgba(255, 255, 255, 0.15);
        color: #fff;
      }

      .queue-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .queue-btn ha-icon {
        --mdc-icon-size: 18px;
      }

      .meta {
        padding: 8px 2px 0;
      }

      .card-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.3;
      }

      .card-artist {
        font-size: 13px;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.3;
        margin-top: 2px;
      }

      .card-quality {
        margin-top: 4px;
      }

      /* Folder variant */
      .card.folder .art-placeholder {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
      }
    `}constructor(){super(),this.title="",this.artist="",this.albumart="",this.uri="",this.type="folder",this.quality=null,this.service=""}render(){const e="folder"===this.type||"category"===this.type,t=e?"mdi:folder-music":"mdi:music-note";return F`
      <div class="card ${e?"folder":""}" @click=${this._onClick}>
        <div class="art-container">
          ${this.albumart?F`<img
                class="art"
                src="${this.albumart}"
                alt="${this.title}"
                loading="lazy"
                @error=${this._onArtError}
              />`:F`<div class="art-placeholder">
                <ha-icon icon="${t}"></ha-icon>
              </div>`}
          <div class="play-overlay">
            <button class="play-btn" @click=${this._onPlay} title="Play">
              <ha-icon icon="mdi:play"></ha-icon>
            </button>
            <button class="queue-btn" @click=${this._onAddQueue} title="Add to queue">
              <ha-icon icon="mdi:playlist-plus"></ha-icon>
            </button>
          </div>
        </div>
        <div class="meta">
          <div class="card-title" title="${this.title}">${this.title||"Unknown"}</div>
          ${this.artist?F`<div class="card-artist" title="${this.artist}">${this.artist}</div>`:""}
          ${this.quality&&"unknown"!==this.quality.tier?F`<div class="card-quality">
                <volumio-quality-badge .quality=${this.quality} size="small"></volumio-quality-badge>
              </div>`:""}
        </div>
      </div>
    `}_getItemData(){return{uri:this.uri,title:this.title,artist:this.artist,albumart:this.albumart,type:this.type,service:this.service}}_onClick(e){e.target.closest(".play-btn")||this.dispatchEvent(new CustomEvent("volumio-card-click",{detail:this._getItemData(),bubbles:!0,composed:!0}))}_onPlay(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-card-play",{detail:this._getItemData(),bubbles:!0,composed:!0}))}_onAddQueue(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-card-add-queue",{detail:this._getItemData(),bubbles:!0,composed:!0}))}_onArtError(e){const t=e.target.parentElement;e.target.remove();const i=document.createElement("div");i.className="art-placeholder",i.innerHTML='<ha-icon icon="mdi:music-note"></ha-icon>',t.prepend(i)}});customElements.define("volumio-track-card",class extends se{static get properties(){return{index:{type:Number},title:{type:String},artist:{type:String},album:{type:String},duration:{type:Number},uri:{type:String},albumart:{type:String},service:{type:String},type:{type:String},quality:{type:Object},isPlaying:{type:Boolean,attribute:"is-playing"},compact:{type:Boolean}}}static get styles(){return r`
      :host {
        display: block;
      }

      .row {
        display: grid;
        grid-template-columns: 40px 1fr 1fr 0.8fr auto 60px 32px;
        align-items: center;
        height: 48px;
        padding: 0 12px;
        cursor: pointer;
        transition: background 0.1s;
        position: relative;
        gap: 8px;
      }

      .row:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.06));
      }

      .row.playing {
        border-left: 3px solid var(--primary-color, #03a9f4);
      }

      .row.playing .cell-title {
        color: var(--primary-color, #03a9f4);
      }

      /* ── Cells ──────────────────────────── */
      .cell-num {
        font-size: 13px;
        color: var(--secondary-text-color);
        text-align: center;
        position: relative;
      }

      .cell-num .num-text {
        display: block;
      }

      .cell-num .play-icon {
        display: none;
        color: var(--primary-text-color);
      }

      .row:hover .cell-num .num-text {
        display: none;
      }

      .row:hover .cell-num .play-icon {
        display: block;
      }

      .row.playing .cell-num .num-text {
        display: none;
      }

      .row.playing .cell-num .eq-icon {
        display: block;
        color: var(--primary-color, #03a9f4);
      }

      .row.playing:not(:hover) .cell-num .play-icon {
        display: none;
      }

      .eq-icon {
        display: none;
      }

      .cell-num ha-icon {
        --mdc-icon-size: 18px;
      }

      .cell-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .cell-artist,
      .cell-album {
        font-size: 13px;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .cell-quality {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }

      .cell-duration {
        font-size: 13px;
        color: var(--secondary-text-color);
        text-align: right;
        font-variant-numeric: tabular-nums;
      }

      .cell-context {
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.1s;
      }

      .row:hover .cell-context {
        opacity: 1;
      }

      .context-btn {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: none;
        background: transparent;
        color: var(--secondary-text-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }

      .context-btn:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        color: var(--primary-text-color);
      }

      .context-btn ha-icon {
        --mdc-icon-size: 18px;
      }

      /* ── Compact mode (browse — no quality/time/album) ── */
      .row.compact {
        grid-template-columns: 40px 1.5fr 1fr 32px;
      }

      .row.compact .cell-quality,
      .row.compact .cell-duration,
      .row.compact .cell-album {
        display: none;
      }

      /* ── Responsive (hide album & quality) ── */
      @media (max-width: 768px) {
        .row {
          grid-template-columns: 40px 1fr 0.8fr 60px 32px;
        }
        .cell-album,
        .cell-quality {
          display: none;
        }
      }

      @media (max-width: 480px) {
        .row {
          grid-template-columns: 32px 1fr 50px;
          gap: 4px;
        }
        .cell-artist,
        .cell-album,
        .cell-quality,
        .cell-context {
          display: none;
        }
      }
    `}constructor(){super(),this.index=0,this.title="",this.artist="",this.album="",this.duration=0,this.uri="",this.albumart="",this.service="",this.type="song",this.quality=null,this.isPlaying=!1,this.compact=!1}render(){return F`
      <div
        class="row ${this.isPlaying?"playing":""} ${this.compact?"compact":""}"
        @click=${this._onClick}
        @contextmenu=${this._onContextMenu}
      >
        <div class="cell-num">
          <span class="num-text">${this.index||""}</span>
          <ha-icon class="play-icon" icon="mdi:play"></ha-icon>
          <ha-icon class="eq-icon" icon="mdi:equalizer"></ha-icon>
        </div>
        <div class="cell-title" title="${this.title}">${this.title||"—"}</div>
        <div class="cell-artist" title="${this.artist}">${this.artist||""}</div>
        <div class="cell-album" title="${this.album}">${this.album||""}</div>
        <div class="cell-quality">
          ${this.quality&&"unknown"!==this.quality.tier?F`<volumio-quality-badge .quality=${this.quality} size="small"></volumio-quality-badge>`:""}
        </div>
        <div class="cell-duration">${this.duration?ve(this.duration):""}</div>
        <div class="cell-context">
          <button class="context-btn" @click=${this._onAddToQueue} title="Add to queue">
            <ha-icon icon="mdi:playlist-plus"></ha-icon>
          </button>
        </div>
      </div>
    `}_getItemData(){return{uri:this.uri,title:this.title,artist:this.artist,album:this.album,albumart:this.albumart,service:this.service,type:this.type,index:this.index}}_onClick(){this.dispatchEvent(new CustomEvent("volumio-track-click",{detail:this._getItemData(),bubbles:!0,composed:!0}))}_onAddToQueue(e){e.stopPropagation(),e.preventDefault(),this.dispatchEvent(new CustomEvent("volumio-track-add-queue",{detail:this._getItemData(),bubbles:!0,composed:!0}))}_onContextMenu(e){e.preventDefault(),this.dispatchEvent(new CustomEvent("volumio-track-add-queue",{detail:this._getItemData(),bubbles:!0,composed:!0}))}});customElements.define("volumio-browse-list",class extends se{static get properties(){return{items:{type:Array},viewMode:{type:String,attribute:"view-mode"},loading:{type:Boolean},currentUri:{type:String,attribute:"current-uri"},volumioUrl:{type:String,attribute:"volumio-url"},_displayCount:{type:Number,state:!0}}}static get styles(){return r`
      :host {
        display: block;
        padding: var(--volumio-space-lg, 24px);
      }

      /* ── Toolbar ──────────────────────────── */
      .toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--volumio-space-md, 16px);
        gap: var(--volumio-space-sm, 8px);
      }

      .item-count {
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .toolbar-actions {
        display: flex;
        align-items: center;
        gap: var(--volumio-space-xs, 4px);
      }

      .view-btn {
        width: 36px;
        height: 36px;
        border-radius: 6px;
        border: none;
        background: transparent;
        color: var(--secondary-text-color);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
      }

      .view-btn:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
      }

      .view-btn.active {
        color: var(--primary-color, #03a9f4);
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
      }

      .view-btn ha-icon {
        --mdc-icon-size: 20px;
      }

      /* ── Grid layout ──────────────────────── */
      .browse-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: var(--volumio-space-md, 16px);
      }

      /* ── List layout ──────────────────────── */
      .browse-list {
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        border-radius: 8px;
        overflow: hidden;
      }

      .list-header {
        display: grid;
        grid-template-columns: 40px 1fr 1fr 0.8fr auto 60px 32px;
        align-items: center;
        height: 36px;
        padding: 0 12px;
        gap: 8px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
        border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        background: var(--card-background-color, #1e1e1e);
      }

      .list-header .hdr-duration {
        text-align: right;
      }

      /* ── Load more ────────────────────────── */
      .load-more {
        display: flex;
        justify-content: center;
        padding: var(--volumio-space-lg, 24px);
      }

      .load-more-btn {
        padding: 10px 32px;
        border-radius: 20px;
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
        background: transparent;
        color: var(--primary-text-color);
        font-size: 14px;
        cursor: pointer;
        transition: background 0.15s;
      }

      .load-more-btn:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
      }

      /* ── Loading skeleton ─────────────────── */
      @keyframes shimmer {
        0% { opacity: 0.3; }
        50% { opacity: 0.15; }
        100% { opacity: 0.3; }
      }

      .skeleton-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: var(--volumio-space-md, 16px);
      }

      .skeleton-card {
        aspect-ratio: 1;
        border-radius: 6px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-row {
        height: 48px;
        border-radius: 4px;
        margin-bottom: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--volumio-space-xxl, 48px);
        text-align: center;
        gap: var(--volumio-space-md, 16px);
      }

      .empty-state ha-icon {
        --mdc-icon-size: 48px;
        color: var(--secondary-text-color);
        opacity: 0.3;
      }

      .empty-state .message {
        font-size: 16px;
        color: var(--secondary-text-color);
      }

      /* ── Alpha index ──────────────────────── */
      .browse-content {
        position: relative;
      }

      .alpha-index {
        position: fixed;
        right: 8px;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0;
        z-index: 50;
        padding: 4px 2px;
        border-radius: 12px;
        background: var(--card-background-color, rgba(30, 30, 30, 0.9));
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      }

      .alpha-letter {
        width: 22px;
        height: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 600;
        color: var(--secondary-text-color);
        cursor: pointer;
        border-radius: 4px;
        user-select: none;
        transition: color 0.1s, background 0.1s;
      }

      .alpha-letter:hover {
        color: var(--primary-text-color);
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
      }

      .alpha-letter.active {
        color: var(--primary-color, #03a9f4);
      }

      .alpha-letter.disabled {
        opacity: 0.2;
        cursor: default;
      }

      .alpha-letter.disabled:hover {
        color: var(--secondary-text-color);
        background: transparent;
      }

      @media (max-width: 768px) {
        .list-header {
          grid-template-columns: 40px 1fr 0.8fr 60px 32px;
        }
        .list-header .hdr-album,
        .list-header .hdr-quality {
          display: none;
        }
      }
    `}constructor(){super(),this.items=[],this.viewMode=localStorage.getItem("volumio-browse-view")||"grid",this.loading=!1,this.currentUri="",this.volumioUrl="",this._displayCount=100}render(){if(this.loading)return this._renderSkeleton();if(!this.items||0===this.items.length)return F`
        <div class="empty-state">
          <ha-icon icon="mdi:folder-open-outline"></ha-icon>
          <div class="message">No items found</div>
        </div>
      `;const e=this.items.slice(0,this._displayCount),t=this.items.length>this._displayCount,i=this.items.length>20,o=i?this._buildAlphaMap():null;return F`
      <div class="toolbar">
        <span class="item-count">${this.items.length} item${1!==this.items.length?"s":""}</span>
        <div class="toolbar-actions">
          <button
            class="view-btn ${"grid"===this.viewMode?"active":""}"
            @click=${()=>this._setViewMode("grid")}
            title="Grid view"
          >
            <ha-icon icon="mdi:view-grid"></ha-icon>
          </button>
          <button
            class="view-btn ${"list"===this.viewMode?"active":""}"
            @click=${()=>this._setViewMode("list")}
            title="List view"
          >
            <ha-icon icon="mdi:view-list"></ha-icon>
          </button>
        </div>
      </div>

      <div class="browse-content">
        ${"grid"===this.viewMode?this._renderGrid(e):this._renderList(e)}

        ${t?F`
          <div class="load-more">
            <button class="load-more-btn" @click=${this._loadMore}>
              Show more (${this.items.length-this._displayCount} remaining)
            </button>
          </div>
        `:""}

        ${i?this._renderAlphaIndex(o):""}
      </div>
    `}updated(e){e.has("items")&&(this._displayCount=100)}_renderGrid(e){return F`
      <div class="browse-grid">
        ${e.map(e=>{const t=be(e.albumart||e.icon,this.volumioUrl),i=this._getItemLetter(e);return F`
            <volumio-album-card
              data-letter="${i}"
              title="${e.title||e.name||""}"
              artist="${e.artist||""}"
              albumart="${t}"
              uri="${e.uri||""}"
              type="${e.type||"folder"}"
              service="${e.service||""}"
              @volumio-card-click=${this._onItemClick}
              @volumio-card-play=${this._onItemPlay}
            ></volumio-album-card>
          `})}
      </div>
    `}_renderList(e){const t=!e.some(e=>e.duration>0);return F`
      <div class="browse-list">
        <div class="list-header" style="grid-template-columns: ${t?"40px 1.5fr 1fr 32px":"40px 1fr 1fr 0.8fr auto 60px 32px"};">
          <span>#</span>
          <span>Title</span>
          <span>Artist</span>
          ${t?"":F`
            <span class="hdr-album">Album</span>
            <span class="hdr-quality">Quality</span>
            <span class="hdr-duration">Time</span>
          `}
          <span></span>
        </div>
        ${e.map((e,i)=>{const o=be(e.albumart||e.icon,this.volumioUrl),a=this._getItemLetter(e);return F`
            <volumio-track-card
              data-letter="${a}"
              .index=${i+1}
              title="${e.title||e.name||""}"
              artist="${e.artist||""}"
              album="${e.album||""}"
              .duration=${e.duration||0}
              uri="${e.uri||""}"
              albumart="${o}"
              service="${e.service||""}"
              type="${e.type||"folder"}"
              ?compact=${t}
              ?is-playing=${this.currentUri&&e.uri===this.currentUri}
              @volumio-track-click=${this._onItemClick}
              @volumio-track-add-queue=${this._onItemAddQueue}
            ></volumio-track-card>
          `})}
      </div>
    `}_renderSkeleton(){return F`
      <div class="skeleton-grid" aria-busy="true" aria-label="Loading">
        ${Array(12).fill(0).map(()=>F`<div class="skeleton-card"></div>`)}
      </div>
    `}_setViewMode(e){this.viewMode=e,localStorage.setItem("volumio-browse-view",e),this.dispatchEvent(new CustomEvent("volumio-view-mode-change",{detail:{mode:e},bubbles:!0,composed:!0}))}_loadMore(){this._displayCount+=100}_onItemClick(e){e.stopPropagation();const t=e.detail;this.dispatchEvent(new CustomEvent("volumio-item-click",{detail:t,bubbles:!0,composed:!0}))}_onItemPlay(e){e.stopPropagation();const t=e.detail;this.dispatchEvent(new CustomEvent("volumio-item-play",{detail:t,bubbles:!0,composed:!0}))}_onItemAddQueue(e){e.stopPropagation();const t=e.detail;this.dispatchEvent(new CustomEvent("volumio-item-add-queue",{detail:t,bubbles:!0,composed:!0}))}_getItemLetter(e){const t=(e.title||e.name||"").trim();if(!t)return"#";const i=t.charAt(0).toUpperCase();return/[A-Z]/.test(i)?i:"#"}_buildAlphaMap(){const e=new Set;for(const t of this.items)e.add(this._getItemLetter(t));return e}_renderAlphaIndex(e){const t=["#",..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];return F`
      <div class="alpha-index">
        ${t.map(t=>{const i=e.has(t);return F`
            <div
              class="alpha-letter ${i?"":"disabled"}"
              @click=${()=>i&&this._scrollToLetter(t)}
            >${t}</div>
          `})}
      </div>
    `}_scrollToLetter(e){if(this._displayCount<this.items.length){const t=this.items.findIndex(t=>this._getItemLetter(t)===e);t>=this._displayCount&&(this._displayCount=Math.min(t+50,this.items.length))}this.updateComplete.then(()=>{const t=this.shadowRoot.querySelector(`[data-letter="${e}"]`);t&&t.scrollIntoView({behavior:"smooth",block:"start"})})}});customElements.define("volumio-album-detail",class extends se{static get properties(){return{albumTitle:{type:String,attribute:"album-title"},albumArtist:{type:String,attribute:"album-artist"},albumArt:{type:String,attribute:"album-art"},albumUri:{type:String,attribute:"album-uri"},albumService:{type:String,attribute:"album-service"},tracks:{type:Array},loading:{type:Boolean},currentUri:{type:String,attribute:"current-uri"},quality:{type:Object},volumioUrl:{type:String,attribute:"volumio-url"}}}static get styles(){return r`
      :host {
        display: block;
        padding: var(--volumio-space-lg, 24px);
      }

      /* ── Header ──────────────────────────── */
      .album-header {
        display: flex;
        gap: var(--volumio-space-lg, 24px);
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .album-art-container {
        flex-shrink: 0;
        width: 250px;
        height: 250px;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
      }

      .album-art-container img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .album-art-placeholder {
        width: 100%;
        height: 100%;
        background: var(--card-background-color, #2a2a2a);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .album-art-placeholder ha-icon {
        --mdc-icon-size: 64px;
        color: var(--secondary-text-color);
        opacity: 0.3;
      }

      .album-meta {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        gap: var(--volumio-space-xs, 4px);
        min-width: 0;
      }

      .meta-type {
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
      }

      .album-name {
        font-size: 28px;
        font-weight: 700;
        color: var(--primary-text-color);
        line-height: 1.2;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }

      .album-artist-link {
        font-size: 16px;
        color: var(--secondary-text-color);
        cursor: pointer;
        transition: color 0.15s;
      }

      .album-artist-link:hover {
        color: var(--primary-text-color);
        text-decoration: underline;
      }

      .meta-details {
        display: flex;
        align-items: center;
        gap: var(--volumio-space-sm, 8px);
        flex-wrap: wrap;
        margin-top: var(--volumio-space-xs, 4px);
      }

      .meta-details .detail {
        font-size: 13px;
        color: var(--secondary-text-color);
      }

      .meta-details .sep {
        color: var(--secondary-text-color);
        opacity: 0.4;
      }

      .album-actions {
        display: flex;
        gap: var(--volumio-space-sm, 8px);
        margin-top: var(--volumio-space-md, 16px);
      }

      .action-btn {
        padding: 10px 24px;
        border-radius: 20px;
        border: none;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: opacity 0.15s;
      }

      .action-btn:hover {
        opacity: 0.85;
      }

      .action-btn ha-icon {
        --mdc-icon-size: 20px;
      }

      .action-btn.primary {
        background: var(--primary-color, #03a9f4);
        color: #fff;
      }

      .action-btn.secondary {
        background: var(--divider-color, rgba(255, 255, 255, 0.12));
        color: var(--primary-text-color);
      }

      /* ── Track list ──────────────────────── */
      .track-list {
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        border-radius: 8px;
        overflow: hidden;
      }

      .track-list-header {
        display: grid;
        grid-template-columns: 40px 1fr 1fr 0.8fr auto 60px 32px;
        align-items: center;
        height: 36px;
        padding: 0 12px;
        gap: 8px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
        border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        background: var(--card-background-color, #1e1e1e);
      }

      .track-list-header .hdr-duration {
        text-align: right;
      }

      /* ── Loading skeleton ─────────────────── */
      @keyframes shimmer {
        0% { opacity: 0.3; }
        50% { opacity: 0.15; }
        100% { opacity: 0.3; }
      }

      .skeleton-header {
        display: flex;
        gap: var(--volumio-space-lg, 24px);
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .skeleton-art {
        width: 250px;
        height: 250px;
        border-radius: 6px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
        flex-shrink: 0;
      }

      .skeleton-meta {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        gap: 8px;
      }

      .skeleton-bar {
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-bar.title { width: 60%; height: 28px; }
      .skeleton-bar.artist { width: 30%; height: 16px; }
      .skeleton-bar.detail { width: 45%; height: 14px; }

      .skeleton-tracks {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .skeleton-track {
        height: 48px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      /* ── Responsive ──────────────────────── */
      @media (max-width: 768px) {
        .album-header {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .album-art-container {
          width: 200px;
          height: 200px;
        }

        .album-meta {
          align-items: center;
        }

        .album-actions {
          justify-content: center;
        }

        .track-list-header {
          grid-template-columns: 40px 1fr 0.8fr 60px 32px;
        }

        .track-list-header .hdr-album,
        .track-list-header .hdr-quality {
          display: none;
        }
      }
    `}constructor(){super(),this.albumTitle="",this.albumArtist="",this.albumArt="",this.albumUri="",this.albumService="",this.tracks=[],this.loading=!1,this.currentUri="",this.quality=null,this.volumioUrl=""}render(){if(this.loading)return this._renderSkeleton();const e=this.tracks.length,t=this.tracks.reduce((e,t)=>e+(t.duration||0),0);return F`
      <div class="album-header">
        <div class="album-art-container">
          ${this.albumArt?F`<img src="${this.albumArt}" alt="${this.albumTitle}" @error=${this._onArtError} />`:F`<div class="album-art-placeholder">
                <ha-icon icon="mdi:album"></ha-icon>
              </div>`}
        </div>
        <div class="album-meta">
          <span class="meta-type">Album</span>
          <div class="album-name">${this.albumTitle||"Unknown Album"}</div>
          ${this.albumArtist?F`<span class="album-artist-link" @click=${this._goToArtist}>
                ${this.albumArtist}
              </span>`:""}
          <div class="meta-details">
            ${e>0?F`<span class="detail">${e} track${1!==e?"s":""}</span>`:""}
            ${e>0&&t>0?F`<span class="sep">·</span>`:""}
            ${t>0?F`<span class="detail">${ve(t)}</span>`:""}
            ${this.albumService?F`
              <span class="sep">·</span>
              <volumio-source-badge .source=${this.albumService}></volumio-source-badge>
            `:""}
          </div>
          ${this.quality&&"unknown"!==this.quality.tier?F`
            <div style="margin-top: 4px">
              <volumio-quality-badge .quality=${this.quality}></volumio-quality-badge>
            </div>
          `:""}
          <div class="album-actions">
            <button class="action-btn primary" @click=${this._playAlbum}>
              <ha-icon icon="mdi:play"></ha-icon> Play
            </button>
            <button class="action-btn secondary" @click=${this._addToQueue}>
              <ha-icon icon="mdi:playlist-plus"></ha-icon> Add to Queue
            </button>
          </div>
        </div>
      </div>

      ${e>0?F`
        <div class="track-list">
          <div class="track-list-header">
            <span>#</span>
            <span>Title</span>
            <span>Artist</span>
            <span class="hdr-album">Album</span>
            <span class="hdr-quality">Quality</span>
            <span class="hdr-duration">Time</span>
            <span></span>
          </div>
          ${this.tracks.map((e,t)=>{const i=be(e.albumart||e.icon,this.volumioUrl);return F`
              <volumio-track-card
                .index=${t+1}
                title="${e.title||e.name||""}"
                artist="${e.artist||this.albumArtist||""}"
                album="${e.album||this.albumTitle||""}"
                .duration=${e.duration||0}
                uri="${e.uri||""}"
                albumart="${i}"
                service="${e.service||this.albumService||""}"
                type="${e.type||"song"}"
                ?is-playing=${this.currentUri&&e.uri===this.currentUri}
                @volumio-track-click=${this._onTrackClick}
                @volumio-track-add-queue=${this._onTrackAddQueue}
              ></volumio-track-card>
            `})}
        </div>
      `:F`
        <div style="text-align: center; padding: 32px; color: var(--secondary-text-color);">
          No tracks found
        </div>
      `}
    `}_renderSkeleton(){return F`
      <div aria-busy="true" aria-label="Loading album">
        <div class="skeleton-header">
          <div class="skeleton-art"></div>
          <div class="skeleton-meta">
            <div class="skeleton-bar title"></div>
            <div class="skeleton-bar artist"></div>
            <div class="skeleton-bar detail"></div>
          </div>
        </div>
        <div class="skeleton-tracks">
          ${Array(8).fill(0).map(()=>F`<div class="skeleton-track"></div>`)}
        </div>
      </div>
    `}_playAlbum(){this.dispatchEvent(new CustomEvent("volumio-album-play",{detail:{uri:this.albumUri},bubbles:!0,composed:!0}))}_addToQueue(){this.dispatchEvent(new CustomEvent("volumio-album-add-queue",{detail:{uri:this.albumUri},bubbles:!0,composed:!0}))}_goToArtist(){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"artist-detail",artist:this.albumArtist},bubbles:!0,composed:!0}))}_onTrackClick(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-track-click",{detail:e.detail,bubbles:!0,composed:!0}))}_onTrackAddQueue(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-track-add-queue",{detail:e.detail,bubbles:!0,composed:!0}))}_onArtError(e){const t=e.target.parentElement;e.target.remove(),t.innerHTML='<div class="album-art-placeholder"><ha-icon icon="mdi:album"></ha-icon></div>'}});customElements.define("volumio-artist-detail",class extends se{static get properties(){return{artistName:{type:String,attribute:"artist-name"},items:{type:Array},loading:{type:Boolean},volumioUrl:{type:String,attribute:"volumio-url"}}}static get styles(){return r`
      :host {
        display: block;
        padding: var(--volumio-space-lg, 24px);
      }

      .artist-header {
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .artist-name {
        font-size: 28px;
        font-weight: 700;
        color: var(--primary-text-color);
        line-height: 1.2;
      }

      .section {
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .section-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--primary-text-color);
        margin-bottom: var(--volumio-space-md, 16px);
      }

      .albums-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: var(--volumio-space-md, 16px);
      }

      .placeholder-section {
        padding: var(--volumio-space-lg, 24px);
        border-radius: 8px;
        background: var(--card-background-color, #1e1e1e);
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        color: var(--secondary-text-color);
        font-size: 14px;
        text-align: center;
      }

      /* ── Loading skeleton ─────────────────── */
      @keyframes shimmer {
        0% { opacity: 0.3; }
        50% { opacity: 0.15; }
        100% { opacity: 0.3; }
      }

      .skeleton-name {
        width: 40%;
        height: 28px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .skeleton-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: var(--volumio-space-md, 16px);
      }

      .skeleton-card {
        aspect-ratio: 1;
        border-radius: 6px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .empty-state {
        text-align: center;
        padding: var(--volumio-space-xl, 32px);
        color: var(--secondary-text-color);
        font-size: 14px;
      }
    `}constructor(){super(),this.artistName="",this.items=[],this.loading=!1,this.volumioUrl=""}render(){return this.loading?this._renderSkeleton():F`
      <div class="artist-header">
        <div class="artist-name">${this.artistName||"Unknown Artist"}</div>
      </div>

      <div class="section">
        <div class="section-title">Albums</div>
        ${this.items&&this.items.length>0?F`
            <div class="albums-grid">
              ${this.items.map(e=>{const t=be(e.albumart||e.icon,this.volumioUrl);return F`
                  <volumio-album-card
                    title="${e.title||e.name||""}"
                    artist="${e.artist||this.artistName||""}"
                    albumart="${t}"
                    uri="${e.uri||""}"
                    type="album"
                    service="${e.service||""}"
                    @volumio-card-click=${this._onCardClick}
                    @volumio-card-play=${this._onCardPlay}
                  ></volumio-album-card>
                `})}
            </div>
          `:F`<div class="empty-state">No albums found</div>`}
      </div>

      <div class="section">
        <div class="section-title">About</div>
        <div class="placeholder-section">
          Artist information coming soon
        </div>
      </div>

      <div class="section">
        <div class="section-title">Similar Artists</div>
        <div class="placeholder-section">
          Similar artists coming soon
        </div>
      </div>
    `}_renderSkeleton(){return F`
      <div aria-busy="true" aria-label="Loading artist">
        <div class="skeleton-name"></div>
        <div class="skeleton-grid">
          ${Array(6).fill(0).map(()=>F`<div class="skeleton-card"></div>`)}
        </div>
      </div>
    `}_onCardClick(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-card-click",{detail:e.detail,bubbles:!0,composed:!0}))}_onCardPlay(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-card-play",{detail:e.detail,bubbles:!0,composed:!0}))}});customElements.define("volumio-search-results",class extends se{static get properties(){return{results:{type:Object},loading:{type:Boolean},query:{type:String},volumioUrl:{type:String,attribute:"volumio-url"},currentUri:{type:String,attribute:"current-uri"},_expandedSections:{type:Object,state:!0}}}static get styles(){return r`
      :host {
        display: block;
        padding: var(--volumio-space-lg, 24px);
      }

      .results-header {
        font-size: 14px;
        color: var(--secondary-text-color);
        margin-bottom: var(--volumio-space-lg, 24px);
      }

      .results-header strong {
        color: var(--primary-text-color);
      }

      /* ── Source group ─────────────────────── */
      .source-group {
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .source-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--volumio-space-sm, 8px);
        cursor: pointer;
      }

      .source-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--primary-text-color);
      }

      .source-count {
        font-size: 12px;
        color: var(--secondary-text-color);
        padding: 2px 8px;
        border-radius: 10px;
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
      }

      .collapse-icon {
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
        transition: transform 0.2s;
      }

      .collapse-icon.collapsed {
        transform: rotate(-90deg);
      }

      /* ── Type subsection ──────────────────── */
      .type-section {
        margin-bottom: var(--volumio-space-md, 16px);
      }

      .type-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--secondary-text-color);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: var(--volumio-space-sm, 8px);
      }

      .items-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: var(--volumio-space-sm, 8px);
      }

      .items-list {
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        border-radius: 8px;
        overflow: hidden;
      }

      .artist-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border-radius: 20px;
        background: var(--card-background-color, #1e1e1e);
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
        color: var(--primary-text-color);
        font-size: 14px;
        cursor: pointer;
        transition: background 0.15s;
        margin: 0 8px 8px 0;
      }

      .artist-link:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
      }

      .artist-link ha-icon {
        --mdc-icon-size: 18px;
        color: var(--secondary-text-color);
      }

      .show-all-btn {
        border: none;
        background: none;
        color: var(--primary-color, #03a9f4);
        font-size: 13px;
        cursor: pointer;
        padding: 4px 0;
        margin-top: var(--volumio-space-xs, 4px);
      }

      .show-all-btn:hover {
        text-decoration: underline;
      }

      /* ── Loading / empty ──────────────────── */
      @keyframes shimmer {
        0% { opacity: 0.3; }
        50% { opacity: 0.15; }
        100% { opacity: 0.3; }
      }

      .skeleton-results {
        display: flex;
        flex-direction: column;
        gap: var(--volumio-space-lg, 24px);
      }

      .skeleton-section-title {
        width: 30%;
        height: 18px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: var(--volumio-space-sm, 8px);
      }

      .skeleton-card {
        aspect-ratio: 1;
        border-radius: 6px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-row {
        height: 48px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
        margin-bottom: 4px;
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: var(--volumio-space-xxl, 48px);
        text-align: center;
        gap: var(--volumio-space-md, 16px);
      }

      .empty-state ha-icon {
        --mdc-icon-size: 48px;
        color: var(--secondary-text-color);
        opacity: 0.3;
      }

      .empty-state .message {
        font-size: 16px;
        color: var(--secondary-text-color);
      }
    `}constructor(){super(),this.results=null,this.loading=!1,this.query="",this.volumioUrl="",this.currentUri="",this._expandedSections={}}render(){if(this.loading)return this._renderSkeleton();const e=this._parseResults();if(!e||0===e.length)return this.query?F`
        <div class="empty-state">
          <ha-icon icon="mdi:magnify-close"></ha-icon>
          <div class="message">No results found for "${this.query}"</div>
        </div>
      `:F``;const t=e.reduce((e,t)=>e+t.sections.reduce((e,t)=>e+t.items.length,0),0);return F`
      <div class="results-header">
        Found <strong>${t}</strong> result${1!==t?"s":""} for "<strong>${this.query}</strong>"
      </div>

      ${e.map(e=>this._renderSourceGroup(e))}
    `}_parseResults(){if(!this.results)return[];const e=this.results.navigation||this.results,t=e?.lists||[];if(0===t.length)return[];const i=new Map;for(const e of t){if(!e.items||0===e.items.length)continue;const{source:t,type:o}=this._parseListTitle(e.title||"");i.has(t)||i.set(t,new Map);const a=i.get(t);a.has(o)||a.set(o,[]),a.get(o).push(...e.items)}const o=[];for(const[e,t]of i){const i=[];for(const[e,o]of t)i.push({type:e,items:o});o.push({source:e,sections:i})}return o}_parseListTitle(e){if(!e)return{source:"Other",type:"Results"};const t=["QOBUZ","TIDAL","SPOTIFY","YOUTUBE","PANDORA"];for(const i of t)if(e.startsWith(i+" ")){const t=e.substring(i.length+1).trim();return{source:this._capitalizeSource(i),type:t||"Results"}}const i=e.match(/^Found\s+\d+\s+(\w+)/i);if(i){let e=i[1];return e.endsWith("s")||(e+="s"),{source:"Local",type:e}}return{source:"Other",type:e}}_capitalizeSource(e){return e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()}_renderSourceGroup(e){const t=e.source,i=e.sections.reduce((e,t)=>e+t.items.length,0),o=!1===this._expandedSections[t];return F`
      <div class="source-group">
        <div class="source-header" @click=${()=>this._toggleSection(t)}>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="source-title">${e.source}</span>
            <span class="source-count">${i}</span>
          </div>
          <ha-icon
            class="collapse-icon ${o?"collapsed":""}"
            icon="mdi:chevron-down"
          ></ha-icon>
        </div>
        ${o?"":e.sections.map(e=>this._renderTypeSection(e,t))}
      </div>
    `}_renderTypeSection(e,t){const i=`${t}:${e.type}`,o=!0===this._expandedSections[i],a=e.type.toLowerCase(),r=a.includes("album"),s=a.includes("track")||a.includes("song"),n=a.includes("artist");let l;l=r?4:s||n?3:4;const c=o?e.items:e.items.slice(0,l),d=e.items.length>l&&!o;return F`
      <div class="type-section">
        <div class="type-title">${e.type}</div>

        ${n?this._renderArtistItems(c):s?this._renderTrackItems(c):this._renderGridItems(c,r?"album":null)}

        ${d?F`
          <button class="show-all-btn" @click=${()=>this._expandSection(i)}>
            Show all ${e.items.length} →
          </button>
        `:""}
      </div>
    `}_renderGridItems(e,t){return F`
      <div class="items-grid">
        ${e.map(e=>{const i=be(e.albumart||e.icon,this.volumioUrl);return F`
            <volumio-album-card
              title="${e.title||e.name||""}"
              artist="${e.artist||""}"
              albumart="${i}"
              uri="${e.uri||""}"
              type="${t||e.type||"album"}"
              service="${e.service||""}"
              @volumio-card-click=${this._onCardClick}
              @volumio-card-play=${this._onCardPlay}
            ></volumio-album-card>
          `})}
      </div>
    `}_renderTrackItems(e){return F`
      <div class="items-list">
        ${e.map((e,t)=>{const i=be(e.albumart||e.icon,this.volumioUrl);return F`
            <volumio-track-card
              .index=${t+1}
              title="${e.title||e.name||""}"
              artist="${e.artist||""}"
              album="${e.album||""}"
              .duration=${e.duration||0}
              uri="${e.uri||""}"
              albumart="${i}"
              service="${e.service||""}"
              type="${e.type||"song"}"
              ?is-playing=${this.currentUri&&e.uri===this.currentUri}
              @volumio-track-click=${this._onTrackClick}
            ></volumio-track-card>
          `})}
      </div>
    `}_renderArtistItems(e){return F`
      <div style="display: flex; flex-wrap: wrap;">
        ${e.map(e=>F`
          <span
            class="artist-link"
            @click=${()=>this._onArtistClick(e)}
          >
            <ha-icon icon="mdi:account-music"></ha-icon>
            ${e.title||e.name||"Unknown"}
          </span>
        `)}
      </div>
    `}_renderSkeleton(){return F`
      <div class="skeleton-results" aria-busy="true" aria-label="Searching">
        <div class="skeleton-section-title"></div>
        <div class="skeleton-grid">
          ${Array(4).fill(0).map(()=>F`<div class="skeleton-card"></div>`)}
        </div>
        <div class="skeleton-section-title"></div>
        ${Array(3).fill(0).map(()=>F`<div class="skeleton-row"></div>`)}
      </div>
    `}_toggleSection(e){this._expandedSections={...this._expandedSections,[e]:!1===this._expandedSections[e]&&void 0}}_expandSection(e){this._expandedSections={...this._expandedSections,[e]:!0}}_onCardClick(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-card-click",{detail:e.detail,bubbles:!0,composed:!0}))}_onCardPlay(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-card-play",{detail:e.detail,bubbles:!0,composed:!0}))}_onTrackClick(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-track-click",{detail:e.detail,bubbles:!0,composed:!0}))}_onArtistClick(e){this.dispatchEvent(new CustomEvent("volumio-card-click",{detail:{uri:e.uri||"",title:e.title||e.name||"",artist:e.title||e.name||"",albumart:e.albumart||"",type:"artist",service:e.service||""},bubbles:!0,composed:!0}))}});customElements.define("volumio-breadcrumb-bar",class extends se{static get properties(){return{trail:{type:Array}}}static get styles(){return r`
      :host {
        display: block;
      }

      .breadcrumb {
        display: flex;
        align-items: center;
        height: var(--volumio-breadcrumb-height, 32px);
        padding: 0 var(--volumio-space-md, 16px);
        background: var(--card-background-color, #1e1e1e);
        border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        font-size: 13px;
        color: var(--secondary-text-color);
        gap: 2px;
        overflow: hidden;
      }

      .segment {
        cursor: pointer;
        color: var(--secondary-text-color);
        white-space: nowrap;
        padding: 2px 4px;
        border-radius: 4px;
        transition: color 0.15s, background 0.15s;
      }

      .segment:hover {
        color: var(--primary-text-color);
        background: var(--divider-color, rgba(255, 255, 255, 0.06));
      }

      .segment.current {
        color: var(--primary-text-color);
        font-weight: 600;
        cursor: default;
      }

      .segment.current:hover {
        background: none;
      }

      .sep {
        color: var(--secondary-text-color);
        opacity: 0.4;
        flex-shrink: 0;
        display: flex;
        align-items: center;
      }

      .sep ha-icon {
        --mdc-icon-size: 14px;
      }

      .ellipsis {
        color: var(--secondary-text-color);
        opacity: 0.5;
        padding: 0 2px;
      }
    `}constructor(){super(),this.trail=[]}render(){if(!this.trail||0===this.trail.length)return F``;const e=this._getDisplaySegments();return F`
      <div class="breadcrumb">
        ${e.map((t,i)=>{const o=i===e.length-1;return F`
            ${i>0?F`<span class="sep"><ha-icon icon="mdi:chevron-right"></ha-icon></span>`:""}
            ${t.ellipsis?F`<span class="ellipsis">...</span>`:F`
                <span
                  class="segment ${o?"current":""}"
                  @click=${()=>!o&&this._onClick(t.index)}
                  title="${t.title}"
                >${t.title}</span>
              `}
          `})}
      </div>
    `}_getDisplaySegments(){const e=this.trail;return e.length<=5?e.map((e,t)=>({...e,index:t})):[{...e[0],index:0},{ellipsis:!0},...e.slice(-3).map((t,i)=>({...t,index:e.length-3+i}))]}_onClick(e){const t=this.trail[e];t&&this.dispatchEvent(new CustomEvent("volumio-breadcrumb-click",{detail:{index:e,uri:t.uri,title:t.title},bubbles:!0,composed:!0}))}}),console.info("[volumio-panel] Build T18-fix10 loaded at",(new Date).toISOString());const $e={mpd:"Local",qobuz:"Qobuz",tidal:"TIDAL",spotify:"Spotify",spop:"Spotify",webradio:"Radio",pandora:"Pandora",youtube:"YouTube",youtube2:"YouTube",ytmusic:"YouTube Music"};function ke(e){return e?$e[e]||e.charAt(0).toUpperCase()+e.slice(1):""}customElements.define("volumio-panel",class extends se{static get properties(){return{hass:{type:Object},narrow:{type:Boolean},route:{type:Object},panel:{type:Object},_entityId:{type:String,state:!0},_configEntryId:{type:String,state:!0},_queue:{type:Array,state:!0},_queueUnsub:{state:!0},_activeView:{type:String,state:!0},_navMode:{type:String,state:!0},_showQueue:{type:Boolean,state:!0},_showNavFlyout:{type:Boolean,state:!0},_sensorBase:{type:String,state:!0},_isFavorite:{type:Boolean,state:!0},_browseStack:{type:Array,state:!0},_browseItems:{type:Array,state:!0},_browseLoading:{type:Boolean,state:!0},_browseContext:{type:Object,state:!0},_searchResults:{type:Object,state:!0},_searchLoading:{type:Boolean,state:!0},_searchQuery:{type:String,state:!0},_searchTrail:{type:Array,state:!0},_browseSources:{type:Array,state:!0},_activeSourceUri:{type:String,state:!0}}}static get styles(){return[le,r`
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
          overflow-y: auto;
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

        /* ── Queue panel ─────────────────────────── */
        .queue-panel {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .queue-header {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
          gap: 8px;
          flex-shrink: 0;
        }

        .queue-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--primary-text-color);
        }

        .queue-count {
          font-size: 12px;
          color: var(--secondary-text-color);
          flex: 1;
        }

        .queue-clear-btn {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--secondary-text-color);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        .queue-clear-btn:hover {
          background: var(--divider-color, rgba(255, 255, 255, 0.08));
          color: var(--primary-text-color);
        }

        .queue-clear-btn ha-icon {
          --mdc-icon-size: 18px;
        }

        .queue-list {
          overflow-y: auto;
          flex: 1;
        }

        .queue-empty {
          padding: 32px 16px;
          text-align: center;
          color: var(--secondary-text-color);
          font-size: 14px;
        }

        .queue-item {
          display: flex;
          align-items: center;
          padding: 6px 16px;
          gap: 10px;
          cursor: pointer;
          transition: background 0.1s;
        }

        .queue-item:hover {
          background: var(--divider-color, rgba(255, 255, 255, 0.06));
        }

        .queue-item.playing {
          border-left: 3px solid var(--primary-color, #03a9f4);
        }

        .queue-item.playing .qi-title {
          color: var(--primary-color, #03a9f4);
        }

        .qi-art {
          width: 40px;
          height: 40px;
          border-radius: 4px;
          overflow: hidden;
          flex-shrink: 0;
          background: var(--card-background-color, #2a2a2a);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qi-art img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .qi-art ha-icon {
          --mdc-icon-size: 18px;
          color: var(--secondary-text-color);
          opacity: 0.4;
        }

        .qi-info {
          flex: 1;
          min-width: 0;
        }

        .qi-title {
          font-size: 13px;
          font-weight: 500;
          color: var(--primary-text-color);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .qi-artist {
          font-size: 12px;
          color: var(--secondary-text-color);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .qi-eq {
          --mdc-icon-size: 16px;
          color: var(--primary-color, #03a9f4);
          flex-shrink: 0;
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
      `]}constructor(){super(),this._entityId=null,this._configEntryId=null,this._queue=[],this._queueUnsub=null,this._activeView="now-playing",this._navMode="collapsed",this._showQueue=!1,this._showNavFlyout=!1,this._sensorBase=null,this._isFavorite=!1,this._favoritesCache=[],this._lastUri=null,this._keyHandler=this._onKeyDown.bind(this),this._browseStack=[],this._browseItems=[],this._browseLoading=!1,this._browseContext=null,this._searchResults=null,this._searchLoading=!1,this._searchQuery="",this._searchTrail=[],this._browseSources=[],this._activeSourceUri=""}connectedCallback(){super.connectedCallback(),this._applyBreakpoint(),window.addEventListener("resize",this._onResize),window.addEventListener("keydown",this._keyHandler)}disconnectedCallback(){super.disconnectedCallback(),this._unsubscribeQueue(),window.removeEventListener("resize",this._onResize),window.removeEventListener("keydown",this._keyHandler)}_onResize=()=>{this._applyBreakpoint()};_applyBreakpoint(){const e=window.innerWidth;e>=1400?(this._navMode="pinned",this._showQueue=!0):e>=1024?this._navMode="collapsed":(this._navMode="hidden",this._showQueue=!1)}updated(e){if(e.has("_activeView")&&console.debug("[volumio-panel] View changed:",this._activeView,"searchTrail:",this._searchTrail,"searchQuery:",this._searchQuery),e.has("hass")&&this.hass){this._resolveIds(),this._queueUnsub||this._subscribeQueue(),this._configEntryId&&0===this._browseSources.length&&this._fetchBrowseSources();const e=this._getEntity(),t=e?.attributes?.uri??null;t!==this._lastUri&&(this._lastUri=t,t&&this._configEntryId?this._checkFavorite():this._isFavorite=!1)}}_resolveIds(){if(!this._entityId||!this._configEntryId){if(!this._entityId){let e=Object.keys(this.hass.states).find(e=>e.startsWith("media_player.")&&!0===this.hass.states[e].attributes?.volumio_ws);e||(e=Object.keys(this.hass.states).find(e=>e.startsWith("media_player.")&&e.includes("volumio"))),e&&(this._entityId=e,this._sensorBase=e.replace("media_player.",""))}!this._configEntryId&&this.panel?.config?.config_entry_id&&(this._configEntryId=this.panel.config.config_entry_id)}}async _subscribeQueue(){if(!this._queueUnsub&&this.hass){try{this._queueUnsub=await this.hass.connection.subscribeMessage(e=>{e.queue&&(console.debug("[volumio-panel] Queue push received:",e.queue.length,"items"),this._queue=e.queue)},{type:"volumio_ws/subscribe_queue"}),console.debug("[volumio-panel] Queue subscription active")}catch(e){console.warn("[volumio-panel] Queue subscription failed:",e)}if(this._configEntryId)try{const e=await this.hass.connection.sendMessagePromise({type:"call_service",domain:"volumio_ws",service:"queue_get",service_data:{config_entry_id:this._configEntryId},return_response:!0});e?.response?.queue&&(console.debug("[volumio-panel] Queue fetched via service:",e.response.queue.length,"items"),this._queue=e.response.queue)}catch(e){console.debug("[volumio-panel] queue_get fallback failed (non-fatal):",e.message)}}}_unsubscribeQueue(){this._queueUnsub&&("function"==typeof this._queueUnsub&&this._queueUnsub(),this._queueUnsub=null)}async _callService(e,t={}){return await this.hass.connection.sendMessagePromise({type:"call_service",domain:"volumio_ws",service:e,service_data:{config_entry_id:this._configEntryId,...t},return_response:!0})}async _callMediaPlayerService(e,t={}){return await this.hass.callService("media_player",e,{entity_id:this._entityId,...t})}_getEntity(){return this._entityId?this.hass?.states[this._entityId]:null}_getSensorValue(e){const t={trackType:"track_type",samplerate:"sample_rate",bitdepth:"bit_depth",channels:"channels"}[e];if(!t||!this._sensorBase)return null;const i=`sensor.${this._sensorBase}_${t}`,o=this.hass?.states[i];return"unknown"!==o?.state&&"unavailable"!==o?.state?o?.state:null}_getQualityInfo(){const e=this._getEntity();if(!e)return null;const t=e.attributes||{},i={trackType:this._getSensorValue("trackType"),samplerate:this._getSensorValue("samplerate"),bitdepth:this._getSensorValue("bitdepth"),bitrate:t.bitrate||null,isStream:"channel"===t.media_content_type},o=JSON.stringify(i);return this._lastQualityInputKey!==o&&(console.debug("[volumio-panel] Quality inputs:",i),this._lastQualityInputKey=o),he(i)}_isVolumeEnabled(){const e=this._getEntity();if(!e)return!1;const t=e.attributes?.supported_features||0,i=!!(4&t);return this._lastVolumeEnabled!==i&&(console.debug("[volumio-panel] Volume enabled:",i,"supported_features:",t,"& 4 =",4&t),this._lastVolumeEnabled=i),i}render(){const e=this._getEntity(),t=e?.attributes||{},i=e?.state||"unavailable",o=this._getQualityInfo(),a=be(t.entity_picture,""),r=this.panel?.config?.volumio_url||"",s=this._getNavSources();return F`
      <div class="shell">
        <volumio-top-bar
          active-view="${this._activeView}"
          .breadcrumb=${[]}
          ?narrow=${this.narrow}
          ?show-back-button=${this._browseStack.length>0||"album-detail"===this._activeView||"artist-detail"===this._activeView||!!this._searchQuery}
          @volumio-navigate=${this._onNavigate}
          @volumio-toggle-nav=${this._onToggleNav}
          @volumio-toggle-queue=${this._onToggleQueue}
          @volumio-back=${this._onBack}
          @volumio-search=${this._onSearch}
          @volumio-search-clear=${this._onSearchClear}
        ></volumio-top-bar>

        <div class="content-area">
          ${this._renderLeftZone(s)}

          <div class="center-zone">
            ${"browse"===this._activeView&&this._browseStack.length>0?F`
              <volumio-breadcrumb-bar
                .trail=${this._browseStack}
                @volumio-breadcrumb-click=${this._onBreadcrumbClick}
              ></volumio-breadcrumb-bar>
            `:""}
            ${this._searchTrail.length>0&&("album-detail"===this._activeView||"artist-detail"===this._activeView)?F`
              <volumio-breadcrumb-bar
                .trail=${this._searchTrail}
                @volumio-breadcrumb-click=${this._onSearchBreadcrumbClick}
              ></volumio-breadcrumb-bar>
            `:""}
            ${"album-detail"===this._activeView||"artist-detail"===this._activeView?this._renderCenterContent(e,t,i,o,a):this._searchQuery?this._renderSearchView(t,r):this._renderCenterContent(e,t,i,o,a)}
          </div>

          ${this._renderRightZone()}
        </div>

        <volumio-player-bar
          player-state="${i}"
          title="${t.media_title||""}"
          artist="${t.media_artist||""}"
          album-art="${a}"
          .duration=${t.media_duration||0}
          .position=${t.media_position||0}
          position-updated-at="${t.media_position_updated_at||""}"
          .volume=${null!=t.volume_level?Math.round(100*t.volume_level):0}
          ?muted=${t.is_volume_muted||!1}
          ?shuffle=${t.shuffle||!1}
          repeat="${t.repeat||"off"}"
          .quality=${o}
          source="${t.source||""}"
          .volumeEnabled=${this._isVolumeEnabled()}
          .isFavorite=${this._isFavorite}
          @volumio-command=${this._onCommand}
          @volumio-navigate=${this._onNavigate}
          @volumio-toggle-favorite=${this._onToggleFavorite}
        ></volumio-player-bar>
      </div>

      ${this._showNavFlyout?F`
        <div class="flyout-scrim" @click=${()=>this._showNavFlyout=!1}></div>
        <div class="flyout-panel left">
          <volumio-left-nav
            .sources=${s}
            mode="flyout"
            active-view="${this._activeView}"
            active-source="${this._activeSourceUri}"
            @volumio-navigate=${this._onNavigate}
            @volumio-nav-pin=${this._onNavPin}
          ></volumio-left-nav>
        </div>
      `:""}
    `}_renderLeftZone(e){return"hidden"===this._navMode?F``:F`
      <div class="left-zone ${this._navMode}">
        <volumio-left-nav
          .sources=${e}
          mode="${this._navMode}"
          active-view="${this._activeView}"
          active-source="${this._activeSourceUri}"
          @volumio-navigate=${this._onNavigate}
          @volumio-nav-pin=${this._onNavPin}
        ></volumio-left-nav>
      </div>
    `}_renderRightZone(){if(!this._showQueue)return F``;const e=this._getEntity(),t=(e?.attributes||{}).queue_position??-1,i=this.panel?.config?.volumio_url||"";return F`
      <div class="right-zone pinned">
        <div class="queue-panel">
          <div class="queue-header">
            <span class="queue-title">Queue</span>
            <span class="queue-count">${this._queue.length} track${1!==this._queue.length?"s":""}</span>
            <button class="queue-clear-btn" @click=${this._onQueueClear} title="Clear queue">
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </button>
          </div>
          <div class="queue-list">
            ${0===this._queue.length?F`<div class="queue-empty">Queue is empty</div>`:this._queue.map((e,o)=>F`
                <div
                  class="queue-item ${o===t?"playing":""}"
                  @click=${()=>this._onQueueItemClick(o)}
                >
                  <div class="qi-art">
                    ${e.albumart?F`<img src="${be(e.albumart,i)}" alt="" loading="lazy" />`:F`<ha-icon icon="mdi:music-note"></ha-icon>`}
                  </div>
                  <div class="qi-info">
                    <div class="qi-title">${e.name||e.title||"—"}</div>
                    <div class="qi-artist">${e.artist||""}</div>
                  </div>
                  ${o===t?F`<ha-icon class="qi-eq" icon="mdi:equalizer"></ha-icon>`:""}
                </div>
              `)}
          </div>
        </div>
      </div>
    `}_renderCenterContent(e,t,i,o,a){const r=this.panel?.config?.volumio_url||"";switch(this._activeView){case"now-playing":return F`
          <volumio-now-playing
            player-state="${i}"
            title="${t.media_title||""}"
            artist="${t.media_artist||""}"
            album="${t.media_album_name||""}"
            album-art="${a}"
            .quality=${o}
            source="${t.source||""}"
            .isFavorite=${this._isFavorite}
            @volumio-command=${this._onCommand}
            @volumio-navigate=${this._onNavigate}
            @volumio-toggle-favorite=${this._onToggleFavorite}
          ></volumio-now-playing>
        `;case"browse":return this._renderBrowseView(t,r);case"album-detail":return this._renderAlbumDetail(t,r);case"artist-detail":return this._renderArtistDetail(r);case"playlists":return this._renderPlaceholder("Playlists","mdi:playlist-music-outline","Your playlists — coming in T20");case"favorites":return this._renderPlaceholder("Favorites","mdi:heart","Your favorites — coming in T20");case"history":return this._renderPlaceholder("History","mdi:history","Recently played — coming in T20");case"settings":return this._renderPlaceholder("Settings","mdi:cog","Panel settings — coming in T20");default:return this._renderPlaceholder("","mdi:help-circle",`Unknown view: ${this._activeView}`)}}_renderBrowseView(e,t){return 0===this._browseStack.length?F`
        <volumio-browse-source-grid
          .sources=${this._browseSources}
          volumio-url="${t}"
          @volumio-source-select=${this._onSourceSelect}
        ></volumio-browse-source-grid>
      `:F`
      <volumio-browse-list
        .items=${this._browseItems}
        ?loading=${this._browseLoading}
        current-uri="${e.uri||""}"
        volumio-url="${t}"
        @volumio-item-click=${this._onBrowseItemClick}
        @volumio-item-play=${this._onBrowseItemPlay}
        @volumio-item-add-queue=${this._onAddItemToQueue}
        @volumio-card-add-queue=${this._onAddItemToQueue}
      ></volumio-browse-list>
    `}_renderAlbumDetail(e,t){const i=this._browseContext||{};return F`
      <volumio-album-detail
        album-title="${i.title||""}"
        album-artist="${i.artist||""}"
        album-art="${i.albumart||""}"
        album-uri="${i.uri||""}"
        album-service="${i.service||""}"
        .tracks=${this._browseItems}
        ?loading=${this._browseLoading}
        current-uri="${e.uri||""}"
        volumio-url="${t}"
        @volumio-track-click=${this._onTrackPlay}
        @volumio-track-add-queue=${this._onAddItemToQueue}
        @volumio-album-play=${this._onAlbumPlay}
        @volumio-album-add-queue=${this._onAlbumAddQueue}
        @volumio-navigate=${this._onNavigate}
      ></volumio-album-detail>
    `}_renderArtistDetail(e){const t=this._browseContext||{};return F`
      <volumio-artist-detail
        artist-name="${t.artist||t.title||""}"
        .items=${this._browseItems}
        ?loading=${this._browseLoading}
        volumio-url="${e}"
        @volumio-card-click=${this._onBrowseItemClick}
        @volumio-card-play=${this._onBrowseItemPlay}
        @volumio-card-add-queue=${this._onAddItemToQueue}
      ></volumio-artist-detail>
    `}_renderSearchView(e,t){return F`
      <volumio-search-results
        .results=${this._searchResults}
        ?loading=${this._searchLoading}
        query="${this._searchQuery}"
        volumio-url="${t}"
        current-uri="${e.uri||""}"
        @volumio-card-click=${this._onBrowseItemClick}
        @volumio-card-play=${this._onBrowseItemPlay}
        @volumio-card-add-queue=${this._onAddItemToQueue}
        @volumio-track-click=${this._onTrackPlay}
        @volumio-track-add-queue=${this._onAddItemToQueue}
      ></volumio-search-results>
    `}_renderPlaceholder(e,t,i){return F`
      <div class="placeholder-view">
        <ha-icon icon="${t}"></ha-icon>
        <div class="view-title">${e}</div>
        <div class="view-desc">${i}</div>
      </div>
    `}_onNavigate(e){const{view:t,source:i,sourceUri:o,artist:a,album:r,pluginName:s}=e.detail||{};if(t)switch(t){case"browse":this._activeView="browse",this._showNavFlyout=!1,this._searchTrail=[],this._searchQuery="",this._searchResults=null,o?(this._activeSourceUri=o||"",this._browseStack=[],this._browseTo(o,i||"Browse")):0===this._browseStack.length&&(this._activeSourceUri="",this._browseItems=[]);break;case"album-detail":this._activeView="album-detail",this._showNavFlyout=!1;break;case"artist-detail":if(this._activeView="artist-detail",this._showNavFlyout=!1,a){this._browseContext={artist:a,title:a};const e=`globalUriArtist/${encodeURIComponent(a)}`;this._browseToArtist(e,a)}break;default:this._activeView=t,this._showNavFlyout=!1,this._searchQuery="",this._searchResults=null,this._searchTrail=[]}}_onToggleNav(){"hidden"===this._navMode?this._showNavFlyout=!this._showNavFlyout:"collapsed"===this._navMode?this._navMode="pinned":this._navMode="collapsed"}_onNavPin(e){this._navMode=e.detail.pinned?"pinned":"collapsed",this._showNavFlyout=!1}_onToggleQueue(){this._showQueue=!this._showQueue}_onBack(){if(this._searchTrail.length>0&&("album-detail"===this._activeView||"artist-detail"===this._activeView))if(this._searchTrail.length>1){this._searchTrail=this._searchTrail.slice(0,-1);const e=this._searchTrail[this._searchTrail.length-1];"artist-detail"===e.view?(this._activeView="artist-detail",this._browseContext=e,this._browseToArtist(e.uri,e.title)):(this._activeView="browse",this._searchTrail=[])}else this._activeView="browse",this._searchTrail=[];else{if(this._searchQuery)return this._searchQuery="",this._searchResults=null,void(this._searchTrail=[]);if("album-detail"!==this._activeView&&"artist-detail"!==this._activeView)if(this._browseStack.length>1){this._browseStack=this._browseStack.slice(0,-1);const e=this._browseStack[this._browseStack.length-1];this._loadBrowseItems(e.uri)}else 1===this._browseStack.length?(this._browseStack=[],this._browseItems=[],this._activeSourceUri=""):"now-playing"!==this._activeView&&(this._activeView="now-playing");else this._activeView="browse"}}async _fetchBrowseSources(){if(this._configEntryId)try{const e=await this._callService("get_browse_sources",{}),t=e?.response?.sources||[];t.length>0&&(this._browseSources=t,console.debug("[volumio-panel] Browse sources loaded:",t.length,t.map(e=>`${e.name} → ${e.uri}`)))}catch(e){console.warn("[volumio-panel] get_browse_sources failed:",e.message)}}_getNavSources(){if(this._browseSources.length>0)return this._browseSources;const e=this._getEntity();return(e?.attributes?.source_list||[]).map(e=>({name:e,plugin_name:e.toLowerCase().replace(/\s+/g,""),plugin_type:"music_service",uri:"",albumart:""}))}async _browseTo(e,t){this._browseStack=[...this._browseStack,{uri:e,title:t}],await this._loadBrowseItems(e)}async _browseToArtist(e,t){this._browseLoading=!0;try{const t=await this._callService("browse",{uri:e}),i=(t?.response?.navigation||t?.navigation||{}).lists||[],o=[];for(const e of i)e.items&&o.push(...e.items);this._browseItems=o}catch(e){console.error("[volumio-panel] Artist browse failed:",e),this._browseItems=[]}this._browseLoading=!1}async _loadBrowseItems(e){if(this._configEntryId){this._browseLoading=!0,this._browseItems=[];try{const t=await this._callService("browse",{uri:e}),i=(t?.response?.navigation||t?.navigation||{}).lists||[],o=[];for(const e of i)e.items&&o.push(...e.items);this._browseItems=o,console.debug("[volumio-panel] Browse loaded:",e,o.length,"items"),o.length>0&&console.debug("[volumio-panel] First item keys:",Object.keys(o[0]),"data:",JSON.stringify(o[0]).substring(0,300))}catch(e){console.error("[volumio-panel] Browse failed:",e),this._browseItems=[]}this._browseLoading=!1}}_onSourceSelect(e){const{uri:t,name:i,plugin_name:o}=e.detail;this._activeSourceUri=t||"",this._browseStack=[],this._browseTo(t,i)}_onBrowseItemClick(e){const t=e.detail,i=t.type||"folder";console.debug("[volumio-panel] Item clicked:",i,t.title,t.uri);if(new Set(["song","track","webradio","mywebradio","cuesong"]).has(i))this._onTrackPlay(e);else{if("album"===i){if(this._searchQuery||this._searchTrail.length>0){const e=this._searchTrail.length>0?[...this._searchTrail]:[{title:`Search "${this._searchQuery}"`,uri:"__search__",view:"search"}];1===e.length&&t.service&&e.push({title:ke(t.service),uri:"__source__",view:"source"}),e.push({title:t.title,uri:t.uri,view:"album-detail",service:t.service||""}),this._searchTrail=e}return console.debug("[volumio-panel] Album detail: searchTrail=",this._searchTrail),this._browseContext={title:t.title,artist:t.artist||"",albumart:t.albumart||"",uri:t.uri,service:t.service||""},this._activeView="album-detail",void this._loadBrowseItems(t.uri)}if("artist"===i){if(this._searchQuery||this._searchTrail.length>0){const e=this._searchTrail.length>0?[...this._searchTrail]:[{title:`Search "${this._searchQuery}"`,uri:"__search__",view:"search"}];1===e.length&&t.service&&e.push({title:ke(t.service),uri:"__source__",view:"source"}),e.push({title:t.title,uri:t.uri,view:"artist-detail",service:t.service||""}),this._searchTrail=e}return this._browseContext={title:t.title,artist:t.title||"",uri:t.uri,service:t.service||""},this._activeView="artist-detail",void this._browseToArtist(t.uri,t.title)}0===this._searchTrail.length&&(this._searchQuery="",this._searchResults=null),this._browseTo(t.uri,t.title||"Browse")}}async _onBrowseItemPlay(e){const t=e.detail;try{await this._callService("queue_clear",{}),await this._callService("queue_add",{uri:t.uri,title:t.title||"",service:t.service||"",artist:t.artist||"",albumart:t.albumart||""}),await this._callService("queue_play_index",{index:0}),console.debug("[volumio-panel] Playing:",t.title)}catch(e){console.error("[volumio-panel] Play failed:",e)}}async _onTrackPlay(e){const t=e.detail;try{await this._callService("queue_clear",{}),await this._callService("queue_add",{uri:t.uri,title:t.title||"",service:t.service||"",artist:t.artist||"",album:t.album||"",albumart:t.albumart||""}),await this._callService("queue_play_index",{index:0}),console.debug("[volumio-panel] Playing track:",t.title)}catch(e){console.error("[volumio-panel] Track play failed:",e)}}async _onAlbumPlay(e){const{uri:t}=e.detail;try{await this.hass.callService("media_player","play_media",{entity_id:this._entityId,media_content_id:t,media_content_type:"music"}),console.debug("[volumio-panel] Playing album:",t)}catch(e){console.error("[volumio-panel] Album play failed:",e)}}async _onAlbumAddQueue(e){const{uri:t}=e.detail;try{await this._callService("queue_add",{uri:t}),console.debug("[volumio-panel] Added album to queue:",t)}catch(e){console.error("[volumio-panel] Album queue add failed:",e)}}async _onQueueItemClick(e){try{await this._callService("queue_play_index",{index:e}),console.debug("[volumio-panel] Playing queue index:",e)}catch(e){console.error("[volumio-panel] Queue play index failed:",e)}}async _onQueueClear(){try{await this._callService("queue_clear",{}),console.debug("[volumio-panel] Queue cleared")}catch(e){console.error("[volumio-panel] Queue clear failed:",e)}}async _onAddItemToQueue(e){const t=e.detail;try{await this._callService("queue_add",{uri:t.uri,title:t.title||"",service:t.service||"",artist:t.artist||"",album:t.album||"",albumart:t.albumart||""}),console.debug("[volumio-panel] Added to queue:",t.title)}catch(e){console.error("[volumio-panel] Add to queue failed:",e)}}_onBreadcrumbClick(e){const{index:t}=e.detail;this._browseStack=this._browseStack.slice(0,t+1);const i=this._browseStack[this._browseStack.length-1];"browse"!==this._activeView&&(this._activeView="browse"),this._loadBrowseItems(i.uri)}async _onSearch(e){const{query:t}=e.detail;if(t&&!(t.length<2)&&this._configEntryId){this._searchQuery=t,this._searchLoading=!0,this._searchResults=null,this._searchTrail=[],"album-detail"!==this._activeView&&"artist-detail"!==this._activeView||(this._activeView="browse");try{const e=await this._callService("search",{query:t});this._searchResults=e?.response||e||null,console.debug("[volumio-panel] Search results:",t,this._searchResults)}catch(e){console.error("[volumio-panel] Search failed:",e),this._searchResults=null}this._searchLoading=!1}}_onSearchClear(){this._searchQuery="",this._searchResults=null,this._searchLoading=!1,this._searchTrail=[]}_onSearchBreadcrumbClick(e){const{index:t}=e.detail,i=this._searchTrail[t];i&&("search"===i.view||0===t?(this._activeView="browse",this._searchTrail=[]):"artist-detail"===i.view?(this._searchTrail=this._searchTrail.slice(0,t+1),this._browseContext={title:i.title,artist:i.title,uri:i.uri,service:i.service||""},this._activeView="artist-detail",this._browseToArtist(i.uri,i.title)):"album-detail"===i.view&&(this._searchTrail=this._searchTrail.slice(0,t+1),this._activeView="album-detail",this._loadBrowseItems(i.uri)))}async _onCommand(e){const{command:t,value:i}=e.detail,o=this._getEntity();if(o&&this._entityId)try{switch(t){case"play_pause":"playing"===o.state?await this._callMediaPlayerService("media_pause"):await this._callMediaPlayerService("media_play");break;case"next":await this._callMediaPlayerService("media_next_track");break;case"prev":await this._callMediaPlayerService("media_previous_track");break;case"seek":await this._callMediaPlayerService("media_seek",{seek_position:i});break;case"volume_set":this._isVolumeEnabled()?await this._callMediaPlayerService("set_volume_level",{volume_level:i/100}):console.debug("[volumio-panel] Volume set ignored — volume control disabled");break;case"mute_toggle":this._isVolumeEnabled()?await this._callMediaPlayerService("volume_mute",{is_volume_muted:!o.attributes?.is_volume_muted}):console.debug("[volumio-panel] Mute ignored — volume control disabled");break;case"shuffle_set":await this._callMediaPlayerService("shuffle_set",{shuffle:i});break;case"repeat_set":await this._callMediaPlayerService("repeat_set",{repeat:i});break;default:console.warn("[volumio-panel] Unknown command:",t)}}catch(e){console.error("[volumio-panel] Command failed:",t,e)}}async _checkFavorite(){if(this.hass&&this._configEntryId)try{const e=await this.hass.connection.sendMessagePromise({type:"call_service",domain:"volumio_ws",service:"favorites_list",service_data:{config_entry_id:this._configEntryId},return_response:!0}),t=e?.response?.items||[];this._favoritesCache=t;const i=this._getEntity(),o=i?.attributes?.uri;this._isFavorite=!(!o||!t.some(e=>e?.uri===o))}catch(e){console.error("[volumio-panel] favorites_list failed:",e)}}async _onToggleFavorite(){const e=this._getEntity();if(!e||!this._configEntryId)return;const t=e.attributes||{},i=t.uri;if(!i)return;const o=this._isFavorite;this._isFavorite=!o,console.debug("[volumio-panel] Toggle favorite:",{wasFavorite:o,uri:i,title:t.media_title,service:t.source,configEntryId:this._configEntryId});try{o?await this._callService("favorites_remove",{uri:i,service:t.source||""}):await this._callService("favorites_add",{uri:i,title:t.media_title||"",service:t.source||""}),console.debug("[volumio-panel] Favorite service call completed"),setTimeout(()=>this._checkFavorite(),500)}catch(e){console.error("[volumio-panel] Favorite toggle failed:",e),this._isFavorite=o}}_onKeyDown(e){if("INPUT"===e.target.tagName||"TEXTAREA"===e.target.tagName)return;if(!this.isConnected)return;const t=this._getEntity();if(t)switch(e.key){case" ":e.preventDefault(),this._onCommand({detail:{command:"play_pause"}});break;case"ArrowRight":if(e.shiftKey)e.preventDefault(),this._onCommand({detail:{command:"next"}});else{e.preventDefault();const i=(t.attributes?.media_position||0)+10;this._onCommand({detail:{command:"seek",value:i}})}break;case"ArrowLeft":if(e.shiftKey)e.preventDefault(),this._onCommand({detail:{command:"prev"}});else{e.preventDefault();const i=Math.max(0,(t.attributes?.media_position||0)-10);this._onCommand({detail:{command:"seek",value:i}})}break;case"ArrowUp":e.preventDefault();{const e=Math.min(100,Math.round(100*(t.attributes?.volume_level||0))+2);this._onCommand({detail:{command:"volume_set",value:e}})}break;case"ArrowDown":e.preventDefault();{const e=Math.max(0,Math.round(100*(t.attributes?.volume_level||0))-2);this._onCommand({detail:{command:"volume_set",value:e}})}break;case"m":case"M":this._onCommand({detail:{command:"mute_toggle"}});break;case"s":case"S":this._onCommand({detail:{command:"shuffle_set",value:!t.attributes?.shuffle}});break;case"r":case"R":{const e=t.attributes?.repeat||"off",i="off"===e?"all":"all"===e?"one":"off";this._onCommand({detail:{command:"repeat_set",value:i}})}break;case"/":e.preventDefault(),this.shadowRoot?.querySelector("volumio-top-bar")?.shadowRoot?.querySelector(".search-field input")?.focus();break;case"Escape":this._searchQuery&&this._onSearchClear(),this._showNavFlyout=!1}}});
