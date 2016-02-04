package js.suit.model;
import js.suit.view.View;
import js.html.DOMElement;
import js.html.Event;
import js.html.InputElement;
import js.html.NodeList;
import js.suit.Suit;

/**
 * Class that implements the Model features of FrontJS.
 * @author eduardo-costa
 */
extern class SuitModel
{
		
	/**
	 * Get/Set the View's data in object form.
	 * @param	p_target
	 * @return
	 */
	@:overload(function (p_target:DOMElement):Dynamic {})
	public function data(p_target : String, p_value:Dynamic = null) : Dynamic;
	
	/**
	 * Get/Set the value of a DOM or Form Element.
	 * @param	n
	 * @param	v
	 * @return
	 */
	public function value(p_target : Dynamic, p_value:Dynamic = null):Dynamic;
	
}