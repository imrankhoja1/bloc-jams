var albumPicasso = {
  name: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: '/images/album-placeholder.png',
  songs: [
      { name: 'Blue', length: '4:26' },
      { name: 'Green', length: '3:14' },
      { name: 'Red', length: '5:01' },
      { name: 'Pink', length: '3:21' },
      { name: 'Magenta', length: '2:15' }
    ]
};

 var albumMarconi = {
   name: 'The Telephone',
   artist: 'Guglielmo Marconi',
   label: 'EM',
   year: '1909',
   albumArtUrl: '/images/album-placeholder.png',
   songs: [
       { name: 'Hello, Operator?', length: '1:01' },
       { name: 'Ring, ring, ring', length: '5:01' },
       { name: 'Fits in your pocket', length: '3:21'},
       { name: 'Can you hear me now?', length: '3:14' },
       { name: 'Wrong phone number', length: '2:15'}
     ]
  };

  var currentlyPlayingSong = null;

 var createSongRow = function(songNumber, songName, songLength) {
   var template =
       '<tr>'
       // this row is basically storing the song number as a html data attribute that JS can read from later.
       // the attribute is called song-number (basically whatever is after the 'data-')
     + '  <td class="song-number col-md-1" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '  <td class="col-md-9">' + songName + '</td>'
     + '  <td class="col-md-2">' + songLength + '</td>'
     + '</tr>'
     ;
  
  // instead of returning the row immediately, we'll attach hover functionality first
  var $row = $(template);

  var onHover = function(event) {
    var songNumberCell = $(this).find('.song-number');
    // get the song-number data from the div html
    var songNumber = songNumberCell.data('song-number');
    
    // create the conditional to show play button if the user is hovering on a song that isn't the one playing
    if (currentlyPlayingSong !== songNumber) {
    // this line sets the play button on hover
    songNumberCell.html('<a class="album-song-button"><i class="fa fa-play"></i></a>');
    }
  };

  var offHover = function(event) {
    var songNumberCell = $(this).find('.song-number');
    var songNumber = songNumberCell.data('song-number');

    if (songNumber !== currentlyPlayingSong) {
    songNumberCell.html(songNumber);
    }
  };

  // toggle the play, pause and song number based on the button clicked
  var clickHandler = function(event) {
    var songNumber = $(this).data('song-number')

    // if a song is playing and is clicked, handle what happens with the UI but don't do anything else
    if (currentlyPlayingSong !== null) {
      // stop playing the current song.
      // replace stopped song button with number
      // set the data attribute on .song-number div to that of the one that just got clicked
      currentlyPlayingCell = $('.song-number[data-song-number="' + currentlyPlayingSong + '"]');
      currentlyPlayingCell.html(currentlyPlayingSong);
    }

    // a non playing song was clicked
    if (currentlyPlayingSong !== songNumber) {
      // a play icon wil be showing because of hover
      // Switch from Play -> Pause to indicate new song is playing
      $(this).html('<a class="album-song-button"><i class="fa fa-pause"></i></a>');

      // Set the current song to the one clicked
      currentlyPlayingSong = songNumber;

    } else if ( currentlyPlayingSong === songNumber ) {
      // switch from Pause -> Play to indicate that song was paused
      $(this).html('<a class="album-song-button"><i class="fa fa-play"></i></a>');

      // set the current song to null
      currentlyPlayingSong = null;
    }
  };

  $row.find('.song-number').click(clickHandler);
  $row.hover(onHover, offHover);
  return $row;

 };
 
var changeAlbumView = function(album) {
    
    // Update the album title
    var $albumTitle = $('.album-title');
    $albumTitle.text(album.name);

    // Update the album artist
    var $albumArtist = $('.album-artist');
    $albumArtist.text(album.artist);

    // Update the meta-information
    var $albumMeta = $('.album-meta-info');
    $albumMeta.text(album.year + " on " + album.label);

    // Update the album image
    var $albumImage = $('.album-image img');
    $albumImage.attr('src', album.albumArtUrl);

    // Update the song list
   var $songList = $(".album-song-listing");
   $songList.empty();
   var songs = album.songs;
   for (var i = 0; i < songs.length; i++) {
     var songData = songs[i];
     var $newRow = createSongRow(i + 1, songData.name, songData.length);
     $songList.append($newRow);
   }
};

if (document.URL.match(/\/album.html/)) {
  $(document).ready(function () {
    changeAlbumView(albumPicasso);
    changeAlbumView(albumMarconi);
    setupSeekBars();
  });
}

var updateSeekPercentage = function($seekBar, event) {
  var barWidth = $seekBar.width();
  var offsetX = event.pageX - $seekBar.offset().left; // get mouse offset here

  var offsetXPercent = (offsetX / barWidth ) * 100;
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(110, offsetXPercent);

  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
}

var setupSeekBars = function () {
  $seekBars = $('.player-bar .seek-bar');
  $seekBars.click(function(event) {
    updateSeekPercentage($(this), event);
  });

  $seekBars.find('.thumb').mousedown(function(event){
    var $seekBar = $(this).parent();
    
    $seekBar.addClass('no-animate');

    $('.player-bar').bind('mousemove.thumb', function(event){
      updateSeekPercentage($seekBar, event);
    });
 
    //cleanup
    $('.player-bar').bind('mouseup.thumb', function(){
      $seekBar.removeClass('no-animate');

      $('.player-bar').unbind('mousemove.thumb');
      $('.player-bar').unbind('mouseup.thumb');
    });
 
  });
};

