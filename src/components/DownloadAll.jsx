import { useState } from 'react';

export function DownloadAll({ photos }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');

  async function download() {
    if (!photos.length || loading) return;
    setLoading(true);

    if (!window.JSZip) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    const zip = new window.JSZip();
    let ok = 0;

    for (let i = 0; i < photos.length; i++) {
      const p = photos[i];
      setProgress(`${i + 1} / ${photos.length}`);
      try {
        const res = await fetch(p.url);
        const blob = await res.blob();
        const folder = p.teamName.replace(/[^a-z0-9]/gi, '_');
        zip.file(`${folder}/${String(i + 1).padStart(3, '0')}.jpg`, blob);
        ok++;
      } catch {
        // skip unreachable photos
      }
    }

    setProgress('Compression…');
    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `weekend-photo-${ok}photos.zip`;
    a.click();
    URL.revokeObjectURL(a.href);

    setLoading(false);
    setProgress('');
  }

  return (
    <button
      className="download-all-btn"
      onClick={download}
      disabled={loading || !photos.length}
    >
      {loading
        ? `⏳ ${progress}`
        : `⬇ Télécharger tout (${photos.length} photo${photos.length !== 1 ? 's' : ''})`}
    </button>
  );
}
