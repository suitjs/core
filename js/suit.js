/**
Class that implements the Suit's core framework features.
//*/
var Suit = 
window.Suit =
(function(window,document,body) {

"use strict"; 	

console.log("Suit> Init v1.0.0");

/**
Checks the validity of a value or if it matches the specified type then returns itself or a default value.
//*/
var m_suitAssert = function suitAssert(p_value,p_default,p_type) { return p_type==null ? (p_value==null ? p_default : p_value) : ((typeof(p_value)==p_type) ? p_value : p_default); };

/**
Checks if a given string is either null or empty.
//*/
var m_suitIsNullOrEmpty = function suitIsNullOrEmpty(p_str) { if(p_str=="") return true; if(p_str==null) return true; return false; };

var owl = null;
//Init SuitJS
window.addEventListener("load",
owl = function onSuitWindowLoad(e)
{		
	setTimeout(function delayedComponentEvent() { window.dispatchEvent(new Event("component"));	}, 1);
	window.removeEventListener("load",owl);
});

/*
==================================================
=================== Suit Model ===================
==================================================
Class that implements the Model functionalities.
*/

/**
Internal callback for 'data' method traversing.
//*/
var m_modelDataTraverseCb =
function m_modelDataTraverseCb(e,a) {

	var it = e;
	if (Suit.isNullOrEmpty(Suit.view.name(it))) return;
	
	var hasChildren = true;
	if (it.children.length <= 0) 				hasChildren = false;
	if (it.nodeName.toLowerCase() == "select")  hasChildren = false;

	if (!hasChildren)	{					

		var path = Suit.view.path(it, a.target);
		var tks  = path.split(".");
		var d  = a.res;
		var dv = a.value;

		for (var i=0;i<tks.length;i++) {

			if (i >= (tks.length - 1)) {						

				if(tks[i]=="") {

					Suit.model.value(it,dv==null ? dv : a.value);
					if(dv!=null) a.res = a.value;

				}
				else {

					d[tks[i]] = Suit.model.value(it,dv==null ? dv : dv[tks[i]]);

				}
			}
			else {

				if (dv != null) dv = dv[tks[i]];						
				if (d[tks[i]] == null) d[tks[i]] = {};
				d = d[tks[i]];

			}
		}
	}				
};

/**
Utility function to avoid new 'function' instances while searching.
//*/
var m_modelGetTraverseCb =
function m_modelGetTraverseCb(e,a) {	

	if (a.name == Suit.view.name(e)) {

		a.found  = true;
		a.it 	 = e;
		return false;
	}
	return true;			
};

/**
Get/Set a View's data in object format.
//*/
var m_modelData = 
function modelData(p_target,p_value) {

	var t = Suit.view.get(p_target);
	if(t==null) return null;
	var a    = {};
	a.res    = {};
	a.value  = p_value;
	a.target = t;
	Suit.view.traverse(t,m_modelDataTraverseCb,false,a);
	return a.res;
};

/**
Get/Set the correct 'value' of a given element.
//*/
var m_modelValue =
function modelValue(p_target,p_value) {

	var n  = Suit.view.get(p_target);
	if(n==null) return null;

	var nn = n.nodeName.toLowerCase();	
	var v  = p_value;

	switch(nn) {

		case "input": {

			var itp = nn=="input" ? (n.type==null ? "" : n.type.toLowerCase()) : "";
			switch(itp)	{

				case "checkbox": return v == null ? n.checked : (n.checked = v);     
				case "radio":    return v == null ? n.checked : (n.checked = v);
				case "number":   return v == null ? n.valueAsNumber  : (n.valueAsNumber  = v); 	 
				case "range":    return v == null ? n.valueAsNumber  : (n.valueAsNumber  = v); 	 					
				default: 		 return v == null ? n.value  : (n.value = v); 	 

			}							

		}			
		break;	

		case "select": {		
			
			//single
			if(n.multiple!=true) return v==null ? n.selectedIndex 	: (n.selectedIndex = v);

			//multiple
			var ol  = Suit.view.query("option",n);
			var res = [];					
			
			for(var i=0;i<ol.length;i++) if(ol[i].selected==true) res.push(i);

			if(v==null) return res;

			var vl  = Array.isArray(v) ? v : [];

			for(var i=0;i<res.length;i++) { var o = ol[res[i]]; if(o!=null)o.selected = false }
			for(var i=0;i<vl.length;i++)  { var o = ol[vl[i]];  if(o!=null)o.selected = true  }

			return res;
		}
		break;

		case "textarea": return v==null ? n.value 			: (n.value=v); 	 	   break;

		default: 		 return v==null ? n.textContent 	: (n.textContent=v);   break;
	}	

	return "";

};

/*
=================================================
=================== Suit View ===================
=================================================
Class that implements the View functionalities.
*/

/**
Variable that defines the naming style of the views.
//*/
var m_viewNameAttrib = "n";

/**
Get/Set the name attribute of a HTML View.
//*/
var m_viewName =
function viewName(p_target,p_value) {

	var na = this.nameAttrib;
	var t  = this.get(p_target);
	
	if(t==null) return "";

	//get
	if (p_value == null) return Suit.assert(t.getAttribute(na),"");			

	//set							
	t.setAttribute(na,p_value = Suit.assert(p_value,""));

	return p_value;			
};

/**
Searches for the target by its path's string or returns itself if DOM element.
//*/
var m_viewGet =
function viewGet(p_target,p_root) {

	if(typeof(p_target)!="string") return p_target;

	var l = p_target.split(".");

	if (l.length <= 0) return null;

	var a = {};

	a.it = Suit.assert(p_root,body);

	while (l.length > 0) {				

		a.name  = l.shift();
		a.found = false;				
		Suit.view.traverse(a.it,m_modelGetTraverseCb,false,a);
		if(!a.found) return null;				

	}

	return a.found ? a.it : null;
};

/**
Returns the 'separator' separated path of target relative to 'root' parameter. In case of mismatched arguments it returns an empty string.
//*/
var m_viewPath =
function viewPath(p_target,p_root,p_separator) {

	var t 	= Suit.view.get(p_target);
	var r 	= Suit.view.get(p_root);
	var sep = Suit.assert(p_separator,".");

	if(t==null) return "";

	if(r==null) r = body;

	var n   = "";
	var res = "";		

	while (t != r) {

		n = Suit.view.name(t);
		if (n != "") res = n + (res=="" ? res : (sep + res));
		t = t.parentElement;

	}		
	return res;
};

/**
Returns a flag indicating if a given view contains another view.
//*/
var m_viewContains =
function viewContains(p_view,p_child) {

	var v = Suit.view.get(p_view);
	if(v==null) return false;
	var c = Suit.view.get(p_child);
	if(c==null) return false;
	return v.contains(c);

};

/**
Executes a querySelectorAll on the target and returns an Array with the results.
//*/
var m_viewQuery =
function viewQuery(p_query,p_target) {

	var t = Suit.view.get(p_target);
	if (t == null) t = body;
	var res = [];
	var l   = t.querySelectorAll(p_query);
	for (var i=0;i<l.length;i++) res.push(l[i]);
	return res;

};

/**
Returns the first parent element which is a Suit's View element.
//*/
var m_viewParent =
function viewParent(p_target) {

	var t = Suit.view.get(p_target);
	if(t==null) return null;

	while (t != document.body) {

		t = t.parentElement;
		if(!Suit.isNullOrEmpty(Suit.view.name(t))) return t;

	}		
	return null;
};

/**
Navigates the DOM hierarchy of the target element and invokes the callback for each element.
If the callback returns false the search stops.
The default mode is DepthFirstSearch (DFS), if the last parameter is 'true' the mode will be BreadthFirstSearch (BFS)
It is possible to pass arguments for the specified callback too.
//*/
var m_viewTraverse =
function viewTraverse(p_target, p_callback, p_bfs,p_args) {

	var t 		= Suit.view.get(p_target);
	var is_bfs 	= Suit.assert(p_bfs,false);

	if(t==null) return;

	if (is_bfs) {

		var l = [t];
		var k = 0;

		while (k < l.length) {

			if (p_callback(l[k],p_args)==false) return;

			for (var i=0; i<l[k].children.length;i++) {

				l.push(l[k].children[i]);

			}

			k++;
		}	

		return;
	}
	
	if (p_callback(t,p_args)==false) return;

	for (var i=0; i<t.children.length;i++) Suit.view.traverse(t.children[i], p_callback,p_bfs,p_args);
};

/*
=======================================================
=================== Suit Controller ===================
=======================================================
Class that implements Controller functionalities.
*/

/**
List of controllers in the pool.
//*/
var m_controllerList = [];

/**
Attaches a controller to the pool.
//*/
var m_controllerAdd =
function controllerAdd(p_target,p_view) {

	var t = p_target;
	if(t==null) return null;

	t.allow   = Suit.assert(t.allow,["click", "change", "input"]);
	t.enabled = Suit.assert(t.enabled,true);
	
	Suit.controller.remove(t);
	
	var v = Suit.assert(Suit.view.get(p_view),document.body);

	t.view  = v;
	
	if (t.handler == null) {

		t.handler = 
		function controllerHandler(e) {

			if (!t.enabled) return;
			var cev     = { };
			cev.type 	= e.type;
			cev.src     = e;
			cev.view    = (e.target instanceof HTMLElement) ? Suit.view.path(e.target,v.parentElement) : "";
			cev.path	= cev.view == "" ? e.type : (e.type=="" ? cev.view : (cev.view + "@" + e.type));
			cev.data    = null;
			if(t.on!=null)t.on(cev);

		};
	}
	
	var bb = false;
	
	var al = Suit.assert(t.allow,[]);

	for(var i=0;i<al.length;i++) {

		bb = false;
		var s = al[i];
		if (s == "focus") bb = true;
		if (s == "blur")  bb = true;			
		v.addEventListener(s, t.handler,bb);

	}

	Suit.controller.list.push(t);
	return t;
};

/**
Removes the controller from the pool.
//*/
var m_controllerRemove=
function controllerRemove(p_target) {

	var t = p_target;
	if(t==null) return null;

	if (t.handler != null) {

		if (t.view != null) {

			var al = Suit.assert(t.allow,[]);
			for(var i=0;i<al.length;i++) t.view.removeEventListener(al[i], t.handler);
		}						
	}
	
	t.view = null;

	var idx = Suit.controller.list.indexOf(t);
	if(idx<0)return t;

	Suit.controller.list.splice(idx,1);

	return t;
};

/**
Dispatches a notification for all enabled controllers in the pool.
The format of the 'path' can be either 'path.to.event' or 'path.to.event@type'
//*/
var m_controllerDispatch =
function controllerDispatch(p_path,p_data) {

	var cev   = {};
	cev.path  = p_path;
	
	var aidx  = p_path.indexOf("@");
	var splt  = aidx >= 0 ? p_path.split("@") : [];
	cev.type  = aidx >= 0 ? splt.pop() : "";
	cev.view  = aidx >= 0 ? splt.shift() : "";			
	cev.src   = null;				
	cev.data  = p_data;
	var l = Suit.controller.list;
	for (var i=0;i<l.length;i++) l[i].on(cev);

};

/**
Removes all controllers from the pool.
//*/
var m_controllerClear =
function controllerClear()
{
	var l = Suit.controller.list;
	for(var i=0;i<l.length;i++) Suit.controller.remove(l[i]);
};

/*
====================================================
=================== Suit Request ===================
====================================================
Class that implements requests utility functions.
*/

/**
Create and execute a XmlHttpRequest and invokes the callback with the needed feedback of the process.
//*/
var m_requestCreate =
function requestCreate(p_method,p_url,p_callback,p_response, p_data,p_headers) {

	var method   = Suit.assert(p_method,"get");
	var response = Suit.assert(p_response,"text").toLowerCase();
	var ld       = new XMLHttpRequest();

	if(response=="arraybuffer") if(ld.overrideMimeType != null) {  ld.overrideMimeType("application/octet-stream");  }			
	
	ld.responseType = response;	

	ld.onprogress = function reqProgress(e) { var p = (e.total <= 0? 0 : e.loaded / (e.total + 5)) * 0.9999; if(p_callback!=null) p_callback(null,p,e); };
	
	ld.upload.onprogress = 
	function reqUploadProgress(e)  {

		if(p_data!=null) { var p = (e.total <= 0? 0 : e.loaded / (e.total + 5)) * 0.9999; if(p_callback!=null) p_callback(null,-(1.0-p),e); }

	};
	
	ld.onload  = function reqOnLoad(e) { if(p_callback!=null) p_callback((response=="arraybuffer") ? new Uint8Array(ld.response) : ld.response,1.0,e); };
	ld.onerror = function reqOnError(e){ if(p_callback!=null) p_callback(null,1.0,e); };
	
	if (p_headers != null) {				

		for (var s in p_headers) ld.setRequestHeader(s,p_headers[s]);
	}
				
	ld.open(method,p_url,true);

	if(p_data != null) {			

		if (p_data instanceof ArrayBuffer) 		ld.send(p_data); else
		if (p_data instanceof Blob) 			ld.send(p_data); else
		if (p_data instanceof FormData)	    	ld.send(p_data); else
		if (p_data instanceof HTMLFormElement)	ld.send(new FormData(p_data)); else
		if (typeof(p_data) == "string")	 		ld.send(p_data); 
		else {

			try {

				//Try to parse the data as json
				var json = JSON.stringify(p_data, null, null);
				ld.send(json);

			}
			catch (err) {

				//If any error handle as a FormData somehow.
				var fd = new FormData();						
				for (var s in p_data) fd.append(s,p_data[s]);
				ld.send(fd);

			}				
		}			
	}
	else {

		ld.send();
	}
	
	return ld;
};

/**
Creates a GET request expecting 'text' response.
//*/
var m_requestGet = function requestGet(p_url,p_callback,p_data,p_headers) { return Suit.request.create("get",p_url,p_callback,"text",p_data,p_headers);	};

/**
Creates a POST request expecting 'text' response.
//*/
var m_requestPost = function requestPost(p_url,p_callback,p_data,p_headers) { return Suit.request.create("post",p_url,p_callback,"text",p_data,p_headers);	};

/**
================ Shortcuts to handle requests with different responses. ================
//*/

//Binary
var m_requestBinaryGet  =   function requestBinaryGet(p_url,p_callback,p_data,p_headers) { return Suit.request.create("get",p_url,p_callback,"arraybuffer",p_data,p_headers);	};
var m_requestBinaryPost =   function requestBinaryPost(p_url,p_callback,p_data,p_headers) { return Suit.request.create("post",p_url,p_callback,"arraybuffer",p_data,p_headers);	};

//Blob
var m_requestBlobGet  =  function requestBlobGet(p_url,p_callback,p_data,p_headers) { return Suit.request.create("get",p_url,p_callback,"blob",p_data,p_headers);	};
var m_requestBlobPost =  function requestBlobPost(p_url,p_callback,p_data,p_headers) { return Suit.request.create("post",p_url,p_callback,"blob",p_data,p_headers);	};

//Document
var m_requestDocumentGet  =  function requestDocumentGet(p_url,p_callback,p_data,p_headers) { return Suit.request.create("get",p_url,p_callback,"document",p_data,p_headers);	};
var m_requestDocumentPost =  function requestDocumentPost(p_url,p_callback,p_data,p_headers) { return Suit.request.create("post",p_url,p_callback,"document",p_data,p_headers);	};

//Json
var m_requestJsonGet  =  function requestJsonGet(p_url,p_callback,p_data,p_headers) { return Suit.request.create("get",p_url,p_callback,"json",p_data,p_headers);	};
var m_requestJsonPost =  function requestJsonPost(p_url,p_callback,p_data,p_headers) { return Suit.request.create("post",p_url,p_callback,"json",p_data,p_headers);	};


return {
	
	model: {

		data:  m_modelData,
		value: m_modelValue,		
	},

	view: {

		nameAttrib: m_viewNameAttrib,
		name: 		m_viewName,
		get: 		m_viewGet,
		path: 		m_viewPath,
		contains:   m_viewContains,
		query: 		m_viewQuery,
		parent:     m_viewParent,
		traverse:   m_viewTraverse,
	},

	controller: {
		
		list:     m_controllerList,
		add:      m_controllerAdd,
		remove:   m_controllerRemove,
		dispatch: m_controllerDispatch,
		clear:    m_controllerClear,
	},

	request: {
		
		create: m_requestCreate,
		get: 	m_requestGet,
		post: 	m_requestPost,		
		
		binary: {			

			get:  m_requestBinaryGet,
			post: m_requestBinaryPost,

		},

		blob: {			

			get:  m_requestBlobGet,
			post: m_requestBlobPost,

		},		

		document: {			

			get:  m_requestDocumentGet,
			post: m_requestDocumentPost,

		},

		json: {			

			get:  m_requestJsonGet,
			post: m_requestJsonPost,

		},

	},

	assert: 		m_suitAssert,	
	isNullOrEmpty:  m_suitIsNullOrEmpty,
	
};




	
})(window,document,window.body);