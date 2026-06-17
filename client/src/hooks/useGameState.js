import { useState, useEffect } from 'react';
import { ref, onValue, set, update } from 'firebase/database';
import { db } from '../lib/firebase';

export function useGameState(roomId, playerName) {
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    if (!roomId) return;
    const roomRef = ref(db, `rooms/${roomId}`);
    
    const unsubscribe = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGameState(data);
      } else {
        // Initialize room state if it does not exist
        const initialData = {
          status: 'waiting',
          turn: playerName, // The creator of the room starts
          players: {
            [playerName]: { name: playerName, team: 'A', hand: [] }
          },
          log: [`Room created by ${playerName}`]
        };
        set(roomRef, initialData);
      }
    });

    return () => unsubscribe();
  }, [roomId, playerName]);

  const performAsk = (asker, targetPlayer, card) => {
    if (!gameState) return;
    const logMsg = `${asker} asked ${targetPlayer} for the ${card.rank} of ${card.suit}`;
    // Simple state update to Firebase
    update(ref(db, `rooms/${roomId}`), {
      log: [...(gameState.log || []), logMsg],
      turn: targetPlayer // Passes turn to the asked player (simplified logic for now)
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
