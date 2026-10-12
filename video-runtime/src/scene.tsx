import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Composition, Img, cancelRender, continueRender, delayRender, interpolate, registerRoot, staticFile, useCurrentFrame} from 'remotion';
import type {Manifest} from './contracts';

type Props = {scene: Manifest['scene']; durationInFrames: number; resources: {audio: string | null; font: string | null; image: string | null}};
const Scene = ({scene, resources}: Props) => {
  const frame = useCurrentFrame();
  const [ready] = useState(() => delayRender('Required scene font', {timeoutInMilliseconds: 20_000}));
  useEffect(() => {
    let active = true;
    const load = async () => {
      if (resources.font) {
        const font = new FontFace('ProductionFont', `url("${staticFile(resources.font)}")`);
        await font.load(); document.fonts.add(font);
      }
      await document.fonts.ready;
      if (active) continueRender(ready);
    };
    load().catch((error) => cancelRender(new Error(`Font resource failed to load: ${String(error)}`)));
    return () => {active = false;};
  }, [ready, resources.font]);
  const entry = interpolate(frame, [0, 20], [0, 1], {extrapolateRight: 'clamp'});
  return <AbsoluteFill style={{background: scene.background, color: '#17202e', padding: '180px 90px 260px', fontFamily: resources.font ? 'ProductionFont' : 'Arial, sans-serif'}}>
    <div style={{fontSize: 30, letterSpacing: 7, textTransform: 'uppercase', color: scene.accent}}>Grimoire · motion study</div>
    <div style={{position: 'relative', height: 710, marginTop: 80, overflow: 'hidden'}}>
      {resources.image ? <Img src={staticFile(resources.image)} style={{width: '100%', height: '100%', objectFit: 'contain'}}/> : <svg viewBox="0 0 900 710" width="100%" height="100%">
        <circle cx="450" cy="355" r="245" fill="none" stroke={scene.accent} strokeWidth="3"/>
        <circle cx="450" cy="355" r="150" fill="none" stroke={scene.accent} strokeWidth="2" opacity="0.3"/>
        <g transform={`rotate(${frame * 1.5} 450 355)`}><circle cx="450" cy="110" r="28" fill={scene.accent}/><path d="M 450 355 L 450 110" stroke={scene.accent} strokeWidth="4"/></g>
        <circle cx="450" cy="355" r={35 + 8 * Math.sin(frame / 12)} fill={scene.accent}/>
      </svg>}
    </div>
    <h1 style={{fontSize: 86, lineHeight: 1.08, fontWeight: 700, overflowWrap: 'anywhere', margin: '80px 0 0', opacity: entry, transform: `translateY(${(1 - entry) * 60}px)`}}>{scene.title}</h1>
    {resources.audio && <Audio src={staticFile(resources.audio)}/>}
  </AbsoluteFill>;
};
const defaults: Props = {scene: {id: 'scene-001', title: 'Uma cena em movimento', background: '#f4f0e8', accent: '#245bcc', font: null, image: null, startFrame: 0, endFrame: 30}, durationInFrames: 30, resources: {audio: null, font: null, image: null}};
registerRoot(() => <Composition id="LocalScene" component={Scene} width={1080} height={1920} fps={30} durationInFrames={30} defaultProps={defaults} calculateMetadata={({props}) => ({durationInFrames: props.durationInFrames})}/>);
