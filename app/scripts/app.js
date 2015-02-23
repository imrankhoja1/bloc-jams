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
      { name: 'Blue', length: '4:26' },
      { name: 'Green', length: '3:14' },
      { name: 'Red', length: '5:01' },
      { name: 'Pink', length: '3:21' },
      { name: 'Magenta', length: '2:15' }
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

blocJams.controller('Landing.controller', ['$scope', 'ConsoleLogger', function($scope, ConsoleLogger) {
  $scope.title = "Bloc Jams";
  $scope.subText = "Turn the music up!";

  // $scope.text - input
  // $.watch()
  // when $scope.text value changes, we want to call ConsoleLogger.setMessage($scope.text);
  $scope.watch(ConsoleLogger.setMsg($scope.text)); 

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

blocJams.controller('Collection.controller', ['$scope', 'ConsoleLogger', function($scope, ConsoleLogger) {
  $scope.albums = [];
  for (var i = 0; i < 33; i++) {
    $scope.albums.push(angular.copy(albumPicasso));
  }
  ConsoleLogger.log();
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
    SongPlayer.play();
  };

  $scope.pauseSong = function(song) {
    SongPlayer.pause();
  };
}]);

// this gives the player bar controller access to the SongPlayer object (service) 
// by including it in the controller definition
blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', 'ConsoleLogger', function($scope, SongPlayer, ConsoleLogger) {
  $scope.songPlayer = SongPlayer;
  ConsoleLogger.log();
}]);

blocJams.service('SongPlayer', function() {
  return {
    currentSong: null,
    currentAlbum: null,
    playing: false,

    play: function() {
      this.playing = true;
    },
    pause: function() {
      this.playing = false;
    },
    setSong: function(album, song) {
      this.currentSong = song;
      this.currentAlbum = album;
    }
  };
});

blocJams.service('ConsoleLogger', function() {
  return {
    message: null,

    log: function() {
      console.log(message);
    },
    setMsg: function(message) {
      this.message = message;
    }
  };
})