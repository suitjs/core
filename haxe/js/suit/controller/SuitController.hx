package js.suit.controller;
import js.suit.controller.ControllerEvent;
import js.suit.view.View;
import js.html.DOMElement;
import js.html.Event;
import js.html.NodeList;
import js.suit.Suit;

/**
 * Class that implements the Controller features of FrontJS.
 * @author eduardo-costa
 */
extern class SuitController
{
	/**
	 * List of active controllers.
	 */
	public var list : Array<Controller>;
	
	/**
	 * Adds a Controller instance to the notification pool.
	 */
	@:overload(function(p_controller:Controller, p_target:DOMElement):Controller{})
	public function add(p_controller:Controller, p_target:String):Controller;
	
	/**
	 * Removes the controller from the pool.
	 * @param	p_controller
	 * @return
	 */
	public function remove(p_controller:Controller):Controller;
	
	/**
	 * Dispatches an event to all controllers.
	 * @param	p_type
	 * @param	p_view
	 * @param	p_event
	 * @param	p_data
	 */
	public function dispatch(p_path:String, p_data:Dynamic = null):Void;
	
	/**
	 * Removes all controllers from the pool.
	 */
	public function clear():Void;
	
	
}