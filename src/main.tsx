import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {motion, useReducedMotion, useScroll, useTransform} from 'motion/react';
import {CalendarBlank, MapPin, SpeakerHigh, SpeakerSlash, ArrowDown, Sparkle, Heart} from '@phosphor-icons/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import './styles.css';

// Wedding Date: Haldi starts 19 November 2026 at 9:00 AM
const WEDDING_START = new Date('2026-11-19T09:00:00+05:30');

const events = [
  {
    name: 'Haldi',
    date: 'Thursday, 19 November 2026',
    times: [
      { label: 'Breakfast', time: '8:00 AM' },
      { label: 'Haldi Ceremony', time: '9:00 AM' }
    ],
    venue: 'Pebbles Resort, Rishikesh',
    note: 'Join us for a vibrant celebration of love, laughter, and blessings as we begin the wedding festivities with the joyful hues of Haldi.',
    icon: '💛'
  },
  {
    name: 'Mehndi',
    date: 'Thursday, 19 November 2026',
    times: [
      { label: 'Mehndi Ceremony', time: '12:00 PM' },
      { label: 'Lunch', time: '1:00 PM' }
    ],
    venue: 'Pebbles Resort, Rishikesh',
    note: 'An afternoon filled with delicate henna patterns, folk music, laughter, and beautiful memories as we celebrate the joy of togetherness.',
    icon: '🌿'
  },
  {
    name: 'Ring Ceremony & Sangeet',
    date: 'Thursday, 19 November 2026',
    times: [
      { label: 'Ring Ceremony & Sangeet', time: '5:30 PM' },
      { label: 'Semi-Gala Dinner', time: '8:30 PM' }
    ],
    venue: 'Pebbles Resort, Rishikesh',
    note: 'An enchanting evening of love, music, dance, and celebration as we exchange rings and begin a beautiful new chapter together.',
    icon: '💍'
  },
  {
    name: 'Lagan & Sagai',
    date: 'Friday, 20 November 2026',
    times: [
      { label: 'Ceremony', time: '7:00 AM' },
      { label: 'Breakfast', time: '8:30 AM' }
    ],
    venue: 'Pebbles Resort, Rishikesh',
    note: 'With hearts full of joy and blessings, join us for the auspicious wedding rituals and sacred traditions that unite two souls in the bond of marriage.',
    icon: '🪔'
  },
  {
    name: 'Shubh Varmala',
    date: 'Friday, 20 November 2026',
    times: [
      { label: 'Varmala Ceremony', time: '12:30 PM' },
      { label: 'Gala Lunch', time: '1:30 PM' }
    ],
    venue: 'Pebbles Resort, Rishikesh',
    note: 'Witness a beautiful moment of love and togetherness as the bride and groom exchange garlands, promising a lifetime of happiness and togetherness.',
    icon: '🌻'
  },
  {
    name: 'Vidai',
    date: 'Friday, 20 November 2026',
    times: [
      { label: 'Hi-Tea', time: '5:00 PM' },
      { label: 'Vidai', time: '6:00 PM' }
    ],
    venue: 'Pebbles Resort, Rishikesh',
    note: 'As we bid a heartfelt farewell to the bride, we cherish the beautiful memories, seek blessings for her new journey, and celebrate the beginning of a wonderful new chapter.',
    icon: '🕊️'
  },
];

function Reveal({children, className=''}:{children:React.ReactNode,className?:string}){
  const reduce=useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce?false:{opacity:0,y:28}}
      whileInView={{opacity:1,y:0}}
      viewport={{once:true,amount:.15}}
      transition={{duration:.75,ease:[.16,1,.3,1]}}
    >
      {children}
    </motion.div>
  );
}

function Countdown(){
  const [now,setNow]=useState(Date.now());
  useEffect(()=>{const id=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(id)},[]);
  const diff=Math.max(0,WEDDING_START.getTime()-now);
  const values=[Math.floor(diff/86400000),Math.floor(diff/3600000)%24,Math.floor(diff/60000)%60,Math.floor(diff/1000)%60];
  return (
    <div className="countdown">
      {values.map((v,i)=>(
        <div className="count-unit" key={i}>
          <div className="flip">
            <motion.span key={v} initial={{rotateX:-75,opacity:0}} animate={{rotateX:0,opacity:1}}>
              {String(v).padStart(2,'0')}
            </motion.span>
          </div>
          <small>{['days','hours','mins','secs'][i]}</small>
        </div>
      ))}
    </div>
  );
}

function addCalendar(){
  const body=[
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'BEGIN:VEVENT',
    'DTSTART:20261119T033000Z',
    'DTEND:20261120T123000Z',
    'SUMMARY:Tanya & Abhishek — Wedding Celebration',
    'LOCATION:Pebbles Resort, Neelkanth Road, Rattapani, Rishikesh, Uttarakhand',
    'DESCRIPTION:Celebrate the wedding ceremonies of Tanya Saini & Abhishek Saini in Rishikesh.',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([body],{type:'text/calendar'}));
  a.download='tanya-abhishek-wedding.ics';
  a.click();
  URL.revokeObjectURL(a.href);
}

function ScratchDate(){
  const canvas=useRef<HTMLCanvasElement>(null);
  const [done,setDone]=useState(false);
  const drawing=useRef(false);
  const strokes=useRef(0);

  useEffect(()=>{
    const c=canvas.current;
    if(!c)return;
    const ratio=Math.min(devicePixelRatio,2);
    const rect=c.getBoundingClientRect();
    c.width=rect.width*ratio;
    c.height=rect.height*ratio;
    const x=c.getContext('2d')!;
    x.scale(ratio,ratio);
    const g=x.createLinearGradient(0,0,rect.width,rect.height);
    g.addColorStop(0,'#d7a94f');
    g.addColorStop(.5,'#f0d08a');
    g.addColorStop(1,'#a76d1c');
    x.fillStyle=g;
    x.fillRect(0,0,rect.width,rect.height);
    x.fillStyle='#5a3418';
    x.textAlign='center';
    x.font='11px Marcellus, serif';
    x.fillText('SCRATCH TO REVEAL OUR DATES',rect.width/2,rect.height/2-8);
    x.font='22px serif';
    x.fillText('🪷',rect.width/2,rect.height/2+24);
  },[]);

  const scratch=(e:React.PointerEvent<HTMLCanvasElement>)=>{
    if(!drawing.current||done)return;
    const c=canvas.current!,r=c.getBoundingClientRect(),x=c.getContext('2d')!;
    x.globalCompositeOperation='destination-out';
    x.beginPath();
    x.arc(e.clientX-r.left,e.clientY-r.top,24,0,Math.PI*2);
    x.fill();
    if(++strokes.current>38){
      setDone(true);
      c.style.opacity='0';
      navigator.vibrate?.(35);
    }
  };

  return (
    <section className={'scratch-section '+(done?'revealed':'')}>
      <div className="float-field" aria-hidden="true">
        {Array.from({length:12},(_,i)=><i key={i} style={{'--i':i} as React.CSSProperties}>❀</i>)}
      </div>
      <Reveal>
        <p className="script">Save our dates</p>
        <h2>A day written in the stars</h2>
        <div className="scratch-card">
          <div className="date-reveal">
            <small>Thursday & Friday</small>
            <b>19 & 20</b>
            <span>November · 2026</span>
            <em>Rishikesh, Uttarakhand</em>
          </div>
          <canvas
            ref={canvas}
            onPointerDown={e=>{drawing.current=true;e.currentTarget.setPointerCapture(e.pointerId);scratch(e)}}
            onPointerMove={scratch}
            onPointerUp={()=>drawing.current=false}
            onPointerCancel={()=>drawing.current=false}
          />
        </div>
        <p className="scratch-hint">{done?'We cannot wait to see you in Rishikesh ♡':'Use your finger to uncover the dates'}</p>
      </Reveal>
    </section>
  );
}

// 3) Real Looking Hanging Flowers Canopy across top of 1st Page with Slow Breeze Sway Animation
function RealHangingFlowers(){
  return (
    <div className="real-hanging-canopy" aria-hidden="true">
      {/* Top draped foliage swag connecting the garland anchors */}
      <svg className="canopy-top-foliage" viewBox="0 0 1200 48" preserveAspectRatio="none">
        <defs>
          <linearGradient id="foliageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1e3814" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#2d521d" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#437628" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="goldBellGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#966c28" />
            <stop offset="35%" stopColor="#ffd875" />
            <stop offset="65%" stopColor="#e5b144" />
            <stop offset="100%" stopColor="#7a541a" />
          </linearGradient>
          <radialGradient id="jasmineBudGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="55%" stopColor="#fbf6eb" />
            <stop offset="85%" stopColor="#eedcb9" />
            <stop offset="100%" stopColor="#d4be95" />
          </radialGradient>
          <linearGradient id="lotusPetalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffb3c6" />
            <stop offset="45%" stopColor="#f84d7d" />
            <stop offset="100%" stopColor="#b41643" />
          </linearGradient>
          <linearGradient id="bougainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff7096" />
            <stop offset="50%" stopColor="#e91e63" />
            <stop offset="100%" stopColor="#9c0936" />
          </linearGradient>
        </defs>
        <path d="M0,0 Q150,32 300,10 Q450,35 600,8 Q750,35 900,10 Q1050,32 1200,0 L1200,0 L0,0 Z" fill="url(#foliageGrad)" />
      </svg>

      {/* Strand 0: Far-Left Cascading Bougainvillea & Golden Temple Bell */}
      <div className="strand-item strand-far-left">
        <svg width="42" height="230" viewBox="0 0 42 230" fill="none">
          <path d="M21,0 Q15,40 23,80 Q29,120 18,160 Q13,185 21,205" stroke="#335822" strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="14" cy="22" rx="7" ry="4" transform="rotate(-30 14 22)" fill="#3d6828" />
          <ellipse cx="28" cy="35" rx="8" ry="4" transform="rotate(25 28 35)" fill="#4d8232" />
          <path d="M21,48 C16,42 11,48 16,56 C11,62 18,66 21,60 C24,66 31,62 26,56 C31,48 26,42 21,48 Z" fill="url(#bougainGrad)" />
          <ellipse cx="12" cy="76" rx="7" ry="4" transform="rotate(-20 12 76)" fill="#3d6828" />
          <ellipse cx="30" cy="94" rx="8" ry="4.5" transform="rotate(35 30 94)" fill="#4d8232" />
          <path d="M21,108 C16,102 10,108 15,116 C10,123 18,127 21,121 C24,127 32,123 27,116 C32,108 26,102 21,108 Z" fill="url(#bougainGrad)" />
          <ellipse cx="12" cy="142" rx="7" ry="4" transform="rotate(-25 12 142)" fill="#3d6828" />
          <path d="M20,165 C15,160 10,166 15,173 C10,180 17,184 20,178 C23,184 30,180 25,173 C30,166 25,160 20,165 Z" fill="url(#bougainGrad)" />
          <path d="M14,204 L28,204 C28,204 27,215 29,219 L13,219 C15,215 14,204 14,204 Z" fill="url(#goldBellGrad)" />
          <ellipse cx="21" cy="219" rx="8.5" ry="2.5" fill="url(#goldBellGrad)" />
          <circle cx="21" cy="223" r="2.2" fill="#d4a34b" />
        </svg>
      </div>

      {/* Strand 1: Left Mogra/Jasmine Pearl Garland with Lotus Blossom */}
      <div className="strand-item strand-left-mid">
        <svg width="34" height="185" viewBox="0 0 34 185" fill="none">
          <line x1="17" y1="0" x2="17" y2="152" stroke="#486e32" strokeWidth="1.5" />
          {[12, 25, 38, 51, 64, 77, 90, 103, 116, 129, 142].map(y => (
            <g key={y}>
              <circle cx="17" cy={y} r="5.8" fill="url(#jasmineBudGrad)" />
              <ellipse cx="15.5" cy={y - 1.5} rx="2" ry="1.2" fill="#ffffff" opacity="0.8" />
              <path d={`M14,${y+4} L17,${y+6} L20,${y+4}`} stroke="#3d6526" strokeWidth="1.2" fill="none" />
            </g>
          ))}
          <g transform="translate(17, 164)">
            <path d="M0,0 C-12,-8 -13,-18 0,-21 C13,-18 12,-8 0,0 Z" fill="url(#lotusPetalGrad)" />
            <path d="M-2,-2 C-15,-6 -8,-16 0,-18" stroke="#fce4ec" strokeWidth="0.8" fill="none" />
            <path d="M2,-2 C15,-6 8,-16 0,-18" stroke="#fce4ec" strokeWidth="0.8" fill="none" />
            <circle cx="0" cy="-6" r="2.5" fill="#ffd54f" />
          </g>
        </svg>
      </div>

      {/* Strand 2: Center-Left Jasmine Garland */}
      <div className="strand-item strand-center-left">
        <svg width="28" height="130" viewBox="0 0 28 130" fill="none">
          <line x1="14" y1="0" x2="14" y2="110" stroke="#486e32" strokeWidth="1.4" />
          {[10, 23, 36, 49, 62, 75, 88, 101].map(y => (
            <g key={y}>
              <circle cx="14" cy={y} r="5.2" fill="url(#jasmineBudGrad)" />
              <ellipse cx="12.5" cy={y - 1.2} rx="1.8" ry="1" fill="#ffffff" opacity="0.8" />
            </g>
          ))}
          <path d="M14,124 C6,118 7,109 14,107 C21,109 22,118 14,124 Z" fill="url(#lotusPetalGrad)" />
        </svg>
      </div>

      {/* Strand 3: High Arch Drape Left */}
      <div className="strand-item strand-inner-left">
        <svg width="24" height="90" viewBox="0 0 24 90" fill="none">
          <line x1="12" y1="0" x2="12" y2="76" stroke="#486e32" strokeWidth="1.2" />
          {[10, 22, 34, 46, 58, 70].map(y => (
            <circle key={y} cx="12" cy={y} r="4.8" fill="url(#jasmineBudGrad)" />
          ))}
          <circle cx="12" cy="80" r="3" fill="url(#goldBellGrad)" />
        </svg>
      </div>

      {/* Strand 4: Center Lotus & Brass Bell Pendant directly under arch apex */}
      <div className="strand-item strand-apex-center">
        <svg width="38" height="150" viewBox="0 0 38 150" fill="none">
          <line x1="19" y1="0" x2="19" y2="92" stroke="#486e32" strokeWidth="1.6" />
          {[10, 23, 36, 49, 62, 75].map(y => (
            <g key={y}>
              <circle cx="19" cy={y} r="5.6" fill="url(#jasmineBudGrad)" />
              <ellipse cx="17.5" cy={y - 1.3} rx="1.9" ry="1.1" fill="#ffffff" opacity="0.85" />
            </g>
          ))}
          <g transform="translate(19, 102)">
            <path d="M0,0 C-14,-9 -14,-22 0,-24 C14,-22 14,-9 0,0 Z" fill="url(#lotusPetalGrad)" />
            <circle cx="0" cy="-7" r="2.8" fill="#ffd54f" />
          </g>
          <path d="M12,122 L26,122 C26,122 25,133 27,137 L11,137 C13,133 12,122 12,122 Z" fill="url(#goldBellGrad)" />
          <ellipse cx="19" cy="137" rx="8" ry="2.2" fill="url(#goldBellGrad)" />
          <circle cx="19" cy="141" r="2" fill="#d4a34b" />
        </svg>
      </div>

      {/* Strand 5: High Arch Drape Right */}
      <div className="strand-item strand-inner-right">
        <svg width="24" height="90" viewBox="0 0 24 90" fill="none">
          <line x1="12" y1="0" x2="12" y2="76" stroke="#486e32" strokeWidth="1.2" />
          {[10, 22, 34, 46, 58, 70].map(y => (
            <circle key={y} cx="12" cy={y} r="4.8" fill="url(#jasmineBudGrad)" />
          ))}
          <circle cx="12" cy="80" r="3" fill="url(#goldBellGrad)" />
        </svg>
      </div>

      {/* Strand 6: Center-Right Jasmine Garland */}
      <div className="strand-item strand-center-right">
        <svg width="28" height="130" viewBox="0 0 28 130" fill="none">
          <line x1="14" y1="0" x2="14" y2="110" stroke="#486e32" strokeWidth="1.4" />
          {[10, 23, 36, 49, 62, 75, 88, 101].map(y => (
            <g key={y}>
              <circle cx="14" cy={y} r="5.2" fill="url(#jasmineBudGrad)" />
              <ellipse cx="12.5" cy={y - 1.2} rx="1.8" ry="1" fill="#ffffff" opacity="0.8" />
            </g>
          ))}
          <path d="M14,124 C6,118 7,109 14,107 C21,109 22,118 14,124 Z" fill="url(#lotusPetalGrad)" />
        </svg>
      </div>

      {/* Strand 7: Right Mogra/Jasmine Pearl Garland with Lotus Blossom */}
      <div className="strand-item strand-right-mid">
        <svg width="34" height="185" viewBox="0 0 34 185" fill="none">
          <line x1="17" y1="0" x2="17" y2="152" stroke="#486e32" strokeWidth="1.5" />
          {[12, 25, 38, 51, 64, 77, 90, 103, 116, 129, 142].map(y => (
            <g key={y}>
              <circle cx="17" cy={y} r="5.8" fill="url(#jasmineBudGrad)" />
              <ellipse cx="15.5" cy={y - 1.5} rx="2" ry="1.2" fill="#ffffff" opacity="0.8" />
              <path d={`M14,${y+4} L17,${y+6} L20,${y+4}`} stroke="#3d6526" strokeWidth="1.2" fill="none" />
            </g>
          ))}
          <g transform="translate(17, 164)">
            <path d="M0,0 C-12,-8 -13,-18 0,-21 C13,-18 12,-8 0,0 Z" fill="url(#lotusPetalGrad)" />
            <path d="M-2,-2 C-15,-6 -8,-16 0,-18" stroke="#fce4ec" strokeWidth="0.8" fill="none" />
            <path d="M2,-2 C15,-6 8,-16 0,-18" stroke="#fce4ec" strokeWidth="0.8" fill="none" />
            <circle cx="0" cy="-6" r="2.5" fill="#ffd54f" />
          </g>
        </svg>
      </div>

      {/* Strand 8: Far-Right Cascading Bougainvillea & Golden Temple Bell */}
      <div className="strand-item strand-far-right">
        <svg width="42" height="230" viewBox="0 0 42 230" fill="none">
          <path d="M21,0 Q27,40 19,80 Q13,120 24,160 Q29,185 21,205" stroke="#335822" strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="28" cy="22" rx="7" ry="4" transform="rotate(30 28 22)" fill="#3d6828" />
          <ellipse cx="14" cy="35" rx="8" ry="4" transform="rotate(-25 14 35)" fill="#4d8232" />
          <path d="M21,48 C26,42 31,48 26,56 C31,62 24,66 21,60 C18,66 11,62 16,56 C11,48 16,42 21,48 Z" fill="url(#bougainGrad)" />
          <ellipse cx="30" cy="76" rx="7" ry="4" transform="rotate(20 30 76)" fill="#3d6828" />
          <ellipse cx="12" cy="94" rx="8" ry="4.5" transform="rotate(-35 12 94)" fill="#4d8232" />
          <path d="M21,108 C26,102 32,108 27,116 C32,123 24,127 21,121 C18,127 10,123 15,116 C10,108 16,102 21,108 Z" fill="url(#bougainGrad)" />
          <ellipse cx="30" cy="142" rx="7" ry="4" transform="rotate(25 30 142)" fill="#3d6828" />
          <path d="M22,165 C27,160 32,166 27,173 C32,180 25,184 22,178 C19,184 12,180 17,173 C12,166 17,160 22,165 Z" fill="url(#bougainGrad)" />
          <path d="M14,204 L28,204 C28,204 27,215 29,219 L13,219 C15,215 14,204 14,204 Z" fill="url(#goldBellGrad)" />
          <ellipse cx="21" cy="219" rx="8.5" ry="2.5" fill="url(#goldBellGrad)" />
          <circle cx="21" cy="223" r="2.2" fill="#d4a34b" />
        </svg>
      </div>
    </div>
  );
}

// 1) Cinematic Opener: Clicking plays "vide.mp4", ending transitions into 1st uploaded entrance image
function RoyalVideoWelcome({onEnter}:{onEnter:()=>void}){
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleOpenClick = () => {
    if (isPlaying || isFinishing) return;
    setIsPlaying(true);
    const vid = videoRef.current;
    if (vid) {
      vid.currentTime = 0;
      vid.play().catch(() => {
        // Fallback if browser blocks autoplay
        finishWelcome();
      });
    }
  };

  const finishWelcome = () => {
    if (isFinishing) return;
    setIsFinishing(true);
    setTimeout(() => {
      onEnter();
    }, 450);
  };

  return (
    <div
      className={`royal-welcome ${isPlaying ? 'video-active' : ''} ${isFinishing ? 'is-finishing' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Tanya & Abhishek royal wedding invitation entry"
    >
      {/* Background Video Element: Plays vide.mp4 on first click */}
      <video
        ref={videoRef}
        src="/assets/vide.mp4"
        playsInline
        preload="auto"
        className="gate-video-player"
        onEnded={finishWelcome}
      />

      {/* Poster / Backdrop before playing: Smooth pre-roll atmosphere */}
      <div className="gate-video-poster" />

      {/* Ambient background glow & soft floating particles */}
      <div className="gate-ambient-glow" aria-hidden="true" />

      <div className="gate-petals-burst" aria-hidden="true">
        {Array.from({length: 18}, (_, i) => (
          <span key={i} className={`gate-petal petal-${i}`} />
        ))}
      </div>

      {/* Opening Interface: CTA button with lighter, non-bold text + bride & groom names below */}
      {!isPlaying && (
        <div className="gate-welcome-ui">
          {/* Action Button: Lighter font colour & not bold */}
          <button
            type="button"
            aria-label="Open Tanya and Abhishek's wedding invitation"
            className="open-invitation-btn"
            onClick={handleOpenClick}
          >
            <span className="btn-glow-pulse" />
            <span className="btn-lotus-glyph">🪷</span>
            <span className="btn-text-content">
              <span className="btn-invite-title">Open our invitation</span>
              <span className="btn-invite-sub">TAP TO ENTER</span>
            </span>
            <Sparkle size={17} weight="fill" className="btn-sparkle-icon" />
          </button>

          {/* Bride & Groom names in down (bottom of opening screen) */}
          <div className="gate-bottom-names">
            <div className="gate-ornament-line">
              <i /><span>✦</span><i />
            </div>
            <h2 className="gate-names-text">
              Tanya <i>&</i> Abhishek
            </h2>
            <p className="gate-names-details">
              19 & 20 NOVEMBER 2026 · RISHIKESH
            </p>
          </div>
        </div>
      )}

      {/* Skip button for quick entry */}
      <button
        type="button"
        className="skip-video-btn"
        onClick={finishWelcome}
      >
        Skip intro →
      </button>
    </div>
  );
}

// 4) Two Paths One Forever replaced with exact replica of 3rd uploaded image (family blessings card)
function FamilyBlessingCard(){
  return (
    <section className="card-blessing-section">
      <Reveal className="blessing-card-container">
        {/* Soft background glow and ornamental border */}
        <div className="blessing-card-inner">
          {/* Top Lotus Motif */}
          <div className="blessing-top-lotus">
            <svg width="42" height="34" viewBox="0 0 48 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 2C24 2 28 12 28 22C28 27.5 25.5 32 24 34C22.5 32 20 27.5 20 22C20 12 24 2 24 2Z" stroke="#966a35" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M24 14C27.5 16 35.5 21 35.5 27.5C35.5 31.5 32.5 34 29 34C26.5 34 24.8 32.5 24 31" stroke="#966a35" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M24 14C20.5 16 12.5 21 12.5 27.5C12.5 31.5 15.5 34 19 34C21.5 34 23.2 32.5 24 31" stroke="#966a35" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M24 22C29 23.5 41 27.5 41 33C41 35.5 38 36.5 35 36.5C30.5 36.5 26.5 33.5 24 31" stroke="#966a35" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M24 22C19 23.5 7 27.5 7 33C7 35.5 10 36.5 13 36.5C17.5 36.5 21.5 33.5 24 31" stroke="#966a35" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>

          <p className="blessing-header-kicker">WITH THE BLESSINGS OF OUR FAMILIES</p>

          <p className="blessing-invite-text">
            WE CORDIALLY INVITE YOU TO<br />
            CELEBRATE THE WEDDING OF
          </p>

          {/* Bride Name in elegant cursive script calligraphy */}
          <div className="blessing-person">
            <h3 className="blessing-script-name">Tanya</h3>
            <p className="blessing-parents">(D/O Mrs. Anita &amp; Mr. Pramod Kumar Saini)</p>
          </div>

          {/* Middle Lotus Divider with 'WITH' */}
          <div className="blessing-divider-middle">
            <div className="divider-flourish">
              <span className="flourish-line" />
              <span className="flourish-lotus">🪷</span>
              <span className="flourish-line" />
            </div>
            <p className="blessing-with">WITH</p>
          </div>

          {/* Groom Name in elegant cursive script calligraphy */}
          <div className="blessing-person">
            <h3 className="blessing-script-name">Abhishek</h3>
            <p className="blessing-parents">(S/O Mrs. Sunita Devi &amp; Mr. Raj Kumar Saini)</p>
          </div>

          {/* Bottom Divider with Date & Venue */}
          <div className="blessing-footer-divider">
            <div className="divider-diamond-line">
              <span className="diamond-rule" />
              <span className="diamond-glyph">✧</span>
              <span className="diamond-rule" />
            </div>

            <p className="blessing-dates">19–20 NOVEMBER 2026</p>

            <div className="divider-diamond-line">
              <span className="diamond-rule" />
              <span className="diamond-glyph">✧</span>
              <span className="diamond-rule" />
            </div>

            <p className="blessing-city">RISHIKESH</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// 6) Last Page: Exact 2nd uploaded image with 3rd uploaded photo in frame, with original celebratory text below
function LastPageCelebration(){
  return (
    <footer className="footer-last-page-lux">
      {/* Exact uploaded artwork composite with sunset photo framed and floral accents intact */}
      <div className="lux-art-canvas">
        <img
          src="/assets/last-page-composite.jpg"
          alt="We cannot wait to celebrate with you - Tanya & Abhishek"
          className="lux-art-bg-img"
          loading="lazy"
        />

        {/* Floating flower petals */}
        <div className="lux-drifting-petals" aria-hidden="true">
          {Array.from({length: 12}, (_, i) => (
            <span key={i} className={`lux-petal petal-float-${i}`} />
          ))}
        </div>

        {/* Typography directly below the frame matching user reference design */}
        <motion.div
          className="lux-wording-wrap"
          initial={{ opacity: 0, y: 22, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Heart Divider: ─── 💛 ─── */}
          <div className="lux-heart-divider">
            <span className="heart-rule" />
            <span className="heart-icon">💛</span>
            <span className="heart-rule" />
          </div>

          {/* Cursive script text: We cannot wait to celebrate with you */}
          <h2 className="lux-script-quote">
            We cannot wait to celebrate with you
          </h2>

          {/* Golden Lotus emblem */}
          <div className="lux-lotus-seal">
            <svg width="34" height="26" viewBox="0 0 48 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 2C24 2 28 12 28 22C28 27.5 25.5 32 24 34C22.5 32 20 27.5 20 22C20 12 24 2 24 2Z" stroke="#deb572" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M24 14C27.5 16 35.5 21 35.5 27.5C35.5 31.5 32.5 34 29 34C26.5 34 24.8 32.5 24 31" stroke="#deb572" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M24 14C20.5 16 12.5 21 12.5 27.5C12.5 31.5 15.5 34 19 34C21.5 34 23.2 32.5 24 31" stroke="#deb572" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M24 22C29 23.5 41 27.5 41 33C41 35.5 38 36.5 35 36.5C30.5 36.5 26.5 33.5 24 31" stroke="#deb572" strokeWidth="1.4" strokeLinecap="round"/>
              <path d="M24 22C19 23.5 7 27.5 7 33C7 35.5 10 36.5 13 36.5C17.5 36.5 21.5 33.5 24 31" stroke="#deb572" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Date & Location: 20 NOVEMBER 2026 · RISHIKESH */}
          <p className="lux-event-date">
            20 NOVEMBER 2026 &nbsp;·&nbsp; RISHIKESH
          </p>

          {/* Diamond Rule: ─── ✦ ─── */}
          <div className="lux-diamond-rule">
            <span className="diamond-dash" />
            <span className="diamond-star">✦</span>
            <span className="diamond-dash" />
          </div>
        </motion.div>
      </div>

      <a
        href="https://www.instagram.com/invitestory.in/"
        target="_blank"
        rel="noreferrer"
        className="lux-footer-credit"
      >
        Crafted with love by @invitestory.in
      </a>
    </footer>
  );
}

function App(){
  const [entered,setEntered]=useState(false);
  const [musicPlaying,setMusicPlaying]=useState(false);
  const audioRef=useRef<HTMLAudioElement>(null);
  const reduce=useReducedMotion();
  const {scrollYProgress}=useScroll();
  const leafY=useTransform(scrollYProgress,[0,1],[0,180]);
  const page=useRef<HTMLElement>(null);

  const startCelebration = () => {
    setEntered(true);
    // Play celebratory wedding background music safely with continuous loop
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.55;
      audio.loop = true;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setMusicPlaying(true))
          .catch(() => setMusicPlaying(false));
      }
    }
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicPlaying) {
      audio.pause();
      setMusicPlaying(false);
    } else {
      audio.play().then(() => setMusicPlaying(true)).catch(() => {});
    }
  };

  // GSAP animations for interactive scroll movements
  useEffect(()=>{
    if(reduce||!entered||!page.current)return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx=gsap.context(()=>{
      gsap.fromTo('.hero-copy>*',{opacity:0,y:20},{opacity:1,y:0,duration:1,stagger:.1,ease:'power3.out'});
      gsap.utils.toArray<HTMLElement>('.event').forEach((el,i)=>gsap.fromTo(el,{opacity:0,x:i%2?-35:35},{opacity:1,x:0,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 86%',end:'top 58%',scrub:.8}}));
      gsap.to('.map i',{y:-10,repeat:-1,yoyo:true,duration:1.2,ease:'sine.inOut'});

      // Animated Dynamic Swaying & Floating Lanterns (Requirement 5)
      gsap.utils.toArray<HTMLElement>('.atmos-lantern').forEach((el,i)=>{
        const depth=Number(el.dataset.depth||.4);
        gsap.to(el,{
          yPercent:-95*depth,
          x:Math.sin(i*1.8)*24*depth,
          rotation:i%2?7:-7,
          ease:'none',
          scrollTrigger:{
            trigger:page.current,
            start:'top top',
            end:'bottom bottom',
            scrub:1.1+depth
          }
        });
        gsap.to(el.querySelector('.lantern-flame'),{
          scaleY:1.22,
          scaleX:1.12,
          opacity:.85,
          repeat:-1,
          yoyo:true,
          duration:.65+i*.09,
          ease:'sine.inOut'
        });
      });
    },page);
    return()=>ctx.revert();
  },[entered,reduce]);

  return (
    <main ref={page}>
      {/* 8) Background Wedding Audio with Continuous Looping */}
      <audio ref={audioRef} src="/assets/wedding-music.mp3" loop preload="auto" />

      {/* Floating Audio Toggle Button */}
      {entered && (
        <motion.button
          initial={{opacity:0,scale:0.8}}
          animate={{opacity:1,scale:1}}
          className={`audio-control-btn ${musicPlaying ? 'is-playing' : ''}`}
          onClick={toggleMusic}
          aria-label={musicPlaying ? 'Mute celebratory music' : 'Play celebratory music'}
          title={musicPlaying ? 'Mute celebratory music' : 'Play celebratory music'}
        >
          {musicPlaying ? <SpeakerHigh size={20} weight="fill" /> : <SpeakerSlash size={20} weight="fill" />}
          <span className="audio-soundwaves">
            <i /><i /><i />
          </span>
        </motion.button>
      )}

      <motion.div className="scroll-progress" style={{scaleX:scrollYProgress}}/>

      {/* 5) Dynamic Moving Animating Lantern Atmosphere with Pendulum Sway */}
      <div className="lantern-atmosphere" aria-hidden="true">
        {[
          {x:7, y:10, d:.25, s:.68, b:2, sway:4.5},
          {x:91, y:18, d:.38, s:.82, b:1.2, sway:5.8},
          {x:10, y:38, d:.72, s:1.08, b:.3, sway:4.0},
          {x:92, y:52, d:.32, s:.62, b:2.4, sway:6.2},
          {x:5, y:70, d:1, s:1.35, b:.1, sway:3.8},
          {x:88, y:82, d:.65, s:.95, b:.7, sway:5.0},
          {x:48, y:60, d:.20, s:.45, b:3, sway:4.8}
        ].map((l,i)=>(
          <span
            key={i}
            className={`atmos-lantern lantern-swing-${i % 3}`}
            data-depth={l.d}
            style={{
              left:`${l.x}%`,
              top:`${l.y}%`,
              '--scale':l.s,
              '--blur':`${l.b}px`,
              '--sway-dur':`${l.sway}s`,
              '--delay':`${-i*.7}s`
            } as React.CSSProperties}
          >
            <i className="lantern-chain"/>
            <i className="lantern-cap"/>
            <i className="lantern-body">
              <b className="lantern-flame"/>
            </i>
            <i className="lantern-tail"/>
          </span>
        ))}
      </div>

      {/* 1) Royal Palace Gate Video Opener Screen */}
      {!entered && (
        <RoyalVideoWelcome onEnter={startCelebration} />
      )}

      {/* 
        2) Entrance Hero Section: 
        - Background is 1st uploaded image (entrance-mandap.jpg)
        - Bride & Groom names on top with pop-up bounce animation
        - Couple lifting PNG (2nd uploaded image) below with scroll pop-up animation
      */}
      <section className="hero">
        {/* Entrance background image: 1st uploaded image */}
        <div className="hero-mandap-backdrop" />
        <div className="hero-mandap-overlay" />

        {/* 3) Real Looking Hanging Flowers with gentle slow breeze animation */}
        <RealHangingFlowers />

        {/* Falling floral petals floating across hero */}
        <div className="hero-petals-flow" aria-hidden="true">
          {Array.from({length: 16}, (_, i) => (
            <span key={i} className={`hero-drifting-petal petal-flow-${i}`} />
          ))}
        </div>

        <motion.div
          className="hero-copy"
          initial={{opacity:0,y:22}}
          animate={{opacity:entered?1:0,y:entered?0:22}}
          transition={{delay:.15,duration:0.9,ease:[.16,1,.3,1]}}
        >
          <div className="arch-header">
            <span className="arch-lotus-glyph">🪷</span>
            <p className="blessing">TOGETHER WITH OUR FAMILIES</p>
            <div className="arch-filigree"><span>✦</span><i/><span>✦</span></div>
          </div>

          {/* 
            2) Bride & Groom names with royal typography & graceful slow pop-up animation
          */}
          <motion.h1
            className="hero-names"
            initial={{ opacity: 0, scale: 0.65, y: 35 }}
            animate={entered ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.65, y: 35 }}
            transition={{
              type: "spring",
              stiffness: 70,
              damping: 22,
              mass: 1.4,
              delay: 0.35
            }}
          >
            Tanya{' '}
            <motion.span
              className="names-amp"
              initial={{ scale: 0, rotate: -25 }}
              animate={entered ? { scale: 1, rotate: 0 } : { scale: 0 }}
              transition={{ delay: 0.85, type: "spring", stiffness: 90, damping: 20 }}
            >
              &
            </motion.span>{' '}
            Abhishek
          </motion.h1>

          <p className="hero-invite-line">invite you to celebrate our wedding</p>
          <div className="date-rule">
            <i/>
            <b>19 &amp; 20 NOVEMBER 2026</b>
            <i/>
          </div>
          <p className="hero-destination">Pebbles Resort · Rishikesh</p>
        </motion.div>

        {/* 
          2) Couple PNG image (lifting couple) popping up when scrolling
        */}
        <motion.div
          className="hero-couple-showcase"
          initial={{ opacity: 0, y: 55, scale: 0.88 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            type: "spring",
            stiffness: 220,
            damping: 18,
            delay: 0.2
          }}
        >
          <div className="hero-couple-halo" />
          <img
            src="/assets/lifting-couple.png"
            alt="Tanya & Abhishek in celebratory pose"
            className="hero-couple-png"
          />
        </motion.div>

        <motion.div className="leaf-float left" style={{y:reduce?0:leafY}}/>
        <motion.div className="leaf-float right" style={{y:reduce?0:leafY}}/>

        <div className="scroll-cue">
          <ArrowDown size={20}/>
          <span>Our Celebrations</span>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="count-section">
        <Reveal>
          <p className="kicker">Until the festivities begin</p>
          <h2>Counting every heartbeat</h2>
          <Countdown/>
        </Reveal>
      </section>

      {/* Interactive Scratch-to-reveal Date Section (19 & 20) */}
      <ScratchDate/>

      {/* 
        4) Two Paths One Forever replaced with family blessing card page matching 3rd uploaded image
      */}
      <FamilyBlessingCard />

      {/* 
        5) "Before forever begins" section: 1st uploaded image
        With text overlay as earlier:
        "Before forever begins"
        "a celebration of love, a lifetime of togetherness, and memories to cherish forever"
        "Swipe through our celebration below"
      */}
      <section className="ceremony-moment">
        <div className="floating-glass lotus-one">✿</div>
        <div className="floating-glass lotus-two">❀</div>
        <div className="floating-diya">◒</div>

        <div className="ceremony-image">
          <img
            src="/assets/before-forever-begins.jpg"
            loading="lazy"
            alt="Before forever begins - Tanya and Abhishek wedding celebration"
            className="ceremony-artwork"
          />

          {/* Text overlay on the lower maroon area */}
          <motion.div
            className="ceremony-text-overlay"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="ceremony-filigree-line">
              <i /><span>✦</span><i />
            </div>
            <h2 className="ceremony-title">Before forever begins</h2>
            <p className="ceremony-desc">
              a celebration of love, a lifetime of togetherness, and memories to cherish forever
            </p>
            <div className="ceremony-swipe-cue">
              <span>Swipe through our celebration below</span>
              <ArrowDown size={14} className="ceremony-swipe-arrow" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Wedding Festivities & Schedule with festive vibration motion */}
      <section className="events">
        <Reveal>
          <h2>Wedding Festivities</h2>
          <p className="section-intro">Six beautiful ceremonies. One unforgettable celebration.</p>
        </Reveal>
        <div className="event-list">
          {events.map((e,i)=>(
            <motion.div
              className={'event event-vibe-card '+(i===4?'featured':'')}
              key={e.name}
              initial={{opacity: 0, y: 26}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true, amount: 0.15}}
              transition={{delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1]}}
            >
              <div className="event-number">0{i+1}</div>
              <div>
                <span className="event-icon event-icon-vibe">{e.icon}</span>
                <h3>{e.name}</h3>
                <p>{e.note}</p>
                <dl>
                  <div className="dl-full"><dt>Date</dt><dd>{e.date}</dd></div>
                  {e.times.map((t, idx)=>(
                    <div key={idx}><dt>{t.label}</dt><dd>{t.time}</dd></div>
                  ))}
                  <div><dt>Venue</dt><dd>{e.venue}</dd></div>
                </dl>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Venue Section with Rishikesh Google Maps */}
      <section className="venue ornamental">
        <Reveal>
          <MapPin size={38} weight="thin"/>
          <p className="script">Meet us in Rishikesh</p>
          <h2>Pebbles Resort</h2>
          <p>Neelkanth Road, Rattapani, Rishikesh, Pauri Garhwal, Uttarakhand</p>

          <div className="map google-map">
            <iframe
              title="Google Map of Pebbles Resort Rishikesh"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=Pebbles+Resort+Neelkanth+Road+Rattapani+Rishikesh&z=15&output=embed"
            />
            <div className="map-overlay">
              <span><MapPin size={19} weight="fill"/>Wedding Venue</span>
              <b>Pebbles Resort · Rishikesh</b>
              <small>Pinch or drag to explore the route</small>
            </div>
          </div>

          <div className="actions">
            <a
              className="button primary"
              href="https://www.google.com/maps/search/?api=1&query=Pebbles+Resort+Neelkanth+Road+Rattapani+Rishikesh"
              target="_blank"
              rel="noreferrer"
            >
              <MapPin size={19}/>Open in Google Maps
            </a>
            <button className="button secondary" onClick={addCalendar}>
              <CalendarBlank size={19}/>Add to Calendar
            </button>
          </div>
        </Reveal>
      </section>

      {/* 
        7) Last Page Recreated exactly from 4th uploaded image 
        (Chocolate brown, hanging lanterns, lace frame, couple dummy photo, script calligraphy)
      */}
      <LastPageCelebration />
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App/>);
