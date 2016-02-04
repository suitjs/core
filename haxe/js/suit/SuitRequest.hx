package js.suit;
import haxe.Json;
import js.html.ArrayBuffer;
import js.html.Blob;
import js.html.Document;
import js.html.Event;
import js.html.FormData;
import js.html.ProgressEvent;
import js.html.Uint8Array;
import js.html.XMLHttpRequest;
import js.html.XMLHttpRequestResponseType;

/**
 * Class that implements XmlHttpRequest features of the Front class.
 * @author eduardo-costa
 */
extern class SuitRequest
{

	/**
	 * Creates and executes a XmlHttpRequest.
	 * @param	p_method
	 * @param	p_url
	 * @param	p_callback
	 * @param	p_response
	 * @param	p_data
	 * @param	p_headers
	 * @return
	 */
	public function create(p_method:String, p_url:String, p_callback : Dynamic->Float->Event->Void, p_response:String = "text", p_data:Dynamic = null, p_headers:Dynamic = null):XMLHttpRequest;
	
	/**
	 * Returns a XMLHttpRequest prepared for a GET operation and waiting a 'text' response.
	 * @param	p_url
	 * @param	p_callback
	 * @param	p_data
	 * @return
	 */
	public function get(p_url:String, p_callback : String->Float->Event->Void, p_data : Dynamic = null, p_headers:Dynamic = null):XMLHttpRequest;
	
	/**
	 * Returns a XMLHttpRequest prepared for a POST operation and waiting a 'text' response.
	 * @param	p_url
	 * @param	p_callback
	 * @param	p_data
	 * @return
	 */
	public function post(p_url:String, p_callback : String->Float->Event->Void,p_data : Dynamic = null, p_headers:Dynamic = null):XMLHttpRequest;
	
	/**
	 * Shortcut for requests expecting binary responses.
	 */
	public var binary : SuitRequestBinary;
	
	/**
	 * Shortcut for requests expecting blob responses.
	 */
	public var blob : SuitRequestBlob;
	
	/**
	 * Shortcut for requests expecting json responses.
	 */
	public var json : SuitRequestJson;
		
	/**
	 * Shortcut for requests expecting document responses.
	 */
	public var document : SuitRequestDocument;
	
	
}

/**
 * Class that implements a shortcut for 'arraybuffer' requests.
 */
extern class SuitRequestBinary
{
	/**
	 * Returns a XMLHttpRequest prepared for a GET operation and waiting a 'arraybuffer' response.
	 * @param	p_url
	 * @param	p_callback
	 * @param	p_data
	 * @return
	 */
	public function get(p_url:String, p_callback : Uint8Array->Float->Event->Void, p_data : Dynamic = null, p_headers:Dynamic = null):XMLHttpRequest;
	
	/**
	 * Returns a XMLHttpRequest prepared for a POST operation and waiting a 'arraybuffer' response.
	 * @param	p_url
	 * @param	p_callback
	 * @param	p_data
	 * @return
	 */
	public function post(p_url:String, p_callback : Uint8Array->Float->Event->Void,p_data : Dynamic = null, p_headers:Dynamic = null):XMLHttpRequest;
}

/**
 * Class that implements a shortcut for 'blob' requests.
 */
extern class SuitRequestBlob
{
	/**
	 * Returns a XMLHttpRequest prepared for a GET operation and waiting a 'blob' response.
	 * @param	p_url
	 * @param	p_callback
	 * @param	p_data
	 * @return
	 */
	public function get(p_url:String, p_callback : Blob->Float->Event->Void, p_data : Dynamic = null, p_headers:Dynamic = null):XMLHttpRequest;
	
	/**
	 * Returns a XMLHttpRequest prepared for a POST operation and waiting a 'blob' response.
	 * @param	p_url
	 * @param	p_callback
	 * @param	p_data
	 * @return
	 */
	public function post(p_url:String, p_callback : Blob->Float->Event->Void,p_data : Dynamic = null, p_headers:Dynamic = null):XMLHttpRequest;
}

/**
 * Class that implements a shortcut for 'json' requests.
 */
extern class SuitRequestJson
{
	/**
	 * Returns a XMLHttpRequest prepared for a GET operation and waiting a 'json' response.
	 * @param	p_url
	 * @param	p_callback
	 * @param	p_data
	 * @return
	 */
	public function get(p_url:String, p_callback : Dynamic->Float->Event->Void, p_data : Dynamic = null, p_headers:Dynamic = null):XMLHttpRequest;
	
	/**
	 * Returns a XMLHttpRequest prepared for a POST operation and waiting a 'json' response.
	 * @param	p_url
	 * @param	p_callback
	 * @param	p_data
	 * @return
	 */
	public function post(p_url:String, p_callback : Dynamic->Float->Event->Void,p_data : Dynamic = null, p_headers:Dynamic = null):XMLHttpRequest;
}

/**
 * Class that implements a shortcut for 'document' requests.
 */
extern class SuitRequestDocument
{
	/**
	 * Returns a XMLHttpRequest prepared for a GET operation and waiting a 'document' response.
	 * @param	p_url
	 * @param	p_callback
	 * @param	p_data
	 * @return
	 */
	public function get(p_url:String, p_callback : Document->Float->Event->Void, p_data : Dynamic = null, p_headers:Dynamic = null):XMLHttpRequest;
	
	/**
	 * Returns a XMLHttpRequest prepared for a POST operation and waiting a 'document' response.
	 * @param	p_url
	 * @param	p_callback
	 * @param	p_data
	 * @return
	 */
	public function post(p_url:String, p_callback : Document->Float->Event->Void,p_data : Dynamic = null, p_headers:Dynamic = null):XMLHttpRequest;
}