import React, { useRef, useState, useEffect } from "react";
import "../css/customaudioplayer.css";

export default function CustomAudioPlayer({ src, snippet }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);

  // Format seconds → MM:SS
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  // Handle Play/Pause
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.currentTime = 0;
      audio.play();
      setIsPlaying(true);
    }
  };

  // When audio loads metadata (duration available)
  const onLoadedMetadata = () => {
    const audio = audioRef.current;
    setDuration(audio.duration);
  };

  // Sync time + progress bar while playing
  const onTimeUpdate = () => {
    const audio = audioRef.current;

    if (audio.currentTime >= snippet) {
      audio.pause();
      audio.currentTime = snippet;
      setCurrentTime(snippet);
      setProgress(100);
      setIsPlaying(false);
      return;
    }




    setCurrentTime(audio.currentTime);
    setProgress((audio.currentTime / snippet) * 100);
    {/*setProgress((audio.currentTime / audio.duration) * 100);*/}
  };

  // Seek when clicking progress bar
  const handleProgressChange = (e) => {
    const audio = audioRef.current;
    const newTime = (e.target.value / 100) * audio.duration;
    audio.currentTime = newTime;
    setProgress(e.target.value);
  };

  // Volume control
  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    const newVolume = e.target.value;
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  // reset audio whenever src or snippet changes
  useEffect(() => {
    const audio = audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
    setCurrentTime(0);
  }, [src, snippet]);

  return (
    <div className="custom-player">
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
      />

      {/* TITLE BAR */}
      <div className="player-header">
        <h4>Now Playing</h4>
      </div>

      {/* PLAY / PAUSE BUTTON */}
      {/* <div className="player-controls">
        <button className="play-btn" onClick={togglePlay}>
          {isPlaying ? "⏸" : "▶"}
        </button>
      </div> */}

      {/* PROGRESS BAR */}
      <div className="progress-wrap">
        <button className="play-btn" onClick={togglePlay}>
          {isPlaying ? "⏸" : "▶"}
        </button>
        <span>{formatTime(currentTime)}</span>
        <input
          type="range"
          className="progress-bar"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
        />
        <span>{formatTime(snippet)}</span>
        {/*<span>{formatTime(duration)}</span>*/}
      </div>

      {/* VOLUME SLIDER */}
      <div className="volume-wrap">
        <span>🔊</span>
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
    </div>
  );
}
