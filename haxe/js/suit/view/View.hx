package js.suit.view;
import js.html.Element;
import js.suit.Suit;

/**
 * Class that describes an HTML's Element as View.
 * @author eduardo-costa
 */
extern class View extends Element
{
	/**
	 * Name attrib of the this Element View.
	 * @param	get
	 * @param	set
	 * @return
	 */
	public var name(get, set):String;
	inline private function get_name():String {  return Suit.view.name(this); }	
	inline private function set_name(v:String):String {	return Suit.view.name(this, v);	}
	
	/**
	 * Reference to its most close View parent.
	 */
	public var parent(get, never):View;
	inline private function get_parent():View {  return Suit.view.parent(this); }	
	
	
}