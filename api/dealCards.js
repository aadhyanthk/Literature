export default function handler(req, res) {
  // Only allow POST requests for secure game actions
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { numPlayers = 6 } = req.body || {};

  // Standard 52-card deck
  const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
  const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
  
  let deck = [];
  suits.forEach(suit => {
    ranks.forEach(rank => {
      deck.push({ rank, suit });
    });
  });

  // Secure Fisher-Yates Shuffle on the server side
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  // Deal cards evenly
  const hands = Array.from({ length: numPlayers }, () => []);
  deck.forEach((card, index) => {
    hands[index % numPlayers].push(card);
  });

  // In a full implementation, this Vercel function would directly push these hands 
  // into the Firebase Realtime Database using the Firebase Admin SDK to prevent cheating.
  // For now, it returns the generated hands.
  return res.status(200).json({ success: true, hands });
}
