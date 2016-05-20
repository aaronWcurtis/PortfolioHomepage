// Request Data from Tumblr's API
$.ajax({
    url : "config.php",
    dataType: "jsonp",
    data: {
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
        var postType = tumblrData[i].type;
        var blogPosts = $('.tumblr-posts');
        var textBlogTemplate = $('script[data-template="textBlog"]').html();
        var photoBlogTemplate = $('script[data-template="photoBlog"]').html();
        
        if(postType == "text") {
            var title = tumblrData[i].title;
            var content = tumblrData[i].body;
            var timestamp = new Date(tumblrData[i].timestamp);    
            // Replace template text with text from Tumblr's API
            var aTextPost = textBlogTemplate
                .replace(/{{blogTime}}/g, timeConverter(timestamp))
                .replace(/{{blogTitle}}/g, title)
                .replace(/{{blogText}}/g, content)
            blogPosts.append(aTextPost);
        }
        else if(postType == "photo") {
            var photoUrl = tumblrData[i].photos[0].alt_sizes[0].url;
            var imgCaption = tumblrData[i].caption;
            var timestamp = new Date(tumblrData[i].timestamp);
            // Replace template text with pic from Tumblr's API
            var aPhotoPost = photoBlogTemplate
                .replace(/{{blogTime}}/g, timeConverter(timestamp))
                .replace(/{{photoURL}}/g, photoUrl)
                .replace(/{{photoText}}/g, imgCaption)
            blogPosts.append(aPhotoPost);
            }
        clearTimeout(tumblrRequestTimeout);     
  }
}

// If the AJAX request fails, display an Error message
var tumblrRequestTimeout = setTimeout(function() {
$('.tumblr-posts').html("<li>Sorry about that! For some reason the blog isn't working right now.</li>");
}, 3000);