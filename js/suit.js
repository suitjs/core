var Suit = {};

(function(window, document, body) {
    "use strict";
    console.log("Suit> Init v1.0.5");
    Suit.assert = function suitAssert(p_value, p_default, p_type) {
        return p_type == null ? p_value == null ? p_default : p_value : typeof p_value == p_type ? p_value : p_default;
    };
    Suit.isNullOrEmpty = function suitIsNullOrEmpty(p_string) {
        if (p_string == "") return true;
        if (p_string == null) return true;
        return false;
    };
    var owl = null;
    window.addEventListener("load", owl = function onSuitWindowLoad(e) {
        setTimeout(function delayedComponentEvent() {
            window.dispatchEvent(new Event("component"));
            Suit.controller.dispatch("welcome");
        }, 1);
        window.removeEventListener("load", owl);
    });
    var m_modelDataTraverseCb = function m_modelDataTraverseCb(e, a) {
        var it = e;
        if (Suit.isNullOrEmpty(Suit.view.name(it))) return;
        var hasChildren = true;
        if (it.children.length <= 0) hasChildren = false;
        if (it.nodeName.toLowerCase() == "select") hasChildren = false;
        if (!hasChildren) {
            var path = Suit.view.path(it, a.target);
            var tks = path.split(".");
            var d = a.res;
            var dv = a.value;
            for (var i = 0; i < tks.length; i++) {
                if (i >= tks.length - 1) {
                    if (tks[i] == "") {
                        Suit.model.value(it, dv == null ? dv : a.value);
                        if (dv != null) a.res = a.value;
                    } else {
                        d[tks[i]] = Suit.model.value(it, dv == null ? dv : dv[tks[i]]);
                    }
                } else {
                    if (dv != null) dv = dv[tks[i]];
                    if (d[tks[i]] == null) d[tks[i]] = {};
                    d = d[tks[i]];
                }
            }
        }
    };
    Suit.model = {};
    Suit.model.data = function modelData(p_target, p_value) {
        var t = Suit.view.get(p_target);
        if (t == null) return null;
        var a = {};
        a.res = {};
        a.value = p_value;
        a.target = t;
        Suit.view.traverse(t, m_modelDataTraverseCb, false, a);
        return a.res;
    };
    Suit.model.value = function modelValue(p_target, p_value) {
        var n = Suit.view.get(p_target);
        if (n == null) return null;
        var nn = n.nodeName.toLowerCase();
        var v = p_value;
        switch (nn) {
          case "input":
            {
                var itp = nn == "input" ? n.type == null ? "" : n.type.toLowerCase() : "";
                switch (itp) {
                  case "checkbox":
                    return v == null ? n.checked : n.checked = v;

                  case "radio":
                    return v == null ? n.checked : n.checked = v;

                  case "number":
                    return v == null ? n.valueAsNumber : n.valueAsNumber = v;

                  case "range":
                    return v == null ? n.valueAsNumber : n.valueAsNumber = v;

                  default:
                    return v == null ? n.value : n.value = v;
                }
            }

          case "select":
            {
                if (n.multiple != true) return v == null ? n.selectedIndex : n.selectedIndex = v;
                var ol = Suit.view.query("option", n);
                var res = [];
                for (var i = 0; i < ol.length; i++) if (ol[i].selected == true) res.push(i);
                if (v == null) return res;
                var vl = Array.isArray(v) ? v : [];
                for (var i = 0; i < res.length; i++) {
                    var o = ol[res[i]];
                    if (o != null) o.selected = false;
                }
                for (var i = 0; i < vl.length; i++) {
                    var o = ol[vl[i]];
                    if (o != null) o.selected = true;
                }
                return res;
            }

          case "textarea":
            return v == null ? n.value : n.value = v;
        }
        return v == null ? n.textContent : n.textContent = v;
    };
    var m_viewGetTraverseCb = function m_viewGetTraverseCb(e, a) {
        if (a.name == Suit.view.name(e)) {
            a.found = true;
            a.it = e;
            return false;
        }
        return true;
    };
    Suit.view = {};
    Suit.view.nameAttrib = "n";
    Suit.view.name = function viewName(p_target, p_value) {
        var na = this.nameAttrib;
        var t = this.get(p_target);
        if (t == null) return "";
        if (p_value == null) return Suit.assert(t.getAttribute(na), "");
        t.setAttribute(na, p_value = Suit.assert(p_value, ""));
        return p_value;
    };
    Suit.view.get = function viewGet(p_target, p_root) {
        if (typeof p_target != "string") return p_target;
        var l = p_target.split(".");
        if (l.length <= 0) return null;
        var a = {};
        a.it = Suit.assert(p_root, body);
        while (l.length > 0) {
            a.name = l.shift();
            a.found = false;
            Suit.view.traverse(a.it, m_viewGetTraverseCb, false, a);
            if (!a.found) return null;
        }
        return a.found ? a.it : null;
    };
    Suit.view.path = function viewPath(p_target, p_root, p_separator) {
        var t = Suit.view.get(p_target);
        var r = Suit.view.get(p_root);
        var sep = Suit.assert(p_separator, ".");
        if (t == null) return "";
        if (r == null) r = body;
        var n = "";
        var res = "";
        while (t != r) {
            n = Suit.view.name(t);
            if (n != "") res = n + (res == "" ? res : sep + res);
            t = t.parentElement;
        }
        return res;
    };
    Suit.view.contains = function viewContains(p_view, p_child) {
        var v = Suit.view.get(p_view);
        if (v == null) return false;
        var c = Suit.view.get(p_child);
        if (c == null) return false;
        return v.contains(c);
    };
    Suit.view.query = function viewQuery(p_query, p_target) {
        var t = Suit.view.get(p_target);
        if (t == null) t = body;
        var res = [];
        var l = t.querySelectorAll(p_query);
        for (var i = 0; i < l.length; i++) res.push(l[i]);
        return res;
    };
    Suit.view.parent = function viewParent(p_target) {
        var t = Suit.view.get(p_target);
        if (t == null) return null;
        while (t != document.body) {
            t = t.parentElement;
            if (!Suit.isNullOrEmpty(Suit.view.name(t))) return t;
        }
        return null;
    };
    Suit.view.traverse = function viewTraverse(p_target, p_callback, p_bfs, p_args) {
        var t = Suit.view.get(p_target);
        var is_bfs = Suit.assert(p_bfs, false);
        if (t == null) return;
        if (is_bfs) {
            var l = [ t ];
            var k = 0;
            while (k < l.length) {
                if (p_callback(l[k], p_args) == false) return;
                for (var i = 0; i < l[k].children.length; i++) {
                    l.push(l[k].children[i]);
                }
                k++;
            }
            return;
        }
        if (p_callback(t, p_args) == false) return;
        for (var i = 0; i < t.children.length; i++) Suit.view.traverse(t.children[i], p_callback, p_bfs, p_args);
    };
    Suit.controller = {};
    Suit.controller.list = [];
    Suit.controller.add = function controllerAdd(p_target, p_view) {
        var t = p_target;
        if (t == null) return null;
        t.allow = Suit.assert(t.allow, [ "click", "change", "input" ]);
        t.enabled = Suit.assert(t.enabled, true);
        Suit.controller.remove(t);
        var v = Suit.assert(Suit.view.get(p_view), document.body);
        t.view = v;
        if (t.handler == null) {
            t.handler = function controllerHandler(e) {
                if (!t.enabled) return;
                var cev = {};
                cev.type = e.type;
                cev.src = e;
                cev.view = e.target instanceof HTMLElement ? Suit.view.path(e.target, v) : "";
                cev.path = cev.view == "" ? e.type : e.type == "" ? cev.view : cev.view + "@" + e.type;
                cev.data = null;
                if (t.on != null) t.on(cev);
            };
        }
        var bb = false;
        var al = Suit.assert(t.allow, []);
        for (var i = 0; i < al.length; i++) {
            bb = false;
            var s = al[i];
            if (s == "focus") bb = true;
            if (s == "blur") bb = true;
            v.addEventListener(s, t.handler, bb);
        }
        Suit.controller.list.push(t);
        return t;
    };
    Suit.controller.remove = function controllerRemove(p_target) {
        var t = p_target;
        if (t == null) return null;
        if (t.handler != null) {
            if (t.view != null) {
                var al = Suit.assert(t.allow, []);
                for (var i = 0; i < al.length; i++) t.view.removeEventListener(al[i], t.handler);
            }
        }
        t.view = null;
        var idx = Suit.controller.list.indexOf(t);
        if (idx < 0) return t;
        Suit.controller.list.splice(idx, 1);
        return t;
    };
    Suit.controller.dispatch = function controllerDispatch(p_path, p_data) {
        var cev = {};
        cev.path = p_path;
        var aidx = p_path.indexOf("@");
        var splt = aidx >= 0 ? p_path.split("@") : [];
        cev.type = aidx >= 0 ? splt.pop() : "";
        cev.view = aidx >= 0 ? splt.shift() : "";
        cev.src = null;
        cev.data = p_data;
        var l = Suit.controller.list;
        for (var i = 0; i < l.length; i++) l[i].on(cev);
    };
    Suit.controller.clear = function controllerClear() {
        var l = Suit.controller.list;
        for (var i = 0; i < l.length; i++) Suit.controller.remove(l[i]);
    };
    Suit.request = {};
    var m_requestGetProgress = function requestGetProgress(p_event, p_scale) {
        return p_event.total <= 0 ? 0 : p_event.loaded / (p_event.total + 5);
    };
    var m_requestCallbackInvoke = function requestCallbackInvoke(p_callback, p_is_string, p_data, p_progress, p_event) {
        if (p_callback == null) return;
        if (p_is_string) {
            var type = "";
            var d = {
                event: p_event,
                progress: p_progress,
                data: p_data
            };
            switch (p_event.type) {
              case "progress":
                type = p_progress < 0 ? "upload" : "progress";
                break;

              case "load":
                type = p_data == null ? "error" : "complete";
                break;

              case "error":
                type = "error";
                break;
            }
            if (type == "upload") d.progress += 1;
            Suit.controller.dispatch(p_callback + "@" + type, d);
            return;
        }
        p_callback(p_data, p_progress, p_event);
    };
    Suit.request.create = function requestCreate(p_method, p_url, p_callback, p_response, p_data, p_headers) {
        var method = Suit.assert(p_method, "get");
        var response = Suit.assert(p_response, "text").toLowerCase();
        var ld = new XMLHttpRequest();
        var isCbStr = typeof p_callback == "string";
        var cb = p_callback;
        var isFirstUpload = true;
        var isFirstProgress = true;
        if (response == "arraybuffer") if (ld.overrideMimeType != null) {
            ld.overrideMimeType("application/octet-stream");
        }
        ld.responseType = response;
        ld.onprogress = function reqProgress(e) {
            if (isFirstProgress) {
                if (p_data != null) {
                    m_requestCallbackInvoke(cb, isCbStr, null, 0, e);
                }
                isFirstProgress = false;
                m_requestCallbackInvoke(cb, isCbStr, null, 1e-6, e);
            }
            var p = m_requestGetProgress(e) * .999;
            m_requestCallbackInvoke(cb, isCbStr, null, p, e);
        };
        ld.upload.onprogress = function reqUploadProgress(e) {
            if (p_data != null) {
                if (isFirstUpload) {
                    isFirstUpload = false;
                    m_requestCallbackInvoke(cb, isCbStr, null, -1, e);
                }
                var p = m_requestGetProgress(e) * .999;
                m_requestCallbackInvoke(cb, isCbStr, null, -(1 - p), e);
            }
        };
        ld.onload = function reqOnLoad(e) {
            m_requestCallbackInvoke(cb, isCbStr, response == "arraybuffer" ? new Uint8Array(ld.response) : ld.response, 1, e);
        };
        ld.onerror = function reqOnError(e) {
            m_requestCallbackInvoke(cb, isCbStr, null, 1, e);
        };
        if (p_headers != null) {
            for (var s in p_headers) ld.setRequestHeader(s, p_headers[s]);
        }
        ld.open(method, p_url, true);
        if (p_data != null) {
            if (p_data instanceof ArrayBuffer) ld.send(p_data); else if (p_data instanceof Blob) ld.send(p_data); else if (p_data instanceof FormData) ld.send(p_data); else if (p_data instanceof HTMLFormElement) ld.send(new FormData(p_data)); else if (typeof p_data == "string") ld.send(p_data); else {
                try {
                    var json = JSON.stringify(p_data, null, null);
                    ld.send(json);
                } catch (err) {
                    var fd = new FormData();
                    for (var s in p_data) fd.append(s, p_data[s]);
                    ld.send(fd);
                }
            }
        } else {
            ld.send();
        }
        return ld;
    };
    Suit.request.get = function requestGet(p_url, p_callback, p_data, p_headers) {
        return Suit.request.create("get", p_url, p_callback, "text", p_data, p_headers);
    };
    Suit.request.post = function requestPost(p_url, p_callback, p_data, p_headers) {
        return Suit.request.create("post", p_url, p_callback, "text", p_data, p_headers);
    };
    Suit.request.binary = {};
    Suit.request.binary.get = function requestBinaryGet(p_url, p_callback, p_data, p_headers) {
        return Suit.request.create("get", p_url, p_callback, "arraybuffer", p_data, p_headers);
    };
    Suit.request.binary.post = function requestBinaryPost(p_url, p_callback, p_data, p_headers) {
        return Suit.request.create("post", p_url, p_callback, "arraybuffer", p_data, p_headers);
    };
    Suit.request.blob = {};
    Suit.request.blob.get = function requestBlobGet(p_url, p_callback, p_data, p_headers) {
        return Suit.request.create("get", p_url, p_callback, "blob", p_data, p_headers);
    };
    Suit.request.blob.post = function requestBlobPost(p_url, p_callback, p_data, p_headers) {
        return Suit.request.create("post", p_url, p_callback, "blob", p_data, p_headers);
    };
    Suit.request.document = {};
    Suit.request.document.get = function requestDocumentGet(p_url, p_callback, p_data, p_headers) {
        return Suit.request.create("get", p_url, p_callback, "document", p_data, p_headers);
    };
    Suit.request.document.post = function requestDocumentPost(p_url, p_callback, p_data, p_headers) {
        return Suit.request.create("post", p_url, p_callback, "document", p_data, p_headers);
    };
    Suit.request.json = {};
    Suit.request.json.get = function requestJsonGet(p_url, p_callback, p_data, p_headers) {
        return Suit.request.create("get", p_url, p_callback, "json", p_data, p_headers);
    };
    Suit.request.json.post = function requestJsonPost(p_url, p_callback, p_data, p_headers) {
        return Suit.request.create("post", p_url, p_callback, "json", p_data, p_headers);
    };
})(window, document, document.body);