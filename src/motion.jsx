import React, { useEffect, useRef, useState } from 'react';
import { image } from './catalog';

const reducedMotion = '(prefers-reduced-motion: reduce)';
const compactViewport = '(max-width: 740px)';
const campaign = '/video/campaign-desktop.mp4';
const compactCampaign = '/video/campaign-mobile.mp4';
const campaignPoster = '/images/campaign-poster.jpg';

export function CampaignVideo() {
  const video = useRef(null);
  const poster = useRef(null);
  const [reduced, setReduced] = useState(() => matchMedia(reducedMotion).matches);
  const [compact] = useState(() => matchMedia(compactViewport).matches);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const [hasFrame, setHasFrame] = useState(false);

  useEffect(() => {
    const preference = matchMedia(reducedMotion);
    const update = () => setReduced(preference.matches);
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reduced || ready) return;
    let cancelled = false;
    let paintFrame;
    let startFrame;
    poster.current.decode().catch(() => {}).then(() => {
      if (cancelled) return;
      // Give the browser a paint before the background video starts downloading.
      paintFrame = requestAnimationFrame(() => {
        startFrame = requestAnimationFrame(() => setReady(true));
      });
    });
    return () => {
      cancelled = true;
      cancelAnimationFrame(paintFrame);
      cancelAnimationFrame(startFrame);
    };
  }, [reduced, ready]);

  useEffect(() => {
    const player = video.current;
    if (!ready || reduced || paused || failed) {
      player.pause();
    } else {
      player.play().catch(() => {});
    }
  }, [ready, reduced, paused, failed]);

  function toggle() {
    if (playing) {
      video.current.pause();
      setPaused(true);
    } else {
      setReady(true);
      setPaused(false);
      if (ready) video.current.play().catch(() => {});
    }
  }

  return <>
    <img ref={poster} className="hero-photo hero-poster" src={campaignPoster} alt="" fetchPriority="high"/>
    <video ref={video} className="hero-photo hero-video" data-has-frame={hasFrame && !reduced && !failed}
      src={ready && !reduced ? (compact ? compactCampaign : campaign) : undefined}
      muted loop playsInline preload="none" aria-hidden="true"
      onPlaying={() => { setPlaying(true); setHasFrame(true); }}
      onPause={() => setPlaying(false)} onError={() => setFailed(true)}/>
    {!reduced && !failed && <button className="video-toggle" type="button"
      aria-label={playing ? 'Pause background video' : 'Play background video'} onClick={toggle}>
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
        {playing ? <path d="M9 6v12m6-12v12" stroke="currentColor" strokeWidth="1.5"/> : <path d="m9 6 9 6-9 6z" fill="currentColor"/>}
      </svg>
    </button>}
  </>;
}

const letterFrames = [
  ['L', 'editorial-1', 'Gold pendant worn with blue linen'],
  ['Y', 'piece-13', 'Sculpted gold hoops'],
  ['O', 'editorial-2', 'Gold rings worn in layers'],
  ['R', 'feature', 'Green tourmaline ring on stone'],
  ['E', 'editorial-3', 'Gold earring worn with indigo silk'],
  ['N', 'editorial-4', 'A jeweler finishing a gold ring'],
];

export function FooterWordmark() {
  const [active, setActive] = useState(-1);

  function follow(event) {
    if (event.pointerType !== 'mouse') return;
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    button.style.setProperty('--letter-x', ((event.clientX - rect.left) / rect.width - 0.5) * 22 + 'px');
    button.style.setProperty('--letter-y', ((event.clientY - rect.top) / rect.height - 0.5) * 18 + 'px');
  }

  return <div className="footer-word" role="group" aria-label="Lyoren wordmark gallery"
    onPointerLeave={event => { if (event.pointerType === 'mouse') setActive(-1); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setActive(-1); }}
    onKeyDown={event => { if (event.key === 'Escape') setActive(-1); }}>
    {letterFrames.map(([letter, photo, label], index) => <button key={letter} type="button" className="footer-letter"
      data-active={active === index} aria-label={letter + ' — ' + label} aria-pressed={active === index}
      onPointerEnter={event => { if (event.pointerType === 'mouse') setActive(index); }}
      onPointerMove={follow}
      onFocus={event => { if (event.currentTarget.matches(':focus-visible')) setActive(index); }}
      onClick={event => {
        if (event.detail === 0 || event.nativeEvent.pointerType !== 'mouse') setActive(current => current === index ? -1 : index);
        else setActive(index);
      }}>
      <span aria-hidden="true">{letter}</span>
      <img className="letter-image" alt="" loading="lazy" decoding="async" src={image(photo)}/>
    </button>)}
  </div>;
}

export function PointerMotion() {
  const cursor = useRef(null);

  useEffect(() => {
    const finePointer = matchMedia('(any-hover: hover) and (any-pointer: fine)');
    const preference = matchMedia(reducedMotion);
    const dot = cursor.current;
    let frame = 0;
    let visible = false;
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;

    function paint() {
      x += (targetX - x) * 0.38;
      y += (targetY - y) * 0.38;
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > 0.15 ? requestAnimationFrame(paint) : 0;
    }

    function hide() {
      dot.dataset.visible = 'false';
      document.documentElement.classList.remove('has-motion-cursor');
      visible = false;
      cancelAnimationFrame(frame);
      frame = 0;
    }

    function move(event) {
      if (event.pointerType !== 'mouse' || !finePointer.matches || preference.matches ||
          event.target.closest('dialog, input, textarea, select, [contenteditable]')) {
        hide();
        return;
      }
      targetX = event.clientX;
      targetY = event.clientY;
      if (!visible) {
        x = targetX;
        y = targetY;
        dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        dot.dataset.visible = 'true';
        document.documentElement.classList.add('has-motion-cursor');
        visible = true;
      }
      dot.dataset.light = Boolean(event.target.closest('[data-cursor-light], .collection-card'));
      dot.dataset.interactive = Boolean(event.target.closest('a, button, summary'));
      if (!frame) frame = requestAnimationFrame(paint);
    }

    function press() { dot.dataset.pressed = 'true'; }
    function release() { dot.dataset.pressed = 'false'; }
    document.addEventListener('pointermove', move, { passive:true });
    document.addEventListener('pointerdown', press, { passive:true });
    document.addEventListener('pointerup', release, { passive:true });
    document.addEventListener('pointercancel', release, { passive:true });
    document.documentElement.addEventListener('pointerleave', hide);
    window.addEventListener('blur', hide);
    finePointer.addEventListener('change', hide);
    preference.addEventListener('change', hide);
    return () => {
      hide();
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerdown', press);
      document.removeEventListener('pointerup', release);
      document.removeEventListener('pointercancel', release);
      document.documentElement.removeEventListener('pointerleave', hide);
      window.removeEventListener('blur', hide);
      finePointer.removeEventListener('change', hide);
      preference.removeEventListener('change', hide);
    };
  }, []);

  return <div className="motion-cursor" ref={cursor} aria-hidden="true"><span/></div>;
}
