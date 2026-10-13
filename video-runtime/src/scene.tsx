import React, {useEffect, useState} from 'react';
import {AbsoluteFill, Audio, Composition, cancelRender, continueRender, delayRender, Img, interpolate, registerRoot, staticFile, useCurrentFrame} from 'remotion';
import type {BriefingProposal, Manifest} from './contracts';
import {composeTransforms, movementTransform as transformForMovement} from './motion';
import {headingFontFamily} from './scene-style';

type PlannedScene = BriefingProposal['storyboard'][number] & {startFrame: number; endFrame: number};
type Caption = {text: string; startFrame: number; endFrame: number};
type Props = {
  scene: Manifest['scene']; storyboard: PlannedScene[]; profile: BriefingProposal['profile']; purpose: BriefingProposal['purpose']; language: BriefingProposal['language'];
  captions: Caption[]; durationInFrames: number; resources: {audio: string | null; font: string | null; image: string | null};
};

const Artwork = ({scene, accent, frame, language}: {scene: PlannedScene; accent: string; frame: number; language: BriefingProposal['language']}) => {
  const drift = interpolate(frame % 60, [0, 60], [0, 28]);
  if (scene.composition.template === 'comparison') {
    return <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, height: 470, alignItems: 'stretch'}}>
      {[0, 1].map((side) => <div key={side} style={{border: `2px solid ${accent}`, borderRadius: 28, padding: 32, display: 'grid', placeItems: 'center', opacity: 0.65 + ((frame + side * 8) % 30) / 100}}>
        <div style={{width: 120 + (side ? drift : 0), height: 120 + (side ? drift : 0), borderRadius: side ? 24 : 100, background: accent, opacity: 0.8}}/>
      </div>)}
    </div>;
  }
  if (scene.composition.template === 'product') {
    return <div style={{height: 470, display: 'grid', placeItems: 'center'}}><div style={{width: 320, height: 380, borderRadius: 38, border: `3px solid ${accent}`, display: 'grid', placeItems: 'center', transform: `translateY(${Math.sin(frame / 18) * 10}px)`, boxShadow: `0 28px 70px ${accent}33`}}><div style={{width: 190, height: 190, borderRadius: 38, background: accent, opacity: 0.85}}/></div></div>;
  }
  if (scene.composition.template === 'data') {
    const data = scene.composition.data;
    const max = Math.max(1, ...data.map((point) => point.value));
    const locale = language === 'pt-BR' ? 'pt-BR' : 'en';
    return <div style={{height: 470, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24, padding: 24}}>{data.map((point) => <div key={point.id}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 16, fontSize: 23, marginBottom: 8}}><span>{point.label}</span><strong>{new Intl.NumberFormat(locale, {maximumFractionDigits: 2}).format(point.value)} {point.unit}</strong></div>
      <div style={{height: 22, width: '100%', background: `${accent}22`, borderRadius: 99}}><div style={{height: '100%', width: `${max === 0 ? 0 : point.value / max * 100}%`, background: accent, borderRadius: 99}}/></div>
    </div>)}</div>;
  }
  if (scene.composition.template === 'closing') {
    return <div style={{height: 470, display: 'grid', placeItems: 'center'}}><svg width="260" height="260" viewBox="0 0 260 260" style={{transform: `scale(${1 + Math.sin(frame / 20) * 0.025})`}}><circle cx="130" cy="130" r="112" fill="none" stroke={accent} strokeWidth="4"/><path d="M 82 132 H 178 M 142 96 L 178 132 L 142 168" fill="none" stroke={accent} strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/></svg></div>;
  }
  const scale = 1 + Math.min(frame, 30) / 300;
  return <div style={{height: 470, display: 'grid', placeItems: 'center'}}>
    {scene.composition.template === 'diagram' ? <svg viewBox="0 0 900 470" width="100%" height="100%" aria-label="Diagram illustrating the scene">
      <g transform={`translate(450 235) scale(${scale}) translate(-450 -235)`}>
        {[[-240,-100],[-80,-100],[80,-100],[240,-100],[-240,100],[-80,100],[80,100],[240,100]].map(([x,y], i) => <g key={i}><circle cx={450 + x} cy={235 + y} r="28" fill={accent}/><path d={`M ${450 + x} ${235 + y} L ${450 + x + (x < 0 ? 44 : -44)} ${235 + y}`} stroke={accent} opacity="0.3" strokeWidth="5"/></g>)}
      </g>
    </svg> : <div style={{height: 330, width: 330, border: `3px solid ${accent}`, borderRadius: '50%', display: 'grid', placeItems: 'center', transform: `rotate(${frame * 0.25}deg)`}}><div style={{height: 180, width: 180, border: `2px solid ${accent}66`, borderRadius: '50%'}}/></div>}
  </div>;
};

const Scene = ({scene: fallback, storyboard, captions, profile, purpose, language, resources}: Props) => {
  const frame = useCurrentFrame();
  const activeCaption = captions.find((caption) => frame >= caption.startFrame && frame < caption.endFrame);
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

  const active = storyboard.find((planned) => frame >= planned.startFrame && frame < planned.endFrame) ?? storyboard.at(-1);
  const planned = active ?? {id: fallback.id, purpose: 'Fallback scene', narrationSegmentIds: [], composition: {template: 'typography' as const, headline: fallback.title, supportingText: null, data: []}, movement: {style: 'hold' as const, description: '', anchor: ''}, transition: {type: 'cut' as const, description: ''}, sound: {cue: ''}, reviewCriterion: '', startFrame: 0, endFrame: fallback.endFrame};
  const localFrame = Math.max(0, frame - planned.startFrame);
  const entrance = planned.transition.type === 'cut' ? 1 : interpolate(localFrame, [0, 16], [0, 1], {extrapolateRight: 'clamp'});
  const entranceTransform = planned.transition.type === 'slide' ? `translateX(${(1 - entrance) * 80}px)` : `translateY(${(1 - entrance) * 40}px)`;
  const transform = composeTransforms(entranceTransform, transformForMovement(planned.movement.style, localFrame));
  return <AbsoluteFill style={{background: profile.colors.background, color: profile.colors.foreground, padding: '180px 90px 260px', fontFamily: resources.font ? 'ProductionFont' : `${profile.typography.body}, Arial, sans-serif`}}>
    <div style={{fontSize: 28, letterSpacing: 5, textTransform: 'uppercase', color: profile.colors.accent}}>{profile.name} · {purpose}</div>
    <div style={{position: 'relative', height: 600, marginTop: 56, overflow: 'hidden', opacity: entrance, transform}}>
      {resources.image ? <Img src={staticFile(resources.image)} style={{width: '100%', height: '100%', objectFit: 'contain'}}/> : <Artwork scene={planned} accent={profile.colors.accent} frame={localFrame} language={language}/>}
    </div>
    <h1 style={{fontFamily: headingFontFamily(profile.typography.heading, Boolean(resources.font)), fontSize: 76, lineHeight: 1.06, fontWeight: 700, overflowWrap: 'anywhere', margin: '40px 0 0', opacity: entrance, transform}}>{planned.composition.headline}</h1>
    {planned.composition.supportingText && <p style={{fontSize: 34, lineHeight: 1.3, maxWidth: 850, marginTop: 24, opacity: entrance}}>{planned.composition.supportingText}</p>}
    {activeCaption && <div style={{position: 'absolute', left: 90, right: 90, bottom: 100, display: 'flex', justifyContent: 'center', pointerEvents: 'none'}}>
      <span style={{maxWidth: 900, padding: '12px 22px', borderRadius: 12, backgroundColor: 'rgba(0, 0, 0, 0.82)', color: '#ffffff', fontSize: 34, fontWeight: 700, lineHeight: 1.2, textAlign: 'center', overflowWrap: 'anywhere'}}>{activeCaption.text}</span>
    </div>}
    {resources.audio && <Audio src={staticFile(resources.audio)}/>}
  </AbsoluteFill>;
};

const fallbackProfile: BriefingProposal['profile'] = {id: 'fallback', name: 'Local motion study', typography: {heading: 'Arial', body: 'Arial'}, colors: {background: '#f4f0e8', foreground: '#17202e', accent: '#245bcc'}, voicePreference: 'Imported audio', motionLanguage: 'Deterministic frame motion'};
const defaults: Props = {scene: {id: 'scene-001', title: 'Local scene', background: '#f4f0e8', accent: '#245bcc', font: null, image: null, startFrame: 0, endFrame: 30}, storyboard: [], captions: [], profile: fallbackProfile, purpose: 'channel', language: 'pt-BR', durationInFrames: 30, resources: {audio: null, font: null, image: null}};
registerRoot(() => <Composition id="LocalScene" component={Scene} width={1080} height={1920} fps={30} durationInFrames={30} defaultProps={defaults} calculateMetadata={({props}) => ({durationInFrames: props.durationInFrames})}/>);
