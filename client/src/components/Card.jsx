import React from 'react';

export default function Card({ rank, suit, faceDown, small }) {
  const width = small ? '40px' : '80px';
  const height = small ? '60px' : '120px';

  if (faceDown) {
    return (
      <div style={{
        width,
        height,
        backgroundColor: '#003049',
        border: small ? '1px solid #fff' : '2px solid #fff',
        borderRadius: '4px',
        boxShadow: '2px 2px 5px rgba(0,0,0,0.5)',
        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, #d62828 5px, #d62828 10px)'
      }}></div>
    );
  }

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
      width,
      height,
      backgroundColor: '#fff',
      border: small ? '1px solid #000' : '2px solid #000',
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: small ? '2px' : '5px',
      color: color,
      fontFamily: 'sans-serif',
      boxShadow: '2px 2px 5px rgba(0,0,0,0.5)',
      cursor: 'pointer',
      userSelect: 'none'
    }}>
      <div style={{ fontSize: small ? '0.8rem' : '1.2rem', fontWeight: 'bold' }}>{rank}</div>
      <div style={{ fontSize: small ? '1.2rem' : '2rem', textAlign: 'center', lineHeight: '1' }}>{getSuitSymbol(suit)}</div>
      <div style={{ fontSize: small ? '0.8rem' : '1.2rem', fontWeight: 'bold', alignSelf: 'flex-end', transform: 'rotate(180deg)' }}>{rank}</div>
    </div>
  );
}
