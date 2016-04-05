/**
 * Class that implements the Suit's core framework features.
 * @class
 * @type Suit
 */
var Suit = {};
(function(window,document,body) {

"use strict"; 	

console.log("Suit> Init v1.1.0");

/**
 * Checks the validity of a value or if it matches the specified type then returns itself or a default value.
 * @param {Object} p_value - Target
 * @param {Object} p_default - Default value
 * @param {?String} p_type - Type of the target to be matched.
 * @return {Object} - If 'target' is null or not of 'type' (when used) returns the 'default' value.
 * @example 
 * var s = null;
 * Suit.assert(s,"default");          //returns 'default'
 * s = "ok";
 * Suit.assert(s,"default");          //returns 'ok'
 * Suit.assert(s,"default","Number"); //returns 'default'
 * Suit.assert(s,"default","String"); //returns 'ok'
 */
Suit.assert =
function suitAssert(p_value,p_default,p_type) { return p_type==null ? (p_value==null ? p_default : p_value) : ((typeof(p_value)==p_type) ? p_value : p_default); };

/** 
 * Checks if a given string is either null or empty.
 * @param {String} p_string - String value.	
 * @return {Boolean} - Flag indicating if the string is null or empty.
 * @example
 * var s = "";
 * Suit.isNullOrEmpty(s); //returns true
 * s = null;
 * Suit.isNullOrEmpty(s); //returns true
 * s = "ok";
 * Suit.isNullOrEmpty(s); //returns false
 */
Suit.isNullOrEmpty =
function suitIsNullOrEmpty(p_string) { if(p_string=="") return true; if(p_string==null) return true; return false; };

var owl = null;
//Init SuitJS
window.addEventListener("load",
owl = function onSuitWindowLoad(e) {		
	setTimeout(function delayedComponentEvent() { window.dispatchEvent(new Event("component")); Suit.controller.dispatch("welcome"); }, 1);
	window.removeEventListener("load",owl);
});

/*
==================================================
=================== Suit Model ===================
==================================================
*/

//Internal callback for 'data' method traversing.
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
* Reference to the container of Model features.
* @class
*/
Suit.model = {};

/**
 * Get/Set a View's data in object format.
 * @param {String|Element} target - Path or reference to the target.
 * @param {?Object} value - Value to set the target or null if the method must only return the value.
 * @return {Object} - Returns the Object formatted data of the Element instance.
 * @example
 * ```html
 * <div n='content'>
 *  <p n='title>Title</p>
 *  <input type='text' n='name' value='John'>  
 * </div>
 * ```
 * //Get
 * Suit.model.data("content");       //returns {title: "Title", name: "John"}
 * Suit.model.data("content.title"); //returns "Title"
 * Suit.model.data("content.name");  //returns "John"
 * 
 * //Set
 * Suit.model.data("content",{title: "New Title", name: "Carl"});  //returns {title: "New Title", name: "Carl"} 
 * ```html
 * <!-- updated dom -->
 * <div n='content'>
 *  <p n='title>New Title</p>
 *  <input type='text' n='name' value='Carl'>  
 * </div>
 * ```
 * @see {@link Suit.view.get }
 */
Suit.model.data = 
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
 * Get/Set the correct 'value' of a primitive Element (i.e. input, select, ...).
 * @param {String} target - Path or reference to the target.
 * @param {?Objet} value  - Value to set the target or null if the method must only return the value.
 * @return {String|Number|Object} - Returns the raw value of the Element.
 * @example
 * ```html
 * <input type='text' value='Text' n='field'>
 * <input type='checkbox' checked='false' n='toggle'>
 * ```
 * //Get
 * Suit.model.value("field");  //returns "Text"
 * Suit.model.value("toggle"); //returns "false"
 * 
 * //Set
 * Suit.model.value("field","New Text");  //returns "New Text"
 * Suit.model.value("toggle",true);        //returns "true"
 * ```html
 * <!-- updated dom -->
 * <input type='text' value='New Text' n='field'>
 * <input type='checkbox' checked='true' n='toggle'>
 * ```
 * @see {@link Suit.view.get }
 */
Suit.model.value = 
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
		

		case "textarea": return v==null ? n.value 			: (n.value=v);

		
	}	

	return v==null ? n.textContent 	: (n.textContent=v);

};

/*
=================================================
=================== Suit View ===================
=================================================
Class that implements the View functionalities.
*/

//Utility function to avoid new 'function' instances while searching.
var m_viewGetTraverseCb =
function m_viewGetTraverseCb(e,a) {	

	if (a.name == Suit.view.name(e)) {

		a.found  = true;
		a.it 	 = e;
		return false;
	}
	return true;			
};

/** 	
* Reference to the container of View features.
* @class	
*/
Suit.view = {};

/**
 * Variable that defines the naming style of the views. Defaults to 'n'.
 * @type {String}	 
 * @example
 * Suit.nameAttrib = "vname";
 * ```html
 * <div vname='view-name'></div>
 * ```    
 */
Suit.view.nameAttrib = "n";

/**
 * Get/Set the name attribute of a HTML View.
 * @param  {String|Element} p_target - View element to be renamed.
 * @param  {String} p_value - Name of the view element.
 * @returns {String} - The view element's name.
 * @example
 * ```html
 * <div n='parent>
 *      <div n='child'></div>
 * </div>
 * ```
 * Suit.view.name("parent.child");              //returns 'child'
 * Suit.view.name("parent.child","new-child");  //returns 'new-child'
 * ```html
 * <!-- updated dom -->
 * <div n='parent>
 *      <div n='new-child'></div>
 * </div>
 * ```
 * @see {@link Suit.view.get }
 */
Suit.view.name =
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
 * Searches for the target by its path's string or returns itself if DOM element.
 * @function
 * @param  {String|Element} p_target - Path to the element or the element itself.
 * @param  {?(String|Element)} p_root - Start point of the path search. Defaults to [body].
 * @returns {Object} - The view element located at 'target' path or 'target' itself.
 * @example
 * ```html
 * <div n='container'>
 *  <div n='title'>Title</div>
 *  <form n='form'>
 *      <input type='text' n='field'>
 *      <button n='button'>Send</button>
 *  </form>
 * </div>
 * ``` 
 * var form = Suit.view.get("container.form");          //Gets [form]
 * var button = Suit.view.get("button",form);           //Gets [button] starting at [form]
 * button = Suit.view.get("button","container.form"");  //Gets [button] starting at [form] (same as above).
 * button.onclick = function() {
 *  var field = Suit.view.get("container.form.field"); //Gets [input]
 *  console.log(field.value);
 * }
 * @see {@link Suit.view.name } 
 */
Suit.view.get =
function viewGet(p_target,p_root) {

	if(typeof(p_target)!="string") return p_target;

	var l = p_target.split(".");

	if (l.length <= 0) return null;

	var a = {};

	a.it = Suit.assert(p_root,body);

	while (l.length > 0) {				

		a.name  = l.shift();
		a.found = false;				
		Suit.view.traverse(a.it,m_viewGetTraverseCb,false,a);
		if(!a.found) return null;				

	}

	return a.found ? a.it : null;
};

/**
 * Returns the 'separator' separated path of target relative to 'root' parameter. In case of mismatched arguments it returns an empty string. The default separator is '.'
 * @param  {String|Element} p_target - Target view to generate the path.
 * @param  {?(String|Element)} p_root - Start point to search for 'target'. Defaults to [body].
 * @param  {?String} p_separator - String separator for the resulting path.
 * @returns {String} - The path for 'target' separated by the chosen 'separator'.
 * @example
 * ```html
 * <div class='ctn' n='container'>
 *  <div n='title'>Title</div>
 *  <form n='form'>
 *      <input class='ff' type='text' n='field'>
 *      <button n='button'>Send</button>
 *  </form>
 * </div>
 * ```
 * var input = document.querySelector(".ff");           //Gets [input]
 * var container = document.querySelector(".ctn");      //Gets [container]
 * console.log(Suit.view.path(input));                  //Returns 'container.form.field'
 * console.log(Suit.view.path(input,container,"/"));    //Returns 'form/field'
 * @see {@link Suit.view.get }
 * @see {@link Suit.view.name }
 */
Suit.view.path =
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
 * Returns a flag indicating if a given view contains another view.
 * @function
 * @param  {String|Element} p_view
 * @param  {String|Element} p_child         
 * @returns {Boolean} - Flag indicating if 'view' is inside 'target'.
 * @example
 * ```html
 * <div n='parent'>
 *  <div n='child'>
 *      <div n='child2'></div>
 *  </div>
 * </div>
 * <div n='other'></div>
 * ```
 * var p = Suit.view.get("parent");
 * var c = Suit.view.get("parent.child");
 * Suit.view.contains("parent.child",c);           //Returns true
 * Suit.view.contains(p,"parent.child.child2");    //Returns true
 * Suit.view.contains("parent.child","other");     //Returns false
 * @see {@link Suit.view.get }
 */
Suit.view.contains = 
function viewContains(p_view,p_child) {

	var v = Suit.view.get(p_view);
	if(v==null) return false;
	var c = Suit.view.get(p_child);
	if(c==null) return false;
	return v.contains(c);

};

/**
 * Executes a querySelectorAll on the target and returns an Array with the results.
 * @param  {String} p_query - Selector query.
 * @param  {?(String|Element)} p_target - Target view to apply the query. Defaults to [body]
 * @returns {Element[]} - List of zero or more results.
 * @example 
 * ```html
 * <div class='ctn' n='container'> 
 *  <ul n='list0'>
 *     <li>A</li>
 *     <li>B</li>      
 *  </ul>
 *  <ul n='list1'>
 *     <li>C</li>
 *     <li>D</li>      
 *  </ul>
 * </div>
 * ```
 * //Similar to document.querySelectorAll()
 * Suit.view.query("li");                   //Returns a [li] Array with (A,B,C,D).
 * Suit.view.query("li","container.list1"); //Returns a [li] Array with (C,D) (starts at 'list1').
 * Suit.view.query(".container");           //Returns an empty Array [] ('query' never returns null)
 */
Suit.view.query =
function viewQuery(p_query,p_target) {

	var t = Suit.view.get(p_target);
	if (t == null) t = body;
	var res = [];
	var l   = t.querySelectorAll(p_query);
	for (var i=0;i<l.length;i++) res.push(l[i]);
	return res;

};


/**
 * Returns the first parent element which is a Suit's View element (i.e. have a name attrib).
 * @param  {String|Element} p_target - Target to have its parent checked.
 * @returns {Element} - The reference to the parent element of 'target'.
 * @example
 * ```html
 * <div n='a'>
 *  <div n='b'>
 *      <div class='empty'>
 *          <div n='c'></div>
 *      </div>
 *  </div>
 * </div>
 * <div n='other'></div>
 * ```
 * var a = Suit.view.get("a");
 * var b = Suit.view.get("a.b");
 * var e = Suit.view.query(".empty")[0]; //[div] without name
 * Suit.view.parent("a.b") == a;         //true
 * Suit.view.parent(b) == a;             //true
 * Suit.view.parent("a.b.c") == b;       //true (will skip the empty [div])
 * Suit.view.parent(e) == b;             //true (will go up until first view Element)
 * @see {@link Suit.view.get }
 * @see {@link Suit.view.query }
 */
Suit.view.parent =
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
 * Callback called when the view module is traversing its target.
 * @callback ViewTraverseCallback
 * @param {Element} p_target - Current element being visited.
 * @param {?Object} p_args - Extra data passed in the original 'traverse' call.
 * @returns {?Boolean} - Returning 'false' will stop the traversal for the current node. 
 */

/**
 * Navigates the DOM hierarchy of the target element and invokes the callback for each element.
 * If the callback returns false the search stops.
 * The default mode is DepthFirstSearch (DFS), if the last parameter is 'true' the mode will be BreadthFirstSearch (BFS)
 * It is possible to pass arguments for the specified callback too.
 * @param  {String|Element} p_target - Path or Reference to the element.
 * @param  {ViewTraverseCallback} p_callback - Callback to handle each element visit.
 * @param  {?Boolean} p_bfs - Flag that indicates if Breadth First Search will be used.
 * @param  {?Object} p_args - Extra data passed in each callback call.
 * @example
 * ```html
 * <div n='a'>
 *  <div n='b'> 
 *      <div n='c'></div>
 *  </div>
 *  <div n='d'> 
 *      <div n='e'>
 *          <div n='f'></div>
 *      </div>     
 *  </div>
 * </div>
 * <div n='other'></div>
 * ```
 * //Will visit ([body],a,b,c,d,e,f) (Depth First Search)
 * Suit.view.traverse(document.body,function(p_node,p_args) { ... },false, {some: "data"});
 * 
 * //Will visit ([body],a,d,b,e,f) (Breadth First Search)
 * Suit.view.traverse(document.body,function(p_node,p_args) { ... },true, {some: "data"});
 */
Suit.view.traverse =
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
* Reference to the container of Controller features.
* @class
*/
Suit.controller = {};

/**
 * List of registered controllers.
 * @type {Controller[]}
 */
Suit.controller.list = [];

/**
 * Callback called when a notification arrives on a Controller.
 * @callback ControllerCallback
 * @param {ControllerNotification} p_notification - Notification containing the call information.
 * @returns {?(String|Array)} - A new notification String or a pair ["notification", {data}] (both will invoke Suit.controller.dispatch('notification',data))
 */

/**
 * SuitJS Controller.
 * @typedef {Object} Controller
 * @property {?String[]} allow - List of events handled by this Controller. Defaults to ['click','change','input']
 * @property {?Boolean} enabled - Flag that allows events to trigger the 'on' callback. Defaults to 'true'
 * @property {Element} view - Reference to the 'view' Element whom this Controller is attached.
 * @property {ControllerCallback} on - Method that handles the 'view' and global notifications.     
 */

/**
 * Controller Notification.
 * @typedef {Object} ControllerNotification
 * @property {?String} type - Type of the event that generated this notification. Can be 'empty' if called from 'Suit.controller.dispatch'.
 * @property {?Event} src - Reference to the event which generated this notification. Can be 'null' if called from 'Suit.controller.dispatch'.
 * @property {?String} view - String path to the view/Element where this event was generated.
 * @property {?String} path - String containing the complete event path. It can be either 'path.to.event@type' or only 'path.to.event'. 
 * @property {?Object} data - Extra data that can be attached to this notification. More common on hand made dispatches.     
 */

/**
 * Attaches a controller to the pool.
 * @param  {Controller} p_target - Reference to the controller instance.
 * @param  {?(String|Element)} p_view - Path or Reference to the view element to be watched.
 * @returns {Controller} - Reference to the added controller.
 * @example
 * var homeController = {
 *  allow:      ["click","change","input"], //defaults to these events. Can be 'null'
 *  enabled:    true,                       //defaults to true. Can be 'null'
 *  view:       null,                       //starts 'null' but, after added to a view, holds its view reference (no need to declare splicitly)
 *  on:         
 *  function(n) {                           //callback to handle events parsed as 'ControllerNotification'
 *      switch(n.path) {
 *          case "welcome":
 *          //Entry point for all controllers.
 *          break;
 * 
 *          case "path.to.view@click":
 *          //Captured 'click' event inside/including 'this.view'
 *          break;
 *      }
 *  }
 * };
 * 
 * Suit.controller.add(homeController);                //Will attach a Controller to 'document.body'.
 * Suit.controller.add(homeController,"path.to.view"); //Will remove it from 'document.body' and attach it to a view at 'path.to.view'
 * 
 */
Suit.controller.add =
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
			cev.view    = (e.target instanceof HTMLElement) ? Suit.view.path(e.target,v) : "";
			cev.path	= cev.view == "" ? e.type : (e.type=="" ? cev.view : (cev.view + "@" + e.type));
			cev.data    = null;
			if(t.on!=null) { 
				var res = t.on(cev);
				if(res==null) return;
                if(typeof(res)=="string") { Suit.controller.dispatch(res); return; }
                if(Array.isArray(res))    { Suit.controller.dispatch(Suit.assert(res[0],""),Suit.assert(res[1],null)); return; }
			}

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
 * Removes the controller from the pool.
 * @param  {Object} p_target - Reference to the controller instance.
 * @returns {Object} - Reference to the removed controller.
 * @example
 * var c = {...};
 * Suit.controller.add(c);      //Suit.controller.list.length == 1
 * Suit.controller.remove(c);   //Suit.controller.list.length == 0
 */
Suit.controller.remove =
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
 * Dispatches a notification for all enabled controllers in the pool.
 * The format of the 'path' can be either 'path.to.event' or 'path.to.event@type'
 * @param  {String} p_path - String with a path that describes the event context.
 * @param  {?Object} p_data - Extra data to be passed to the event.
 * @example
 * var c = {
 *  on: function(n){
 *      switch(n.path) {
 *      
 *      case "some.event": console.log("some event"); break;
 *      case "some.event@hi": console.log("hi! "+n.data.msg);     break;
 * 
 *      }
 *  }
 * };
 * 
 * Suit.controller.add(c);
 * 
 * Suit.controller.dispatch("some.event");                  //Will log 'some event'.
 * Suit.controller.dispatch("some.event@hi",{msg: "John"}); //Will log 'hi! John'.
 * 
 * c.enabled = false;
 * 
 * Suit.controller.dispatch("some.event");                  //No log.
 */
Suit.controller.dispatch =
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
	for (var i=0;i<l.length;i++) {          
        var res = l[i].on(cev);		
        if(res==null) return;
        if(typeof(res)=="string") { Suit.controller.dispatch(res); return; }
        if(Array.isArray(res))    { Suit.controller.dispatch(Suit.assert(res[0],""),Suit.assert(res[1],null)); return; }
    }

};

/**
 * Removes all controllers from the pool.
 */
Suit.controller.clear =
function controllerClear() {
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
* Reference to the container of XmlHttpRequest features.
* @class
*/
Suit.request = {};

//Receives a ProgressEvent and returns the normalized progress ([0;1] range).
var m_requestGetProgress = 
function requestGetProgress(p_event,p_scale) {
	return (p_event.total <= 0? 0 : p_event.loaded / (p_event.total + 5));
};

//Invokes the Suit Request's callback or dispatches a controller event.
var m_requestCallbackInvoke =
function requestCallbackInvoke(p_callback,p_is_string,p_data,p_progress,p_event) {

	if(p_callback==null) return;

	if(p_is_string) {

		var type = "";

		var d = { event: p_event, progress: p_progress, data: p_data };

		switch(p_event.type) {

			case "progress": type = p_progress<0.0 ? "upload" : "progress"; break;
			case "load": 	 type = p_data==null ? "error" : "complete"; break;
			case "error": 	 type = "error"; break;

		}

		if(type=="upload") d.progress += 1.0;

		Suit.controller.dispatch(p_callback+"@"+type,d);
		return;
	}	

	p_callback(p_data,p_progress,p_event);
};

/**
 * Callback called when a created request updates its progress.
 * @callback RequestCallback
 * @param {Object} p_data - Data being loaded or null (in case of error or progress).
 * @param {Number} p_progress - Download or Upload progress ('upload' values have the range [-1.0,0.0) )
 * @param {?Event} p_event - Reference to the XmlHttpRequest event that generated the call.  
 */

/**
 * Create and execute a XmlHttpRequest and invokes the callback with the needed feedback of the process.
 * @param  {String} p_method - Request method (GET, POST,...)
 * @param  {String} p_url - URL
 * @param  {RequestCallback|String} p_callback - Reference to the callback function to handle this request or notification string that all controllers will receive.
 * @param  {String} p_response - Type of the response `text,arraybuffer,blob,document,json` - {@link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType See More }. 
 * @param  {?(ArrayBuffer|FormElement|String|Object|Blob)} p_data - Data to be sent.
 * @param  {?Object} p_headers - Object containing custom headers.
 * @returns {XmlHttpRequest} - Reference to the created XmlHttpRequest object.
 * @example
 * //================ DOWNLOAD ================
 * //Will create a POST request expecting a json that don't send any data and don't define custom headers.
 * var xhr = Suit.request.create("POST","http://webservice.com/",function(p_data,p_progress,p_event){
 *  if(p_progress>=1.0){ //100%
 *      console.log(data); // { some: json: { data: "yay" } } }
 *  }
 *  else {
 *      bar.style.width = (p_progress * 100.0)+"px"; //progress feedback on some element.
 *  } 
 * },"json",null,null);
 * 
 * var c = {
 *  on: function (n) {     
 *      switch (n.path) {
 *          case "some.load@progress":  console.log(n.data.progress)     break; //progress number          
 *          case "some.load@load":      console.log(n.data.data);        break; //Uint8Array
 *          case "some.load@error":     console.log(n.data.event);       break; //error event
 *      }
 *  }
 * };
 * 
 * Suit.controller.add(c);
 * 
 * Suit.request.create("GET","http://webservice.com","some.load","arraybuffer"); //Starts the loading using notification string as callback.
 * 
 * @example
 * //================ UPLOAD ================
 * Suit.request.create("POST","http://webservice.com/",function(p_data,p_progress,p_event) {
 *  if(p_progress<0.0) { //Upload progress goes from -1.0 to 0.0
 *    var p = p_progress+1.0; //convert to [0;1] range
 *    bar.style.width = Math.floor(p*100.0)+"px";
 *  }
 * 
 *  if(p_progress>=0.0) { //Download progress goes from 0.0 to 1.0
 *    var p = p_progress; //use as it is
 *    bar.style.width = Math.floor(p*100.0)+"px";
 *  } 
 * 
 *  if(p_progress>=1.0) {    //Upload and Download finished.
 *      console.log(p_data);
 *  }
 * 
 * }, { data: "content", index: 10 }); //Object data will pass thru Json.stringify().
 * 
 * //Check the docs for the allowed data types that can be sent.
 * 
 */
Suit.request.create =
function requestCreate(p_method,p_url,p_callback,p_response, p_data,p_headers) {

	var method   = Suit.assert(p_method,"get");
	var response = Suit.assert(p_response,"text").toLowerCase();
	var ld       = new XMLHttpRequest();
	var isCbStr  = typeof(p_callback)=="string";
	var cb       = p_callback;

	var isFirstUpload   = true;
	var isFirstProgress = true;

	if(response=="arraybuffer") if(ld.overrideMimeType != null) {  ld.overrideMimeType("application/octet-stream");  }			
	
	ld.responseType = response;	

	ld.onprogress = 
	function reqProgress(e) { 

		if(isFirstProgress) { 

			if(p_data!=null) { m_requestCallbackInvoke(cb,isCbStr,null,0.0,e); }
			isFirstProgress=false; 
			m_requestCallbackInvoke(cb,isCbStr,null,0.000001,e);  			
		}
		var p = m_requestGetProgress(e)*0.999; m_requestCallbackInvoke(cb,isCbStr,null,p,e); 
	};
	
	ld.upload.onprogress = 
	function reqUploadProgress(e)  {

		if(p_data!=null) { 

			if(isFirstUpload) { isFirstUpload=false; m_requestCallbackInvoke(cb,isCbStr,null,-1.0,e);  }
			var p = m_requestGetProgress(e)*0.999; m_requestCallbackInvoke(cb,isCbStr,null,-(1.0-p),e); 
		}

	};
	
	ld.onload  = function reqOnLoad(e)  { m_requestCallbackInvoke(cb,isCbStr,(response=="arraybuffer") ? new Uint8Array(ld.response) : ld.response,1.0,e); };
	ld.onerror = function reqOnError(e) { m_requestCallbackInvoke(cb,isCbStr,null,1.0,e); };
	
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
 * Creates a GET request expecting 'text' response.
 * @param  {String} p_url - URL
 * @param  {RequestCallback} p_callback - Reference to the callback function to handle this request.
 * @param  {?(ArrayBuffer|FormElement|String|Object|Blob)} p_data - Data to be sent.
 * @param  {?Object} p_headers - Object containing custom headers.
 * @returns {XmlHttpRequest} - Reference to the created XmlHttpRequest object.
 * @example
 * //Using 'create'
 * Suit.request.create("GET","http://webservice.com",function(d,p,e){...},"text"); 
 * //Using the shortcut
 * Suit.request.get("http://webservice.com",function(d,p,e){...});
 * @see {@link Suit.request.create} 
 */
Suit.request.get = function requestGet(p_url,p_callback,p_data,p_headers) { return Suit.request.create("get",p_url,p_callback,"text",p_data,p_headers);	};

/**
 * Creates a POST request expecting 'text' response.
 * @param  {String} p_url - URL
 * @param  {RequestCallback} p_callback - Reference to the callback function to handle this request.
 * @param  {?(ArrayBuffer|FormElement|String|Object|Blob)} p_data - Data to be sent.
 * @param  {?Object} p_headers - Object containing custom headers.
 * @returns {XmlHttpRequest} - Reference to the created XmlHttpRequest object.
 * @example
 * //Using 'create'
 * Suit.request.create("POST","http://webservice.com",function(d,p,e){...},"text"); 
 * //Using the shortcut
 * Suit.request.post("http://webservice.com",function(d,p,e){...});
 * @see {@link Suit.request.create}
 */
Suit.request.post = function requestPost(p_url,p_callback,p_data,p_headers) { return Suit.request.create("post",p_url,p_callback,"text",p_data,p_headers);	};

/**
================ Shortcuts to handle requests with different responses. ================
//*/

/**
 * Reference to the shortcuts for creating requests that expects ArrayBuffer as result.
 * @class
 */
Suit.request.binary = {};

/**
 * Creates a GET request expecting 'arraybuffer' response.
 * @param  {String} p_url - URL
 * @param  {RequestCallback} p_callback - Reference to the callback function to handle this request.
 * @param  {?(ArrayBuffer|FormElement|String|Object|Blob)} p_data - Data to be sent.
 * @param  {?Object} p_headers - Object containing custom headers.
 * @returns {XmlHttpRequest} - Reference to the created XmlHttpRequest object.
 * @example
 * //Using 'create'
 * Suit.request.create("GET","http://webservice.com",function(d,p,e){...},"arraybuffer"); 
 * //Using the shortcut
 * Suit.request.binary.get("http://webservice.com",function(d,p,e){...});
 * @see {@link Suit.request.create}
 */
Suit.request.binary.get  =   function requestBinaryGet(p_url,p_callback,p_data,p_headers) { return Suit.request.create("get",p_url,p_callback,"arraybuffer",p_data,p_headers);	};

/**
 * Creates a POST request expecting 'arraybuffer' response.
 * @param  {String} p_url - URL
 * @param  {RequestCallback} p_callback - Reference to the callback function to handle this request.
 * @param  {?(ArrayBuffer|FormElement|String|Object|Blob)} p_data - Data to be sent.
 * @param  {?Object} p_headers - Object containing custom headers.
 * @returns {XmlHttpRequest} - Reference to the created XmlHttpRequest object.
 * @example
 * //Using 'create'
 * Suit.request.create("POST","http://webservice.com",function(d,p,e){...},"arraybuffer"); 
 * //Using the shortcut
 * Suit.request.binary.post("http://webservice.com",function(d,p,e){...});
 */
Suit.request.binary.post =   function requestBinaryPost(p_url,p_callback,p_data,p_headers) { return Suit.request.create("post",p_url,p_callback,"arraybuffer",p_data,p_headers);	};

/**
 * Reference to the shortcuts for creating requests that expects Blob as result.
 * @class
 */
Suit.request.blob = {};

/**
 * Creates a GET request expecting 'blob' response.
 * @param  {String} p_url - URL
 * @param  {RequestCallback} p_callback - Reference to the callback function to handle this request.
 * @param  {?(ArrayBuffer|FormElement|String|Object|Blob)} p_data - Data to be sent.
 * @param  {?Object} p_headers - Object containing custom headers.
 * @returns {XmlHttpRequest} - Reference to the created XmlHttpRequest object.
 * @example
 * //Using 'create'
 * Suit.request.create("GET","http://webservice.com",function(d,p,e){...},"blob"); 
 * //Using the shortcut
 * Suit.request.blob.get("http://webservice.com",function(d,p,e){...});
 */
Suit.request.blob.get  =  function requestBlobGet(p_url,p_callback,p_data,p_headers) { return Suit.request.create("get",p_url,p_callback,"blob",p_data,p_headers);	};

/**
 * Creates a POST request expecting 'blob' response.
 * @param  {String} p_url - URL
 * @param  {RequestCallback} p_callback - Reference to the callback function to handle this request.
 * @param  {?(ArrayBuffer|FormElement|String|Object|Blob)} p_data - Data to be sent.
 * @param  {?Object} p_headers - Object containing custom headers.
 * @returns {XmlHttpRequest} - Reference to the created XmlHttpRequest object.
 * @example
 * //Using 'create'
 * Suit.request.create("POST","http://webservice.com",function(d,p,e){...},"blob"); 
 * //Using the shortcut
 * Suit.request.blob.post("http://webservice.com",function(d,p,e){...});
 */
Suit.request.blob.post =  function requestBlobPost(p_url,p_callback,p_data,p_headers) { return Suit.request.create("post",p_url,p_callback,"blob",p_data,p_headers);	};

/**
 * Reference to the shortcuts for creating requests that expects Document as result.
 * @class
 */
Suit.request.document = {};

/**
 * Creates a GET request expecting 'document' response.
 * @param  {String} p_url - URL
 * @param  {RequestCallback} p_callback - Reference to the callback function to handle this request.
 * @param  {?(ArrayBuffer|FormElement|String|Object|Blob)} p_data - Data to be sent.
 * @param  {?Object} p_headers - Object containing custom headers.
 * @returns {XmlHttpRequest} - Reference to the created XmlHttpRequest object.
 * @example
 * //Using 'create'
 * Suit.request.create("GET","http://webservice.com",function(d,p,e){...},"document"); 
 * //Using the shortcut
 * Suit.request.document.get("http://webservice.com",function(d,p,e){...});
 */
Suit.request.document.get  =  function requestDocumentGet(p_url,p_callback,p_data,p_headers) { return Suit.request.create("get",p_url,p_callback,"document",p_data,p_headers);	};

/**
 * Creates a POST request expecting 'document' response.
 * @param  {String} p_url - URL
 * @param  {RequestCallback} p_callback - Reference to the callback function to handle this request.
 * @param  {?(ArrayBuffer|FormElement|String|Object|Blob)} p_data - Data to be sent.
 * @param  {?Object} p_headers - Object containing custom headers.
 * @returns {XmlHttpRequest} - Reference to the created XmlHttpRequest object.
 * @example
 * //Using 'create'
 * Suit.request.create("POST","http://webservice.com",function(d,p,e){...},"document"); 
 * //Using the shortcut
 * Suit.request.document.post("http://webservice.com",function(d,p,e){...});
 */
Suit.request.document.post =  function requestDocumentPost(p_url,p_callback,p_data,p_headers) { return Suit.request.create("post",p_url,p_callback,"document",p_data,p_headers);	};

/**
 * Reference to the shortcuts for creating requests that expects Json as result.
 * @class
 */
Suit.request.json = {};

/**
 * Creates a GET request expecting 'json' response.
 * @param  {String} p_url - URL
 * @param  {RequestCallback} p_callback - Reference to the callback function to handle this request.
 * @param  {?(ArrayBuffer|FormElement|String|Object|Blob)} p_data - Data to be sent.
 * @param  {?Object} p_headers - Object containing custom headers.
 * @returns {XmlHttpRequest} - Reference to the created XmlHttpRequest object.
 * @example
 * //Using 'create'
 * Suit.request.create("GET","http://webservice.com",function(d,p,e){...},"json"); 
 * //Using the shortcut
 * Suit.request.json.get("http://webservice.com",function(d,p,e){...});
 */
Suit.request.json.get  =  function requestJsonGet(p_url,p_callback,p_data,p_headers) { return Suit.request.create("get",p_url,p_callback,"json",p_data,p_headers);	};

/**
 * Creates a POST request expecting 'json' response.
 * @param  {String} p_url - URL
 * @param  {RequestCallback} p_callback - Reference to the callback function to handle this request.
 * @param  {?(ArrayBuffer|FormElement|String|Object|Blob)} p_data - Data to be sent.
 * @param  {?Object} p_headers - Object containing custom headers.
 * @returns {XmlHttpRequest} - Reference to the created XmlHttpRequest object.
 * @example
 * //Using 'create'
 * Suit.request.create("POST","http://webservice.com",function(d,p,e){...},"json"); 
 * //Using the shortcut
 * Suit.request.json.post("http://webservice.com",function(d,p,e){...});
 */
Suit.request.json.post =  function requestJsonPost(p_url,p_callback,p_data,p_headers) { return Suit.request.create("post",p_url,p_callback,"json",p_data,p_headers);	};

	
})(window,document,document.body);


