import { useState, useEffect } from 'react';
import { ref, onValue, set, update } from 'firebase/database';
import { db } from '../lib/firebase';

export function useGameState(roomId, playerName, mode) {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    if (!roomId) return;
    const roomRef = ref(db, `rooms/${roomId}`);
    
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGameState(data);
      } else {
        let initialPlayers = {
          [playerName]: { name: playerName, team: 'A', hand: [], isBot: false }
        };
        
        if (mode === 'bots') {
          initialPlayers = {
             ...initialPlayers,
             'Bot1': { name: 'Bot1', team: 'A', hand: [], isBot: true },
             'Bot2': { name: 'Bot2', team: 'B', hand: [], isBot: true },
             'Bot3': { name: 'Bot3', team: 'B', hand: [], isBot: true }
          };
        }

        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        let deck = [];
        suits.forEach(suit => {
          ranks.forEach(rank => {
            deck.push({ rank, suit });
          });
        });
        
        for (let i = deck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        
        const playerKeys = Object.keys(initialPlayers);
        deck.forEach((card, index) => {
          initialPlayers[playerKeys[index % playerKeys.length]].hand.push(card);
        });

        // Initialize room state if it does not exist
        const initialData = {
          status: 'waiting',
          turn: playerName, // The creator of the room starts
          players: initialPlayers,
          log: [`Room created by ${playerName}`]
        };
        set(roomRef, initialData);
      }
    });

    return () => unsubscribe();
  }, [roomId, playerName]);

  const performAsk = (asker, targetPlayer, card) => {
    if (!gameState) return;
    
    const targetHand = gameState.players[targetPlayer]?.hand || [];
    const hasCardIndex = targetHand.findIndex(c => c.rank === card.rank && c.suit === card.suit);
    
    let success = false;
    let newPlayers = { ...gameState.players };
    
    // Ensure we create new hand arrays so Firebase triggers update
    newPlayers[targetPlayer] = { ...newPlayers[targetPlayer], hand: [...targetHand] };
    newPlayers[asker] = { ...newPlayers[asker], hand: [...(newPlayers[asker].hand || [])] };
    
    if (hasCardIndex !== -1) {
      success = true;
      const transferredCard = targetHand[hasCardIndex];
      newPlayers[targetPlayer].hand.splice(hasCardIndex, 1);
      newPlayers[asker].hand.push(transferredCard);
    }
    
    const logMsg = `${asker} asked ${targetPlayer} for the ${card.rank} of ${card.suit}. ${success ? 'Success!' : 'Failed.'}`;
    
    // In Literature, if you succeed, you keep the turn. If you fail, the turn passes to the person you asked.
    const nextTurn = success ? asker : targetPlayer;
    
    update(ref(db, `rooms/${roomId}`), {
      log: [...(gameState.log || []), logMsg],
      lastEvent: { type: 'ASK', asker, target: targetPlayer, card, success, timestamp: Date.now() },
      turn: nextTurn,
      players: newPlayers
    });
  };

  const performDeclare = (player, suitName, declarations) => {
    if (!gameState) return;
    const logMsg = `${player} declared the ${suitName} set`;
    update(ref(db, `rooms/${roomId}`), {
      log: [...(gameState.log || []), logMsg]
    });
  };

  return { gameState, performAsk, performDeclare };
}
