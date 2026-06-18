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
      <div style={bubbleStyle(50, 50)}>
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
    const getCoords = (name) => {
      if (name === playerName) return { x: 50, y: 90 };
      if (name === 'Bot1') return { x: 10, y: 50 };
      if (name === 'Bot3') return { x: 90, y: 50 };
      return { x: 50, y: 15 };
    };

    const askerCoords = getCoords(event.asker);
    const targetCoords = getCoords(event.target);
    const midX = (askerCoords.x + targetCoords.x) / 2;
    const midY = (askerCoords.y + targetCoords.y) / 2;

    return (
      <div style={bubbleStyle(midX, midY)}>
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

const bubbleStyle = (x, y) => ({
  position: 'absolute',
  left: `${x}%`,
  top: `${y}%`,
  transform: 'translate(-50%, -50%)',
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
