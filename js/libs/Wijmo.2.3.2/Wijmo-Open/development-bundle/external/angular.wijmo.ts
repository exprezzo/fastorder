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
declare var $, angular;
 
module wijmo.ng {
    interface TypeDef {
        type?: string;
        elementType?: TypeDef;
        properties?: Object;
    }
    function getTypeDefFromExample(value): TypeDef {
        if (value == null) return {};

        var meta: TypeDef = {
            type: angular.isArray(value) ? "array" : typeof value
        };
        switch (meta.type) {
            case "object":
                meta.properties = {};
                if (value) {
                    $.each(value, function (key, propValue) {
                        meta.properties[key] = getTypeDefFromExample(propValue);
                    });
                }
                break;
            case "array":
                meta.elementType = getTypeDefFromExample(value[0]);
                break;
        }
        return meta;
    }

   interface WidgetMetadata {
        inherits?: string;
        events?: Object;
        properties?: Object;
    }

    interface Binding {
        expression: string;
        path: string;
    }

    function derive(proto, newProperties) {
        var derived;

        if (Object.create) {
            try {
                derived = Object.create(proto);
            } catch (err) {
            }
        }

        if (!derived) {
            function Clazz() { }
            Clazz.prototype = proto;
            derived = new Clazz();
        }
        
        if (newProperties) {
            $.extend(derived, newProperties);
        }

        return derived;
    }
    function safeApply(scope, data) {
        var phase = scope.$root.$$phase;
        if (phase !== '$apply' && phase !== '$digest') {
            scope.$apply(data);
        }
    }

    class ParsedMarkup {
        constructor (public options, public bindings: Binding[]) { }

        // get camelCase name -> lowercase property name mapping
        static getNameMap(obj) {
            var map = {},
                key: string;
            for (key in obj) {
                map[key.toLowerCase()] = key;
            }
            return map;
        }
        static parseCore(node, typeDef: TypeDef, bindings: Binding[], path: string) {
            function readNode(node) {
                var $node = $(node),
                    value: string,
                    match: RegExpExecArray,
                    name: string,
                    propPath: string;

                switch (node.nodeType) {
                    case Node.ATTRIBUTE_NODE:
                        value = $node.val();
                        break;
                    case Node.ELEMENT_NODE:
                        value = $node.text();
                        break;
                    default:
                        return;
                }


                // restore the original property name casing if possible
                name = node.nodeName || node.name;
                name = name.toLowerCase();
                name = map[name] || name;

                match = value && /{{(.+)}}/.exec(value);
                if (match) {
                    toRemove.push(node);
                    bindings.push({ 
                        path: (path && path + ".") + name, 
                        expression: match[1] 
                    });
                    return;
                }

                if (node.nodeType === Node.ELEMENT_NODE && array) {
                    // then push the sub-element
                    array.push(parseCore(node, typeDef && typeDef.elementType, bindings, path + "[" + array.length + "]"));
                } else {
                    obj[name] = parseCore(node, properties && properties[name], bindings, (path && path + ".") + name);
                }
            }

            var text = node.nodeType === Node.TEXT_NODE ? (<Text>node).wholeText : (<Attr>node).value,
                isArray = typeDef && typeDef.type === "array",
                properties = typeDef && typeDef.properties,
            // we need this lowercase name map because HTML IS NOT CASE-SENSITIVE! Chris said that.
                map = properties && getNameMap(properties) || {},
                toRemove: Node[] = [],
                obj: Object,
                array: any[],
                primitiveTypeRequested: bool;

            // if the type is a number or boolean, then parse it.
            // if it is not an object or the node is not an element, return the text
            switch (typeDef && typeDef.type) {
                case "boolean":
                    return text.toLowerCase() === "true";
                case "number":
                    return parseFloat(text);
                default:
                    primitiveTypeRequested = typeDef && typeDef.type && typeDef.type !== "object" && typeDef.type !== "array";
                    if (primitiveTypeRequested || node.nodeType !== Node.ELEMENT_NODE) {
                        return text;
                    }
            }

            // parse a DOM element to an object/array
            if (isArray) {
                array = [];
            } else {
                obj = {};
            }

            // read attributes
            angular.forEach(node.attributes, readNode);
            angular.forEach(node.childNodes, readNode);
            $.each(toRemove, function (_, node) {
                if (node.nodeType === Node.ATTRIBUTE_NODE) {
                    $(node.ownerElement).removeAttr(node.name);
                } else {
                    $(node).remove();
                }
            });

            return obj || array;
        }
        static parse(node: Node, typeDef: TypeDef) {
            var bindings: Binding[] = [];
            var options = parseCore(node, typeDef, bindings, "");
            return new ParsedMarkup(options, bindings);
        }
    }

    module definitions {
        export class DirectiveBase {
            expectedTemplate = "<div/>";
            restrict = 'E'; // require mapping to a DOM element
            // create a new scope (not sharing)
            scope = {};
            wijMetadata: WidgetMetadata;
            eventPrefix: string;
            internalEventPrefix = "wijmo-angular";

            static mergeMetadata(widgetName: string, options) {
                var fromOptions = { properties: getTypeDefFromExample(options).properties },
                    result = $.extend({}, fromOptions, widgetMetadata["base"]),
                    inheritanceStack = [],
                    parentName = widgetName;

                do {
                    inheritanceStack.unshift(parentName);
                    parentName = widgetMetadata[parentName] && widgetMetadata[parentName].inherits;
                } while (parentName);

                angular.forEach(inheritanceStack, (name) =>  $.extend(true, result, widgetMetadata[name]));
                return result;
            }

            constructor (public widgetName: string, clazz: Function) {
                this.wijMetadata = DirectiveBase.mergeMetadata(widgetName, clazz.prototype.options);
                this.eventPrefix = clazz.prototype.widgetEventPrefix || widgetName;
                this.registerEvents();
            }

            bindToWidget(name, handler) {
                var fullName = this.eventPrefix + name.toLowerCase() + "." + this.internalEventPrefix;
                this.element.bind(fullName, handler);
            }
            registerEvents() {
                // TODO: optimize this. No need to watch for all events if handlers are not specified
                if (!this.wijMetadata.events) return;

                $.each(this.wijMetadata.events, (name) => {
                    this.scope[name] = "=" + name.toLowerCase();
                    this.scopeWatchers[name] = function (handler) {
                        this.bindToWidget(name, handler);
                    };
                });
            }

            parseMarkup(elem) {
                var markup = ParsedMarkup.parse(elem[0], { type: "object", properties: this.wijMetadata.properties });
                markup.options.dataSource = [];
                return markup;
            }

            compile(tElem, tAttrs) {
                var newThis = <DirectiveBase> derive(this, { 
                    markup: this.parseMarkup(tElem) 
                });
                return $.proxy(newThis.link, newThis);
            }

            // ---- after compilation -----

            markup: ParsedMarkup;
            createInstance(elem, attrs) {
                // create a widget instance
                var newElem = $(this.expectedTemplate)

                    // move style and class to the new element
                    .attr({
                        style: attrs.style,
                        id: attrs.id,
                        "class": attrs["class"]
                    });

                return newElem.replaceAll(elem)[this.widgetName](this.markup.options)
            }

            link(scope, elem, attrs) {
                var newThis = <DirectiveBase> derive(this, { 
                    $scope: scope, 
                    element: this.createInstance(elem, attrs)
                });
                newThis.widget = newThis.element.data(this.widgetName);
                newThis.wireData();
            }

            // ----- after linking -----

            $scope: any;
            element: any;
            widget: any;
            scopeWatchers = {};

            wireData() {
                var parentScope = this.$scope.$parent;

                // setup directive scope watches
                $.each(this.scopeWatchers, (name, handler) => this.$scope.$watch(name, $.proxy(handler, this), true));

                // establish two-way data binding between widget options and a view model (parent scope)
                $.each(this.markup.bindings, (_, binding) => {
                    // listen to changes in the view model
                    parentScope.$watch(
                        binding.expression,
                        (value) => this.setOption(binding.path, value),
                        true);

                    // listen to changes in the widget options
                    var meta = this.wijMetadata.properties[binding.path];
                    if (meta && meta.changeEvent) {
                        this.bindToWidget(meta.changeEvent, () => {
                            parentScope[binding.expression] = this.widget.option(binding.path);
                            safeApply(parentScope, binding.expression);
                        });
                    }
                });
            }

            setOption(path, value) {
                if (this.widget.option(path) !== value) {
                    this.widget.option(path, value);
                }
            }
        }

        export class wijgrid extends DirectiveBase {
            expectedTemplate = "<table/>";
            parseMarkup(elem) {
                var markup = super.parseMarkup(elem);
                markup.options.data = [];
                return markup;
            }
        }

        export class gcSpread extends DirectiveBase {
            setOption(path, value) {
                if (path === "dataSource") {
                    this.widget.sheets[0].setDataSource(value);
                } else {
                    super.setOption(path, value);
                }
            }
        }

        export function findDirectiveClass(widgetName: string) {
            var metadata: WidgetMetadata = widgetMetadata[widgetName],
                parentMetadata;

            return definitions[widgetName] ||
                   metadata && metadata.inherits && findDirectiveClass(metadata.inherits);
        }
    }

    // define the wijmo module
    var wijModule = angular["module"]('wijmo', []);
    function registerDirective(widgetName: string, clazz, directiveName?: string) {
        var directiveClass = definitions.findDirectiveClass(widgetName) || definitions.DirectiveBase;
        wijModule.directive(directiveName || widgetName.toLowerCase(), function () {
            return new directiveClass(widgetName, clazz);
        });
    }

    var widgetMetadata = {
        "base": {
            events: {
                "create": {},
                "change": {}
            }
        },
        "wijtooltip": {
            "events": {
                "showing": {},
                "shown": {},
                "hiding": {},
                "hidden": {}
            },
            "properties": {
                "group": {},
                "ajaxCallback": {}
            }
        },
        "wijslider": {
            "events": {
                "buttonMouseOver": {},
                "buttonMouseOut": {},
                "buttonMouseDown": {},
                "buttonMouseUp": {},
                "buttonClick": {},
                "start": {},
                "stop": {}
            },
            "properties": {
                "value": { changeEvent: "change" },
                "values": {}
            }
        },
        "wijsplitter": {
            "events": {
                "sized": {},
                "load": {},
                "sizing": {}
            },
            "properties": {
                "expand": {},
                "collapse": {},
                "expanded": {},
                "collapsed": {}
            }
        },
        "wijprogressbar": {
            "properties": {
                "progressChanging": {},
                "beforeProgressChanging": {},
                "progressChanged": {}
            }
        },
        "wijdialog": {
            "events": {
                "blur": {},
                "buttonCreating": {},
                "resize": {},
                "stateChanged": {},
                "focus": {},
                "resizeStart": {},
                "resizeStop": {}
            },
            "properties": {
                "hide": {},
                "show": {},
                "collapsingAnimation": {},
                "expandingAnimation": {}
            }
        },
        "wijaccordion": {
            "events": {
                "beforeSelectedIndexChanged": {},
                "selectedIndexChanged": {}
            },
            "properties": {
                "duration": {}
            }
        },
        "wijpopup": {
            "events": {
                "showing": {},
                "shown": {},
                "hiding": {},
                "hidden": {},
                "posChanged": {}
            }
        },
        "wijsuperpanel": {
            "events": {
                "dragStop": {},
                "painted": {},
                "scroll": {},
                "scrolling": {},
                "scrolled": {},
                "resized": {}
            },
            "properties": {
                "hScrollerActivating": {},
                "vScrollerActivating": {}
            }
        },
        "wijcheckbox": {
            "properties": {
                "checked": {}
            }
        },
        "wijradio": {
            "properties": {
                "checked": {}
            }
        },
        "wijlist": {
            "events": {
                "focusing": {},
                "focus": {},
                "blur": {},
                "selected": {},
                "listRendered": {},
                "itemRendering": {},
                "itemRendered": {}
            },
            "properties": {
                "superPanelOptions": {}
            }
        },
        "wijcalendar": {
            "events": {
                "beforeSlide": {},
                "beforeSelect": {},
                "selectedDatesChanged": {},
                "afterSelect": {},
                "afterSlide": {}
            },
            "properties": {
                "customizeDate": {},
                "title": {},
                selectedDates: {
                    type: "array",
                    elementType: "date",
                    changeEvent: "selecteddateschanged"
                }
            }
        },
        "wijexpander": {
            "events": {
                "beforeCollapse": {},
                "afterCollapse": {},
                "beforeExpand": {},
                "afterExpand": {}
            }
        },
        "wijmenu": {
            "events": {
                "focus": {},
                "blur": {},
                "select": {},
                "showing": {},
                "shown": {},
                "hidding": {},
                "hidden": {}
            },
            "properties": {
                "superPanelOptions": {}
            }
        },
        "wijmenuitem": {
            "events": {
                "hidding": {},
                "hidden": {},
                "showing": {},
                "shown": {}
            }
        },
        "wijtabs": {
            "properties": {
                "ajaxOptions": {},
                "cookie": {},
                "hideOption": {},
                "showOption": {},
                "add": {},
                "remove": {},
                "select": {},
                "beforeShow": {},
                "show": {},
                "load": {},
                "disable": {},
                "enable": {}
            }
        },
        "wijpager": {
            "events": {
                "pageIndexChanging": {},
                "pageIndexChanged": {}
            }
        },
        "wijcombobox": {
            "events": {
                "select": {},
                "search": {},
                "open": {},
                "close": {}
            },
            "properties": {
                "data": {},
                "labelText": {},
                "showingAnimation": {},
                "hidingAnimation": {},
                "selectedValue": {},
                "text": {},
                "listOptions": {}
            }
        },
        "wijinputcore": {
            "events": {
                "initializing": {},
                "initialized": {},
                "triggerMouseDown": {},
                "triggerMouseUp": {},
                "initialized": {},
                "textChanged": {},
                "invalidInput": {}
            }
        },
        "wijinputdate": {
            inherits: "wijinputcore",
            "events": {
                "dateChanged": {}
            },
            "properties": {
                "date": {},
                "minDate": {},
                "maxDate": {}
            }
        },
        "wijinputmask": {
            inherits: "wijinputcore",
            "properties": {
                "text": { type: "string" }
            }
        },
        "wijinputnumber": {
            inherits: "wijinputcore",
            "events": {
                "valueChanged": {},
                "valueBoundsExceeded": {}
            },
            "properties": {
                "value": {}
            }
        },
        "wijgrid": {
            "properties": {
                "columns": {
                    type: "array",
                    elementType: {
                        type: "object",
                        properties: {
                            "dataKey": { type: "string" },
                            "headerText": { type: "string" }
                        }
                    }
                }
            },
            "events": {
                "ajaxError": {},
                "dataLoading": {},
                "dataLoaded": {},
                "loading": {},
                "loaded": {},
                "columnDropping": {},
                "columnDropped": {},
                "columnGrouping": {},
                "columnGrouped": {},
                "columnUngrouping": {},
                "columnUngrouped": {},
                "filtering": {},
                "filtered": {},
                "sorting": {},
                "sorted": {},
                "currentCellChanged": {},
                "pageIndexChanging": {},
                "pageIndexChanged": {},
                "rendering": {},
                "rendered": {},
                "columnResizing": {},
                "columnResized": {},
                "currentCellChanging": {},
                "afterCellEdit": {},
                "afterCellUpdate": {},
                "beforeCellEdit": {},
                "beforeCellUpdate": {},
                "columnDragging": {},
                "columnDragged": {},
                "filterOperatorsListShowing": {},
                "groupAggregate": {},
                "groupText": {},
                "invalidCellValue": {},
                "selectionChanged": {}
            },
        },
        "wijchartcore": {
            "events": {
                "beforeSeriesChange": {},
                "afterSeriesChange": {},
                "seriesChanged": {},
                "beforePaint": {},
                "painted": {},
                "mouseDown": {},
                "mouseUp": {},
                "mouseOver": {},
                "mouseOut": {},
                "mouseMove": {},
                "click": {}
            },
            "properties": {
                "width": { type: "number" },
                "height": { type: "number" }
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
                "hole": {}
            }
        },
        "wijscatterchart": {
            inherits: "wijchartcore"
        },
        "wijbubblechart": {
            inherits: "wijchartcore",
        },
        "wijpiechart": {
            inherits: "wijchartcore",
            "properties": {
                "radius": { type: "number" }
            }
        },
        "wijtree": {
            "events": {
                "nodeBeforeDropped": {},
                "nodeDropped": {},
                "nodeBlur": {},
                "nodeFocus": {},
                "nodeClick": {},
                "nodeCheckChanged": {},
                "nodeCollapsed": {},
                "nodeExpanded": {},
                "nodeDragging": {},
                "nodeDragStarted": {},
                "nodeMouseOver": {},
                "nodeMouseOut": {},
                "nodeTextChanged": {},
                "selectedNodeChanged": {},
                "nodeExpanding": {},
                "nodeCollapsing": {}
            }
        },
        "wijtreenode": {
            "events": {
                "nodeTextChanged": {},
                "nodeDragStarted": {},
                "nodeDragging": {},
                "nodeCheckChanged": {},
                "nodeFocus": {},
                "nodeBlur": {},
                "nodeClick": {},
                "selectedNodeChanged": {},
                "nodeMouseOver": {},
                "nodeMouseOut": {}
            },
        },
        "wijupload": {
            "events": {
                "cancel": {},
                "totalComplete": {},
                "progress": {},
                "complete": {},
                "totalProgress": {},
                "upload": {},
                "totalUpload": {}
            }
        },
        "wijwizard": {
            "events": {
                "show": {},
                "add": {},
                "remove": {},
                "activeIndexChanged": {},
                "validating": {},
                "load": {}
            },
            "properties": {
                "ajaxOptions": {},
                "cookie": {}
            }
        },
        "wijribbon": {
            "events": {
                "click": {}
            }
        },
        "wijeditor": {
            "events": {
                "commandButtonClick": {},
                "textChanged": {}
            },
            "properties": {
                "simpleModeCommands": {},
                "text": {},
                "localization": {}
            }
        },
        "wijrating": {
            "events": {
                "hover": {},
                "rating": {},
                "rated": {},
                "reset": {}
            },
            "properties": {
                "min": {},
                "max": {},
                "animation": {}
            }
        },
        "wijcarousel": {
            "events": {
                "loadCallback": {},
                "itemClick": {},
                "beforeScroll": {},
                "afterScroll": {},
                "create": {}
            }
        },
        "wijgallery": {
            "events": {
                "loadCallback": {},
                "beforeTransition": {},
                "afterTransition": {},
                "create": {}
            }
        },
        "wijgauge": {
            "events": {
                "beforeValueChanged": {},
                "valueChanged": {},
                "painted": {},
                "click": {},
                "create": {}
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
                "show": {},
                "beforeShow": {},
                "beforeClose": {},
                "close": {},
                "open": {}
            },
            "properties": {
                "cookie": {}
            }
        },
        "wijdatepager": {
            "events": {
                "selectedDateChanged": {}
            },
            "properties": {
                "localization": {}
            }
        },
        "wijevcal": {
            "events": {
                "viewTypeChanged": {},
                "selectedDatesChanged": {},
                "initialized": {},
                "beforeDeleteCalendar": {},
                "beforeAddCalendar": {},
                "beforeUpdateCalendar": {},
                "beforeAddEvent": {},
                "beforeUpdateEvent": {},
                "beforeDeleteEvent": {},
                "beforeEditEventDialogShow": {},
                "eventsDataChanged": {},
                "calendarsChanged": {}
            },
            "properties": {
                "localization": {},
                "datePagerLocalization": {},
                "colors": {},
                "selectedDate": {},
                "selectedDates": {}
            }
        },

        "gcSpread": {
            properties: {
                dataSource: { type: "array" },
                sheetCount: { type: "number" },
                sheets: {
                    type: "array",
                    elementType: {
                        type: "object",
                        properties: {
                            rowCount: { type: "number" },
                            colCount: { type: "number" },
                            defaultRowCount: { type: "number" },
                            defaultColCount: { type: "number" },
                        }
                    }
                }
            }
        }
    };

    // register directives for all widgets
    $.each($.wijmo, registerDirective);
    $.each($.ui, (name, clazz) => registerDirective(name, clazz, "jqui" + name));
}