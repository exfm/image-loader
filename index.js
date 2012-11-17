(function(){

"use strict";

function ImageLoader(selector, url, opts){
     
    // set image on background (set to false for image elements)
    this.background = true; 
        
    $.extend(this, opts);
    
    // the element we will set the image on
    this.el = $(selector);
    
    // the url of the remote image we want to load
    this.url = url;
    
    this.getImage();
}

// create an objectURL from the blob
ImageLoader.prototype.createObjectURL = function(blob){
    var url = window.URL || window.webkitURL;
    this.objectURL = url.createObjectURL(blob);
    return this.objectURL;
}

// after we've used the objectURL, get rid of it
ImageLoader.prototype.revokeObjectURL = function(blob){
    var url = window.URL || window.webkitURL;
    url.revokeObjectURL(this.objectURL);
}


// load the remote image using XHR2
ImageLoader.prototype.getImage = function(){
    this.xhr = new XMLHttpRequest();
    this.xhr.open('GET', this.url, true);
    this.xhr.responseType = 'arraybuffer';
    this.xhr.addEventListener('load', this.onLoad.bind(this));
    this.xhr.send();
}

// when the image has loaded, set it
ImageLoader.prototype.onLoad = function(e){
    if (this.xhr.status == 200) {
        var blob = new Blob(
            [this.xhr.response], 
            {
                'type': 'image/jpg'
            }
        );
        var src = this.createObjectURL(blob);
        if(this.background === true){
            this.el.css('backgroundImage', 'url('+src+')');
        }
        else{
            this.el.attr('src', src);
        }
        if(this.showClass){
            this.el.addClass(this.showClass);
        }
        setTimeout(this.revokeObjectURL.bind(this), 5000);
    }
}

// check if we've got require
if(typeof module !== "undefined"){
    module.exports = ImageLoader;
}
else{
    window.ImageLoader = ImageLoader;
}

}()); // end wrapper