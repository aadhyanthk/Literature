import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Card from './Card';

export default function Table() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get('name');

  // Placeholder for the hand to show the UI
  const mockHand = [
    { rank: '4', suit: 'Hearts' },
    { rank: '5', suit: 'Hearts' },
    { rank: 'K', suit: 'Spades' },
    { rank: 'A', suit: 'Clubs' }
  ];

  return (
    <div className="felt-table">
      {/* Top Bar Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>
        <h2>Room: {roomId}</h2>
        <h2>Player: {playerName}</h2>
      </div>

      {/* Center of Table (Opponents / Play Area) */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ opacity: 0.5 }}>Waiting for players... (Opponent avatars will go here)</p>
      </div>

      {/* Player's Hand Area at the Bottom */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <h3>Your Hand</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          {mockHand.map((card, index) => (
            <Card key={index} rank={card.rank} suit={card.suit} />
          ))}
        </div>
      </div>
    </div>
  );
}
