package js.suit.view;
import haxe.Timer;
import js.html.Attr;
import js.html.DOMElement;
import js.html.Event;
import js.html.MutationObserver;
import js.html.MutationRecord;
import js.html.NamedNodeMap;
import js.html.NodeList;

/**
 * Class that implements the View features of FrontJS.
 * @author eduardo-costa
 */
extern class SuitView
{	
	
	/**
	 * Get/Set a View's name attribute.
	 * @param	p_target
	 * @return
	 */
	public function name(p_target:DOMElement, p_name:String = null):String;
	
	/**
	 * Searches the document for a View matching the path.
	 * @param	p_path
	 * @return
	 */
	@:overload(function (p_path:DOMElement):View {})
	public function get(p_path:String):View;
	
	/**
	 * Returns the dot path to this element or its View 'root' container.
	 * @param	p_target
	 * @return
	 */
	@:overload(function(p_target : DOMElement, p_root:String = null):String {})
	public function path(p_target : DOMElement, p_root:DOMElement = null):String;
	
	/**
	 * Returns a flag telling if the 'target' is contained by the View reference of its 'path'.
	 * @param	p_path
	 * @param	p_target
	 * @return
	 */
	@:overload(function(p_view:String, p_target:String):Bool {})	
	@:overload(function(p_view:String, p_target:String):Bool {})	
	@:overload(function(p_view:String, p_target:DOMElement):Bool {})	
	public function contains(p_view:DOMElement, p_target:DOMElement):Bool;
	
	/**
	 * Executes a query on the desired target's path or instance.
	 * If no target is specified, the [body] tag is used.
	 * @param	p_query
	 * @param	p_target
	 * @return
	 */
	@:overload(function(p_query:String,p_target:DOMElement=null):Array<View>{})
	public function query(p_query:String, p_target:String = null):Array<View>;
	
	/**
	 * Returns the first parent element which is a View.
	 * @param	p_target
	 * @return
	 */
	@:overload(function (p_target:String):View {})
	public function parent(p_target:DOMElement):View;
	
	/**
	 * Traverse the whole hierarchy of the chosen element, including itself.
	 * The last boolean flag tells if the traversal will be Breadth First Search, otherwise Depth First Search will be used.
	 * @param	p_element
	 * @param	p_callback
	 */
	@:overload(function(p_element : String, p_callback : DOMElement->Bool,p_bfs : Bool=false,p_args:Dynamic=null):Void {})
	@:overload(function(p_element : String, p_callback : DOMElement->Void,p_bfs : Bool=false,p_args:Dynamic=null):Void {})
	@:overload(function(p_element : DOMElement, p_callback : DOMElement->Void,p_bfs : Bool=false,p_args:Dynamic=null):Void {})
	public function traverse(p_element : DOMElement, p_callback : DOMElement->Bool, p_bfs : Bool = false,p_args:Dynamic=null):Void;
	
}