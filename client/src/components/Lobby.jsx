import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Lobby() {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!playerName) return alert("Please enter your name!");
    // Generate a random 6-character room code
    const newRoom = Math.random().toString(36).substring(2, 8).toUpperCase();
    navigate(`/room/${newRoom}?name=${playerName}`);
  };

  const handleJoin = () => {
    if (!playerName) return alert("Please enter your name!");
    if (!roomCode) return alert("Please enter a room code!");
    navigate(`/room/${roomCode}?name=${playerName}`);
  };

  return (
    <div className="lobby-container">
      <h1 style={{ fontSize: '3rem', marginBottom: '10px' }}>♠️ Literature ♣️</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '40px' }}>A retro multiplayer card game</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
        <input 
          placeholder="Your Name" 
          value={playerName} 
          onChange={e => setPlayerName(e.target.value)}
          style={{ padding: '10px', fontSize: '1.2rem', fontFamily: 'inherit', textAlign: 'center' }}
        />
        
        <button className="retro-btn" onClick={handleCreate} style={{ width: '100%' }}>Create New Room</button>
        
        <h2 style={{ margin: '10px 0' }}>OR</h2>

        <div style={{ display: 'flex', gap: '10px' }}>
          <input 
            placeholder="Room Code" 
            value={roomCode} 
            onChange={e => setRoomCode(e.target.value.toUpperCase())}
            style={{ padding: '10px', fontSize: '1.2rem', fontFamily: 'inherit', width: '150px', textAlign: 'center' }}
          />
          <button className="retro-btn" onClick={handleJoin}>Join</button>
        </div>
      </div>
    </div>
  );
}
