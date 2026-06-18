import React, { useEffect, useState } from 'react';
import Card from './Card';

export default function EventBubble({ event, playerName }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (event) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3800);
      return () => clearTimeout(timer);
    }
  }, [event?.timestamp]);

  if (!show || !event || event.type !== 'ASK') return null;

  const getPos = (name) => {
    if (name === playerName) return { bottom: '150px', left: '50%', transform: 'translateX(-50%)' };
    if (name === 'Bot1') return { top: '50%', left: '120px', transform: 'translateY(-50%)' };
    if (name === 'Bot3') return { top: '50%', right: '120px', transform: 'translateY(-50%)' };
    return { top: '120px', left: '50%', transform: 'translateX(-50%)' };
  };

  const bubblePos = getPos(event.asker);

  return (
    <div className="event-bubble" style={{
      position: 'absolute',
      ...bubblePos,
      background: 'white',
      color: 'black',
      padding: '10px 20px',
      borderRadius: '20px',
      border: '4px solid #ffb703',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
      fontFamily: 'monospace',
      fontSize: '1.2rem'
    }}>
      <div style={{ fontWeight: 'bold' }}>Got the {event.card.rank} of {event.card.suit}?</div>
      <div style={{ transform: 'scale(0.5)', margin: '-30px -10px' }}>
         <Card rank={event.card.rank} suit={event.card.suit} small={false} />
      </div>
      <div style={{ fontSize: '2rem' }}>
        {event.success ? '✅' : '❌'}
      </div>
    </div>
  );
}
