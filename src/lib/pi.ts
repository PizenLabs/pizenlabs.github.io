/**
 * The digits of pi.
 *
 * The site's ambient layer is a tape of these digits, scrolling across the
 * screen behind the content. They are computed rather than written by hand
 * for the same reason the copy lives in `lib/content.ts`: a literal in the
 * source is a literal that can be checked, diffed and corrected.
 *
 * One thousand digits, which is far more than the layer can show at once —
 * the tape wraps, so a viewer who stares at it long enough sees the digits
 * repeat, exactly as a printed table of pi does at the end of its page.
 *
 * The string is written in blocks of sixty-four so the source stays
 * readable and a line never runs off the edge of the file.
 */
const PI_DIGITS =
  '3141592653589793238462643383279502884197169399375105820974944592' +
  '3078164062862089986280348253421170679821480865132823066470938446' +
  '0955058223172535940812848111745028410270193852110555964462294895' +
  '4930381964428810975665933446128475648233786783165271201909145648' +
  '5669234603486104543266482133936072602491412737245870066063155881' +
  '7488152092096282925409171536436789259036001133053054882046652138' +
  '4146951941511609433057270365759591953092186117381932611793105118' +
  '5480744623799627495673518857527248912279381830119491298336733624' +
  '4065664308602139494639522473719070217986094370277053921717629317' +
  '6752384674818467669405132000568127145263560827785771342757789609' +
  '1736371787214684409012249534301465495853710507922796892589235420' +
  '1995611212902196086403441815981362977477130996051870721134999999' +
  '8372978049951059731732816096318595024459455346908302642522308253' +
  '3446850352619311881710100031378387528865875332083814206171776691' +
  '4730359825349042875546873115956286388235378759375195778185778053' +
  '2171226806613001927876611195909216420198';

/** The whole tape, without a decimal point. */
export const PI = PI_DIGITS;

/**
 * A run of digits from the tape, grouped in tens the way a printed table
 * of pi is grouped.
 *
 * The offset wraps, so the tape is endless: a row that runs off the right
 * edge of the screen continues at the left, which is what makes the
 * scrolling loop seamless.
 */
export function piChunk(offset: number, length: number): string {
  const total = PI.length;
  const out: string[] = [];
  for (let i = 0; i < length; i += 1) {
    out.push(PI[(offset + i + total) % total]);
    // A space every ten digits: without it the tape reads as one endless
    // number, and the eye loses the scale of what it is looking at.
    if ((i + 1) % 10 === 0 && i + 1 < length) out.push(' ');
  }
  return out.join('');
}

/** The head of the tape, with its decimal point — the one place it appears. */
export const PI_HEAD = '3.';
