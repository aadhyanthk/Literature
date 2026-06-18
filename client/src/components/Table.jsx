import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Card from './Card';
import AskModal from './AskModal';
import DeclareModal from './DeclareModal';
import Notebook from './Notebook';
import OpponentHand from './OpponentHand';
import EventBubble from './EventBubble';
import { useGameState } from '../hooks/useGameState';
import { getBotAction } from '../bots/botEngine';

export default function Table() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const playerName = searchParams.get('name') || 'Player';
  const mode = searchParams.get('mode');
  
  const [isAskModalOpen, setAskModalOpen] = useState(false);
  const [isDeclareModalOpen, setDeclareModalOpen] = useState(false);
  const [isNotebookOpen, setNotebookOpen] = useState(false);

  // Custom hook that auto-syncs with Firebase Realtime Database
  const { gameState, performAsk, performDeclare } = useGameState(roomId, playerName, mode);

  // Bot logic
  useEffect(() => {
    if (!gameState) return;
    
    // Check if it's a bot's turn
    const turnPlayer = gameState.players[gameState.turn];
    if (turnPlayer && turnPlayer.isBot) {
      // It's a bot's turn. Simulate thinking, then act.
      const timer = setTimeout(() => {
        const action = getBotAction(gameState, turnPlayer.name, 'Medium');
        if (action) {
           if (action.type === 'ASK') {
              performAsk(turnPlayer.name, action.opponent, action.card);
           }
        } else {
           // Fallback if bot is stuck
           performAsk(turnPlayer.name, playerName, { rank: 'Random', suit: 'Card' });
        }
      }, 2500); // 2.5 second delay
      return () => clearTimeout(timer);
    }
  }, [gameState, playerName]);

  // Log events to console instead of UI
  useEffect(() => {
    if (gameState?.log && gameState.log.length > 0) {
      console.log("%cGAME EVENT:", "color: #ffb703; font-weight: bold", gameState.log[gameState.log.length - 1]);
    }
  }, [gameState?.log?.length]);

  if (!gameState) {
    return <div className="felt-table" style={{ color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><h2>Connecting to Game Server...</h2></div>;
  }

  const playerObj = gameState.players?.[playerName] || { team: '?', hand: [] };
  
  const opponents = Object.keys(gameState.players || {}).filter(p => gameState.players[p].team !== playerObj.team);
  const teamMembers = Object.keys(gameState.players || {}).filter(p => gameState.players[p].team === playerObj.team);
  
  // Use mock hand if the player has no cards yet (before dealing)
  const hand = (playerObj.hand && playerObj.hand.length > 0) ? playerObj.hand : [
    { rank: '4', suit: 'Hearts' },
    { rank: '5', suit: 'Hearts' },
    { rank: 'K', suit: 'Spades' }
  ];

  const otherPlayers = Object.values(gameState.players || {}).filter(p => p.name !== playerName);
  const teammate = otherPlayers.find(p => p.team === playerObj.team);
  const opponents = otherPlayers.filter(p => p.team !== playerObj.team);

  return (
    <div className="felt-table" style={{ overflow: 'hidden', position: 'relative' }}>
      <Notebook isOpen={isNotebookOpen} toggleNotebook={() => setNotebookOpen(!isNotebookOpen)} />
      
      {/* Top Bar Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>
        <h2>Room: {roomId} | Status: {gameState.status}</h2>
        <h2>Player: {playerName} (Team {playerObj.team})</h2>
      </div>

      {/* Opponents Area */}
      {teammate && <OpponentHand key={teammate.name} player={teammate} position="top" />}
      {opponents[0] && <OpponentHand key={opponents[0].name} player={opponents[0]} position="left" />}
      {opponents[1] && <OpponentHand key={opponents[1].name} player={opponents[1]} position="right" />}

      {/* Action Animation Bubbles */}
      <EventBubble event={gameState.lastEvent} playerName={playerName} />

      {/* Center Action Area */}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Turn Actions Box */}
        {gameState.turn === playerName ? (
          <div style={{ background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '15px', textAlign: 'center', border: '2px solid #ffb703', boxShadow: '0 0 15px #ffb703' }}>
            <h3 style={{ color: '#ffb703', margin: '0 0 15px 0' }}>It is your turn!</h3>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button className="retro-btn" onClick={() => setAskModalOpen(true)}>
                Ask for Card
              </button>
              <button className="retro-btn" onClick={() => setDeclareModalOpen(true)}>
                Declare Set
              </button>
            </div>
          </div>
        ) : (
          <div style={{ padding: '20px' }}>
            <h3 style={{ opacity: 0.8 }}>Waiting for {gameState.turn}'s move...</h3>
          </div>
        )}
      </div>

      {/* Player's Hand Area */}
      <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
        <h3 style={{ margin: '5px' }}>Your Hand</h3>
        <div style={{ display: 'flex', justifyContent: 'center', marginLeft: '30px' }}>
          {hand.map((card, index) => (
            <div key={index} className="player-card" style={{ marginLeft: '-30px' }}>
              <Card rank={card.rank} suit={card.suit} small={false} />
            </div>
          ))}
        </div>
      </div>

      <AskModal 
        isOpen={isAskModalOpen} 
        onClose={() => setAskModalOpen(false)} 
        opponents={opponents}
        onAsk={(opponent, card) => performAsk(playerName, opponent, card)}
      />

      <DeclareModal 
        isOpen={isDeclareModalOpen} 
        onClose={() => setDeclareModalOpen(false)} 
        teamMembers={teamMembers}
        onDeclare={(set, allocations) => performDeclare(playerName, set, allocations)}
      />
    </div>
  );
}
