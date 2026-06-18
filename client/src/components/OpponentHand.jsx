import React from 'react';
import Card from './Card';

export default function OpponentHand({ player }) {
  const numCards = player.hand ? player.hand.length : 0;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '10px', zIndex: 10 }}>
      <div style={{ 
        background: player.team === 'A' ? '#003049' : '#d62828', 
        color: 'white', 
        padding: '5px 15px', 
        borderRadius: '20px', 
        fontWeight: 'bold',
        marginBottom: '10px',
        border: '2px solid #ffb703',
        boxShadow: '0 4px 6px rgba(0,0,0,0.5)'
      }}>
        {player.name}
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '40px' }}>
        {Array.from({ length: numCards }).map((_, i) => (
          <div key={i} style={{ marginLeft: '-40px' }}>
            <Card faceDown={true} />
          </div>
        ))}
      </div>
    </div>
  );
}
