// Bot Engine for Single Player Literature

export function getBotAction(gameState, botName, difficulty = 'Medium') {
  const playerObj = gameState.players[botName];
  if (!playerObj || !playerObj.hand) return null;

  const myHand = playerObj.hand;
  const opponents = Object.keys(gameState.players).filter(p => gameState.players[p].team !== playerObj.team);
  
  if (opponents.length === 0 || myHand.length === 0) return null;

  // Find valid asks: a card in a half-suit we have, but not the exact card we hold.
  const validAsks = [];
  
  // Helper to determine the half-suit and all its members
  const getHalfSuit = (card) => {
    if (card.rank === '8') return { name: 'Eights', members: ['8 of Hearts', '8 of Spades', '8 of Diamonds', '8 of Clubs'] };
    
    const isLow = ['2','3','4','5','6','7'].includes(card.rank);
    const ranks = isLow ? ['2','3','4','5','6','7'] : ['9','10','J','Q','K','A'];
    const name = `${isLow ? 'Low' : 'High'} ${card.suit}`;
    
    return { name, members: ranks.map(r => `${r} of ${card.suit}`) };
  };

  const handSetNames = new Set(myHand.map(c => getHalfSuit(c).name));
  
  // Collect all possible missing cards in the sets we own
  handSetNames.forEach(setName => {
    // Reconstruct half suit properties from its name to find missing cards
    let members = [];
    let suit = '';
    
    if (setName === 'Eights') {
      members = ['8 of Hearts', '8 of Spades', '8 of Diamonds', '8 of Clubs'];
    } else {
      const parts = setName.split(' ');
      const isLow = parts[0] === 'Low';
      suit = parts[1];
      const ranks = isLow ? ['2','3','4','5','6','7'] : ['9','10','J','Q','K','A'];
      members = ranks.map(r => ({ rank: r, suit: suit }));
    }

    members.forEach(m => {
      // Check if we already have this card
      const weHaveIt = m.rank ? myHand.some(c => c.rank === m.rank && c.suit === m.suit) 
                              : myHand.some(c => `${c.rank} of ${c.suit}` === m);
      
      if (!weHaveIt) {
        if (m.rank) {
          validAsks.push({ rank: m.rank, suit: m.suit });
        } else {
          // Parse Eights
          const [r, s] = m.split(' of ');
          validAsks.push({ rank: r, suit: s });
        }
      }
    });
  });

  if (validAsks.length > 0) {
    // Pick a random valid ask
    const askCard = validAsks[Math.floor(Math.random() * validAsks.length)];
    // Pick a random opponent
    const opponent = opponents[Math.floor(Math.random() * opponents.length)];
    
    return {
      type: 'ASK',
      opponent,
      card: askCard
    };
  }

  // Fallback: If no valid asks (should be rare unless hand is completely empty or has full sets)
  return null;
}
