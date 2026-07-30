import { useEffect } from 'react';
import { usePath } from '@/lib/router';
import { useReveal } from '@/lib/useReveal';
import PizenLabsHome from '@/pages/PizenLabsHome';

function NotFound() {
  return (
    <div className="min-h-screen bg-ink-800 text-bone-100 flex items-center justify-center">
      <div className="text-center">
        <p className="font-mono text-xs tracking-[0.3em] text-forest-300 mb-4">404 / NOT FOUND</p>
        <h1 className="font-sans text-3xl mb-2">This path is not part of the system.</h1>
        <a href="/" className="text-bone-300 hover:text-forest-300 transition-colors">
          Return to PizenLabs →
        </a>
      </div>
    </div>
  );
}

function App() {
  const path = usePath();
  useReveal();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [path]);

  const isRoot = path === '/';

  useEffect(() => {
    document.title = 'pizenlabs';
  }, []);

  useEffect(() => {
    const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
    if (link) {
      link.href = '/pizenlabs.svg';
    }
  }, []);

  return (
    <>
      {isRoot && <PizenLabsHome />}
      {!isRoot && <NotFound />}
    </>
  );
}

export default App;
