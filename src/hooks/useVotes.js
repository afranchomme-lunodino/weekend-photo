import { useState, useEffect } from 'react';
import {
  collection, onSnapshot, query, where,
  writeBatch, doc, increment, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getDeviceId } from '../lib/deviceId';

const MAX_VOTES = 10;

// Réactions disponibles
export const REACTIONS = [
  { key: 'h', emoji: '❤️', label: 'J\'aime' },
  { key: 'f', emoji: '🔥', label: 'Feu'     },
  { key: 'w', emoji: '😍', label: 'Waou'    },
  { key: 'l', emoji: '😂', label: 'Haha'    },
];

export function useVotes(myTeamId) {
  const [myVotes, setMyVotes] = useState([]);
  const deviceId = getDeviceId();

  useEffect(() => {
    const q = query(collection(db, 'votes'), where('deviceId', '==', deviceId));
    return onSnapshot(q, (snap) => {
      setMyVotes(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
  }, [deviceId]);

  const votesLeft = MAX_VOTES - myVotes.length;

  // { photoId: reactionKey } — pour savoir quelle réaction a été donnée
  const votedPhotos = {};
  myVotes.forEach(v => { votedPhotos[v.photoId] = v.reaction ?? 'h'; });

  async function vote(photo, reaction = 'h') {
    if (votesLeft <= 0)               return { error: 'Tu as utilisé tous tes votes' };
    if (votedPhotos[photo.id])        return { error: 'Tu as déjà réagi à cette photo' };
    if (myTeamId && photo.teamId === myTeamId) return { error: 'Impossible de voter pour ta propre équipe' };

    // ID déterministe → Firestore rejette les doublons côté serveur
    const voteId = `${deviceId}_${photo.id}`;
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, 'votes', voteId), {
        deviceId,
        photoId:  photo.id,
        teamId:   photo.teamId,
        reaction,
        votedAt:  serverTimestamp(),
      });
      batch.update(doc(db, 'photos', photo.id), {
        votes:                    increment(1),
        [`reactions.${reaction}`]: increment(1),
      });
      await batch.commit();
      return { success: true };
    } catch (e) {
      return { error: 'Erreur réseau, réessaie' };
    }
  }

  return { myVotes, votesLeft, votedPhotos, vote };
}
