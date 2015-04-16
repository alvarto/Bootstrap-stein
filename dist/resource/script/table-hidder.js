$(function() {
    var $decoy_table_wrap = $("#decoy_table_wrap"),
        table = $decoy_table_wrap.data("table");

    table.sortBy("time", function(a, b) {
        return a[0] * 1000 + a[1] * 100 + a[3] * 10 + a[4] -
            (b[0] * 1000 + b[1] * 100 + b[3] * 10 + b[4]);
    });
    $decoy_table_wrap.html(table.toString());

    var colArr = table.colSeq.map(function(elem, index){
    	return index;
    });

    var selected = (function() {
        var popupInject = (function() {
            function strrep(str, obj) {
                return str.replace(/\$\w+\$/gi, function(matchs) {
                    var returns = obj[matchs.replace(/\$/g, "")];
                    return typeof returns === "undefined" ? "" : returns;
                });
            }
            var container = {},
                wrap = document.body.querySelector("#wrap_popup");

            return function(templateName) {
                // cache elem if possible
                if (!(templateName in container)) {
                    container[templateName] = (function() {
                        var template = document.getElementById("template_" + templateName).innerHTML,
                            elem = document.getElementById("popup_" + templateName);
                        if (!elem) {
                            // if the target Element is not found, inject it into the document
                            elem = document.createElement("div");
                            elem.id = "popup_" + templateName;
                            wrap.appendChild(elem);
                        }
                        return function(data) {
                            var data = data || {};
                            elem.innerHTML = strrep(template, data);
                        }
                    })();
                }
                return container[templateName];
            };
        })();

        var datas = {},
            obj = {},
            domRefresh = popupInject("list");

        colArr.forEach(function(elem) {
            datas[elem] = "normal";
        });

        function onRefresh() {
            var hiddenArr = [],
                selectedArr = [];
            colArr.forEach(function(val) {
                if (datas[val] === "hidden") {
                    hiddenArr.push(val);
                } else if (datas[val] === "selected") {
                    selectedArr.push(val);
                }
            });

            var hidItemSelector = "";
            var selectItemSelector = "";
            var rowlistClass = "";

            hiddenArr.forEach(function(elem, index) {
                hidItemSelector += ".col-" + elem;
                if (index !== hiddenArr.length - 1) {
                    hidItemSelector += ",";
                }
            });

            selectedArr.forEach(function(elem, index) {
                selectItemSelector += ".col-" + elem;
                if (index !== selectedArr.length - 1) {
                    selectItemSelector += ",";
                }
            });

            var list = "",
                mode_select = "",
                mode_hide = "";
            if (selectedArr.length === 0) {
                mode_select = "disabled";
            }

            if (hiddenArr.length === 0) {
                mode_hide = "disabled";
            }

            if (selectedArr.length === 0 && hiddenArr.length === 0) {
                rowlistClass = "away";
            }

            var selectedList = "<li class='dropdown-header'>"
            	+ selectedArr.map(
            		function(value){
            			return table.colSeq[value] ;
	            	}
            	).join("</li><li class='dropdown-header'>")
            	+ "</li>" ;
            var hiddenList = "<li class='dropdown-header'>"
	            + hiddenArr.map(
            		function(value){
            			return table.colSeq[value] ;
	            	}
            	).join("</li><li class='dropdown-header'>")
	            + "</li>" ;
            domRefresh({
                list: list,
                mode_has_select: mode_select,
                mode_has_hide: mode_hide,
                hidItemSelector: hidItemSelector,
                selectItemSelector: selectItemSelector,
                selected_num: selectedArr.length,
                hidden_num: hiddenArr.length,
                total_num: colArr.length,
                selectedList: selectedList ,
                hiddenList: hiddenList,
            });
        }

        Object.defineProperty(obj, "datas", {
            get: function() {
                return datas;
            }
        });

        obj.click = function(item) {
            if (datas[item] === "selected") {
                datas[item] = "normal";
            } else if (datas[item] === "normal") {
                datas[item] = "selected";
            }
            onRefresh();
        };
        obj.hideSelected = function() {
            colArr.forEach(function(elem) {
                if (datas[elem] === "selected") {
                    datas[elem] = "hidden";
                }
            });
            onRefresh();
        };
        obj.showSelected = function() {
            colArr.forEach(function(elem) {
                if (datas[elem] === "selected") {
                    datas[elem] = "normal";
                } else {
                    datas[elem] = "hidden";
                }
            });
            onRefresh();
        };
        obj.reset = function() {
            colArr.forEach(function(elem) {
                datas[elem] = "normal";
            });
            onRefresh();
        };

        onRefresh();
        return obj;
    })();

    colArr.forEach(function(elem) {
        $decoy_table_wrap.on("click", ".col-" + elem, function() {
            selected.click(elem);
        });
    });

    $("#wrap_popup")
        .on("click", ".js-hide-selected:not(.disabled)", function() {
            selected.hideSelected();
        })
        .on("click", ".js-show-selected:not(.disabled)", function() {
            selected.showSelected();
        })
        .on("click", ".js-reset-all:not(.disabled)", function() {
            selected.reset();
        });

    $("td").tooltip({
        container: 'body',
        viewport: '#decoy_table_wrap'
    });
});

$("#document_trigger").click(function() {
    $('#document').collapse('show')
});