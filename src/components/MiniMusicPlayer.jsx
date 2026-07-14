import {
  HiOutlineFastForward,
  HiOutlineMusicNote,
  HiOutlinePause,
  HiOutlinePlay,
  HiOutlineRewind,
  HiOutlineVolumeUp,
} from 'react-icons/hi';
import { useMusic } from '../contexts/MusicContextStore';

export default function MiniMusicPlayer() {
  const music = useMusic();

  if (!music?.hasStarted) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(360px,calc(100vw-2rem))] rounded-xl border border-border bg-surface-light/95 shadow-2xl backdrop-blur-md">
      <div className="flex items-center gap-3 p-3">
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${music.isPlaying ? 'bg-primary text-white' : 'bg-surface-lighter text-text-muted'}`}>
          <HiOutlineMusicNote size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-text">{music.currentTrack.title}</p>
          <p className="truncate text-xs text-text-muted">{music.currentTrack.subtitle}</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={music.previous}
            aria-label="Previous track"
            title="Previous track"
            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-lighter hover:text-text"
          >
            <HiOutlineRewind size={18} />
          </button>
          <button
            type="button"
            onClick={music.toggle}
            aria-label={music.isPlaying ? 'Pause music' : 'Play music'}
            title={music.isPlaying ? 'Pause music' : 'Play music'}
            className="rounded-lg bg-primary p-2 text-white transition-colors hover:bg-primary-dark"
          >
            {music.isPlaying ? <HiOutlinePause size={18} /> : <HiOutlinePlay size={18} />}
          </button>
          <button
            type="button"
            onClick={music.next}
            aria-label="Next track"
            title="Next track"
            className="rounded-lg p-2 text-text-muted transition-colors hover:bg-surface-lighter hover:text-text"
          >
            <HiOutlineFastForward size={18} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border px-3 py-2">
        <HiOutlineVolumeUp size={16} className="text-text-muted" />
        <input
          aria-label="Music volume"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={music.volume}
          onChange={event => music.setVolume(Number(event.target.value))}
          className="h-1 w-full accent-primary"
        />
      </div>
    </div>
  );
}
