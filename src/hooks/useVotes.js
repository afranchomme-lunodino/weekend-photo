import { useState, useEffect } from 'react';
import {
  collection, onSnapshot, query, where,
  writeBatch, doc, increment, serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getDeviceId } from '../lib/deviceId';

const MAX_VOTES = 10;

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
  const votedPhotoIds = myVotes.map(v => v.photoId);

  async function vote(photo) {
    if (votesLeft <= 0) return { error: 'Tu as utilisé tous tes votes' };
    if (votedPhotoIds.includes(photo.id)) return { error: 'Tu as déjà voté pour cette photo' };
    if (myTeamId && photo.teamId === myTeamId) return { error: 'Impossible de voter pour ta propre équipe' };

    try {
      const batch = writeBatch(db);
      const voteRef = doc(collection(db, 'votes'));
      batch.set(voteRef, {
        deviceId,
        photoId: photo.id,
        teamId: photo.teamId,
        votedAt: serverTimestamp(),
      });
      batch.update(doc(db, 'photos', photo.id), { votes: increment(1) });
      await batch.commit();
      return { success: true };
    } catch (e) {
      return { error: 'Erreur réseau, réessaie' };
    }
  }

  return { myVotes, votesLeft, votedPhotoIds, vote };
}
