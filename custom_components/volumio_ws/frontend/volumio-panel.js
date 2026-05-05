const e=globalThis,t=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),a=new WeakMap;let o=class{constructor(e,t,a){if(this._$cssResult$=!0,a!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const i=this.t;if(t&&void 0===e){const t=void 0!==i&&1===i.length;t&&(e=a.get(i)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t&&a.set(i,e))}return e}toString(){return this.cssText}};const s=(e,...t)=>{const a=1===e.length?e[0]:t.reduce((t,i,a)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[a+1],e[0]);return new o(a,e,i)},r=t?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,i))(t)})(e):e,{is:n,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:u,getPrototypeOf:h}=Object,p=globalThis,m=p.trustedTypes,v=m?m.emptyScript:"",b=p.reactiveElementPolyfillSupport,g=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?v:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},_=(e,t)=>!n(e,t),x={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:_};Symbol.metadata??=Symbol("metadata"),p.litPropertyMetadata??=new WeakMap;let f=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=x){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),a=this.getPropertyDescriptor(e,i,t);void 0!==a&&l(this.prototype,e,a)}}static getPropertyDescriptor(e,t,i){const{get:a,set:o}=c(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:a,set(t){const s=a?.call(this);o?.call(this,t),this.requestUpdate(e,s,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??x}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const e=h(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const e=this.properties,t=[...d(e),...u(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(r(e))}else void 0!==e&&t.push(r(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,a)=>{if(t)i.adoptedStyleSheets=a.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const t of a){const a=document.createElement("style"),o=e.litNonce;void 0!==o&&a.setAttribute("nonce",o),a.textContent=t.cssText,i.appendChild(a)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),a=this.constructor._$Eu(e,i);if(void 0!==a&&!0===i.reflect){const o=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(t,i.type);this._$Em=e,null==o?this.removeAttribute(a):this.setAttribute(a,o),this._$Em=null}}_$AK(e,t){const i=this.constructor,a=i._$Eh.get(e);if(void 0!==a&&this._$Em!==a){const e=i.getPropertyOptions(a),o="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=a;const s=o.fromAttribute(t,e.type);this[a]=s??this._$Ej?.get(a)??s,this._$Em=null}}requestUpdate(e,t,i,a=!1,o){if(void 0!==e){const s=this.constructor;if(!1===a&&(o=this[e]),i??=s.getPropertyOptions(e),!((i.hasChanged??_)(o,t)||i.useDefault&&i.reflect&&o===this._$Ej?.get(e)&&!this.hasAttribute(s._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:a,wrapped:o},s){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,s??t??this[e]),!0!==o||void 0!==s)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===a&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,a=this[t];!0!==e||this._$AL.has(t)||void 0===a||this.C(t,void 0,i,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[g("elementProperties")]=new Map,f[g("finalized")]=new Map,b?.({ReactiveElement:f}),(p.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,$=e=>e,k=w.trustedTypes,S=k?k.createPolicy("lit-html",{createHTML:e=>e}):void 0,A="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,q="?"+C,E=`<${q}>`,T=document,z=()=>T.createComment(""),P=e=>null===e||"object"!=typeof e&&"function"!=typeof e,I=Array.isArray,U="[ \t\n\f\r]",M=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,L=/>/g,B=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),R=/'/g,Q=/"/g,O=/^(?:script|style|textarea|title)$/i,V=(e=>(t,...i)=>({_$litType$:e,strings:t,values:i}))(1),D=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),F=new WeakMap,H=T.createTreeWalker(T,129);function Y(e,t){if(!I(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(t):t}const G=(e,t)=>{const i=e.length-1,a=[];let o,s=2===t?"<svg>":3===t?"<math>":"",r=M;for(let t=0;t<i;t++){const i=e[t];let n,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===M?"!--"===l[1]?r=N:void 0!==l[1]?r=L:void 0!==l[2]?(O.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=B):void 0!==l[3]&&(r=B):r===B?">"===l[0]?(r=o??M,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,n=l[1],r=void 0===l[3]?B:'"'===l[3]?Q:R):r===Q||r===R?r=B:r===N||r===L?r=M:(r=B,o=void 0);const u=r===B&&e[t+1].startsWith("/>")?" ":"";s+=r===M?i+E:c>=0?(a.push(n),i.slice(0,c)+A+i.slice(c)+C+u):i+C+(-2===c?t:u)}return[Y(e,s+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),a]};class K{constructor({strings:e,_$litType$:t},i){let a;this.parts=[];let o=0,s=0;const r=e.length-1,n=this.parts,[l,c]=G(e,t);if(this.el=K.createElement(l,i),H.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(a=H.nextNode())&&n.length<r;){if(1===a.nodeType){if(a.hasAttributes())for(const e of a.getAttributeNames())if(e.endsWith(A)){const t=c[s++],i=a.getAttribute(e).split(C),r=/([.?@])?(.*)/.exec(t);n.push({type:1,index:o,name:r[2],strings:i,ctor:"."===r[1]?ee:"?"===r[1]?te:"@"===r[1]?ie:J}),a.removeAttribute(e)}else e.startsWith(C)&&(n.push({type:6,index:o}),a.removeAttribute(e));if(O.test(a.tagName)){const e=a.textContent.split(C),t=e.length-1;if(t>0){a.textContent=k?k.emptyScript:"";for(let i=0;i<t;i++)a.append(e[i],z()),H.nextNode(),n.push({type:2,index:++o});a.append(e[t],z())}}}else if(8===a.nodeType)if(a.data===q)n.push({type:2,index:o});else{let e=-1;for(;-1!==(e=a.data.indexOf(C,e+1));)n.push({type:7,index:o}),e+=C.length-1}o++}}static createElement(e,t){const i=T.createElement("template");return i.innerHTML=e,i}}function W(e,t,i=e,a){if(t===D)return t;let o=void 0!==a?i._$Co?.[a]:i._$Cl;const s=P(t)?void 0:t._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),void 0===s?o=void 0:(o=new s(e),o._$AT(e,i,a)),void 0!==a?(i._$Co??=[])[a]=o:i._$Cl=o),void 0!==o&&(t=W(e,o._$AS(e,t.values),o,a)),t}class X{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,a=(e?.creationScope??T).importNode(t,!0);H.currentNode=a;let o=H.nextNode(),s=0,r=0,n=i[0];for(;void 0!==n;){if(s===n.index){let t;2===n.type?t=new Z(o,o.nextSibling,this,e):1===n.type?t=new n.ctor(o,n.name,n.strings,this,e):6===n.type&&(t=new ae(o,this,e)),this._$AV.push(t),n=i[++r]}s!==n?.index&&(o=H.nextNode(),s++)}return H.currentNode=T,a}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,a){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=W(this,e,t),P(e)?e===j||null==e||""===e?(this._$AH!==j&&this._$AR(),this._$AH=j):e!==this._$AH&&e!==D&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>I(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==j&&P(this._$AH)?this._$AA.nextSibling.data=e:this.T(T.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,a="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=K.createElement(Y(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(t);else{const e=new X(a,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=F.get(e.strings);return void 0===t&&F.set(e.strings,t=new K(e)),t}k(e){I(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,a=0;for(const o of e)a===t.length?t.push(i=new Z(this.O(z()),this.O(z()),this,this.options)):i=t[a],i._$AI(o),a++;a<t.length&&(this._$AR(i&&i._$AB.nextSibling,a),t.length=a)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=$(e).nextSibling;$(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class J{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,a,o){this.type=1,this._$AH=j,this._$AN=void 0,this.element=e,this.name=t,this._$AM=a,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}_$AI(e,t=this,i,a){const o=this.strings;let s=!1;if(void 0===o)e=W(this,e,t,0),s=!P(e)||e!==this._$AH&&e!==D,s&&(this._$AH=e);else{const a=e;let r,n;for(e=o[0],r=0;r<o.length-1;r++)n=W(this,a[i+r],t,r),n===D&&(n=this._$AH[r]),s||=!P(n)||n!==this._$AH[r],n===j?e=j:e!==j&&(e+=(n??"")+o[r+1]),this._$AH[r]=n}s&&!a&&this.j(e)}j(e){e===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ee extends J{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===j?void 0:e}}class te extends J{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==j)}}class ie extends J{constructor(e,t,i,a,o){super(e,t,i,a,o),this.type=5}_$AI(e,t=this){if((e=W(this,e,t,0)??j)===D)return;const i=this._$AH,a=e===j&&i!==j||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,o=e!==j&&(i===j||a);a&&this.element.removeEventListener(this.name,this,i),o&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class ae{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){W(this,e)}}const oe=w.litHtmlPolyfillSupport;oe?.(K,Z),(w.litHtmlVersions??=[]).push("3.3.2");const se=globalThis;class re extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const a=i?.renderBefore??t;let o=a._$litPart$;if(void 0===o){const e=i?.renderBefore??null;a._$litPart$=o=new Z(t.insertBefore(z(),e),e,void 0,i??{})}return o._$AI(e),o})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return D}}re._$litElement$=!0,re.finalized=!0,se.litElementHydrateSupport?.({LitElement:re});const ne=se.litElementPolyfillSupport;ne?.({LitElement:re}),(se.litElementVersions??=[]).push("4.2.2");const le=s`
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
`,ce=new Set(["flac","alac","wav","aiff","ape","wv","wavpack","dsf","dff","dsd"]),de=new Set(["mp3","ogg","aac","opus","vorbis","wma","m4a"]),ue=new Set(["qobuz","tidal","spotify","spop","pandora","youtube","youtube2","webradio","mpd","upnp","airplay","snapcast","bluetooth"]);function he({trackType:e,samplerate:t,bitdepth:i,bitrate:a,isStream:o}){const s=(r=e)?String(r).trim().toLowerCase().replace(/\s+/g,""):"";var r;const n=function(e){if(null==e)return null;if("number"==typeof e)return e;const t=String(e).trim().toLowerCase().match(/([\d.]+)/);if(!t)return null;const i=parseFloat(t[1]);return i>1e3?i/1e3:i}(t),l=function(e){if(null==e)return null;if("number"==typeof e)return e;const t=String(e).trim().match(/(\d+)/);return t?parseInt(t[1],10):null}(i),c=function(e){if(null==e)return null;if("number"==typeof e)return e;const t=String(e).trim().match(/([\d.]+)/);return t?parseFloat(t[1]):null}(a),d=ue.has(s)?"":s,u=ce.has(d),h=de.has(d);if(o){return pe("stream",d?`${d.toUpperCase()}${c?` ${Math.round(c)}`:""}`:"STREAM","STREAM","var(--volumio-quality-stream)","var(--volumio-quality-stream-bg, rgba(66, 165, 245, 0.12))")}if(u&&(null!=l&&l>16||null!=n&&n>44.1))return pe("hires",me(d,l,n),"HI-RES","var(--volumio-quality-hires)","var(--volumio-quality-hires-bg, rgba(212, 160, 23, 0.12))");if(u)return pe("lossless",me(d,l,n),"LOSSLESS","var(--volumio-quality-lossless)","var(--volumio-quality-lossless-bg, rgba(0, 172, 193, 0.12))");if(!h&&(null!=l||null!=n)){if(null!=l&&l>16||null!=n&&n>44.1){return pe("hires",me(d||"HI-RES",l,n),"HI-RES","var(--volumio-quality-hires)","var(--volumio-quality-hires-bg, rgba(212, 160, 23, 0.12))")}return pe("lossless",me(d||"LOSSLESS",l,n),"LOSSLESS","var(--volumio-quality-lossless)","var(--volumio-quality-lossless-bg, rgba(0, 172, 193, 0.12))")}if(h){if(null!=c&&c<256)return pe("basic",`${d.toUpperCase()} ${Math.round(c)}`,"BASIC","var(--volumio-quality-basic, #616161)","rgba(97, 97, 97, 0.08)");return pe("high",d?`${d.toUpperCase()}${c?` ${Math.round(c)}`:""}`:"HIGH","HIGH","var(--volumio-quality-lossy)","var(--volumio-quality-lossy-bg, rgba(158, 158, 158, 0.08))")}return d&&null!=c?c<256?pe("basic",`${Math.round(c)} kbps`,"BASIC","var(--volumio-quality-basic, #616161)","rgba(97, 97, 97, 0.08)"):pe("high",`${Math.round(c)} kbps`,"HIGH","var(--volumio-quality-lossy)","var(--volumio-quality-lossy-bg, rgba(158, 158, 158, 0.08))"):pe("unknown","","","var(--secondary-text-color)","transparent")}function pe(e,t,i,a,o){return{tier:e,label:t,tierLabel:i,color:a,colorBg:o}}function me(e,t,i){const a=e.toUpperCase();return t&&i?`${a} ${t}/${i}`:t?`${a} ${t}-bit`:i?`${a} ${i}kHz`:a}function ve(e){if(!e||e<=0)return"0:00";const t=Math.floor(e),i=Math.floor(t/3600),a=Math.floor(t%3600/60),o=t%60;return i>0?`${i}:${a.toString().padStart(2,"0")}:${o.toString().padStart(2,"0")}`:`${a}:${o.toString().padStart(2,"0")}`}function be(e,t){return e?/^[a-z][a-z0-9+.-]*:/i.test(e)?/^https?:\/\//i.test(e)?e:"":t&&!/^https?:\/\//i.test(t)?"":t?`${t}${e}`:e:""}class ge{constructor(){this._hass=null,this._panel=null,this._entityId=null,this._configEntryId=null,this._sensorBase=null,this._queueUnsub=null,this._lastState=null,this._stateListeners=new Set,this._queueListeners=new Set}connect({hass:e,panel:t}){this._hass=e,this._panel=t,this._resolveIds(),this._subscribeQueue()}updateHass(e,t){this._hass=e,void 0!==t&&(this._panel=t),this._resolveIds();const i=this._normalize();if(function(e,t){if(!e||!t)return!0;const i=Object.keys(t).filter(e=>"_raw"!==e);return i.some(i=>e[i]!==t[i])}(this._lastState,i)){this._lastState=i;for(const e of this._stateListeners)try{e(i)}catch(e){console.error("[ha-adapter] State listener error:",e)}}}disconnect(){this._unsubscribeQueue(),this._stateListeners.clear(),this._queueListeners.clear()}getState(){return this._normalize()}getVolumioUrl(){return this._panel?.config?.volumio_url||""}getSensorValue(e){return this.getState()[e]||null}get ready(){return!(!this._entityId||!this._configEntryId)}get entityId(){return this._entityId}async call(e,t={}){if(!this._hass||!this._configEntryId)throw new Error(`Adapter not ready: call(${e})`);return await this._hass.connection.sendMessagePromise({type:"call_service",domain:"volumio_ws",service:e,service_data:{config_entry_id:this._configEntryId,...t},return_response:!0})}async play(){await this._mediaPlayerCall("media_play")}async pause(){await this._mediaPlayerCall("media_pause")}async playPause(){"playing"===this.getState().state?await this.pause():await this.play()}async stop(){await this._mediaPlayerCall("media_stop")}async next(){await this._mediaPlayerCall("media_next_track")}async prev(){await this._mediaPlayerCall("media_previous_track")}async seek(e){await this._mediaPlayerCall("media_seek",{seek_position:e})}async setVolume(e){this.getState().volumeEnabled&&await this._mediaPlayerCall("set_volume_level",{volume_level:e/100})}async mute(e){this.getState().volumeEnabled&&await this._mediaPlayerCall("volume_mute",{is_volume_muted:e})}async toggleMute(){const e=this.getState();await this.mute(!e.muted)}async setShuffle(e){await this._mediaPlayerCall("shuffle_set",{shuffle:e})}async setRepeat(e){await this._mediaPlayerCall("repeat_set",{repeat:e})}onQueueChange(e){this._queueListeners.add(e)}offQueueChange(e){this._queueListeners.delete(e)}onStateChange(e){this._stateListeners.add(e)}offStateChange(e){this._stateListeners.delete(e)}_normalize(){return function(e,t,i){if(!e)return{state:"unavailable",title:"",artist:"",album:"",albumArt:"",duration:0,position:0,positionUpdatedAt:"",volume:0,muted:!1,shuffle:!1,repeat:"off",source:"",uri:"",queuePosition:-1,volumeEnabled:!1,bitrate:null,_raw:{}};const a=e.attributes||{},o=a.supported_features||0,s={};if(t&&i){const e={trackType:"track_type",samplerate:"sample_rate",bitdepth:"bit_depth",channels:"channels"};for(const[a,o]of Object.entries(e)){const e=`sensor.${t}_${o}`,r=i.states?.[e];s[a]="unknown"!==r?.state&&"unavailable"!==r?.state?r.state:null}}return{state:e.state||"unavailable",title:a.media_title||"",artist:a.media_artist||"",album:a.media_album_name||"",albumArt:a.entity_picture||"",duration:a.media_duration||0,position:a.media_position||0,positionUpdatedAt:a.media_position_updated_at||"",volume:null!=a.volume_level?Math.round(100*a.volume_level):0,muted:a.is_volume_muted||!1,shuffle:a.shuffle||!1,repeat:a.repeat||"off",source:a.source||"",uri:a.uri||"",queuePosition:a.queue_position??-1,volumeEnabled:!!(4&o),bitrate:a.bitrate||null,trackType:s.trackType||null,samplerate:s.samplerate||null,bitdepth:s.bitdepth||null,channels:s.channels||null,_raw:a}}(this._entityId?this._hass?.states?.[this._entityId]:null,this._sensorBase,this._hass)}_resolveIds(){if(!this._entityId||!this._configEntryId){if(!this._entityId&&this._hass){let e=Object.keys(this._hass.states).find(e=>e.startsWith("media_player.")&&!0===this._hass.states[e].attributes?.volumio_ws);e||(e=Object.keys(this._hass.states).find(e=>e.startsWith("media_player.")&&e.includes("volumio"))),e&&(this._entityId=e,this._sensorBase=e.replace("media_player.",""))}!this._configEntryId&&this._panel?.config?.config_entry_id&&(this._configEntryId=this._panel.config.config_entry_id)}}async _subscribeQueue(){if(!this._queueUnsub&&this._hass){try{this._queueUnsub=await this._hass.connection.subscribeMessage(e=>{if(e.queue){const t=[...e.queue];this._notifyQueue(t)}},{type:"volumio_ws/subscribe_queue"})}catch(e){console.warn("[ha-adapter] Queue subscription failed:",e)}if(this._configEntryId)try{const e=await this.call("queue_get");e?.response?.queue&&this._notifyQueue([...e.response.queue])}catch{}}}_unsubscribeQueue(){this._queueUnsub&&("function"==typeof this._queueUnsub&&this._queueUnsub(),this._queueUnsub=null)}_notifyQueue(e){for(const t of this._queueListeners)try{t(e)}catch(e){console.error("[ha-adapter] Queue listener error:",e)}}async _mediaPlayerCall(e,t={}){if(!this._hass||!this._entityId)throw new Error(`Adapter not ready: media_player.${e}`);return await this._hass.callService("media_player",e,{entity_id:this._entityId,...t})}}const ye=[{key:"now-playing",label:"Now Playing"},{key:"browse",label:"Browse"},{key:"playlists",label:"Playlists"},{key:"favorites",label:"Favorites"}];customElements.define("volumio-top-bar",class extends re{static get properties(){return{activeView:{type:String,attribute:"active-view"},breadcrumb:{type:Array},showBackButton:{type:Boolean,attribute:"show-back-button"},narrow:{type:Boolean},searchQuery:{type:String,attribute:"search-query"},_searchValue:{type:String,state:!0},_searchFocused:{type:Boolean,state:!0}}}static get styles(){return s`
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
    `}constructor(){super(),this.activeView="now-playing",this.breadcrumb=[],this.showBackButton=!1,this.narrow=!1,this.searchQuery="",this._searchValue="",this._searchFocused=!1,this._debounceTimer=null,this._recentSearches=JSON.parse(localStorage.getItem("volumio-recent-searches")||"[]")}render(){return V`
      <div class="topbar">
        <button
          class="icon-btn"
          @click=${this._toggleNav}
          title="Toggle navigation"
          aria-label="Toggle navigation sidebar"
        >
          <ha-icon icon="mdi:menu"></ha-icon>
        </button>

        ${this.showBackButton?V`
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
          ${ye.map(e=>V`
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
          ${this._searchValue?V`
            <button class="search-clear" @click=${this._clearSearch} title="Clear search" aria-label="Clear search">✕</button>
          `:""}
        </div>

        ${this._searchFocused&&!this._searchValue&&this._recentSearches.length>0?V`
          <div class="recent-searches">
            <div class="recent-label">Recent</div>
            <div class="recent-chips">
              ${this._recentSearches.slice(0,10).map(e=>V`
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
    `}_renderBreadcrumb(){const e=this.breadcrumb,t=e.length>5?[e[0],{label:"...",path:null},...e.slice(-3)]:e;return V`
      <div class="breadcrumb-row">
        ${t.map((e,i)=>{const a=i===t.length-1;return V`
            ${i>0?V`<span class="breadcrumb-sep"><ha-icon icon="mdi:chevron-right" style="--mdc-icon-size:14px"></ha-icon></span>`:""}
            <span
              class="breadcrumb-segment ${a?"current":""}"
              @click=${()=>!a&&null!=e.path&&this._navigate(e.path)}
            >${e.label}</span>
          `})}
      </div>
    `}_navigate(e){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:e},bubbles:!0,composed:!0}))}_toggleNav(){this.dispatchEvent(new CustomEvent("volumio-toggle-nav",{bubbles:!0,composed:!0}))}_toggleQueue(){this.dispatchEvent(new CustomEvent("volumio-toggle-queue",{bubbles:!0,composed:!0}))}_goBack(){this.dispatchEvent(new CustomEvent("volumio-back",{bubbles:!0,composed:!0}))}_focusSearch(){const e=this.shadowRoot.querySelector(".search-field input");e&&e.focus()}_onSearchFieldFocus(){this._searchFocused=!0}_onSearchFieldBlur(){setTimeout(()=>{this._searchFocused=!1},200)}_onSearchInput(e){this._searchValue=e.target.value,clearTimeout(this._debounceTimer),this._searchValue.trim().length<2?0===this._searchValue.trim().length&&this.dispatchEvent(new CustomEvent("volumio-search-clear",{bubbles:!0,composed:!0})):this._debounceTimer=setTimeout(()=>{this._executeSearch(this._searchValue.trim())},300)}_onSearchKeydown(e){"Escape"===e.key?(this._clearSearch(),e.target.blur()):"Enter"===e.key&&(clearTimeout(this._debounceTimer),this._searchValue.trim().length>=2&&this._executeSearch(this._searchValue.trim()))}_executeSearch(e){this._recentSearches=[e,...this._recentSearches.filter(t=>t!==e)].slice(0,10),localStorage.setItem("volumio-recent-searches",JSON.stringify(this._recentSearches)),this.dispatchEvent(new CustomEvent("volumio-search",{detail:{query:e},bubbles:!0,composed:!0}))}_clearSearch(){this._searchValue="",clearTimeout(this._debounceTimer),this.dispatchEvent(new CustomEvent("volumio-search-clear",{bubbles:!0,composed:!0}))}_useRecentSearch(e){this._searchValue=e,this._searchFocused=!1,this._executeSearch(e)}_onSearchFocus(){this.dispatchEvent(new CustomEvent("volumio-search-focus",{bubbles:!0,composed:!0}))}});const _e=[{key:"favorites",label:"Favorites",icon:"mdi:heart"},{key:"playlists",label:"Playlists",icon:"mdi:playlist-music-outline"},{key:"history",label:"History",icon:"mdi:history"}],xe={music_service:"mdi:music-box",mpd:"mdi:folder-music",webradio:"mdi:radio",podcast:"mdi:podcast"};customElements.define("volumio-left-nav",class extends re{static get properties(){return{sources:{type:Array},activeSource:{type:String,attribute:"active-source"},mode:{type:String},activeView:{type:String,attribute:"active-view"}}}static get styles(){return s`
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
    `}constructor(){super(),this.sources=[],this.activeSource="",this.mode="pinned",this.activeView=""}render(){const e="collapsed"===this.mode;return V`
      <nav class="nav ${this.mode}" aria-label="Music sources">
        <div class="nav-scroll">
          <div class="nav-section-label ${e?"collapsed":""}">Sources</div>
          ${this.sources.map(e=>{const t=xe[e.plugin_name]||xe[e.plugin_type]||"mdi:music-box",i=this.activeSource===e.uri;return V`
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

          ${_e.map(e=>V`
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
    `}_selectSource(e){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"browse",source:e.name,sourceUri:e.uri,pluginName:e.plugin_name},bubbles:!0,composed:!0}))}_navigate(e){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:e},bubbles:!0,composed:!0}))}_togglePin(){const e="collapsed"===this.mode;this.dispatchEvent(new CustomEvent("volumio-nav-pin",{detail:{pinned:e},bubbles:!0,composed:!0}))}});customElements.define("volumio-quality-badge",class extends re{static get properties(){return{quality:{type:Object},size:{type:String}}}static get styles(){return s`
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
    `}constructor(){super(),this.quality=null,this.size="normal"}render(){if(!this.quality||"unknown"===this.quality.tier||!this.quality.label)return V``;const e=this.quality,t="small"===this.size?"small":"large"===this.size?"large":"normal";return V`
      <span
        class="badge ${t}"
        style="color: ${e.color}; background: ${e.colorBg};"
        aria-label="Audio quality: ${e.label}"
        title="${e.tierLabel}: ${e.label}"
      >
        ${e.label}
      </span>
    `}});const fe={qobuz:"Qobuz",tidal:"TIDAL",mpd:"Local",webradio:"Radio",spotify:"Spotify",spop:"Spotify",pandora:"Pandora",youtube:"YouTube",youtube2:"YouTube"},we={mpd:"mdi:folder-music",webradio:"mdi:radio"};customElements.define("volumio-source-badge",class extends re{static get properties(){return{source:{type:String}}}static get styles(){return s`
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
    `}constructor(){super(),this.source=""}render(){if(!this.source)return V``;const e=fe[this.source]||this.source,t=we[this.source]||null;return V`
      <span class="source">
        ${t?V`<ha-icon icon="${t}"></ha-icon>`:""}
        ${e}
      </span>
    `}});customElements.define("volumio-player-bar",class extends re{static get properties(){return{playerState:{type:String,attribute:"player-state"},title:{type:String},artist:{type:String},albumArt:{type:String,attribute:"album-art"},duration:{type:Number},position:{type:Number},positionUpdatedAt:{type:String,attribute:"position-updated-at"},volume:{type:Number},muted:{type:Boolean},shuffle:{type:Boolean},repeat:{type:String},quality:{type:Object},source:{type:String},volumeEnabled:{type:Boolean,attribute:"volume-enabled"},isFavorite:{type:Boolean,attribute:"is-favorite"},_displayPosition:{type:Number,state:!0},_isDragging:{type:Boolean,state:!0}}}static get styles(){return s`
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
    `}constructor(){super(),this.playerState="idle",this.title="",this.artist="",this.albumArt="",this.duration=0,this.position=0,this.positionUpdatedAt="",this.volume=0,this.muted=!1,this.shuffle=!1,this.repeat="off",this.quality=null,this.source="",this.volumeEnabled=!0,this.isFavorite=!1,this._displayPosition=0,this._isDragging=!1,this._rafId=null}connectedCallback(){super.connectedCallback(),this._startProgressAnimation()}disconnectedCallback(){super.disconnectedCallback(),this._stopProgressAnimation()}updated(e){(e.has("position")||e.has("positionUpdatedAt")||e.has("playerState"))&&(this._isDragging||(this._displayPosition=this.position||0))}_startProgressAnimation(){const e=()=>{if("playing"===this.playerState&&!this._isDragging&&this.positionUpdatedAt){const e=new Date(this.positionUpdatedAt).getTime(),t=(Date.now()-e)/1e3,i=(this.position||0)+t;this._displayPosition=Math.min(i,this.duration||1/0)}this._rafId=requestAnimationFrame(e)};this._rafId=requestAnimationFrame(e)}_stopProgressAnimation(){this._rafId&&(cancelAnimationFrame(this._rafId),this._rafId=null)}render(){if("unavailable"===this.playerState)return V`
        <div class="skeleton-bar-row" aria-busy="true" aria-label="Loading">
          <div class="skeleton-art"></div>
          <div class="skeleton-info">
            <div class="skeleton-bar title"></div>
            <div class="skeleton-bar artist"></div>
          </div>
          <div class="skeleton-progress"></div>
        </div>
      `;if(!("playing"===this.playerState||"paused"===this.playerState)&&!this.title)return V`
        <div class="empty-state">
          <ha-icon icon="mdi:music-note-off"></ha-icon>
          <span>Nothing playing</span>
        </div>
      `;const e="playing"===this.playerState,t=this.duration>0?Math.min(100,this._displayPosition/this.duration*100):0,i="one"===this.repeat?"mdi:repeat-once":"mdi:repeat",a="off"!==this.repeat,o=this.muted?"mdi:volume-mute":"mdi:volume-high";return V`
      <div class="player-bar">
        ${this.albumArt?V`<img
              class="art"
              src="${this.albumArt}"
              alt="Album art"
              @click=${this._goToNowPlaying}
              @error=${this._onArtError}
            />`:V`<div class="art-placeholder" @click=${this._goToNowPlaying}>
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
              class="ctrl-btn ${a?"active":""}"
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

          ${this.volumeEnabled?V`
            <div class="volume-section">
              <button
                class="vol-btn"
                @click=${()=>this._command("mute_toggle")}
                aria-label="Volume: ${this.muted?"muted":this.volume+"%"}"
              >
                <ha-icon icon="${o}"></ha-icon>
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
    `}_command(e,t){this.dispatchEvent(new CustomEvent("volumio-command",{detail:{command:e,value:t},bubbles:!0,composed:!0}))}_cycleRepeat(){const e="off"===this.repeat?"all":"all"===this.repeat?"one":"off";this._command("repeat_set",e)}_onProgressClick(e){const t=e.currentTarget.getBoundingClientRect(),i=Math.max(0,Math.min(1,(e.clientX-t.left)/t.width)),a=Math.floor(i*(this.duration||0));this._command("seek",a)}_onVolumeInput(e){}_onVolumeChange(e){const t=parseInt(e.target.value,10);this._command("volume_set",t)}_goToNowPlaying(){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"now-playing"},bubbles:!0,composed:!0}))}_toggleFavorite(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-toggle-favorite",{bubbles:!0,composed:!0}))}_onArtError(e){e.target.style.display="none";const t=document.createElement("div");t.className="art-placeholder",t.innerHTML='<ha-icon icon="mdi:music-note"></ha-icon>',e.target.parentNode.insertBefore(t,e.target)}_formatTime(e){if(!e||e<=0)return"0:00";const t=Math.floor(e);return`${Math.floor(t/60)}:${(t%60).toString().padStart(2,"0")}`}});customElements.define("volumio-now-playing",class extends re{static get properties(){return{playerState:{type:String,attribute:"player-state"},title:{type:String},artist:{type:String},album:{type:String},albumArt:{type:String,attribute:"album-art"},quality:{type:Object},source:{type:String},isFavorite:{type:Boolean,attribute:"is-favorite"},_dominantColor:{type:String,state:!0},_showLightbox:{type:Boolean,state:!0}}}static get styles(){return s`
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
    `}constructor(){super(),this.playerState="idle",this.title="",this.artist="",this.album="",this.albumArt="",this.quality=null,this.source="",this.isFavorite=!1,this._dominantColor=null,this._showLightbox=!1,this._canvas=null}updated(e){e.has("albumArt")&&this.albumArt&&this._extractDominantColor(this.albumArt)}render(){if("unavailable"===this.playerState)return this._renderSkeleton();return"playing"===this.playerState||"paused"===this.playerState||this.title?V`
      <div class="ultra-blur">
        <div
          class="ultra-blur-gradient"
          style="background: ${this._dominantColor?`radial-gradient(ellipse at 50% 40%, ${this._dominantColor} 0%, transparent 85%)`:"transparent"}"
        ></div>
        <div class="ultra-blur-overlay"></div>
      </div>

      <div class="container">
        <div class="art-container" @click=${this._toggleLightbox}>
          ${this.albumArt?V`<img
                class="art ${this.playerState}"
                src="${this.albumArt}"
                alt="Album art for ${this.album||this.title}"
                @error=${this._onArtError}
              />`:V`<div class="art-placeholder">
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

          ${this.artist?V`
            <div class="track-artist" @click=${this._goToArtist}>${this.artist}</div>
          `:""}

          ${this.album?V`
            <div class="track-album" @click=${this._goToAlbum}>${this.album}</div>
          `:""}

          <div class="quality-row">
            <volumio-quality-badge .quality=${this.quality} size="large"></volumio-quality-badge>
            <volumio-source-badge .source=${this.source}></volumio-source-badge>
          </div>
        </div>
      </div>

      ${this._showLightbox&&this.albumArt?V`
        <div class="lightbox" @click=${this._toggleLightbox} @keydown=${this._onLightboxKey}>
          <img src="${this.albumArt}" alt="Full size album art" />
        </div>
      `:""}
    `:this._renderEmpty()}_renderEmpty(){return V`
      <div class="empty-state">
        <ha-icon icon="mdi:music-note-off"></ha-icon>
        <div class="message">Nothing playing</div>
        <button class="browse-btn" @click=${this._goToBrowse}>Browse Music</button>
      </div>
    `}_renderSkeleton(){return V`
      <div class="skeleton" aria-busy="true" aria-label="Loading">
        <div class="skeleton-art"></div>
        <div class="skeleton-bar title"></div>
        <div class="skeleton-bar artist"></div>
        <div class="skeleton-bar album"></div>
      </div>
    `}async _extractDominantColor(e){if(e)try{const t=new Image;t.src=e,await new Promise((e,i)=>{t.onload=e,t.onerror=i}),this._canvas||(this._canvas=document.createElement("canvas"));const i=this._canvas,a=i.getContext("2d",{willReadFrequently:!0}),o=10;i.width=o,i.height=o,a.drawImage(t,0,0,o,o);const s=a.getImageData(0,0,o,o).data;let r=0,n=0,l=0;const c=o*o;for(let e=0;e<s.length;e+=4)r+=s[e],n+=s[e+1],l+=s[e+2];r=Math.round(r/c),n=Math.round(n/c),l=Math.round(l/c);const d=Math.max(r,n,l)/255,u=Math.min(r,n,l)/255;let h=0,p=0,m=(d+u)/2;if(d!==u){const e=d-u;p=m>.5?e/(2-d-u):e/(d+u);const t=r/255,i=n/255,a=l/255;h=t===d?((i-a)/e+(i<a?6:0))/6:i===d?((a-t)/e+2)/6:((t-i)/e+4)/6}m=Math.max(m,.4),p=Math.min(1.3*p,1);const v=(e,t,i)=>(i<0&&(i+=1),i>1&&(i-=1),i<1/6?e+6*(t-e)*i:i<.5?t:i<2/3?e+(t-e)*(2/3-i)*6:e),b=m<.5?m*(1+p):m+p-m*p,g=2*m-b;r=Math.round(255*v(g,b,h+1/3)),n=Math.round(255*v(g,b,h)),l=Math.round(255*v(g,b,h-1/3)),this._dominantColor=`rgb(${r}, ${n}, ${l})`}catch{this._dominantColor=null}else this._dominantColor=null}_toggleFavorite(){this.dispatchEvent(new CustomEvent("volumio-toggle-favorite",{bubbles:!0,composed:!0}))}_toggleLightbox(){this._showLightbox=!this._showLightbox}_onLightboxKey(e){"Escape"===e.key&&(this._showLightbox=!1)}_goToArtist(){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"artist-detail",artist:this.artist},bubbles:!0,composed:!0}))}_goToAlbum(){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"album-detail",album:this.album},bubbles:!0,composed:!0}))}_goToBrowse(){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"browse"},bubbles:!0,composed:!0}))}_onArtError(e){e.target.style.display="none"}});const $e={mpd:"mdi:folder-music",webradio:"mdi:radio",podcast:"mdi:podcast",spotify:"mdi:spotify",spop:"mdi:spotify",youtube:"mdi:youtube",youtube2:"mdi:youtube",tidal:"mdi:music-box",qobuz:"mdi:music-box",music_service:"mdi:music-box"};customElements.define("volumio-browse-source-grid",class extends re{static get properties(){return{sources:{type:Array},volumioUrl:{type:String,attribute:"volumio-url"}}}static get styles(){return s`
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
    `}constructor(){super(),this.sources=[],this.volumioUrl=""}render(){return this.sources&&0!==this.sources.length?V`
      <div class="grid">
        ${this.sources.map(e=>this._renderSourceCard(e))}
      </div>
    `:V`
        <div class="empty-state">
          <ha-icon icon="mdi:music-box-multiple-outline"></ha-icon>
          <div class="message">No music sources configured</div>
        </div>
      `}_renderSourceCard(e){const t=$e[e.plugin_name]||$e[e.plugin_type]||"mdi:music-box",i=be(e.albumart||e.icon,this.volumioUrl);return V`
      <div
        class="source-card"
        @click=${()=>this._selectSource(e)}
        title="${e.name}"
      >
        <div class="source-icon">
          ${i?V`<img
                src="${i}"
                alt="${e.name}"
                @error=${this._onIconError}
              />`:V`<ha-icon icon="${t}"></ha-icon>`}
        </div>
        <div class="source-name">${e.name}</div>
      </div>
    `}_selectSource(e){this.dispatchEvent(new CustomEvent("volumio-source-select",{detail:{uri:e.uri,name:e.name,plugin_name:e.plugin_name},bubbles:!0,composed:!0}))}_onIconError(e){const t=e.target.parentElement;e.target.remove(),t.innerHTML='<ha-icon icon="mdi:music-box"></ha-icon>'}});customElements.define("volumio-album-card",class extends re{static get properties(){return{title:{type:String},artist:{type:String},albumart:{type:String},uri:{type:String},type:{type:String},quality:{type:Object},service:{type:String}}}static get styles(){return s`
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
    `}constructor(){super(),this.title="",this.artist="",this.albumart="",this.uri="",this.type="folder",this.quality=null,this.service=""}render(){const e="folder"===this.type||"category"===this.type,t=e?"mdi:folder-music":"mdi:music-note";return V`
      <div class="card ${e?"folder":""}" @click=${this._onClick} @contextmenu=${this._onContextMenu}>
        <div class="art-container">
          ${this.albumart?V`<img
                class="art"
                src="${this.albumart}"
                alt="${this.title}"
                loading="lazy"
                @error=${this._onArtError}
              />`:V`<div class="art-placeholder">
                <ha-icon icon="${t}"></ha-icon>
              </div>`}
          <div class="play-overlay">
            <button class="play-btn" @click=${this._onPlay} title="Play">
              <ha-icon icon="mdi:play"></ha-icon>
            </button>
            <button class="queue-btn" @click=${this._onDotsClick} title="More actions">
              <ha-icon icon="mdi:dots-vertical"></ha-icon>
            </button>
          </div>
        </div>
        <div class="meta">
          <div class="card-title" title="${this.title}">${this.title||"Unknown"}</div>
          ${this.artist?V`<div class="card-artist" title="${this.artist}">${this.artist}</div>`:""}
          ${this.quality&&"unknown"!==this.quality.tier?V`<div class="card-quality">
                <volumio-quality-badge .quality=${this.quality} size="small"></volumio-quality-badge>
              </div>`:""}
        </div>
      </div>
    `}_getItemData(){return{uri:this.uri,title:this.title,artist:this.artist,albumart:this.albumart,type:this.type,service:this.service}}_onClick(e){e.target.closest(".play-btn")||this.dispatchEvent(new CustomEvent("volumio-card-click",{detail:this._getItemData(),bubbles:!0,composed:!0}))}_onPlay(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-card-play",{detail:this._getItemData(),bubbles:!0,composed:!0}))}_onDotsClick(e){e.stopPropagation(),e.preventDefault();const t=e.currentTarget.getBoundingClientRect();this._fireContextEvent(t.right,t.bottom)}_onContextMenu(e){e.preventDefault(),e.stopPropagation(),this._fireContextEvent(e.clientX,e.clientY)}_fireContextEvent(e,t){this.dispatchEvent(new CustomEvent("volumio-context-menu",{detail:{...this._getItemData(),x:e,y:t,context:"album"},bubbles:!0,composed:!0}))}_onArtError(e){const t=e.target.parentElement;e.target.remove();const i=document.createElement("div");i.className="art-placeholder",i.innerHTML='<ha-icon icon="mdi:music-note"></ha-icon>',t.prepend(i)}});customElements.define("volumio-track-card",class extends re{static get properties(){return{index:{type:Number},title:{type:String},artist:{type:String},album:{type:String},duration:{type:Number},uri:{type:String},albumart:{type:String},service:{type:String},type:{type:String},quality:{type:Object},isPlaying:{type:Boolean,attribute:"is-playing"},compact:{type:Boolean}}}static get styles(){return s`
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
    `}constructor(){super(),this.index=0,this.title="",this.artist="",this.album="",this.duration=0,this.uri="",this.albumart="",this.service="",this.type="song",this.quality=null,this.isPlaying=!1,this.compact=!1}render(){return V`
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
          ${this.quality&&"unknown"!==this.quality.tier?V`<volumio-quality-badge .quality=${this.quality} size="small"></volumio-quality-badge>`:""}
        </div>
        <div class="cell-duration">${this.duration?ve(this.duration):""}</div>
        <div class="cell-context">
          <button class="context-btn" @click=${this._onDotsClick} title="More actions">
            <ha-icon icon="mdi:dots-vertical"></ha-icon>
          </button>
        </div>
      </div>
    `}_getItemData(){return{uri:this.uri,title:this.title,artist:this.artist,album:this.album,albumart:this.albumart,service:this.service,type:this.type,index:this.index}}_onClick(){this.dispatchEvent(new CustomEvent("volumio-track-click",{detail:this._getItemData(),bubbles:!0,composed:!0}))}_onDotsClick(e){e.stopPropagation(),e.preventDefault();const t=e.currentTarget.getBoundingClientRect();this._fireContextEvent(t.right,t.bottom)}_onContextMenu(e){e.preventDefault(),e.stopPropagation(),this._fireContextEvent(e.clientX,e.clientY)}_fireContextEvent(e,t){this.dispatchEvent(new CustomEvent("volumio-context-menu",{detail:{...this._getItemData(),x:e,y:t,context:"track"},bubbles:!0,composed:!0}))}});customElements.define("volumio-browse-list",class extends re{static get properties(){return{items:{type:Array},viewMode:{type:String,attribute:"view-mode"},loading:{type:Boolean},currentUri:{type:String,attribute:"current-uri"},volumioUrl:{type:String,attribute:"volumio-url"},_displayCount:{type:Number,state:!0}}}static get styles(){return s`
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

      /* When queue panel is pinned (>= 1400px), offset alpha index */
      @media (min-width: 1400px) {
        .alpha-index {
          right: 340px;
        }
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
    `}constructor(){super(),this.items=[],this.viewMode=localStorage.getItem("volumio-browse-view")||"grid",this.loading=!1,this.currentUri="",this.volumioUrl="",this._displayCount=100}render(){if(this.loading)return this._renderSkeleton();if(!this.items||0===this.items.length)return V`
        <div class="empty-state">
          <ha-icon icon="mdi:folder-open-outline"></ha-icon>
          <div class="message">No items found</div>
        </div>
      `;const e=this.items.slice(0,this._displayCount),t=this.items.length>this._displayCount,i=this.items.length>20,a=i?this._buildAlphaMap():null;return V`
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

        ${t?V`
          <div class="load-more">
            <button class="load-more-btn" @click=${this._loadMore}>
              Show more (${this.items.length-this._displayCount} remaining)
            </button>
          </div>
        `:""}

        ${i?this._renderAlphaIndex(a):""}
      </div>
    `}updated(e){e.has("items")&&(this._displayCount=100)}_renderGrid(e){return V`
      <div class="browse-grid">
        ${e.map(e=>{const t=be(e.albumart||e.icon,this.volumioUrl),i=this._getItemLetter(e);return V`
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
    `}_renderList(e){const t=!e.some(e=>e.duration>0);return V`
      <div class="browse-list">
        <div class="list-header" style="grid-template-columns: ${t?"40px 1.5fr 1fr 32px":"40px 1fr 1fr 0.8fr auto 60px 32px"};">
          <span>#</span>
          <span>Title</span>
          <span>Artist</span>
          ${t?"":V`
            <span class="hdr-album">Album</span>
            <span class="hdr-quality">Quality</span>
            <span class="hdr-duration">Time</span>
          `}
          <span></span>
        </div>
        ${e.map((e,i)=>{const a=be(e.albumart||e.icon,this.volumioUrl),o=this._getItemLetter(e);return V`
            <volumio-track-card
              data-letter="${o}"
              .index=${i+1}
              title="${e.title||e.name||""}"
              artist="${e.artist||""}"
              album="${e.album||""}"
              .duration=${e.duration||0}
              uri="${e.uri||""}"
              albumart="${a}"
              service="${e.service||""}"
              type="${e.type||"folder"}"
              ?compact=${t}
              ?is-playing=${this.currentUri&&e.uri===this.currentUri}
              @volumio-track-click=${this._onItemClick}
            ></volumio-track-card>
          `})}
      </div>
    `}_renderSkeleton(){return V`
      <div class="skeleton-grid" aria-busy="true" aria-label="Loading">
        ${Array(12).fill(0).map(()=>V`<div class="skeleton-card"></div>`)}
      </div>
    `}_setViewMode(e){this.viewMode=e,localStorage.setItem("volumio-browse-view",e),this.dispatchEvent(new CustomEvent("volumio-view-mode-change",{detail:{mode:e},bubbles:!0,composed:!0}))}_loadMore(){this._displayCount+=100}_onItemClick(e){e.stopPropagation();const t=e.detail;this.dispatchEvent(new CustomEvent("volumio-item-click",{detail:t,bubbles:!0,composed:!0}))}_onItemPlay(e){e.stopPropagation();const t=e.detail;this.dispatchEvent(new CustomEvent("volumio-item-play",{detail:t,bubbles:!0,composed:!0}))}_getItemLetter(e){const t=(e.title||e.name||"").trim();if(!t)return"#";const i=t.charAt(0).toUpperCase();return/[A-Z]/.test(i)?i:"#"}_buildAlphaMap(){const e=new Set;for(const t of this.items)e.add(this._getItemLetter(t));return e}_renderAlphaIndex(e){const t=["#",..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];return V`
      <div class="alpha-index">
        ${t.map(t=>{const i=e.has(t);return V`
            <div
              class="alpha-letter ${i?"":"disabled"}"
              @click=${()=>i&&this._scrollToLetter(t)}
            >${t}</div>
          `})}
      </div>
    `}_scrollToLetter(e){if(this._displayCount<this.items.length){const t=this.items.findIndex(t=>this._getItemLetter(t)===e);t>=this._displayCount&&(this._displayCount=Math.min(t+50,this.items.length))}this.updateComplete.then(()=>{const t=this.shadowRoot.querySelector(`[data-letter="${e}"]`);t&&t.scrollIntoView({behavior:"smooth",block:"start"})})}});customElements.define("volumio-album-detail",class extends re{static get properties(){return{albumTitle:{type:String,attribute:"album-title"},albumArtist:{type:String,attribute:"album-artist"},albumArt:{type:String,attribute:"album-art"},albumUri:{type:String,attribute:"album-uri"},albumService:{type:String,attribute:"album-service"},tracks:{type:Array},loading:{type:Boolean},currentUri:{type:String,attribute:"current-uri"},quality:{type:Object},volumioUrl:{type:String,attribute:"volumio-url"}}}static get styles(){return s`
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
    `}constructor(){super(),this.albumTitle="",this.albumArtist="",this.albumArt="",this.albumUri="",this.albumService="",this.tracks=[],this.loading=!1,this.currentUri="",this.quality=null,this.volumioUrl=""}render(){if(this.loading)return this._renderSkeleton();const e=this.tracks.length,t=this.tracks.reduce((e,t)=>e+(t.duration||0),0);return V`
      <div class="album-header">
        <div class="album-art-container">
          ${this.albumArt?V`<img src="${this.albumArt}" alt="${this.albumTitle}" @error=${this._onArtError} />`:V`<div class="album-art-placeholder">
                <ha-icon icon="mdi:album"></ha-icon>
              </div>`}
        </div>
        <div class="album-meta">
          <span class="meta-type">Album</span>
          <div class="album-name">${this.albumTitle||"Unknown Album"}</div>
          ${this.albumArtist?V`<span class="album-artist-link" @click=${this._goToArtist}>
                ${this.albumArtist}
              </span>`:""}
          <div class="meta-details">
            ${e>0?V`<span class="detail">${e} track${1!==e?"s":""}</span>`:""}
            ${e>0&&t>0?V`<span class="sep">·</span>`:""}
            ${t>0?V`<span class="detail">${ve(t)}</span>`:""}
            ${this.albumService?V`
              <span class="sep">·</span>
              <volumio-source-badge .source=${this.albumService}></volumio-source-badge>
            `:""}
          </div>
          ${this.quality&&"unknown"!==this.quality.tier?V`
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
            <button class="action-btn secondary" @click=${this._onMoreClick}>
              <ha-icon icon="mdi:dots-horizontal"></ha-icon>
            </button>
          </div>
        </div>
      </div>

      ${e>0?V`
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
          ${this.tracks.map((e,t)=>{const i=be(e.albumart||e.icon,this.volumioUrl);return V`
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
              ></volumio-track-card>
            `})}
        </div>
      `:V`
        <div style="text-align: center; padding: 32px; color: var(--secondary-text-color);">
          No tracks found
        </div>
      `}
    `}_renderSkeleton(){return V`
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
          ${Array(8).fill(0).map(()=>V`<div class="skeleton-track"></div>`)}
        </div>
      </div>
    `}_playAlbum(){this.dispatchEvent(new CustomEvent("volumio-album-play",{detail:{uri:this.albumUri},bubbles:!0,composed:!0}))}_addToQueue(){this.dispatchEvent(new CustomEvent("volumio-album-add-queue",{detail:{uri:this.albumUri},bubbles:!0,composed:!0}))}_goToArtist(){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"artist-detail",artist:this.albumArtist},bubbles:!0,composed:!0}))}_onTrackClick(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-track-click",{detail:e.detail,bubbles:!0,composed:!0}))}_onMoreClick(e){e.stopPropagation();const t=e.currentTarget.getBoundingClientRect();this.dispatchEvent(new CustomEvent("volumio-context-menu",{detail:{uri:this.albumUri,title:this.albumTitle,artist:this.albumArtist,albumart:this.albumArt,service:this.albumService,type:"album",x:t.right,y:t.bottom,context:"album"},bubbles:!0,composed:!0}))}_onArtError(e){const t=e.target.parentElement;e.target.remove(),t.innerHTML='<div class="album-art-placeholder"><ha-icon icon="mdi:album"></ha-icon></div>'}});customElements.define("volumio-artist-detail",class extends re{static get properties(){return{artistName:{type:String,attribute:"artist-name"},items:{type:Array},loading:{type:Boolean},volumioUrl:{type:String,attribute:"volumio-url"}}}static get styles(){return s`
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
    `}constructor(){super(),this.artistName="",this.items=[],this.loading=!1,this.volumioUrl=""}render(){return this.loading?this._renderSkeleton():V`
      <div class="artist-header">
        <div class="artist-name">${this.artistName||"Unknown Artist"}</div>
      </div>

      <div class="section">
        <div class="section-title">Albums</div>
        ${this.items&&this.items.length>0?V`
            <div class="albums-grid">
              ${this.items.map(e=>{const t=be(e.albumart||e.icon,this.volumioUrl);return V`
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
          `:V`<div class="empty-state">No albums found</div>`}
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
    `}_renderSkeleton(){return V`
      <div aria-busy="true" aria-label="Loading artist">
        <div class="skeleton-name"></div>
        <div class="skeleton-grid">
          ${Array(6).fill(0).map(()=>V`<div class="skeleton-card"></div>`)}
        </div>
      </div>
    `}_onCardClick(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-card-click",{detail:e.detail,bubbles:!0,composed:!0}))}_onCardPlay(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-card-play",{detail:e.detail,bubbles:!0,composed:!0}))}});customElements.define("volumio-search-results",class extends re{static get properties(){return{results:{type:Object},loading:{type:Boolean},query:{type:String},volumioUrl:{type:String,attribute:"volumio-url"},currentUri:{type:String,attribute:"current-uri"},_expandedSections:{type:Object,state:!0}}}static get styles(){return s`
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
    `}constructor(){super(),this.results=null,this.loading=!1,this.query="",this.volumioUrl="",this.currentUri="",this._expandedSections={}}render(){if(this.loading)return this._renderSkeleton();const e=this._parseResults();if(!e||0===e.length)return this.query?V`
        <div class="empty-state">
          <ha-icon icon="mdi:magnify-close"></ha-icon>
          <div class="message">No results found for "${this.query}"</div>
        </div>
      `:V``;const t=e.reduce((e,t)=>e+t.sections.reduce((e,t)=>e+t.items.length,0),0);return V`
      <div class="results-header">
        Found <strong>${t}</strong> result${1!==t?"s":""} for "<strong>${this.query}</strong>"
      </div>

      ${e.map(e=>this._renderSourceGroup(e))}
    `}_parseResults(){if(!this.results)return[];const e=this.results.navigation||this.results,t=e?.lists||[];if(0===t.length)return[];const i=new Map;for(const e of t){if(!e.items||0===e.items.length)continue;const{source:t,type:a}=this._parseListTitle(e.title||"");i.has(t)||i.set(t,new Map);const o=i.get(t);o.has(a)||o.set(a,[]),o.get(a).push(...e.items)}const a=[];for(const[e,t]of i){const i=[];for(const[e,a]of t)i.push({type:e,items:a});a.push({source:e,sections:i})}return a}_parseListTitle(e){if(!e)return{source:"Other",type:"Results"};const t=["QOBUZ","TIDAL","SPOTIFY","YOUTUBE","PANDORA"];for(const i of t)if(e.startsWith(i+" ")){const t=e.substring(i.length+1).trim();return{source:this._capitalizeSource(i),type:t||"Results"}}const i=e.match(/^Found\s+\d+\s+(\w+)/i);if(i){let e=i[1];return e.endsWith("s")||(e+="s"),{source:"Local",type:e}}return{source:"Other",type:e}}_capitalizeSource(e){return e.charAt(0).toUpperCase()+e.slice(1).toLowerCase()}_renderSourceGroup(e){const t=e.source,i=e.sections.reduce((e,t)=>e+t.items.length,0),a=!1===this._expandedSections[t];return V`
      <div class="source-group">
        <div class="source-header" @click=${()=>this._toggleSection(t)}>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="source-title">${e.source}</span>
            <span class="source-count">${i}</span>
          </div>
          <ha-icon
            class="collapse-icon ${a?"collapsed":""}"
            icon="mdi:chevron-down"
          ></ha-icon>
        </div>
        ${a?"":e.sections.map(e=>this._renderTypeSection(e,t))}
      </div>
    `}_renderTypeSection(e,t){const i=`${t}:${e.type}`,a=!0===this._expandedSections[i],o=e.type.toLowerCase(),s=o.includes("album"),r=o.includes("track")||o.includes("song"),n=o.includes("artist");let l;l=s?4:r||n?3:4;const c=a?e.items:e.items.slice(0,l),d=e.items.length>l&&!a;return V`
      <div class="type-section">
        <div class="type-title">${e.type}</div>

        ${n?this._renderArtistItems(c):r?this._renderTrackItems(c):this._renderGridItems(c,s?"album":null)}

        ${d?V`
          <button class="show-all-btn" @click=${()=>this._expandSection(i)}>
            Show all ${e.items.length} →
          </button>
        `:""}
      </div>
    `}_renderGridItems(e,t){return V`
      <div class="items-grid">
        ${e.map(e=>{const i=be(e.albumart||e.icon,this.volumioUrl);return V`
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
    `}_renderTrackItems(e){return V`
      <div class="items-list">
        ${e.map((e,t)=>{const i=be(e.albumart||e.icon,this.volumioUrl);return V`
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
    `}_renderArtistItems(e){return V`
      <div style="display: flex; flex-wrap: wrap;">
        ${e.map(e=>V`
          <span
            class="artist-link"
            @click=${()=>this._onArtistClick(e)}
          >
            <ha-icon icon="mdi:account-music"></ha-icon>
            ${e.title||e.name||"Unknown"}
          </span>
        `)}
      </div>
    `}_renderSkeleton(){return V`
      <div class="skeleton-results" aria-busy="true" aria-label="Searching">
        <div class="skeleton-section-title"></div>
        <div class="skeleton-grid">
          ${Array(4).fill(0).map(()=>V`<div class="skeleton-card"></div>`)}
        </div>
        <div class="skeleton-section-title"></div>
        ${Array(3).fill(0).map(()=>V`<div class="skeleton-row"></div>`)}
      </div>
    `}_toggleSection(e){this._expandedSections={...this._expandedSections,[e]:!1===this._expandedSections[e]&&void 0}}_expandSection(e){this._expandedSections={...this._expandedSections,[e]:!0}}_onCardClick(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-card-click",{detail:e.detail,bubbles:!0,composed:!0}))}_onCardPlay(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-card-play",{detail:e.detail,bubbles:!0,composed:!0}))}_onTrackClick(e){e.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-track-click",{detail:e.detail,bubbles:!0,composed:!0}))}_onArtistClick(e){this.dispatchEvent(new CustomEvent("volumio-card-click",{detail:{uri:e.uri||"",title:e.title||e.name||"",artist:e.title||e.name||"",albumart:e.albumart||"",type:"artist",service:e.service||""},bubbles:!0,composed:!0}))}});customElements.define("volumio-breadcrumb-bar",class extends re{static get properties(){return{trail:{type:Array}}}static get styles(){return s`
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
    `}constructor(){super(),this.trail=[]}render(){if(!this.trail||0===this.trail.length)return V``;const e=this._getDisplaySegments();return V`
      <div class="breadcrumb">
        ${e.map((t,i)=>{const a=i===e.length-1;return V`
            ${i>0?V`<span class="sep"><ha-icon icon="mdi:chevron-right"></ha-icon></span>`:""}
            ${t.ellipsis?V`<span class="ellipsis">...</span>`:V`
                <span
                  class="segment ${a?"current":""}"
                  @click=${()=>!a&&this._onClick(t.index)}
                  title="${t.title}"
                >${t.title}</span>
              `}
          `})}
      </div>
    `}_getDisplaySegments(){const e=this.trail;return e.length<=5?e.map((e,t)=>({...e,index:t})):[{...e[0],index:0},{ellipsis:!0},...e.slice(-3).map((t,i)=>({...t,index:e.length-3+i}))]}_onClick(e){const t=this.trail[e];t&&this.dispatchEvent(new CustomEvent("volumio-breadcrumb-click",{detail:{index:e,uri:t.uri,title:t.title},bubbles:!0,composed:!0}))}});customElements.define("volumio-context-menu",class extends re{static get properties(){return{open:{type:Boolean,reflect:!0},x:{type:Number},y:{type:Number},items:{type:Array},submenuItems:{type:Array},_showSubmenu:{type:Boolean,state:!0},_posStyle:{type:String,state:!0}}}static get styles(){return s`
      :host {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 9999;
        pointer-events: none;
        display: none;
      }

      :host([open]) {
        display: block;
        pointer-events: auto;
      }

      .backdrop {
        position: absolute;
        inset: 0;
      }

      .menu {
        position: absolute;
        width: 240px;
        background: var(--card-background-color, #2a2a2a);
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
        border-radius: 8px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        padding: 4px 0;
        opacity: 0;
        transform: scale(0.95);
        transition: opacity 100ms ease-out, transform 100ms ease-out;
        overflow: hidden;
        max-height: 80vh;
        overflow-y: auto;
      }

      :host([open]) .menu {
        opacity: 1;
        transform: scale(1);
      }

      .menu-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 16px;
        cursor: pointer;
        font-size: 14px;
        color: var(--primary-text-color);
        transition: background 0.1s;
        user-select: none;
      }

      .menu-item:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
      }

      .menu-item.disabled {
        opacity: 0.4;
        pointer-events: none;
      }

      .menu-item ha-icon {
        --mdc-icon-size: 18px;
        color: var(--secondary-text-color);
        flex-shrink: 0;
      }

      .menu-item .label {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .menu-item .arrow {
        --mdc-icon-size: 14px;
        color: var(--secondary-text-color);
      }

      .separator {
        height: 1px;
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        margin: 4px 0;
      }

      /* ── Submenu ──────────────────────────── */
      .submenu-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        font-size: 13px;
        font-weight: 600;
        color: var(--secondary-text-color);
        border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
      }

      .submenu-header ha-icon {
        --mdc-icon-size: 16px;
        cursor: pointer;
      }

      .submenu-header ha-icon:hover {
        color: var(--primary-text-color);
      }

      .submenu-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 16px;
        cursor: pointer;
        font-size: 13px;
        color: var(--primary-text-color);
        transition: background 0.1s;
      }

      .submenu-item:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
      }

      .submenu-item ha-icon {
        --mdc-icon-size: 16px;
        color: var(--secondary-text-color);
      }

      .submenu-item.create-new {
        color: var(--primary-color, #03a9f4);
        border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
        margin-top: 4px;
      }
    `}constructor(){super(),this.open=!1,this.x=0,this.y=0,this.items=[],this.submenuItems=[],this._showSubmenu=!1,this._posStyle="",this._onKeyDown=this._onKeyDown.bind(this)}updated(e){e.has("open")&&(this.open?(this._showSubmenu=!1,this._computePosition(),document.addEventListener("keydown",this._onKeyDown)):document.removeEventListener("keydown",this._onKeyDown)),(e.has("x")||e.has("y"))&&this.open&&this._computePosition()}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKeyDown)}_computePosition(){const e=Math.min(40*(this.items?.length||0)+20,.8*window.innerHeight);let t=this.x,i=this.y;t+240>window.innerWidth-8&&(t=window.innerWidth-240-8),t<8&&(t=8),i+e>window.innerHeight-8&&(i=window.innerHeight-e-8),i<8&&(i=8),this._posStyle=`left:${t}px;top:${i}px`}render(){return V`
      <div class="backdrop" @click=${this._close} @contextmenu=${this._preventAndClose}></div>
      <div class="menu" style="${this._posStyle}">
        ${this._showSubmenu?this._renderSubmenu():this._renderMainMenu()}
      </div>
    `}_renderMainMenu(){return(this.items||[]).map(e=>e.separator?V`<div class="separator"></div>`:V`
        <div
          class="menu-item ${e.disabled?"disabled":""}"
          @click=${()=>this._onAction(e)}
        >
          <ha-icon icon="${e.icon}"></ha-icon>
          <span class="label">${e.label}</span>
          ${e.submenu?V`<ha-icon class="arrow" icon="mdi:chevron-right"></ha-icon>`:""}
        </div>
      `)}_renderSubmenu(){return V`
      <div class="submenu-header">
        <ha-icon icon="mdi:arrow-left" @click=${()=>{this._showSubmenu=!1}}></ha-icon>
        Add to Playlist
      </div>
      ${(this.submenuItems||[]).map(e=>V`
        <div class="submenu-item" @click=${()=>this._onSubmenuAction(e.key)}>
          <ha-icon icon="mdi:playlist-music"></ha-icon>
          <span class="label">${e.label}</span>
        </div>
      `)}
      <div class="submenu-item create-new" @click=${()=>this._onSubmenuAction("__new__")}>
        <ha-icon icon="mdi:plus"></ha-icon>
        <span class="label">New Playlist</span>
      </div>
    `}_onAction(e){e.disabled||(e.submenu?this._showSubmenu=!0:(this.dispatchEvent(new CustomEvent("volumio-context-action",{detail:{action:e.key},bubbles:!0,composed:!0})),this._close()))}_onSubmenuAction(e){this.dispatchEvent(new CustomEvent("volumio-context-action",{detail:{action:"add_to_playlist",playlist:e},bubbles:!0,composed:!0})),this._close()}_close(){this.open=!1,this.dispatchEvent(new CustomEvent("volumio-context-close",{bubbles:!0,composed:!0}))}_preventAndClose(e){e.preventDefault(),this._close()}_onKeyDown(e){"Escape"===e.key&&this._close()}});customElements.define("volumio-toast-notification",class extends re{static get properties(){return{message:{type:String},open:{type:Boolean,reflect:!0},undoAction:{type:String,attribute:"undo-action"}}}static get styles(){return s`
      :host {
        position: fixed;
        bottom: 80px;  /* above player bar */
        left: 50%;
        transform: translateX(-50%);
        z-index: 9000;
        pointer-events: none;
        display: block;
      }

      .toast {
        max-width: 320px;
        min-width: 200px;
        padding: 10px 16px;
        background: rgba(30, 30, 30, 0.95);
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        gap: 12px;
        pointer-events: auto;
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 200ms ease-out, transform 200ms ease-out;
      }

      :host([open]) .toast {
        opacity: 1;
        transform: translateY(0);
      }

      .toast-message {
        flex: 1;
        font-size: 13px;
        color: #eee;
        line-height: 1.3;
      }

      .toast-undo {
        font-size: 13px;
        font-weight: 600;
        color: var(--primary-color, #03a9f4);
        cursor: pointer;
        white-space: nowrap;
        padding: 2px 4px;
        border-radius: 4px;
        transition: background 0.1s;
      }

      .toast-undo:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    `}constructor(){super(),this.message="",this.open=!1,this.undoAction=null,this._timer=null}updated(e){e.has("open")&&this.open&&this._startDismissTimer()}_startDismissTimer(){this._timer&&clearTimeout(this._timer),this._timer=setTimeout(()=>{this._dismiss()},3e3)}render(){return V`
      <div class="toast">
        <span class="toast-message">${this.message}</span>
        ${this.undoAction?V`<span class="toast-undo" @click=${this._onUndo}>Undo</span>`:""}
      </div>
    `}_onUndo(){this._timer&&(clearTimeout(this._timer),this._timer=null),this.dispatchEvent(new CustomEvent("volumio-toast-undo",{detail:{action:this.undoAction},bubbles:!0,composed:!0})),this._dismiss()}_dismiss(){this._timer&&(clearTimeout(this._timer),this._timer=null),this.open=!1,this.dispatchEvent(new CustomEvent("volumio-toast-dismiss",{bubbles:!0,composed:!0}))}show(e,t=null){this.message=e,this.undoAction=t,this.open=!0}});const ke={mpd:"Local",qobuz:"Qobuz",tidal:"TIDAL",spotify:"Spotify",spop:"Spotify",webradio:"Radio",pandora:"Pandora",youtube:"YouTube",youtube2:"YouTube",ytmusic:"YouTube Music"};function Se(e){return e?ke[e]||e.charAt(0).toUpperCase()+e.slice(1):""}customElements.define("volumio-panel",class extends re{static get properties(){return{hass:{type:Object},narrow:{type:Boolean},route:{type:Object},panel:{type:Object},_queue:{type:Array,state:!0},_activeView:{type:String,state:!0},_navMode:{type:String,state:!0},_showQueue:{type:Boolean,state:!0},_showNavFlyout:{type:Boolean,state:!0},_isFavorite:{type:Boolean,state:!0},_browseStack:{type:Array,state:!0},_browseItems:{type:Array,state:!0},_browseLoading:{type:Boolean,state:!0},_browseContext:{type:Object,state:!0},_searchResults:{type:Object,state:!0},_searchLoading:{type:Boolean,state:!0},_searchQuery:{type:String,state:!0},_searchTrail:{type:Array,state:!0},_browseSources:{type:Array,state:!0},_activeSourceUri:{type:String,state:!0},_ctxOpen:{type:Boolean,state:!0},_ctxX:{type:Number,state:!0},_ctxY:{type:Number,state:!0},_ctxItems:{type:Array,state:!0},_ctxTarget:{type:Object,state:!0},_ctxPlaylists:{type:Array,state:!0},_toastMessage:{type:String,state:!0},_toastOpen:{type:Boolean,state:!0},_toastUndo:{type:String,state:!0},_toastUndoData:{type:Object,state:!0},_queueConfirmClear:{type:Boolean,state:!0},_queueSaveOpen:{type:Boolean,state:!0},_queueSaveName:{type:String,state:!0},_dragIndex:{type:Number,state:!0},_dragOverIndex:{type:Number,state:!0}}}static get styles(){return[le,s`
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

        /* ── Queue drag handle ───────────────────── */
        .qi-drag {
          width: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: grab;
          color: var(--secondary-text-color);
          opacity: 0;
          transition: opacity 0.1s;
          flex-shrink: 0;
          touch-action: none;
        }
        .qi-drag:active { cursor: grabbing; }
        .queue-item:hover .qi-drag { opacity: 0.6; }
        .qi-drag ha-icon { --mdc-icon-size: 14px; }

        .queue-item.dragging {
          opacity: 0.4;
          background: var(--divider-color, rgba(255, 255, 255, 0.04));
        }

        .queue-item.drag-over-above {
          border-top: 2px solid var(--primary-color, #03a9f4);
        }
        .queue-item.drag-over-below {
          border-bottom: 2px solid var(--primary-color, #03a9f4);
        }

        /* ── Queue remove button ─────────────────── */
        .qi-remove {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: none;
          background: transparent;
          color: var(--secondary-text-color);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          opacity: 0;
          transition: opacity 0.1s, background 0.1s;
          flex-shrink: 0;
        }
        .queue-item:hover .qi-remove { opacity: 1; }
        .qi-remove:hover {
          background: var(--divider-color, rgba(255, 255, 255, 0.08));
          color: var(--error-color, #f44336);
        }
        .qi-remove ha-icon { --mdc-icon-size: 14px; }

        /* ── Queue header actions ─────────────────── */
        .queue-actions {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* ── Confirmation bar ─────────────────────── */
        .confirm-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 16px;
          background: var(--card-background-color, #2a2a2a);
          border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
          font-size: 13px;
          color: var(--primary-text-color);
        }
        .confirm-bar .confirm-btns {
          display: flex;
          gap: 8px;
        }
        .confirm-bar button {
          padding: 4px 12px;
          border-radius: 4px;
          border: none;
          font-size: 12px;
          cursor: pointer;
        }
        .confirm-bar .btn-yes {
          background: var(--error-color, #f44336);
          color: #fff;
        }
        .confirm-bar .btn-no {
          background: var(--divider-color, rgba(255, 255, 255, 0.12));
          color: var(--primary-text-color);
        }

        /* ── Save as playlist dialog ──────────────── */
        .save-dialog {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
        }
        .save-dialog input {
          flex: 1;
          padding: 6px 10px;
          border-radius: 4px;
          border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
          background: transparent;
          color: var(--primary-text-color);
          font-size: 13px;
          outline: none;
        }
        .save-dialog input:focus {
          border-color: var(--primary-color, #03a9f4);
        }
        .save-dialog button {
          padding: 6px 12px;
          border-radius: 4px;
          border: none;
          font-size: 12px;
          cursor: pointer;
          background: var(--primary-color, #03a9f4);
          color: #fff;
        }

        /* ── Queue empty state ────────────────────── */
        .queue-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 16px;
          text-align: center;
          gap: 12px;
          color: var(--secondary-text-color);
          font-size: 13px;
        }
        .queue-empty-state ha-icon {
          --mdc-icon-size: 32px;
          opacity: 0.3;
        }
        .queue-empty-state .browse-btn {
          padding: 6px 16px;
          border-radius: 16px;
          border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
          background: transparent;
          color: var(--primary-text-color);
          font-size: 12px;
          cursor: pointer;
          margin-top: 4px;
        }
        .queue-empty-state .browse-btn:hover {
          background: var(--divider-color, rgba(255, 255, 255, 0.08));
        }

        /* ── Equalizer animation ──────────────────── */
        @keyframes eq-bar1 { 0%,100%{height:3px} 50%{height:12px} }
        @keyframes eq-bar2 { 0%,100%{height:8px} 50%{height:4px} }
        @keyframes eq-bar3 { 0%,100%{height:5px} 50%{height:11px} }
        .eq-bars {
          display: flex;
          align-items: flex-end;
          gap: 2px;
          height: 14px;
          flex-shrink: 0;
        }
        .eq-bars span {
          width: 3px;
          background: var(--primary-color, #03a9f4);
          border-radius: 1px;
        }
        .eq-bars span:nth-child(1) { animation: eq-bar1 0.8s ease-in-out infinite; }
        .eq-bars span:nth-child(2) { animation: eq-bar2 0.6s ease-in-out infinite 0.1s; }
        .eq-bars span:nth-child(3) { animation: eq-bar3 0.7s ease-in-out infinite 0.2s; }

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
      `]}constructor(){super(),this._adapter=new ge,this._adapterConnected=!1,this._queue=[],this._activeView="now-playing",this._navMode="collapsed",this._showQueue=!1,this._showNavFlyout=!1,this._isFavorite=!1,this._favoritesCache=[],this._lastUri=null,this._keyHandler=this._onKeyDown.bind(this),this._browseStack=[],this._browseItems=[],this._browseLoading=!1,this._browseContext=null,this._searchResults=null,this._searchLoading=!1,this._searchQuery="",this._searchTrail=[],this._browseSources=[],this._activeSourceUri="",this._ctxOpen=!1,this._ctxX=0,this._ctxY=0,this._ctxItems=[],this._ctxTarget=null,this._ctxPlaylists=[],this._toastMessage="",this._toastOpen=!1,this._toastUndo=null,this._toastUndoData=null,this._queueConfirmClear=!1,this._queueSaveOpen=!1,this._queueSaveName="",this._dragIndex=-1,this._dragOverIndex=-1}connectedCallback(){super.connectedCallback(),this._applyBreakpoint(),window.addEventListener("resize",this._onResize),window.addEventListener("keydown",this._keyHandler),this._adapter.onQueueChange(e=>{this._queue=e})}disconnectedCallback(){super.disconnectedCallback(),this._adapter.disconnect(),window.removeEventListener("resize",this._onResize),window.removeEventListener("keydown",this._keyHandler)}_onResize=()=>{this._applyBreakpoint()};_applyBreakpoint(){const e=window.innerWidth;e>=1400?(this._navMode="pinned",this._showQueue=!0):e>=1024?this._navMode="collapsed":(this._navMode="hidden",this._showQueue=!1)}willUpdate(e){this.hass&&(e.has("hass")||e.has("panel"))&&(this._adapterConnected?this._adapter.updateHass(this.hass,this.panel):(this._adapter.connect({hass:this.hass,panel:this.panel}),this._adapterConnected=!0))}updated(e){if(this.hass&&(e.has("hass")||e.has("panel"))){this._adapter.ready&&0===this._browseSources.length&&this._fetchBrowseSources();const e=this._adapter.getState().uri||null;e!==this._lastUri&&(this._lastUri=e,e&&this._adapter.ready?this._checkFavorite():this._isFavorite=!1)}}async _callService(e,t={}){return await this._adapter.call(e,t)}_getQualityInfo(){const e=this._adapter.getState();if("unavailable"===e.state)return null;return he({trackType:e.trackType,samplerate:e.samplerate,bitdepth:e.bitdepth,bitrate:e.bitrate,isStream:"channel"===e._raw?.media_content_type})}render(){const e=this._adapter.getState(),t=this._getQualityInfo(),i=be(e.albumArt,""),a=this._adapter.getVolumioUrl(),o=this._getNavSources();return V`
      <div class="shell" @volumio-context-menu=${this._onContextMenuRequest}>
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
          ${this._renderLeftZone(o)}

          <div class="center-zone">
            ${"browse"===this._activeView&&this._browseStack.length>0?V`
              <volumio-breadcrumb-bar
                .trail=${this._browseStack}
                @volumio-breadcrumb-click=${this._onBreadcrumbClick}
              ></volumio-breadcrumb-bar>
            `:""}
            ${this._searchTrail.length>0&&("album-detail"===this._activeView||"artist-detail"===this._activeView)?V`
              <volumio-breadcrumb-bar
                .trail=${this._searchTrail}
                @volumio-breadcrumb-click=${this._onSearchBreadcrumbClick}
              ></volumio-breadcrumb-bar>
            `:""}
            ${"album-detail"===this._activeView||"artist-detail"===this._activeView?this._renderCenterContent(e,t,i):this._searchQuery?this._renderSearchView(e,a):this._renderCenterContent(e,t,i)}
          </div>

          ${this._renderRightZone()}
        </div>

        <volumio-player-bar
          player-state="${e.state}"
          title="${e.title}"
          artist="${e.artist}"
          album-art="${i}"
          .duration=${e.duration}
          .position=${e.position}
          position-updated-at="${e.positionUpdatedAt}"
          .volume=${e.volume}
          ?muted=${e.muted}
          ?shuffle=${e.shuffle}
          repeat="${e.repeat}"
          .quality=${t}
          source="${e.source}"
          .volumeEnabled=${e.volumeEnabled}
          .isFavorite=${this._isFavorite}
          @volumio-command=${this._onCommand}
          @volumio-navigate=${this._onNavigate}
          @volumio-toggle-favorite=${this._onToggleFavorite}
        ></volumio-player-bar>
      </div>

      ${this._showNavFlyout?V`
        <div class="flyout-scrim" @click=${()=>this._showNavFlyout=!1}></div>
        <div class="flyout-panel left">
          <volumio-left-nav
            .sources=${o}
            mode="flyout"
            active-view="${this._activeView}"
            active-source="${this._activeSourceUri}"
            @volumio-navigate=${this._onNavigate}
            @volumio-nav-pin=${this._onNavPin}
          ></volumio-left-nav>
        </div>
      `:""}

      <volumio-context-menu
        ?open=${this._ctxOpen}
        .x=${this._ctxX}
        .y=${this._ctxY}
        .items=${this._ctxItems}
        .submenuItems=${this._ctxPlaylists}
        @volumio-context-action=${this._onContextAction}
        @volumio-context-close=${()=>{this._ctxOpen=!1}}
      ></volumio-context-menu>

      <volumio-toast-notification
        ?open=${this._toastOpen}
        message="${this._toastMessage}"
        undo-action="${this._toastUndo||""}"
        @volumio-toast-undo=${this._onToastUndo}
        @volumio-toast-dismiss=${()=>{this._toastOpen=!1}}
      ></volumio-toast-notification>
    `}_renderLeftZone(e){return"hidden"===this._navMode?V``:V`
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
    `}_renderRightZone(){if(!this._showQueue)return V``;const e=this._adapter.getState().queuePosition,t=this._adapter.getVolumioUrl();return V`
      <div class="right-zone pinned">
        <div class="queue-panel">
          <div class="queue-header">
            <span class="queue-title">Queue</span>
            <span class="queue-count">${this._queue.length} track${1!==this._queue.length?"s":""}</span>
            <div class="queue-actions">
              <button class="queue-clear-btn" @click=${this._onQueueSaveStart} title="Save as playlist">
                <ha-icon icon="mdi:content-save-outline"></ha-icon>
              </button>
              <button class="queue-clear-btn" @click=${this._onQueueClearClick} title="Clear queue">
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
          </div>
          ${this._queueConfirmClear?V`
            <div class="confirm-bar">
              <span>Clear queue?</span>
              <div class="confirm-btns">
                <button class="btn-yes" @click=${this._onQueueClear}>Yes</button>
                <button class="btn-no" @click=${()=>{this._queueConfirmClear=!1}}>No</button>
              </div>
            </div>
          `:""}
          ${this._queueSaveOpen?V`
            <div class="save-dialog">
              <input
                type="text"
                placeholder="Playlist name"
                .value=${this._queueSaveName}
                @input=${e=>{this._queueSaveName=e.target.value}}
                @keydown=${e=>{"Enter"===e.key&&this._onQueueSaveConfirm(),"Escape"===e.key&&(this._queueSaveOpen=!1)}}
              />
              <button @click=${this._onQueueSaveConfirm}>Save</button>
            </div>
          `:""}
          <div class="queue-list">
            ${0===this._queue.length?V`
                <div class="queue-empty-state">
                  <ha-icon icon="mdi:playlist-music-outline"></ha-icon>
                  <div>Queue is empty</div>
                  <div>Browse for music to start playing.</div>
                  <button class="browse-btn" @click=${()=>this._onNavigate({detail:{view:"browse"}})}>Browse</button>
                </div>`:this._queue.map((i,a)=>V`
                <div
                  class="queue-item ${a===e?"playing":""} ${a===this._dragIndex?"dragging":""} ${a===this._dragOverIndex?this._dragIndex<a?"drag-over-below":"drag-over-above":""}"
                  @click=${()=>this._onQueueItemClick(a)}
                  @contextmenu=${e=>this._onQueueContextMenu(e,i,a)}
                >
                  <div class="qi-drag"
                    @pointerdown=${e=>this._onDragStart(e,a)}
                  >
                    <ha-icon icon="mdi:drag-horizontal-variant"></ha-icon>
                  </div>
                  <div class="qi-art">
                    ${i.albumart?V`<img src="${be(i.albumart,t)}" alt="" loading="lazy" />`:V`<ha-icon icon="mdi:music-note"></ha-icon>`}
                  </div>
                  <div class="qi-info">
                    <div class="qi-title">${i.name||i.title||"—"}</div>
                    <div class="qi-artist">${i.artist||""}</div>
                  </div>
                  ${a===e?V`<div class="eq-bars"><span></span><span></span><span></span></div>`:""}
                  <button class="qi-remove" @click=${e=>this._onQueueRemove(e,a)} title="Remove">
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>
                </div>
              `)}
          </div>
        </div>
      </div>
    `}_renderCenterContent(e,t,i){const a=this._adapter.getVolumioUrl();switch(this._activeView){case"now-playing":return V`
          <volumio-now-playing
            player-state="${e.state}"
            title="${e.title}"
            artist="${e.artist}"
            album="${e.album}"
            album-art="${i}"
            .quality=${t}
            source="${e.source}"
            .isFavorite=${this._isFavorite}
            @volumio-command=${this._onCommand}
            @volumio-navigate=${this._onNavigate}
            @volumio-toggle-favorite=${this._onToggleFavorite}
          ></volumio-now-playing>
        `;case"browse":return this._renderBrowseView(e,a);case"album-detail":return this._renderAlbumDetail(e,a);case"artist-detail":return this._renderArtistDetail(a);case"playlists":return this._renderPlaceholder("Playlists","mdi:playlist-music-outline","Your playlists — coming in T20");case"favorites":return this._renderPlaceholder("Favorites","mdi:heart","Your favorites — coming in T20");case"history":return this._renderPlaceholder("History","mdi:history","Recently played — coming in T20");case"settings":return this._renderPlaceholder("Settings","mdi:cog","Panel settings — coming in T20");default:return this._renderPlaceholder("","mdi:help-circle",`Unknown view: ${this._activeView}`)}}_renderBrowseView(e,t){return 0===this._browseStack.length?V`
        <volumio-browse-source-grid
          .sources=${this._browseSources}
          volumio-url="${t}"
          @volumio-source-select=${this._onSourceSelect}
        ></volumio-browse-source-grid>
      `:V`
      <volumio-browse-list
        .items=${this._browseItems}
        ?loading=${this._browseLoading}
        current-uri="${e.uri}"
        volumio-url="${t}"
        @volumio-item-click=${this._onBrowseItemClick}
        @volumio-item-play=${this._onBrowseItemPlay}
      ></volumio-browse-list>
    `}_renderAlbumDetail(e,t){const i=this._browseContext||{};return V`
      <volumio-album-detail
        album-title="${i.title||""}"
        album-artist="${i.artist||""}"
        album-art="${i.albumart||""}"
        album-uri="${i.uri||""}"
        album-service="${i.service||""}"
        .tracks=${this._browseItems}
        ?loading=${this._browseLoading}
        current-uri="${e.uri}"
        volumio-url="${t}"
        @volumio-track-click=${this._onTrackPlay}
        @volumio-album-play=${this._onAlbumPlay}
        @volumio-album-add-queue=${this._onAlbumAddQueue}
        @volumio-navigate=${this._onNavigate}
      ></volumio-album-detail>
    `}_renderArtistDetail(e){const t=this._browseContext||{};return V`
      <volumio-artist-detail
        artist-name="${t.artist||t.title||""}"
        .items=${this._browseItems}
        ?loading=${this._browseLoading}
        volumio-url="${e}"
        @volumio-card-click=${this._onBrowseItemClick}
        @volumio-card-play=${this._onBrowseItemPlay}
      ></volumio-artist-detail>
    `}_renderSearchView(e,t){return V`
      <volumio-search-results
        .results=${this._searchResults}
        ?loading=${this._searchLoading}
        query="${this._searchQuery}"
        volumio-url="${t}"
        current-uri="${e.uri}"
        @volumio-card-click=${this._onBrowseItemClick}
        @volumio-card-play=${this._onBrowseItemPlay}
        @volumio-track-click=${this._onTrackPlay}
      ></volumio-search-results>
    `}_renderPlaceholder(e,t,i){return V`
      <div class="placeholder-view">
        <ha-icon icon="${t}"></ha-icon>
        <div class="view-title">${e}</div>
        <div class="view-desc">${i}</div>
      </div>
    `}_onNavigate(e){const{view:t,source:i,sourceUri:a,artist:o,album:s,pluginName:r}=e.detail||{};if(t)switch(t){case"browse":this._activeView="browse",this._showNavFlyout=!1,this._searchTrail=[],this._searchQuery="",this._searchResults=null,a?(this._activeSourceUri=a||"",this._browseStack=[],this._browseTo(a,i||"Browse")):0===this._browseStack.length&&(this._activeSourceUri="",this._browseItems=[]);break;case"album-detail":this._activeView="album-detail",this._showNavFlyout=!1;break;case"artist-detail":if(this._activeView="artist-detail",this._showNavFlyout=!1,o){this._browseContext={artist:o,title:o};const e=`globalUriArtist/${encodeURIComponent(o)}`;this._browseToArtist(e,o)}break;default:this._activeView=t,this._showNavFlyout=!1,this._searchQuery="",this._searchResults=null,this._searchTrail=[]}}_onToggleNav(){"hidden"===this._navMode?this._showNavFlyout=!this._showNavFlyout:"collapsed"===this._navMode?this._navMode="pinned":this._navMode="collapsed"}_onNavPin(e){this._navMode=e.detail.pinned?"pinned":"collapsed",this._showNavFlyout=!1}_onToggleQueue(){this._showQueue=!this._showQueue}_onBack(){if(this._searchTrail.length>0&&("album-detail"===this._activeView||"artist-detail"===this._activeView))if(this._searchTrail.length>1){this._searchTrail=this._searchTrail.slice(0,-1);const e=this._searchTrail[this._searchTrail.length-1];"artist-detail"===e.view?(this._activeView="artist-detail",this._browseContext=e,this._browseToArtist(e.uri,e.title)):(this._activeView="browse",this._searchTrail=[])}else this._activeView="browse",this._searchTrail=[];else{if(this._searchQuery)return this._searchQuery="",this._searchResults=null,void(this._searchTrail=[]);if("album-detail"!==this._activeView&&"artist-detail"!==this._activeView)if(this._browseStack.length>1){this._browseStack=this._browseStack.slice(0,-1);const e=this._browseStack[this._browseStack.length-1];this._loadBrowseItems(e.uri)}else 1===this._browseStack.length?(this._browseStack=[],this._browseItems=[],this._activeSourceUri=""):"now-playing"!==this._activeView&&(this._activeView="now-playing");else this._activeView="browse"}}async _fetchBrowseSources(){if(this._adapter.ready)try{const e=await this._callService("get_browse_sources",{}),t=e?.response?.sources||[];t.length>0&&(this._browseSources=t)}catch(e){console.warn("[volumio-panel] get_browse_sources failed:",e.message)}}_getNavSources(){if(this._browseSources.length>0)return this._browseSources;const e=this._adapter.getState();return(e._raw?.source_list||[]).map(e=>({name:e,plugin_name:e.toLowerCase().replace(/\s+/g,""),plugin_type:"music_service",uri:"",albumart:""}))}async _browseTo(e,t){this._browseStack=[...this._browseStack,{uri:e,title:t}],await this._loadBrowseItems(e)}async _browseToArtist(e,t){this._browseLoading=!0;try{const t=await this._callService("browse",{uri:e}),i=(t?.response?.navigation||t?.navigation||{}).lists||[],a=[];for(const e of i)e.items&&a.push(...e.items);this._browseItems=a}catch(e){console.error("[volumio-panel] Artist browse failed:",e),this._browseItems=[]}this._browseLoading=!1}async _loadBrowseItems(e){if(this._adapter.ready){this._browseLoading=!0,this._browseItems=[];try{const t=await this._callService("browse",{uri:e}),i=(t?.response?.navigation||t?.navigation||{}).lists||[],a=[];for(const e of i)e.items&&a.push(...e.items);this._browseItems=a}catch(e){console.error("[volumio-panel] Browse failed:",e),this._browseItems=[]}this._browseLoading=!1}}_onSourceSelect(e){const{uri:t,name:i,plugin_name:a}=e.detail;this._activeSourceUri=t||"",this._browseStack=[],this._browseTo(t,i)}_onBrowseItemClick(e){const t=e.detail,i=t.type||"folder";if(new Set(["song","track","webradio","mywebradio","cuesong"]).has(i))this._onTrackPlay(e);else{if("album"===i){if(this._searchQuery||this._searchTrail.length>0){const e=this._searchTrail.length>0?[...this._searchTrail]:[{title:`Search "${this._searchQuery}"`,uri:"__search__",view:"search"}];1===e.length&&t.service&&e.push({title:Se(t.service),uri:"__source__",view:"source"}),e.push({title:t.title,uri:t.uri,view:"album-detail",service:t.service||""}),this._searchTrail=e}return this._browseContext={title:t.title,artist:t.artist||"",albumart:t.albumart||"",uri:t.uri,service:t.service||""},this._activeView="album-detail",void this._loadBrowseItems(t.uri)}if("artist"===i){if(this._searchQuery||this._searchTrail.length>0){const e=this._searchTrail.length>0?[...this._searchTrail]:[{title:`Search "${this._searchQuery}"`,uri:"__search__",view:"search"}];1===e.length&&t.service&&e.push({title:Se(t.service),uri:"__source__",view:"source"}),e.push({title:t.title,uri:t.uri,view:"artist-detail",service:t.service||""}),this._searchTrail=e}return this._browseContext={title:t.title,artist:t.title||"",uri:t.uri,service:t.service||""},this._activeView="artist-detail",void this._browseToArtist(t.uri,t.title)}0===this._searchTrail.length&&(this._searchQuery="",this._searchResults=null),this._browseTo(t.uri,t.title||"Browse")}}async _onBrowseItemPlay(e){const t=e.detail;try{await this._callService("replace_and_play",{uri:t.uri,title:t.title||"",service:t.service||"",artist:t.artist||"",albumart:t.albumart||""}),this._refreshQueue()}catch(e){console.error("[volumio-panel] Play failed:",e)}}async _onTrackPlay(e){const t=e.detail,i=this._getDefaultClickAction();try{"add_to_queue"===i?(await this._callService("queue_add",{uri:t.uri,title:t.title||"",service:t.service||"",artist:t.artist||"",album:t.album||"",albumart:t.albumart||""}),this._refreshQueue(),this._showToast("Added to queue")):(await this._callService("replace_and_play",{uri:t.uri,title:t.title||"",service:t.service||"",artist:t.artist||"",album:t.album||"",albumart:t.albumart||"",type:t.type||"song"}),this._refreshQueue())}catch(e){console.error("[volumio-panel] Track play failed:",e)}}async _onAlbumPlay(e){const{uri:t}=e.detail;try{await this._callService("replace_and_play",{uri:t,service:this._browseContext?.service||""}),this._refreshQueue()}catch(e){console.error("[volumio-panel] Album play failed:",e)}}async _onAlbumAddQueue(e){const{uri:t}=e.detail;try{await this._callService("queue_add",{uri:t}),this._refreshQueue(),this._showToast("Added to queue")}catch(e){console.error("[volumio-panel] Album queue add failed:",e)}}async _onQueueItemClick(e){try{await this._callService("queue_play_index",{index:e})}catch(e){console.error("[volumio-panel] Queue play index failed:",e)}}_onQueueClearClick(){this._queueConfirmClear=!0}async _onQueueClear(){this._queueConfirmClear=!1;const e=this._adapter.getState(),t="playing"===e.state||"paused"===e.state;try{if(t&&e.uri){const t={uri:e.uri,title:e.title,artist:e.artist,album:e.album,service:e.source};await this._callService("queue_clear",{}),await this._callService("replace_and_play",t)}else await this._callService("queue_clear",{});this._refreshQueue(),this._showToast("Queue cleared")}catch(e){console.error("[volumio-panel] Queue clear failed:",e)}}async _onAddItemToQueue(e){const t=e.detail;try{await this._callService("queue_add",{uri:t.uri,title:t.title||"",service:t.service||"",artist:t.artist||"",album:t.album||"",albumart:t.albumart||""}),this._refreshQueue(),this._showToast("Added to queue")}catch(e){console.error("[volumio-panel] Add to queue failed:",e)}}async _refreshQueue(){if(this._adapter.ready)try{const e=await this._adapter.call("queue_get");e?.response?.queue&&(this._queue=[...e.response.queue])}catch(e){}}async _onQueueRemove(e,t){e.stopPropagation();const i=this._queue[t];try{await this._callService("queue_remove",{index:t}),this._refreshQueue(),this._showToast("Removed from queue","undo_queue_remove"),this._toastUndoData={item:i,index:t}}catch(e){console.error("[volumio-panel] Queue remove failed:",e)}}_onQueueContextMenu(e,t,i){e.preventDefault(),e.stopPropagation(),this._ctxTarget={...t,index:i,context:"queue"},this._ctxItems=this._buildContextItems("queue"),this._ctxX=e.clientX,this._ctxY=e.clientY,this._ctxOpen=!0}_onQueueSaveStart(){0!==this._queue.length&&(this._queueSaveName="",this._queueSaveOpen=!0,this.updateComplete.then(()=>{const e=this.shadowRoot?.querySelector(".save-dialog input");e&&e.focus()}))}async _onQueueSaveConfirm(){const e=this._queueSaveName.trim();if(e){this._queueSaveOpen=!1;try{await this._callService("save_queue_to_playlist",{name:e}),this._showToast(`Saved as playlist "${e}"`)}catch(e){console.error("[volumio-panel] Save playlist failed:",e),this._showToast("Failed to save playlist")}}}_onDragStart(e,t){e.preventDefault(),e.stopPropagation(),this._dragIndex=t,this._dragOverIndex=-1;const i=e=>{const t=this.shadowRoot?.querySelector(".queue-list");if(!t)return;const i=t.querySelectorAll(".queue-item");let a=-1,o=1/0;i.forEach((t,i)=>{const s=t.getBoundingClientRect(),r=s.top+s.height/2,n=Math.abs((e.clientY||e.touches?.[0]?.clientY||0)-r);n<o&&(o=n,a=i)}),a!==this._dragOverIndex&&(this._dragOverIndex=a)},a=async()=>{document.removeEventListener("pointermove",i),document.removeEventListener("pointerup",a),document.removeEventListener("pointercancel",a);const e=this._dragIndex,t=this._dragOverIndex;if(this._dragIndex=-1,this._dragOverIndex=-1,e>=0&&t>=0&&e!==t)try{await this._callService("queue_move",{from_index:e,to_index:t}),this._refreshQueue()}catch(e){console.error("[volumio-panel] Queue move failed:",e)}};document.addEventListener("pointermove",i),document.addEventListener("pointerup",a),document.addEventListener("pointercancel",a)}async _onContextMenuRequest(e){e.stopPropagation();const t=e.detail;this._ctxTarget=t,this._ctxItems=this._buildContextItems(t.context||"track"),this._ctxX=t.x,this._ctxY=t.y;try{const e=await this._callService("playlist_list",{}),t=e?.response?.playlists||[];this._ctxPlaylists=t.map(e=>({key:e,label:e}))}catch{this._ctxPlaylists=[]}this._ctxOpen=!0}_buildContextItems(e){const t=[];return"album"===e?(t.push({key:"play",label:"Play",icon:"mdi:play"}),t.push({key:"play_next",label:"Play Next",icon:"mdi:skip-next"}),t.push({key:"add_to_queue",label:"Add to Queue",icon:"mdi:playlist-plus"}),t.push({separator:!0}),t.push({key:"add_to_favorites",label:"Add to Favorites",icon:"mdi:heart-outline"}),t.push({key:"add_to_playlist",label:"Add to Playlist",icon:"mdi:playlist-music",submenu:!0}),t.push({separator:!0}),t.push({key:"go_to_album",label:"Go to Album",icon:"mdi:album"}),t.push({key:"go_to_artist",label:"Go to Artist",icon:"mdi:account-music"})):"queue"===e?(t.push({key:"play",label:"Play Now",icon:"mdi:play"}),t.push({key:"play_next",label:"Play Next",icon:"mdi:skip-next"}),t.push({key:"add_to_queue",label:"Add to Queue",icon:"mdi:playlist-plus"}),t.push({separator:!0}),t.push({key:"add_to_favorites",label:"Add to Favorites",icon:"mdi:heart-outline"}),t.push({key:"add_to_playlist",label:"Add to Playlist",icon:"mdi:playlist-music",submenu:!0}),t.push({separator:!0}),t.push({key:"go_to_album",label:"Go to Album",icon:"mdi:album"}),t.push({key:"go_to_artist",label:"Go to Artist",icon:"mdi:account-music"}),t.push({separator:!0}),t.push({key:"remove",label:"Remove",icon:"mdi:close"})):(t.push({key:"play",label:"Play Now",icon:"mdi:play"}),t.push({key:"play_next",label:"Play Next",icon:"mdi:skip-next"}),t.push({key:"add_to_queue",label:"Add to Queue",icon:"mdi:playlist-plus"}),t.push({separator:!0}),t.push({key:"add_to_favorites",label:"Add to Favorites",icon:"mdi:heart-outline"}),t.push({key:"add_to_playlist",label:"Add to Playlist",icon:"mdi:playlist-music",submenu:!0}),t.push({separator:!0}),t.push({key:"go_to_album",label:"Go to Album",icon:"mdi:album"}),t.push({key:"go_to_artist",label:"Go to Artist",icon:"mdi:account-music"})),t}async _onContextAction(e){const{action:t,playlist:i}=e.detail,a=this._ctxTarget;if(a)try{switch(t){case"play":"queue"===a.context&&null!=a.index?await this._callService("queue_play_index",{index:a.index}):(await this._callService("replace_and_play",{uri:a.uri,title:a.title||"",service:a.service||"",artist:a.artist||"",album:a.album||"",albumart:a.albumart||"",type:a.type||"song"}),this._refreshQueue());break;case"play_next":{await this._callService("queue_add",{uri:a.uri,title:a.title||"",service:a.service||"",artist:a.artist||"",album:a.album||"",albumart:a.albumart||""});const e=this._adapter.getState().queuePosition,t=this._queue.length;t>e+1&&await this._callService("queue_move",{from_index:t,to_index:e+1}),this._refreshQueue(),this._showToast("Playing next");break}case"add_to_queue":await this._callService("queue_add",{uri:a.uri,title:a.title||"",service:a.service||"",artist:a.artist||"",album:a.album||"",albumart:a.albumart||""}),this._refreshQueue(),this._showToast("Added to queue");break;case"add_to_favorites":await this._callService("favorites_add",{uri:a.uri,title:a.title||"",service:a.service||""}),this._showToast("Added to favorites");break;case"add_to_playlist":if("__new__"===i){const e=prompt("New playlist name:");e&&(await this._callService("playlist_create",{name:e}),await this._callService("playlist_add_track",{name:e,uri:a.uri,service:a.service||""}),this._showToast(`Added to "${e}"`))}else i&&(await this._callService("playlist_add_track",{name:i,uri:a.uri,service:a.service||""}),this._showToast(`Added to "${i}"`));break;case"go_to_album":(a.album||a.title)&&(this._browseContext={title:a.album||a.title,artist:a.artist||"",albumart:a.albumart||"",uri:a.uri,service:a.service||""},this._activeView="album-detail",a.uri&&this._loadBrowseItems(a.uri));break;case"go_to_artist":if(a.artist){const e=`globalUriArtist/${encodeURIComponent(a.artist)}`;this._browseContext={title:a.artist,artist:a.artist,uri:e,service:a.service||""},this._activeView="artist-detail",this._browseToArtist(e,a.artist)}break;case"remove":"queue"===a.context&&null!=a.index&&(await this._callService("queue_remove",{index:a.index}),this._refreshQueue(),this._showToast("Removed from queue","undo_queue_remove"),this._toastUndoData={item:a,index:a.index})}}catch(e){console.error("[volumio-panel] Context action failed:",e),this._showToast("Action failed")}}_showToast(e,t=null){this._toastMessage=e,this._toastUndo=t,this._toastOpen=!0}async _onToastUndo(e){const{action:t}=e.detail;if("undo_queue_remove"===t&&this._toastUndoData){const{item:e,index:t}=this._toastUndoData;try{await this._callService("queue_add",{uri:e.uri,title:e.title||e.name||"",service:e.service||"",artist:e.artist||"",album:e.album||"",albumart:e.albumart||""});const i=this._queue.length;t<i&&await this._callService("queue_move",{from_index:i,to_index:t}),this._refreshQueue()}catch(e){console.error("[volumio-panel] Undo failed:",e)}}this._toastUndoData=null}_getDefaultClickAction(){return localStorage.getItem("volumio-default-click")||"play_now"}_onBreadcrumbClick(e){const{index:t}=e.detail;this._browseStack=this._browseStack.slice(0,t+1);const i=this._browseStack[this._browseStack.length-1];"browse"!==this._activeView&&(this._activeView="browse"),this._loadBrowseItems(i.uri)}async _onSearch(e){const{query:t}=e.detail;if(t&&!(t.length<2)&&this._adapter.ready){this._searchQuery=t,this._searchLoading=!0,this._searchResults=null,this._searchTrail=[],"album-detail"!==this._activeView&&"artist-detail"!==this._activeView||(this._activeView="browse");try{const e=await this._callService("search",{query:t});this._searchResults=e?.response||e||null}catch(e){console.error("[volumio-panel] Search failed:",e),this._searchResults=null}this._searchLoading=!1}}_onSearchClear(){this._searchQuery="",this._searchResults=null,this._searchLoading=!1,this._searchTrail=[]}_onSearchBreadcrumbClick(e){const{index:t}=e.detail,i=this._searchTrail[t];i&&("search"===i.view||0===t?(this._activeView="browse",this._searchTrail=[]):"artist-detail"===i.view?(this._searchTrail=this._searchTrail.slice(0,t+1),this._browseContext={title:i.title,artist:i.title,uri:i.uri,service:i.service||""},this._activeView="artist-detail",this._browseToArtist(i.uri,i.title)):"album-detail"===i.view&&(this._searchTrail=this._searchTrail.slice(0,t+1),this._activeView="album-detail",this._loadBrowseItems(i.uri)))}async _onCommand(e){const{command:t,value:i}=e.detail;if("unavailable"!==this._adapter.getState().state)try{switch(t){case"play_pause":await this._adapter.playPause();break;case"next":await this._adapter.next();break;case"prev":await this._adapter.prev();break;case"seek":await this._adapter.seek(i);break;case"volume_set":await this._adapter.setVolume(i);break;case"mute_toggle":await this._adapter.toggleMute();break;case"shuffle_set":await this._adapter.setShuffle(i);break;case"repeat_set":await this._adapter.setRepeat(i);break;default:console.warn("[volumio-panel] Unknown command:",t)}}catch(e){console.error("[volumio-panel] Command failed:",t,e)}}async _checkFavorite(){if(this._adapter.ready)try{const e=await this._adapter.call("favorites_list"),t=e?.response?.items||[];this._favoritesCache=t;const i=this._adapter.getState();this._isFavorite=!(!i.uri||!t.some(e=>e?.uri===i.uri))}catch(e){console.error("[volumio-panel] favorites_list failed:",e)}}async _onToggleFavorite(){const e=this._adapter.getState();if(!this._adapter.ready||!e.uri)return;const t=this._isFavorite;this._isFavorite=!t;try{t?await this._callService("favorites_remove",{uri:e.uri,service:e.source}):await this._callService("favorites_add",{uri:e.uri,title:e.title,service:e.source}),setTimeout(()=>this._checkFavorite(),500)}catch(e){console.error("[volumio-panel] Favorite toggle failed:",e),this._isFavorite=t}}_onKeyDown(e){const t=e.composedPath?.()?.[0]||e.target;if("INPUT"===t.tagName||"TEXTAREA"===t.tagName)return;if(!this.isConnected)return;const i=this._adapter.getState();if("unavailable"!==i.state)switch(e.key){case" ":e.preventDefault(),this._onCommand({detail:{command:"play_pause"}});break;case"ArrowRight":if(e.shiftKey)e.preventDefault(),this._onCommand({detail:{command:"next"}});else{e.preventDefault();const t=(i.position||0)+10;this._onCommand({detail:{command:"seek",value:t}})}break;case"ArrowLeft":if(e.shiftKey)e.preventDefault(),this._onCommand({detail:{command:"prev"}});else{e.preventDefault();const t=Math.max(0,(i.position||0)-10);this._onCommand({detail:{command:"seek",value:t}})}break;case"ArrowUp":e.preventDefault();{const e=Math.min(100,i.volume+2);this._onCommand({detail:{command:"volume_set",value:e}})}break;case"ArrowDown":e.preventDefault();{const e=Math.max(0,i.volume-2);this._onCommand({detail:{command:"volume_set",value:e}})}break;case"m":case"M":this._onCommand({detail:{command:"mute_toggle"}});break;case"s":case"S":this._onCommand({detail:{command:"shuffle_set",value:!i.shuffle}});break;case"r":case"R":{const e=i.repeat,t="off"===e?"all":"all"===e?"one":"off";this._onCommand({detail:{command:"repeat_set",value:t}})}break;case"/":e.preventDefault(),this.shadowRoot?.querySelector("volumio-top-bar")?.shadowRoot?.querySelector(".search-field input")?.focus();break;case"Escape":this._searchQuery&&this._onSearchClear(),this._showNavFlyout=!1}}});
