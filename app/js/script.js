// Request Data from Tumblr's API
$.ajax({
    url : "http://api.tumblr.com/v2/blog/aaronwcurtis.tumblr.com/posts",
    dataType: "jsonp",
    data: {
        api_key : "Z5RR44JOSi3dypBkd0ZQL0WR0BsjbUTf6yW7AMzahWirR84vTH",
        jsonp : "myJsonpCallback"}
});

//If the AJAX request succeeds, initiate the callback function myJsonpCallback
myJsonpCallback = function(data){
        tumblrData = data.response.posts;

        function timeConverter(timestamp){
            var a = new Date(timestamp * 1000);
            var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = (a.getHours() - 8);
            var min = a.getMinutes();
            var time = month + ' ' + date + ', ' + year;
            return time;
        }

    for (var i = 0; i < 20; i++) {
        var typeOfPost = tumblrData[i].type;
        if(typeOfPost == "text") {
            var title = tumblrData[i].title;
            var content = tumblrData[i].body;
            var timestamp = new Date(tumblrData[i].timestamp);    

            // $(".tumblr-posts").append("<li><h3>" + title + "</h3><p>" + timeConverter(timestamp) + "</p>" + content + "</li>");
            $(".tumblr-posts").append("<li><p class='time-stamp'>" + timeConverter(timestamp) + "</p><h1 class='blog-post-title'>" + title + "</h1>" + content + "</li>");
        }
        else if(typeOfPost == "photo") {
            var photoUrl = tumblrData[i].photos[0].alt_sizes[0].url;
            var imgCaption = tumblrData[i].caption;
            var timestamp = new Date(tumblrData[i].timestamp);
            // $(".tumblr-posts").append("<li><img src='" + photoUrl + "'><p>" + timeConverter(timestamp) + "</p>" + imgCaption + "</li>");
            $(".tumblr-posts").append("<li><p class='time-stamp'>" + timeConverter(timestamp) + "</p><img src='" + photoUrl + "'/>" + imgCaption + "</li>");
            }
        i++;
        clearTimeout(tumblrRequestTimeout);
  }

}

// If the AJAX request fails, display an Error message
var tumblrRequestTimeout = setTimeout(function() {
$('.tumblr-posts').html("<li>Sorry about that! For some reason this site is down for right now.</li>");
}, 3000);