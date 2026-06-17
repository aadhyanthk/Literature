import React from 'react';

export default function Card({ rank, suit }) {
  const isRed = suit === 'Hearts' || suit === 'Diamonds';
  const color = isRed ? '#d00000' : '#000000';
  
  const getSuitSymbol = (s) => {
    switch(s) {
      case 'Hearts': return '♥️';
      case 'Diamonds': return '♦️';
      case 'Clubs': return '♣️';
      case 'Spades': return '♠️';
      default: return '';
    }
  };

  return (
    <div style={{
      width: '80px',
      height: '120px',
      backgroundColor: '#fff',
      border: '2px solid #000',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '5px',
      color: color,
      fontFamily: 'sans-serif', // Standard clean font for card readability
      boxShadow: '2px 2px 5px rgba(0,0,0,0.5)',
      cursor: 'pointer',
      userSelect: 'none'
    }}>
      <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{rank}</div>
      <div style={{ fontSize: '2rem', textAlign: 'center' }}>{getSuitSymbol(suit)}</div>
      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', alignSelf: 'flex-end', transform: 'rotate(180deg)' }}>{rank}</div>
    </div>
  );
}
