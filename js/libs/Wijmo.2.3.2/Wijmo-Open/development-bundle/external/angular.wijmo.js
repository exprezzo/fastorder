var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
}
/*
*
* Wijmo AngularJS Component Library 2.3.2
* http://wijmo.com/
*
* Copyright(c) GrapeCity, Inc.  All rights reserved.
*
* Dual licensed under the MIT or GPL Version 2 licenses.
* licensing@wijmo.com
* http://wijmo.com/license
*
*
* * Wijmo AngularJS Directive Factory.
*
* Depends:
*  angular.js
*
*/

var wijmo;
(function (wijmo) {
    (function (ng) {
        function getTypeDefFromExample(value) {
            if(value == null) {
                return {
                };
            }
            var meta = {
                type: angular.isArray(value) ? "array" : typeof value
            };
            switch(meta.type) {
                case "object": {
                    meta.properties = {
                    };
                    if(value) {
                        $.each(value, function (key, propValue) {
                            meta.properties[key] = getTypeDefFromExample(propValue);
                        });
                    }
                    break;

                }
                case "array": {
                    meta.elementType = getTypeDefFromExample(value[0]);
                    break;

                }
            }
            return meta;
        }
        function derive(proto, newProperties) {
            var derived;
            if(Object.create) {
                try  {
                    derived = Object.create(proto);
                } catch (err) {
                }
            }
            if(!derived) {
                function Clazz() {
                }
                Clazz.prototype = proto;
                derived = new Clazz();
            }
            if(newProperties) {
                $.extend(derived, newProperties);
            }
            return derived;
        }
        function safeApply(scope, data) {
            var phase = scope.$root.$$phase;
            if(phase !== '$apply' && phase !== '$digest') {
                scope.$apply(data);
            }
        }
        var ParsedMarkup = (function () {
            function ParsedMarkup(options, bindings) {
                this.options = options;
                this.bindings = bindings;
            }
            // get camelCase name -> lowercase property name mapping
                        ParsedMarkup.getNameMap = function getNameMap(obj) {
                var map = {
                };
                var key;

                for(key in obj) {
                    map[key.toLowerCase()] = key;
                }
                return map;
            }
            ParsedMarkup.parseCore = function parseCore(node, typeDef, bindings, path) {
                function readNode(node) {
                    var $node = $(node);
                    var value;
                    var match;
                    var name;
                    var propPath;

                    switch(node.nodeType) {
                        case Node.ATTRIBUTE_NODE: {
                            value = $node.val();
                            break;

                        }
                        case Node.ELEMENT_NODE: {
                            value = $node.text();
                            break;

                        }
                        default: {
                            return;

                        }
                    }
                    // restore the original property name casing if possible
                    name = node.nodeName || node.name;
                    name = name.toLowerCase();
                    name = map[name] || name;
                    match = value && /{{(.+)}}/.exec(value);
                    if(match) {
                        toRemove.push(node);
                        bindings.push({
                            path: (path && path + ".") + name,
                            expression: match[1]
                        });
                        return;
                    }
                    if(node.nodeType === Node.ELEMENT_NODE && array) {
                        // then push the sub-element
                        array.push(ParsedMarkup.parseCore(node, typeDef && typeDef.elementType, bindings, path + "[" + array.length + "]"));
                    } else {
                        obj[name] = ParsedMarkup.parseCore(node, properties && properties[name], bindings, (path && path + ".") + name);
                    }
                }
                var text = node.nodeType === Node.TEXT_NODE ? (node).wholeText : (node).value;
                var isArray = typeDef && typeDef.type === "array";
                var properties = typeDef && typeDef.properties;
                var map = // we need this lowercase name map because HTML IS NOT CASE-SENSITIVE! Chris said that.
                properties && ParsedMarkup.getNameMap(properties) || {
                };
                var toRemove = [];
                var obj;
                var array;
                var primitiveTypeRequested;

                // if the type is a number or boolean, then parse it.
                // if it is not an object or the node is not an element, return the text
                switch(typeDef && typeDef.type) {
                    case "boolean": {
                        return text.toLowerCase() === "true";

                    }
                    case "number": {
                        return parseFloat(text);

                    }
                    default: {
                        primitiveTypeRequested = typeDef && typeDef.type && typeDef.type !== "object" && typeDef.type !== "array";
                        if(primitiveTypeRequested || node.nodeType !== Node.ELEMENT_NODE) {
                            return text;
                        }

                    }
                }
                // parse a DOM element to an object/array
                if(isArray) {
                    array = [];
                } else {
                    obj = {
                    };
                }
                // read attributes
                angular.forEach(node.attributes, readNode);
                angular.forEach(node.childNodes, readNode);
                $.each(toRemove, function (_, node) {
                    if(node.nodeType === Node.ATTRIBUTE_NODE) {
                        $(node.ownerElement).removeAttr(node.name);
                    } else {
                        $(node).remove();
                    }
                });
                return obj || array;
            }
            ParsedMarkup.parse = function parse(node, typeDef) {
                var bindings = [];
                var options = ParsedMarkup.parseCore(node, typeDef, bindings, "");
                return new ParsedMarkup(options, bindings);
            }
            return ParsedMarkup;
        })();        
        var definitions;
        (function (definitions) {
            var DirectiveBase = (function () {
                function DirectiveBase(widgetName, clazz) {
                    this.widgetName = widgetName;
                    this.expectedTemplate = "<div/>";
                    this.restrict = 'E';
                    // require mapping to a DOM element
                    // create a new scope (not sharing)
                    this.scope = {
                    };
                    this.internalEventPrefix = "wijmo-angular";
                    this.scopeWatchers = {
                    };
                    this.wijMetadata = DirectiveBase.mergeMetadata(widgetName, clazz.prototype.options);
                    this.eventPrefix = clazz.prototype.widgetEventPrefix || widgetName;
                    this.registerEvents();
                }
                DirectiveBase.mergeMetadata = function mergeMetadata(widgetName, options) {
                    var fromOptions = {
                        properties: getTypeDefFromExample(options).properties
                    };
                    var result = $.extend({
                    }, fromOptions, widgetMetadata["base"]);
                    var inheritanceStack = [];
                    var parentName = widgetName;

                    do {
                        inheritanceStack.unshift(parentName);
                        parentName = widgetMetadata[parentName] && widgetMetadata[parentName].inherits;
                    }while(parentName)
                    angular.forEach(inheritanceStack, function (name) {
                        return $.extend(true, result, widgetMetadata[name]);
                    });
                    return result;
                }
                DirectiveBase.prototype.bindToWidget = function (name, handler) {
                    var fullName = this.eventPrefix + name.toLowerCase() + "." + this.internalEventPrefix;
                    this.element.bind(fullName, handler);
                };
                DirectiveBase.prototype.registerEvents = function () {
                    var _this = this;
                    // TODO: optimize this. No need to watch for all events if handlers are not specified
                    if(!this.wijMetadata.events) {
                        return;
                    }
                    $.each(this.wijMetadata.events, function (name) {
                        _this.scope[name] = "=" + name.toLowerCase();
                        _this.scopeWatchers[name] = function (handler) {
                            this.bindToWidget(name, handler);
                        };
                    });
                };
                DirectiveBase.prototype.parseMarkup = function (elem) {
                    var markup = ParsedMarkup.parse(elem[0], {
                        type: "object",
                        properties: this.wijMetadata.properties
                    });
                    markup.options.dataSource = [];
                    return markup;
                };
                DirectiveBase.prototype.compile = function (tElem, tAttrs) {
                    var newThis = derive(this, {
                        markup: this.parseMarkup(tElem)
                    });
                    return $.proxy(newThis.link, newThis);
                }// ---- after compilation -----
                ;
                DirectiveBase.prototype.createInstance = function (elem, attrs) {
                    // create a widget instance
                    var newElem = $(this.expectedTemplate).attr(// move style and class to the new element
                    {
                        style: attrs.style,
                        id: attrs.id,
                        "class": attrs["class"]
                    });
                    return newElem.replaceAll(elem)[this.widgetName](this.markup.options);
                };
                DirectiveBase.prototype.link = function (scope, elem, attrs) {
                    var newThis = derive(this, {
                        $scope: scope,
                        element: this.createInstance(elem, attrs)
                    });
                    newThis.widget = newThis.element.data(this.widgetName);
                    newThis.wireData();
                }// ----- after linking -----
                ;
                DirectiveBase.prototype.wireData = function () {
                    var _this = this;
                    var parentScope = this.$scope.$parent;
                    // setup directive scope watches
                    $.each(this.scopeWatchers, function (name, handler) {
                        return _this.$scope.$watch(name, $.proxy(handler, _this), true);
                    });
                    // establish two-way data binding between widget options and a view model (parent scope)
                    $.each(this.markup.bindings, function (_, binding) {
                        // listen to changes in the view model
                        parentScope.$watch(binding.expression, function (value) {
                            return _this.setOption(binding.path, value);
                        }, true);
                        // listen to changes in the widget options
                        var meta = _this.wijMetadata.properties[binding.path];
                        if(meta && meta.changeEvent) {
                            _this.bindToWidget(meta.changeEvent, function () {
                                parentScope[binding.expression] = _this.widget.option(binding.path);
                                safeApply(parentScope, binding.expression);
                            });
                        }
                    });
                };
                DirectiveBase.prototype.setOption = function (path, value) {
                    if(this.widget.option(path) !== value) {
                        this.widget.option(path, value);
                    }
                };
                return DirectiveBase;
            })();
            definitions.DirectiveBase = DirectiveBase;            
            var wijgrid = (function (_super) {
                __extends(wijgrid, _super);
                function wijgrid() {
                    _super.apply(this, arguments);

                    this.expectedTemplate = "<table/>";
                }
                wijgrid.prototype.parseMarkup = function (elem) {
                    var markup = _super.prototype.parseMarkup.call(this, elem);
                    markup.options.data = [];
                    return markup;
                };
                return wijgrid;
            })(DirectiveBase);
            definitions.wijgrid = wijgrid;            
            var gcSpread = (function (_super) {
                __extends(gcSpread, _super);
                function gcSpread() {
                    _super.apply(this, arguments);

                }
                gcSpread.prototype.setOption = function (path, value) {
                    if(path === "dataSource") {
                        this.widget.sheets[0].setDataSource(value);
                    } else {
                        _super.prototype.setOption.call(this, path, value);
                    }
                };
                return gcSpread;
            })(DirectiveBase);
            definitions.gcSpread = gcSpread;            
            function findDirectiveClass(widgetName) {
                var metadata = widgetMetadata[widgetName];
                var parentMetadata;

                return definitions[widgetName] || metadata && metadata.inherits && findDirectiveClass(metadata.inherits);
            }
            definitions.findDirectiveClass = findDirectiveClass;
        })(definitions || (definitions = {}));
        // define the wijmo module
        
        var wijModule = angular["module"]('wijmo', []);
        function registerDirective(widgetName, clazz, directiveName) {
            var directiveClass = definitions.findDirectiveClass(widgetName) || definitions.DirectiveBase;
            wijModule.directive(directiveName || widgetName.toLowerCase(), function () {
                return new directiveClass(widgetName, clazz);
            });
        }
        var widgetMetadata = {
            "base": {
                events: {
                    "create": {
                    },
                    "change": {
                    }
                }
            },
            "wijtooltip": {
                "events": {
                    "showing": {
                    },
                    "shown": {
                    },
                    "hiding": {
                    },
                    "hidden": {
                    }
                },
                "properties": {
                    "group": {
                    },
                    "ajaxCallback": {
                    }
                }
            },
            "wijslider": {
                "events": {
                    "buttonMouseOver": {
                    },
                    "buttonMouseOut": {
                    },
                    "buttonMouseDown": {
                    },
                    "buttonMouseUp": {
                    },
                    "buttonClick": {
                    },
                    "start": {
                    },
                    "stop": {
                    }
                },
                "properties": {
                    "value": {
                        changeEvent: "change"
                    },
                    "values": {
                    }
                }
            },
            "wijsplitter": {
                "events": {
                    "sized": {
                    },
                    "load": {
                    },
                    "sizing": {
                    }
                },
                "properties": {
                    "expand": {
                    },
                    "collapse": {
                    },
                    "expanded": {
                    },
                    "collapsed": {
                    }
                }
            },
            "wijprogressbar": {
                "properties": {
                    "progressChanging": {
                    },
                    "beforeProgressChanging": {
                    },
                    "progressChanged": {
                    }
                }
            },
            "wijdialog": {
                "events": {
                    "blur": {
                    },
                    "buttonCreating": {
                    },
                    "resize": {
                    },
                    "stateChanged": {
                    },
                    "focus": {
                    },
                    "resizeStart": {
                    },
                    "resizeStop": {
                    }
                },
                "properties": {
                    "hide": {
                    },
                    "show": {
                    },
                    "collapsingAnimation": {
                    },
                    "expandingAnimation": {
                    }
                }
            },
            "wijaccordion": {
                "events": {
                    "beforeSelectedIndexChanged": {
                    },
                    "selectedIndexChanged": {
                    }
                },
                "properties": {
                    "duration": {
                    }
                }
            },
            "wijpopup": {
                "events": {
                    "showing": {
                    },
                    "shown": {
                    },
                    "hiding": {
                    },
                    "hidden": {
                    },
                    "posChanged": {
                    }
                }
            },
            "wijsuperpanel": {
                "events": {
                    "dragStop": {
                    },
                    "painted": {
                    },
                    "scroll": {
                    },
                    "scrolling": {
                    },
                    "scrolled": {
                    },
                    "resized": {
                    }
                },
                "properties": {
                    "hScrollerActivating": {
                    },
                    "vScrollerActivating": {
                    }
                }
            },
            "wijcheckbox": {
                "properties": {
                    "checked": {
                    }
                }
            },
            "wijradio": {
                "properties": {
                    "checked": {
                    }
                }
            },
            "wijlist": {
                "events": {
                    "focusing": {
                    },
                    "focus": {
                    },
                    "blur": {
                    },
                    "selected": {
                    },
                    "listRendered": {
                    },
                    "itemRendering": {
                    },
                    "itemRendered": {
                    }
                },
                "properties": {
                    "superPanelOptions": {
                    }
                }
            },
            "wijcalendar": {
                "events": {
                    "beforeSlide": {
                    },
                    "beforeSelect": {
                    },
                    "selectedDatesChanged": {
                    },
                    "afterSelect": {
                    },
                    "afterSlide": {
                    }
                },
                "properties": {
                    "customizeDate": {
                    },
                    "title": {
                    },
                    selectedDates: {
                        type: "array",
                        elementType: "date",
                        changeEvent: "selecteddateschanged"
                    }
                }
            },
            "wijexpander": {
                "events": {
                    "beforeCollapse": {
                    },
                    "afterCollapse": {
                    },
                    "beforeExpand": {
                    },
                    "afterExpand": {
                    }
                }
            },
            "wijmenu": {
                "events": {
                    "focus": {
                    },
                    "blur": {
                    },
                    "select": {
                    },
                    "showing": {
                    },
                    "shown": {
                    },
                    "hidding": {
                    },
                    "hidden": {
                    }
                },
                "properties": {
                    "superPanelOptions": {
                    }
                }
            },
            "wijmenuitem": {
                "events": {
                    "hidding": {
                    },
                    "hidden": {
                    },
                    "showing": {
                    },
                    "shown": {
                    }
                }
            },
            "wijtabs": {
                "properties": {
                    "ajaxOptions": {
                    },
                    "cookie": {
                    },
                    "hideOption": {
                    },
                    "showOption": {
                    },
                    "add": {
                    },
                    "remove": {
                    },
                    "select": {
                    },
                    "beforeShow": {
                    },
                    "show": {
                    },
                    "load": {
                    },
                    "disable": {
                    },
                    "enable": {
                    }
                }
            },
            "wijpager": {
                "events": {
                    "pageIndexChanging": {
                    },
                    "pageIndexChanged": {
                    }
                }
            },
            "wijcombobox": {
                "events": {
                    "select": {
                    },
                    "search": {
                    },
                    "open": {
                    },
                    "close": {
                    }
                },
                "properties": {
                    "data": {
                    },
                    "labelText": {
                    },
                    "showingAnimation": {
                    },
                    "hidingAnimation": {
                    },
                    "selectedValue": {
                    },
                    "text": {
                    },
                    "listOptions": {
                    }
                }
            },
            "wijinputcore": {
                "events": {
                    "initializing": {
                    },
                    "initialized": {
                    },
                    "triggerMouseDown": {
                    },
                    "triggerMouseUp": {
                    },
                    "initialized": {
                    },
                    "textChanged": {
                    },
                    "invalidInput": {
                    }
                }
            },
            "wijinputdate": {
                inherits: "wijinputcore",
                "events": {
                    "dateChanged": {
                    }
                },
                "properties": {
                    "date": {
                    },
                    "minDate": {
                    },
                    "maxDate": {
                    }
                }
            },
            "wijinputmask": {
                inherits: "wijinputcore",
                "properties": {
                    "text": {
                        type: "string"
                    }
                }
            },
            "wijinputnumber": {
                inherits: "wijinputcore",
                "events": {
                    "valueChanged": {
                    },
                    "valueBoundsExceeded": {
                    }
                },
                "properties": {
                    "value": {
                    }
                }
            },
            "wijgrid": {
                "properties": {
                    "columns": {
                        type: "array",
                        elementType: {
                            type: "object",
                            properties: {
                                "dataKey": {
                                    type: "string"
                                },
                                "headerText": {
                                    type: "string"
                                }
                            }
                        }
                    }
                },
                "events": {
                    "ajaxError": {
                    },
                    "dataLoading": {
                    },
                    "dataLoaded": {
                    },
                    "loading": {
                    },
                    "loaded": {
                    },
                    "columnDropping": {
                    },
                    "columnDropped": {
                    },
                    "columnGrouping": {
                    },
                    "columnGrouped": {
                    },
                    "columnUngrouping": {
                    },
                    "columnUngrouped": {
                    },
                    "filtering": {
                    },
                    "filtered": {
                    },
                    "sorting": {
                    },
                    "sorted": {
                    },
                    "currentCellChanged": {
                    },
                    "pageIndexChanging": {
                    },
                    "pageIndexChanged": {
                    },
                    "rendering": {
                    },
                    "rendered": {
                    },
                    "columnResizing": {
                    },
                    "columnResized": {
                    },
                    "currentCellChanging": {
                    },
                    "afterCellEdit": {
                    },
                    "afterCellUpdate": {
                    },
                    "beforeCellEdit": {
                    },
                    "beforeCellUpdate": {
                    },
                    "columnDragging": {
                    },
                    "columnDragged": {
                    },
                    "filterOperatorsListShowing": {
                    },
                    "groupAggregate": {
                    },
                    "groupText": {
                    },
                    "invalidCellValue": {
                    },
                    "selectionChanged": {
                    }
                }
            },
            "wijchartcore": {
                "events": {
                    "beforeSeriesChange": {
                    },
                    "afterSeriesChange": {
                    },
                    "seriesChanged": {
                    },
                    "beforePaint": {
                    },
                    "painted": {
                    },
                    "mouseDown": {
                    },
                    "mouseUp": {
                    },
                    "mouseOver": {
                    },
                    "mouseOut": {
                    },
                    "mouseMove": {
                    },
                    "click": {
                    }
                },
                "properties": {
                    "width": {
                        type: "number"
                    },
                    "height": {
                        type: "number"
                    }
                }
            },
            "wijcompositechart": {
                inherits: "wijchartcore"
            },
            "wijbarchart": {
                inherits: "wijchartcore"
            },
            "wijlinechart": {
                inherits: "wijchartcore",
                "properties": {
                    "hole": {
                    }
                }
            },
            "wijscatterchart": {
                inherits: "wijchartcore"
            },
            "wijbubblechart": {
                inherits: "wijchartcore"
            },
            "wijpiechart": {
                inherits: "wijchartcore",
                "properties": {
                    "radius": {
                        type: "number"
                    }
                }
            },
            "wijtree": {
                "events": {
                    "nodeBeforeDropped": {
                    },
                    "nodeDropped": {
                    },
                    "nodeBlur": {
                    },
                    "nodeFocus": {
                    },
                    "nodeClick": {
                    },
                    "nodeCheckChanged": {
                    },
                    "nodeCollapsed": {
                    },
                    "nodeExpanded": {
                    },
                    "nodeDragging": {
                    },
                    "nodeDragStarted": {
                    },
                    "nodeMouseOver": {
                    },
                    "nodeMouseOut": {
                    },
                    "nodeTextChanged": {
                    },
                    "selectedNodeChanged": {
                    },
                    "nodeExpanding": {
                    },
                    "nodeCollapsing": {
                    }
                }
            },
            "wijtreenode": {
                "events": {
                    "nodeTextChanged": {
                    },
                    "nodeDragStarted": {
                    },
                    "nodeDragging": {
                    },
                    "nodeCheckChanged": {
                    },
                    "nodeFocus": {
                    },
                    "nodeBlur": {
                    },
                    "nodeClick": {
                    },
                    "selectedNodeChanged": {
                    },
                    "nodeMouseOver": {
                    },
                    "nodeMouseOut": {
                    }
                }
            },
            "wijupload": {
                "events": {
                    "cancel": {
                    },
                    "totalComplete": {
                    },
                    "progress": {
                    },
                    "complete": {
                    },
                    "totalProgress": {
                    },
                    "upload": {
                    },
                    "totalUpload": {
                    }
                }
            },
            "wijwizard": {
                "events": {
                    "show": {
                    },
                    "add": {
                    },
                    "remove": {
                    },
                    "activeIndexChanged": {
                    },
                    "validating": {
                    },
                    "load": {
                    }
                },
                "properties": {
                    "ajaxOptions": {
                    },
                    "cookie": {
                    }
                }
            },
            "wijribbon": {
                "events": {
                    "click": {
                    }
                }
            },
            "wijeditor": {
                "events": {
                    "commandButtonClick": {
                    },
                    "textChanged": {
                    }
                },
                "properties": {
                    "simpleModeCommands": {
                    },
                    "text": {
                    },
                    "localization": {
                    }
                }
            },
            "wijrating": {
                "events": {
                    "hover": {
                    },
                    "rating": {
                    },
                    "rated": {
                    },
                    "reset": {
                    }
                },
                "properties": {
                    "min": {
                    },
                    "max": {
                    },
                    "animation": {
                    }
                }
            },
            "wijcarousel": {
                "events": {
                    "loadCallback": {
                    },
                    "itemClick": {
                    },
                    "beforeScroll": {
                    },
                    "afterScroll": {
                    },
                    "create": {
                    }
                }
            },
            "wijgallery": {
                "events": {
                    "loadCallback": {
                    },
                    "beforeTransition": {
                    },
                    "afterTransition": {
                    },
                    "create": {
                    }
                }
            },
            "wijgauge": {
                "events": {
                    "beforeValueChanged": {
                    },
                    "valueChanged": {
                    },
                    "painted": {
                    },
                    "click": {
                    },
                    "create": {
                    }
                }
            },
            "wijlineargauge": {
                inherits: "wijgauge"
            },
            "wijradialgauge": {
                inherits: "wijgauge"
            },
            "wijlightbox": {
                "events": {
                    "show": {
                    },
                    "beforeShow": {
                    },
                    "beforeClose": {
                    },
                    "close": {
                    },
                    "open": {
                    }
                },
                "properties": {
                    "cookie": {
                    }
                }
            },
            "wijdatepager": {
                "events": {
                    "selectedDateChanged": {
                    }
                },
                "properties": {
                    "localization": {
                    }
                }
            },
            "wijevcal": {
                "events": {
                    "viewTypeChanged": {
                    },
                    "selectedDatesChanged": {
                    },
                    "initialized": {
                    },
                    "beforeDeleteCalendar": {
                    },
                    "beforeAddCalendar": {
                    },
                    "beforeUpdateCalendar": {
                    },
                    "beforeAddEvent": {
                    },
                    "beforeUpdateEvent": {
                    },
                    "beforeDeleteEvent": {
                    },
                    "beforeEditEventDialogShow": {
                    },
                    "eventsDataChanged": {
                    },
                    "calendarsChanged": {
                    }
                },
                "properties": {
                    "localization": {
                    },
                    "datePagerLocalization": {
                    },
                    "colors": {
                    },
                    "selectedDate": {
                    },
                    "selectedDates": {
                    }
                }
            },
            "gcSpread": {
                properties: {
                    dataSource: {
                        type: "array"
                    },
                    sheetCount: {
                        type: "number"
                    },
                    sheets: {
                        type: "array",
                        elementType: {
                            type: "object",
                            properties: {
                                rowCount: {
                                    type: "number"
                                },
                                colCount: {
                                    type: "number"
                                },
                                defaultRowCount: {
                                    type: "number"
                                },
                                defaultColCount: {
                                    type: "number"
                                }
                            }
                        }
                    }
                }
            }
        };
        // register directives for all widgets
        $.each($.wijmo, registerDirective);
        $.each($.ui, function (name, clazz) {
            return registerDirective(name, clazz, "jqui" + name);
        });
    })(wijmo.ng || (wijmo.ng = {}));
    var ng = wijmo.ng;

})(wijmo || (wijmo = {}));

