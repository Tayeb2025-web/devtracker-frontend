import { useState, useEffect } from 'react';
import { challengeApi } from '../services/api';
import { Card, ProgressBar, LoadingSpinner, Badge } from '../components/ui';

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    challengeApi.getAll().then(res => setChallenges(res.data || [])).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold">Challenges</h1>
        <p className="text-text-muted text-sm mt-1">Push yourself with study challenges</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challenges.map(challenge => {
          const isCompleted = challenge.status === 'completed';

          return (
            <Card key={challenge.id} className={`animate-fade-in ${isCompleted ? 'border-accent/30' : ''}`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{challenge.challenge_name}</h3>
                {isCompleted ? (
                  <Badge color="accent">Completed!</Badge>
                ) : (
                  <Badge color="primary">Active</Badge>
                )}
              </div>
              <p className="text-text-muted text-sm mb-4">{challenge.challenge_description}</p>
              <ProgressBar
                value={challenge.current_value}
                max={challenge.target_value}
                color={isCompleted ? 'accent' : 'primary'}
              />
              <p className="text-xs text-text-muted mt-2">
                {challenge.current_value} / {challenge.target_value} {challenge.unit}
              </p>
              {isCompleted && challenge.completed_at && (
                <p className="text-accent text-xs mt-2">
                  Completed on {new Date(challenge.completed_at).toLocaleDateString()}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
