import React from 'react';
import Card from './Card';

export default function OpponentHand({ player, position }) {
  const numCards = player.hand ? player.hand.length : 0;
  
  const positionStyles = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 10
  };

  if (position === 'left') {
    Object.assign(positionStyles, { left: '20px', top: '50%', transform: 'translateY(-50%)' });
  } else if (position === 'right') {
    Object.assign(positionStyles, { right: '20px', top: '50%', transform: 'translateY(-50%)' });
  } else if (position === 'top') {
    Object.assign(positionStyles, { top: '20px', left: '50%', transform: 'translateX(-50%)' });
  } else {
    Object.assign(positionStyles, { position: 'relative', margin: '10px' });
  }

  return (
    <div style={positionStyles}>
      <div style={{ 
        background: player.team === 'A' ? '#003049' : '#d62828', 
        color: 'white', 
        padding: '3px 10px', 
        borderRadius: '15px', 
        fontWeight: 'bold',
        marginBottom: '5px',
        border: '2px solid #ffb703',
        boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
        fontSize: '0.8rem'
      }}>
        {player.name}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '20px' }}>
        {Array.from({ length: numCards }).map((_, i) => (
          <div key={i} style={{ marginLeft: '-20px' }}>
            <Card faceDown={true} small={true} />
          </div>
        ))}
      </div>
    </div>
  );
}
