/**
 * Original illustration of the masked operator, drawn in SVG (no stock or generated imagery).
 * The visor is the page's signature: the same horizontal aperture of light that opens and
 * closes the page. `uid` keeps gradient and clip ids unique when the figure appears twice.
 */
export function OperatorFigure({ uid, className, title }: { uid: string; className?: string; title?: string }) {
  const u = `op-${uid}-`;
  return (
    <svg
      viewBox="0 0 600 800"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      preserveAspectRatio="xMidYMid meet"
    >
  <defs>
    <radialGradient id={`${u}haze`} cx=".5" cy=".4" r=".42">
      <stop offset="0" stopColor="#2a2d35" stopOpacity=".55"/><stop offset="1" stopColor="#2a2d35" stopOpacity="0"/>
    </radialGradient>
    <linearGradient id={`${u}jacket`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#101115"/><stop offset="1" stopColor="#040405"/>
    </linearGradient>
    <linearGradient id={`${u}collar`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#181b22"/><stop offset=".45" stopColor="#0b0c0f"/><stop offset="1" stopColor="#0e0f13"/>
    </linearGradient>
    <linearGradient id={`${u}skull`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#0b0c0f"/><stop offset=".7" stopColor="#08090b"/><stop offset="1" stopColor="#121318"/>
    </linearGradient>
    <linearGradient id={`${u}planeL`} x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stopColor="#4a5a6e"/><stop offset=".45" stopColor="#232a34"/><stop offset="1" stopColor="#101217"/>
    </linearGradient>
    <linearGradient id={`${u}planeR`} x1="1" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2a2622"/><stop offset=".35" stopColor="#0f1013"/><stop offset="1" stopColor="#08090b"/>
    </linearGradient>
    <linearGradient id={`${u}brow`} x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stopColor="#303845"/><stop offset=".6" stopColor="#14171c"/><stop offset="1" stopColor="#1d1b19"/>
    </linearGradient>
    <linearGradient id={`${u}chin`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#2b3340"/><stop offset="1" stopColor="#0a0b0d"/>
    </linearGradient>
    <linearGradient id={`${u}visor`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#020203"/><stop offset=".5" stopColor="#0a0f17"/><stop offset="1" stopColor="#020203"/>
    </linearGradient>
    <linearGradient id={`${u}rim`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#f1dfc6" stopOpacity="0"/><stop offset=".4" stopColor="#f1dfc6" stopOpacity=".8"/><stop offset="1" stopColor="#f1dfc6" stopOpacity="0"/>
    </linearGradient>
    <linearGradient id={`${u}signal`} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#f2411a" stopOpacity="0"/><stop offset=".25" stopColor="#f2411a" stopOpacity=".9"/><stop offset=".5" stopColor="#ffb08f"/><stop offset=".75" stopColor="#f2411a" stopOpacity=".9"/><stop offset="1" stopColor="#f2411a" stopOpacity="0"/>
    </linearGradient>
    <radialGradient id={`${u}spill`} cx=".15" cy="1.05" r="1">
      <stop offset="0" stopColor="#8fb4dc" stopOpacity=".28"/><stop offset=".6" stopColor="#8fb4dc" stopOpacity=".06"/><stop offset="1" stopColor="#8fb4dc" stopOpacity="0"/>
    </radialGradient>
    <path id={`${u}mask`} d="M300 202 C 344 202 382 222 396 262 C 404 288 404 316 398 344 C 390 384 372 420 346 450 C 332 466 316 478 300 482 C 284 478 268 466 254 450 C 228 420 210 384 202 344 C 196 316 196 288 204 262 C 218 222 256 202 300 202 Z"/>
    <path id={`${u}visorPath`} d="M188 298 C 236 287 364 287 412 298 L 410 327 C 362 318 238 318 190 327 Z"/>
    <clipPath id={`${u}maskClip`}><use href={`#${u}mask`}/></clipPath>
    <clipPath id={`${u}visorClip`}><use href={`#${u}visorPath`}/></clipPath>
    <clipPath id={`${u}bodyClip`}><path d="M10 800 C 22 708 66 662 170 632 C 204 622 228 612 236 596 C 228 560 230 522 246 486 C 270 474 330 474 354 486 C 370 522 372 560 364 596 C 372 612 396 622 430 632 C 534 662 578 708 590 800 Z"/></clipPath>
    <radialGradient id={`${u}spillBody`} cx=".1" cy="1.1" r="1"><stop offset="0" stopColor="#8fb4dc" stopOpacity=".14"/><stop offset="1" stopColor="#8fb4dc" stopOpacity="0"/></radialGradient>
    <linearGradient id={`${u}shade`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#000" stopOpacity="0"/><stop offset=".6" stopColor="#000" stopOpacity=".25"/><stop offset="1" stopColor="#000" stopOpacity=".55"/></linearGradient>
    <filter id={`${u}grain`} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .06 0"/>
    </filter>
  </defs>

  <rect width="600" height="800" fill={`url(#${u}haze)`}/>

  {/* neck (in shadow), behind the collar */}
  <path d="M256 440 L 344 440 L 348 500 C 330 506 270 506 252 500 Z" fill="#050506"/>
  {/* body */}
  <g clipPath={`url(#${u}bodyClip)`}>
    <rect width="600" height="800" fill={`url(#${u}jacket)`}/>
    <path d="M236 596 C 228 560 230 522 246 486 C 270 474 330 474 354 486 C 370 522 372 560 364 596 C 340 610 260 610 236 596 Z" fill={`url(#${u}collar)`}/>
    <path d="M246 486 C 270 500 330 500 354 486" stroke="#2a2e36" strokeWidth="1.2" fill="none"/>
    <path d="M296 496 L 296 800 M304 496 L 304 800" stroke="#1c1f25" strokeWidth="1"/>
    <path d="M236 596 C 260 610 340 610 364 596" stroke="#191b21" strokeWidth="1.4" fill="none"/>
    <path d="M170 632 C 204 662 218 720 220 800 M430 632 C 396 662 382 720 380 800" stroke="#16181e" strokeWidth="1.6" fill="none"/>
    <rect width="600" height="800" fill={`url(#${u}spillBody)`}/>
    <rect width="600" height="800" fill={`url(#${u}shade)`}/>
  </g>
  <path d="M430 632 C 534 662 578 708 590 800" stroke={`url(#${u}rim)`} strokeWidth="2.2" fill="none"/>
  <path d="M354 488 C 370 522 372 560 364 596 C 372 612 396 622 430 632" stroke="#f1dfc6" strokeOpacity=".3" strokeWidth="1.4" fill="none"/>


  {/* skull */}
  <path d="M300 148 C 378 148 430 206 432 284 C 434 336 420 378 398 410 C 384 430 366 446 348 458 L 346 476 L 254 476 L 252 458 C 234 446 216 430 202 410 C 180 378 166 336 168 284 C 170 206 222 148 300 148 Z" fill={`url(#${u}skull)`}/>
  <path d="M398 176 C 428 210 438 256 432 304 C 430 340 418 378 398 410 C 386 428 370 444 352 456" stroke={`url(#${u}rim)`} strokeWidth="2.4" fill="none"/>

  {/* faceplate */}
  <g clipPath={`url(#${u}maskClip)`}>
    <rect x="190" y="196" width="220" height="292" fill="#0b0c0f"/>
    <path d="M300 202 L 300 296 L 196 296 C 196 280 198 270 204 262 C 218 222 256 202 300 202 Z" fill={`url(#${u}brow)`}/>
    <path d="M300 202 C 344 202 382 222 396 262 C 402 272 404 284 404 296 L 300 296 Z" fill={`url(#${u}planeR)`}/>
    <path d="M198 326 L 300 326 L 300 404 L 248 444 C 224 412 206 372 198 326 Z" fill={`url(#${u}planeL)`}/>
    <path d="M300 326 L 402 326 C 394 372 376 412 352 444 L 300 404 Z" fill={`url(#${u}planeR)`}/>
    <path d="M248 444 L 300 404 L 352 444 C 336 462 318 476 300 482 C 282 476 264 462 248 444 Z" fill={`url(#${u}chin)`}/>
    <path d="M300 206 L 300 294 M300 330 L 300 404 L 248 444 M300 404 L 352 444" stroke="#56606e" strokeOpacity=".35" strokeWidth="1"/>
    <rect x="190" y="196" width="220" height="292" fill={`url(#${u}spill)`}/>
  </g>
  <use href={`#${u}mask`} fill="none" stroke="#3e444f" strokeOpacity=".5" strokeWidth="1"/>
  <path d="M386 236 C 400 262 406 296 402 334 C 398 368 386 398 368 426" stroke="#f1dfc6" strokeOpacity=".45" strokeWidth="1.4" fill="none"/>

  {/* visor: the aperture */}
  <use href={`#${u}visorPath`} fill={`url(#${u}visor)`}/>
  <g clipPath={`url(#${u}visorClip)`} className="op-visor">
    <g fill="#9cc0e8" fillOpacity=".5">
      <rect x="208" y="299" width="40" height="1.5"/><rect x="254" y="299" width="18" height="1.5"/><rect x="278" y="299" width="56" height="1.5"/><rect x="340" y="299" width="26" height="1.5"/>
      <rect x="220" y="304" width="66" height="1.5"/><rect x="292" y="304" width="30" height="1.5"/><rect x="328" y="304" width="48" height="1.5"/>
      <rect x="214" y="317" width="32" height="1.5"/><rect x="252" y="317" width="46" height="1.5"/><rect x="304" y="317" width="24" height="1.5"/><rect x="334" y="317" width="50" height="1.5"/>
      <rect x="232" y="322" width="58" height="1.5"/><rect x="296" y="322" width="40" height="1.5"/>
    </g>
    <rect className="op-visor-signal" x="186" y="309.6" width="228" height="2.4" fill={`url(#${u}signal)`}/>
    <path d="M336 290 L 362 290 L 344 330 L 322 330 Z" fill="#fff" fillOpacity=".07"/>
  </g>
  <path d="M188 298 C 236 287 364 287 412 298" stroke="#c9d6e6" strokeOpacity=".3" strokeWidth="1" fill="none"/>
  <path d="M190 327 C 238 318 362 318 410 327" stroke="#000" strokeOpacity=".8" strokeWidth="1.6" fill="none"/>
    </svg>
  );
}
