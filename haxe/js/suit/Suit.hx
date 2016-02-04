package js.suit;
import haxe.Timer;
import js.suit.controller.SuitController;
import js.suit.model.SuitModel;
import js.suit.view.SuitView;
import js.html.Event;

/**
 * Class that implements FrontJS root class.
 * @author eduardo-costa
 */
@:native("Suit")
extern class Suit
{
	/**
	 * Reference to the class that implements Model features.
	 */
	static public var model : SuitModel;

	/**
	 * Reference to the class that implements View features.
	 */
	static public var view : SuitView;
	
	/**
	 * Reference to the class that implements Controlller features.
	 */
	static public var controller : SuitController;
	
	/**
	 * Reference to the http request features.
	 */
	static public var request : SuitRequest;
	
}