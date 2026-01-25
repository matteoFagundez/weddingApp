import { useEffect, useRef, useState } from "react";

const PLAYLIST_ID = "PLh_YeuldWOhroWUaiqZXNccLrTxYcsc6T";

export function PlaylistSection() {
  const playerRef = useRef<HTMLDivElement | null>(null);
  const ytPlayer = useRef<YT.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
    }

    window.onYouTubeIframeAPIReady = () => {
      ytPlayer.current = new window.YT.Player("yt-player", {
        height: "0",
        width: "0",
        playerVars: {
          listType: "playlist",
          list: PLAYLIST_ID,
        },
        events: {
          onStateChange: (event: YT.OnStateChangeEvent) => {
            setIsPlaying(event.data === YT.PlayerState.PLAYING);
          },
        },
      });
    };
  }, []);

  const togglePlay = () => {
    if (!ytPlayer.current) return;

    if (isPlaying) {
      ytPlayer.current.pauseVideo();
    } else {
      ytPlayer.current.playVideo();
    }
  };

  const nextSong = () => {
    ytPlayer.current?.nextVideo();
  };

  return (
    <section className="playlist-section">
      <h2 className="playlist-title">PLAY LIST</h2>

      <div className="playlist-bar">
        <span className="dot" />
      </div>

      <div className="playlist-controls">
        <button onClick={nextSong} className="control-btn">⏮</button>

        <button onClick={togglePlay} className="control-btn play">
          {isPlaying ? "⏸" : "▶"}
        </button>

        <button onClick={nextSong} className="control-btn">⏭</button>

        <span className="heart">♡</span>
      </div>

      <p className="playlist-text">
        Ayúdanos a ponerle ritmo a <br />
        este día tan especial
      </p>

      <a
        className="playlist-btn"
        href=" https://www.youtube.com/playlist?list=PLh_YeuldWOhroWUaiqZXNccLrTxYcsc6T&jct=sFjVPGxWfcxsB1NLuqnWvw"
        target="_blank"
        rel="noopener noreferrer"
      >
        AGREGAR CANCIÓN
      </a>

      <div id="yt-player" ref={playerRef} />
    </section>
  );
}
