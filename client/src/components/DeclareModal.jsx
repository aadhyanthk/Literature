import React, { useState } from 'react';

export default function DeclareModal({ isOpen, onClose, teamMembers, onDeclare }) {
  const [selectedSet, setSelectedSet] = useState('');
  const [allocations, setAllocations] = useState({});

  if (!isOpen) return null;

  const sets = [
    'Low Hearts', 'High Hearts', 
    'Low Spades', 'High Spades',
    'Low Diamonds', 'High Diamonds',
    'Low Clubs', 'High Clubs',
    'Eights'
  ];

  const getCardsForSet = (setName) => {
    if (!setName) return [];
    if (setName === 'Eights') return ['8 of Hearts', '8 of Spades', '8 of Diamonds', '8 of Clubs'];
    
    const [half, suit] = setName.split(' ');
    const ranks = half === 'Low' ? ['2','3','4','5','6','7'] : ['9','10','J','Q','K','A'];
    return ranks.map(r => `${r} of ${suit}`);
  };

  const handleAllocationChange = (card, player) => {
    setAllocations(prev => ({ ...prev, [card]: player }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cards = getCardsForSet(selectedSet);
    const allAllocated = cards.every(c => allocations[c]);
    
    if (selectedSet && allAllocated) {
      onDeclare(selectedSet, allocations);
      onClose();
    } else {
      alert("Please allocate all cards in the set to a team member.");
    }
  };

  const cardsInSet = getCardsForSet(selectedSet);

  return (
    <div style={modalOverlayStyle}>
      <div style={modalStyle}>
        <h3 style={{marginTop: 0, color: '#ffb703'}}>Declare a Set</h3>
        <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
          
          <div>
            <label style={{display:'block', marginBottom:'5px'}}>Set:</label>
            <select value={selectedSet} onChange={e => {setSelectedSet(e.target.value); setAllocations({});}} required style={inputStyle}>
              <option value="">Select set...</option>
              {sets.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {selectedSet && (
            <div style={{ maxHeight: '250px', overflowY: 'auto', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '5px' }}>
              {cardsInSet.map(card => (
                <div key={card} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                  <span style={{fontSize: '0.9em', flex: 1}}>{card}</span>
                  <select 
                    value={allocations[card] || ''} 
                    onChange={e => handleAllocationChange(card, e.target.value)}
                    required
                    style={{...inputStyle, width: '120px', padding: '5px'}}
                  >
                    <option value="">Who has it?</option>
                    {teamMembers.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}

          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
            <button type="button" onClick={onClose} className="retro-btn" style={{background: '#d62828', fontSize: '0.9em', padding: '8px 15px'}}>Cancel</button>
            <button type="submit" className="retro-btn" style={{fontSize: '0.9em', padding: '8px 15px'}}>Declare</button>
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
  width: '380px',
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
