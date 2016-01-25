package;
import js.Browser;
import js.suit.Suit;

/**
 * Entry point class.
 * @author eduardo-costa
 */
class Main
{

	/**
	 * Entry.
	 */
	static public function main():Void
	{
		untyped Browser.window.Suit = Suit;
		Suit.init();
	}
	
}