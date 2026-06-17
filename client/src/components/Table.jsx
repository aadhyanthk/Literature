import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Card from './Card';
import { useGameState } from '../hooks/useGameState';

export default function Table() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get('name') || 'Player';
  
  // Custom hook that auto-syncs with Firebase Realtime Database
  const { gameState, performAsk, performDeclare } = useGameState(roomId, playerName);

  if (!gameState) {
    return <div className="felt-table" style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><h2>Connecting to Game Server...</h2></div>;
  }

  const playerObj = gameState.players?.[playerName] || { team: '?', hand: [] };
  
  // Use mock hand if the player has no cards yet (before dealing)
  const hand = playerObj.hand.length > 0 ? playerObj.hand : [
    { rank: '4', suit: 'Hearts' },
    { rank: '5', suit: 'Hearts' },
    { rank: 'K', suit: 'Spades' }
  ];

  return (
    <div className="felt-table">
      {/* Top Bar Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>
        <h2>Room: {roomId} | Status: {gameState.status}</h2>
        <h2>Player: {playerName} (Team {playerObj.team})</h2>
      </div>

      {/* Center Action Area & Game Log */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
        
        {/* Turn Actions Box */}
        {gameState.turn === playerName ? (
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '15px', textAlign: 'center', border: '2px solid #ffb703', boxShadow: '0 0 15px #ffb703' }}>
            <h3 style={{ color: '#ffb703', margin: '0 0 15px 0' }}>It is your turn!</h3>
            <div style={{ display: 'flex', gap: '15px' }}>
              {/* These trigger the Firebase Database updates */}
              <button className="retro-btn" onClick={() => performAsk(playerName, 'Opponent', { rank: '8', suit: 'Hearts'})}>
                Ask for Card
              </button>
              <button className="retro-btn" onClick={() => performDeclare(playerName, 'Low Hearts', {})}>
                Declare Set
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px' }}>
            <h3 style={{ opacity: 0.8 }}>Waiting for {gameState.turn}'s move...</h3>
          </div>
        )}

        {/* Realtime Action Log */}
        <div style={{ marginTop: '30px', width: '400px', height: '200px', overflowY: 'auto', background: 'rgba(0,0,0,0.7)', padding: '15px', borderRadius: '10px', border: '1px solid #40916c' }}>
          <h4 style={{ borderBottom: '1px solid #40916c', paddingBottom: '5px', marginTop: 0 }}>Game Log</h4>
          {gameState.log && gameState.log.map((msg, i) => (
            <div key={i} style={{ margin: '5px 0', fontFamily: 'monospace' }}>&gt; {msg}</div>
          ))}
        </div>
      </div>

      {/* Player's Hand Area */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <h3>Your Hand</h3>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {hand.map((card, index) => (
            <Card key={index} rank={card.rank} suit={card.suit} />
          ))}
        </div>
      </div>
    </div>
  );
}
