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
    const getBubbleConfig = (asker, target) => {
      const isPlayer = asker === playerName || target === playerName;
      const isTop = asker === 'Bot1' || target === 'Bot1';
      const isLeft = asker === 'Bot2' || target === 'Bot2';
      const isRight = asker === 'Bot3' || target === 'Bot3';
      
      const t = 'translate(-50%, -50%)';

      if (isPlayer && isLeft) {
         if (asker === playerName) return { bottom: '25%', left: '15%', transform: t, tail: 'down-right' };
         else return { bottom: '25%', left: '15%', transform: t, tail: 'left-up' };
      }
      if (isPlayer && isRight) {
         if (asker === playerName) return { bottom: '25%', right: '15%', transform: t, tail: 'down-left' };
         else return { bottom: '25%', right: '15%', transform: t, tail: 'right-up' };
      }
      if (isTop && isLeft) {
         if (asker === 'Bot1') return { top: '30%', left: '15%', transform: t, tail: 'up-right' };
         else return { top: '30%', left: '15%', transform: t, tail: 'left-down' };
      }
      if (isTop && isRight) {
         if (asker === 'Bot1') return { top: '30%', right: '15%', transform: t, tail: 'up-left' };
         else return { top: '30%', right: '15%', transform: t, tail: 'right-down' };
      }
      
      return { top: '50%', left: '50%', transform: t, tail: 'down' };
    };

    const config = getBubbleConfig(event.asker, event.target);

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
