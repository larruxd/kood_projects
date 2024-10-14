export function createMusicPlayer(MINI) {
  // Define the playlist
  const link = 'https://up.ezy.ee/updir/audio/';
  const playlist = [`${link}t01.mp3`, `${link}t02.mp3`, `${link}t03.mp3`, `${link}t04.mp3`, `${link}t05.mp3`];

  let currentTrackIndex = 0;

  // Create the audio element with default controls enabled
  const audioElement = MINI.tag.audio(
    {
      src: playlist[currentTrackIndex],
      controls: true,
      autoplay: true,
      id: 'audioPlayer', // Ensure the audio element has an ID for easy reference
    },
    {},
    {}
  );

  // Function to play the next track
  function playNextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % playlist.length; // Move to the next track in the playlist
    const audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer) {
      audioPlayer.src = playlist[currentTrackIndex]; // Update the source
      audioPlayer.play(); // Play the new track
    }
  }

  // Add an event listener to play the next track when the current one ends
  document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audioPlayer');
    if (audioPlayer) {
      audioPlayer.addEventListener('ended', playNextTrack);
      audioPlayer.volume = 0.05;
    }
  });

  // Return the audio element wrapped in a div
  const musicPlayerDiv = MINI.tag.div({ id: 'musicPlayerContainer' }, {}, {}, audioElement);

  return musicPlayerDiv;
}
