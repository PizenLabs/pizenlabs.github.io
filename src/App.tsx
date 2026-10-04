import { usePath } from '@/lib/router';
import { useReveal } from '@/lib/useReveal';
import { useScrollProgress } from '@/lib/useScrollProgress';
import Backdrop from '@/components/Backdrop';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import PizenLabsHome from '@/pages/PizenLabsHome';

function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Backdrop />
      <SiteHeader />
      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-32 text-center">
        <p className="label mb-6 text-forest-300">404 / Not found</p>
        <h1 className="font-sans text-3xl font-medium tracking-tight text-bone-50 sm:text-[2.5rem]">
          This path is not part of the system.
        </h1>
        <p className="mt-5 max-w-md text-pretty leading-relaxed text-bone-400">
          The page you asked for does not exist — or it never did.
        </p>
        <a href="/" className="btn btn-primary mt-10">
          Return to PizenLabs
        </a>
      </main>
      <SiteFooter />
    </div>
  );
}

function App() {
  const path = usePath();
  // Both hooks use passive, rAF-coalesced listeners and a single shared
  // IntersectionObserver, so mounting them for every route stays cheap.
  useReveal();
  useScrollProgress();

  return path === '/' ? <PizenLabsHome /> : <NotFound />;
}

export default App;