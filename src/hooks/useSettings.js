import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useSettings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    return onSnapshot(doc(db, 'settings', 'main'), (snap) => {
      setSettings(snap.exists() ? snap.data() : { phase: 'upload', votingOpen: false });
    });
  }, []);

  async function setPhase(phase) {
    const votingOpen = phase === 'vote';
    await setDoc(doc(db, 'settings', 'main'), {
      ...(settings || {}),
      phase,
      votingOpen,
      phaseEndTime: null,
    });
  }

  async function startTimer(minutes) {
    await setDoc(doc(db, 'settings', 'main'), {
      ...(settings || {}),
      phaseEndTime: Date.now() + minutes * 60 * 1000,
    });
  }

  async function clearTimer() {
    await setDoc(doc(db, 'settings', 'main'), {
      ...(settings || {}),
      phaseEndTime: null,
    });
  }

  // Dérivés
  const phase      = settings?.phase ?? 'upload';
  const votingOpen = settings?.votingOpen ?? false;
  const phaseEndTime = settings?.phaseEndTime ?? null;

  return { settings, phase, votingOpen, phaseEndTime, setPhase, startTimer, clearTimer };
}
