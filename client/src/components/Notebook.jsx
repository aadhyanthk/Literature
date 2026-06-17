import React, { useState } from 'react';

export default function Notebook({ isOpen, toggleNotebook }) {
  const [notes, setNotes] = useState('');

  return (
    <div style={{
      position: 'fixed',
      right: isOpen ? '0' : '-350px',
      top: 0,
      width: '350px',
      height: '100vh',
      background: '#fdf6e3',
      borderLeft: '4px solid #ffb703',
      transition: 'right 0.3s ease',
      boxShadow: isOpen ? '-5px 0 15px rgba(0,0,0,0.5)' : 'none',
      zIndex: 1000,
      color: '#333',
      fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif'
    }}>
      
      {/* Toggle Button */}
      <button 
        onClick={toggleNotebook}
        style={{
          position: 'absolute',
          left: '-40px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#ffb703',
          border: 'none',
          padding: '10px',
          cursor: 'pointer',
          borderRadius: '5px 0 0 5px',
          fontWeight: 'bold',
          color: '#003049'
        }}
      >
        {isOpen ? '►' : '◄'}
      </button>

      <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ borderBottom: '2px dashed #ccc', paddingBottom: '10px', marginTop: 0 }}>My Notebook</h2>
        <p style={{ fontSize: '0.9em', color: '#666' }}>Use this space to track who asked for what cards!</p>
        
        <textarea 
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="e.g., Alice asked for 5 of Hearts..."
          style={{
            flex: 1,
            width: '100%',
            background: 'transparent',
            border: 'none',
            resize: 'none',
            outline: 'none',
            fontSize: '1.1em',
            lineHeight: '1.5',
            backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, #ccc 31px, #ccc 32px)',
            backgroundAttachment: 'local'
          }}
        />
      </div>
    </div>
  );
}
