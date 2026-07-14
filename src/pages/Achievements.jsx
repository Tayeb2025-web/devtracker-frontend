import { useState, useEffect } from 'react';
import { achievementApi } from '../services/api';
import { Card, LoadingSpinner } from '../components/ui';
import { ACHIEVEMENT_DEFS } from '../constants';

export default function Achievements() {
  const [unlocked, setUnlocked] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    achievementApi.getAll().then(res => setUnlocked(res.data || [])).finally(() => setLoading(false));
  }, []);

  const unlockedKeys = new Set(unlocked.map(a => a.badge_key));

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Achievements</h1>
        <p className="text-text-muted text-sm mt-1">
          {unlocked.length} of {ACHIEVEMENT_DEFS.length} badges unlocked
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ACHIEVEMENT_DEFS.map(badge => {
          const isUnlocked = unlockedKeys.has(badge.key);
          const unlockData = unlocked.find(a => a.badge_key === badge.key);

          return (
            <Card
              key={badge.key}
              className={`animate-fade-in transition-all ${isUnlocked ? 'border-accent/30' : 'opacity-50 grayscale'}`}
            >
              <div className="flex items-start gap-4">
                <div className={`text-4xl ${isUnlocked ? '' : 'opacity-40'}`}>{badge.icon}</div>
                <div>
                  <h3 className="font-semibold">{badge.name}</h3>
                  <p className="text-text-muted text-xs mt-1">{badge.description}</p>
                  {isUnlocked && unlockData && (
                    <p className="text-accent text-xs mt-2">
                      Unlocked {new Date(unlockData.unlocked_at).toLocaleDateString()}
                    </p>
                  )}
                  {!isUnlocked && (
                    <p className="text-text-muted text-xs mt-2">🔒 Locked</p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
