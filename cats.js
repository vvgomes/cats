requirejs.config({
  paths: {
    ramda: "https://cdnjs.cloudflare.com/ajax/libs/ramda/0.13.0/ramda.min",
    jquery: "https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min"
  }
});

require(["ramda", "jquery"], function (_, $) {
  var trace = _.curry(function(tag, x) {
    console.log(tag, x);
    return x;
  });

  var Impure = {
    getJSON: _.curry(function(callback, url) {
      $.getJSON(url, callback);
    }),

    setHtml: _.curry(function(sel, html) {
      $(sel).html(html);
    })
  };

  var url = function (term) {
    return "http://api.flickr.com/services/feeds/photos_public.gne?tags=" + term + "&format=json&jsoncallback=?";
  };

  var img = function (url) {
    return $('<img />', { src: url });
  };

  var mediaUrl = _.compose( _.prop("m"), _.prop("media"));
  var mediaToImage = _.map(_.compose(img, mediaUrl));
  var images = _.compose(mediaToImage, _.prop("items"))
  var renderImages = _.compose(Impure.setHtml("body"), images);
  var app = _.compose(Impure.getJSON(renderImages), url);

  app("cats");
});
