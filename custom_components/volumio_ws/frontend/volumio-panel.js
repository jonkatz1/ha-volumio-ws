const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),a=new WeakMap;let s=class{constructor(t,e,a){if(this._$cssResult$=!0,a!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=a.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&a.set(i,t))}return t}toString(){return this.cssText}};const o=(t,...e)=>{const a=1===t.length?t[0]:e.reduce((e,i,a)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[a+1],t[0]);return new s(a,t,i)},r=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:n,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:u,getPrototypeOf:p}=Object,h=globalThis,m=h.trustedTypes,v=m?m.emptyScript:"",b=h.reactiveElementPolyfillSupport,g=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?v:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},_=(t,e)=>!n(t,e),x={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:_};Symbol.metadata??=Symbol("metadata"),h.litPropertyMetadata??=new WeakMap;let f=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),a=this.getPropertyDescriptor(t,i,e);void 0!==a&&l(this.prototype,t,a)}}static getPropertyDescriptor(t,e,i){const{get:a,set:s}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:a,set(e){const o=a?.call(this);s?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(g("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(g("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(g("properties"))){const t=this.properties,e=[...d(t),...u(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,a)=>{if(e)i.adoptedStyleSheets=a.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of a){const a=document.createElement("style"),s=t.litNonce;void 0!==s&&a.setAttribute("nonce",s),a.textContent=e.cssText,i.appendChild(a)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),a=this.constructor._$Eu(t,i);if(void 0!==a&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(a):this.setAttribute(a,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,a=i._$Eh.get(t);if(void 0!==a&&this._$Em!==a){const t=i.getPropertyOptions(a),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=a;const o=s.fromAttribute(e,t.type);this[a]=o??this._$Ej?.get(a)??o,this._$Em=null}}requestUpdate(t,e,i,a=!1,s){if(void 0!==t){const o=this.constructor;if(!1===a&&(s=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??_)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:a,wrapped:s},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==s||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===a&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,a=this[e];!0!==t||this._$AL.has(e)||void 0===a||this.C(e,void 0,i,a)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};f.elementStyles=[],f.shadowRootOptions={mode:"open"},f[g("elementProperties")]=new Map,f[g("finalized")]=new Map,b?.({ReactiveElement:f}),(h.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=t=>t,$=w.trustedTypes,S=$?$.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",A=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+A,q=`<${E}>`,T=document,z=()=>T.createComment(""),I=t=>null===t||"object"!=typeof t&&"function"!=typeof t,P=Array.isArray,D="[ \t\n\f\r]",L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,M=/>/g,B=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),N=/'/g,V=/"/g,R=/^(?:script|style|textarea|title)$/i,Q=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),O=Symbol.for("lit-noChange"),j=Symbol.for("lit-nothing"),F=new WeakMap,H=T.createTreeWalker(T,129);function K(t,e){if(!P(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Y=(t,e)=>{const i=t.length-1,a=[];let s,o=2===e?"<svg>":3===e?"<math>":"",r=L;for(let e=0;e<i;e++){const i=t[e];let n,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===L?"!--"===l[1]?r=U:void 0!==l[1]?r=M:void 0!==l[2]?(R.test(l[2])&&(s=RegExp("</"+l[2],"g")),r=B):void 0!==l[3]&&(r=B):r===B?">"===l[0]?(r=s??L,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,n=l[1],r=void 0===l[3]?B:'"'===l[3]?V:N):r===V||r===N?r=B:r===U||r===M?r=L:(r=B,s=void 0);const u=r===B&&t[e+1].startsWith("/>")?" ":"";o+=r===L?i+q:c>=0?(a.push(n),i.slice(0,c)+C+i.slice(c)+A+u):i+A+(-2===c?e:u)}return[K(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),a]};class G{constructor({strings:t,_$litType$:e},i){let a;this.parts=[];let s=0,o=0;const r=t.length-1,n=this.parts,[l,c]=Y(t,e);if(this.el=G.createElement(l,i),H.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(a=H.nextNode())&&n.length<r;){if(1===a.nodeType){if(a.hasAttributes())for(const t of a.getAttributeNames())if(t.endsWith(C)){const e=c[o++],i=a.getAttribute(t).split(A),r=/([.?@])?(.*)/.exec(e);n.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?tt:"?"===r[1]?et:"@"===r[1]?it:J}),a.removeAttribute(t)}else t.startsWith(A)&&(n.push({type:6,index:s}),a.removeAttribute(t));if(R.test(a.tagName)){const t=a.textContent.split(A),e=t.length-1;if(e>0){a.textContent=$?$.emptyScript:"";for(let i=0;i<e;i++)a.append(t[i],z()),H.nextNode(),n.push({type:2,index:++s});a.append(t[e],z())}}}else if(8===a.nodeType)if(a.data===E)n.push({type:2,index:s});else{let t=-1;for(;-1!==(t=a.data.indexOf(A,t+1));)n.push({type:7,index:s}),t+=A.length-1}s++}}static createElement(t,e){const i=T.createElement("template");return i.innerHTML=t,i}}function W(t,e,i=t,a){if(e===O)return e;let s=void 0!==a?i._$Co?.[a]:i._$Cl;const o=I(e)?void 0:e._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),void 0===o?s=void 0:(s=new o(t),s._$AT(t,i,a)),void 0!==a?(i._$Co??=[])[a]=s:i._$Cl=s),void 0!==s&&(e=W(t,s._$AS(t,e.values),s,a)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,a=(t?.creationScope??T).importNode(e,!0);H.currentNode=a;let s=H.nextNode(),o=0,r=0,n=i[0];for(;void 0!==n;){if(o===n.index){let e;2===n.type?e=new Z(s,s.nextSibling,this,t):1===n.type?e=new n.ctor(s,n.name,n.strings,this,t):6===n.type&&(e=new at(s,this,t)),this._$AV.push(e),n=i[++r]}o!==n?.index&&(s=H.nextNode(),o++)}return H.currentNode=T,a}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class Z{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,a){this.type=2,this._$AH=j,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=a,this._$Cv=a?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=W(this,t,e),I(t)?t===j||null==t||""===t?(this._$AH!==j&&this._$AR(),this._$AH=j):t!==this._$AH&&t!==O&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>P(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==j&&I(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,a="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.p(e);else{const t=new X(a,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=F.get(t.strings);return void 0===e&&F.set(t.strings,e=new G(t)),e}k(t){P(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,a=0;for(const s of t)a===e.length?e.push(i=new Z(this.O(z()),this.O(z()),this,this.options)):i=e[a],i._$AI(s),a++;a<e.length&&(this._$AR(i&&i._$AB.nextSibling,a),e.length=a)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class J{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,a,s){this.type=1,this._$AH=j,this._$AN=void 0,this.element=t,this.name=e,this._$AM=a,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=j}_$AI(t,e=this,i,a){const s=this.strings;let o=!1;if(void 0===s)t=W(this,t,e,0),o=!I(t)||t!==this._$AH&&t!==O,o&&(this._$AH=t);else{const a=t;let r,n;for(t=s[0],r=0;r<s.length-1;r++)n=W(this,a[i+r],e,r),n===O&&(n=this._$AH[r]),o||=!I(n)||n!==this._$AH[r],n===j?t=j:t!==j&&(t+=(n??"")+s[r+1]),this._$AH[r]=n}o&&!a&&this.j(t)}j(t){t===j?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends J{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===j?void 0:t}}class et extends J{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==j)}}class it extends J{constructor(t,e,i,a,s){super(t,e,i,a,s),this.type=5}_$AI(t,e=this){if((t=W(this,t,e,0)??j)===O)return;const i=this._$AH,a=t===j&&i!==j||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==j&&(i===j||a);a&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class at{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){W(this,t)}}const st=w.litHtmlPolyfillSupport;st?.(G,Z),(w.litHtmlVersions??=[]).push("3.3.2");const ot=globalThis;class rt extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const a=i?.renderBefore??e;let s=a._$litPart$;if(void 0===s){const t=i?.renderBefore??null;a._$litPart$=s=new Z(e.insertBefore(z(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return O}}rt._$litElement$=!0,rt.finalized=!0,ot.litElementHydrateSupport?.({LitElement:rt});const nt=ot.litElementPolyfillSupport;nt?.({LitElement:rt}),(ot.litElementVersions??=[]).push("4.2.2");const lt=o`
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
`,ct=new Set(["flac","alac","wav","aiff","ape","wv","wavpack","dsf","dff","dsd"]),dt=new Set(["mp3","ogg","aac","opus","vorbis","wma","m4a"]),ut=new Set(["qobuz","tidal","spotify","spop","pandora","youtube","youtube2","webradio","mpd","upnp","airplay","snapcast","bluetooth"]);function pt({trackType:t,samplerate:e,bitdepth:i,bitrate:a,isStream:s}){const o=(r=t)?String(r).trim().toLowerCase().replace(/\s+/g,""):"";var r;const n=function(t){if(null==t)return null;if("number"==typeof t)return t;const e=String(t).trim().toLowerCase().match(/([\d.]+)/);if(!e)return null;const i=parseFloat(e[1]);return i>1e3?i/1e3:i}(e),l=function(t){if(null==t)return null;if("number"==typeof t)return t;const e=String(t).trim().match(/(\d+)/);return e?parseInt(e[1],10):null}(i),c=function(t){if(null==t)return null;if("number"==typeof t)return t;const e=String(t).trim().match(/([\d.]+)/);return e?parseFloat(e[1]):null}(a),d=ut.has(o)?"":o,u=ct.has(d),p=dt.has(d);if(s){return ht("stream",d?`${d.toUpperCase()}${c?` ${Math.round(c)}`:""}`:"STREAM","STREAM","var(--volumio-quality-stream)","var(--volumio-quality-stream-bg, rgba(66, 165, 245, 0.12))")}if(u&&(null!=l&&l>16||null!=n&&n>44.1))return ht("hires",yt(d,l,n),"HI-RES","var(--volumio-quality-hires)","var(--volumio-quality-hires-bg, rgba(212, 160, 23, 0.12))");if(u)return ht("lossless",yt(d,l,n),"LOSSLESS","var(--volumio-quality-lossless)","var(--volumio-quality-lossless-bg, rgba(0, 172, 193, 0.12))");if(!p&&(null!=l||null!=n)){if(null!=l&&l>16||null!=n&&n>44.1){return ht("hires",yt(d||"HI-RES",l,n),"HI-RES","var(--volumio-quality-hires)","var(--volumio-quality-hires-bg, rgba(212, 160, 23, 0.12))")}return ht("lossless",yt(d||"LOSSLESS",l,n),"LOSSLESS","var(--volumio-quality-lossless)","var(--volumio-quality-lossless-bg, rgba(0, 172, 193, 0.12))")}if(p){if(null!=c&&c<256)return ht("basic",`${d.toUpperCase()} ${Math.round(c)}`,"BASIC","var(--volumio-quality-basic, #616161)","rgba(97, 97, 97, 0.08)");return ht("high",d?`${d.toUpperCase()}${c?` ${Math.round(c)}`:""}`:"HIGH","HIGH","var(--volumio-quality-lossy)","var(--volumio-quality-lossy-bg, rgba(158, 158, 158, 0.08))")}return d&&null!=c?c<256?ht("basic",`${Math.round(c)} kbps`,"BASIC","var(--volumio-quality-basic, #616161)","rgba(97, 97, 97, 0.08)"):ht("high",`${Math.round(c)} kbps`,"HIGH","var(--volumio-quality-lossy)","var(--volumio-quality-lossy-bg, rgba(158, 158, 158, 0.08))"):ht("unknown","","","var(--secondary-text-color)","transparent")}function ht(t,e,i,a,s){return{tier:t,label:e,tierLabel:i,color:a,colorBg:s}}const mt=new Set(["qobuz","tidal"]),vt=new Set(["spotify","spop","youtube","youtube2","ytmusic"]),bt=new Set(["webradio","pandora"]);function gt(t){const e=t.trackType||t.tracktype,i=e?String(e).trim().toLowerCase():"",a=ut.has(i);if(null!=t.samplerate||null!=t.bitdepth||null!=t.bitrate||e&&!a)return pt({trackType:e,samplerate:t.samplerate,bitdepth:t.bitdepth,bitrate:t.bitrate,isStream:!1});const s=(t.uri||"").toLowerCase(),o=(t.service||(a?i:"")).toLowerCase();let r="";const n=s.match(/\.([a-z0-9]+)(?:[?#]|$)/);if(n){const t=n[1];["flac","alac","wav","aiff","aif","ape","wv","dsf","dff","dsd"].includes(t)||["mp3","ogg","opus","aac","wma"].includes(t)?r=t:"m4a"===t&&(r="aac")}return r||(mt.has(o)?r="flac":vt.has(o)&&(r="ogg")),pt({trackType:r,samplerate:null,bitdepth:null,bitrate:null,isStream:bt.has(o)})}function yt(t,e,i){const a=t.toUpperCase();return e&&i?`${a} ${e}/${i}`:e?`${a} ${e}-bit`:i?`${a} ${i}kHz`:a}function _t(t){if(!t||t<=0)return"0:00";const e=Math.floor(t),i=Math.floor(e/3600),a=Math.floor(e%3600/60),s=e%60;return i>0?`${i}:${a.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`:`${a}:${s.toString().padStart(2,"0")}`}function xt(t){const e=(new TextEncoder).encode(t);let i="";for(let t=0;t<e.length;t++)i+=String.fromCharCode(e[t]);return btoa(i).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}function ft(t,e,i){if(!t)return"";if(/\s/.test(t))return"";if(/^[a-z][a-z0-9+.-]*:/i.test(t)&&!/^https?:\/\//i.test(t))return"";if(/^\/api\//.test(t))return t;if(/^https:\/\//i.test(t))return t;if(/^http:\/\//i.test(t)){if(i&&e&&t.startsWith(e)){const a=t.substring(e.length);return`/api/volumio_ws/art?entry=${encodeURIComponent(i)}&path=${xt(a)}`}return t}return i?`/api/volumio_ws/art?entry=${encodeURIComponent(i)}&path=${xt(t)}`:e&&!/^https?:\/\//i.test(e)?"":e?`${e}${t}`:t}function wt(t,e=""){try{const i=localStorage.getItem(t);return null==i?e:i}catch{return e}}function kt(t,e){try{return localStorage.setItem(t,e),!0}catch{return!1}}const $t="volumio-selected-device";function St(t){try{t?localStorage.setItem($t,t):localStorage.removeItem($t)}catch{}}class Ct{constructor(){this._hass=null,this._panel=null,this._devices=[],this._activeDevice=null,this._entityId=null,this._configEntryId=null,this._sensorBase=null,this._queueUnsub=null,this._lastState=null,this._stateListeners=new Set,this._queueListeners=new Set,this._devicesListeners=new Set,this._initInFlight=null}connect({hass:t,panel:e}){this._hass=t,this._panel=e,this._initInFlight=this._initDevices()}updateHass(t,e){this._hass=t,void 0!==e&&(this._panel=e);const i=this._normalize();(function(t,e){if(!t||!e)return!0;const i=Object.keys(e).filter(t=>"_raw"!==t);return i.some(i=>t[i]!==e[i])})(this._lastState,i)&&(this._lastState=i,this._fireState(i))}disconnect(){this._unsubscribeQueue(),this._stateListeners.clear(),this._queueListeners.clear(),this._devicesListeners.clear()}getState(){return this._normalize()}getVolumioUrl(){return this._activeDevice?.volumio_url||""}getSensorValue(t){return this.getState()[t]||null}get ready(){return!(!this._entityId||!this._configEntryId)}get entityId(){return this._entityId}getDevices(){return this._devices.slice()}getActiveDeviceId(){return this._configEntryId}getActiveDevice(){return this._activeDevice}async setDevice(t){const e=this._devices.find(e=>e.config_entry_id===t);if(!e)return void console.warn("[ha-adapter] setDevice: unknown device",t);if(e.config_entry_id===this._configEntryId)return;St(e.config_entry_id),this._unsubscribeQueue(),this._applyDevice(e),this._lastState=null,this._fireDevices();const i=this._normalize();this._lastState=i,this._fireState(i),await this._subscribeQueue()}async refreshDevices(){this._configEntryId;await this._initDevices(),this._configEntryId}onDevicesChange(t){this._devicesListeners.add(t)}offDevicesChange(t){this._devicesListeners.delete(t)}async call(t,e={}){if(!this._hass||!this._configEntryId)throw new Error(`Adapter not ready: call(${t})`);return await this._hass.connection.sendMessagePromise({type:"call_service",domain:"volumio_ws",service:t,service_data:{config_entry_id:this._configEntryId,...e},return_response:!0})}async play(){await this._mediaPlayerCall("media_play")}async pause(){await this._mediaPlayerCall("media_pause")}async playPause(){"playing"===this.getState().state?await this.pause():await this.play()}async stop(){await this._mediaPlayerCall("media_stop")}async next(){await this._mediaPlayerCall("media_next_track")}async prev(){await this._mediaPlayerCall("media_previous_track")}async seek(t){await this._mediaPlayerCall("media_seek",{seek_position:t})}async setVolume(t){this.getState().volumeEnabled&&await this._mediaPlayerCall("set_volume_level",{volume_level:t/100})}async mute(t){this.getState().volumeEnabled&&await this._mediaPlayerCall("volume_mute",{is_volume_muted:t})}async toggleMute(){const t=this.getState();await this.mute(!t.muted)}async setShuffle(t){await this._mediaPlayerCall("shuffle_set",{shuffle:t})}async setRepeat(t){await this._mediaPlayerCall("repeat_set",{repeat:t})}onQueueChange(t){this._queueListeners.add(t)}offQueueChange(t){this._queueListeners.delete(t)}onStateChange(t){this._stateListeners.add(t)}offStateChange(t){this._stateListeners.delete(t)}async _fetchPluginEndpoint(t,e){if(!this._configEntryId)return null;try{const i=await this.call("plugin_endpoint",{endpoint:t,data:e}),a=i?.response;return a&&!1!==a.success?a.data:null}catch{return null}}async fetchArtistBio(t){if(!t)return null;const e=await this._fetchPluginEndpoint("metavolumio",{mode:"storyArtist",artist:t});return e&&!1!==e.success&&e.value&&"string"==typeof e.value?e.value:null}async fetchSimilarArtists(t){if(!t)return[];const e=await this._fetchPluginEndpoint("getSimilarArtists",{artist:t});return Array.isArray(e)?e:[]}async fetchAlbumStory(t,e){if(!t||!e)return null;const i=await this._fetchPluginEndpoint("metavolumio",{mode:"storyAlbum",artist:t,album:e});return i&&!1!==i.success&&i.value&&"string"==typeof i.value?i.value:null}async fetchAlbumCredits(t,e){if(!t||!e)return[];const i=await this._fetchPluginEndpoint("metavolumio",{mode:"creditsAlbum",artist:t,album:e});return i&&!1!==i.success&&Array.isArray(i.value)?i.value:[]}_normalize(){return function(t,e,i){if(!t)return{state:"unavailable",title:"",artist:"",album:"",albumArt:"",duration:0,position:0,positionUpdatedAt:"",volume:0,muted:!1,shuffle:!1,repeat:"off",source:"",uri:"",queuePosition:-1,volumeEnabled:!1,bitrate:null,_raw:{}};const a=t.attributes||{},s=a.supported_features||0,o={};if(e&&i){const t={trackType:"track_type",samplerate:"sample_rate",bitdepth:"bit_depth",channels:"channels"};for(const[a,s]of Object.entries(t)){const t=`sensor.${e}_${s}`,r=i.states?.[t];o[a]="unknown"!==r?.state&&"unavailable"!==r?.state?r.state:null}}return{state:t.state||"unavailable",title:a.media_title||"",artist:a.media_artist||"",album:a.media_album_name||"",albumArt:a.entity_picture||"",rawAlbumart:a.albumart||"",duration:a.media_duration||0,position:a.media_position||0,positionUpdatedAt:a.media_position_updated_at||"",volume:null!=a.volume_level?Math.round(100*a.volume_level):0,muted:a.is_volume_muted||!1,shuffle:a.shuffle||!1,repeat:a.repeat||"off",source:a.source||"",uri:a.uri||"",queuePosition:a.queue_position??-1,volumeEnabled:!!(4&s),bitrate:a.bitrate||null,trackType:o.trackType||null,samplerate:o.samplerate||null,bitdepth:o.bitdepth||null,channels:o.channels||null,_raw:a}}(this._entityId?this._hass?.states?.[this._entityId]:null,this._sensorBase,this._hass)}_applyDevice(t){if(!t)return this._activeDevice=null,this._configEntryId=null,this._entityId=null,void(this._sensorBase=null);this._activeDevice=t,this._configEntryId=t.config_entry_id,this._entityId=t.entity_id||null,this._sensorBase=t.entity_id?t.entity_id.replace("media_player.",""):null}async _initDevices(){if(!this._hass)return;let t=[];try{const e=await this._hass.connection.sendMessagePromise({type:"volumio_ws/list_devices"});t=Array.isArray(e?.devices)?e.devices:[]}catch(t){return console.error("[ha-adapter] list_devices failed:",t),this._devices=[],this._applyDevice(null),void this._fireDevices()}this._devices=t;const e=function(){try{return localStorage.getItem($t)}catch{return null}}();let i=t.find(t=>t.config_entry_id===e);!i&&t.length>0&&(i=t[0]),e&&!t.some(t=>t.config_entry_id===e)&&St(null);const a=this._configEntryId;this._applyDevice(i||null),this._configEntryId!==a&&(this._unsubscribeQueue(),this._configEntryId&&await this._subscribeQueue());const s=this._normalize();this._lastState=s,this._fireState(s),this._fireDevices()}async _subscribeQueue(){if(this._queueUnsub||!this._hass||!this._configEntryId)return;const t=this._configEntryId;try{this._queueUnsub=await this._hass.connection.subscribeMessage(t=>{t.queue&&this._notifyQueue([...t.queue])},{type:"volumio_ws/subscribe_queue",config_entry_id:t})}catch(t){console.warn("[ha-adapter] Queue subscription failed:",t)}try{const t=await this.call("queue_get");t?.response?.queue&&this._notifyQueue([...t.response.queue])}catch{}}_unsubscribeQueue(){this._queueUnsub&&("function"==typeof this._queueUnsub&&this._queueUnsub(),this._queueUnsub=null)}_notifyQueue(t){for(const e of this._queueListeners)try{e(t)}catch(t){console.error("[ha-adapter] Queue listener error:",t)}}_fireState(t){for(const e of this._stateListeners)try{e(t)}catch(t){console.error("[ha-adapter] State listener error:",t)}}_fireDevices(){const t={devices:this._devices.slice(),activeId:this._configEntryId};for(const e of this._devicesListeners)try{e(t)}catch(t){console.error("[ha-adapter] Devices listener error:",t)}}async _mediaPlayerCall(t,e={}){if(!this._hass||!this._entityId)throw new Error(`Adapter not ready: media_player.${t}`);return await this._hass.callService("media_player",t,{entity_id:this._entityId,...e})}}const At=[{key:"now-playing",label:"Now Playing"},{key:"browse",label:"Browse"},{key:"playlists",label:"Playlists"},{key:"favorites",label:"Favorites"}];customElements.define("volumio-top-bar",class extends rt{static get properties(){return{activeView:{type:String,attribute:"active-view"},breadcrumb:{type:Array},showBackButton:{type:Boolean,attribute:"show-back-button"},narrow:{type:Boolean},searchQuery:{type:String,attribute:"search-query"},devices:{type:Array},activeDeviceId:{type:String,attribute:"active-device-id"},_searchValue:{type:String,state:!0},_searchFocused:{type:Boolean,state:!0},_deviceMenuOpen:{type:Boolean,state:!0}}}static get styles(){return o`
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

      .device-selector {
        position: relative;
        flex-shrink: 0;
      }

      .device-menu {
        position: absolute;
        top: calc(100% + 4px);
        right: 0;
        min-width: 200px;
        background: var(--card-background-color, #1e1e1e);
        border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        padding: 4px;
        z-index: 110;
      }

      .device-menu-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border: none;
        background: transparent;
        color: var(--primary-text-color);
        width: 100%;
        text-align: left;
        font-size: 13px;
        cursor: pointer;
        border-radius: 6px;
      }

      .device-menu-item:hover {
        background: var(--divider-color, rgba(255,255,255,0.08));
      }

      .device-menu-item.active {
        font-weight: 600;
      }

      .device-menu-item ha-icon {
        --mdc-icon-size: 18px;
        color: var(--primary-color, #03a9f4);
        flex-shrink: 0;
      }

      .device-menu-item .device-menu-spacer {
        width: 18px;
        flex-shrink: 0;
      }

      .device-menu-item .device-menu-name {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
    `}constructor(){super(),this.activeView="now-playing",this.breadcrumb=[],this.showBackButton=!1,this.narrow=!1,this.searchQuery="",this.devices=[],this.activeDeviceId="",this._searchValue="",this._searchFocused=!1,this._deviceMenuOpen=!1,this._debounceTimer=null;let t=[];try{t=JSON.parse(wt("volumio-recent-searches","[]")),Array.isArray(t)||(t=[])}catch{t=[]}this._recentSearches=t,this._onDocClick=this._onDocClick.bind(this)}connectedCallback(){super.connectedCallback(),document.addEventListener("click",this._onDocClick)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("click",this._onDocClick)}_onDocClick(t){if(!this._deviceMenuOpen)return;(t.composedPath?t.composedPath():[]).includes(this)||(this._deviceMenuOpen=!1)}render(){return Q`
      <div class="topbar">
        <button
          class="icon-btn"
          @click=${this._toggleNav}
          title="Toggle navigation"
          aria-label="Toggle navigation sidebar"
        >
          <ha-icon icon="mdi:menu"></ha-icon>
        </button>

        ${this.showBackButton?Q`
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
          ${At.map(t=>Q`
            <button
              class="tab ${this.activeView===t.key?"active":""}"
              @click=${()=>this._navigate(t.key)}
            >
              ${t.label}
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
          ${this._searchValue?Q`
            <button class="search-clear" @click=${this._clearSearch} title="Clear search" aria-label="Clear search">✕</button>
          `:""}
        </div>

        ${this._searchFocused&&!this._searchValue&&this._recentSearches.length>0?Q`
          <div class="recent-searches">
            <div class="recent-label">Recent</div>
            <div class="recent-chips">
              ${this._recentSearches.slice(0,10).map(t=>Q`
                <button class="recent-chip" @mousedown=${e=>{e.preventDefault(),this._useRecentSearch(t)}}>${t}</button>
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

        ${this._renderDeviceSelector()}
      </div>

      ${this.breadcrumb.length>0?this._renderBreadcrumb():""}
    `}_renderDeviceSelector(){const t=Array.isArray(this.devices)?this.devices:[];if(t.length<=1)return"";const e=t.find(t=>t.config_entry_id===this.activeDeviceId)||t[0],i=e?.name||"Device";return Q`
      <div class="device-selector">
        <button
          class="icon-btn"
          @click=${this._toggleDeviceMenu}
          title="Device: ${i} — switch"
          aria-label="Switch Volumio device (current: ${i})"
          aria-haspopup="listbox"
          aria-expanded=${this._deviceMenuOpen?"true":"false"}
        >
          <ha-icon icon="mdi:speaker-multiple"></ha-icon>
        </button>
        ${this._deviceMenuOpen?Q`
          <div class="device-menu" role="listbox">
            ${t.map(t=>{const e=t.config_entry_id===this.activeDeviceId;return Q`
                <button
                  class="device-menu-item ${e?"active":""}"
                  role="option"
                  aria-selected=${e?"true":"false"}
                  @click=${()=>this._selectDevice(t.config_entry_id)}
                >
                  ${e?Q`<ha-icon icon="mdi:check"></ha-icon>`:Q`<span class="device-menu-spacer"></span>`}
                  <span class="device-menu-name">${t.name||t.config_entry_id}</span>
                </button>
              `})}
          </div>
        `:""}
      </div>
    `}_toggleDeviceMenu(t){t.stopPropagation(),this._deviceMenuOpen=!this._deviceMenuOpen}_selectDevice(t){this._deviceMenuOpen=!1,t!==this.activeDeviceId&&this.dispatchEvent(new CustomEvent("volumio-device-change",{detail:{config_entry_id:t},bubbles:!0,composed:!0}))}_renderBreadcrumb(){const t=this.breadcrumb,e=t.length>5?[t[0],{label:"...",path:null},...t.slice(-3)]:t;return Q`
      <div class="breadcrumb-row">
        ${e.map((t,i)=>{const a=i===e.length-1;return Q`
            ${i>0?Q`<span class="breadcrumb-sep"><ha-icon icon="mdi:chevron-right" style="--mdc-icon-size:14px"></ha-icon></span>`:""}
            <span
              class="breadcrumb-segment ${a?"current":""}"
              @click=${()=>!a&&null!=t.path&&this._navigate(t.path)}
            >${t.label}</span>
          `})}
      </div>
    `}_navigate(t){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:t},bubbles:!0,composed:!0}))}_toggleNav(){this.dispatchEvent(new CustomEvent("volumio-toggle-nav",{bubbles:!0,composed:!0}))}_toggleQueue(){this.dispatchEvent(new CustomEvent("volumio-toggle-queue",{bubbles:!0,composed:!0}))}_goBack(){this.dispatchEvent(new CustomEvent("volumio-back",{bubbles:!0,composed:!0}))}_focusSearch(){const t=this.shadowRoot.querySelector(".search-field input");t&&t.focus()}_onSearchFieldFocus(){this._searchFocused=!0}_onSearchFieldBlur(){setTimeout(()=>{this._searchFocused=!1},200)}_onSearchInput(t){this._searchValue=t.target.value,clearTimeout(this._debounceTimer),this._searchValue.trim().length<2?0===this._searchValue.trim().length&&this.dispatchEvent(new CustomEvent("volumio-search-clear",{bubbles:!0,composed:!0})):this._debounceTimer=setTimeout(()=>{this._executeSearch(this._searchValue.trim())},300)}_onSearchKeydown(t){"Escape"===t.key?(this._clearSearch(),t.target.blur()):"Enter"===t.key&&(clearTimeout(this._debounceTimer),this._searchValue.trim().length>=2&&this._executeSearch(this._searchValue.trim()))}_executeSearch(t){this._recentSearches=[t,...this._recentSearches.filter(e=>e!==t)].slice(0,10),kt("volumio-recent-searches",JSON.stringify(this._recentSearches)),this.dispatchEvent(new CustomEvent("volumio-search",{detail:{query:t},bubbles:!0,composed:!0}))}_clearSearch(){this._searchValue="",clearTimeout(this._debounceTimer),this.dispatchEvent(new CustomEvent("volumio-search-clear",{bubbles:!0,composed:!0}))}_useRecentSearch(t){this._searchValue=t,this._searchFocused=!1,this._executeSearch(t)}_onSearchFocus(){this.dispatchEvent(new CustomEvent("volumio-search-focus",{bubbles:!0,composed:!0}))}});const Et=[{key:"favorites",label:"Favorites",icon:"mdi:heart"},{key:"playlists",label:"Playlists",icon:"mdi:playlist-music-outline"},{key:"history",label:"History",icon:"mdi:history"}],qt={music_service:"mdi:music-box",mpd:"mdi:folder-music",webradio:"mdi:radio",podcast:"mdi:podcast"};customElements.define("volumio-left-nav",class extends rt{static get properties(){return{sources:{type:Array},activeSource:{type:String,attribute:"active-source"},mode:{type:String},activeView:{type:String,attribute:"active-view"}}}static get styles(){return o`
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

      /* ── Brand footer ──────────────── */
      .brand-link {
        display: block;
        text-align: center;
        padding: 4px 0 2px;
        font-size: 11px;
        text-decoration: none;
        color: var(--secondary-text-color, #888);
        opacity: 0.5;
        transition: opacity 0.15s;
      }

      .brand-link:hover {
        opacity: 0.8;
      }

      .collapsed .brand-link {
        display: none;
      }
    `}constructor(){super(),this.sources=[],this.activeSource="",this.mode="pinned",this.activeView=""}render(){const t="collapsed"===this.mode;return Q`
      <nav class="nav ${this.mode}" aria-label="Music sources">
        <div class="nav-scroll">
          <div class="nav-section-label ${t?"collapsed":""}">Sources</div>
          ${this.sources.map(t=>{const e=qt[t.plugin_name]||qt[t.plugin_type]||"mdi:music-box",i=this.activeSource===t.uri;return Q`
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

          ${Et.map(t=>Q`
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
          <a class="brand-link" href="https://litgui.com" target="_blank" rel="noopener noreferrer">litgui.com</a>
        </div>
      </nav>
    `}_selectSource(t){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"browse",source:t.name,sourceUri:t.uri,pluginName:t.plugin_name},bubbles:!0,composed:!0}))}_navigate(t){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:t},bubbles:!0,composed:!0}))}_togglePin(){const t="collapsed"===this.mode;this.dispatchEvent(new CustomEvent("volumio-nav-pin",{detail:{pinned:t},bubbles:!0,composed:!0}))}});customElements.define("volumio-quality-badge",class extends rt{static get properties(){return{quality:{type:Object},size:{type:String}}}static get styles(){return o`
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
    `}constructor(){super(),this.quality=null,this.size="normal"}render(){if(!this.quality||"unknown"===this.quality.tier||!this.quality.label)return Q``;const t=this.quality,e="small"===this.size?"small":"large"===this.size?"large":"normal";return Q`
      <span
        class="badge ${e}"
        style="color: ${t.color}; background: ${t.colorBg};"
        aria-label="Audio quality: ${t.label}"
        title="${t.tierLabel}: ${t.label}"
      >
        ${t.label}
      </span>
    `}});const Tt={qobuz:"Qobuz",tidal:"TIDAL",mpd:"Local",webradio:"Radio",spotify:"Spotify",spop:"Spotify",pandora:"Pandora",youtube:"YouTube",youtube2:"YouTube"},zt={mpd:"mdi:folder-music",webradio:"mdi:radio"};customElements.define("volumio-source-badge",class extends rt{static get properties(){return{source:{type:String}}}static get styles(){return o`
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
    `}constructor(){super(),this.source=""}render(){if(!this.source)return Q``;const t=Tt[this.source]||this.source,e=zt[this.source]||null;return Q`
      <span class="source">
        ${e?Q`<ha-icon icon="${e}"></ha-icon>`:""}
        ${t}
      </span>
    `}});customElements.define("volumio-player-bar",class extends rt{static get properties(){return{playerState:{type:String,attribute:"player-state"},title:{type:String},artist:{type:String},albumArt:{type:String,attribute:"album-art"},duration:{type:Number},position:{type:Number},positionUpdatedAt:{type:String,attribute:"position-updated-at"},volume:{type:Number},muted:{type:Boolean},shuffle:{type:Boolean},repeat:{type:String},quality:{type:Object},source:{type:String},volumeEnabled:{type:Boolean,attribute:"volume-enabled"},isFavorite:{type:Boolean,attribute:"is-favorite"},_displayPosition:{type:Number,state:!0},_isDragging:{type:Boolean,state:!0}}}static get styles(){return o`
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
    `}constructor(){super(),this.playerState="idle",this.title="",this.artist="",this.albumArt="",this.duration=0,this.position=0,this.positionUpdatedAt="",this.volume=0,this.muted=!1,this.shuffle=!1,this.repeat="off",this.quality=null,this.source="",this.volumeEnabled=!0,this.isFavorite=!1,this._displayPosition=0,this._isDragging=!1,this._rafId=null}connectedCallback(){super.connectedCallback(),this._startProgressAnimation()}disconnectedCallback(){super.disconnectedCallback(),this._stopProgressAnimation()}updated(t){(t.has("position")||t.has("positionUpdatedAt")||t.has("playerState"))&&(this._isDragging||(this._displayPosition=this.position||0))}_startProgressAnimation(){const t=()=>{if("playing"===this.playerState&&!this._isDragging&&this.positionUpdatedAt){const t=new Date(this.positionUpdatedAt).getTime(),e=(Date.now()-t)/1e3,i=(this.position||0)+e;this._displayPosition=Math.min(i,this.duration||1/0)}this._rafId=requestAnimationFrame(t)};this._rafId=requestAnimationFrame(t)}_stopProgressAnimation(){this._rafId&&(cancelAnimationFrame(this._rafId),this._rafId=null)}render(){if("unavailable"===this.playerState)return Q`
        <div class="skeleton-bar-row" aria-busy="true" aria-label="Loading">
          <div class="skeleton-art"></div>
          <div class="skeleton-info">
            <div class="skeleton-bar title"></div>
            <div class="skeleton-bar artist"></div>
          </div>
          <div class="skeleton-progress"></div>
        </div>
      `;if(!("playing"===this.playerState||"paused"===this.playerState)&&!this.title)return Q`
        <div class="empty-state">
          <ha-icon icon="mdi:music-note-off"></ha-icon>
          <span>Nothing playing</span>
        </div>
      `;const t="playing"===this.playerState,e=this.duration>0?Math.min(100,this._displayPosition/this.duration*100):0,i="one"===this.repeat?"mdi:repeat-once":"mdi:repeat",a="off"!==this.repeat,s=this.muted?"mdi:volume-mute":"mdi:volume-high";return Q`
      <div class="player-bar">
        ${this.albumArt?Q`<img
              class="art"
              src="${this.albumArt}"
              alt="Album art"
              @click=${this._goToNowPlaying}
              @error=${this._onArtError}
            />`:Q`<div class="art-placeholder" @click=${this._goToNowPlaying}>
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

          ${this.volumeEnabled?Q`
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
    `}_command(t,e){this.dispatchEvent(new CustomEvent("volumio-command",{detail:{command:t,value:e},bubbles:!0,composed:!0}))}_cycleRepeat(){const t="off"===this.repeat?"all":"all"===this.repeat?"one":"off";this._command("repeat_set",t)}_onProgressClick(t){const e=t.currentTarget.getBoundingClientRect(),i=Math.max(0,Math.min(1,(t.clientX-e.left)/e.width)),a=Math.floor(i*(this.duration||0));this._command("seek",a)}_onVolumeInput(t){}_onVolumeChange(t){const e=parseInt(t.target.value,10);this._command("volume_set",e)}_goToNowPlaying(){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"now-playing"},bubbles:!0,composed:!0}))}_toggleFavorite(t){t.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-toggle-favorite",{bubbles:!0,composed:!0}))}_onArtError(t){t.target.style.display="none";const e=document.createElement("div");e.className="art-placeholder",e.innerHTML='<ha-icon icon="mdi:music-note"></ha-icon>',t.target.parentNode.insertBefore(e,t.target)}_formatTime(t){if(!t||t<=0)return"0:00";const e=Math.floor(t);return`${Math.floor(e/60)}:${(e%60).toString().padStart(2,"0")}`}});customElements.define("volumio-now-playing",class extends rt{static get properties(){return{playerState:{type:String,attribute:"player-state"},title:{type:String},artist:{type:String},album:{type:String},albumArt:{type:String,attribute:"album-art"},quality:{type:Object},source:{type:String},isFavorite:{type:Boolean,attribute:"is-favorite"},_dominantColor:{type:String,state:!0},_showLightbox:{type:Boolean,state:!0}}}static get styles(){return o`
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
    `}constructor(){super(),this.playerState="idle",this.title="",this.artist="",this.album="",this.albumArt="",this.quality=null,this.source="",this.isFavorite=!1,this._dominantColor=null,this._showLightbox=!1,this._canvas=null}updated(t){t.has("albumArt")&&this.albumArt&&this._extractDominantColor(this.albumArt)}render(){if("unavailable"===this.playerState)return this._renderSkeleton();return"playing"===this.playerState||"paused"===this.playerState||this.title?Q`
      <div class="ultra-blur">
        <div
          class="ultra-blur-gradient"
          style="background: ${this._dominantColor?`radial-gradient(ellipse at 50% 40%, ${this._dominantColor} 0%, transparent 85%)`:"transparent"}"
        ></div>
        <div class="ultra-blur-overlay"></div>
      </div>

      <div class="container">
        <div class="art-container" @click=${this._toggleLightbox}>
          ${this.albumArt?Q`<img
                class="art ${this.playerState}"
                src="${this.albumArt}"
                alt="Album art for ${this.album||this.title}"
                @error=${this._onArtError}
              />`:Q`<div class="art-placeholder">
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

          ${this.artist?Q`
            <div class="track-artist" @click=${this._goToArtist}>${this.artist}</div>
          `:""}

          ${this.album?Q`
            <div class="track-album" @click=${this._goToAlbum}>${this.album}</div>
          `:""}

          <div class="quality-row">
            <volumio-quality-badge .quality=${this.quality} size="large"></volumio-quality-badge>
            <volumio-source-badge .source=${this.source}></volumio-source-badge>
          </div>
        </div>
      </div>

      ${this._showLightbox&&this.albumArt?Q`
        <div class="lightbox" @click=${this._toggleLightbox} @keydown=${this._onLightboxKey}>
          <img src="${this.albumArt}" alt="Full size album art" />
        </div>
      `:""}
    `:this._renderEmpty()}_renderEmpty(){return Q`
      <div class="empty-state">
        <ha-icon icon="mdi:music-note-off"></ha-icon>
        <div class="message">Nothing playing</div>
        <button class="browse-btn" @click=${this._goToBrowse}>Browse Music</button>
      </div>
    `}_renderSkeleton(){return Q`
      <div class="skeleton" aria-busy="true" aria-label="Loading">
        <div class="skeleton-art"></div>
        <div class="skeleton-bar title"></div>
        <div class="skeleton-bar artist"></div>
        <div class="skeleton-bar album"></div>
      </div>
    `}async _extractDominantColor(t){if(t)try{const e=new Image;e.src=t,await new Promise((t,i)=>{e.onload=t,e.onerror=i}),this._canvas||(this._canvas=document.createElement("canvas"));const i=this._canvas,a=i.getContext("2d",{willReadFrequently:!0}),s=10;i.width=s,i.height=s,a.drawImage(e,0,0,s,s);const o=a.getImageData(0,0,s,s).data;let r=0,n=0,l=0;const c=s*s;for(let t=0;t<o.length;t+=4)r+=o[t],n+=o[t+1],l+=o[t+2];r=Math.round(r/c),n=Math.round(n/c),l=Math.round(l/c);const d=Math.max(r,n,l)/255,u=Math.min(r,n,l)/255;let p=0,h=0,m=(d+u)/2;if(d!==u){const t=d-u;h=m>.5?t/(2-d-u):t/(d+u);const e=r/255,i=n/255,a=l/255;p=e===d?((i-a)/t+(i<a?6:0))/6:i===d?((a-e)/t+2)/6:((e-i)/t+4)/6}m=Math.max(m,.4),h=Math.min(1.3*h,1);const v=(t,e,i)=>(i<0&&(i+=1),i>1&&(i-=1),i<1/6?t+6*(e-t)*i:i<.5?e:i<2/3?t+(e-t)*(2/3-i)*6:t),b=m<.5?m*(1+h):m+h-m*h,g=2*m-b;r=Math.round(255*v(g,b,p+1/3)),n=Math.round(255*v(g,b,p)),l=Math.round(255*v(g,b,p-1/3)),this._dominantColor=`rgb(${r}, ${n}, ${l})`}catch{this._dominantColor=null}else this._dominantColor=null}_toggleFavorite(){this.dispatchEvent(new CustomEvent("volumio-toggle-favorite",{bubbles:!0,composed:!0}))}_toggleLightbox(){this._showLightbox=!this._showLightbox}_onLightboxKey(t){"Escape"===t.key&&(this._showLightbox=!1)}_goToArtist(){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"artist-detail",artist:this.artist},bubbles:!0,composed:!0}))}_goToAlbum(){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"album-detail",album:this.album},bubbles:!0,composed:!0}))}_goToBrowse(){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"browse"},bubbles:!0,composed:!0}))}_onArtError(t){t.target.style.display="none"}});const It={mpd:"mdi:folder-music",webradio:"mdi:radio",podcast:"mdi:podcast",spotify:"mdi:spotify",spop:"mdi:spotify",youtube:"mdi:youtube",youtube2:"mdi:youtube",tidal:"mdi:music-box",qobuz:"mdi:music-box",music_service:"mdi:music-box"};customElements.define("volumio-browse-source-grid",class extends rt{static get properties(){return{sources:{type:Array},volumioUrl:{type:String,attribute:"volumio-url"},configEntryId:{type:String,attribute:"config-entry-id"}}}static get styles(){return o`
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
    `}constructor(){super(),this.sources=[],this.volumioUrl=""}render(){return this.sources&&0!==this.sources.length?Q`
      <div class="grid">
        ${this.sources.map(t=>this._renderSourceCard(t))}
      </div>
    `:Q`
        <div class="empty-state">
          <ha-icon icon="mdi:music-box-multiple-outline"></ha-icon>
          <div class="message">No music sources configured</div>
        </div>
      `}_renderSourceCard(t){const e=It[t.plugin_name]||It[t.plugin_type]||"mdi:music-box",i=ft(t.albumart||t.icon,this.volumioUrl,this.configEntryId);return Q`
      <div
        class="source-card"
        @click=${()=>this._selectSource(t)}
        title="${t.name}"
      >
        <div class="source-icon">
          ${i?Q`<img
                src="${i}"
                alt="${t.name}"
                @error=${this._onIconError}
              />`:Q`<ha-icon icon="${e}"></ha-icon>`}
        </div>
        <div class="source-name">${t.name}</div>
      </div>
    `}_selectSource(t){this.dispatchEvent(new CustomEvent("volumio-source-select",{detail:{uri:t.uri,name:t.name,plugin_name:t.plugin_name},bubbles:!0,composed:!0}))}_onIconError(t){const e=t.target.parentElement;t.target.remove(),e.innerHTML='<ha-icon icon="mdi:music-box"></ha-icon>'}});customElements.define("volumio-album-card",class extends rt{static get properties(){return{title:{type:String},artist:{type:String},albumart:{type:String},uri:{type:String},type:{type:String},quality:{type:Object},service:{type:String}}}static get styles(){return o`
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
    `}constructor(){super(),this.title="",this.artist="",this.albumart="",this.uri="",this.type="folder",this.quality=null,this.service=""}render(){const t="folder"===this.type||"category"===this.type,e=t?"mdi:folder-music":"mdi:music-note";return Q`
      <div class="card ${t?"folder":""}" @click=${this._onClick} @contextmenu=${this._onContextMenu}>
        <div class="art-container">
          ${this.albumart?Q`<img
                class="art"
                src="${this.albumart}"
                alt="${this.title}"
                loading="lazy"
                @error=${this._onArtError}
              />`:Q`<div class="art-placeholder">
                <ha-icon icon="${e}"></ha-icon>
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
          ${this.artist?Q`<div class="card-artist" title="${this.artist}">${this.artist}</div>`:""}
          ${this.quality&&"unknown"!==this.quality.tier?Q`<div class="card-quality">
                <volumio-quality-badge .quality=${this.quality} size="small"></volumio-quality-badge>
              </div>`:""}
        </div>
      </div>
    `}_getItemData(){return{uri:this.uri,title:this.title,artist:this.artist,albumart:this.albumart,type:this.type,service:this.service}}_onClick(t){t.target.closest(".play-btn")||this.dispatchEvent(new CustomEvent("volumio-card-click",{detail:this._getItemData(),bubbles:!0,composed:!0}))}_onPlay(t){t.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-card-play",{detail:this._getItemData(),bubbles:!0,composed:!0}))}_onDotsClick(t){t.stopPropagation(),t.preventDefault();const e=t.currentTarget.getBoundingClientRect();this._fireContextEvent(e.right,e.bottom)}_onContextMenu(t){t.preventDefault(),t.stopPropagation(),this._fireContextEvent(t.clientX,t.clientY)}_fireContextEvent(t,e){this.dispatchEvent(new CustomEvent("volumio-context-menu",{detail:{...this._getItemData(),x:t,y:e,context:"album"},bubbles:!0,composed:!0}))}_onArtError(t){const e=t.target.parentElement;t.target.remove();const i=document.createElement("div");i.className="art-placeholder",i.innerHTML='<ha-icon icon="mdi:music-note"></ha-icon>',e.prepend(i)}});customElements.define("volumio-track-card",class extends rt{static get properties(){return{index:{type:Number},title:{type:String},artist:{type:String},album:{type:String},duration:{type:Number},uri:{type:String},albumart:{type:String},service:{type:String},type:{type:String},quality:{type:Object},isPlaying:{type:Boolean,attribute:"is-playing"},compact:{type:Boolean}}}static get styles(){return o`
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
    `}constructor(){super(),this.index=0,this.title="",this.artist="",this.album="",this.duration=0,this.uri="",this.albumart="",this.service="",this.type="song",this.quality=null,this.isPlaying=!1,this.compact=!1}render(){return Q`
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
          ${this.quality&&"unknown"!==this.quality.tier?Q`<volumio-quality-badge .quality=${this.quality} size="small"></volumio-quality-badge>`:""}
        </div>
        <div class="cell-duration">${this.duration?_t(this.duration):""}</div>
        <div class="cell-context">
          <button class="context-btn" @click=${this._onDotsClick} title="More actions">
            <ha-icon icon="mdi:dots-vertical"></ha-icon>
          </button>
        </div>
      </div>
    `}_getItemData(){return{uri:this.uri,title:this.title,artist:this.artist,album:this.album,albumart:this.albumart,service:this.service,type:this.type,index:this.index}}_onClick(){this.dispatchEvent(new CustomEvent("volumio-track-click",{detail:this._getItemData(),bubbles:!0,composed:!0}))}_onDotsClick(t){t.stopPropagation(),t.preventDefault();const e=t.currentTarget.getBoundingClientRect();this._fireContextEvent(e.right,e.bottom)}_onContextMenu(t){t.preventDefault(),t.stopPropagation(),this._fireContextEvent(t.clientX,t.clientY)}_fireContextEvent(t,e){this.dispatchEvent(new CustomEvent("volumio-context-menu",{detail:{...this._getItemData(),x:t,y:e,context:"track"},bubbles:!0,composed:!0}))}});customElements.define("volumio-browse-list",class extends rt{static get properties(){return{items:{type:Array},viewMode:{type:String,attribute:"view-mode"},loading:{type:Boolean},currentUri:{type:String,attribute:"current-uri"},volumioUrl:{type:String,attribute:"volumio-url"},configEntryId:{type:String,attribute:"config-entry-id"},_displayCount:{type:Number,state:!0}}}static get styles(){return o`
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
    `}constructor(){super(),this.items=[],this.viewMode=wt("volumio-browse-view","grid"),this.loading=!1,this.currentUri="",this.volumioUrl="",this._displayCount=100}render(){if(this.loading)return this._renderSkeleton();if(!this.items||0===this.items.length)return Q`
        <div class="empty-state">
          <ha-icon icon="mdi:folder-open-outline"></ha-icon>
          <div class="message">No items found</div>
        </div>
      `;const t=this.items.slice(0,this._displayCount),e=this.items.length>this._displayCount,i=this.items.length>20,a=i?this._buildAlphaMap():null;return Q`
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
        ${"grid"===this.viewMode?this._renderGrid(t):this._renderList(t)}

        ${e?Q`
          <div class="load-more">
            <button class="load-more-btn" @click=${this._loadMore}>
              Show more (${this.items.length-this._displayCount} remaining)
            </button>
          </div>
        `:""}

        ${i?this._renderAlphaIndex(a):""}
      </div>
    `}updated(t){t.has("items")&&(this._displayCount=100)}_renderGrid(t){return Q`
      <div class="browse-grid">
        ${t.map(t=>{const e=ft(t.albumart,this.volumioUrl,this.configEntryId),i=this._getItemLetter(t);return Q`
            <volumio-album-card
              data-letter="${i}"
              title="${t.title||t.name||""}"
              artist="${t.artist||""}"
              albumart="${e}"
              uri="${t.uri||""}"
              type="${t.type||"folder"}"
              service="${t.service||""}"
              @volumio-card-click=${this._onItemClick}
              @volumio-card-play=${this._onItemPlay}
            ></volumio-album-card>
          `})}
      </div>
    `}_renderList(t){const e=!t.some(t=>t.duration>0);return Q`
      <div class="browse-list">
        <div class="list-header" style="grid-template-columns: ${e?"40px 1.5fr 1fr 32px":"40px 1fr 1fr 0.8fr auto 60px 32px"};">
          <span>#</span>
          <span>Title</span>
          <span>Artist</span>
          ${e?"":Q`
            <span class="hdr-album">Album</span>
            <span class="hdr-quality">Quality</span>
            <span class="hdr-duration">Time</span>
          `}
          <span></span>
        </div>
        ${t.map((t,i)=>{const a=ft(t.albumart,this.volumioUrl,this.configEntryId),s=gt(t),o=this._getItemLetter(t);return Q`
            <volumio-track-card
              data-letter="${o}"
              .index=${i+1}
              title="${t.title||t.name||""}"
              artist="${t.artist||""}"
              album="${t.album||""}"
              .duration=${t.duration||0}
              uri="${t.uri||""}"
              albumart="${a}"
              service="${t.service||""}"
              type="${t.type||"folder"}"
              .quality=${s}
              ?compact=${e}
              ?is-playing=${this.currentUri&&t.uri===this.currentUri}
              @volumio-track-click=${this._onItemClick}
            ></volumio-track-card>
          `})}
      </div>
    `}_renderSkeleton(){return Q`
      <div class="skeleton-grid" aria-busy="true" aria-label="Loading">
        ${Array(12).fill(0).map(()=>Q`<div class="skeleton-card"></div>`)}
      </div>
    `}_setViewMode(t){this.viewMode=t,kt("volumio-browse-view",t),this.dispatchEvent(new CustomEvent("volumio-view-mode-change",{detail:{mode:t},bubbles:!0,composed:!0}))}_loadMore(){this._displayCount+=100}_onItemClick(t){t.stopPropagation();const e=t.detail;this.dispatchEvent(new CustomEvent("volumio-item-click",{detail:e,bubbles:!0,composed:!0}))}_onItemPlay(t){t.stopPropagation();const e=t.detail;this.dispatchEvent(new CustomEvent("volumio-item-play",{detail:e,bubbles:!0,composed:!0}))}_getItemLetter(t){const e=(t.title||t.name||"").trim();if(!e)return"#";const i=e.charAt(0).toUpperCase();return/[A-Z]/.test(i)?i:"#"}_buildAlphaMap(){const t=new Set;for(const e of this.items)t.add(this._getItemLetter(e));return t}_renderAlphaIndex(t){const e=["#",..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")];return Q`
      <div class="alpha-index">
        ${e.map(e=>{const i=t.has(e);return Q`
            <div
              class="alpha-letter ${i?"":"disabled"}"
              @click=${()=>i&&this._scrollToLetter(e)}
            >${e}</div>
          `})}
      </div>
    `}_scrollToLetter(t){if(this._displayCount<this.items.length){const e=this.items.findIndex(e=>this._getItemLetter(e)===t);e>=this._displayCount&&(this._displayCount=Math.min(e+50,this.items.length))}this.updateComplete.then(()=>{const e=this.shadowRoot.querySelector(`[data-letter="${t}"]`);e&&e.scrollIntoView({behavior:"smooth",block:"start"})})}});customElements.define("volumio-album-detail",class extends rt{static get properties(){return{albumTitle:{type:String,attribute:"album-title"},albumArtist:{type:String,attribute:"album-artist"},albumArt:{type:String,attribute:"album-art"},albumUri:{type:String,attribute:"album-uri"},albumService:{type:String,attribute:"album-service"},tracks:{type:Array},loading:{type:Boolean},currentUri:{type:String,attribute:"current-uri"},quality:{type:Object},volumioUrl:{type:String,attribute:"volumio-url"},configEntryId:{type:String,attribute:"config-entry-id"},story:{type:String},credits:{type:Array,attribute:!1},storyLoading:{type:Boolean,attribute:"story-loading"},creditsLoading:{type:Boolean,attribute:"credits-loading"},_storyExpanded:{type:Boolean,state:!0},_creditsExpanded:{type:Boolean,state:!0}}}static get styles(){return o`
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

      /* ── Story (About this album) ────────── */
      .section {
        margin-top: var(--volumio-space-xl, 32px);
      }

      .section-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--primary-text-color);
        margin-bottom: var(--volumio-space-md, 16px);
      }

      .story-text {
        font-size: 14px;
        line-height: 1.6;
        color: var(--primary-text-color);
        white-space: pre-wrap;
      }

      .story-toggle {
        margin-top: var(--volumio-space-sm, 8px);
        background: none;
        border: none;
        padding: 0;
        font-size: 13px;
        font-weight: 500;
        color: var(--primary-color, #03a9f4);
        cursor: pointer;
      }

      .story-toggle:hover {
        text-decoration: underline;
      }

      /* ── Credits ──────────────────────────── */
      .credits-list {
        display: flex;
        flex-direction: column;
        gap: var(--volumio-space-sm, 8px);
      }

      .credit-row {
        display: grid;
        grid-template-columns: minmax(140px, 30%) 1fr;
        gap: var(--volumio-space-md, 16px);
        font-size: 14px;
        line-height: 1.5;
      }

      .credit-key {
        color: var(--secondary-text-color);
        text-transform: capitalize;
      }

      .credit-values {
        color: var(--primary-text-color);
      }

      .credit-name {
        cursor: pointer;
        transition: color 0.15s;
      }

      .credit-name:hover {
        color: var(--primary-color, #03a9f4);
        text-decoration: underline;
      }

      .credits-toggle {
        margin-top: var(--volumio-space-sm, 8px);
        background: none;
        border: none;
        padding: 0;
        font-size: 13px;
        font-weight: 500;
        color: var(--primary-color, #03a9f4);
        cursor: pointer;
      }

      .credits-toggle:hover {
        text-decoration: underline;
      }

      /* ── Section skeletons ────────────────── */
      .skeleton-bar.w-full,
      .skeleton-bar.w-90,
      .skeleton-bar.w-75,
      .skeleton-bar.w-60 {
        height: 14px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
        margin-bottom: 8px;
      }

      .skeleton-bar.w-full { width: 100%; }
      .skeleton-bar.w-90 { width: 90%; }
      .skeleton-bar.w-75 { width: 75%; }
      .skeleton-bar.w-60 { width: 60%; }

      .skeleton-credit-row {
        display: grid;
        grid-template-columns: minmax(140px, 30%) 1fr;
        gap: var(--volumio-space-md, 16px);
        margin-bottom: 8px;
      }

      .skeleton-credit-key,
      .skeleton-credit-values {
        height: 14px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-credit-key { width: 60%; }
      .skeleton-credit-values { width: 80%; }

      @media (max-width: 768px) {
        .credit-row,
        .skeleton-credit-row {
          grid-template-columns: 1fr;
          gap: 2px;
        }
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
    `}constructor(){super(),this.albumTitle="",this.albumArtist="",this.albumArt="",this.albumUri="",this.albumService="",this.tracks=[],this.loading=!1,this.currentUri="",this.quality=null,this.volumioUrl="",this.story=null,this.credits=[],this.storyLoading=!1,this.creditsLoading=!1,this._storyExpanded=!1,this._creditsExpanded=!1}updated(t){(t.has("albumTitle")||t.has("albumArtist")||t.has("story")||t.has("credits"))&&(this._storyExpanded=!1,this._creditsExpanded=!1)}render(){if(this.loading)return this._renderSkeleton();const t=this.tracks.length,e=this.tracks.reduce((t,e)=>t+(e.duration||0),0);return Q`
      <div class="album-header">
        <div class="album-art-container">
          ${this.albumArt?Q`<img src="${ft(this.albumArt,this.volumioUrl,this.configEntryId)}" alt="${this.albumTitle}" @error=${this._onArtError} />`:Q`<div class="album-art-placeholder">
                <ha-icon icon="mdi:album"></ha-icon>
              </div>`}
        </div>
        <div class="album-meta">
          <span class="meta-type">Album</span>
          <div class="album-name">${this.albumTitle||"Unknown Album"}</div>
          ${this.albumArtist?Q`<span class="album-artist-link" @click=${this._goToArtist}>
                ${this.albumArtist}
              </span>`:""}
          <div class="meta-details">
            ${t>0?Q`<span class="detail">${t} track${1!==t?"s":""}</span>`:""}
            ${t>0&&e>0?Q`<span class="sep">·</span>`:""}
            ${e>0?Q`<span class="detail">${_t(e)}</span>`:""}
            ${this.albumService?Q`
              <span class="sep">·</span>
              <volumio-source-badge .source=${this.albumService}></volumio-source-badge>
            `:""}
          </div>
          ${this.quality&&"unknown"!==this.quality.tier?Q`
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

      ${t>0?Q`
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
          ${this.tracks.map((t,e)=>{const i=ft(t.albumart||this.albumArt,this.volumioUrl,this.configEntryId),a=gt(t);return Q`
              <volumio-track-card
                .index=${e+1}
                title="${t.title||t.name||""}"
                artist="${t.artist||this.albumArtist||""}"
                album="${t.album||this.albumTitle||""}"
                .duration=${t.duration||0}
                uri="${t.uri||""}"
                albumart="${i}"
                service="${t.service||this.albumService||""}"
                type="${t.type||"song"}"
                .quality=${a}
                ?is-playing=${this.currentUri&&t.uri===this.currentUri}
                @volumio-track-click=${this._onTrackClick}
              ></volumio-track-card>
            `})}
        </div>
      `:Q`
        <div style="text-align: center; padding: 32px; color: var(--secondary-text-color);">
          No tracks found
        </div>
      `}

      ${this._renderStorySection()}
      ${this._renderCreditsSection()}
    `}_renderStorySection(){if(this.storyLoading)return Q`
        <div class="section" aria-busy="true" aria-label="Loading album story">
          <div class="section-title">About this album</div>
          <div class="skeleton-bar w-full"></div>
          <div class="skeleton-bar w-90"></div>
          <div class="skeleton-bar w-75"></div>
        </div>
      `;if(!this.story)return"";const t=this.story.split(/\s+/),e=t.length>200&&!this._storyExpanded?t.slice(0,200).join(" ")+"…":this.story;return Q`
      <div class="section">
        <div class="section-title">About this album</div>
        <div class="story-text">${e}</div>
        ${t.length>200?Q`
            <button class="story-toggle" @click=${this._toggleStory}>
              ${this._storyExpanded?"Show less":"Read more"}
            </button>
          `:""}
      </div>
    `}_renderCreditsSection(){if(this.creditsLoading)return Q`
        <div class="section" aria-busy="true" aria-label="Loading album credits">
          <div class="section-title">Credits</div>
          ${Array(5).fill(0).map(()=>Q`
            <div class="skeleton-credit-row">
              <div class="skeleton-credit-key"></div>
              <div class="skeleton-credit-values"></div>
            </div>
          `)}
        </div>
      `;if(!this.credits||0===this.credits.length)return"";const t=this._creditsExpanded||this.credits.length<=6?this.credits:this.credits.slice(0,6);return Q`
      <div class="section">
        <div class="section-title">Credits</div>
        <div class="credits-list">
          ${t.map(t=>Q`
            <div class="credit-row">
              <div class="credit-key">${t.key||""}</div>
              <div class="credit-values">
                ${(t.values||[]).map((e,i)=>Q`<span
                  class="credit-name"
                  role="button"
                  tabindex="0"
                  @click=${()=>this._onCreditClick(e)}
                  @keydown=${t=>this._onCreditKeydown(t,e)}
                >${e.name||""}</span>${i<(t.values||[]).length-1?", ":""}`)}
              </div>
            </div>
          `)}
        </div>
        ${this.credits.length>6?Q`
            <button class="credits-toggle" @click=${this._toggleCredits}>
              ${this._creditsExpanded?"Show fewer credits":`Show all ${this.credits.length} credits`}
            </button>
          `:""}
      </div>
    `}_toggleStory(){this._storyExpanded=!this._storyExpanded}_toggleCredits(){this._creditsExpanded=!this._creditsExpanded}_onCreditClick(t){const e=t?.name||"";e&&this.dispatchEvent(new CustomEvent("volumio-similar-artist-click",{detail:{artist:e,uri:`globalUriArtist/${e}`,albumart:""},bubbles:!0,composed:!0}))}_onCreditKeydown(t,e){"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._onCreditClick(e))}_renderSkeleton(){return Q`
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
          ${Array(8).fill(0).map(()=>Q`<div class="skeleton-track"></div>`)}
        </div>
      </div>
    `}_playAlbum(){this.dispatchEvent(new CustomEvent("volumio-album-play",{detail:{uri:this.albumUri},bubbles:!0,composed:!0}))}_addToQueue(){this.dispatchEvent(new CustomEvent("volumio-album-add-queue",{detail:{uri:this.albumUri},bubbles:!0,composed:!0}))}_goToArtist(){this.dispatchEvent(new CustomEvent("volumio-navigate",{detail:{view:"artist-detail",artist:this.albumArtist},bubbles:!0,composed:!0}))}_onTrackClick(t){t.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-track-click",{detail:t.detail,bubbles:!0,composed:!0}))}_onMoreClick(t){t.stopPropagation();const e=t.currentTarget.getBoundingClientRect();this.dispatchEvent(new CustomEvent("volumio-context-menu",{detail:{uri:this.albumUri,title:this.albumTitle,artist:this.albumArtist,albumart:this.albumArt,service:this.albumService,type:"album",x:e.right,y:e.bottom,context:"album"},bubbles:!0,composed:!0}))}_onArtError(t){const e=t.target.parentElement;t.target.remove(),e.innerHTML='<div class="album-art-placeholder"><ha-icon icon="mdi:album"></ha-icon></div>'}});customElements.define("volumio-artist-detail",class extends rt{static get properties(){return{artistName:{type:String,attribute:"artist-name"},items:{type:Array},loading:{type:Boolean},volumioUrl:{type:String,attribute:"volumio-url"},configEntryId:{type:String,attribute:"config-entry-id"},bio:{type:String},similarArtists:{type:Array,attribute:!1},bioLoading:{type:Boolean,attribute:"bio-loading"},similarLoading:{type:Boolean,attribute:"similar-loading"},_bioExpanded:{type:Boolean,state:!0}}}static get styles(){return o`
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

      /* ── Bio ─────────────────────────────── */
      .bio-text {
        font-size: 14px;
        line-height: 1.6;
        color: var(--primary-text-color);
        white-space: pre-wrap;
      }

      .bio-toggle {
        margin-top: var(--volumio-space-sm, 8px);
        background: none;
        border: none;
        padding: 0;
        font-size: 13px;
        font-weight: 500;
        color: var(--primary-color, #03a9f4);
        cursor: pointer;
      }

      .bio-toggle:hover {
        text-decoration: underline;
      }

      /* ── Similar artists ─────────────────── */
      .similar-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: var(--volumio-space-md, 16px);
      }

      .similar-card {
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: var(--volumio-space-sm, 8px);
        padding: var(--volumio-space-sm, 8px);
        border-radius: 8px;
        transition: background 0.15s;
      }

      .similar-card:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.06));
      }

      .similar-art {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 50%;
        overflow: hidden;
        background: var(--card-background-color, #2a2a2a);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .similar-art img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .similar-art ha-icon {
        --mdc-icon-size: 48px;
        color: var(--secondary-text-color);
        opacity: 0.3;
      }

      .similar-name {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        line-height: 1.3;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        width: 100%;
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

      .skeleton-bar {
        height: 14px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
        margin-bottom: 8px;
      }

      .skeleton-bar.w-full { width: 100%; }
      .skeleton-bar.w-90 { width: 90%; }
      .skeleton-bar.w-75 { width: 75%; }
      .skeleton-bar.w-60 { width: 60%; }

      .skeleton-similar-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        gap: var(--volumio-space-md, 16px);
      }

      .skeleton-similar-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--volumio-space-sm, 8px);
      }

      .skeleton-similar-art {
        width: 100%;
        aspect-ratio: 1;
        border-radius: 50%;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-similar-name {
        width: 70%;
        height: 14px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .empty-state {
        text-align: center;
        padding: var(--volumio-space-xl, 32px);
        color: var(--secondary-text-color);
        font-size: 14px;
      }
    `}constructor(){super(),this.artistName="",this.items=[],this.loading=!1,this.volumioUrl="",this.bio=null,this.similarArtists=[],this.bioLoading=!1,this.similarLoading=!1,this._bioExpanded=!1}updated(t){(t.has("artistName")||t.has("bio"))&&(this._bioExpanded=!1)}render(){return this.loading?this._renderSkeleton():Q`
      <div class="artist-header">
        <div class="artist-name">${this.artistName||"Unknown Artist"}</div>
      </div>

      <div class="section">
        <div class="section-title">Albums</div>
        ${this.items&&this.items.length>0?Q`
            <div class="albums-grid">
              ${this.items.map(t=>{const e=ft(t.albumart||t.icon,this.volumioUrl,this.configEntryId);return Q`
                  <volumio-album-card
                    title="${t.title||t.name||""}"
                    artist="${t.artist||this.artistName||""}"
                    albumart="${e}"
                    uri="${t.uri||""}"
                    type="album"
                    service="${t.service||""}"
                    @volumio-card-click=${this._onCardClick}
                    @volumio-card-play=${this._onCardPlay}
                  ></volumio-album-card>
                `})}
            </div>
          `:Q`<div class="empty-state">No albums found</div>`}
      </div>

      ${this._renderBioSection()}
      ${this._renderSimilarSection()}
    `}_renderBioSection(){if(this.bioLoading)return Q`
        <div class="section" aria-busy="true" aria-label="Loading artist bio">
          <div class="section-title">About</div>
          <div class="skeleton-bar w-full"></div>
          <div class="skeleton-bar w-90"></div>
          <div class="skeleton-bar w-75"></div>
        </div>
      `;if(!this.bio)return"";const t=this.bio.split(/\s+/),e=t.length>200&&!this._bioExpanded?t.slice(0,200).join(" ")+"…":this.bio;return Q`
      <div class="section">
        <div class="section-title">About</div>
        <div class="bio-text">${e}</div>
        ${t.length>200?Q`
            <button class="bio-toggle" @click=${this._toggleBio}>
              ${this._bioExpanded?"Show less":"Read more"}
            </button>
          `:""}
      </div>
    `}_renderSimilarSection(){return this.similarLoading?Q`
        <div class="section" aria-busy="true" aria-label="Loading similar artists">
          <div class="section-title">Similar Artists</div>
          <div class="skeleton-similar-grid">
            ${Array(6).fill(0).map(()=>Q`
              <div class="skeleton-similar-card">
                <div class="skeleton-similar-art"></div>
                <div class="skeleton-similar-name"></div>
              </div>
            `)}
          </div>
        </div>
      `:this.similarArtists&&0!==this.similarArtists.length?Q`
      <div class="section">
        <div class="section-title">Similar Artists</div>
        <div class="similar-grid">
          ${this.similarArtists.map(t=>{const e=ft(t.albumart,this.volumioUrl,this.configEntryId);return Q`
              <div
                class="similar-card"
                role="button"
                tabindex="0"
                @click=${()=>this._onSimilarClick(t)}
                @keydown=${e=>this._onSimilarKeydown(e,t)}
              >
                <div class="similar-art">
                  ${e?Q`<img src="${e}" alt="${t.artist||""}" @error=${this._onArtError} />`:Q`<ha-icon icon="mdi:account-music"></ha-icon>`}
                </div>
                <div class="similar-name">${t.artist||"Unknown"}</div>
              </div>
            `})}
        </div>
      </div>
    `:""}_renderSkeleton(){return Q`
      <div aria-busy="true" aria-label="Loading artist">
        <div class="skeleton-name"></div>
        <div class="skeleton-grid">
          ${Array(6).fill(0).map(()=>Q`<div class="skeleton-card"></div>`)}
        </div>
      </div>
    `}_toggleBio(){this._bioExpanded=!this._bioExpanded}_onSimilarClick(t){this.dispatchEvent(new CustomEvent("volumio-similar-artist-click",{detail:{artist:t.artist||"",uri:t.uri||"",albumart:t.albumart||""},bubbles:!0,composed:!0}))}_onSimilarKeydown(t,e){"Enter"!==t.key&&" "!==t.key||(t.preventDefault(),this._onSimilarClick(e))}_onArtError(t){const e=t.target.parentElement;t.target.remove(),e.innerHTML='<ha-icon icon="mdi:account-music"></ha-icon>'}_onCardClick(t){t.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-card-click",{detail:t.detail,bubbles:!0,composed:!0}))}_onCardPlay(t){t.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-card-play",{detail:t.detail,bubbles:!0,composed:!0}))}});customElements.define("volumio-search-results",class extends rt{static get properties(){return{results:{type:Object},loading:{type:Boolean},query:{type:String},volumioUrl:{type:String,attribute:"volumio-url"},configEntryId:{type:String,attribute:"config-entry-id"},currentUri:{type:String,attribute:"current-uri"},_expandedSections:{type:Object,state:!0}}}static get styles(){return o`
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
    `}constructor(){super(),this.results=null,this.loading=!1,this.query="",this.volumioUrl="",this.currentUri="",this._expandedSections={}}render(){if(this.loading)return this._renderSkeleton();const t=this._parseResults();if(!t||0===t.length)return this.query?Q`
        <div class="empty-state">
          <ha-icon icon="mdi:magnify-close"></ha-icon>
          <div class="message">No results found for "${this.query}"</div>
        </div>
      `:Q``;const e=t.reduce((t,e)=>t+e.sections.reduce((t,e)=>t+e.items.length,0),0);return Q`
      <div class="results-header">
        Found <strong>${e}</strong> result${1!==e?"s":""} for "<strong>${this.query}</strong>"
      </div>

      ${t.map(t=>this._renderSourceGroup(t))}
    `}_parseResults(){if(!this.results)return[];const t=this.results.navigation||this.results,e=t?.lists||[];if(0===e.length)return[];const i=new Map;for(const t of e){if(!t.items||0===t.items.length)continue;const{source:e,type:a}=this._parseListTitle(t.title||"");i.has(e)||i.set(e,new Map);const s=i.get(e);s.has(a)||s.set(a,[]),s.get(a).push(...t.items)}const a=[];for(const[t,e]of i){const i=[];for(const[t,a]of e)i.push({type:t,items:a});a.push({source:t,sections:i})}return a}_parseListTitle(t){if(!t)return{source:"Other",type:"Results"};const e=["QOBUZ","TIDAL","SPOTIFY","YOUTUBE","PANDORA"];for(const i of e)if(t.startsWith(i+" ")){const e=t.substring(i.length+1).trim();return{source:this._capitalizeSource(i),type:e||"Results"}}const i=t.match(/^Found\s+\d+\s+(\w+)/i);if(i){let t=i[1];return t.endsWith("s")||(t+="s"),{source:"Local",type:t}}return{source:"Other",type:t}}_capitalizeSource(t){return t.charAt(0).toUpperCase()+t.slice(1).toLowerCase()}_renderSourceGroup(t){const e=t.source,i=t.sections.reduce((t,e)=>t+e.items.length,0),a=!1===this._expandedSections[e];return Q`
      <div class="source-group">
        <div class="source-header" @click=${()=>this._toggleSection(e)}>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="source-title">${t.source}</span>
            <span class="source-count">${i}</span>
          </div>
          <ha-icon
            class="collapse-icon ${a?"collapsed":""}"
            icon="mdi:chevron-down"
          ></ha-icon>
        </div>
        ${a?"":t.sections.map(t=>this._renderTypeSection(t,e))}
      </div>
    `}_renderTypeSection(t,e){const i=`${e}:${t.type}`,a=!0===this._expandedSections[i],s=t.type.toLowerCase(),o=s.includes("album"),r=s.includes("track")||s.includes("song"),n=s.includes("artist");let l;l=o?4:r||n?3:4;const c=a?t.items:t.items.slice(0,l),d=t.items.length>l&&!a;return Q`
      <div class="type-section">
        <div class="type-title">${t.type}</div>

        ${n?this._renderArtistItems(c):r?this._renderTrackItems(c):this._renderGridItems(c,o?"album":null)}

        ${d?Q`
          <button class="show-all-btn" @click=${()=>this._expandSection(i)}>
            Show all ${t.items.length} →
          </button>
        `:""}
      </div>
    `}_renderGridItems(t,e){return Q`
      <div class="items-grid">
        ${t.map(t=>{const i=ft(t.albumart||t.icon,this.volumioUrl,this.configEntryId);return Q`
            <volumio-album-card
              title="${t.title||t.name||""}"
              artist="${t.artist||""}"
              albumart="${i}"
              uri="${t.uri||""}"
              type="${e||t.type||"album"}"
              service="${t.service||""}"
              @volumio-card-click=${this._onCardClick}
              @volumio-card-play=${this._onCardPlay}
            ></volumio-album-card>
          `})}
      </div>
    `}_renderTrackItems(t){return Q`
      <div class="items-list">
        ${t.map((t,e)=>{const i=ft(t.albumart||t.icon,this.volumioUrl,this.configEntryId);return Q`
            <volumio-track-card
              .index=${e+1}
              title="${t.title||t.name||""}"
              artist="${t.artist||""}"
              album="${t.album||""}"
              .duration=${t.duration||0}
              uri="${t.uri||""}"
              albumart="${i}"
              service="${t.service||""}"
              type="${t.type||"song"}"
              ?is-playing=${this.currentUri&&t.uri===this.currentUri}
              @volumio-track-click=${this._onTrackClick}
            ></volumio-track-card>
          `})}
      </div>
    `}_renderArtistItems(t){return Q`
      <div style="display: flex; flex-wrap: wrap;">
        ${t.map(t=>Q`
          <span
            class="artist-link"
            @click=${()=>this._onArtistClick(t)}
          >
            <ha-icon icon="mdi:account-music"></ha-icon>
            ${t.title||t.name||"Unknown"}
          </span>
        `)}
      </div>
    `}_renderSkeleton(){return Q`
      <div class="skeleton-results" aria-busy="true" aria-label="Searching">
        <div class="skeleton-section-title"></div>
        <div class="skeleton-grid">
          ${Array(4).fill(0).map(()=>Q`<div class="skeleton-card"></div>`)}
        </div>
        <div class="skeleton-section-title"></div>
        ${Array(3).fill(0).map(()=>Q`<div class="skeleton-row"></div>`)}
      </div>
    `}_toggleSection(t){this._expandedSections={...this._expandedSections,[t]:!1===this._expandedSections[t]&&void 0}}_expandSection(t){this._expandedSections={...this._expandedSections,[t]:!0}}_onCardClick(t){t.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-card-click",{detail:t.detail,bubbles:!0,composed:!0}))}_onCardPlay(t){t.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-card-play",{detail:t.detail,bubbles:!0,composed:!0}))}_onTrackClick(t){t.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-track-click",{detail:t.detail,bubbles:!0,composed:!0}))}_onArtistClick(t){this.dispatchEvent(new CustomEvent("volumio-card-click",{detail:{uri:t.uri||"",title:t.title||t.name||"",artist:t.title||t.name||"",albumart:t.albumart||"",type:"artist",service:t.service||""},bubbles:!0,composed:!0}))}});customElements.define("volumio-breadcrumb-bar",class extends rt{static get properties(){return{trail:{type:Array}}}static get styles(){return o`
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
    `}constructor(){super(),this.trail=[]}render(){if(!this.trail||0===this.trail.length)return Q``;const t=this._getDisplaySegments();return Q`
      <div class="breadcrumb">
        ${t.map((e,i)=>{const a=i===t.length-1;return Q`
            ${i>0?Q`<span class="sep"><ha-icon icon="mdi:chevron-right"></ha-icon></span>`:""}
            ${e.ellipsis?Q`<span class="ellipsis">...</span>`:Q`
                <span
                  class="segment ${a?"current":""}"
                  @click=${()=>!a&&this._onClick(e.index)}
                  title="${e.title}"
                >${e.title}</span>
              `}
          `})}
      </div>
    `}_getDisplaySegments(){const t=this.trail;return t.length<=5?t.map((t,e)=>({...t,index:e})):[{...t[0],index:0},{ellipsis:!0},...t.slice(-3).map((e,i)=>({...e,index:t.length-3+i}))]}_onClick(t){const e=this.trail[t];e&&this.dispatchEvent(new CustomEvent("volumio-breadcrumb-click",{detail:{index:t,uri:e.uri,title:e.title},bubbles:!0,composed:!0}))}});customElements.define("volumio-context-menu",class extends rt{static get properties(){return{open:{type:Boolean,reflect:!0},x:{type:Number},y:{type:Number},items:{type:Array},submenuItems:{type:Array},_showSubmenu:{type:Boolean,state:!0},_posStyle:{type:String,state:!0}}}static get styles(){return o`
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
    `}constructor(){super(),this.open=!1,this.x=0,this.y=0,this.items=[],this.submenuItems=[],this._showSubmenu=!1,this._posStyle="",this._onKeyDown=this._onKeyDown.bind(this)}updated(t){t.has("open")&&(this.open?(this._showSubmenu=!1,this._computePosition(),document.addEventListener("keydown",this._onKeyDown)):document.removeEventListener("keydown",this._onKeyDown)),(t.has("x")||t.has("y"))&&this.open&&this._computePosition()}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("keydown",this._onKeyDown)}_computePosition(){const t=Math.min(40*(this.items?.length||0)+20,.8*window.innerHeight);let e=this.x,i=this.y;e+240>window.innerWidth-8&&(e=window.innerWidth-240-8),e<8&&(e=8),i+t>window.innerHeight-8&&(i=window.innerHeight-t-8),i<8&&(i=8),this._posStyle=`left:${e}px;top:${i}px`}render(){return Q`
      <div class="backdrop" @click=${this._close} @contextmenu=${this._preventAndClose}></div>
      <div class="menu" style="${this._posStyle}">
        ${this._showSubmenu?this._renderSubmenu():this._renderMainMenu()}
      </div>
    `}_renderMainMenu(){return(this.items||[]).map(t=>t.separator?Q`<div class="separator"></div>`:Q`
        <div
          class="menu-item ${t.disabled?"disabled":""}"
          @click=${()=>this._onAction(t)}
        >
          <ha-icon icon="${t.icon}"></ha-icon>
          <span class="label">${t.label}</span>
          ${t.submenu?Q`<ha-icon class="arrow" icon="mdi:chevron-right"></ha-icon>`:""}
        </div>
      `)}_renderSubmenu(){return Q`
      <div class="submenu-header">
        <ha-icon icon="mdi:arrow-left" @click=${()=>{this._showSubmenu=!1}}></ha-icon>
        Add to Playlist
      </div>
      ${(this.submenuItems||[]).map(t=>Q`
        <div class="submenu-item" @click=${()=>this._onSubmenuAction(t.key)}>
          <ha-icon icon="mdi:playlist-music"></ha-icon>
          <span class="label">${t.label}</span>
        </div>
      `)}
      <div class="submenu-item create-new" @click=${()=>this._onSubmenuAction("__new__")}>
        <ha-icon icon="mdi:plus"></ha-icon>
        <span class="label">New Playlist</span>
      </div>
    `}_onAction(t){t.disabled||(t.submenu?this._showSubmenu=!0:(this.dispatchEvent(new CustomEvent("volumio-context-action",{detail:{action:t.key},bubbles:!0,composed:!0})),this._close()))}_onSubmenuAction(t){this.dispatchEvent(new CustomEvent("volumio-context-action",{detail:{action:"add_to_playlist",playlist:t},bubbles:!0,composed:!0})),this._close()}_close(){this.open=!1,this.dispatchEvent(new CustomEvent("volumio-context-close",{bubbles:!0,composed:!0}))}_preventAndClose(t){t.preventDefault(),this._close()}_onKeyDown(t){"Escape"===t.key&&this._close()}});customElements.define("volumio-toast-notification",class extends rt{static get properties(){return{message:{type:String},open:{type:Boolean,reflect:!0},undoAction:{type:String,attribute:"undo-action"}}}static get styles(){return o`
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
    `}constructor(){super(),this.message="",this.open=!1,this.undoAction=null,this._timer=null}updated(t){t.has("open")&&this.open&&this._startDismissTimer()}_startDismissTimer(){this._timer&&clearTimeout(this._timer),this._timer=setTimeout(()=>{this._dismiss()},3e3)}render(){return Q`
      <div class="toast">
        <span class="toast-message">${this.message}</span>
        ${this.undoAction?Q`<span class="toast-undo" @click=${this._onUndo}>Undo</span>`:""}
      </div>
    `}_onUndo(){this._timer&&(clearTimeout(this._timer),this._timer=null),this.dispatchEvent(new CustomEvent("volumio-toast-undo",{detail:{action:this.undoAction},bubbles:!0,composed:!0})),this._dismiss()}_dismiss(){this._timer&&(clearTimeout(this._timer),this._timer=null),this.open=!1,this.dispatchEvent(new CustomEvent("volumio-toast-dismiss",{bubbles:!0,composed:!0}))}show(t,e=null){this.message=t,this.undoAction=e,this.open=!0}});customElements.define("volumio-playlist-list",class extends rt{static get properties(){return{playlists:{type:Array},loading:{type:Boolean},_showCreateInput:{type:Boolean,state:!0},_createName:{type:String,state:!0}}}static get styles(){return o`
      :host {
        display: block;
        padding: var(--volumio-space-lg, 24px);
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--volumio-space-lg, 24px);
      }

      .title {
        font-size: 24px;
        font-weight: 700;
        color: var(--primary-text-color);
      }

      .count {
        font-size: 14px;
        color: var(--secondary-text-color);
        margin-left: 12px;
      }

      .create-btn {
        padding: 8px 20px;
        border-radius: 20px;
        border: none;
        background: var(--primary-color, #03a9f4);
        color: #fff;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: opacity 0.15s;
      }

      .create-btn:hover {
        opacity: 0.85;
      }

      .create-btn ha-icon {
        --mdc-icon-size: 18px;
      }

      /* ── Create input ──────────────── */
      .create-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: var(--volumio-space-md, 16px);
        padding: 8px 12px;
        background: var(--card-background-color, #1e1e1e);
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
        border-radius: 8px;
      }

      .create-row input {
        flex: 1;
        border: none;
        background: transparent;
        color: var(--primary-text-color);
        font-size: 14px;
        outline: none;
        min-width: 0;
      }

      .create-row input::placeholder {
        color: var(--secondary-text-color, #888);
      }

      .create-row button {
        padding: 6px 16px;
        border-radius: 14px;
        border: none;
        font-size: 13px;
        cursor: pointer;
      }

      .create-row .save-btn {
        background: var(--primary-color, #03a9f4);
        color: #fff;
      }

      .create-row .cancel-btn {
        background: var(--divider-color, rgba(255, 255, 255, 0.12));
        color: var(--primary-text-color);
      }

      /* ── Playlist items ────────────── */
      .playlist-list {
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        border-radius: 8px;
        overflow: hidden;
      }

      .playlist-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        cursor: pointer;
        transition: background 0.1s;
        border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.04));
      }

      .playlist-item:last-child {
        border-bottom: none;
      }

      .playlist-item:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.06));
      }

      .playlist-icon {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .playlist-icon ha-icon {
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
      }

      .playlist-name {
        flex: 1;
        font-size: 16px;
        font-weight: 500;
        color: var(--primary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .playlist-context {
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
        opacity: 0;
        transition: opacity 0.1s;
      }

      .playlist-item:hover .playlist-context {
        opacity: 1;
      }

      .playlist-context:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        color: var(--primary-text-color);
      }

      .playlist-context ha-icon {
        --mdc-icon-size: 18px;
      }

      /* ── Empty state ───────────────── */
      .empty-state {
        text-align: center;
        padding: 64px 24px;
        color: var(--secondary-text-color);
      }

      .empty-state ha-icon {
        --mdc-icon-size: 48px;
        opacity: 0.3;
        margin-bottom: 16px;
      }

      .empty-state .empty-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--primary-text-color);
        margin-bottom: 8px;
      }

      .empty-state .empty-desc {
        font-size: 14px;
        max-width: 360px;
        margin: 0 auto;
        line-height: 1.5;
      }

      /* ── Loading ───────────────────── */
      @keyframes shimmer {
        0% { opacity: 0.3; }
        50% { opacity: 0.15; }
        100% { opacity: 0.3; }
      }

      .skeleton-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
      }

      .skeleton-icon {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-text {
        height: 16px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-text.wide { width: 45%; }
      .skeleton-text.medium { width: 30%; }
    `}constructor(){super(),this.playlists=[],this.loading=!1,this._showCreateInput=!1,this._createName=""}render(){return this.loading?this._renderSkeleton():Q`
      <div class="header">
        <div>
          <span class="title">Playlists</span>
          ${this.playlists.length>0?Q`<span class="count">${this.playlists.length} playlist${1!==this.playlists.length?"s":""}</span>`:""}
        </div>
        <button class="create-btn" @click=${this._onCreateClick}>
          <ha-icon icon="mdi:plus"></ha-icon> New Playlist
        </button>
      </div>

      ${this._showCreateInput?Q`
        <div class="create-row">
          <input
            type="text"
            placeholder="Playlist name"
            .value=${this._createName}
            @input=${t=>{this._createName=t.target.value}}
            @keydown=${this._onCreateKeydown}
          />
          <button class="save-btn" @click=${this._onCreateConfirm}>Create</button>
          <button class="cancel-btn" @click=${()=>{this._showCreateInput=!1}}>Cancel</button>
        </div>
      `:""}

      ${0===this.playlists.length?Q`
          <div class="empty-state">
            <ha-icon icon="mdi:playlist-music-outline"></ha-icon>
            <div class="empty-title">No playlists yet</div>
            <div class="empty-desc">Create one from the queue or while browsing.</div>
          </div>
        `:Q`
          <div class="playlist-list">
            ${this.playlists.map(t=>Q`
              <div
                class="playlist-item"
                @click=${()=>this._onSelect(t)}
                @contextmenu=${e=>this._onContextMenu(e,t)}
              >
                <div class="playlist-icon">
                  <ha-icon icon="mdi:playlist-music"></ha-icon>
                </div>
                <div class="playlist-name">${t.title}</div>
                <button
                  class="playlist-context"
                  @click=${e=>this._onDotsClick(e,t)}
                  title="More actions"
                >
                  <ha-icon icon="mdi:dots-vertical"></ha-icon>
                </button>
              </div>
            `)}
          </div>
        `}
    `}_renderSkeleton(){return Q`
      <div class="header">
        <span class="title">Playlists</span>
      </div>
      <div class="playlist-list">
        ${Array(4).fill(0).map(()=>Q`
          <div class="skeleton-item">
            <div class="skeleton-icon"></div>
            <div class="skeleton-text wide"></div>
          </div>
        `)}
      </div>
    `}_onSelect(t){this.dispatchEvent(new CustomEvent("volumio-playlist-select",{detail:{name:t.title,uri:t.uri},bubbles:!0,composed:!0}))}_onCreateClick(){this._showCreateInput=!0,this._createName="",this.updateComplete.then(()=>{const t=this.shadowRoot?.querySelector(".create-row input");t&&t.focus()})}_onCreateKeydown(t){"Enter"===t.key&&this._onCreateConfirm(),"Escape"===t.key&&(this._showCreateInput=!1)}_onCreateConfirm(){const t=this._createName.trim();t&&(this._showCreateInput=!1,this.dispatchEvent(new CustomEvent("volumio-playlist-create",{detail:{name:t},bubbles:!0,composed:!0})))}_onDotsClick(t,e){t.stopPropagation(),t.preventDefault();const i=t.currentTarget.getBoundingClientRect();this._fireContextMenu(i.right,i.bottom,e)}_onContextMenu(t,e){t.preventDefault(),t.stopPropagation(),this._fireContextMenu(t.clientX,t.clientY,e)}_fireContextMenu(t,e,i){this.dispatchEvent(new CustomEvent("volumio-context-menu",{detail:{title:i.title,uri:i.uri,service:i.service||"",type:"playlist",x:t,y:e,context:"playlist"},bubbles:!0,composed:!0}))}});customElements.define("volumio-playlist-detail",class extends rt{static get properties(){return{playlistName:{type:String,attribute:"playlist-name"},playlistUri:{type:String,attribute:"playlist-uri"},tracks:{type:Array},loading:{type:Boolean},currentUri:{type:String,attribute:"current-uri"},volumioUrl:{type:String,attribute:"volumio-url"},configEntryId:{type:String,attribute:"config-entry-id"},_confirmDelete:{type:Boolean,state:!0}}}static get styles(){return o`
      :host {
        display: block;
        padding: var(--volumio-space-lg, 24px);
      }

      /* ── Header ──────────────────────── */
      .playlist-header {
        display: flex;
        align-items: center;
        gap: var(--volumio-space-lg, 24px);
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .playlist-icon-box {
        width: 120px;
        height: 120px;
        border-radius: 8px;
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .playlist-icon-box ha-icon {
        --mdc-icon-size: 48px;
        color: var(--secondary-text-color);
        opacity: 0.5;
      }

      .playlist-meta {
        display: flex;
        flex-direction: column;
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

      .playlist-title {
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

      .playlist-actions {
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

      .action-btn.danger {
        background: transparent;
        color: var(--error-color, #ef5350);
        border: 1px solid var(--error-color, #ef5350);
      }

      /* ── Confirm bar ───────────────── */
      .confirm-bar {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        padding: 10px 16px;
        background: var(--error-color, #ef5350);
        color: #fff;
        border-radius: 8px;
        margin-bottom: var(--volumio-space-md, 16px);
        font-size: 14px;
      }

      .confirm-bar button {
        padding: 4px 16px;
        border-radius: 12px;
        border: none;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
      }

      .confirm-bar .btn-yes {
        background: #fff;
        color: var(--error-color, #ef5350);
      }

      .confirm-bar .btn-no {
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
      }

      /* ── Track list ──────────────────── */
      .track-list {
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        border-radius: 8px;
        overflow: hidden;
      }

      .track-list-header {
        display: grid;
        grid-template-columns: 40px 1fr 1fr 0.8fr 32px 32px;
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

      .track-row-wrap {
        display: flex;
        align-items: center;
      }

      .track-remove {
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
        opacity: 0;
        transition: opacity 0.1s;
        flex-shrink: 0;
      }

      .track-row-wrap:hover .track-remove {
        opacity: 1;
      }

      .track-remove:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        color: var(--error-color, #ef5350);
      }

      .track-remove ha-icon {
        --mdc-icon-size: 16px;
      }

      /* ── Empty state ───────────────── */
      .empty-state {
        text-align: center;
        padding: 64px 24px;
        color: var(--secondary-text-color);
      }

      .empty-state ha-icon {
        --mdc-icon-size: 48px;
        opacity: 0.3;
        margin-bottom: 16px;
      }

      .empty-state .empty-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--primary-text-color);
        margin-bottom: 8px;
      }

      .empty-state .empty-desc {
        font-size: 14px;
      }

      /* ── Loading ───────────────────── */
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

      .skeleton-icon {
        width: 120px;
        height: 120px;
        border-radius: 8px;
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

      .skeleton-bar.title { width: 50%; height: 28px; }
      .skeleton-bar.detail { width: 30%; height: 14px; }

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

      /* ── Responsive ──────────────────── */
      @media (max-width: 768px) {
        .playlist-header {
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .playlist-icon-box {
          width: 100px;
          height: 100px;
        }

        .playlist-meta {
          align-items: center;
        }

        .playlist-actions {
          justify-content: center;
          flex-wrap: wrap;
        }

        .track-list-header {
          grid-template-columns: 40px 1fr 0.8fr 60px 32px;
        }

        .track-list-header .hdr-album {
          display: none;
        }
      }
    `}constructor(){super(),this.playlistName="",this.playlistUri="",this.tracks=[],this.loading=!1,this.currentUri="",this.volumioUrl="",this._confirmDelete=!1}render(){if(this.loading)return this._renderSkeleton();const t=this.tracks.length,e=this.tracks.reduce((t,e)=>t+(e.duration||0),0);return Q`
      <div class="playlist-header">
        <div class="playlist-icon-box">
          <ha-icon icon="mdi:playlist-music"></ha-icon>
        </div>
        <div class="playlist-meta">
          <span class="meta-type">Playlist</span>
          <div class="playlist-title">${this.playlistName||"Unknown Playlist"}</div>
          <div class="meta-details">
            ${t>0?Q`<span class="detail">${t} track${1!==t?"s":""}</span>`:""}
            ${t>0&&e>0?Q`<span class="sep">·</span>`:""}
            ${e>0?Q`<span class="detail">${_t(e)}</span>`:""}
          </div>
          <div class="playlist-actions">
            <button class="action-btn primary" @click=${this._playAll} ?disabled=${0===t}>
              <ha-icon icon="mdi:play"></ha-icon> Play
            </button>
            <button class="action-btn secondary" @click=${this._enqueueAll} ?disabled=${0===t}>
              <ha-icon icon="mdi:playlist-plus"></ha-icon> Enqueue
            </button>
            <button class="action-btn danger" @click=${()=>{this._confirmDelete=!0}}>
              <ha-icon icon="mdi:delete-outline"></ha-icon> Delete
            </button>
          </div>
        </div>
      </div>

      ${this._confirmDelete?Q`
        <div class="confirm-bar">
          <span>Delete "${this.playlistName}"?</span>
          <button class="btn-yes" @click=${this._deletePlaylist}>Yes, delete</button>
          <button class="btn-no" @click=${()=>{this._confirmDelete=!1}}>Cancel</button>
        </div>
      `:""}

      ${0===t?Q`
          <div class="empty-state">
            <ha-icon icon="mdi:playlist-music-outline"></ha-icon>
            <div class="empty-title">Empty playlist</div>
            <div class="empty-desc">Add tracks from browse or search.</div>
          </div>
        `:Q`
          <div class="track-list">
            <div class="track-list-header">
              <span>#</span>
              <span>Title</span>
              <span>Artist</span>
              <span class="hdr-album">Album</span>
              <span></span>
              <span></span>
            </div>
            ${this.tracks.map((t,e)=>{const i=ft(t.albumart||t.icon,this.volumioUrl,this.configEntryId);return Q`
                <div class="track-row-wrap">
                  <volumio-track-card
                    style="flex:1;min-width:0"
                    .index=${e+1}
                    title="${t.title||t.name||""}"
                    artist="${t.artist||""}"
                    album="${t.album||""}"
                    .duration=${t.duration||0}
                    uri="${t.uri||""}"
                    albumart="${i}"
                    service="${t.service||""}"
                    type="${t.type||"song"}"
                    ?is-playing=${t.uri===this.currentUri}
                    @volumio-track-click=${this._onTrackClick}
                  ></volumio-track-card>
                  <button
                    class="track-remove"
                    @click=${e=>this._onRemoveTrack(e,t)}
                    title="Remove from playlist"
                  >
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>
                </div>
              `})}
          </div>
        `}
    `}_renderSkeleton(){return Q`
      <div class="skeleton-header">
        <div class="skeleton-icon"></div>
        <div class="skeleton-meta">
          <div class="skeleton-bar title"></div>
          <div class="skeleton-bar detail"></div>
        </div>
      </div>
      <div class="skeleton-tracks">
        ${Array(6).fill(0).map(()=>Q`<div class="skeleton-track"></div>`)}
      </div>
    `}_playAll(){this.dispatchEvent(new CustomEvent("volumio-playlist-play",{detail:{name:this.playlistName},bubbles:!0,composed:!0}))}_enqueueAll(){this.dispatchEvent(new CustomEvent("volumio-playlist-enqueue",{detail:{name:this.playlistName},bubbles:!0,composed:!0}))}_deletePlaylist(){this._confirmDelete=!1,this.dispatchEvent(new CustomEvent("volumio-playlist-delete",{detail:{name:this.playlistName},bubbles:!0,composed:!0}))}_onTrackClick(t){t.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-track-click",{detail:t.detail,bubbles:!0,composed:!0}))}_onRemoveTrack(t,e){t.stopPropagation(),this.dispatchEvent(new CustomEvent("volumio-playlist-remove-track",{detail:{playlistName:this.playlistName,uri:e.uri,service:e.service||""},bubbles:!0,composed:!0}))}});const Pt={mpd:"Local",qobuz:"Qobuz",tidal:"TIDAL",spotify:"Spotify",spop:"Spotify",webradio:"Radio",pandora:"Pandora",youtube:"YouTube",youtube2:"YouTube",ytmusic:"YouTube Music"};customElements.define("volumio-favorites-view",class extends rt{static get properties(){return{items:{type:Array},loading:{type:Boolean},currentUri:{type:String,attribute:"current-uri"},volumioUrl:{type:String,attribute:"volumio-url"},configEntryId:{type:String,attribute:"config-entry-id"}}}static get styles(){return o`
      :host {
        display: block;
        padding: var(--volumio-space-lg, 24px);
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--volumio-space-lg, 24px);
      }

      .title {
        font-size: 24px;
        font-weight: 700;
        color: var(--primary-text-color);
      }

      .count {
        font-size: 14px;
        color: var(--secondary-text-color);
        margin-left: 12px;
      }

      /* ── Favorites list ────────────── */
      .favorites-list {
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        border-radius: 8px;
        overflow: hidden;
      }

      .fav-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
        cursor: pointer;
        transition: background 0.1s;
        border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.04));
      }

      .fav-item:last-child {
        border-bottom: none;
      }

      .fav-item:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.06));
      }

      .fav-item.playing {
        border-left: 3px solid var(--primary-color, #03a9f4);
      }

      .fav-item.playing .fav-title {
        color: var(--primary-color, #03a9f4);
      }

      .fav-art {
        width: 44px;
        height: 44px;
        border-radius: 4px;
        overflow: hidden;
        flex-shrink: 0;
        background: var(--card-background-color, #2a2a2a);
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .fav-art img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .fav-art ha-icon {
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
        opacity: 0.4;
      }

      .fav-art:empty::after {
        content: "";
        display: block;
        width: 20px;
        height: 20px;
        background: var(--secondary-text-color);
        opacity: 0.4;
        mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E");
        -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E");
        mask-size: contain;
        -webkit-mask-size: contain;
      }

      .fav-info {
        flex: 1;
        min-width: 0;
      }

      .fav-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .fav-meta {
        font-size: 13px;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 2px;
      }

      .fav-service {
        font-size: 11px;
        color: var(--secondary-text-color);
        opacity: 0.6;
        text-transform: capitalize;
        flex-shrink: 0;
      }

      .fav-context {
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
        opacity: 0;
        transition: opacity 0.1s;
        flex-shrink: 0;
      }

      .fav-item:hover .fav-context {
        opacity: 1;
      }

      .fav-context:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        color: var(--primary-text-color);
      }

      .fav-context ha-icon {
        --mdc-icon-size: 18px;
      }

      /* ── Empty state ───────────────── */
      .empty-state {
        text-align: center;
        padding: 64px 24px;
        color: var(--secondary-text-color);
      }

      .empty-state ha-icon {
        --mdc-icon-size: 48px;
        opacity: 0.3;
        margin-bottom: 16px;
      }

      .empty-state .empty-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--primary-text-color);
        margin-bottom: 8px;
      }

      .empty-state .empty-desc {
        font-size: 14px;
        max-width: 360px;
        margin: 0 auto;
        line-height: 1.5;
      }

      /* ── Loading ───────────────────── */
      @keyframes shimmer {
        0% { opacity: 0.3; }
        50% { opacity: 0.15; }
        100% { opacity: 0.3; }
      }

      .skeleton-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
      }

      .skeleton-art {
        width: 44px;
        height: 44px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
        flex-shrink: 0;
      }

      .skeleton-lines {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }

      .skeleton-bar {
        height: 14px;
        border-radius: 4px;
        background: var(--secondary-text-color, #888);
        animation: shimmer 1.4s ease-in-out infinite;
      }

      .skeleton-bar.wide { width: 55%; }
      .skeleton-bar.narrow { width: 35%; }
    `}constructor(){super(),this.items=[],this.loading=!1,this.currentUri="",this.volumioUrl=""}render(){return this.loading?this._renderSkeleton():Q`
      <div class="header">
        <div>
          <span class="title">Favorites</span>
          ${this.items.length>0?Q`<span class="count">${this.items.length} item${1!==this.items.length?"s":""}</span>`:""}
        </div>
      </div>

      ${0===this.items.length?Q`
          <div class="empty-state">
            <ha-icon icon="mdi:heart-outline"></ha-icon>
            <div class="empty-title">No favorites yet</div>
            <div class="empty-desc">Tap the heart icon on any track, album, or artist to add it here.</div>
          </div>
        `:Q`
          <div class="favorites-list">
            ${this.items.map(t=>{const e=ft(t.albumart,this.volumioUrl,this.configEntryId),i=t.uri===this.currentUri,a=[t.artist,t.album].filter(Boolean).join(" — ");return Q`
                <div
                  class="fav-item ${i?"playing":""}"
                  @click=${()=>this._onItemClick(t)}
                  @contextmenu=${e=>this._onContextMenu(e,t)}
                >
                  <div class="fav-art">
                    ${e?Q`<img src="${e}" alt="" loading="lazy" @error=${t=>{t.target.remove()}} />`:Q`<ha-icon icon="mdi:music-note"></ha-icon>`}
                  </div>
                  <div class="fav-info">
                    <div class="fav-title">${t.title||"—"}</div>
                    ${a?Q`<div class="fav-meta">${a}</div>`:""}
                  </div>
                  <span class="fav-service">${s=t.service,s?Pt[s]||s.charAt(0).toUpperCase()+s.slice(1):""}</span>
                  <button
                    class="fav-context"
                    @click=${e=>this._onDotsClick(e,t)}
                    title="More actions"
                  >
                    <ha-icon icon="mdi:dots-vertical"></ha-icon>
                  </button>
                </div>
              `;var s})}
          </div>
        `}
    `}_renderSkeleton(){return Q`
      <div class="header">
        <span class="title">Favorites</span>
      </div>
      <div class="favorites-list">
        ${Array(5).fill(0).map(()=>Q`
          <div class="skeleton-item">
            <div class="skeleton-art"></div>
            <div class="skeleton-lines">
              <div class="skeleton-bar wide"></div>
              <div class="skeleton-bar narrow"></div>
            </div>
          </div>
        `)}
      </div>
    `}_onItemClick(t){this.dispatchEvent(new CustomEvent("volumio-track-click",{detail:{uri:t.uri,title:t.title||"",artist:t.artist||"",album:t.album||"",albumart:t.albumart||"",service:t.service||"",type:t.type||"song"},bubbles:!0,composed:!0}))}_onDotsClick(t,e){t.stopPropagation(),t.preventDefault();const i=t.currentTarget.getBoundingClientRect();this._fireContextMenu(i.right,i.bottom,e)}_onContextMenu(t,e){t.preventDefault(),t.stopPropagation(),this._fireContextMenu(t.clientX,t.clientY,e)}_fireContextMenu(t,e,i){this.dispatchEvent(new CustomEvent("volumio-context-menu",{detail:{uri:i.uri,title:i.title||"",artist:i.artist||"",album:i.album||"",albumart:i.albumart||"",service:i.service||"",type:i.type||"song",x:t,y:e,context:"favorite"},bubbles:!0,composed:!0}))}});customElements.define("volumio-history-view",class extends rt{static get properties(){return{history:{type:Array},currentUri:{type:String,attribute:"current-uri"},volumioUrl:{type:String,attribute:"volumio-url"},configEntryId:{type:String,attribute:"config-entry-id"}}}static get styles(){return o`
      :host {
        display: block;
        padding: var(--volumio-space-lg, 24px);
      }

      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: var(--volumio-space-lg, 24px);
      }

      .title {
        font-size: 24px;
        font-weight: 700;
        color: var(--primary-text-color);
      }

      .count {
        font-size: 14px;
        color: var(--secondary-text-color);
        margin-left: 12px;
      }

      .clear-btn {
        padding: 8px 20px;
        border-radius: 20px;
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
        background: transparent;
        color: var(--secondary-text-color);
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: background 0.15s, color 0.15s;
      }

      .clear-btn:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        color: var(--primary-text-color);
      }

      .clear-btn ha-icon {
        --mdc-icon-size: 16px;
      }

      /* ── Date groups ───────────────── */
      .date-group {
        margin-bottom: var(--volumio-space-lg, 24px);
      }

      .date-label {
        font-size: 13px;
        font-weight: 600;
        color: var(--secondary-text-color);
        padding: 0 0 8px 0;
        border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        margin-bottom: 4px;
      }

      /* ── History items ─────────────── */
      .history-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
        cursor: pointer;
        transition: background 0.1s;
        border-radius: 6px;
      }

      .history-item:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.06));
      }

      .history-item.playing {
        border-left: 3px solid var(--primary-color, #03a9f4);
      }

      .history-item.playing .hi-title {
        color: var(--primary-color, #03a9f4);
      }

      .hi-art {
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

      .hi-art img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .hi-art:empty::after {
        content: "";
        display: block;
        width: 18px;
        height: 18px;
        background: var(--secondary-text-color);
        opacity: 0.4;
        mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E");
        -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z'/%3E%3C/svg%3E");
        mask-size: contain;
        -webkit-mask-size: contain;
      }

      .hi-art ha-icon {
        --mdc-icon-size: 18px;
        color: var(--secondary-text-color);
        opacity: 0.4;
      }

      .hi-info {
        flex: 1;
        min-width: 0;
      }

      .hi-title {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .hi-meta {
        font-size: 13px;
        color: var(--secondary-text-color);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-top: 1px;
      }

      .hi-time {
        font-size: 12px;
        color: var(--secondary-text-color);
        opacity: 0.6;
        flex-shrink: 0;
        font-variant-numeric: tabular-nums;
      }

      .hi-context {
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
        opacity: 0;
        transition: opacity 0.1s;
        flex-shrink: 0;
      }

      .history-item:hover .hi-context {
        opacity: 1;
      }

      .hi-context:hover {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        color: var(--primary-text-color);
      }

      .hi-context ha-icon {
        --mdc-icon-size: 18px;
      }

      /* ── Empty state ───────────────── */
      .empty-state {
        text-align: center;
        padding: 64px 24px;
        color: var(--secondary-text-color);
      }

      .empty-state ha-icon {
        --mdc-icon-size: 48px;
        opacity: 0.3;
        margin-bottom: 16px;
      }

      .empty-state .empty-title {
        font-size: 18px;
        font-weight: 600;
        color: var(--primary-text-color);
        margin-bottom: 8px;
      }

      .empty-state .empty-desc {
        font-size: 14px;
      }
    `}constructor(){super(),this.history=[],this.currentUri="",this.volumioUrl=""}render(){if(0===this.history.length)return Q`
        <div class="header">
          <span class="title">History</span>
        </div>
        <div class="empty-state">
          <ha-icon icon="mdi:history"></ha-icon>
          <div class="empty-title">No listening history yet</div>
          <div class="empty-desc">Play some music!</div>
        </div>
      `;const t=this._groupByDate(this.history);return Q`
      <div class="header">
        <div>
          <span class="title">History</span>
          <span class="count">${this.history.length} track${1!==this.history.length?"s":""}</span>
        </div>
        <button class="clear-btn" @click=${this._onClear}>
          <ha-icon icon="mdi:delete-outline"></ha-icon> Clear History
        </button>
      </div>

      ${t.map(t=>Q`
        <div class="date-group">
          <div class="date-label">${t.label}</div>
          ${t.items.map(t=>{const e=ft(t.albumart,this.volumioUrl,this.configEntryId),i=t.uri===this.currentUri,a=[t.artist,t.album].filter(Boolean).join(" — "),s=this._formatTime(t.timestamp);return Q`
              <div
                class="history-item ${i?"playing":""}"
                @click=${()=>this._onItemClick(t)}
                @contextmenu=${e=>this._onContextMenu(e,t)}
              >
                <div class="hi-art">
                  ${e?Q`<img src="${e}" alt="" loading="lazy" @error=${t=>{t.target.remove()}} />`:Q`<ha-icon icon="mdi:music-note"></ha-icon>`}
                </div>
                <div class="hi-info">
                  <div class="hi-title">${t.title||"—"}</div>
                  ${a?Q`<div class="hi-meta">${a}</div>`:""}
                </div>
                <span class="hi-time">${s}</span>
                <button
                  class="hi-context"
                  @click=${e=>this._onDotsClick(e,t)}
                  title="More actions"
                >
                  <ha-icon icon="mdi:dots-vertical"></ha-icon>
                </button>
              </div>
            `})}
        </div>
      `)}
    `}_groupByDate(t){const e=new Map,i=new Date,a=i.toDateString(),s=new Date(i);s.setDate(s.getDate()-1);const o=s.toDateString();for(const i of t){const t=new Date(i.timestamp),s=t.toDateString();let r;r=s===a?"Today":s===o?"Yesterday":t.toLocaleDateString(void 0,{weekday:"long",month:"short",day:"numeric"}),e.has(r)||e.set(r,[]),e.get(r).push(i)}return Array.from(e.entries()).map(([t,e])=>({label:t,items:e}))}_formatTime(t){return new Date(t).toLocaleTimeString(void 0,{hour:"numeric",minute:"2-digit"})}_onItemClick(t){this.dispatchEvent(new CustomEvent("volumio-track-click",{detail:{uri:t.uri,title:t.title||"",artist:t.artist||"",album:t.album||"",albumart:t.albumart||"",service:t.service||"",type:"song"},bubbles:!0,composed:!0}))}_onClear(){this.dispatchEvent(new CustomEvent("volumio-history-clear",{bubbles:!0,composed:!0}))}_onDotsClick(t,e){t.stopPropagation(),t.preventDefault();const i=t.currentTarget.getBoundingClientRect();this._fireContextMenu(i.right,i.bottom,e)}_onContextMenu(t,e){t.preventDefault(),t.stopPropagation(),this._fireContextMenu(t.clientX,t.clientY,e)}_fireContextMenu(t,e,i){this.dispatchEvent(new CustomEvent("volumio-context-menu",{detail:{uri:i.uri,title:i.title||"",artist:i.artist||"",album:i.album||"",albumart:i.albumart||"",service:i.service||"",type:"song",x:t,y:e,context:"history"},bubbles:!0,composed:!0}))}});customElements.define("volumio-settings-panel",class extends rt{static get properties(){return{clickAction:{type:String,attribute:"click-action"},queueThumbnails:{type:Boolean,attribute:"queue-thumbnails"},browseViewMode:{type:String,attribute:"browse-view-mode"},aboutInfo:{type:Object}}}static get styles(){return o`
      :host {
        display: block;
        padding: var(--volumio-space-lg, 24px);
        max-width: 640px;
      }

      .header {
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .title {
        font-size: 24px;
        font-weight: 700;
        color: var(--primary-text-color);
      }

      /* ── Sections ──────────────────── */
      .section {
        margin-bottom: var(--volumio-space-xl, 32px);
      }

      .section-title {
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: var(--secondary-text-color);
        padding-bottom: 8px;
        border-bottom: 1px solid var(--divider-color, rgba(255, 255, 255, 0.06));
        margin-bottom: var(--volumio-space-md, 16px);
      }

      /* ── Setting row ───────────────── */
      .setting-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 0;
        gap: 16px;
      }

      .setting-row + .setting-row {
        border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.04));
      }

      .setting-info {
        flex: 1;
        min-width: 0;
      }

      .setting-label {
        font-size: 15px;
        color: var(--primary-text-color);
        font-weight: 500;
      }

      .setting-desc {
        font-size: 13px;
        color: var(--secondary-text-color);
        margin-top: 2px;
        line-height: 1.4;
      }

      /* ── Toggle switch ─────────────── */
      .toggle {
        position: relative;
        width: 44px;
        height: 24px;
        flex-shrink: 0;
      }

      .toggle input {
        opacity: 0;
        width: 0;
        height: 0;
        position: absolute;
      }

      .toggle-track {
        position: absolute;
        inset: 0;
        border-radius: 12px;
        background: var(--divider-color, rgba(255, 255, 255, 0.2));
        cursor: pointer;
        transition: background 0.2s;
      }

      .toggle input:checked + .toggle-track {
        background: var(--primary-color, #03a9f4);
      }

      .toggle-track::after {
        content: "";
        position: absolute;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        background: #fff;
        top: 3px;
        left: 3px;
        transition: transform 0.2s;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }

      .toggle input:checked + .toggle-track::after {
        transform: translateX(20px);
      }

      /* ── Segmented control ─────────── */
      .segmented {
        display: flex;
        border: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
        border-radius: 8px;
        overflow: hidden;
        flex-shrink: 0;
      }

      .seg-btn {
        padding: 6px 16px;
        border: none;
        background: transparent;
        color: var(--secondary-text-color);
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: background 0.15s, color 0.15s;
      }

      .seg-btn + .seg-btn {
        border-left: 1px solid var(--divider-color, rgba(255, 255, 255, 0.12));
      }

      .seg-btn.active {
        background: var(--primary-color, #03a9f4);
        color: #fff;
      }

      .seg-btn:hover:not(.active) {
        background: var(--divider-color, rgba(255, 255, 255, 0.08));
        color: var(--primary-text-color);
      }

      /* ── About section ─────────────── */
      .about-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 8px 0;
      }

      .about-row + .about-row {
        border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.04));
      }

      .about-key {
        font-size: 14px;
        color: var(--secondary-text-color);
      }

      .about-value {
        font-size: 14px;
        color: var(--primary-text-color);
        font-weight: 500;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 60%;
      }

      /* ── About attribution ─────────── */
      .about-attribution {
        padding-top: 12px;
        margin-top: 4px;
        border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.04));
        font-size: 13px;
        color: var(--secondary-text-color);
        line-height: 1.4;
      }

      .about-attribution a {
        color: var(--secondary-text-color);
        text-decoration: none;
        opacity: 0.8;
        transition: opacity 0.15s;
      }

      .about-attribution a:hover {
        opacity: 1;
        text-decoration: underline;
      }

      .about-sep {
        margin: 0 6px;
        opacity: 0.4;
      }
    `}constructor(){super(),this.clickAction="play_now",this.queueThumbnails=!0,this.browseViewMode="grid",this.aboutInfo={}}render(){return Q`
      <div class="header">
        <span class="title">Settings</span>
      </div>

      <div class="section">
        <div class="section-title">Behavior</div>

        <div class="setting-row">
          <div class="setting-info">
            <div class="setting-label">Default click action</div>
            <div class="setting-desc">What happens when you click a track</div>
          </div>
          <div class="segmented">
            <button
              class="seg-btn ${"play_now"===this.clickAction?"active":""}"
              @click=${()=>this._onChange("clickAction","play_now")}
            >Play Now</button>
            <button
              class="seg-btn ${"add_to_queue"===this.clickAction?"active":""}"
              @click=${()=>this._onChange("clickAction","add_to_queue")}
            >Add to Queue</button>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Appearance</div>

        <div class="setting-row">
          <div class="setting-info">
            <div class="setting-label">Queue thumbnails</div>
            <div class="setting-desc">Show album art in the queue panel</div>
          </div>
          <label class="toggle">
            <input
              type="checkbox"
              .checked=${this.queueThumbnails}
              @change=${t=>this._onChange("queueThumbnails",t.target.checked)}
            />
            <span class="toggle-track"></span>
          </label>
        </div>

        <div class="setting-row">
          <div class="setting-info">
            <div class="setting-label">Browse view</div>
            <div class="setting-desc">Default layout for browse lists</div>
          </div>
          <div class="segmented">
            <button
              class="seg-btn ${"grid"===this.browseViewMode?"active":""}"
              @click=${()=>this._onChange("browseViewMode","grid")}
            >Grid</button>
            <button
              class="seg-btn ${"list"===this.browseViewMode?"active":""}"
              @click=${()=>this._onChange("browseViewMode","list")}
            >List</button>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">About</div>
        ${this.aboutInfo.volumioUrl?Q`
          <div class="about-row">
            <span class="about-key">Volumio URL</span>
            <span class="about-value">${this.aboutInfo.volumioUrl}</span>
          </div>
        `:""}
        ${this.aboutInfo.entityId?Q`
          <div class="about-row">
            <span class="about-key">Entity</span>
            <span class="about-value">${this.aboutInfo.entityId}</span>
          </div>
        `:""}
        <div class="about-attribution">
          LitGUI for Volumio<span class="about-sep">·</span><a href="https://litgui.com" target="_blank" rel="noopener noreferrer">litgui.com</a>
        </div>
      </div>
    `}_onChange(t,e){this.dispatchEvent(new CustomEvent("volumio-setting-change",{detail:{key:t,value:e},bubbles:!0,composed:!0}))}});const Dt={mpd:"Local",qobuz:"Qobuz",tidal:"TIDAL",spotify:"Spotify",spop:"Spotify",webradio:"Radio",pandora:"Pandora",youtube:"YouTube",youtube2:"YouTube",ytmusic:"YouTube Music"};function Lt(t){return t?Dt[t]||t.charAt(0).toUpperCase()+t.slice(1):""}customElements.define("volumio-panel",class extends rt{static get properties(){return{hass:{type:Object},narrow:{type:Boolean},route:{type:Object},panel:{type:Object},_queue:{type:Array,state:!0},_activeView:{type:String,state:!0},_navMode:{type:String,state:!0},_showQueue:{type:Boolean,state:!0},_showNavFlyout:{type:Boolean,state:!0},_isFavorite:{type:Boolean,state:!0},_browseStack:{type:Array,state:!0},_browseItems:{type:Array,state:!0},_browseLoading:{type:Boolean,state:!0},_browseContext:{type:Object,state:!0},_artistBio:{type:String,state:!0},_similarArtists:{type:Array,state:!0},_albumStory:{type:String,state:!0},_albumCredits:{type:Array,state:!0},_metadataLoading:{type:Object,state:!0},_searchResults:{type:Object,state:!0},_searchLoading:{type:Boolean,state:!0},_searchQuery:{type:String,state:!0},_searchTrail:{type:Array,state:!0},_browseSources:{type:Array,state:!0},_activeSourceUri:{type:String,state:!0},_devices:{type:Array,state:!0},_activeDeviceId:{type:String,state:!0},_ctxOpen:{type:Boolean,state:!0},_ctxX:{type:Number,state:!0},_ctxY:{type:Number,state:!0},_ctxItems:{type:Array,state:!0},_ctxTarget:{type:Object,state:!0},_ctxPlaylists:{type:Array,state:!0},_toastMessage:{type:String,state:!0},_toastOpen:{type:Boolean,state:!0},_toastUndo:{type:String,state:!0},_toastUndoData:{type:Object,state:!0},_queueConfirmClear:{type:Boolean,state:!0},_queueSaveOpen:{type:Boolean,state:!0},_queueSaveName:{type:String,state:!0},_dragIndex:{type:Number,state:!0},_dragOverIndex:{type:Number,state:!0},_playlistItems:{type:Array,state:!0},_playlistDetailItems:{type:Array,state:!0},_playlistDetailContext:{type:Object,state:!0},_playlistLoading:{type:Boolean,state:!0},_favoritesItems:{type:Array,state:!0},_favoritesLoading:{type:Boolean,state:!0},_history:{type:Array,state:!0},_settingClickAction:{type:String,state:!0},_settingQueueThumbnails:{type:Boolean,state:!0},_settingBrowseViewMode:{type:String,state:!0}}}static get styles(){return[lt,o`
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
      `]}constructor(){super(),this._adapter=new Ct,this._adapterConnected=!1,this._queue=[],this._activeView="now-playing",this._navMode="collapsed",this._showQueue=!1,this._showNavFlyout=!1,this._isFavorite=!1,this._favoritesCache=[],this._lastUri=null,this._keyHandler=this._onKeyDown.bind(this),this._browseStack=[],this._browseItems=[],this._browseLoading=!1,this._browseContext=null,this._artistBio=null,this._similarArtists=[],this._albumStory=null,this._albumCredits=[],this._metadataLoading={bio:!1,similar:!1,story:!1,credits:!1},this._metadataArtistKey=null,this._metadataAlbumKey=null,this._searchResults=null,this._searchLoading=!1,this._searchQuery="",this._searchTrail=[],this._browseSources=[],this._activeSourceUri="",this._devices=[],this._activeDeviceId="",this._ctxOpen=!1,this._ctxX=0,this._ctxY=0,this._ctxItems=[],this._ctxTarget=null,this._ctxPlaylists=[],this._toastMessage="",this._toastOpen=!1,this._toastUndo=null,this._toastUndoData=null,this._queueConfirmClear=!1,this._queueSaveOpen=!1,this._queueSaveName="",this._dragIndex=-1,this._dragOverIndex=-1,this._playlistItems=[],this._playlistDetailItems=[],this._playlistDetailContext=null,this._playlistLoading=!1,this._favoritesItems=[],this._favoritesLoading=!1;try{const t=JSON.parse(wt("volumio-ws-history","[]"));this._history=Array.isArray(t)?t:[]}catch{this._history=[]}this._settingClickAction=wt("volumio-default-click","play_now"),this._settingQueueThumbnails="false"!==wt("volumio-queue-thumbnails"),this._settingBrowseViewMode=wt("volumio-browse-view-mode","grid")}connectedCallback(){super.connectedCallback(),this._applyBreakpoint(),window.addEventListener("resize",this._onResize),window.addEventListener("keydown",this._keyHandler),this._adapter.onQueueChange(t=>{this._queue=(t||[]).filter(Boolean)}),this._adapter.onDevicesChange(({devices:t,activeId:e})=>{const i=this._activeDeviceId,a=e||"";this._devices=t,this._activeDeviceId=a,a&&i&&i!==a?this._onActiveDeviceSwitched():a&&!i&&this._adapter.ready&&0===this._browseSources.length&&this._fetchBrowseSources()})}disconnectedCallback(){super.disconnectedCallback(),this._adapter.disconnect(),window.removeEventListener("resize",this._onResize),window.removeEventListener("keydown",this._keyHandler)}_onResize=()=>{this._applyBreakpoint()};_applyBreakpoint(){const t=window.innerWidth;t>=1400?(this._navMode="pinned",this._showQueue=!0):t>=1024?this._navMode="collapsed":(this._navMode="hidden",this._showQueue=!1)}willUpdate(t){this.hass&&(t.has("hass")||t.has("panel"))&&(this._adapterConnected?this._adapter.updateHass(this.hass,this.panel):(this._adapter.connect({hass:this.hass,panel:this.panel}),this._adapterConnected=!0))}updated(t){if(this.hass&&(t.has("hass")||t.has("panel"))){this._adapter.ready&&0===this._browseSources.length&&this._fetchBrowseSources();const t=this._adapter.getState(),e=t.uri||null;e!==this._lastUri&&(this._lastUri=e,e&&this._adapter.ready?(this._checkFavorite(),this._recordHistory(t)):this._isFavorite=!1)}}async _callService(t,e={}){return await this._adapter.call(t,e)}_getQualityInfo(){const t=this._adapter.getState();if("unavailable"===t.state)return null;return pt({trackType:t.trackType,samplerate:t.samplerate,bitdepth:t.bitdepth,bitrate:t.bitrate,isStream:"channel"===t._raw?.media_content_type})}render(){const t=this._adapter.getState(),e=this._getQualityInfo(),i=ft(t.albumArt,"",this._activeDeviceId),a=this._adapter.getVolumioUrl(),s=this._getNavSources();return Q`
      <div class="shell"
        @volumio-context-menu=${this._onContextMenuRequest}
        @volumio-playlist-select=${this._onPlaylistSelect}
        @volumio-playlist-create=${this._onPlaylistCreate}
        @volumio-playlist-play=${this._onPlaylistPlay}
        @volumio-playlist-enqueue=${this._onPlaylistEnqueue}
        @volumio-playlist-delete=${this._onPlaylistDelete}
        @volumio-playlist-remove-track=${this._onPlaylistRemoveTrack}
        @volumio-history-clear=${this._onHistoryClear}
        @volumio-setting-change=${this._onSettingChange}
      >
        <volumio-top-bar
          active-view="${this._activeView}"
          .breadcrumb=${[]}
          ?narrow=${this.narrow}
          ?show-back-button=${this._browseStack.length>0||"album-detail"===this._activeView||"artist-detail"===this._activeView||"playlist-detail"===this._activeView||!!this._searchQuery}
          .devices=${this._devices}
          active-device-id="${this._activeDeviceId}"
          @volumio-navigate=${this._onNavigate}
          @volumio-toggle-nav=${this._onToggleNav}
          @volumio-toggle-queue=${this._onToggleQueue}
          @volumio-back=${this._onBack}
          @volumio-search=${this._onSearch}
          @volumio-search-clear=${this._onSearchClear}
          @volumio-device-change=${this._onDeviceChange}
        ></volumio-top-bar>

        <div class="content-area">
          ${this._renderLeftZone(s)}

          <div class="center-zone">
            ${this._searchTrail.length>0&&("album-detail"===this._activeView||"artist-detail"===this._activeView)?Q`
                  <volumio-breadcrumb-bar
                    .trail=${this._searchTrail}
                    @volumio-breadcrumb-click=${this._onSearchBreadcrumbClick}
                  ></volumio-breadcrumb-bar>
                `:this._browseStack.length>0&&("browse"===this._activeView||"album-detail"===this._activeView||"artist-detail"===this._activeView)?Q`
                    <volumio-breadcrumb-bar
                      .trail=${this._browseStack}
                      @volumio-breadcrumb-click=${this._onBreadcrumbClick}
                    ></volumio-breadcrumb-bar>
                  `:""}
            ${"album-detail"===this._activeView||"artist-detail"===this._activeView?this._renderCenterContent(t,e,i):this._searchQuery?this._renderSearchView(t,a):this._renderCenterContent(t,e,i)}
          </div>

          ${this._renderRightZone()}
        </div>

        <volumio-player-bar
          player-state="${t.state}"
          title="${t.title}"
          artist="${t.artist}"
          album-art="${i}"
          .duration=${t.duration}
          .position=${t.position}
          position-updated-at="${t.positionUpdatedAt}"
          .volume=${t.volume}
          ?muted=${t.muted}
          ?shuffle=${t.shuffle}
          repeat="${t.repeat}"
          .quality=${e}
          source="${t.source}"
          .volumeEnabled=${t.volumeEnabled}
          .isFavorite=${this._isFavorite}
          @volumio-command=${this._onCommand}
          @volumio-navigate=${this._onNavigate}
          @volumio-toggle-favorite=${this._onToggleFavorite}
        ></volumio-player-bar>
      </div>

      ${this._showNavFlyout?Q`
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
    `}_renderLeftZone(t){return"hidden"===this._navMode?Q``:Q`
      <div class="left-zone ${this._navMode}">
        <volumio-left-nav
          .sources=${t}
          mode="${this._navMode}"
          active-view="${this._activeView}"
          active-source="${this._activeSourceUri}"
          @volumio-navigate=${this._onNavigate}
          @volumio-nav-pin=${this._onNavPin}
        ></volumio-left-nav>
      </div>
    `}_renderRightZone(){if(!this._showQueue)return Q``;const t=this._adapter.getState().queuePosition,e=this._adapter.getVolumioUrl();return Q`
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
          ${this._queueConfirmClear?Q`
            <div class="confirm-bar">
              <span>Clear queue?</span>
              <div class="confirm-btns">
                <button class="btn-yes" @click=${this._onQueueClear}>Yes</button>
                <button class="btn-no" @click=${()=>{this._queueConfirmClear=!1}}>No</button>
              </div>
            </div>
          `:""}
          ${this._queueSaveOpen?Q`
            <div class="save-dialog">
              <input
                type="text"
                placeholder="Playlist name"
                .value=${this._queueSaveName}
                @input=${t=>{this._queueSaveName=t.target.value}}
                @keydown=${t=>{"Enter"===t.key&&this._onQueueSaveConfirm(),"Escape"===t.key&&(this._queueSaveOpen=!1)}}
              />
              <button @click=${this._onQueueSaveConfirm}>Save</button>
            </div>
          `:""}
          <div class="queue-list">
            ${0===this._queue.length?Q`
                <div class="queue-empty-state">
                  <ha-icon icon="mdi:playlist-music-outline"></ha-icon>
                  <div>Queue is empty</div>
                  <div>Browse for music to start playing.</div>
                  <button class="browse-btn" @click=${()=>this._onNavigate({detail:{view:"browse"}})}>Browse</button>
                </div>`:this._queue.map((i,a)=>i?Q`
                <div
                  class="queue-item ${a===t?"playing":""} ${a===this._dragIndex?"dragging":""} ${a===this._dragOverIndex?this._dragIndex<a?"drag-over-below":"drag-over-above":""}"
                  @click=${()=>this._onQueueItemClick(a)}
                  @contextmenu=${t=>this._onQueueContextMenu(t,i,a)}
                >
                  <div class="qi-drag"
                    @pointerdown=${t=>this._onDragStart(t,a)}
                  >
                    <ha-icon icon="mdi:drag-horizontal-variant"></ha-icon>
                  </div>
                  ${this._settingQueueThumbnails?Q`
                    <div class="qi-art">
                      ${i.albumart?Q`<img src="${ft(i.albumart,e,this._activeDeviceId)}" alt="" loading="lazy" />`:Q`<ha-icon icon="mdi:music-note"></ha-icon>`}
                    </div>
                  `:""}
                  <div class="qi-info">
                    <div class="qi-title">${i.name||i.title||"—"}</div>
                    <div class="qi-artist">${i.artist||""}</div>
                  </div>
                  ${a===t?Q`<div class="eq-bars"><span></span><span></span><span></span></div>`:""}
                  <button class="qi-remove" @click=${t=>this._onQueueRemove(t,a)} title="Remove">
                    <ha-icon icon="mdi:close"></ha-icon>
                  </button>
                </div>
              `:"")}
          </div>
        </div>
      </div>
    `}_renderCenterContent(t,e,i){const a=this._adapter.getVolumioUrl();switch(this._activeView){case"now-playing":return Q`
          <volumio-now-playing
            player-state="${t.state}"
            title="${t.title}"
            artist="${t.artist}"
            album="${t.album}"
            album-art="${i}"
            .quality=${e}
            source="${t.source}"
            .isFavorite=${this._isFavorite}
            @volumio-command=${this._onCommand}
            @volumio-navigate=${this._onNavigate}
            @volumio-toggle-favorite=${this._onToggleFavorite}
          ></volumio-now-playing>
        `;case"browse":return this._renderBrowseView(t,a);case"album-detail":return this._renderAlbumDetail(t,a);case"artist-detail":return this._renderArtistDetail(a);case"playlists":return this._renderPlaylistList();case"playlist-detail":return this._renderPlaylistDetail();case"favorites":return this._renderFavorites();case"history":return this._renderHistory();case"settings":return this._renderSettings();default:return this._renderPlaceholder("","mdi:help-circle",`Unknown view: ${this._activeView}`)}}_renderBrowseView(t,e){return 0===this._browseStack.length?Q`
        <volumio-browse-source-grid
          .sources=${this._browseSources}
          volumio-url="${e}"
          config-entry-id="${this._activeDeviceId}"
          @volumio-source-select=${this._onSourceSelect}
        ></volumio-browse-source-grid>
      `:Q`
      <volumio-browse-list
        .items=${this._browseItems}
        ?loading=${this._browseLoading}
        current-uri="${t.uri}"
        volumio-url="${e}"
        config-entry-id="${this._activeDeviceId}"
        @volumio-item-click=${this._onBrowseItemClick}
        @volumio-item-play=${this._onBrowseItemPlay}
      ></volumio-browse-list>
    `}_renderAlbumDetail(t,e){const i=this._browseContext||{};return Q`
      <volumio-album-detail
        album-title="${i.title||""}"
        album-artist="${i.artist||""}"
        album-art="${i.albumart||""}"
        album-uri="${i.uri||""}"
        album-service="${i.service||""}"
        .tracks=${this._browseItems}
        ?loading=${this._browseLoading}
        current-uri="${t.uri}"
        volumio-url="${e}"
        config-entry-id="${this._activeDeviceId}"
        .story=${this._albumStory}
        .credits=${this._albumCredits}
        ?story-loading=${this._metadataLoading.story}
        ?credits-loading=${this._metadataLoading.credits}
        @volumio-track-click=${this._onTrackPlay}
        @volumio-album-play=${this._onAlbumPlay}
        @volumio-album-add-queue=${this._onAlbumAddQueue}
        @volumio-navigate=${this._onNavigate}
        @volumio-similar-artist-click=${this._onSimilarArtistClick}
      ></volumio-album-detail>
    `}_renderArtistDetail(t){const e=this._browseContext||{};return Q`
      <volumio-artist-detail
        artist-name="${e.artist||e.title||""}"
        .items=${this._browseItems}
        ?loading=${this._browseLoading}
        volumio-url="${t}"
        config-entry-id="${this._activeDeviceId}"
        .bio=${this._artistBio}
        .similarArtists=${this._similarArtists}
        ?bio-loading=${this._metadataLoading.bio}
        ?similar-loading=${this._metadataLoading.similar}
        @volumio-card-click=${this._onBrowseItemClick}
        @volumio-card-play=${this._onBrowseItemPlay}
        @volumio-similar-artist-click=${this._onSimilarArtistClick}
      ></volumio-artist-detail>
    `}_renderSearchView(t,e){return Q`
      <volumio-search-results
        .results=${this._searchResults}
        ?loading=${this._searchLoading}
        query="${this._searchQuery}"
        volumio-url="${e}"
        config-entry-id="${this._activeDeviceId}"
        current-uri="${t.uri}"
        @volumio-card-click=${this._onBrowseItemClick}
        @volumio-card-play=${this._onBrowseItemPlay}
        @volumio-track-click=${this._onTrackPlay}
      ></volumio-search-results>
    `}_renderPlaceholder(t,e,i){return Q`
      <div class="placeholder-view">
        <ha-icon icon="${e}"></ha-icon>
        <div class="view-title">${t}</div>
        <div class="view-desc">${i}</div>
      </div>
    `}_renderPlaylistList(){return Q`
      <volumio-playlist-list
        .playlists=${this._playlistItems}
        ?loading=${this._playlistLoading}
      ></volumio-playlist-list>
    `}_renderPlaylistDetail(){const t=this._playlistDetailContext||{},e=this._adapter.getState(),i=this._adapter.getVolumioUrl();return Q`
      <volumio-playlist-detail
        playlist-name="${t.name||""}"
        playlist-uri="${t.uri||""}"
        .tracks=${this._playlistDetailItems}
        ?loading=${this._playlistLoading}
        current-uri="${e.uri}"
        volumio-url="${i}"
        config-entry-id="${this._activeDeviceId}"
        @volumio-track-click=${this._onTrackPlay}
      ></volumio-playlist-detail>
    `}_renderFavorites(){const t=this._adapter.getState(),e=this._adapter.getVolumioUrl();return Q`
      <volumio-favorites-view
        .items=${this._favoritesItems}
        ?loading=${this._favoritesLoading}
        current-uri="${t.uri}"
        volumio-url="${e}"
        config-entry-id="${this._activeDeviceId}"
        @volumio-track-click=${this._onTrackPlay}
      ></volumio-favorites-view>
    `}_renderHistory(){const t=this._adapter.getState(),e=this._adapter.getVolumioUrl();return Q`
      <volumio-history-view
        .history=${this._history}
        current-uri="${t.uri}"
        volumio-url="${e}"
        config-entry-id="${this._activeDeviceId}"
        @volumio-track-click=${this._onTrackPlay}
      ></volumio-history-view>
    `}_renderSettings(){return Q`
      <volumio-settings-panel
        click-action="${this._settingClickAction}"
        ?queue-thumbnails=${this._settingQueueThumbnails}
        browse-view-mode="${this._settingBrowseViewMode}"
        .aboutInfo=${{volumioUrl:this._adapter.getVolumioUrl(),entityId:this._adapter.entityId}}
      ></volumio-settings-panel>
    `}_onNavigate(t){const{view:e,source:i,sourceUri:a,artist:s,album:o,pluginName:r}=t.detail||{};if(e)switch(e){case"browse":this._activeView="browse",this._showNavFlyout=!1,this._searchTrail=[],this._searchQuery="",this._searchResults=null,a?(this._activeSourceUri=a||"",this._browseStack=[],this._browseTo(a,i||"Browse")):0===this._browseStack.length&&(this._activeSourceUri="",this._browseItems=[]);break;case"album-detail":if(o){const t=this._adapter.getState(),e=t.source||"",i=t.artist||"";this._enterAlbumDetail({title:o,artist:i,albumart:t.rawAlbumart||"",uri:"",service:e,searchTrail:[{title:"Now Playing",uri:"__now_playing__",view:"now-playing"},{title:o,uri:"",view:"album-detail"}]})}else this._activeView="album-detail",this._showNavFlyout=!1;break;case"artist-detail":if(s){const t=this._adapter.getState().source||"",e=`globalUriArtist/${s}`;this._enterArtistDetail({artist:s,uri:e,service:t,searchTrail:[{title:"Now Playing",uri:"__now_playing__",view:"now-playing"},{title:s,uri:e,view:"artist-detail",service:t}]})}else this._activeView="artist-detail",this._showNavFlyout=!1;break;case"playlists":this._activeView="playlists",this._showNavFlyout=!1,this._searchQuery="",this._searchResults=null,this._searchTrail=[],this._loadPlaylists();break;case"favorites":this._activeView="favorites",this._showNavFlyout=!1,this._searchQuery="",this._searchResults=null,this._searchTrail=[],this._loadFavorites();break;default:this._activeView=e,this._showNavFlyout=!1,this._searchQuery="",this._searchResults=null,this._searchTrail=[]}}_onToggleNav(){"hidden"===this._navMode?this._showNavFlyout=!this._showNavFlyout:"collapsed"===this._navMode?this._navMode="pinned":this._navMode="collapsed"}_onNavPin(t){this._navMode=t.detail.pinned?"pinned":"collapsed",this._showNavFlyout=!1}_onToggleQueue(){this._showQueue=!this._showQueue}_onBack(){if(this._searchTrail.length>0&&("album-detail"===this._activeView||"artist-detail"===this._activeView))if(this._searchTrail.length>1){this._searchTrail=this._searchTrail.slice(0,-1);const t=this._searchTrail[this._searchTrail.length-1];"artist-detail"===t.view?(this._activeView="artist-detail",this._browseContext=t,this._browseToArtist(t.uri,t.title,t.service||"")):"album-detail"===t.view?(this._activeView="album-detail",this._browseContext={title:t.title||"",artist:"",albumart:"",uri:t.uri||"",service:t.service||""},t.uri&&this._loadBrowseItems(t.uri)):"playlist-detail"===t.view?(this._activeView="playlist-detail",this._browseContext={title:t.title||"",uri:t.uri||"",service:t.service||""},t.uri&&this._loadBrowseItems(t.uri)):"now-playing"===t.view?(this._activeView="now-playing",this._searchTrail=[]):(this._activeView="browse",this._searchTrail=[])}else{const t=this._searchTrail[0];t&&"now-playing"===t.view?this._activeView="now-playing":this._activeView="browse",this._searchTrail=[]}else{if(this._searchQuery)return this._searchQuery="",this._searchResults=null,void(this._searchTrail=[]);if("playlist-detail"!==this._activeView)if("album-detail"!==this._activeView&&"artist-detail"!==this._activeView)if(this._browseStack.length>1){this._browseStack=this._browseStack.slice(0,-1);const t=this._browseStack[this._browseStack.length-1];this._loadBrowseItems(t.uri)}else 1===this._browseStack.length?(this._browseStack=[],this._browseItems=[],this._activeSourceUri=""):"now-playing"!==this._activeView&&(this._activeView="now-playing");else this._activeView="browse";else this._activeView="playlists"}}async _onDeviceChange(t){const e=t?.detail?.config_entry_id;e&&e!==this._activeDeviceId&&await this._adapter.setDevice(e)}_onActiveDeviceSwitched(){this._browseStack=[],this._browseItems=[],this._browseLoading=!1,this._browseContext=null,this._artistBio=null,this._similarArtists=[],this._albumStory=null,this._albumCredits=[],this._metadataLoading={bio:!1,similar:!1,story:!1,credits:!1},this._metadataArtistKey=null,this._metadataAlbumKey=null,this._browseSources=[],this._activeSourceUri="",this._searchResults=null,this._searchLoading=!1,this._searchQuery="",this._searchTrail=[],this._playlistItems=[],this._playlistDetailItems=[],this._playlistDetailContext=null,this._playlistLoading=!1,this._favoritesItems=[],this._favoritesLoading=!1,this._favoritesCache=[],this._isFavorite=!1,this._lastUri=null,this._queue=[],this._queueConfirmClear=!1,this._queueSaveOpen=!1,this._queueSaveName="",this._dragIndex=-1,this._dragOverIndex=-1,this._ctxOpen=!1,this._ctxItems=[],this._ctxTarget=null,this._ctxPlaylists=[],this._toastOpen=!1,this._toastMessage="",this._toastUndo=null,this._toastUndoData=null,this._activeView="now-playing",this._adapter.ready&&this._fetchBrowseSources()}async _fetchBrowseSources(){if(this._adapter.ready)try{const t=await this._callService("get_browse_sources",{}),e=t?.response?.sources||[];e.length>0&&(this._browseSources=e)}catch(t){console.warn("[volumio-panel] get_browse_sources failed:",t.message)}}_getNavSources(){if(this._browseSources.length>0)return this._browseSources;const t=this._adapter.getState();return(t._raw?.source_list||[]).map(t=>({name:t,plugin_name:t.toLowerCase().replace(/\s+/g,""),plugin_type:"music_service",uri:"",albumart:""}))}async _browseTo(t,e){this._browseStack=[...this._browseStack,{uri:t,title:e}],await this._loadBrowseItems(t)}async _browseToArtist(t,e,i){this._browseLoading=!0;try{if(i&&t.startsWith("globalUriArtist/")){const a=await this._resolveArtistUri(e,i);if(a&&(t=a,this._browseContext&&(this._browseContext={...this._browseContext,uri:t}),this._searchTrail.length>0)){const e=[...this._searchTrail],i=e[e.length-1];"artist-detail"===i.view&&(e[e.length-1]={...i,uri:t},this._searchTrail=e)}}const a=await this._callService("browse",{uri:t}),s=(a?.response?.navigation||a?.navigation||{}).lists||[],o=[];for(const t of s)if(t.items)for(const e of t.items)"song"!==e.type&&"track"!==e.type&&o.push(e);this._browseItems=o}catch(t){console.error("[volumio-panel] Artist browse failed:",t),this._browseItems=[]}this._browseLoading=!1}async _fetchArtistMetadata(t){if(!t)return this._artistBio=null,this._similarArtists=[],void(this._metadataArtistKey=null);if(this._metadataArtistKey===t)return;this._metadataArtistKey=t,this._artistBio=null,this._similarArtists=[],this._metadataLoading={...this._metadataLoading,bio:!0,similar:!0};const[e,i]=await Promise.allSettled([this._adapter.fetchArtistBio(t),this._adapter.fetchSimilarArtists(t)]);this._artistBio="fulfilled"===e.status?e.value:null,this._similarArtists="fulfilled"===i.status?i.value:[],this._metadataLoading={...this._metadataLoading,bio:!1,similar:!1}}async _fetchAlbumMetadata(t,e){if(!t||!e)return this._albumStory=null,this._albumCredits=[],void(this._metadataAlbumKey=null);const i=t+String.fromCharCode(0)+e;if(this._metadataAlbumKey===i)return;this._metadataAlbumKey=i,this._albumStory=null,this._albumCredits=[],this._metadataLoading={...this._metadataLoading,story:!0,credits:!0};const[a,s]=await Promise.allSettled([this._adapter.fetchAlbumStory(t,e),this._adapter.fetchAlbumCredits(t,e)]);this._albumStory="fulfilled"===a.status?a.value:null,this._albumCredits="fulfilled"===s.status?s.value:[],this._metadataLoading={...this._metadataLoading,story:!1,credits:!1}}_enterArtistDetail({artist:t,uri:e,service:i,searchTrail:a}){this._activeView="artist-detail",this._showNavFlyout=!1,this._browseContext={title:t,artist:t,uri:e,service:i||""},void 0!==a&&(this._searchTrail=a),this._fetchArtistMetadata(t),this._browseToArtist(e,t,i||"")}_enterAlbumDetail({title:t,artist:e,albumart:i,uri:a,service:s,searchTrail:o,skipLoad:r}){this._activeView="album-detail",this._showNavFlyout=!1,this._browseContext={title:t,artist:e||"",albumart:i||"",uri:a||"",service:s||""},this._browseItems=[],void 0!==o&&(this._searchTrail=o),this._fetchAlbumMetadata(e||"",t),r||(a?this._loadBrowseItems(a):e&&(this._browseLoading=!0,this._resolveAndBrowseAlbum(t,e,s||"")))}_onSimilarArtistClick(t){const{artist:e,uri:i}=t.detail||{};if(!e||!i)return;const a=this._browseContext?.service||"";let s=this._searchTrail.slice();if(0===s.length){const t=this._browseContext||{},e=this._activeView;"artist-detail"!==e&&"album-detail"!==e||s.push({title:t.title||t.artist||"",uri:t.uri||"",view:e,service:t.service||""})}s.push({title:e,uri:i,view:"artist-detail",service:a}),this._enterArtistDetail({artist:e,uri:i,service:a,searchTrail:s})}async _resolveArtistUri(t,e){try{const i=await this._callService("search",{query:t}),a=(i?.response?.navigation||i?.navigation||{}).lists||[],s=t.toLowerCase();for(const t of a){if((t.title||"").toLowerCase().includes("artist")&&t.items)for(const i of t.items)if(i.service===e&&i.title?.toLowerCase()===s)return i.uri}return null}catch{return null}}async _resolveAlbumUri(t,e,i){try{const a=await this._callService("search",{query:t}),s=(a?.response?.navigation||a?.navigation||{}).lists||[],o=t.toLowerCase(),r=e.toLowerCase();for(const t of s){if((t.title||"").toLowerCase().includes("album")&&t.items)for(const e of t.items)if(e.service===i&&e.title?.toLowerCase()===o&&e.artist?.toLowerCase()===r)return e}for(const t of s){if((t.title||"").toLowerCase().includes("album")&&t.items)for(const e of t.items)if(e.service===i&&e.title?.toLowerCase()===o)return e}for(const t of s){if((t.title||"").toLowerCase().includes("album")&&t.items)for(const e of t.items)if(e.title?.toLowerCase()===o&&e.artist?.toLowerCase()===r)return e}return null}catch{return null}}async _resolveAndBrowseAlbum(t,e,i){try{let a="";if(t){const s=await this._resolveAlbumUri(t,e,i);s&&(a=s.uri||"",s.albumart&&(this._browseContext={...this._browseContext,albumart:s.albumart}))}if(!a&&"mpd"===i&&e&&t&&(a=`albums://${encodeURIComponent(e)}/${encodeURIComponent(t)}`),a){if(this._browseContext={...this._browseContext,uri:a},this._searchTrail.length>0){const t=[...this._searchTrail],e=t[t.length-1];"album-detail"===e.view&&(t[t.length-1]={...e,uri:a},this._searchTrail=t)}await this._loadBrowseItems(a)}else this._browseLoading=!1}catch{this._browseLoading=!1}}async _loadBrowseItems(t){if(this._adapter.ready){this._browseLoading=!0,this._browseItems=[];try{const e=await this._callService("browse",{uri:t}),i=e?.response?.navigation||e?.navigation||{},a=i.info||null,s=i.lists||[],o=[];for(const t of s)t.items&&o.push(...t.items);this._browseItems=o;if(!!a&&("album"===a.type||!!a.album&&!!a.artist&&o.length>0&&o.every(t=>t&&"song"===t.type))){const e=this._adapter.getVolumioUrl(),i=a.title||a.album||"",s=a.artist||"";this._browseContext={title:i,artist:s,albumart:ft(a.albumart||"",e,this._activeDeviceId),uri:a.uri||t,service:a.service||""},this._activeView="album-detail",this._fetchAlbumMetadata(s,i)}}catch(t){console.error("[volumio-panel] Browse failed:",t),this._browseItems=[]}this._browseLoading=!1}}async _loadPlaylists(){if(this._adapter.ready){this._playlistLoading=!0;try{const t=await this._callService("browse",{uri:"playlists"}),e=(t?.response?.navigation||t?.navigation||{}).lists||[],i=[];for(const t of e)t.items&&i.push(...t.items);this._playlistItems=i}catch(t){console.error("[volumio-panel] Load playlists failed:",t),this._playlistItems=[]}this._playlistLoading=!1}}async _loadPlaylistDetail(t){if(this._adapter.ready){this._playlistLoading=!0,this._playlistDetailItems=[];try{const e=await this._callService("browse",{uri:t}),i=(e?.response?.navigation||e?.navigation||{}).lists||[],a=[];for(const t of i)t.items&&a.push(...t.items);this._playlistDetailItems=a}catch(t){console.error("[volumio-panel] Load playlist detail failed:",t),this._playlistDetailItems=[]}this._playlistLoading=!1}}_onPlaylistSelect(t){const{name:e,uri:i}=t.detail;this._playlistDetailContext={name:e,uri:i},this._activeView="playlist-detail",this._loadPlaylistDetail(i)}async _onPlaylistCreate(t){const{name:e}=t.detail;try{await this._callService("playlist_create",{name:e}),this._showToast(`Playlist "${e}" created`),this._loadPlaylists()}catch(t){console.error("[volumio-panel] Create playlist failed:",t),this._showToast("Failed to create playlist")}}async _onPlaylistPlay(t){const{name:e}=t.detail;try{await this._callService("playlist_play",{name:e}),this._refreshQueue()}catch(t){console.error("[volumio-panel] Play playlist failed:",t)}}async _onPlaylistEnqueue(t){const{name:e}=t.detail;try{await this._callService("playlist_enqueue",{name:e}),this._refreshQueue(),this._showToast(`Playlist "${e}" added to queue`)}catch(t){console.error("[volumio-panel] Enqueue playlist failed:",t)}}async _onPlaylistDelete(t){const{name:e}=t.detail;try{await this._callService("playlist_delete",{name:e}),this._showToast(`Playlist "${e}" deleted`),"playlist-detail"===this._activeView&&this._playlistDetailContext?.name===e&&(this._activeView="playlists"),this._loadPlaylists()}catch(t){console.error("[volumio-panel] Delete playlist failed:",t),this._showToast("Failed to delete playlist")}}async _onPlaylistRemoveTrack(t){const{playlistName:e,uri:i,service:a}=t.detail;try{await this._callService("playlist_remove_track",{name:e,uri:i,service:a||void 0}),this._showToast("Track removed from playlist"),this._playlistDetailContext?.uri&&this._loadPlaylistDetail(this._playlistDetailContext.uri)}catch(t){console.error("[volumio-panel] Remove track from playlist failed:",t),this._showToast("Failed to remove track")}}async _loadFavorites(){if(this._adapter.ready){this._favoritesLoading=!0;try{const t=await this._adapter.call("favorites_list"),e=t?.response?.items||[];this._favoritesItems=e,this._favoritesCache=e}catch(t){console.error("[volumio-panel] Load favorites failed:",t),this._favoritesItems=[]}this._favoritesLoading=!1}}_recordHistory(t){if(!t.title||"unavailable"===t.state)return;const e=Date.now();let i=[...this._history];const a=i[0];if(a&&a.uri===t.uri&&e-a.timestamp<6e4)i[0]={...a,timestamp:e};else{const a={uri:t.uri,title:t.title,artist:t.artist,album:t.album,albumart:t.rawAlbumart||"",service:t.source,trackType:t.trackType,samplerate:t.samplerate,bitdepth:t.bitdepth,timestamp:e};i.unshift(a)}i.length>500&&(i=i.slice(0,500)),this._history=i,kt("volumio-ws-history",JSON.stringify(i))||(i=i.slice(0,250),this._history=i,kt("volumio-ws-history",JSON.stringify(i)))}_onHistoryClear(){this._history=[],function(t){try{return localStorage.removeItem(t),!0}catch{return!1}}("volumio-ws-history"),this._showToast("History cleared")}_onSettingChange(t){const{key:e,value:i}=t.detail;switch(e){case"clickAction":this._settingClickAction=i,kt("volumio-default-click",i);break;case"queueThumbnails":this._settingQueueThumbnails=i,kt("volumio-queue-thumbnails",String(i));break;case"browseViewMode":this._settingBrowseViewMode=i,kt("volumio-browse-view-mode",i)}}_onSourceSelect(t){const{uri:e,name:i,plugin_name:a}=t.detail;this._activeSourceUri=e||"",this._browseStack=[],this._browseTo(e,i)}_onBrowseItemClick(t){const e=t.detail,i=e.type||"folder";if(new Set(["song","track","webradio","mywebradio","cuesong"]).has(i))this._onTrackPlay(t);else{if("album"===i){let t;return(this._searchQuery||this._searchTrail.length>0)&&(t=this._searchTrail.length>0?[...this._searchTrail]:[{title:`Search "${this._searchQuery}"`,uri:"__search__",view:"search"}],1===t.length&&e.service&&t.push({title:Lt(e.service),uri:"__source__",view:"source"}),t.push({title:e.title,uri:e.uri,view:"album-detail",service:e.service||""})),void this._enterAlbumDetail({title:e.title,artist:e.artist||"",albumart:e.albumart||"",uri:e.uri,service:e.service||"",searchTrail:t})}if("artist"===i){let t;return(this._searchQuery||this._searchTrail.length>0)&&(t=this._searchTrail.length>0?[...this._searchTrail]:[{title:`Search "${this._searchQuery}"`,uri:"__search__",view:"search"}],1===t.length&&e.service&&t.push({title:Lt(e.service),uri:"__source__",view:"source"}),t.push({title:e.title,uri:e.uri,view:"artist-detail",service:e.service||""})),void this._enterArtistDetail({artist:e.title||"",uri:e.uri,service:e.service||"",searchTrail:t})}0===this._searchTrail.length&&(this._searchQuery="",this._searchResults=null),this._browseTo(e.uri,e.title||"Browse")}}async _onBrowseItemPlay(t){const e=t.detail;try{await this._callService("replace_and_play",{uri:e.uri,title:e.title||"",service:e.service||"",artist:e.artist||"",albumart:e.albumart||""}),this._refreshQueue()}catch(t){console.error("[volumio-panel] Play failed:",t)}}async _onTrackPlay(t){const e=t.detail,i=this._getDefaultClickAction();try{"add_to_queue"===i?(await this._callService("queue_add",{uri:e.uri,title:e.title||"",service:e.service||"",artist:e.artist||"",album:e.album||"",albumart:e.albumart||""}),this._refreshQueue(),this._showToast("Added to queue")):(await this._callService("replace_and_play",{uri:e.uri,title:e.title||"",service:e.service||"",artist:e.artist||"",album:e.album||"",albumart:e.albumart||"",type:e.type||"song"}),this._refreshQueue())}catch(t){console.error("[volumio-panel] Track play failed:",t)}}async _onAlbumPlay(t){const{uri:e}=t.detail;try{await this._callService("replace_and_play",{uri:e,service:this._browseContext?.service||""}),this._refreshQueue()}catch(t){console.error("[volumio-panel] Album play failed:",t)}}async _onAlbumAddQueue(t){const{uri:e}=t.detail,i=(this._browseItems||[]).filter(t=>t&&("song"===t.type||"track"===t.type));if(0!==i.length)try{for(const t of i)await this._callService("queue_add",{uri:t.uri,title:t.title||"",service:t.service||this._browseContext?.service||"",artist:t.artist||"",album:t.album||this._browseContext?.title||"",albumart:t.albumart||""});this._refreshQueue(),this._showToast(`Added ${i.length} track${1===i.length?"":"s"} to queue`)}catch(t){console.error("[volumio-panel] Album queue add failed:",t),this._showToast("Failed to add album")}else try{await this._callService("queue_add",{uri:e}),this._refreshQueue(),this._showToast("Added to queue")}catch(t){console.error("[volumio-panel] Album queue add failed:",t),this._showToast("Failed to add album")}}async _onQueueItemClick(t){try{await this._callService("queue_play_index",{index:t})}catch(t){console.error("[volumio-panel] Queue play index failed:",t)}}_onQueueClearClick(){this._queueConfirmClear=!0}async _onQueueClear(){this._queueConfirmClear=!1;const t=this._adapter.getState(),e="playing"===t.state||"paused"===t.state;try{if(e&&t.uri){const e={uri:t.uri,title:t.title,artist:t.artist,album:t.album,service:t.source};await this._callService("queue_clear",{}),await this._callService("replace_and_play",e)}else await this._callService("queue_clear",{});this._refreshQueue(),this._showToast("Queue cleared")}catch(t){console.error("[volumio-panel] Queue clear failed:",t)}}async _onAddItemToQueue(t){const e=t.detail;try{await this._callService("queue_add",{uri:e.uri,title:e.title||"",service:e.service||"",artist:e.artist||"",album:e.album||"",albumart:e.albumart||""}),this._refreshQueue(),this._showToast("Added to queue")}catch(t){console.error("[volumio-panel] Add to queue failed:",t)}}async _refreshQueue(){if(this._adapter.ready)try{const t=await this._adapter.call("queue_get");t?.response?.queue&&(this._queue=t.response.queue.filter(Boolean))}catch(t){}}async _onQueueRemove(t,e){t.stopPropagation();const i=this._queue[e];try{await this._callService("queue_remove",{index:e}),this._refreshQueue(),this._showToast("Removed from queue","undo_queue_remove"),this._toastUndoData={item:i,index:e}}catch(t){console.error("[volumio-panel] Queue remove failed:",t)}}_onQueueContextMenu(t,e,i){t.preventDefault(),t.stopPropagation(),this._ctxTarget={...e,index:i,context:"queue"},this._ctxItems=this._buildContextItems("queue"),this._ctxX=t.clientX,this._ctxY=t.clientY,this._ctxOpen=!0}_onQueueSaveStart(){0!==this._queue.length&&(this._queueSaveName="",this._queueSaveOpen=!0,this.updateComplete.then(()=>{const t=this.shadowRoot?.querySelector(".save-dialog input");t&&t.focus()}))}async _onQueueSaveConfirm(){const t=this._queueSaveName.trim();if(t){this._queueSaveOpen=!1;try{await this._callService("save_queue_to_playlist",{name:t}),this._showToast(`Saved as playlist "${t}"`)}catch(t){console.error("[volumio-panel] Save playlist failed:",t),this._showToast("Failed to save playlist")}}}_onDragStart(t,e){t.preventDefault(),t.stopPropagation(),this._dragIndex=e,this._dragOverIndex=-1;const i=t=>{const e=this.shadowRoot?.querySelector(".queue-list");if(!e)return;const i=e.querySelectorAll(".queue-item");let a=-1,s=1/0;i.forEach((e,i)=>{const o=e.getBoundingClientRect(),r=o.top+o.height/2,n=Math.abs((t.clientY||t.touches?.[0]?.clientY||0)-r);n<s&&(s=n,a=i)}),a!==this._dragOverIndex&&(this._dragOverIndex=a)},a=async()=>{document.removeEventListener("pointermove",i),document.removeEventListener("pointerup",a),document.removeEventListener("pointercancel",a);const t=this._dragIndex,e=this._dragOverIndex;if(this._dragIndex=-1,this._dragOverIndex=-1,t>=0&&e>=0&&t!==e)try{await this._callService("queue_move",{from_index:t,to_index:e}),this._refreshQueue()}catch(t){console.error("[volumio-panel] Queue move failed:",t)}};document.addEventListener("pointermove",i),document.addEventListener("pointerup",a),document.addEventListener("pointercancel",a)}async _onContextMenuRequest(t){t.stopPropagation();const e=t.detail;this._ctxTarget=e,this._ctxItems=this._buildContextItems(e.context||"track"),this._ctxX=e.x,this._ctxY=e.y,this._ctxOpen=!0;try{const t=await this._callService("playlist_list",{}),e=t?.response?.playlists||[];this._ctxPlaylists=e.map(t=>({key:t,label:t}))}catch{this._ctxPlaylists=[]}}_buildContextItems(t){const e=[];return"album"===t?(e.push({key:"play",label:"Play",icon:"mdi:play"}),e.push({key:"play_next",label:"Play Next",icon:"mdi:skip-next"}),e.push({key:"add_to_queue",label:"Add to Queue",icon:"mdi:playlist-plus"}),e.push({separator:!0}),e.push({key:"add_to_favorites",label:"Add to Favorites",icon:"mdi:heart-outline"}),e.push({key:"add_to_playlist",label:"Add to Playlist",icon:"mdi:playlist-music",submenu:!0}),e.push({separator:!0}),e.push({key:"go_to_album",label:"Go to Album",icon:"mdi:album"}),e.push({key:"go_to_artist",label:"Go to Artist",icon:"mdi:account-music"})):"queue"===t?(e.push({key:"play",label:"Play Now",icon:"mdi:play"}),e.push({key:"play_next",label:"Play Next",icon:"mdi:skip-next"}),e.push({key:"add_to_queue",label:"Add to Queue",icon:"mdi:playlist-plus"}),e.push({separator:!0}),e.push({key:"add_to_favorites",label:"Add to Favorites",icon:"mdi:heart-outline"}),e.push({key:"add_to_playlist",label:"Add to Playlist",icon:"mdi:playlist-music",submenu:!0}),e.push({separator:!0}),e.push({key:"go_to_album",label:"Go to Album",icon:"mdi:album"}),e.push({key:"go_to_artist",label:"Go to Artist",icon:"mdi:account-music"}),e.push({separator:!0}),e.push({key:"remove",label:"Remove",icon:"mdi:close"})):"playlist"===t?(e.push({key:"play",label:"Play",icon:"mdi:play"}),e.push({key:"enqueue",label:"Enqueue",icon:"mdi:playlist-plus"}),e.push({separator:!0}),e.push({key:"delete_playlist",label:"Delete Playlist",icon:"mdi:delete-outline"})):"favorite"===t?(e.push({key:"play",label:"Play Now",icon:"mdi:play"}),e.push({key:"add_to_queue",label:"Add to Queue",icon:"mdi:playlist-plus"}),e.push({separator:!0}),e.push({key:"remove_favorite",label:"Remove from Favorites",icon:"mdi:heart-off"}),e.push({separator:!0}),e.push({key:"go_to_album",label:"Go to Album",icon:"mdi:album"}),e.push({key:"go_to_artist",label:"Go to Artist",icon:"mdi:account-music"})):"history"===t?(e.push({key:"play",label:"Play Now",icon:"mdi:play"}),e.push({key:"add_to_queue",label:"Add to Queue",icon:"mdi:playlist-plus"}),e.push({separator:!0}),e.push({key:"add_to_favorites",label:"Add to Favorites",icon:"mdi:heart-outline"}),e.push({key:"add_to_playlist",label:"Add to Playlist",icon:"mdi:playlist-music",submenu:!0}),e.push({separator:!0}),e.push({key:"go_to_album",label:"Go to Album",icon:"mdi:album"}),e.push({key:"go_to_artist",label:"Go to Artist",icon:"mdi:account-music"})):(e.push({key:"play",label:"Play Now",icon:"mdi:play"}),e.push({key:"play_next",label:"Play Next",icon:"mdi:skip-next"}),e.push({key:"add_to_queue",label:"Add to Queue",icon:"mdi:playlist-plus"}),e.push({separator:!0}),e.push({key:"add_to_favorites",label:"Add to Favorites",icon:"mdi:heart-outline"}),e.push({key:"add_to_playlist",label:"Add to Playlist",icon:"mdi:playlist-music",submenu:!0}),e.push({separator:!0}),e.push({key:"go_to_album",label:"Go to Album",icon:"mdi:album"}),e.push({key:"go_to_artist",label:"Go to Artist",icon:"mdi:account-music"})),e}async _onContextAction(t){const{action:e,playlist:i}=t.detail,a=this._ctxTarget;if(a)try{switch(e){case"play":"playlist"===a.context&&a.title?(await this._callService("playlist_play",{name:a.title}),this._refreshQueue()):"queue"===a.context&&null!=a.index?await this._callService("queue_play_index",{index:a.index}):(await this._callService("replace_and_play",{uri:a.uri,title:a.title||"",service:a.service||"",artist:a.artist||"",album:a.album||"",albumart:a.albumart||"",type:a.type||"song"}),this._refreshQueue());break;case"play_next":{const t="album"===a.context||"album"===a.type,e=t?(this._browseItems||[]).filter(t=>t&&("song"===t.type||"track"===t.type)):[a];if(0===e.length)break;const i=this._adapter.getState().queuePosition??-1,s=this._queue.length;for(const i of e)await this._callService("queue_add",{uri:i.uri,title:i.title||"",service:i.service||this._browseContext?.service||"",artist:i.artist||"",album:i.album||(t?this._browseContext?.title:"")||"",albumart:i.albumart||""});let o=i+1;for(let t=0;t<e.length;t++){const e=s+t;e>o&&await this._callService("queue_move",{from_index:e,to_index:o}),o+=1}this._refreshQueue(),this._showToast(1===e.length?"Playing next":`Queued ${e.length} tracks next`);break}case"add_to_queue":await this._callService("queue_add",{uri:a.uri,title:a.title||"",service:a.service||"",artist:a.artist||"",album:a.album||"",albumart:a.albumart||""}),this._refreshQueue(),this._showToast("Added to queue");break;case"add_to_favorites":await this._callService("favorites_add",{uri:a.uri,title:a.title||"",service:a.service||""}),this._showToast("Added to favorites");break;case"add_to_playlist":if("__new__"===i){const t=prompt("New playlist name:");t&&(await this._callService("playlist_create",{name:t}),await this._callService("playlist_add_track",{name:t,uri:a.uri,service:a.service||""}),this._showToast(`Added to "${t}"`))}else i&&(await this._callService("playlist_add_track",{name:i,uri:a.uri,service:a.service||""}),this._showToast(`Added to "${i}"`));break;case"go_to_album":if(a.album||a.title){let t="";"mpd"===a.service&&a.artist&&a.album&&(t=`albums://${encodeURIComponent(a.artist)}/${encodeURIComponent(a.album)}`),this._enterAlbumDetail({title:a.album||a.title,artist:a.artist||"",albumart:a.albumart||"",uri:t,service:a.service||"",skipLoad:!t})}break;case"go_to_artist":if(a.artist){const t=a.service||"",e=`globalUriArtist/${a.artist}`,i=this._activeView,s="now-playing"===i?"Now Playing":"Browse";this._enterArtistDetail({artist:a.artist,uri:e,service:t,searchTrail:[{title:s,uri:"__origin__",view:"now-playing"===i?"now-playing":"browse"},{title:a.artist,uri:e,view:"artist-detail",service:t}]})}break;case"remove":"queue"===a.context&&null!=a.index&&(await this._callService("queue_remove",{index:a.index}),this._refreshQueue(),this._showToast("Removed from queue","undo_queue_remove"),this._toastUndoData={item:a,index:a.index});break;case"enqueue":"playlist"===a.type&&a.title&&(await this._callService("playlist_enqueue",{name:a.title}),this._refreshQueue(),this._showToast(`Playlist "${a.title}" added to queue`));break;case"delete_playlist":a.title&&(await this._callService("playlist_delete",{name:a.title}),this._showToast(`Playlist "${a.title}" deleted`),"playlists"===this._activeView&&this._loadPlaylists());break;case"remove_favorite":await this._callService("favorites_remove",{uri:a.uri,service:a.service||void 0}),this._showToast("Removed from favorites"),"favorites"===this._activeView&&this._loadFavorites(),setTimeout(()=>this._checkFavorite(),500)}}catch(t){console.error("[volumio-panel] Context action failed:",t),this._showToast("Action failed")}}_showToast(t,e=null){this._toastMessage=t,this._toastUndo=e,this._toastOpen=!0}async _onToastUndo(t){const{action:e}=t.detail;if("undo_queue_remove"===e&&this._toastUndoData){const{item:t,index:e}=this._toastUndoData;try{const i=this._queue.length;await this._callService("queue_add",{uri:t.uri,title:t.title||t.name||"",service:t.service||"",artist:t.artist||"",album:t.album||"",albumart:t.albumart||""}),e<i&&await this._callService("queue_move",{from_index:i,to_index:e}),this._refreshQueue()}catch(t){console.error("[volumio-panel] Undo failed:",t)}}this._toastUndoData=null}_getDefaultClickAction(){return this._settingClickAction}_onBreadcrumbClick(t){const{index:e}=t.detail;this._browseStack=this._browseStack.slice(0,e+1);const i=this._browseStack[this._browseStack.length-1];"browse"!==this._activeView&&(this._activeView="browse"),this._loadBrowseItems(i.uri)}async _onSearch(t){const{query:e}=t.detail;if(e&&!(e.length<2)&&this._adapter.ready){this._searchQuery=e,this._searchLoading=!0,this._searchResults=null,this._searchTrail=[],"album-detail"!==this._activeView&&"artist-detail"!==this._activeView||(this._activeView="browse");try{const t=await this._callService("search",{query:e});this._searchResults=t?.response||t||null}catch(t){console.error("[volumio-panel] Search failed:",t),this._searchResults=null}this._searchLoading=!1}}_onSearchClear(){this._searchQuery="",this._searchResults=null,this._searchLoading=!1,this._searchTrail=[]}_onSearchBreadcrumbClick(t){const{index:e}=t.detail,i=this._searchTrail[e];if(i)if("now-playing"===i.view)this._activeView="now-playing",this._searchTrail=[];else if("search"===i.view||"browse"===i.view||0===e)this._activeView="browse",this._searchTrail=[];else if("artist-detail"===i.view)this._enterArtistDetail({artist:i.title,uri:i.uri,service:i.service||"",searchTrail:this._searchTrail.slice(0,e+1)});else if("album-detail"===i.view){const t=this._browseContext?.artist||"";this._enterAlbumDetail({title:i.title,artist:t,albumart:this._browseContext?.albumart||"",uri:i.uri,service:i.service||"",searchTrail:this._searchTrail.slice(0,e+1)})}}async _onCommand(t){const{command:e,value:i}=t.detail;if("unavailable"!==this._adapter.getState().state)try{switch(e){case"play_pause":await this._adapter.playPause();break;case"next":await this._adapter.next();break;case"prev":await this._adapter.prev();break;case"seek":await this._adapter.seek(i);break;case"volume_set":await this._adapter.setVolume(i);break;case"mute_toggle":await this._adapter.toggleMute();break;case"shuffle_set":await this._adapter.setShuffle(i);break;case"repeat_set":await this._adapter.setRepeat(i);break;default:console.warn("[volumio-panel] Unknown command:",e)}}catch(t){console.error("[volumio-panel] Command failed:",e,t)}}async _checkFavorite(){if(this._adapter.ready)try{const t=await this._adapter.call("favorites_list"),e=t?.response?.items||[];this._favoritesCache=e;const i=this._adapter.getState();this._isFavorite=!(!i.uri||!e.some(t=>t?.uri===i.uri))}catch(t){console.error("[volumio-panel] favorites_list failed:",t)}}async _onToggleFavorite(){const t=this._adapter.getState();if(!this._adapter.ready||!t.uri)return;const e=this._isFavorite;this._isFavorite=!e;try{e?await this._callService("favorites_remove",{uri:t.uri,service:t.source}):await this._callService("favorites_add",{uri:t.uri,title:t.title,service:t.source}),setTimeout(()=>this._checkFavorite(),500)}catch(t){console.error("[volumio-panel] Favorite toggle failed:",t),this._isFavorite=e}}_onKeyDown(t){const e=t.composedPath?.()?.[0]||t.target;if("INPUT"===e.tagName||"TEXTAREA"===e.tagName)return;if(!this.isConnected)return;const i=this._adapter.getState();if("unavailable"!==i.state)switch(t.key){case" ":t.preventDefault(),this._onCommand({detail:{command:"play_pause"}});break;case"ArrowRight":if(t.shiftKey)t.preventDefault(),this._onCommand({detail:{command:"next"}});else{t.preventDefault();const e=(i.position||0)+10;this._onCommand({detail:{command:"seek",value:e}})}break;case"ArrowLeft":if(t.shiftKey)t.preventDefault(),this._onCommand({detail:{command:"prev"}});else{t.preventDefault();const e=Math.max(0,(i.position||0)-10);this._onCommand({detail:{command:"seek",value:e}})}break;case"ArrowUp":t.preventDefault();{const t=Math.min(100,i.volume+2);this._onCommand({detail:{command:"volume_set",value:t}})}break;case"ArrowDown":t.preventDefault();{const t=Math.max(0,i.volume-2);this._onCommand({detail:{command:"volume_set",value:t}})}break;case"m":case"M":this._onCommand({detail:{command:"mute_toggle"}});break;case"s":case"S":this._onCommand({detail:{command:"shuffle_set",value:!i.shuffle}});break;case"r":case"R":{const t=i.repeat,e="off"===t?"all":"all"===t?"one":"off";this._onCommand({detail:{command:"repeat_set",value:e}})}break;case"/":t.preventDefault(),this.shadowRoot?.querySelector("volumio-top-bar")?.shadowRoot?.querySelector(".search-field input")?.focus();break;case"Escape":this._searchQuery&&this._onSearchClear(),this._showNavFlyout=!1}}});
