$( document ).ready(function() {
// find template and compile it
var templateSource = document.getElementById('results-template').innerHTML,
    template = Handlebars.compile(templateSource),
    resultsPlaceholder = document.getElementById('results'),
    playingCssClass = 'playing',
    audioObject = null;

var fetchTracks = function (albumId, callback) {
    $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + albumId,
        success: function (response) {
            callback(response);
        }
    });
};

var searchAlbums = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: 'artist:' + query,
            type: 'album',
            market: "US"
        },
        success: function (response) {
            resultsPlaceholder.innerHTML = template(response);
        }
    });
};

results.addEventListener('click', function(e) {
    var target = e.target;
    if (target !== null && target.classList.contains('cover')) {
        if (target.classList.contains(playingCssClass)) {
            audioObject.pause();
        } else {
            if (audioObject) {
                audioObject.pause();
            }
            fetchTracks(target.getAttribute('data-album-id'), function(data) {
                audioObject = new Audio(data.tracks.items[0].preview_url);
                audioObject.play();
                target.classList.add(playingCssClass);
                $(".playing .fa").addClass("fa-circle-o-notch fa-spin fa-2x fa-fw");
                audioObject.addEventListener('ended', function() {
                    $(".playing .fa").removeClass("fa-circle-o-notch fa-spin fa-2x fa-fw");
                    target.classList.remove(playingCssClass);
                });
                audioObject.addEventListener('pause', function() {
                    $(".playing .fa").removeClass("fa-circle-o-notch fa-spin fa-2x fa-fw");
                    target.classList.remove(playingCssClass);
               });
            });
        }
    }
});

$("#search-box").on("keyup", function(e) {
    e.preventDefault();
    var g = $(this).val().toLowerCase();
    searchAlbums(g);
});

$("#form-search-box").submit(function (e) {
    e.preventDefault();
});
});


