package js.suit.controller;
import js.suit.controller.ControllerEvent;
import js.suit.view.View;
import js.html.Element;
import js.html.Event;

/**
 * Class that describes an HTML's Element as View.
 * @author eduardo-costa
 */
extern class Controller
{
	/**
	 * Allowed events to be detected.
	 */
	public var allow : Array<String>;
	
	/**
	 * Reference to the view this controller is attached.
	 */
	public var view : View;
	
	/**
	 * Flag that tells if this controller will be notified.
	 */
	public var enabled : Bool;
	
	/**
	 * Reference to the event handler.
	 */
	public var handler : Event->Void;
	
	/**
	 * Class to be extended to handle the target View's events.
	 * @param	p_notification
	 */
	public function on(p_event : ControllerEvent):Void;	
	
}