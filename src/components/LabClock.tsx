import { useEffect, useState } from 'react';

/** HH:MM in UTC, e.g. "20:14". Locale fixed so the shape never varies. */
function utcNow(): string {
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  }).format(new Date());
}

/**
 * The lab's wall clock, in the footer meta row.
 *
 * An instrument readout rather than decoration: it tells a visitor the lab
 * keeps one shared time. Fifteen-second ticks are plenty for minute precision
 * and keep the timer off the critical path — one state change per tick, and
 * the text is tabular so the row never shifts width.
 */
export default function LabClock() {
  const [time, setTime] = useState(utcNow);

  useEffect(() => {
    const id = window.setInterval(() => {
      setTime((current) => {
        const next = utcNow();
        return next === current ? current : next;
      });
    }, 15000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="label font-mono tabular-nums text-bone-500" title="Lab time, UTC">
      {time} UTC
    </span>
  );
}
