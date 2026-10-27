import React, {useEffect, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {motion, useReducedMotion, useScroll, useTransform} from 'motion/react';
import {CalendarBlank, MapPin, SpeakerHigh, SpeakerSlash, FlowerLotus, Sparkle, ArrowDown} from '@phosphor-icons/react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
import './styles.css';

// Wedding Date: Haldi starts 19 November 2026 at 9:00 AM
const WEDDING_START = new Date('2026-11-19T09:00:00+05:30');

const events = [
  {
    name: 'Haldi',
    date: '19 November 2026 (Thursday)',
    time: '9:00 AM',
    venue: 'Pebbles Resort, Rishikesh',
    note: 'Sunshine, turmeric, and the warmest laughter with our closest family.',
    icon: '💛'
  },
  {
    name: 'Mehndi',
    date: '19 November 2026 (Thursday)',
    time: '1:30 PM',
    venue: 'Pebbles Resort, Rishikesh',
    note: 'Delicate henna patterns, folk music, and joyous afternoon celebrations.',
    icon: '🌿'
  },
  {
    name: 'Engagement & Sangeet',
    date: '19 November 2026 (Thursday)',
    time: '5:30 PM',
    venue: 'Pebbles Resort, Rishikesh',
    note: 'Exchange of rings, music, and an unforgettable night of dance under the starlit sky.',
    icon: '✨'
  },
  {
    name: 'Wedding Ceremony',
    date: '20 November 2026 (Friday)',
    time: 'Morning Auspicious Muhurat',
    venue: 'Pebbles Resort, Rishikesh',
    note: 'Sacred pheras by the holy Ganges as our two souls unite forever.',
    icon: '💍'
  },
];

function Reveal({children, className=''}:{children:React.ReactNode,className?:string}){
  const reduce=useReducedMotion();
  return <motion.div className={className} initial={reduce?false:{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.75,ease:[.16,1,.3,1]}}>{children}</motion.div>;
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
            <b>19 · 20</b>
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

// Royal Palace Gate Welcome with Seamless Door Opening Animation
function RoyalGateWelcome({onEnter}:{onEnter:()=>void}){
  const [opening, setOpening] = useState(false);

  const handleOpen = () => {
    if (opening) return;
    setOpening(true);
    // Smooth transition into the invitation
    setTimeout(() => {
      onEnter();
    }, 1100);
  };

  return (
    <div
      className={`royal-welcome ${opening ? 'is-opening' : ''}`}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      aria-label="Open Tanya & Abhishek wedding invitation"
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleOpen(); }}
    >
      {/* Background preview of hero couple revealed as doors part */}
      <div className="gate-backdrop-reveal" aria-hidden="true">
        <img src="/assets/hero-couple.jpg" alt="" className="gate-backdrop-img" />
        <div className="gate-divine-glow" />
      </div>

      {/* Floating flower petals */}
      <div className="gate-petals-burst" aria-hidden="true">
        {Array.from({length: 16}, (_, i) => (
          <span key={i} className={`gate-petal petal-${i}`} />
        ))}
      </div>

      {/* Seamless Royal Double Doors: perfectly intact before clicking, parting on click */}
      <div className="gate-doors-wrapper" aria-hidden="true">
        <div className="gate-door-half left-door">
          <img src="/assets/gate-open.jpg" alt="Left palace gate" className="gate-full-img" />
        </div>
        <div className="gate-door-half right-door">
          <img src="/assets/gate-open.jpg" alt="Right palace gate" className="gate-full-img" />
        </div>
        <div className="gate-seam-glow" />
      </div>

      {/* Interactive CTA Button overlaid on the bottom pill */}
      <div className="gate-action-area">
        <button
          type="button"
          aria-label="Open Tanya and Abhishek's wedding invitation"
          className="open-gate-btn"
          onClick={e => {
            e.stopPropagation();
            handleOpen();
          }}
        >
          <span className="btn-glow-ring" />
          <span className="btn-lotus-seal">🪷</span>
          <span className="btn-text-wrap">
            <strong className="btn-title">Open our invitation</strong>
            <small className="btn-subtitle">TAP TO ENTER</small>
          </span>
          <Sparkle size={18} weight="fill" className="btn-sparkle" />
        </button>
        <span className="tap-hint">Tap anywhere to open invitation</span>
      </div>

      <button
        type="button"
        className="skip-gate-btn"
        onClick={e => {
          e.stopPropagation();
          onEnter();
        }}
      >
        Skip intro →
      </button>
    </div>
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
    // Play celebratory wedding background music safely
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.55;
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

  useEffect(()=>{
    if(reduce||!entered||!page.current)return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx=gsap.context(()=>{
      gsap.fromTo('.hero-copy>*',{opacity:0,y:20},{opacity:1,y:0,duration:1,stagger:.1,ease:'power3.out'});
      gsap.utils.toArray<HTMLElement>('.event').forEach((el,i)=>gsap.fromTo(el,{opacity:0,x:i%2?-35:35},{opacity:1,x:0,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 86%',end:'top 58%',scrub:.8}}));
      gsap.fromTo('.story-inner',{clipPath:'inset(0 50% 0 50%)',opacity:.4},{clipPath:'inset(0 0% 0 0%)',opacity:1,ease:'power2.out',scrollTrigger:{trigger:'.story',start:'top 80%',end:'center 55%',scrub:1}});
      gsap.to('.map i',{y:-10,repeat:-1,yoyo:true,duration:1.2,ease:'sine.inOut'});
      gsap.utils.toArray<HTMLElement>('.atmos-lantern').forEach((el,i)=>{
        const depth=Number(el.dataset.depth||.4);
        gsap.to(el,{yPercent:-90*depth,x:Math.sin(i)*18*depth,rotation:i%2?4:-4,ease:'none',scrollTrigger:{trigger:page.current,start:'top top',end:'bottom bottom',scrub:1.2+depth}});
        gsap.to(el.querySelector('.lantern-flame'),{scaleY:1.18,opacity:.72,repeat:-1,yoyo:true,duration:.7+i*.08,ease:'sine.inOut'});
      });
    },page);
    return()=>ctx.revert();
  },[entered,reduce]);

  return (
    <main ref={page}>
      {/* Background Wedding Audio */}
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

      {/* Lantern Atmosphere */}
      <div className="lantern-atmosphere" aria-hidden="true">
        {[
          {x:6,y:12,d:.22,s:.62,b:2.2},
          {x:89,y:20,d:.35,s:.78,b:1.4},
          {x:12,y:42,d:.7,s:1.05,b:.4},
          {x:93,y:55,d:.28,s:.58,b:2.6},
          {x:4,y:72,d:1,s:1.35,b:.2},
          {x:87,y:84,d:.62,s:.92,b:.8},
          {x:48,y:64,d:.18,s:.42,b:3.2}
        ].map((l,i)=>(
          <span key={i} className="atmos-lantern" data-depth={l.d} style={{left:`${l.x}%`,top:`${l.y}%`,'--scale':l.s,'--blur':`${l.b}px`,'--delay':`${-i*.6}s`} as React.CSSProperties}>
            <i className="lantern-chain"/><i className="lantern-cap"/><i className="lantern-body"><b className="lantern-flame"/></i><i className="lantern-tail"/>
          </span>
        ))}
      </div>

      {/* 2) Before opening page: Royal Gate Welcome Screen with animated opening */}
      {!entered && (
        <RoyalGateWelcome onEnter={startCelebration} />
      )}

      {/* 1) Hero Section: 1st uploaded couple image in full width with perfectly centered arch typography */}
      <section className="hero">
        <img
          className="hero-art"
          src="/assets/hero-couple.jpg"
          alt="Tanya and Abhishek embracing under a floral arch by the holy Ganges in Rishikesh"
        />
        <div className="hero-scrim"/>

        {/* Text placed in the sunset arch space above Tanya and Abhishek - perfectly centered */}
        <motion.div
          className="hero-copy"
          initial={{opacity:0,y:16}}
          animate={{opacity:entered?1:0,y:entered?0:16}}
          transition={{delay:.15,duration:0.9,ease:[.16,1,.3,1]}}
        >
          <div className="arch-header">
            <span className="arch-lotus-glyph">🪷</span>
            <p className="blessing">TOGETHER WITH OUR FAMILIES</p>
            <div className="arch-filigree"><span>✦</span><i/><span>✦</span></div>
          </div>
          <h1>Tanya <span>&</span> Abhishek</h1>
          <p className="hero-invite-line">invite you to celebrate our wedding</p>
          <div className="date-rule">
            <i/>
            <b>19 – 20 NOVEMBER 2026</b>
            <i/>
          </div>
          <p className="hero-destination">Pebbles Resort · Rishikesh</p>
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

      {/* Interactive Scratch-to-reveal Date Section */}
      <ScratchDate/>

      {/* Story Section */}
      <section className="story ornamental">
        <Reveal className="story-inner">
          <FlowerLotus size={34} weight="thin"/>
          <p className="script">A celebration of love</p>
          <h2>Two paths, one forever</h2>
          <p>
            From chance hellos to a thousand shared dreams, we found home in each other.
            With joyful hearts and the blessings of our beloved families, we invite you to witness
            the beginning of our forever in the divine embrace of Rishikesh.
          </p>
          <div className="signature">Tanya <i>&</i> Abhishek</div>
        </Reveal>
      </section>

      {/* 3) "Painted in sunshine before forever begins" section: full width exact image without boxing or duplicate text */}
      <section className="ceremony-moment">
        <div className="floating-glass lotus-one">✿</div>
        <div className="floating-glass lotus-two">❀</div>
        <div className="floating-diya">◒</div>

        <div className="ceremony-image">
          <img
            src="/assets/haldi-couple.jpg"
            loading="lazy"
            alt="Tanya and Abhishek haldi ceremony moment - Painted in sunshine before forever begins"
            className="ceremony-artwork"
          />
        </div>

        <Reveal className="ceremony-subcue">
          <span>Scroll to explore wedding festivities ↓</span>
        </Reveal>
      </section>

      {/* Wedding Festivities & Schedule */}
      <section className="events">
        <Reveal>
          <h2>Wedding Festivities</h2>
          <p className="section-intro">Four beautiful ceremonies. One unforgettable celebration.</p>
        </Reveal>
        <div className="event-list">
          {events.map((e,i)=>(
            <Reveal className={'event '+(i===3?'featured':'')} key={e.name}>
              <div className="event-number">0{i+1}</div>
              <div>
                <span className="event-icon">{e.icon}</span>
                <h3>{e.name}</h3>
                <p>{e.note}</p>
                <dl>
                  <div><dt>Date</dt><dd>{e.date}</dd></div>
                  <div><dt>Time</dt><dd>{e.time}</dd></div>
                  <div><dt>Venue</dt><dd>{e.venue}</dd></div>
                </dl>
              </div>
            </Reveal>
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

      {/* Footer */}
      <footer>
        <img src="/assets/hero-couple.jpg" loading="lazy" alt="Tanya and Abhishek celebration"/>
        <div className="footer-overlay"/>
        <Reveal className="footer-copy">
          <Sparkle size={27} weight="thin"/>
          <p>We cannot wait to celebrate with you</p>
          <h2>Tanya <i>&</i> Abhishek</h2>
          <span>19 – 20 November 2026 · Rishikesh</span>
        </Reveal>
        <a
          href="https://www.instagram.com/invitestory.in/"
          target="_blank"
          rel="noreferrer"
          style={{
            position:'relative',
            zIndex:2,
            display:'block',
            marginTop:'16px',
            fontSize:'9px',
            textTransform:'uppercase',
            letterSpacing:'.18em',
            color:'rgba(255,242,214,.45)',
            textDecoration:'none',
            paddingBottom:'16px'
          }}
        >
          Crafted with love by @invitestory.in
        </a>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<App/>);
