(function() {
  function SongPlayer($rootScope, Fixtures) {
    var SongPlayer = {};

    /**
    * @desc Buzz object audio file
    * @type {Object}
    */
    var currentBuzzObject = null;

    /**
    * @function setSong
    * @desc Stops the currently playing song and loads new audio file as currentBuzzObject
    * @param {Object} song
    */
    var setSong = function(song) {
      if (currentBuzzObject) {
        stopSong(SongPlayer.currentSong);
      }

      currentBuzzObject = new buzz.sound(song.audioUrl, {
        formats: ['mp3'],
        preload: true
      });

        currentBuzzObject.bind('timeupdate', function() {
         $rootScope.$apply(function() {
             SongPlayer.currentTime = currentBuzzObject.getTime();
         });
     });
        
      SongPlayer.currentSong = song;
    }

    /**
    * @function playSong
    * @desc Plays the currentBuzzObject and sets the song's playing status to true
    * @param {Object} song
    */
    var playSong = function(song) {
      currentBuzzObject.play();
      song.playing = true;
    }
    
    /**
    * @function stopSong
    * @desc Stops the currentBuzzObject and sets the songs playing status to false
    * @param {Object} song
    */
    var stopSong = function(song) {
        currentBuzzObject.stop();
        song.playing = false;
    }

    /**
    * @function getSongIndex
    * @desc Gets the index of the selected song from the album data
    * @param {Object} song
    */
    var getSongIndex = function(song) {
      return SongPlayer.currentAlbum.songs.indexOf(song);
    };

    /**
    * @desc Active album object
    * @type {Object}
    */
   SongPlayer.currentAlbum = Fixtures.getAlbum();

    /**
    * @desc Active song object from list of songs
    * @type {Object}
    */
    SongPlayer.currentSong = null;
      
/**
 * @desc Current playback time (in seconds) of currently playing song
 * @type {Number}
 */
 SongPlayer.currentTime = null;
      
    /**
    * @function play
    * @desc Plays the selected song by calling the setSong and playSong functions
    * @param {Object} song
    */
    SongPlayer.play = function(song) {
      song = song || SongPlayer.currentSong;
      if (SongPlayer.currentSong !== song) {
        setSong(song);
        playSong(song);
      } else if (SongPlayer.currentSong === song) {
        if (currentBuzzObject.isPaused()) {
          playSong(song);
        }
      }
    };

    /**
    * @function pause
    * @desc Pauses the selected song
    * @param {Object} song
    */
    SongPlayer.pause = function(song) {
      song = song || SongPlayer.currentSong;
      currentBuzzObject.pause();
      song.playing = false;
    };

    /**
    * @function previous
    * @desc Finds the index of the currentSong and decrements it by one
    */
    SongPlayer.previous = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex--;

      if (currentSongIndex < 0) {
        stopSong(SongPlayer.currentSong);
      } else {
        var song = SongPlayer.currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };
      
/**
* @function next
* @desc Plays the song after the current song in the list
*/
      SongPlayer.next = function() {
        var currentSongIndex = getSongIndex(SongPlayer.currentSong);
        currentSongIndex++;
          
        if (currentSongIndex >= SongPlayer.currentAlbum.songs.length) {
          stopSong(SongPlayer.currentSong);
        } else {
            var song = SongPlayer.currentAlbum.songs[currentSongIndex];
            setSong(song);
            playSong(song);
        }
      };

/**
 * @function setCurrentTime
 * @desc Set current time (in seconds) of currently playing song
 * @param {Number} time
 */
    SongPlayer.setCurrentTime = function(time) {
     if (currentBuzzObject) {
         currentBuzzObject.setTime(time);
     }
 };
      
    return SongPlayer;
  }

  angular
    .module('blocJams')
    .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();