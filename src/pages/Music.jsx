import {
  HiOutlineFastForward,
  HiOutlineMusicNote,
  HiOutlinePause,
  HiOutlinePlay,
  HiOutlineRewind,
  HiOutlineVolumeUp,
} from 'react-icons/hi';
import { Card, Button } from '../components/ui';
import { useMusic } from '../contexts/MusicContextStore';

export default function Music() {
  const music = useMusic();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Focus Music</h1>
        <p className="mt-1 text-sm text-text-muted">Calm local tracks for programming sessions</p>
      </div>

      <Card className="animate-fade-in overflow-hidden p-0">
        <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="border-b border-border p-6 lg:border-b-0 lg:border-r">
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg bg-surface-lighter/60 p-6 text-center">
              <div className={`mb-6 flex h-24 w-24 items-center justify-center rounded-2xl ${music.isPlaying ? 'bg-primary text-white animate-pulse-glow' : 'bg-surface-light text-text-muted'}`}>
                <HiOutlineMusicNote size={44} />
              </div>
              <p className="text-xs uppercase tracking-[0.22em] text-text-muted">Now Playing</p>
              <h2 className="mt-2 text-2xl font-bold">{music.currentTrack.title}</h2>
              <p className="mt-1 text-sm text-text-muted">{music.currentTrack.subtitle}</p>

              <div className="mt-8 flex items-center justify-center gap-3">
                <Button variant="outline" size="lg" onClick={music.previous} title="Previous track">
                  <HiOutlineRewind size={20} />
                </Button>
                <Button size="lg" onClick={music.toggle} className="min-w-[140px]">
                  {music.isPlaying ? <HiOutlinePause size={20} /> : <HiOutlinePlay size={20} />}
                  {music.isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button variant="outline" size="lg" onClick={music.next} title="Next track">
                  <HiOutlineFastForward size={20} />
                </Button>
              </div>

              <div className="mt-8 flex w-full max-w-sm items-center gap-3">
                <HiOutlineVolumeUp size={18} className="text-text-muted" />
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
                <span className="w-9 text-right text-xs text-text-muted">{Math.round(music.volume * 100)}%</span>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-2">
              {music.tracks.map((track, index) => {
                const active = index === music.currentIndex;

                return (
                  <button
                    key={track.src}
                    type="button"
                    onClick={() => music.playTrack(index)}
                    className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all ${
                      active
                        ? 'border-primary/40 bg-primary/10 text-text'
                        : 'border-transparent text-text-muted hover:border-border hover:bg-surface-lighter hover:text-text'
                    }`}
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-primary text-white' : 'bg-surface-lighter text-text-muted'}`}>
                      {active && music.isPlaying ? <HiOutlinePause size={18} /> : <HiOutlinePlay size={18} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{track.title}</p>
                      <p className="truncate text-xs">{track.subtitle}</p>
                    </div>
                    <span className="text-xs text-text-muted">{track.duration}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
