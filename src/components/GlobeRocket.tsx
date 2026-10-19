import { Rocket } from '@/lib/icons';

export default function GlobeRocket() {
  return (
    <div className="globe-scene" aria-hidden="true">
      <div className="globe">
        <span className="globe-surface" />
        <span className="globe-shade" />
      </div>

      <div className="orbit">
        <span className="rocket-wrap">
          <Rocket className="h-5 w-5 text-forest-200" />
        </span>
      </div>
    </div>
  );
}
