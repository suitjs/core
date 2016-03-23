[<img src="http://www.suitjs.com/img/logo-suitjs.svg?v=2" width="256" alt="SuitJS">](http://www.suitjs.com/)

A MVC framework easy to install and use.  
Enjoy a comfortable workflow that allows:
* Bidirectional data conversion between DOM and Object.
* Improved DOM organization and querying.
* Simple communication flow between Views and Controllers.
* Fast methods for download and upload of data.

# Install
#### Download
* Download either the `suitjs.js` or `suitjs.min.js` sources.
* Add the tag `<script src="js/suit.js"></script>`

#### Bower
* SuitJs is available as bower package.
* Run `bower install suitjs`
* It will install all script versions.
* Add the tag `<script src="bower_components/suitjs/js/suitjs.js"></script>`

#### CDN
* TBD

# Usage
After adding the script tag, the `Suit` global variable will be available.  
Your application workflow will be centered in `Controller` instances. 
#### Hello World
Given the HTML.
```html
<div n='content'>
    <button n='button'>Click</button>
</div>
```
```js
//Defines a Controller.
var simpleController = {
    //Method that handles notifications from other Views and Controllers.
    on: function(n) {
        switch(n.path) {
            
            case "welcome":                 //Entry point notification.            
                console.log("Thank You!");
                //Start Here.
            break;
            
            case "bye":                     //Custom notification.            
                console.log("See You Again!");
            break;
            
            case "content.button@click":    //DOM notification            
                //Sends a custom notification to all registered controllers (including itself).
                Suit.controller.dispatch("bye");            
            break;
        }
    }
};

//Adds the Controller to the pool.
Suit.controller.add(simpleController); 

```
#### View
The first step in the project is to organize page Elements which are relevant.  
The ones with important roles are defined **Views**.
  
Use the `n` attribute in tags that should be considered **View** instances.
```html
  <!-- regular layout element -->
  <div>
    <!-- View -->
    <div n='panel'>
        ...
        <div n='title'>Panel</div>
    </div>
    <p>Text</p>
    <!-- View -->
    <div n='footer'>
        ...
        <a n='link'>Link</a>
    </div>    
  </div>
```  
 These elements can later be manipulated using the `Suit.view` class.  
    
 `Suit.view.get("panel.title"); //returns <div n='title'>Panel</div>`
   
Use this class to query and use any HTMLElement tagged as View. 

For more detailed information on **View** features.  Check the **[documentation](http://suitjs.com/docs/core/Suit.view.html)**.
 
#### Model
Sometimes applications have to extract information from the DOM and arrange it to store or send to servers.  
The usual steps are:
* Query the Element(s).
* Extract their content.
* Convert the data to Object.  
  
The API offers a quick way to fetch this data and also to update the DOM with new data in one quick step.  
Given this example HTML.  
```html
<div n='content'>
 <p n='title>Title</p>
 <input type='text' n='name' value='John'>  
</div>
```
Then using SuitJS.

```js
//Get
Suit.model.data("content");       //returns {title: "Title", name: "John"}
Suit.model.data("content.title"); //returns "Title"
Suit.model.data("content.name");  //returns "John"
//Set
Suit.model.data("content",{title: "New Title", name: "Carl"});  //returns {title: "New Title", name: "Carl"} 
```

We can easily avoid the hassle of reading {HTML, Input, Form}Elements and extracting their data.
  
For more detailed information on **Model** features.  Check the **[documentation](http://suitjs.com/docs/core/Suit.model.html)**.

#### Controller

Now that we can fetch our Views and get/set their data, the last step is to wire up our application.  
The Controller instance offers a way easily handle both DOMEvents and in-application communications.  
  
Controllers are responsible for handling:
* Events that bubble up from the DOM.
* Notifications sent using `Suit.controller.dispatch`.
  
Given the HTML.
```html
<div n='content'>
    <div n='article'>
        <input n='field' type='text' value='Insert Text'>
        <button n='send'>Send</button>
    </div>    
    <div n='footer'>
        <button n='cancel'>Cancel</button>
    </div>      
</div>
```  
One example setup can be:
```js
//Handles hi-level notifications.
var contentController = {
  on: function(n) { 
      switch(n) {
          case "welcome":        /*Initialize*/   break;          
          case "article-send":
            var d = Suit.model.data("content.article.field"); //Gets the <input> value.
            //send(d);
          break;     
                         
          case "article-cancel":
            Suit.model.data("content.article.field",""); //clears the <input>
          break;
          
          //Can also handle the @click.
          //But it must 'case' the whole path to the View which generated the event.
          case "content.article.send@click": break; 
          
      }
  }  
};

//Handles notifications for the 'article' context.
var articleController = {
  on: function(n) { 
      switch(n) {
          case "send@click":
            Suit.controller.dispatch("article-send"); //Relay notification to all controllers.
          break;          
      }
  }     
};

//Handles notifications for the 'footer' context.
var footerController = {
  on: function(n) { 
      switch(n) {
          case "cancel@click":
            Suit.controller.dispatch("article-cancel"); //Relay notification to all controllers.
          break;          
      }
  }     
};

Suit.controller.add(contentController);                     //Added to <body> context.
Suit.controller.add(articleController,"content.article");   //Added to <div n='article'> context.
Suit.controller.add(footerController,"content.footer");     //Added to <div n='footer'> context.

```

For more detailed information on **Controller** features.  Check the **[documentation](http://suitjs.com/docs/core/Suit.controller.html)**.

#### Requests
Lastly, SuitJS offer methods to speed up the creation of `XmlHttpRequest` calls and event handling.  
  
The overall method to create requests is `Suit.request.create`.  
It allows the creation of requests with all parameters available.  
Example.  
```js
//================ DOWNLOAD ================
//Will create a POST request expecting a json that don't send any data and don't define custom headers.
var xhr = Suit.request.create("POST","http://webservice.com/",function(p_data,p_progress,p_event){
 if(p_progress>=1.0){ //100%
     console.log(data); // { some: json: { data: "yay" } } }
 }
 else {
     bar.style.width = (p_progress * 100.0)+"px"; //progress feedback on some element.
 }
},"json",null,null);

//================ UPLOAD ================
Suit.request.create("POST","http://webservice.com/",function(p_data,p_progress,p_event) {
 if(p_progress<0.0) { //Upload progress goes from -1.0 to 0.0
   var p = p_progress+1.0; //convert to [0;1] range
   bar.style.width = Math.floor(p*100.0)+"px";
 }
 if(p_progress>=0.0) { //Download progress goes from 0.0 to 1.0
   var p = p_progress; //use as it is
   bar.style.width = Math.floor(p*100.0)+"px";
 } 
 if(p_progress>=1.0) {    //Upload and Download finished.
     console.log(p_data);
 }
}, { data: "content", index: 10 }); //Object data will pass thru Json.stringify().
//Check the docs for the allowed data types that can be sent.
```

Also, there are several shortcut methods to **load/upload** data using **GET/POST** and receiving data in **different data formats**.  
  
For more detailed information on **Request** features.  Check the **[documentation](http://suitjs.com/docs/core/Suit.request.html)**.


# Documentation
For in depth information of the API, visit the **[documentation](http://www.suitjs.com/docs/core/)**. 

# Examples
Usage examples can be found at **[CodePen](http://codepen.io/collection/XOyEpq/)**.