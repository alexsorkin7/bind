export function ajax(url,fn,method = 'GET',data,fnError) {
    method = method.toUpperCase();
    let dataStr = '';
    for(let element in data) {
        dataStr += element + '=' + data[element] + '&';
    }
    if(method == 'GET') url = url + '?' + dataStr;
    const xhr = new XMLHttpRequest;
    xhr.open(method,url,true); //xhr.open(method, URL, [async, user, password])
    xhr.onload = () => {
        if(xhr.status >= 400) fnError(xhr.response);
        else fn(htmlBind(xhr.response));
    }
    if(method == 'GET') xhr.send();
    else if(method == 'POST') {
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(dataStr);
    }
}

export function listenTo(className,fn,fnBefore) {
    let __listiners = [];
    let __buttonListiners = [];
    let __hrefListiners = [];
    let __inputs = [];
    __listiners.push({"className":className,"fn":fn,"fnBefore":fnBefore});
//a href lostiners
    var hrefs = document.querySelectorAll('a');
    for(let i =0; i<hrefs.length; i++) {
        if(hrefs[i].className.includes(className) && !__hrefListiners.includes(hrefs[i])) {
            __hrefListiners.push(hrefs[i]);
            hrefs[i].addEventListener('click',function () {
                event.preventDefault();
                if(fnBefore !== undefined) fnBefore();
                ajax(hrefs[i].getAttribute('href'),fn,'GET','');
            });
        }
    }
// Button lostiners
    let json = {};
    let action;
    let method;
    let collection;
    var buttons = document.querySelectorAll('button');
    for(let i =0; i<buttons.length; i++) {
        if(buttons[i].className.includes(className) && !__buttonListiners.includes(buttons[i])) {
            __buttonListiners.push(buttons[i]);
            buttons[i].addEventListener('click',function () {
                event.preventDefault();
                action = buttons[i].parentElement.action;
                method = buttons[i].parentElement.method;
                collection = buttons[i].parentElement.children;
                for(let i =0; i<collection.length; i++) {
                    if(collection[i].name !== undefined && collection[i].nodeName !== 'BUTTON') {
                        json[collection[i].name] = collection[i].value;
                    }
                }
                if(fnBefore !== undefined) json = fnBefore(json);
                ajax(action,fn,method,json);
            });
        }
    }
//Input listiners
    let jsonInput = {};
    var inputs = document.querySelectorAll('input');
    inputs = [...document.querySelectorAll('select'),...document.querySelectorAll('textarea'),...inputs];
    for(let i = 0; i<inputs.length; i++) {
        if(inputs[i].className.includes(className) && !__inputs.includes(inputs[i])) {
            __inputs.push(inputs[i]);
            if(inputs[i].parentNode.method !== undefined) method = inputs[i].parentNode.method;
            else method = 'GET';
            if(inputs[i].parentNode.action !== undefined) action = inputs[i].parentNode.action;
            else action = '/';
            if(inputs[i].parentNode.tagName == 'FORM') { // Get token
               for(let a = 0; a<inputs[i].parentNode.children.length; a++) {
                   if(inputs[i].parentNode.children[a].name == '_token') jsonInput['_token'] = inputs[i].parentNode.children[a].value;
               }
            }
            let on = 'change';
            if(inputs[i].onkeyup !== null) on = 'keyup';
            else if(inputs[i].oninput !== null) on = 'input';
            inputs[i].addEventListener(on,function () {
                jsonInput[inputs[i].name] = inputs[i].value;
                if(fnBefore !== undefined) jsonInput = fnBefore(jsonInput);
                ajax(action,fn,method,jsonInput);
            });
        }
    }
}

export function dom(domId) {
    let domType = '';
    let obj = {};
    if(domId.startsWith('#')) {
        domType = 'id';
        domId = domId.replace('#','');
        obj['mainDom'] = document.getElementById(domId);
    } else if(domId.startsWith('.')) domType = 'class';
    else domType = 'tag';

    obj['places'] = ['beforebegin','afterbegin','beforeend','afterend'];
    const cssProps = ['animation','animationDelay','animationDirection','animationDuration','animationFillMode','animationIterationCount','animationName','animationPlayState','animationTimingFunction','background','backgroundAttachment','backgroundClip','backgroundColor','backgroundImage','backgroundOrigin','backgroundPosition','backgroundRepeat','backgroundSize','border','borderBottom','borderBottomColor','borderBottomLeftRadius','borderBottomRightRadius','borderBottomStyle','borderBottomWidth','borderColor','borderImage','borderImageOutset','borderImageRepeat','borderImageSlice','borderImageSource','borderImageWidth','borderLeft','borderLeftColor','borderLeftStyle','borderLeftWidth','borderRadius','borderRight','borderRightColor','borderRightStyle','borderRightWidth','borderStyle','borderTop','borderTopColor','borderTopLeftRadius','borderTopRightRadius','borderTopStyle','borderTopWidth','borderWidth','color','opacity','height','maxHeight','maxWidth','minHeight','minWidth','width','content','quotes','counterReset','counterIncrement','alignContent','alignItems','alignSelf','flex','flexBasis','flexDirection','flexFlow','flexGrow','flexShrink','flexWrap','justifyContent','order','font','fontFamily','fontSize','fontSizeAdjust','fontStretch','fontStyle','fontVariant','fontWeight','listStyle','listStyleImage','listStylePosition','listStyleType','margin','marginBottom','marginLeft','marginRight','marginTop','columnCount','columnFill','columnGap','columnRule','columnRuleColor','columnRuleStyle','columnRuleWidth','columnSpan','columnWidth','columns','outline','outlineColor','outlineOffset','outlineStyle','outlineWidth','padding','paddingBottom','paddingLeft','paddingRight','paddingTop','pageBreakAfter','pageBreakBefore','pageBreakInside','borderCollapse','borderSpacing','captionSide','emptyCells','tableLayout','direction','tabSize','textAlign','textAlignLast','textDecoration','textDecorationColor','textDecorationLine','textDecorationStyle','textIndent','textJustify','textOverflow','textShadow','textTransform','lineHeight','verticalAlign','letterSpacing','wordSpacing','whiteSpace','wordBreak','wordWrap','backfaceVisibility','perspective','perspectiveOrigin','transform','transformOrigin','transformStyle','transition','transitionDelay','transitionDuration','transitionProperty','transitionTimingFunction','display','position','top','right','bottom','left','float','clear','zIndex','overflow','overflowX','overflowY','resize','clip','visibility','cursor','boxShadow','boxSizing'];
    const htmlProps = ['accept','accesskey','action','alt','async','autocomplete','autofocus','autoplay','charset','checked','cite','class','cols','colspan','contenteditable','controls','coords','data','datetime','default','defer','dir','dirname','disabled','download','draggable','enctype','for','form','formaction','headers','hidden','high','href','hreflang','http-equiv','id','ismap','kind','label','lang','list','loop','low','max','maxlength','media','method','min','multiple','muted','name','novalidate','onabort','onafterprint','onbeforeprint','onbeforeunload','onblur','oncanplay','oncanplaythrough','onchange','onclick','oncontextmenu','oncopy','oncuechange','oncut','ondblclick','ondrag','ondragend','ondragenter','ondragleave','ondragover','ondragstart','ondrop','ondurationchange','onemptied','onended','onerror','onfocus','onhashchange','oninput','oninvalid','onkeydown','onkeypress','onkeyup','onload','onloadeddata','onloadedmetadata','onloadstart','onmousedown','onmousemove','onmouseout','onmouseover','onmouseup','onmousewheel','onoffline','ononline','onpagehide','onpageshow','onpaste','onpause','onplay','onplaying','onpopstate','onprogress','onratechange','onreset','onresize','onscroll','onsearch','onseeked','onseeking','onselect','onstalled','onstorage','onsubmit','onsuspend','ontimeupdate','ontoggle','onunload','onvolumechange','onwaiting','onwheel','open','optimum','pattern','placeholder','poster','preload','readonly','rel','required','reversed','rows','rowspan','sandbox','scope','selected','shape','size','sizes','span','spellcheck','src','srcdoc','srclang','srcset','start','step','style','tabindex','target','title','translate','type','usemap','value','wrap','innerHTML'];
    cssProps.forEach(cssProp => {
        obj.__defineSetter__(cssProp,function(value) {this.mainDom.style[cssProp] = value; });
    });
    htmlProps.forEach(htmlProp => {
        obj.__defineSetter__(htmlProp,function(value) {
            if(typeof value == 'object') {
                let newValue = this.mainDom.getAttribute(htmlProp).replace(value[0],value[1]);
                this.mainDom.setAttribute(htmlProp,newValue);
            } else this.mainDom.setAttribute(htmlProp,value);
        });
    });
    obj.__defineGetter__('get',function() {return this.mainDom;});
    obj.__defineGetter__('props',function() {
        let props = this.mainDom.attributes;
        let propObj = {};
        for(let i in props) {
            if(typeof props[i] == 'object') {
                propObj[props[i].nodeName] = props[i].nodeValue;
            }
        }
        return propObj;
    });
    obj.__defineGetter__('formData',function() {
        let collection = this.mainDom.children;
        let data = {};
        for(let i in collection) {
            if(collection[i].name !== undefined && collection[i].value !== undefined) {
                data[collection[i].name] = collection[i].value;
            }
        }
        return data;
    });
    obj.__defineSetter__('inner',function(value) {
        if(typeof value == 'object') {
            let newValue = this.mainDom.innerHTML.replace(value[0],value[1]);
            return this.mainDom.innerHTML = newValue;
        } else return this.mainDom.innerHTML = value;
    });
    //obj['insInner'] =  function(text) {return this.mainDom.innerHTML = text;}
    obj['insDom'] = function(dom,place) {return this.mainDom.insertAdjacentElement(this.places[place],dom);}
    obj['insHtml'] = function(html,place) {return this.mainDom.insertAdjacentHTML(this.places[place],html);}
    obj['insChild'] = function(dom) {return this.mainDom.appendChild(dom);}
    obj['clone'] =  function(place,id) {
        let newDom = this.mainDom.cloneNode(true);
        newDom.id = this.mainDom.id + '_copy'
        let domTobind;
        if(id !== undefined) domTobind = document.getElementById(id);
        else domTobind = this.mainDom;
        if(place !== undefined) domTobind.insertAdjacentElement(this.places[place],newDom);
        return newDom;
    };
    obj['remove'] =  function() {return this.mainDom.remove();}
    obj['addToProp'] = function(property,value) {
        let propValue = this.mainDom.getAttribute(property);
        propValue += value;
        return this.mainDom.setAttribute(property,propValue);
    }
    obj['removeFromProp'] = function(property,value) {
        let propValue = this.mainDom.getAttribute(property);
        propValue = propValue.replace(value,'');
        return this.mainDom.setAttribute(property,propValue);
    }
    obj['replaceHtml'] = function(html) {
        while(this.mainDom.firstChild) this.mainDom.removeChild(this.mainDom.lastChild);
        this.mainDom.insertAdjacentHTML('beforeend',html);
    }
    obj['forEach'] = function(arrayOfObjects,tag,remove) {
        if(remove) {
            var elems = document.getElementsByClassName(domId);
            for (var i = elems.length - 1; i >= 0; i--) {
                if(elems[i].tagName !== 'TEMPLATE') {
                    elems[i].remove();
                }
            }
        }
        let html = '';
        let outerHtml = this.get.outerHTML;
        outerHtml = outerHtml.replace('template',tag);
        outerHtml = outerHtml.replace('/template','/'+tag);
        arrayOfObjects.forEach(record => {
            html += htmlBind(outerHtml,record,domId);
        });
        this.insHtml(html,3);
    }
    obj['bind'] = function(from,to,tag,remove,counter) {
        let array = [];
        if(counter == undefined) counter = 'counter';
        for(from; from<to; from++) {
            array.push({counter:from});
        }
        this.forEach(array,tag,remove);
    }
    obj['events'] = {};
    obj['listenTo'] = function(event,fn) {
        if(this.events[event] == undefined) {
            this.events[event] = fn;
            this.mainDom.addEventListener(event,fn);
        }
        else {
            this.mainDom.removeEventListener(event,this.events[event]);
            if(fn !== undefined) this.mainDom.addEventListener(event,fn);
            else delete this.events[event];
        }
    }
    if(domType == 'id') return obj; //https://www.w3schools.com/jsref/dom_obj_all.asp
    else {
        let methods = obj;
        let elems;
        methods.forEach = undefined;
        let array = [];
        if(domType == 'tag') elems = document.getElementsByTagName(domId);
        else if(domType == 'class') elems = document.getElementsByClassName(domId.replace('.',''));
        for (var i = elems.length - 1; i >= 0; i--) {
            methods.mainDom = elems[i];
            array.push(methods);
        }
        cssProps.forEach(cssProp => {
            array.__defineSetter__(cssProp,function(value) {
                this.forEach(elem => {
                    elem.mainDom.style[cssProp] = value;
                });
            });
        });
        htmlProps.forEach(htmlProp => {
            array.__defineSetter__(htmlProp,function(value) {
                this.forEach(elem => {
                    elem.mainDom.setAttribute(htmlProp,value);
                });
            });
        });
        array.__defineGetter__('get',function() {
            let domArray = [];
            array.forEach(domElement => {
                domArray.push(domElement.mainDom);
            });
            return domArray;
        });
        array.__defineGetter__('props',function() {
            let domArray = [];
            array.forEach(domElement => {
                domArray.push(domElement.props);
            });
            return domArray;
        });
        return array;
    }
}

export function htmlBind(html,record,domId) {
    let nameOfField;
    let parameters = [];
    let fnBody;
    let newFu;
    let fuArray = [];
// Bind record values
    let valuesToBind = html.match(/\$\{.*?\}/g);
    if(record !== undefined) {
        html = html.replace('id="'+domId,'id="'+domId+record.id);
        valuesToBind.forEach(valueToBind => {
            nameOfField = valueToBind.replace('${','').replace('}','').trim();
            if(record[nameOfField] !== undefined) html = html.replace(valueToBind,record[nameOfField]);
        });
    }
// Bind variables
    valuesToBind = html.match(/\$\{.*?\}/g);
    if(valuesToBind !== null) {
        valuesToBind.forEach(valueToBind => {
            nameOfField = valueToBind.replace('${','').replace('}','').trim();
            if(window[nameOfField] !== undefined) html = html.replace(valueToBind,window[nameOfField]);
        });
    }
// Bind arrow functions
    let arrowFunctions = html.match(/()(\()(.*?)(\))(.*?)(=>)(.*?)(\{)(.*?)(\})/g);
    let inners = html.match(/()(\()(.*?)(\))(.*?)(=&gt;)(.*?)(\{)(.*?)(\})/g);
    if(inners !== null) arrowFunctions = [...arrowFunctions,...inners];
    if(arrowFunctions !== null) {
        arrowFunctions.forEach(fu => {
            if(fu.includes('=&gt;')) fuArray = fu.split('=&gt;');
            else if(fu.includes('=>')) fuArray = fu.split('=>');
            fnBody = fuArray[1].replace('{','').replace('}','');
            newFu = new Function(parameters,fnBody);
            html = html.replace(fu,newFu(...parameters));
        });
    }
// Bind functions with name
    let functionsTags = html.match(/()(.*)(\()(.*?)(\))/g);
    let nameOfFunction;
    let jsEvents = ['onwheel','onwaiting','onvolumechange','onunload','ontransitionend','ontouchstart','ontouchmove','ontouchend','ontouchcancel','ontoggle','ontimeupdate','onsuspend','onsubmit','onstorage','onstalled','onshow','onselect','onseeking','onseeked','onsearch','onscroll','onreset','onresize','onratechange','onprogress','onpopstate','onplaying','onplay','onpause','onpaste','onpageshow','onpagehide','onopen','ononline','onoffline','onmousewheel','onmouseup','onmouseout','onmouseover','onmousemove','onmouseleave','onmouseenter','onmousedown','onmessage','onloadstart','onloadedmetadata','onloadeddata','onload','onkeyup','onkeypress','onkeydown','oninvalid','oninput','onhashchange','onfullscreenerror','onfullscreenchange','onfocusout','onfocusin','onfocus','onerror','onended','ondurationchange','ondrop','ondragstart','ondragover','ondragleave','ondragenter','ondragend','ondrag','ondblclick','oncut','oncopy','oncontextmenu','onclick','onchange','oncanplaythrough','oncanplay','onblur','onbeforeunload','onbeforeprint','onanimationstart','onanimationiteration','onanimationend','onafterprint','onabort'];
    if(functionsTags !== null) {
        functionsTags.forEach((fu,index) => {
            jsEvents.forEach(event => {
                if(fu.includes(event)) { // Filter all functions with event
                    let expression = `(\w*(${event})\w*)=\"(.*)`;
                    let reg = new RegExp(expression,"g");
                    fu = fu.replace(fu.match(reg)[0],'')
                    functionsTags[index] = fu;
                }
            });
            if(fu.match(/()(\w*\w)(\()(.*?)(\))/g) !== null) {
                fu = fu.match(/()(\w*\w)(\()(.*?)(\))/g)[0];
                functionsTags[index] = fu;
                nameOfFunction = fu.split('(')[0];
                parameters = fu.replace(nameOfFunction,'').replace('(','').replace(')','').split(',');
                parameters.forEach((parameter,index) => {
                    if(window[parameter] !== undefined) parameters[index] = window[parameter];
                });
                if(window[nameOfFunction] !== undefined) html = html.replace(fu,window[nameOfFunction](...parameters));
                else html.replace(fu,'');
            } else delete functionsTags[index];
        });
    }
//${variable} window[variable] = undefined - Set function with binding
    let fuBinds = html.match(/\s<(.*)\n?(.*?)\$\{.*\}\n?(.*)\n?(.*?)\n?(.*?)<\/(.*)\>/g);
    let id;
    let props;
    let inner;
    let domElement;
    let elementName;
    let elementValue;
    let propToBind;
    let propObj = {};
    let original;
    if(fuBinds !== null) {
        fuBinds.forEach(fuBind => {
            //Create dom element
            domElement = document.createRange().createContextualFragment(fuBind.trim('"')).firstChild;
        //Get or create Id
            if(domElement.id == '') {
                id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 7);
                id +=id;
                domElement.setAttribute('id',id);
            } else id = domElement.id;
    //Create object with prop,value and context
            props = domElement.attributes;
            for(let prop in props) {
                if(props[prop].value !== undefined && props[prop].value.includes('${')) {
                    propToBind = props[prop].value;
                    props[prop].value.match(/\$\{.*?\}/g).forEach(element => {
                        elementValue = '';
                        original = element;
                        element = element.replace('${','').replace('}','').trim();
                        if(element.split('=').length >1) {
                            elementName = element.split('=')[0].trim();
                            elementValue = element.split('=')[1].trim().replace("'",'').replace("'",'');
                            if(window[elementName] !== undefined) elementValue = window[elementName];
                        } else elementName = element;
                        if(propObj[elementName] == undefined) propObj[elementName] = {};
                        propObj[elementName][props[prop].name] = domElement.attributes[props[prop].name].textContent.replace(element.split('=')[1],'').replace('=','');
                        if(propObj[elementName]['value'] == undefined) propObj[elementName]['value'] = elementValue;
                        else elementValue = propObj[elementName]['value'];
                        propToBind = propToBind.replace(original,elementValue);
                    });
                    domElement.setAttribute(props[prop].nodeName,propToBind);
                }
            }
            inner = domElement.innerHTML;
            if(inner !== undefined) {
                if(inner.length > 1 && inner.match(/\$\{.*?\}/g)) {
                    propToBind = inner;
                    inner.match(/\$\{.*?\}/g).forEach(element => {
                        elementValue = '';
                        original = element;
                        element = element.replace('${','').replace('}','').trim();
                        if(element.split('=').length >1) {
                            elementName = element.split('=')[0].trim();
                            elementValue = element.split('=')[1].trim().replace("'",'').replace("'",'');
                            if(window[elementValue] !== undefined) elementValue = window[elementValue];
                        } else elementName = element;
                        if(propObj[elementName] == undefined) propObj[elementName] = {};
                        propObj[elementName]['innerHTML'] = inner.replace(element.split('=')[1],'').replace('=','');
                        if(propObj[elementName]['value'] == undefined) propObj[elementName]['value'] = elementValue;
                        else elementValue = propObj[elementName]['value'];
                        propToBind = propToBind.replace(original,elementValue);
                    });
                    domElement.innerHTML = propToBind;
                }
            }
            html = html.replace(fuBind,domElement.outerHTML);
            window['__domBindsObject__'] = propObj;

            let variablesToBind;
            for(let variable in propObj) {
    // Function to bind to each prop
                window[variable] = function(value,fn) {
                    if(value !== undefined) {
                        let domElement = document.getElementById(id);
                        __domBindsObject__[variable]['value'] = value;
                        let propValue;
                        let propToBind;
                        for(let prop in __domBindsObject__[variable]) {
                            if(prop !== 'value') {
                                variablesToBind = __domBindsObject__[variable][prop].match(/\$\{.*?\}/g);
                                if(variablesToBind !== null) {
                                    propToBind = __domBindsObject__[variable][prop];
                                    variablesToBind.forEach(element => {
                                        if(__domBindsObject__[element.replace('${','').replace('}','').trim()] !== undefined) {
                                            propValue = __domBindsObject__[element.replace('${','').replace('}','').trim()].value;
                                            if(fn !== undefined) propValue = fn(propValue);
                                            propToBind = propToBind.replace(element,propValue);
                                        }
                                    });
                                }
                                if(prop !== value) {
                                    if(prop == 'innerHTML') domElement.innerHTML = propToBind;
                                    else domElement.setAttribute(prop,propToBind);
                                }
                            }
                        }
                    }
                    return __domBindsObject__[variable].value;
                }
            }
        });
    }




    return html;
}

export class WireDb {
    constructor(route,fnInput,fnOutput,fnError) {
        this.__now = Date.now();
        this.__changes = {};
        this.__tables = {};
        let self = this;
        this.route = route;
        this.fnInput = fnInput;
        this.fnOutput = fnOutput;
        this.fnError = fnError;
        ajax(route,function(response) {
            if(typeof response == 'string') response = JSON.parse(response);
            for(let tableName in response) {
                self.__tables[tableName] = {};
                response[tableName].forEach( (record,index) => {
                    self.__tables[tableName][record.id] = response[tableName][index];
                });
            }
            if(fnInput !== undefined) fnInput(response);
        },'GET','',fnError);
        if(document.getElementsByName('_token')[0] !== undefined) {
            let token = document.getElementsByName('_token')[0].value;
            document.addEventListener('mouseleave',function(){self.__saveOnLeave(route,fnOutput,token);});
            document.addEventListener('touchend',function(){self.__saveOnLeave(route,fnOutput,token);});
            setTimeout(function(){ // Every 6 hours page changes saves and page refreshes
                self.__saveOnLeave(route,fnOutput,token);
                location = ''
                },60000*60*6);
        } else console.log('Please add csrf token somewhere in document (@csrf)');
    }

    __saveOnLeave(updateRoute,fnOutput,token) {
        let self = this;
        let gap = Date.now() - self.__now;
        if(Object.keys(self.__changes).length >0 && gap>3000) {
            let data = {data:JSON.stringify(self.__changes),_token:token};
            ajax(updateRoute,function(response){
                response = JSON.parse(response);
                self.__changes = {};
                for(let tableName in response) {
                    for(let id in response[tableName]) {
                        if(response[tableName][id] !== 'removed') self.__tables[tableName][id] = response[tableName][id];
                    }
                    localStorage.setItem(tableName,JSON.stringify(response[tableName])); //update local storage
                }
                if(fnOutput !== undefined && typeof fnOutput == 'function') fnOutput(response);
            },'POST',data,this.fnError);
        }
    }

    getData(tableName) {
        let self = this;
        let table = {};
        let sortKey;
        for(let recordName in this.__tables[tableName]) {
            sortKey = recordName + '_id'+recordName;
            table[sortKey] = this.__tables[tableName][recordName];
        }
        let methods = ["update","remove","sort","max","min","first","where","bind","create","binds","length","lastIdInCollection","sortKey","search","includes","removeBind","sum","sub"];
        table['tableName'] = tableName;
    //Update record
        table['update'] = function(id,data) { //data = {key:newValue,key:newValue,...}
            if(self.__changes[tableName] == undefined) self.__changes[tableName] = {};
            if(self.__changes[tableName][id] == undefined) self.__changes[tableName][id] = {};
            for(let key in data) {
                for(let i in this) {
                    if(typeof this[i] == 'object') {
                        if(this[i]['id'] == id) this[i][key] = data[key];
                    }
                }
                self.__changes[tableName][id][key] = data[key]; //update changes to send
                self.__tables[tableName][id][key] = data[key]; // update table variable
                this.binds.forEach(key => {
                    let template = document.getElementById(key).outerHTML;
                    template = template.replace('display:none; ','');
                    let record = self.__tables[tableName][id];
                    let html = htmlBind(template,record,key);
                    document.getElementById(key+id).insertAdjacentHTML('afterend',html);
                    document.getElementById(key+id).remove();
                });
            }
            localStorage.setItem(tableName,JSON.stringify(self.__tables[tableName])); // update local storage
        }
    //Remove method
        table['remove'] = function(id) {
            if(self.__changes[tableName] == undefined) self.__changes[tableName] = {};
            if(self.__changes[tableName][id] == undefined) self.__changes[tableName][id] = 'remove';

            for(let i in this) { //remove from this collection
                if(typeof this[i] == 'object') {
                    if(this[i].id == id) delete this[i];
                }
            }
            delete self.__tables[tableName][id]; // remove from table variable
            localStorage.setItem(tableName,JSON.stringify(self.__tables[tableName])); // update local storage
        // Removing all doms bindings
            this.binds.forEach(key => {
                document.getElementById(key+id).remove();
            });
        }
    // Get first
        table['first'] = function(onpage,pageNumber) {
            if(onpage == undefined && pageNumber == undefined) {
                onpage = 0;
                pageNumber = 1;
            };
            if(onpage == undefined) onpage = 10;
            if(pageNumber == undefined) pageNumber = 1;
            let ids = self.__removeMethods(this,methods);
            let collection = {};
            let start = onpage*pageNumber - onpage;
            let end = start + onpage;
            for(start; start<end; start++) {
                if(this[ids[start]] == undefined) break;
                else collection[ids[start]] = this[ids[start]];
            }
            methods.forEach(method => {
                collection[method] = this[method];
            });
            return collection;
        }
    // Create
        table['create'] = function(data,fn,clean = true) {
            if(data.parentNode !== undefined) {
                let token = document.getElementsByName('_token')[0].value;
                let values = {};
                let button = data;
                for(let i in data.parentNode.children) {
                    if(data.parentNode.children[i].value !== undefined && data.parentNode.children[i].name !== '') {
                        values[data.parentNode.children[i].name] = data.parentNode.children[i].value;
                        if(clean && button.parentNode.children[i].name !== '_token') button.parentNode.children[i].value = '';
                    }
                }
                data = {data:JSON.stringify({
                    [tableName]:{new: values}
                }),_token:token};
            }
            let collection = this;
            let sortKey = this.sortKey;
            ajax(self.route,function(response) { // send ajax to server
                response = JSON.parse(response);
                self.__tables[tableName][response.id] = response; // get response and create new record in table
                localStorage.setItem(tableName,JSON.stringify(self.__tables[tableName])); // save changes to local storage
                if(fn !== undefined) fn(response);
                let key = response[sortKey] + '_id'+response.id;
                collection[key] = response;
                collection = collection.sort(collection.sortKey);
                let binds = collection.binds;
                binds.forEach(bind => {
                    collection.bind(bind);
                });
                return collection;
            },'POST',data);
        }
    // Binds object
        table['binds'] = [];
    // Bind
        table['bind'] = function(domId) { //domId = template <div id="domId"></div>
            let template = document.getElementById(domId);
            let style = template.getAttribute('style');
            if(style !== null) {
                if(style.includes('display:none; ')) template.setAttribute('style', style.replace('display:none; ',''));
            }
            let html;
            let lastElementDomId = domId;
            let ids = self.__removeMethods(this,methods);
            ids.forEach(id => {
                if(document.getElementById(domId+this[id].id) == null) {
                    html = htmlBind(template.outerHTML,this[id],domId);
                    document.getElementById(lastElementDomId).insertAdjacentHTML('afterend',html);
                }
                lastElementDomId = domId+this[id].id;
            });
            template.setAttribute('style', 'display:none; '+template.getAttribute('style'));
            if(!this.binds.some( bind => bind == domId)) this.binds.push(domId);
        }
    //Remove Bind
        table['removeBind'] = function(domId) {
            let collection = self.__removeMethods(this,methods);
            collection.forEach(element => {
                if(document.getElementById(domId+this[element].id) !== null) {
                    document.getElementById(domId+this[element].id).remove();
                }
            });
        }
    //Where - filter collection
        table['where'] = function(key,value) { // {field:value,field:value,...}
            let collection = {};
            let ids = self.__removeMethods(this,methods);
            ids.filter( (id) => {
                if(this[id][key] == value) {
                    collection[id] = this[id];
                }
            });
            methods.forEach(method => {
                collection[method] = this[method];
            });
            return collection;
        }
    //Search
        table['search'] = function(key,value,fn = function(value) {return value;},start) {
            let collection = {};
            let ids = self.__removeMethods(this,methods);
            ids.filter( (id) => {
                if(fn(this[id][key]) !== null && this[id][key].match(value) !== null) {
                    collection[id] = this[id];
                }
            });
            methods.forEach(method => {
                collection[method] = this[method];
            });
            return collection;
        }
    //Includes
        table['includes'] = function(key,value) {
            let collection = {};
            let ids = self.__removeMethods(this,methods);
            if(this[ids[0]][key] == undefined) console.log('The key is not valid');
            else {
                ids.filter( (id) => {
                    if(this[id][key].includes(value)) {
                        collection[id] = this[id];
                    }
                });
            }
            methods.forEach(method => {
                collection[method] = this[method];
            });
            return collection;
        }
    // Length
        table['length'] = self.__removeMethods(this,methods).length;
    // Sort collection
        table['sort'] = function(field,bind = false,order = 1) {
            //TODO sort id - add 0 at begin
            let ids = self.__removeMethods(this,methods);
            let newSortKey;
            let newCollection = {};
            let key;
            ids.forEach(sortKey => {
                key = this[sortKey][field]+''; //+'' for case the typof key is number
                newSortKey = key+'_id'+this[sortKey].id;
                newCollection[newSortKey] = this[sortKey];
            });
            if(bind) {
                let binds = this.binds;
                let elementId;
                binds.forEach(domId => {
                    let parentDomElement = document.getElementById(domId);
                    let lasElement = parentDomElement;
                    let elementToOrder;

                    ids = Object.keys(newCollection).sort();
                    if(order == 2) {
                        let newIds = [];
                        for(let i = ids.length-1; i>=0; i--) {
                            newIds.push(ids[i]);
                        }
                        ids = newIds;
                    }
                    ids.forEach(sortKey => {
                        elementId = domId + newCollection[sortKey].id;
                        elementToOrder = document.getElementById(elementId);
                        lasElement.insertAdjacentElement('afterend',elementToOrder);
                        lasElement = elementToOrder;
                    });
                });
            }
            methods.forEach(method => {
                newCollection[method] = this[method];
            });
            newCollection['sortKey'] = field;
            return newCollection;
        }
    //Get maximum
        table['max'] = function(field) {
            let ids = self.__removeMethods(this,methods);
            let max = this[ids[0]][field];
            for(let id in this) {
                if(this[id][field] > max) max = this[id][field];
            }
            return max;
        }
    //Get minimum
        table['min'] = function(field) {
            let ids = self.__removeMethods(this,methods);
            let min = this[ids[0]][field];
            for(let id in this) {
                if(this[id][field] < min) min = this[id][field];
            }
            return min;
        }
        table['sum'] = function(field) {
            let ids = self.__removeMethods(this,methods);
            let sum = 0;
            ids.forEach(id => {
                sum += this[id][field]/1;
            });
            return sum;
        }
        table['sub'] = function(field1,field2) {
            let ids = self.__removeMethods(this,methods);
            let sub = [];
            ids.forEach(id => {
                sub.push(this[id][field1]/1 - this[id][field2]/1);
            });
            return sub;
        }
        table['sortKey'] = 'id';
        return table;
    }

    __removeMethods(collection,methods) {
        let ids = Object.keys(collection);
        ids.sort();
        methods.forEach(method => {
            let index = ids.indexOf(method);
            ids.splice(index, 1);
        });
        return ids;
    }
}
