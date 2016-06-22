// Toggle Projects
$(function() {
    $(".expand").on( "click", function() {
        $(this).next().slideToggle();
        // $expand = $(this).find(">:first-child");
        $expand = $(this).find(">:nth-child(2)");

        if($expand.text() === "+") {
            $expand.text("-");
        } else {
            $expand.text("+");
        }
    });
});

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
            var aDate, 
                months, 
                year, 
                month, 
                date, 
                hour, 
                min, 
                time;

            aDate = new Date(timestamp * 1000);
            months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            year = aDate.getFullYear();
            month = months[aDate.getMonth()];
            date = aDate.getDate();
            hour = (aDate.getHours() - 8);
            min = aDate.getMinutes();
            time = month + ' ' + date + ', ' + year;
            return time;
        }
    // Get the first 5 most recent blog post from Tumblr    
    for (var i = 0; i < 5; i++) {
        var postType, 
            blogPosts, 
            textBlogTemplate, 
            photoBlogTemplate;

        postType = tumblrData[i].type;
        blogPosts = $('.tumblr-posts');
        textBlogTemplate = $('script[data-template="textBlog"]').html();
        photoBlogTemplate = $('script[data-template="photoBlog"]').html();
        //If the blog post is just text, do this
        if(postType == "text") {
            var title, content, timestamp, aTextPost;

            title = tumblrData[i].title;
            content = tumblrData[i].body;
            timestamp = new Date(tumblrData[i].timestamp);    
            // Grab data from Tumblr's API and append it to DOM using HTML Template
            aTextPost = textBlogTemplate
                .replace(/{{blogTime}}/g, timeConverter(timestamp))
                .replace(/{{blogTitle}}/g, title)
                .replace(/{{blogText}}/g, content)
            
            blogPosts.append(aTextPost);
        }
        // If the blog post is a photo, do this
        else if(postType == "photo") {
            var photoUrl, imgCaption, timestamp, aPhotoPost; 

            photoUrl = tumblrData[i].photos[0].alt_sizes[0].url;
            imgCaption = tumblrData[i].caption;
            timestamp = new Date(tumblrData[i].timestamp);
            // Grab data from Tumblr's API and append it to DOM using HTML Template
            aPhotoPost = photoBlogTemplate
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