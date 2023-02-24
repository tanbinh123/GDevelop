(this["webpackJsonpgdevelop-ide"]=this["webpackJsonpgdevelop-ide"]||[]).push([[120],{2729:function(e,t,n){"use strict";n.r(t),n.d(t,"setupTypeScript",(function(){return O})),n.d(t,"setupJavaScript",(function(){return K})),n.d(t,"getJavaScriptWorker",(function(){return D})),n.d(t,"getTypeScriptWorker",(function(){return A}));var o=monaco.Promise,r=function(){function e(e,t){var n=this;this._modeId=e,this._defaults=t,this._worker=null,this._idleCheckInterval=setInterval((function(){return n._checkIfIdle()}),3e4),this._lastUsedTime=0,this._configChangeListener=this._defaults.onDidChange((function(){return n._stopWorker()}))}return e.prototype._stopWorker=function(){this._worker&&(this._worker.dispose(),this._worker=null),this._client=null},e.prototype.dispose=function(){clearInterval(this._idleCheckInterval),this._configChangeListener.dispose(),this._stopWorker()},e.prototype._checkIfIdle=function(){if(this._worker){var e=this._defaults.getWorkerMaxIdleTime(),t=Date.now()-this._lastUsedTime;e>0&&t>e&&this._stopWorker()}},e.prototype._getClient=function(){var e=this;if(this._lastUsedTime=Date.now(),!this._client){this._worker=monaco.editor.createWebWorker({moduleId:"vs/language/typescript/tsWorker",label:this._modeId,createData:{compilerOptions:this._defaults.getCompilerOptions(),extraLibs:this._defaults.getExtraLibs()}});var t=this._worker.getProxy();this._defaults.getEagerModelSync()&&(t=t.then((function(t){return e._worker.withSyncedResources(monaco.editor.getModels().filter((function(t){return t.getModeId()===e._modeId})).map((function(e){return e.uri})))}))),this._client=t}return this._client},e.prototype.getLanguageServiceWorker=function(){for(var e,t=this,n=[],o=0;o<arguments.length;o++)n[o]=arguments[o];return i(this._getClient().then((function(t){e=t})).then((function(e){return t._worker.withSyncedResources(n)})).then((function(t){return e})))},e}();function i(e){var t,n,r=new o((function(e,o){t=e,n=o}),(function(){}));return e.then(t,n),r}var a,s=function(){var e=function(t,n){return e=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])},e(t,n)};return function(t,n){function o(){this.constructor=t}e(t,n),t.prototype=null===n?Object.create(n):(o.prototype=n.prototype,new o)}}(),u=monaco.Uri,c=monaco.Promise;function l(e,t){if("string"===typeof e)return e;for(var n=e,o="",r=0;n;){if(r){o+=t;for(var i=0;i<r;i++)o+="  "}o+=n.messageText,r++,n=n.next}return o}function p(e){return e?e.map((function(e){return e.text})).join(""):""}!function(e){e[e.None=0]="None",e[e.Block=1]="Block",e[e.Smart=2]="Smart"}(a||(a={}));var m=function(){function e(e){this._worker=e}return e.prototype._positionToOffset=function(e,t){return monaco.editor.getModel(e).getOffsetAt(t)},e.prototype._offsetToPosition=function(e,t){return monaco.editor.getModel(e).getPositionAt(t)},e.prototype._textSpanToRange=function(e,t){var n=this._offsetToPosition(e,t.start),o=this._offsetToPosition(e,t.start+t.length);return{startLineNumber:n.lineNumber,startColumn:n.column,endLineNumber:o.lineNumber,endColumn:o.column}},e}(),f=function(e){function t(t,n,o){var r=e.call(this,o)||this;r._defaults=t,r._selector=n,r._disposables=[],r._listener=Object.create(null);var i=function(e){if(e.getModeId()===n){var t,o=e.onDidChangeContent((function(){clearTimeout(t),t=setTimeout((function(){return r._doValidate(e.uri)}),500)}));r._listener[e.uri.toString()]={dispose:function(){o.dispose(),clearTimeout(t)}},r._doValidate(e.uri)}},a=function(e){monaco.editor.setModelMarkers(e,r._selector,[]);var t=e.uri.toString();r._listener[t]&&(r._listener[t].dispose(),delete r._listener[t])};return r._disposables.push(monaco.editor.onDidCreateModel(i)),r._disposables.push(monaco.editor.onWillDisposeModel(a)),r._disposables.push(monaco.editor.onDidChangeModelLanguage((function(e){a(e.model),i(e.model)}))),r._disposables.push({dispose:function(){for(var e=0,t=monaco.editor.getModels();e<t.length;e++){var n=t[e];a(n)}}}),r._disposables.push(r._defaults.onDidChange((function(){for(var e=0,t=monaco.editor.getModels();e<t.length;e++){var n=t[e];a(n),i(n)}}))),monaco.editor.getModels().forEach(i),r}return s(t,e),t.prototype.dispose=function(){this._disposables.forEach((function(e){return e&&e.dispose()})),this._disposables=[]},t.prototype._doValidate=function(e){var t=this;this._worker(e).then((function(n){if(!monaco.editor.getModel(e))return null;var o=[],r=t._defaults.getDiagnosticsOptions(),i=r.noSyntaxValidation,a=r.noSemanticValidation;return i||o.push(n.getSyntacticDiagnostics(e.toString())),a||o.push(n.getSemanticDiagnostics(e.toString())),c.join(o)})).then((function(n){if(!n||!monaco.editor.getModel(e))return null;var o=n.reduce((function(e,t){return t.concat(e)}),[]).map((function(n){return t._convertDiagnostics(e,n)}));monaco.editor.setModelMarkers(monaco.editor.getModel(e),t._selector,o)})).done(void 0,(function(e){console.error(e)}))},t.prototype._convertDiagnostics=function(e,t){var n=this._offsetToPosition(e,t.start),o=n.lineNumber,r=n.column,i=this._offsetToPosition(e,t.start+t.length),a=i.lineNumber,s=i.column;return{severity:monaco.MarkerSeverity.Error,startLineNumber:o,startColumn:r,endLineNumber:a,endColumn:s,message:l(t.messageText,"\n")}},t}(m),g=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return s(t,e),Object.defineProperty(t.prototype,"triggerCharacters",{get:function(){return["."]},enumerable:!0,configurable:!0}),t.prototype.provideCompletionItems=function(e,n,o){e.getWordUntilPosition(n);var r=e.uri,i=this._positionToOffset(r,n);return x(o,this._worker(r).then((function(e){return e.getCompletionsAtPosition(r.toString(),i)})).then((function(e){if(e)return e.entries.map((function(e){return{uri:r,position:n,label:e.name,sortText:e.sortText,kind:t.convertKind(e.kind)}}))})))},t.prototype.resolveCompletionItem=function(e,n){var o=this,r=e,i=r.uri,a=r.position;return x(n,this._worker(i).then((function(e){return e.getCompletionEntryDetails(i.toString(),o._positionToOffset(i,a),r.label)})).then((function(e){return e?{uri:i,position:a,label:e.name,kind:t.convertKind(e.kind),detail:p(e.displayParts),documentation:p(e.documentation)}:r})))},t.convertKind=function(e){switch(e){case S.primitiveType:case S.keyword:return monaco.languages.CompletionItemKind.Keyword;case S.variable:case S.localVariable:return monaco.languages.CompletionItemKind.Variable;case S.memberVariable:case S.memberGetAccessor:case S.memberSetAccessor:return monaco.languages.CompletionItemKind.Field;case S.function:case S.memberFunction:case S.constructSignature:case S.callSignature:case S.indexSignature:return monaco.languages.CompletionItemKind.Function;case S.enum:return monaco.languages.CompletionItemKind.Enum;case S.module:return monaco.languages.CompletionItemKind.Module;case S.class:return monaco.languages.CompletionItemKind.Class;case S.interface:return monaco.languages.CompletionItemKind.Interface;case S.warning:return monaco.languages.CompletionItemKind.File}return monaco.languages.CompletionItemKind.Property},t}(m),d=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.signatureHelpTriggerCharacters=["(",","],t}return s(t,e),t.prototype.provideSignatureHelp=function(e,t,n){var o=this,r=e.uri;return x(n,this._worker(r).then((function(e){return e.getSignatureHelpItems(r.toString(),o._positionToOffset(r,t))})).then((function(e){if(e){var t={activeSignature:e.selectedItemIndex,activeParameter:e.argumentIndex,signatures:[]};return e.items.forEach((function(e){var n={label:"",documentation:null,parameters:[]};n.label+=p(e.prefixDisplayParts),e.parameters.forEach((function(t,o,r){var i=p(t.displayParts),a={label:i,documentation:p(t.documentation)};n.label+=i,n.parameters.push(a),o<r.length-1&&(n.label+=p(e.separatorDisplayParts))})),n.label+=p(e.suffixDisplayParts),t.signatures.push(n)})),t}})))},t}(m),h=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return s(t,e),t.prototype.provideHover=function(e,t,n){var o=this,r=e.uri;return x(n,this._worker(r).then((function(e){return e.getQuickInfoAtPosition(r.toString(),o._positionToOffset(r,t))})).then((function(e){if(e){var t=p(e.documentation),n=e.tags?e.tags.map((function(e){var t="*@"+e.name+"*";return e.text?t+(e.text.match(/\r\n|\n/g)?" \n"+e.text:" - "+e.text):t})).join("  \n\n"):"",i=p(e.displayParts);return{range:o._textSpanToRange(r,e.textSpan),contents:[{value:"```js\n"+i+"\n```\n"},{value:t+(n?"\n\n"+n:"")}]}}})))},t}(m),v=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return s(t,e),t.prototype.provideDocumentHighlights=function(e,t,n){var o=this,r=e.uri;return x(n,this._worker(r).then((function(e){return e.getOccurrencesAtPosition(r.toString(),o._positionToOffset(r,t))})).then((function(e){if(e)return e.map((function(e){return{range:o._textSpanToRange(r,e.textSpan),kind:e.isWriteAccess?monaco.languages.DocumentHighlightKind.Write:monaco.languages.DocumentHighlightKind.Text}}))})))},t}(m),_=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return s(t,e),t.prototype.provideDefinition=function(e,t,n){var o=this,r=e.uri;return x(n,this._worker(r).then((function(e){return e.getDefinitionAtPosition(r.toString(),o._positionToOffset(r,t))})).then((function(e){if(e){for(var t=[],n=0,r=e;n<r.length;n++){var i=r[n],a=u.parse(i.fileName);monaco.editor.getModel(a)&&t.push({uri:a,range:o._textSpanToRange(a,i.textSpan)})}return t}})))},t}(m),y=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return s(t,e),t.prototype.provideReferences=function(e,t,n,o){var r=this,i=e.uri;return x(o,this._worker(i).then((function(e){return e.getReferencesAtPosition(i.toString(),r._positionToOffset(i,t))})).then((function(e){if(e){for(var t=[],n=0,o=e;n<o.length;n++){var i=o[n],a=u.parse(i.fileName);monaco.editor.getModel(a)&&t.push({uri:a,range:r._textSpanToRange(a,i.textSpan)})}return t}})))},t}(m),b=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return s(t,e),t.prototype.provideDocumentSymbols=function(e,t){var n=this,o=e.uri;return x(t,this._worker(o).then((function(e){return e.getNavigationBarItems(o.toString())})).then((function(e){if(e){var t=function e(t,r,i){var a={name:r.text,detail:"",kind:w[r.kind]||monaco.languages.SymbolKind.Variable,range:n._textSpanToRange(o,r.spans[0]),selectionRange:n._textSpanToRange(o,r.spans[0]),containerName:i};if(r.childItems&&r.childItems.length>0)for(var s=0,u=r.childItems;s<u.length;s++){e(t,u[s],a.name)}t.push(a)},r=[];return e.forEach((function(e){return t(r,e)})),r}})))},t}(m),S=function(){function e(){}return e.unknown="",e.keyword="keyword",e.script="script",e.module="module",e.class="class",e.interface="interface",e.type="type",e.enum="enum",e.variable="var",e.localVariable="local var",e.function="function",e.localFunction="local function",e.memberFunction="method",e.memberGetAccessor="getter",e.memberSetAccessor="setter",e.memberVariable="property",e.constructorImplementation="constructor",e.callSignature="call",e.indexSignature="index",e.constructSignature="construct",e.parameter="parameter",e.typeParameter="type parameter",e.primitiveType="primitive type",e.label="label",e.alias="alias",e.const="const",e.let="let",e.warning="warning",e}(),w=Object.create(null);w[S.module]=monaco.languages.SymbolKind.Module,w[S.class]=monaco.languages.SymbolKind.Class,w[S.enum]=monaco.languages.SymbolKind.Enum,w[S.interface]=monaco.languages.SymbolKind.Interface,w[S.memberFunction]=monaco.languages.SymbolKind.Method,w[S.memberVariable]=monaco.languages.SymbolKind.Property,w[S.memberGetAccessor]=monaco.languages.SymbolKind.Property,w[S.memberSetAccessor]=monaco.languages.SymbolKind.Property,w[S.variable]=monaco.languages.SymbolKind.Variable,w[S.const]=monaco.languages.SymbolKind.Variable,w[S.localVariable]=monaco.languages.SymbolKind.Variable,w[S.variable]=monaco.languages.SymbolKind.Variable,w[S.function]=monaco.languages.SymbolKind.Function,w[S.localFunction]=monaco.languages.SymbolKind.Function;var k,T,I=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return s(t,e),t._convertOptions=function(e){return{ConvertTabsToSpaces:e.insertSpaces,TabSize:e.tabSize,IndentSize:e.tabSize,IndentStyle:a.Smart,NewLineCharacter:"\n",InsertSpaceAfterCommaDelimiter:!0,InsertSpaceAfterSemicolonInForStatements:!0,InsertSpaceBeforeAndAfterBinaryOperators:!0,InsertSpaceAfterKeywordsInControlFlowStatements:!0,InsertSpaceAfterFunctionKeywordForAnonymousFunctions:!0,InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis:!1,InsertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets:!1,InsertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces:!1,PlaceOpenBraceOnNewLineForControlBlocks:!1,PlaceOpenBraceOnNewLineForFunctions:!1}},t.prototype._convertTextChanges=function(e,t){return{text:t.newText,range:this._textSpanToRange(e,t.span)}},t}(m),C=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return s(t,e),t.prototype.provideDocumentRangeFormattingEdits=function(e,t,n,o){var r=this,i=e.uri;return x(o,this._worker(i).then((function(e){return e.getFormattingEditsForRange(i.toString(),r._positionToOffset(i,{lineNumber:t.startLineNumber,column:t.startColumn}),r._positionToOffset(i,{lineNumber:t.endLineNumber,column:t.endColumn}),I._convertOptions(n))})).then((function(e){if(e)return e.map((function(e){return r._convertTextChanges(i,e)}))})))},t}(I),P=function(e){function t(){return null!==e&&e.apply(this,arguments)||this}return s(t,e),Object.defineProperty(t.prototype,"autoFormatTriggerCharacters",{get:function(){return[";","}","\n"]},enumerable:!0,configurable:!0}),t.prototype.provideOnTypeFormattingEdits=function(e,t,n,o,r){var i=this,a=e.uri;return x(r,this._worker(a).then((function(e){return e.getFormattingEditsAfterKeystroke(a.toString(),i._positionToOffset(a,t),n,I._convertOptions(o))})).then((function(e){if(e)return e.map((function(e){return i._convertTextChanges(a,e)}))})))},t}(I);function x(e,t){return e.onCancellationRequested((function(){return t.cancel()})),t}function O(e){T=F(e,"typescript")}function K(e){k=F(e,"javascript")}function D(){return new monaco.Promise((function(e,t){if(!k)return t("JavaScript not registered!");e(k)}))}function A(){return new monaco.Promise((function(e,t){if(!T)return t("TypeScript not registered!");e(T)}))}function F(e,t){var n=new r(t,e),o=function(e){for(var t=[],o=1;o<arguments.length;o++)t[o-1]=arguments[o];return n.getLanguageServiceWorker.apply(n,[e].concat(t))};return monaco.languages.registerCompletionItemProvider(t,new g(o)),monaco.languages.registerSignatureHelpProvider(t,new d(o)),monaco.languages.registerHoverProvider(t,new h(o)),monaco.languages.registerDocumentHighlightProvider(t,new v(o)),monaco.languages.registerDefinitionProvider(t,new _(o)),monaco.languages.registerReferenceProvider(t,new y(o)),monaco.languages.registerDocumentSymbolProvider(t,new b(o)),monaco.languages.registerDocumentRangeFormattingEditProvider(t,new C(o)),monaco.languages.registerOnTypeFormattingEditProvider(t,new P(o)),new f(e,t,o),o}}}]);
//# sourceMappingURL=120.f0447330.chunk.js.map