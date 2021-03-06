(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';

    if (has(cache, path)) return cache[path].exports;
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex].exports;
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  var list = function() {
    var result = [];
    for (var item in modules) {
      if (has(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.list = list;
  globals.require.brunch = true;
})();
require.register("scripts/album", function(exports, require, module) {
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


});

;require.register("scripts/app", function(exports, require, module) {
// require("./landing");
// require("./collection");
// require("./album");
// require("./profile");

var albumPicasso = {
  name: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: '/images/album-placeholder.png',
  songs: [
         { name: 'Blue', length: 163.38, audioUrl: '/music/placeholders/blue' },
         { name: 'Green', length: 105.66, audioUrl: '/music/placeholders/green' },
         { name: 'Red', length: 270.14, audioUrl: '/music/placeholders/red' },
         { name: 'Pink', length: 154.81, audioUrl: '/music/placeholders/pink' },
         { name: 'Magenta', length: 375.92, audioUrl: '/music/placeholders/magenta' }
    ]
};

blocJams = angular.module('BlocJams', ['ui.router']);
blocJams.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  // this just means we want our states to match plain routes (read single page arch checkpoint) and not have routes prefixed with /#!/
  $locationProvider.html5Mode(true);

  $stateProvider.state('landing', {
    url: '/',
    controller: 'Landing.controller',
    templateUrl: '/templates/landing.html'
  });

  $stateProvider.state('song', {
    url: '/song',
    templateUrl: '/templates/song.html'
  });

  $stateProvider.state('collection', {
    url: '/collection',
    controller: 'Collection.controller',
    templateUrl: '/templates/collection.html'
  });

  $stateProvider.state('album', {
    url: '/album',
    controller: 'Album.controller',
    templateUrl: '/templates/album.html'
  });
}]);

blocJams.controller('Landing.controller', ['$scope', function($scope) {
  $scope.title = "Bloc Jams";
  $scope.subText = "Turn the music up!";

  function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
  };

  $scope.subTextClicked = function(event) {
    $scope.subText += '!';
  };

  $scope.titleClicked = function(event) {
    $scope.albumURLs = shuffle(albumURLs);
  };

  var albumURLs = [
    '/images/album-placeholders/album-1.jpg',
    '/images/album-placeholders/album-2.jpg',
    '/images/album-placeholders/album-3.jpg',
    '/images/album-placeholders/album-4.jpg',
    '/images/album-placeholders/album-5.jpg',
    '/images/album-placeholders/album-6.jpg',
    '/images/album-placeholders/album-7.jpg',
    '/images/album-placeholders/album-8.jpg',
    '/images/album-placeholders/album-9.jpg',
  ];

  $scope.albumURLs = albumURLs;
}]);

blocJams.controller('Collection.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
  $scope.albums = [];
  for (var i = 0; i < 33; i++) {
    $scope.albums.push(angular.copy(albumPicasso));
  }

  $scope.playAlbum = function(album) {
    SongPlayer.setSong(album, album.songs[0]); // targets first song in array of songs.
  }
}]);

blocJams.controller('Album.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
  $scope.album = angular.copy(albumPicasso);

  var hoveredSong = null;

  $scope.onHoverSong = function(song) {
    hoveredSong = song;
  };

  $scope.offHoverSong = function(song) {
    hoveredSong = null;
  };

  $scope.getSongState = function(song) {
    if ( song === SongPlayer.currentSong && SongPlayer.playing ) {
      return 'playing';
    }
    if ( song === hoveredSong ) {
      return 'hovered';
    }
    return 'default';
  };

  $scope.playSong = function(song) {
    SongPlayer.setSong($scope.album, song);
  };

  $scope.pauseSong = function(song) {
    SongPlayer.pause();
  };
}]);

// this gives the player bar controller access to the SongPlayer object (service) 
// by including it in the controller definition
blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
  $scope.songPlayer = SongPlayer;

  $scope.volumeClass = function() {
    return {
      'fa-volume-off': SongPlayer.volume == 0,
      'fa-volume-down': SongPlayer.volume <=70 && SongPlayer.volume > 0,
      'fa-volume-up': SongPlayer.volume > 70
    }
  }
  
  SongPlayer.onTimeUpdate(function(event, time) {
    $scope.$apply(function() {
      $scope.playTime = time;
    });
  });
}]);

blocJams.service('SongPlayer', function($rootScope) {
  var currentSoundFile = null;
  var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
  }

  return {
    currentSong: null,
    currentAlbum: null,
    playing: false,
    volume: 90,

    play: function() {
      this.playing = true;
      currentSoundFile.play();
    },
    pause: function() {
      this.playing = false;
      currentSoundFile.pause();
    },
    seek: function(time) {
      if (currentSoundFile) {
        currentSoundFile.setTime(time);
      }
    },
    onTimeUpdate: function(callback) {
      return $rootScope.$on('sound:timeupdate', callback);
    },
    setVolume: function(volume) {
      if(currentSoundFile){
        currentSoundFile.setVolume(volume);
      }
      this.volume = volume;
    },
    setSong: function(album, song) {
      if(currentSoundFile) {
        currentSoundFile.stop();
      }
      this.currentSong = song;
      this.currentAlbum = album;
      
      currentSoundFile = new buzz.sound(song.audioUrl, {
        formats: ["mp3"],
        preload: true
      });

      currentSoundFile.setVolume(this.volume);

      currentSoundFile.bind('timeupdate', function(e){
        $rootScope.$broadcast('sound:timeupdate', this.getTime());
      });

      this.play();
    },
    next: function() {
      var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
      currentTrackIndex++;
      if (currentTrackIndex >= this.currentAlbum.songs.length) {
        this.currentTrackIndex = 0;
      }
      var song = this.currentAlbum.songs[currentTrackIndex];
      this.setSong(this.currentAlbum, song);
    },
    previous: function() {
      var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
      currentTrackIndex--;
      if (currentTrackIndex < 0) {
        currentTrackIndex = this.currentAlbum.songs.length - 1;
      }
      var song = this.currentAlbum.songs[currentTrackIndex];
      this.setSong(this.currentAlbum, song);
    }
  };
});

// define what you call the directive as the first arg, then pass in the function of what you want it to do
blocJams.directive('slider', ['$document', function($document) {

  var calculateSliderPercentFromMouseEvent = function($slider, event) {
    var offsetX = event.pageX - $slider.offset().left;
    var sliderWidth = $slider.width();
    var offsetXPercent = (offsetX / sliderWidth);
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(1, offsetXPercent);
    return offsetXPercent;
  }

  var numberFromValue = function(value, defaultValue) {
    if (typeof value === 'number') {
      return value;
    }

    if (typeof value === 'undefined') {
      return defaultValue;
    } 

    if (typeof value == 'string') {
      return Number(value);
    }
  }

  return {
    templateUrl: '/templates/directives/slider.html',
    replace: true,
    restrict: 'E',
    scope: {
      onChange: '&'
    },
    link: function(scope, element, attributes) {
      scope.value = 0;
      scope.max = 100;
      var $seekBar = $(element);
      attributes.$observe('value', function(newValue) {
        scope.value = numberFromValue(newValue, 0);
      });

      attributes.$observe('max', function(newValue) {
        scope.max = numberFromValue(newValue, 100) || 100;
      });

      var percentString = function() {
        var value = scope.value || 0;
        var max = scope.max || 100;
        var percent = value / max * 100;
        return percent + "%";
      }

      scope.fillStyle = function() {
        return {width: percentString()};
      }

      scope.thumbStyle = function() {
        return {left: percentString()};
      } 

      scope.onClickSlider = function(event) {
        var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
        scope.value = percent * scope.max;
        notifyCallback(scope.value);
      }

      scope.trackThumb = function() {
        $document.bind('mousemove.thumb', function(event){
          var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
          scope.$apply(function(){
            scope.value = percent * scope.max;
            notifyCallback(scope.value);
          });
        });

        // cleanup
        $document.bind('mouseup.thumb', function() {
          $document.unbind('mousemove.thumb');
          $document.unbind('mouseup.thumb');
        });
      };

      var notifyCallback = function(newValue) {
        if(typeof scope.onChange === 'function') {
          scope.onChange({value: newValue});
        }
      };
    }
  }
}])

blocJams.filter('timecode', function(){
  return function(seconds) {
    var seconds = Number.parseFloat(seconds);

    // returned when no time is provided
    if (Number.isNaN(seconds)) {
      return '-:--';
    }

    // make it a whole number
    var wholeSeconds = Math.floor(seconds);
    var minutes = Math.floor(wholeSeconds / 60);
    var remainingSeconds = wholeSeconds % 60;
    
    var output = minutes + ':';

    // zero pad seconds, so 9 secs should be :09
    if (remainingSeconds < 10) {
      output += '0';
    }

    output += remainingSeconds;
    return output;
  }
})
});

;require.register("scripts/collection", function(exports, require, module) {
var buildAlbumThumbnail = function() {
   var template =
       '<div class="collection-album-container col-md-2">'
     + '  <div class="collection-album-image-container">'
     + '    <img src="/images/album-placeholder.png"/>'
     + '  </div>'
     + '  <div class="caption album-collection-info">'
     + '    <p>'
     + '      <a class="album-name" href="/album.html"> Album Name </a>'
     + '      <br/>'
     + '      <a href="/album.html"> Artist name </a>'
     + '      <br/>'
     + '      X songs'
     + '      <br/>'
     + '      X:XX total length'
     + '      <br/>'
     + '    </p>'
     + '  </div>'
     + '</div>';

  return $(template);
};

var buildAlbumOverlay = function(albumURL) {
  var template = 
      '<div class="collection-album-image-overlay">'
    + ' <div class="collection-overlay-content">'
    + '   <a class="collection-overlay-button" href="' + albumURL + '">'
    + '   <i class="fa fa-play"></i>'
    + '   </a>'
    + '   &nbsp;'
    + '   <a class="collection-overlay-button">'
    + '     <i class="fa fa-plus"></i>'
    + '   </a>'
    + ' </div>'
    + '</div>'
    ;
  return $(template);  
}

var updateCollectionView = function() {
  var $collection = $(".collection-container .row");
  $collection.empty();

  for (var i = 0; i < (Math.random() * 100 + 25); i++) {
      var $newThumbnail = buildAlbumThumbnail();
      $collection.append($newThumbnail);
    }

  var onHover = function(event) {
    $(this).append(buildAlbumOverlay("/album.html"));
  };

  var offHover = function(event) {
    $(this).find('.collection-album-image-overlay').remove();
  }

  $collection.find('.collection-album-image-container').hover(onHover, offHover);
};

if (document.URL.match(/\/collection.html/)) {
  // wait until the HTML is fully processed.
  $(document).ready(function() {
    updateCollectionView();
  });
}
});

;require.register("scripts/landing", function(exports, require, module) {
// when the page loads document, (document ready), there's a callback that gets the page to run the function that prints hello.
$(document).ready(function() {
  console.log("hello");
});

$(document).ready(function() {
  // this is a callback for when a click event happens on this element
  $('.hero-content h3').click(function() {
    var subText = $(this).text();
    $(this).text(subText + "!");
  });

  var onHoverAction = function(event) {
    console.log('Hover action triggered.');
    $(this).animate({'margin-top': '10px'});
  }
  
  var onHoverOffAction = function(event) {
    console.log('Hover off engaged');
    $(this).animate({'margin-top': '0px'});
  }

  $('.selling-points .point').hover(onHoverAction, onHoverOffAction);
});
});

;require.register("scripts/profile", function(exports, require, module) {
// holds the name of our tab button container for selection later in the function
var tabsContainer = ".user-profile-tabs-container";
// you would only call this function when a tab button is clicked
var selectTabHandler = function(event){
  $tab = $(this);
  $(tabsContainer + " li").removeClass('active');
  $tab.parent().addClass('active');
  selectedTabName = $tab.attr('href');
  console.log(selectedTabName);
  $(".tab-pane").addClass('hidden');
  $(selectedTabName).removeClass('hidden');
  event.preventDefault();
};

if (document.URL.match(/\/profile.html/)) {
  $(document).ready(function() {
    var $tabs = $(tabsContainer + " a");
    $tabs.click(selectTabHandler);
    $tabs[0].click();
  });
}
});

;
//# sourceMappingURL=app.js.map