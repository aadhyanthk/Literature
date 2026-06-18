import React, { useEffect, useState } from 'react';
import Card from './Card';

export default function EventBubble({ event, playerName }) {
  const [phase, setPhase] = useState('hidden');

  useEffect(() => {
    if (event) {
      setPhase('ask');
      const t1 = setTimeout(() => setPhase('result'), 2000);
      const t2 = setTimeout(() => setPhase('hidden'), 4000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [event?.timestamp]);

  if (phase === 'hidden' || !event) return null;

  if (event.type === 'DECLARE') {
    return (
      <div className="event-bubble" style={{ ...bubbleStyle(), left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <h3 style={{ margin: '5px 0' }}>{event.player} declared {event.suitName}!</h3>
        {phase === 'result' && (
          <h2 style={{ color: event.success ? 'green' : 'red', margin: '5px 0' }}>
            {event.success ? '✅ CORRECT (+1 ⭐)' : '❌ WRONG (Opponents +1 ⭐)'}
          </h2>
        )}
      </div>
    );
  }

  if (event.type === 'ASK') {
    const getBubbleConfig = (name) => {
      if (name === playerName) return { bottom: '160px', left: '50%', transform: 'translateX(-50%)', tail: 'down' };
      if (name === 'Bot1') return { left: '160px', top: '50%', transform: 'translateY(-50%)', tail: 'left' };
      if (name === 'Bot3') return { right: '160px', top: '50%', transform: 'translateY(-50%)', tail: 'right' };
      return { top: '160px', left: '50%', transform: 'translateX(-50%)', tail: 'up' };
    };

    const config = getBubbleConfig(event.asker);

    return (
      <div className={`event-bubble tail-${config.tail}`} style={{ ...bubbleStyle(), ...config }}>
        <div style={{ fontSize: '0.9em', color: '#666', borderBottom: '1px solid #ddd', paddingBottom: '5px', marginBottom: '5px' }}>
          {event.asker} ➔ {event.target}
        </div>
        
        {phase === 'ask' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <b>Got the {event.card.rank} of {event.card.suit}?</b>
            <div style={{ transform: 'scale(0.5)', margin: '-30px -10px' }}>
               <Card rank={event.card.rank} suit={event.card.suit} small={false} />
            </div>
          </div>
        )}

        {phase === 'result' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ transform: 'scale(0.5)', margin: '-30px -10px' }}>
               <Card rank={event.card.rank} suit={event.card.suit} small={false} />
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {event.success ? '✅ Yes!' : '❌ Nope.'}
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}

const bubbleStyle = () => ({
  position: 'absolute',
  background: 'white',
  color: 'black',
  padding: '10px 20px',
  borderRadius: '20px',
  border: '4px solid #ffb703',
  zIndex: 100,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
  fontFamily: 'monospace',
  fontSize: '1.2rem',
  transition: 'opacity 0.3s'
});
