(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Retool;
(function (Retool) {
    /// <reference path="../../node_modules/grouper/build/index.d.ts" />
    (function (Reporting) {
        Reporting.Iterator;
    })(Retool.Reporting || (Retool.Reporting = {}));
    var Reporting = Retool.Reporting;
})(Retool || (Retool = {}));
var Retool;
(function (Retool) {
    (function (Reporting) {
        (function (Component) {
            var BaseComponent = (function () {
                function BaseComponent() {
                }
                BaseComponent.prototype.render = function (context, node, data) {
                    throw new Error("Not Implemented");
                };

                BaseComponent.prototype.renderChildren = function (context, children, options, data) {
                    if (!options) {
                        options = {};
                    }
                    ;
                    if (children) {
                        for (var i = 0, im = children.length; i < im; i++) {
                            var childNode = children[i];
                            var handler = context.handlers[childNode.kind];
                            handler.render(context, childNode, data);
                        }
                    }
                };

                BaseComponent.prototype.evaluateField = function (context, field, data) {
                    var value;
                    var iterator = context.currentIterator;
                    if (field.indexOf("@totals.") === 0) {
                        value = iterator.getTotal(field.substr(8));
                    } else {
                        value = data[field];
                    }
                    return value;
                };
                return BaseComponent;
            })();
            Component.BaseComponent = BaseComponent;
        })(Reporting.Component || (Reporting.Component = {}));
        var Component = Reporting.Component;
    })(Retool.Reporting || (Retool.Reporting = {}));
    var Reporting = Retool.Reporting;
})(Retool || (Retool = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Retool;
(function (Retool) {
    (function (Reporting) {
        (function (Component) {
            var Each = (function (_super) {
                __extends(Each, _super);
                function Each() {
                    _super.apply(this, arguments);
                }
                Each.prototype.render = function (context, node, data) {
                    var iterator = new Retool.Reporting.Iterator(function (index) {
                        return data[index];
                    }, data.length);

                    context.pushIterator(iterator);

                    var self = this;

                    iterator.forEach(function (index, row) {
                        self.renderChildren(context, node.children, {}, row);
                    });
                };
                return Each;
            })(Retool.Reporting.Component.BaseComponent);
            Component.Each = Each;
        })(Reporting.Component || (Reporting.Component = {}));
        var Component = Reporting.Component;
    })(Retool.Reporting || (Retool.Reporting = {}));
    var Reporting = Retool.Reporting;
})(Retool || (Retool = {}));
var Retool;
(function (Retool) {
    (function (Reporting) {
        (function (Component) {
            var Group = (function (_super) {
                __extends(Group, _super);
                function Group() {
                    _super.apply(this, arguments);
                }
                Group.prototype.render = function (context, node, data) {
                    var iterator = context.currentIterator;

                    var self = this;

                    var section = iterator.getSectionByName(node.name);
                    if (!section) {
                        var sectionOptions = {
                            name: node.name
                        };

                        sectionOptions.header = function (headerRow) {
                            self.resetTotals(iterator, node.totals);
                            iterator.forGroup(function (row) {
                                self.sumTotals(iterator, headerRow, node.totals);
                            });
                            self.renderChildren(context, node.children, {}, headerRow);
                        };

                        sectionOptions.onPageBreak = function (pageBreakRow) {
                            self.renderChildren(context, node.children, {}, pageBreakRow);
                        };

                        sectionOptions.onBeforeFooter = function () {
                        };

                        sectionOptions.onAfterFooter = function () {
                        };

                        if (node.footer) {
                            sectionOptions.footer = function (footerRow) {
                                self.renderChildren(context, node.footer.children, {}, footerRow);
                            };
                        }

                        if (node.field) {
                            sectionOptions.getBreak = function (breakRow) {
                                return breakRow[node.field];
                            };
                        }
                        section = iterator.createSection(sectionOptions);
                    }
                    iterator.checkSection(section);
                };

                Group.prototype.resetTotals = function (iterator, fields) {
                    for (var i = 0, im = fields.length; i < im; i++) {
                        var field = fields[i];
                        iterator.resetTotal(field);
                    }
                };

                Group.prototype.sumTotals = function (iterator, data, fields) {
                    for (var i = 0, im = fields.length; i < im; i++) {
                        var field = fields[i];
                        iterator.incTotal(field, data[field]);
                    }
                };
                return Group;
            })(Retool.Reporting.Component.BaseComponent);
            Component.Group = Group;
        })(Reporting.Component || (Reporting.Component = {}));
        var Component = Reporting.Component;
    })(Retool.Reporting || (Retool.Reporting = {}));
    var Reporting = Retool.Reporting;
})(Retool || (Retool = {}));
var Retool;
(function (Retool) {
    (function (Reporting) {
        (function (Component) {
            var Footer = (function (_super) {
                __extends(Footer, _super);
                function Footer() {
                    _super.apply(this, arguments);
                }
                Footer.prototype.render = function (context, node, data) {
                    var iterator = context.currentIterator;

                    var self = this;

                    var name = node.name;
                    var section;
                    if (name) {
                        section = iterator.getSectionByName(name);
                    } else {
                        section = iterator.currentSection;
                    }

                    if (!section) {
                        throw new Error("footer without section");
                    }

                    section.options.footer = function (footerRow) {
                        self.renderChildren(context, node.children, {}, footerRow);
                    };
                };
                return Footer;
            })(Retool.Reporting.Component.BaseComponent);
            Component.Footer = Footer;
        })(Reporting.Component || (Reporting.Component = {}));
        var Component = Reporting.Component;
    })(Retool.Reporting || (Retool.Reporting = {}));
    var Reporting = Retool.Reporting;
})(Retool || (Retool = {}));
var Retool;
(function (Retool) {
    (function (Reporting) {
        (function (Component) {
            var Div = (function (_super) {
                __extends(Div, _super);
                function Div() {
                    _super.apply(this, arguments);
                    this.isBlock = true;
                }
                Div.prototype.render = function (context, node, data) {
                    var container = context.builder.createContainer(this, node);
                    context.builder.addContainer(container);
                    context.builder.pushContainer(container);

                    var handler = context.handlers["blocktext"];
                    handler.render(context, node, data);

                    this.renderChildren(context, node.children, {}, data);
                    context.builder.popContainer();
                };
                return Div;
            })(Retool.Reporting.Component.BaseComponent);
            Component.Div = Div;
        })(Reporting.Component || (Reporting.Component = {}));
        var Component = Reporting.Component;
    })(Retool.Reporting || (Retool.Reporting = {}));
    var Reporting = Retool.Reporting;
})(Retool || (Retool = {}));
var Retool;
(function (Retool) {
    (function (Reporting) {
        (function (Component) {
            var BlockText = (function (_super) {
                __extends(BlockText, _super);
                function BlockText() {
                    _super.apply(this, arguments);
                    this.isBlock = true;
                }
                BlockText.prototype.render = function (context, node, data) {
                    var value;

                    var container = context.builder.createContainer(this, node);
                    context.builder.pushContainer(container);

                    if (node.field) {
                        value = this.evaluateField(context, node.field, data);
                    } else if (node.text) {
                        value = node.text;
                    }
                    if (node.field || node.text) {
                        container.setText({ text: value });
                    }
                    context.builder.popContainer();
                    context.builder.addContainer(container);
                };
                return BlockText;
            })(Retool.Reporting.Component.BaseComponent);
            Component.BlockText = BlockText;
        })(Reporting.Component || (Reporting.Component = {}));
        var Component = Reporting.Component;
    })(Retool.Reporting || (Retool.Reporting = {}));
    var Reporting = Retool.Reporting;
})(Retool || (Retool = {}));
var Retool;
(function (Retool) {
    (function (Reporting) {
        (function (Component) {
            var Span = (function (_super) {
                __extends(Span, _super);
                function Span() {
                    _super.apply(this, arguments);
                }
                Span.prototype.render = function (context, node, data) {
                    var container = context.builder.createContainer(this, node);
                    context.builder.pushContainer(container);

                    var value;
                    if (node.field) {
                        value = this.evaluateField(context, node.field, data);
                    } else if (node.text) {
                        value = node.text;
                    }
                    if (node.field || node.text) {
                        container.setText({ text: value });
                    }
                    context.builder.popContainer();
                    context.builder.addContainer(container);
                };
                return Span;
            })(Retool.Reporting.Component.BaseComponent);
            Component.Span = Span;
        })(Reporting.Component || (Reporting.Component = {}));
        var Component = Reporting.Component;
    })(Retool.Reporting || (Retool.Reporting = {}));
    var Reporting = Retool.Reporting;
})(Retool || (Retool = {}));
var Retool;
(function (Retool) {
    (function (Reporting) {
        (function (Component) {
            var Table = (function (_super) {
                __extends(Table, _super);
                function Table() {
                    _super.apply(this, arguments);
                    this.isBlock = true;
                }
                Table.prototype.render = function (context, node, data) {
                    var container = context.builder.createContainer(this, node);
                    if (node.ruler) {
                        var columns = node.ruler.split(",");
                        var width = 0;
                        var columnsNumber = [];
                        for (var i = 0, im = columns.length; i < im; i++) {
                            var columnWidth = +columns[i];
                            width += columnWidth;
                            columnsNumber[i] = columnWidth;
                        }
                        var ruler = { width: width, columnIndex: 0, columns: columnsNumber, rowContainer: undefined };
                        container.pushRuler(ruler);
                    }
                    context.builder.addContainer(container);
                    context.builder.pushContainer(container);
                    this.renderChildren(context, node.children, {}, data);
                    context.builder.popContainer();
                };
                return Table;
            })(Retool.Reporting.Component.BaseComponent);
            Component.Table = Table;
        })(Reporting.Component || (Reporting.Component = {}));
        var Component = Reporting.Component;
    })(Retool.Reporting || (Retool.Reporting = {}));
    var Reporting = Retool.Reporting;
})(Retool || (Retool = {}));
var Retool;
(function (Retool) {
    (function (Reporting) {
        (function (Component) {
            var Row = (function (_super) {
                __extends(Row, _super);
                function Row() {
                    _super.apply(this, arguments);
                    this.isBlock = true;
                    this.extendBlocks = true;
                }
                Row.prototype.render = function (context, node, data) {
                    var container = context.builder.createContainer(this, node);
                    var ruler = context.builder.currentContainer.currentRuler;
                    container.pushRuler(ruler);
                    ruler.columnIndex = 0;
                    ruler.rowContainer = container;
                    context.builder.addContainer(container);
                    context.builder.pushContainer(container);
                    this.renderChildren(context, node.children, {}, data);
                    ruler.columnIndex = 0;
                    ruler.rowContainer = null;
                    container.popRuler();
                    context.builder.popContainer();
                };
                return Row;
            })(Retool.Reporting.Component.BaseComponent);
            Component.Row = Row;
        })(Reporting.Component || (Reporting.Component = {}));
        var Component = Reporting.Component;
    })(Retool.Reporting || (Retool.Reporting = {}));
    var Reporting = Retool.Reporting;
})(Retool || (Retool = {}));
var Retool;
(function (Retool) {
    (function (Reporting) {
        (function (Component) {
            var Cell = (function (_super) {
                __extends(Cell, _super);
                function Cell() {
                    _super.apply(this, arguments);
                    this.isBlock = true;
                    this.floated = true;
                }
                Cell.prototype.render = function (context, node, data) {
                    var value;

                    var container = context.builder.createContainer(this, node);
                    container.setColumnWidth(+node.colspan);
                    context.builder.addContainer(container);
                    context.builder.pushContainer(container);
                    var handler = context.handlers["blocktext"];
                    handler.render(context, node, data);
                    this.renderChildren(context, node.children, {}, data);
                    container.currentRuler.columnIndex++;
                    context.builder.popContainer();
                };
                return Cell;
            })(Retool.Reporting.Component.BaseComponent);
            Component.Cell = Cell;
        })(Reporting.Component || (Reporting.Component = {}));
        var Component = Reporting.Component;
    })(Retool.Reporting || (Retool.Reporting = {}));
    var Reporting = Retool.Reporting;
})(Retool || (Retool = {}));
var Retool;
(function (Retool) {
    (function (Reporting) {
        var Color = (function () {
            function Color() {
            }
            Color.getColor = function (colorName) {
                var color;
                switch (colorName.toLowerCase()) {
                    case "ltbrown":
                        color = { r: 238, g: 232, b: 170 };
                        break;
                    default:
                        color = Color.colors[colorName];
                }
                if (!color) {
                    throw new Error(colorName + ' color not supported');
                }
                return color;
            };

            Color.componentToHex = function (c) {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            };

            Color.colorToHex = function (color) {
                return "#" + Color.componentToHex(color.r) + Color.componentToHex(color.g) + Color.componentToHex(color.b);
            };
            Color.colors = {
                "aliceblue": { "r": 240, "g": 248, "b": 255 },
                "antiquewhite": { "r": 250, "g": 235, "b": 215 },
                "aqua": { "r": 0, "g": 255, "b": 255 },
                "aquamarine": { "r": 127, "g": 255, "b": 212 },
                "azure": { "r": 240, "g": 255, "b": 255 },
                "beige": { "r": 245, "g": 245, "b": 220 },
                "bisque": { "r": 255, "g": 228, "b": 196 },
                "black": { "r": 0, "g": 0, "b": 0 },
                "blanchedalmond": { "r": 255, "g": 235, "b": 205 },
                "blue": { "r": 0, "g": 0, "b": 255 },
                "blueviolet": { "r": 138, "g": 43, "b": 226 },
                "brown": { "r": 165, "g": 42, "b": 42 },
                "burlywood": { "r": 222, "g": 184, "b": 135 },
                "cadetblue": { "r": 95, "g": 158, "b": 160 },
                "chartreuse": { "r": 127, "g": 255, "b": 0 },
                "chocolate": { "r": 210, "g": 105, "b": 30 },
                "coral": { "r": 255, "g": 127, "b": 80 },
                "cornflowerblue": { "r": 100, "g": 149, "b": 237 },
                "cornsilk": { "r": 255, "g": 248, "b": 220 },
                "crimson": { "r": 220, "g": 20, "b": 60 },
                "cyan": { "r": 0, "g": 255, "b": 255 },
                "darkblue": { "r": 0, "g": 0, "b": 139 },
                "darkcyan": { "r": 0, "g": 139, "b": 139 },
                "darkgoldenrod": { "r": 184, "g": 134, "b": 11 },
                "darkgray": { "r": 169, "g": 169, "b": 169 },
                "darkgreen": { "r": 0, "g": 100, "b": 0 },
                "darkgrey": { "r": 169, "g": 169, "b": 169 },
                "darkkhaki": { "r": 189, "g": 183, "b": 107 },
                "darkmagenta": { "r": 139, "g": 0, "b": 139 },
                "darkolivegreen": { "r": 85, "g": 107, "b": 47 },
                "darkorange": { "r": 255, "g": 140, "b": 0 },
                "darkorchid": { "r": 153, "g": 50, "b": 204 },
                "darkred": { "r": 139, "g": 0, "b": 0 },
                "darksalmon": { "r": 233, "g": 150, "b": 122 },
                "darkseagreen": { "r": 143, "g": 188, "b": 143 },
                "darkslateblue": { "r": 72, "g": 61, "b": 139 },
                "darkslategray": { "r": 47, "g": 79, "b": 79 },
                "darkslategrey": { "r": 47, "g": 79, "b": 79 },
                "darkturquoise": { "r": 0, "g": 206, "b": 209 },
                "darkviolet": { "r": 148, "g": 0, "b": 211 },
                "deeppink": { "r": 255, "g": 20, "b": 147 },
                "deepskyblue": { "r": 0, "g": 191, "b": 255 },
                "dimgray": { "r": 105, "g": 105, "b": 105 },
                "dimgrey": { "r": 105, "g": 105, "b": 105 },
                "dodgerblue": { "r": 30, "g": 144, "b": 255 },
                "firebrick": { "r": 178, "g": 34, "b": 34 },
                "floralwhite": { "r": 255, "g": 250, "b": 240 },
                "forestgreen": { "r": 34, "g": 139, "b": 34 },
                "fuchsia": { "r": 255, "g": 0, "b": 255 },
                "gainsboro": { "r": 220, "g": 220, "b": 220 },
                "ghostwhite": { "r": 248, "g": 248, "b": 255 },
                "gold": { "r": 255, "g": 215, "b": 0 },
                "goldenrod": { "r": 218, "g": 165, "b": 32 },
                "gray": { "r": 128, "g": 128, "b": 128 },
                "grey": { "r": 128, "g": 128, "b": 128 },
                "green": { "r": 0, "g": 128, "b": 0 },
                "greenyellow": { "r": 173, "g": 255, "b": 47 },
                "honeydew": { "r": 240, "g": 255, "b": 240 },
                "hotpink": { "r": 255, "g": 105, "b": 180 },
                "indianred": { "r": 205, "g": 92, "b": 92 },
                "indigo": { "r": 75, "g": 0, "b": 130 },
                "ivory": { "r": 255, "g": 255, "b": 240 },
                "khaki": { "r": 240, "g": 230, "b": 140 },
                "lavender": { "r": 230, "g": 230, "b": 250 },
                "lavenderblush": { "r": 255, "g": 240, "b": 245 },
                "lawngreen": { "r": 124, "g": 252, "b": 0 },
                "lemonchiffon": { "r": 255, "g": 250, "b": 205 },
                "lightblue": { "r": 173, "g": 216, "b": 230 },
                "lightcoral": { "r": 240, "g": 128, "b": 128 },
                "lightcyan": { "r": 224, "g": 255, "b": 255 },
                "lightgoldenrodyellow": { "r": 250, "g": 250, "b": 210 },
                "lightgray": { "r": 211, "g": 211, "b": 211 },
                "lightgreen": { "r": 144, "g": 238, "b": 144 },
                "lightgrey": { "r": 211, "g": 211, "b": 211 },
                "lightpink": { "r": 255, "g": 182, "b": 193 },
                "lightsalmon": { "r": 255, "g": 160, "b": 122 },
                "lightseagreen": { "r": 32, "g": 178, "b": 170 },
                "lightskyblue": { "r": 135, "g": 206, "b": 250 },
                "lightslategray": { "r": 119, "g": 136, "b": 153 },
                "lightslategrey": { "r": 119, "g": 136, "b": 153 },
                "lightsteelblue": { "r": 176, "g": 196, "b": 222 },
                "lightyellow": { "r": 255, "g": 255, "b": 224 },
                "lime": { "r": 0, "g": 255, "b": 0 },
                "limegreen": { "r": 50, "g": 205, "b": 50 },
                "linen": { "r": 250, "g": 240, "b": 230 },
                "magenta": { "r": 255, "g": 0, "b": 255 },
                "maroon": { "r": 128, "g": 0, "b": 0 },
                "mediumaquamarine": { "r": 102, "g": 205, "b": 170 },
                "mediumblue": { "r": 0, "g": 0, "b": 205 },
                "mediumorchid": { "r": 186, "g": 85, "b": 211 },
                "mediumpurple": { "r": 147, "g": 112, "b": 219 },
                "mediumseagreen": { "r": 60, "g": 179, "b": 113 },
                "mediumslateblue": { "r": 123, "g": 104, "b": 238 },
                "mediumspringgreen": { "r": 0, "g": 250, "b": 154 },
                "mediumturquoise": { "r": 72, "g": 209, "b": 204 },
                "mediumvioletred": { "r": 199, "g": 21, "b": 133 },
                "midnightblue": { "r": 25, "g": 25, "b": 112 },
                "mintcream": { "r": 245, "g": 255, "b": 250 },
                "mistyrose": { "r": 255, "g": 228, "b": 225 },
                "moccasin": { "r": 255, "g": 228, "b": 181 },
                "navajowhite": { "r": 255, "g": 222, "b": 173 },
                "navy": { "r": 0, "g": 0, "b": 128 },
                "oldlace": { "r": 253, "g": 245, "b": 230 },
                "olive": { "r": 128, "g": 128, "b": 0 },
                "olivedrab": { "r": 107, "g": 142, "b": 35 },
                "orange": { "r": 255, "g": 165, "b": 0 },
                "orangered": { "r": 255, "g": 69, "b": 0 },
                "orchid": { "r": 218, "g": 112, "b": 214 },
                "palegoldenrod": { "r": 238, "g": 232, "b": 170 },
                "palegreen": { "r": 152, "g": 251, "b": 152 },
                "paleturquoise": { "r": 175, "g": 238, "b": 238 },
                "palevioletred": { "r": 219, "g": 112, "b": 147 },
                "papayawhip": { "r": 255, "g": 239, "b": 213 },
                "peachpuff": { "r": 255, "g": 218, "b": 185 },
                "peru": { "r": 205, "g": 133, "b": 63 },
                "pink": { "r": 255, "g": 192, "b": 203 },
                "plum": { "r": 221, "g": 160, "b": 221 },
                "powderblue": { "r": 176, "g": 224, "b": 230 },
                "purple": { "r": 128, "g": 0, "b": 128 },
                "red": { "r": 255, "g": 0, "b": 0 },
                "rosybrown": { "r": 188, "g": 143, "b": 143 },
                "royalblue": { "r": 65, "g": 105, "b": 225 },
                "saddlebrown": { "r": 139, "g": 69, "b": 19 },
                "salmon": { "r": 250, "g": 128, "b": 114 },
                "sandybrown": { "r": 244, "g": 164, "b": 96 },
                "seagreen": { "r": 46, "g": 139, "b": 87 },
                "seashell": { "r": 255, "g": 245, "b": 238 },
                "sienna": { "r": 160, "g": 82, "b": 45 },
                "silver": { "r": 192, "g": 192, "b": 192 },
                "skyblue": { "r": 135, "g": 206, "b": 235 },
                "slateblue": { "r": 106, "g": 90, "b": 205 },
                "slategray": { "r": 112, "g": 128, "b": 144 },
                "slategrey": { "r": 112, "g": 128, "b": 144 },
                "snow": { "r": 255, "g": 250, "b": 250 },
                "springgreen": { "r": 0, "g": 255, "b": 127 },
                "steelblue": { "r": 70, "g": 130, "b": 180 },
                "tan": { "r": 210, "g": 180, "b": 140 },
                "teal": { "r": 0, "g": 128, "b": 128 },
                "thistle": { "r": 216, "g": 191, "b": 216 },
                "tomato": { "r": 255, "g": 99, "b": 71 },
                "turquoise": { "r": 64, "g": 224, "b": 208 },
                "violet": { "r": 238, "g": 130, "b": 238 },
                "wheat": { "r": 245, "g": 222, "b": 179 },
                "white": { "r": 255, "g": 255, "b": 255 },
                "whitesmoke": { "r": 245, "g": 245, "b": 245 },
                "yellow": { "r": 255, "g": 255, "b": 0 },
                "yellowgreen": { "r": 154, "g": 205, "b": 50 }
            };
            return Color;
        })();
        Reporting.Color = Color;
    })(Retool.Reporting || (Retool.Reporting = {}));
    var Reporting = Retool.Reporting;
})(Retool || (Retool = {}));
var Retool;
(function (Retool) {
    (function (Reporting) {
        var PageSize = (function () {
            function PageSize() {
            }
            PageSize.getWidth = function (pageSize, orientation) {
                return orientation.toLowerCase() === "landscape" ? PageSize.PageSizes[pageSize].height : PageSize.PageSizes[pageSize].width;
            };

            PageSize.getHeight = function (pageSize, orientation) {
                return orientation.toLowerCase() === "landscape" ? PageSize.PageSizes[pageSize].width : PageSize.PageSizes[pageSize].height;
            };
            PageSize.PageSizes = {
                "letter": {
                    width: 8.5,
                    height: 11
                },
                "legal": {
                    width: 8.5,
                    height: 14
                }
            };
            return PageSize;
        })();
        Reporting.PageSize = PageSize;
    })(Retool.Reporting || (Retool.Reporting = {}));
    var Reporting = Retool.Reporting;
})(Retool || (Retool = {}));
var Retool;
(function (Retool) {
    (function (Reporting) {
        var PdfWriter = (function () {
            function PdfWriter() {
                this.disableOutput = false;
                var cursor = new Retool.Reporting.Cursor();
                cursor.x = 0;
                cursor.y = 0;
                this.cursor = cursor;
            }
            PdfWriter.prototype.startBuffering = function (bufferOptions) {
                this.isBuffering = true;
                if (!this.buffer) {
                    this.buffer = {
                        onPageBreak: [],
                        pageNumber: this.pageNumber,
                        fonts: JSON.parse(JSON.stringify(this.fonts)),
                        fontChanges: JSON.parse(JSON.stringify(this.fontChanges)),
                        fontHasChanges: this.fontHasChanges,
                        currFont: JSON.parse(JSON.stringify(this.currFont)),
                        x: this.cursor.x,
                        y: this.cursor.y,
                        commands: [],
                        clearCommands: []
                    };
                }
                if (bufferOptions && bufferOptions.onPageBreak) {
                    this.buffer.onPageBreak.push(bufferOptions.onPageBreak);
                }
            };

            PdfWriter.prototype.clearBuffer = function () {
                this.isBuffering = false;
                for (var i = 0, im = this.buffer.clearCommands.length; i < im; i++) {
                    var clearCommand = this.buffer.clearCommands[i];
                    clearCommand();
                }
                this.buffer = null;
            };

            PdfWriter.prototype.pauseBuffer = function () {
                this.isBuffering = false;
            };

            PdfWriter.prototype.flushBuffer = function () {
                if (this.buffer) {
                    this.isBuffering = false;
                    this.pageNumber = this.buffer.pageNumber;
                    this.fonts = this.buffer.fonts;
                    this.fontChanges = this.buffer.fontChanges;
                    this.fontHasChanges = this.buffer.fontHasChanges;
                    this.currFont = this.buffer.currFont;
                    this.cursor.x = this.buffer.x;
                    this.cursor.y = this.buffer.y;
                    for (var i = 0, im = this.buffer.commands.length; i < im; i++) {
                        var command = this.buffer.commands[i];
                        this[command.command].apply(this, command.args);
                    }
                    this.buffer = null;
                }
            };

            PdfWriter.prototype.initialize = function (documentSize, orientation, stream) {
                this.pageWidth = Retool.Reporting.PageSize.getWidth(documentSize, orientation);
                this.pageHeight = Retool.Reporting.PageSize.getHeight(documentSize, orientation);

                this.stream = stream;
                this.pageNumber = 1;
                this.fonts = [];
                this.fontHasChanges = false;
                this.fontChanges = {};
                this.currFont = { face: undefined, weight: undefined, style: undefined, size: undefined, decoration: undefined, color: undefined };

                this.pdfInitialize(documentSize, orientation);
            };

            PdfWriter.prototype.setCursor = function (x, y) {
                if (this.isBuffering) {
                    this.buffer.commands.push({ command: "setCursor", args: arguments });
                }
                this.cursor.x = x;
                this.cursor.y = y;
            };

            PdfWriter.prototype.addPage = function () {
                this.pageNumber += 1;
                if (this.disableOutput)
                    return;
                if (this.isBuffering) {
                    this.pauseBuffer();
                    if (this.buffer.onPageBreak.length) {
                        for (var i = 0, im = this.buffer.onPageBreak.length; i < im; i++) {
                            var onPageBreak = this.buffer.onPageBreak[i];
                            onPageBreak();
                        }
                    }
                }
                this.pdfAddPage();
            };

            PdfWriter.prototype.copyFont = function () {
                var newFont = {};
                for (var i in this.currFont) {
                    newFont[i] = this.getCurrentFontProperty(i);
                }
                return newFont;
            };

            PdfWriter.prototype.popFont = function () {
                if (this.isBuffering) {
                    this.buffer.commands.push({ command: "popFont" });
                }
                this.fonts.pop();
                this.setFontChanges(this.fonts[this.fonts.length - 1]);
            };

            PdfWriter.prototype.pushFont = function (font) {
                if (font.face === undefined) {
                    throw "Invalid Font";
                }
                if (this.isBuffering) {
                    this.buffer.commands.push({ command: "pushFont", args: arguments });
                }
                var newFont = this.setFontChanges(font);
                this.fonts.push(newFont);
            };

            PdfWriter.prototype.getAccountName = function () {
                return 'SYSTEM ACCOUNT';
            };

            PdfWriter.prototype.getPageNumber = function () {
                return this.pageNumber;
            };

            PdfWriter.prototype.getRunDate = function () {
                var now = new Date();
                var month = now.getMonth() + 1;
                var day = now.getDate();
                return ((month > 9) ? month.toString() : ('0' + month.toString())) + '-' + ((day > 9) ? day.toString() : ('0' + day.toString())) + '-' + now.getFullYear() + ' ' + (now.getHours() > 12 ? (12 - now.getHours()).toString() : now.getHours().toString()) + ':' + (now.getMinutes() > 9 ? now.getMinutes().toString() : '0' + now.getMinutes().toString()) + ' ' + (now.getHours() >= 12 ? 'pm' : 'am');
            };

            PdfWriter.prototype.getLineHeight = function (fontSize) {
                return fontSize / 72 * 1.25;
            };

            PdfWriter.prototype.getFontHeight = function (fontSize) {
                if (fontSize) {
                    return fontSize / 72;
                }
                return this.getFontSize() / 72;
            };

            PdfWriter.prototype.getCurrentFontProperty = function (i) {
                if (this.fontChanges && this.fontChanges[i]) {
                    return this.fontChanges[i];
                }
                return this.currFont[i];
            };

            PdfWriter.prototype.getFontSize = function () {
                return this.getCurrentFontProperty('size');
            };

            PdfWriter.prototype.setFontChanges = function (font) {
                var newFont = this.copyFont();

                for (var i in font) {
                    if (font[i] !== this.getCurrentFontProperty(i)) {
                        this.fontHasChanges = true;
                        this.fontChanges[i] = font[i];
                        newFont[i] = this.fontChanges[i];
                    }
                }
                return newFont;
            };

            PdfWriter.prototype.applyDecoration = function (s, startX, stringWidth) {
                var decoration = this.getCurrentFontProperty("decoration");
                switch (decoration) {
                    case "underline":
                        this.line(startX, this.cursor.y + this.getFontHeight(), startX + stringWidth, this.cursor.y + this.getFontHeight(), 0.01);
                        break;
                    case "double-underline":
                        this.line(startX, this.cursor.y + this.getFontHeight(), startX + stringWidth, this.cursor.y + this.getFontHeight(), 0.01);
                        this.line(startX, this.cursor.y + this.getFontHeight() + 0.02, startX + stringWidth, this.cursor.y + this.getFontHeight() + 0.02, 0.01);
                        break;
                }
            };

            PdfWriter.prototype.text = function (s, options) {
                if (this.fontHasChanges) {
                    this.changeFont();
                }

                var stringWidth = this.getStringWidth(s);

                if (!this.disableOutput) {
                    if (this.isBuffering) {
                        this.buffer.commands.push({ command: "text", args: arguments });
                    } else {
                        this.pdfText(this.cursor.x, this.cursor.y, s, options);
                    }

                    this.applyDecoration(s, this.cursor.x, stringWidth);
                }

                this.setCursor(this.cursor.x + stringWidth, this.cursor.y);
            };

            PdfWriter.prototype.textRight = function (s, width, options) {
                if (this.fontHasChanges) {
                    this.changeFont();
                }

                var stringWidth = this.getStringWidth(s);
                var startX = this.cursor.x + width - stringWidth;

                if (!this.disableOutput) {
                    if (this.isBuffering) {
                        this.buffer.commands.push({ command: "textRight", args: arguments });
                    } else {
                        this.pdfText(startX, this.cursor.y, s, options);
                    }

                    this.applyDecoration(s, startX, stringWidth);
                }

                this.setCursor(startX + stringWidth, this.cursor.y);
            };

            PdfWriter.prototype.textCenter = function (s, width, options) {
                if (this.fontHasChanges) {
                    this.changeFont();
                }

                var stringWidth = this.getStringWidth(s);
                var startX = this.cursor.x + (width / 2) - (stringWidth / 2);

                if (!this.disableOutput) {
                    if (this.isBuffering) {
                        this.buffer.commands.push({ command: "textCenter", args: arguments });
                    } else {
                        this.pdfText(startX, this.cursor.y, s, options);
                    }
                    this.applyDecoration(s, startX, stringWidth);
                }

                this.setCursor(startX + stringWidth, this.cursor.y);
            };

            PdfWriter.prototype.line = function (startX, startY, endX, endY, options) {
                if (this.disableOutput)
                    return;
                if (this.isBuffering) {
                    this.buffer.commands.push({ command: "line", args: arguments });
                } else {
                    this.pdfLine(startX, startY, endX, endY, options || {});
                }
            };

            PdfWriter.prototype.createClippingRegion = function (startX, startY, width, height) {
                if (this.disableOutput)
                    return;
                if (this.isBuffering) {
                    this.buffer.commands.push({ command: "createClippingRegion", args: arguments });
                } else {
                    this.pdfCreateClippingRegion(startX, startY, width, height);
                }
            };

            PdfWriter.prototype.rectangle = function (startX, startY, width, height, fill) {
                if (this.disableOutput)
                    return;
                if (this.isBuffering) {
                    this.buffer.commands.push({ command: "rectangle", args: arguments });
                } else {
                    this.pdfRectangle(startX, startY, width, height, fill);
                }
            };

            PdfWriter.prototype.image = function (src, options) {
                if (this.isBuffering) {
                    this.buffer.commands.push({ command: "image", args: arguments });
                } else {
                    this.pdfImage(src, options);
                }
            };

            PdfWriter.prototype.changeFont = function () {
                this.pdfChangeFont();
            };

            PdfWriter.prototype.getStringWidth = function (s) {
                return this.pdfGetStringWidth(s);
            };

            PdfWriter.prototype.end = function () {
                return this.pdfEnd();
            };

            PdfWriter.prototype.pdfEnd = function () {
                throw ('pdfEnd must be defined in child class');
            };

            PdfWriter.prototype.pdfInitialize = function (documentSize, orientation) {
                throw ('pdfInitialize must be defined in child class');
            };

            PdfWriter.prototype.pdfAddPage = function () {
                throw ('pdfAddPage must be defined in child class');
            };

            PdfWriter.prototype.pdfText = function (x, y, s, options) {
                throw ('pdfText must be defined in child class');
            };

            PdfWriter.prototype.pdfCreateClippingRegion = function (startX, startY, width, height) {
                throw ('pdfCreateClippingRegion must be defined in child class');
            };

            PdfWriter.prototype.pdfRectangle = function (startX, startY, width, height, fill) {
                throw ('pdfText must be defined in child class');
            };

            PdfWriter.prototype.pdfLine = function (startX, startY, endX, endY, options) {
                throw ('pdfLine must be defined in child class');
            };

            PdfWriter.prototype.pdfImage = function (src, options) {
                throw ('pdfImage must be defined in child class');
            };

            PdfWriter.prototype.pdfChangeFont = function () {
                throw ('pdfChangeFont must be defined in child class');
            };

            PdfWriter.prototype.pdfGetStringWidth = function (s) {
                throw ('pdfGetString width must be defined in the child class');
            };

            PdfWriter.prototype.pdfGetDocument = function (callback) {
                throw ('pdfGetDocument must be defined in child class');
            };
            return PdfWriter;
        })();
        Reporting.PdfWriter = PdfWriter;
    })(Retool.Reporting || (Retool.Reporting = {}));
    var Reporting = Retool.Reporting;
})(Retool || (Retool = {}));
var Retool;
(function (Retool) {
    (function (Reporting) {
        var Cursor = (function () {
            function Cursor() {
            }
            Cursor.prototype.copy = function () {
                var cursor = new Cursor();
                cursor.x = this.x;
                cursor.y = this.y;
                return cursor;
            };
            return Cursor;
        })();
        Reporting.Cursor = Cursor;
    })(Retool.Reporting || (Retool.Reporting = {}));
    var Reporting = Retool.Reporting;
})(Retool || (Retool = {}));
var Retool;
(function (Retool) {
    (function (Reporting) {
        var Context = (function () {
            function Context() {
                this.handlers = {};
                this.dataStack = [];
                this.iteratorStack = [];
                this.shared = {};
            }
            Context.prototype.registerHandler = function (kind, handler) {
                this.handlers[kind] = handler;
            };

            Context.prototype.pop = function () {
                this.current = this.dataStack.pop();
            };

            Context.prototype.push = function (o) {
                this.dataStack.push(this.current);
                this.current = o;
            };

            Context.prototype.pushIterator = function (iterator) {
                this.iteratorStack.push(this.currentIterator);
                this.currentIterator = iterator;
            };

            Context.prototype.popIterator = function () {
                this.currentIterator = this.iteratorStack.pop();
            };

            Context.prototype.run = function (definition) {
                for (var i = 0, im = definition.length; i < im; i++) {
                    var node = definition[i];
                    this.processNode(node);
                }
            };

            Context.prototype.processNode = function (node) {
                this.handlers[node.kind].render(this, node, this.current);
            };

            Context.prototype.pageBreak = function () {
                for (var i = 1, im = this.iteratorStack.length; i < im; i++) {
                    this.iteratorStack[i].pageBreak();
                }
                this.currentIterator.pageBreak();
                //this.builder.maybeResumeBuffer(this.currentIterator.currentSection.options.name);
            };

            Context.prototype.share = function (s, o) {
                this.shared[s] = o;
            };
            return Context;
        })();
        Reporting.Context = Context;
    })(Retool.Reporting || (Retool.Reporting = {}));
    var Reporting = Retool.Reporting;
})(Retool || (Retool = {}));
var Retool;
(function (Retool) {
    (function (Reporting) {
        var Container = (function () {
            function Container() {
                this.commands = [];
                this.styleStack = [];
                this.childContainers = [];
                this.rulerStack = [];
                this.defaultStyle = {
                    font: {
                        face: 'helvetica',
                        style: 'normal',
                        weight: 'normal',
                        size: 8,
                        color: 'black',
                        decoration: 'none'
                    }
                };

                this.startCursor = new Retool.Reporting.Cursor();
                this.startCursor.x = 0;
                this.startCursor.y = 0;
                this.cursor = new Retool.Reporting.Cursor();
                this.cursor.x = 0;
                this.cursor.y = 0;
                this.currentStyle = this.copyStyle(this.defaultStyle);
                this.styleStack.push(this.currentStyle);

                this.width = 0;
                this.height = 0;
            }
            Container.prototype.applyCss = function (cssClasses) {
                var style = this.copyStyle(this.currentStyle);

                var floated = false;
                var width = 0;

                for (var i = 0, im = cssClasses.length; i < im; i++) {
                    var cssClass = cssClasses[i];
                    if (cssClass === "grid") {
                        style.border.left = 1;
                        style.border.right = 1;
                        style.border.top = 1;
                        style.border.bottom = 1;
                    } else if (cssClass === "underline") {
                        style.font.decoration = "underline";
                    } else if (cssClass === "double-underline") {
                        style.font.decoration = "double-underline";
                    } else if (cssClass === "italic") {
                        style.font.style = "italic";
                    } else if (cssClass === "bold") {
                        style.font.weight = "bold";
                    } else if (cssClass === "times-roman") {
                        style.font.face = "times";
                    } else if (cssClass === "courier") {
                        style.font.face = "courier";
                    } else if (cssClass === "helvetica") {
                        style.font.face = "helvetica";
                    } else if (cssClass === "float-left") {
                        floated = true;
                    } else if (cssClass === "center") {
                        style.align = "center";
                    } else if (cssClass === "left") {
                        style.align = "left";
                    } else if (cssClass === "right") {
                        style.align = "right";
                    } else if (cssClass === "border-bottom") {
                        style.border.bottom = 1;
                    } else if (cssClass === "border-top") {
                        style.border.top = 1;
                    } else if (cssClass === "border-left") {
                        style.border.left = 1;
                    } else if (cssClass === "border-right") {
                        style.border.right = 1;
                    } else if (cssClass === "border-none") {
                        style.border.left = 0;
                        style.border.right = 0;
                        style.border.top = 0;
                        style.border.bottom = 0;
                    } else {
                        var match = cssClass.match(/span-(\d+)/i);
                        if (match) {
                            if (this.currentRuler.rowContainer) {
                                this.width = this.getRelativeWidth(match[1]);
                            }
                        } else {
                            match = cssClass.match(/font-(\d{1,2})/i);
                            if (match) {
                                style.font.size = +match[1];
                            } else {
                                match = cssClass.match(/color-([a-z]+)/i);
                                if (match) {
                                    style.font.color = match[1];
                                } else {
                                    match = cssClass.match(/background-([a-z]+)/i);
                                    if (match) {
                                        style.background = match[1];
                                    } else {
                                        match = cssClass.match(/border-([left|right|top|bottom])-color-([a-z])/i);
                                        if (match) {
                                            style["border-" + match[1] + "-color"] = match[2];
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (floated || !this.isBlock) {
                    this.floated = true;
                }
                this.currentStyle = style;
                this.commands.push({ command: "background", args: [this.copyStyle(this.currentStyle)] });
                this.commands.push({ command: "borders", args: [this.copyStyle(this.currentStyle)] });
            };

            Container.prototype.addChildContainer = function (container, onHeightOverflow) {
                container.parentContainer = this;
                this.childContainers.push(container);
                if (container.width) {
                    this.addContainer(container, onHeightOverflow);
                }
            };

            Container.prototype.addContainer = function (container, onHeightOverflow) {
                var align = this.currentStyle.align;
                if (this.previousChild && this.previousChild.floated) {
                    container.startCursor.x = this.cursor.x;
                } else {
                    container.startCursor.x = this.startCursor.x;
                }
                container.startCursor.y = this.cursor.y;
                if (container.isBlock) {
                    var width = this.startCursor.x + this.width - this.cursor.x;
                    if (width > container.width) {
                        container.width = width;
                    }
                } else {
                    var width = this.startCursor.x - container.startCursor.x + container.width;
                    if (width < this.width) {
                        this.width = width;
                    }
                }
                var height = container.startCursor.y + container.height - this.startCursor.y;
                if (height < this.height) {
                    this.height = height;
                }
                if (!container.floated) {
                    this.cursor.y = container.startCursor.y + container.height;
                    this.cursor.x = this.startCursor.x;
                } else {
                    this.cursor.y = this.startCursor.y + this.height;
                    this.cursor.x = container.startCursor.x + container.width;
                }
                this.previousChild = container;
                //this.rootContainer.reflow();
            };

            Container.prototype.reflow = function () {
                var previousFloated = false;
                this.cursor.x = this.startCursor.x;
                this.cursor.y = this.startCursor.y;
                for (var i = 0, im = this.childContainers.length; i < im; i++) {
                    var childContainer = this.childContainers[i];
                    if (!previousFloated) {
                        childContainer.startCursor.x = this.startCursor.x;
                    } else {
                        childContainer.startCursor.x = this.cursor.x;
                    }
                    childContainer.startCursor.y = this.cursor.y;
                    if (childContainer.isBlock) {
                        var width = this.startCursor.x + this.width - this.cursor.x;
                        if (width > childContainer.width) {
                            childContainer.width = width;
                        }
                    } else {
                        var width = this.startCursor.x - childContainer.startCursor.x + childContainer.width;
                        if (width < this.width) {
                            this.width = width;
                        }
                    }
                    var height = childContainer.startCursor.y + childContainer.height - this.startCursor.y;
                    if (height < this.height) {
                        this.height = height;
                    }
                    if (!childContainer.floated) {
                        this.cursor.y = childContainer.startCursor.y + childContainer.height;
                        this.cursor.x = this.startCursor.x;
                    } else {
                        this.cursor.y = this.startCursor.y + this.height;
                        this.cursor.x = childContainer.startCursor.x + childContainer.width;
                    }
                    childContainer.reflow();
                    previousFloated = childContainer.floated;
                }
            };

            Container.prototype.flushCommands = function () {
                for (var i = 0, im = this.commands.length; i < im; i++) {
                    var command = this.commands[i];
                    if (command.command === "borders") {
                        this.drawBorders.apply(this, command.args);
                    } else if (command.command === "background") {
                        this.drawBackground.apply(this, command.args);
                    } else if (command.command === "text") {
                        var x = this.startCursor.x;
                        if (x > 7) {
                            x = 7;
                        }
                        this.writer.setCursor(x, this.startCursor.y);
                        this.writer.pushFont(command.args.style.font);
                        this.writer.text(command.args.text);
                        this.writer.popFont();
                        this.width = 0;
                        this.height = 0;
                    }
                }
                this.commands = [];
                for (var i = 0, im = this.childContainers.length; i < im; i++) {
                    var container = this.childContainers[i];
                    container.flushCommands();
                }
            };

            Container.prototype.setText = function (textOptions) {
                //this.currentContainer.pushStyle(textOptions.style);
                var text = textOptions.text;
                if (text === undefined) {
                    text = "undefined";
                }
                this.writer.pushFont(this.currentStyle.font);
                this.height = this.writer.getLineHeight(this.writer.getFontSize());
                this.width = this.writer.getStringWidth(text);

                this.text(text);

                this.writer.popFont();
            };

            Container.prototype.drawBorders = function (style) {
                var options;
                if (style.border) {
                    if (style.border.left) {
                        options = style["border-left-color"] ? { color: style["border-left-color"] } : {};
                        this.writer.line(this.startCursor.x, this.startCursor.y, this.startCursor.x, this.startCursor.y + this.height, options);
                    }
                    if (style.border.right) {
                        options = style["border-right-color"] ? { color: style["border-right-color"] } : {};
                        this.writer.line(this.startCursor.x + this.width, this.startCursor.y, this.startCursor.x + this.width, this.startCursor.y + this.height, options);
                    }
                    if (style.border.top) {
                        options = style["border-top-color"] ? { color: style["border-top-color"] } : {};
                        this.writer.line(this.startCursor.x, this.startCursor.y, this.startCursor.x + this.width, this.startCursor.y, options);
                    }
                    if (style.border.bottom) {
                        options = style["border-bottom-color"] ? { color: style["border-bottom-color"] } : {};
                        this.writer.line(this.startCursor.x, this.startCursor.y + this.height, this.startCursor.x + this.width, this.startCursor.y + this.height, options);
                    }
                }
            };

            Container.prototype.drawBackground = function (style) {
                if (style.background) {
                    this.writer.rectangle(this.startCursor.x, this.startCursor.y, this.width, this.height, style.background);
                }
            };

            Container.prototype.text = function (text) {
                this.commands.push({
                    command: "text", args: {
                        text: text,
                        style: this.copyStyle(this.currentStyle)
                    } });
            };

            Container.prototype.pushRuler = function (ruler) {
                this.rulerStack.push(this.currentRuler);
                this.currentRuler = ruler;
            };

            Container.prototype.popRuler = function () {
                this.currentRuler = this.rulerStack.pop();
            };

            Container.prototype.setColumnWidth = function (colspan) {
                var index = this.currentRuler.columnIndex;
                var width = 0;
                for (var i = 0, im = (colspan || 1); i < im; i++) {
                    width += this.getRelativeWidth(this.getColumnWidth(index));
                    index++;
                }
                this.width = width;
            };

            Container.prototype.getRelativeWidth = function (weight) {
                if (this.currentRuler.rowContainer) {
                    return this.currentRuler.rowContainer.width * (+weight / this.currentRuler.width);
                }
                return this.currentRuler.width;
            };

            Container.prototype.getColumnWidth = function (index) {
                return this.currentRuler.columns[this.currentRuler.columnIndex];
            };

            Container.prototype.pushStyle = function (style) {
                this.styleStack.push(this.currentStyle);
                var newStyle = this.copyStyle(this.currentStyle);
                if (style) {
                    this.mergeStyle(newStyle, style);
                }
                this.currentStyle = newStyle;
            };

            Container.prototype.popStyle = function () {
                this.currentStyle = this.styleStack.pop();
            };

            Container.prototype.copyStyle = function (style) {
                var newStyle = { font: {}, padding: {}, border: {} };
                return this.mergeStyle(newStyle, style);
            };

            Container.prototype.mergeStyle = function (baseStyle, newStyle) {
                var i, p;
                if (newStyle.font) {
                    var fontProperties = ["face", "weight", "style", "size", "decoration", "color"];
                    for (i in fontProperties) {
                        p = fontProperties[i];
                        if (newStyle.font[p] !== undefined) {
                            baseStyle.font[p] = newStyle.font[p];
                        }
                    }
                }
                if (newStyle.padding) {
                    var paddingProperties = ["left", "right", "top", "bottom"];
                    for (i in paddingProperties) {
                        p = paddingProperties[i];
                        if (newStyle.padding[p] !== undefined) {
                            baseStyle.padding[p] = newStyle.padding[p];
                        }
                    }
                }
                if (newStyle.border) {
                    var borderProperties = ["left", "right", "top", "bottom"];
                    for (i in borderProperties) {
                        p = borderProperties[i];
                        if (newStyle.border[p] !== undefined) {
                            baseStyle.border[p] = newStyle.border[p];
                        }
                    }
                }
                var styleProperties = [
                    "align", "format", "background",
                    "border-left-color", "border-right-color", "border-top-color", "border-bottom-color"];
                for (i in styleProperties) {
                    p = styleProperties[i];
                    if (newStyle[p] !== undefined) {
                        baseStyle[p] = newStyle[p];
                    }
                }
                return baseStyle;
            };
            return Container;
        })();
        Reporting.Container = Container;
    })(Retool.Reporting || (Retool.Reporting = {}));
    var Reporting = Retool.Reporting;
})(Retool || (Retool = {}));
var Retool;
(function (Retool) {
    (function (Reporting) {
        var Builder = (function () {
            function Builder() {
                this.containerStack = [];
                this.repeatStack = [];
            }
            Builder.prototype.initialize = function () {
                this.pushContainer(this.pageContainer());
            };

            Builder.prototype.pageContainer = function () {
                var container = new Retool.Reporting.Container();
                container.currentRuler = {
                    width: 100,
                    columnIndex: 0,
                    columns: [100],
                    rowContainer: undefined
                };
                container.writer = this.writer;
                container.width = 7.5;
                container.maxHeight = 10;
                container.startCursor.x = 0.5;
                container.startCursor.y = 0.5;
                container.cursor.x = 0.5;
                container.cursor.y = 0.5;
                container.rootContainer = container;
                return container;
            };

            Builder.prototype.pushContainer = function (container) {
                this.containerStack.push(container);
                this.currentContainer = container;
            };

            Builder.prototype.addContainer = function (container) {
                var self = this;

                var onHeightOverflow = function (parentContainer, childContainer) {
                    self.newPage();
                    self.addContainer(container);
                };
                this.currentContainer.addChildContainer(container, onHeightOverflow);
            };

            Builder.prototype.popContainer = function () {
                this.containerStack.pop();
                this.currentContainer = this.containerStack[this.containerStack.length - 1];
            };

            Builder.prototype.createContainer = function (handler, node) {
                var cssClasses = (node.cssClass || "").split(" ");
                var container = new Retool.Reporting.Container();
                container.currentRuler = this.currentContainer.currentRuler;
                if (this.currentContainer.maxHeight) {
                    container.maxY = this.currentContainer.startCursor.y + this.currentContainer.maxHeight;
                }
                container.startCursor = this.currentContainer.cursor.copy();
                container.cursor = this.currentContainer.cursor.copy();
                container.writer = this.writer;
                container.rootContainer = this.currentContainer.rootContainer;
                container.floated = handler.floated;
                container.isBlock = handler.isBlock;
                container.extendBlocks = handler.extendBlocks;
                container.currentStyle = this.currentContainer.copyStyle(this.currentContainer.currentStyle);
                container.applyCss(cssClasses);
                return container;
            };

            Builder.prototype.addRepeater = function (repeaterParams) {
                this.repeatStack.push({
                    fn: repeaterParams.fn
                });
            };

            Builder.prototype.flushContainerCommands = function (container) {
                container.flushCommands();
                for (var i = 0, im = container.childContainers; i < im; i++) {
                    var childContainer = container.childContainers[i];
                    if (childContainer.startCursor.y + childContainer.height > childContainer.maxY) {
                        return;
                    }
                    this.flushContainerCommands(childContainer);
                }
            };

            Builder.prototype.newPage = function () {
                console.log("newpage");
                var pageContainer = this.containerStack[0];
                this.flushContainerCommands(pageContainer);
                this.writer.addPage();
                debugger;
                pageContainer.height = 0;
                pageContainer.width = 0;
                pageContainer.reflow();
                this.pushContainer(pageContainer);
                for (var i = 0, im = this.repeatStack.length; i < im; i++) {
                    var repeatItem = this.repeatStack[i];
                    repeatItem.fn();
                }
                this.popContainer();
                /*
                for(var i = 1, im = this.containerStack.length; i < im; i++) {
                var container = this.containerStack[i];
                container.cursor.y = pageContainer.cursor.y;
                container.height = 0;
                }
                */
            };

            Builder.prototype.end = function () {
                this.flushContainerCommands(this.containerStack[0]);
                this.writer.end();
            };
            return Builder;
        })();
        Reporting.Builder = Builder;
    })(Retool.Reporting || (Retool.Reporting = {}));
    var Reporting = Retool.Reporting;
})(Retool || (Retool = {}));
if (typeof module !== "undefined") {
    module.exports = Retool.Reporting;
}

},{}],2:[function(require,module,exports){
var Reporting = require('../../../../build/retool-reporting.js');

var screenWidth = $(window).width();
var screenHeight = $(window).height();

$('.container-add').on('click', function () {
    console.log($(this).attr('data-node-type'));
});

var aspectRatio = 8.5 / 11;

var height = screenHeight * 0.8;
var width = height * aspectRatio;

var canvas = document.createElement("canvas");

canvas.width = width;
canvas.height = height;

$('#container').append(canvas);

var context = canvas.getContext("2d");
context.textBaseline = "top";

var scale = 72;

var margin = 0.5 * scale;

context.rect(margin, margin, width - (margin * 2), height - (margin * 2));
context.stroke();

context.font = '14px Verdana';
context.fillText("Test", margin, margin);

context.scale(72, 72);

},{"../../../../build/retool-reporting.js":1}]},{},[2])