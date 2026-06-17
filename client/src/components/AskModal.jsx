import React, { useState } from 'react';

export default function AskModal({ isOpen, onClose, opponents, onAsk }) {
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedRank, setSelectedRank] = useState('');
  const [selectedSuit, setSelectedSuit] = useState('');

  if (!isOpen) return null;

  const ranks = ['2','3','4','5','6','7','9','10','J','Q','K','A'];
  const suits = ['Hearts', 'Spades', 'Diamonds', 'Clubs'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedPlayer && selectedRank && selectedSuit) {
      onAsk(selectedPlayer, { rank: selectedRank, suit: selectedSuit });
      onClose();
    }
  };

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <h3 style={{marginTop: 0, color: '#ffb703'}}>Ask for a Card</h3>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          
          <div>
            <label style={{display:'block', marginBottom:'5px'}}>Opponent:</label>
            <select value={selectedPlayer} onChange={e => setSelectedPlayer(e.target.value)} required style={inputStyle}>
              <option value="">Select player...</option>
              {opponents.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{display:'block', marginBottom:'5px'}}>Rank:</label>
            <select value={selectedRank} onChange={e => setSelectedRank(e.target.value)} required style={inputStyle}>
              <option value="">Select rank...</option>
              {ranks.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>

          <div>
            <label style={{display:'block', marginBottom:'5px'}}>Suit:</label>
            <select value={selectedSuit} onChange={e => setSelectedSuit(e.target.value)} required style={inputStyle}>
              <option value="">Select suit...</option>
              {suits.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
            <button type="button" onClick={onClose} className="retro-btn" style={{background: '#d62828', fontSize: '0.9em', padding: '8px 15px'}}>Cancel</button>
            <button type="submit" className="retro-btn" style={{fontSize: '0.9em', padding: '8px 15px'}}>Ask</button>
          </div>
        </form>
      </div>
    </div>
  );
}

const modalOverlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 100
};

const modalStyle = {
  background: '#003049',
  padding: '20px',
  borderRadius: '10px',
  border: '2px solid #ffb703',
  width: '300px',
  color: 'white',
  boxShadow: '0 0 20px rgba(0,0,0,0.8)'
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  background: '#001a2c',
  color: 'white',
  border: '1px solid #ffb703',
  borderRadius: '5px'
};
