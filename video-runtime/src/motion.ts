import type {BriefingProposal} from './contracts';

export type MovementStyle = BriefingProposal['storyboard'][number]['movement']['style'];

export function movementTransform(style: MovementStyle, frame: number): string {
  switch (style) {
    case 'drift': return `translateX(${Math.sin(frame / 24) * 18}px)`;
    case 'zoom': return `scale(${1 + Math.min(frame, 60) / 240})`;
    case 'orbit': return `rotate(${Math.sin(frame / 30) * 3}deg)`;
    case 'pulse': return `scale(${1 + Math.sin(frame / 10) * 0.025})`;
    case 'rise': return `translateY(${(1 - Math.min(frame, 30) / 30) * 24}px)`;
    case 'hold': return '';
  }
}

export function composeTransforms(...transforms: string[]): string {
  const parts = transforms.filter((transform) => transform && transform !== 'none');
  return parts.length ? parts.join(' ') : 'none';
}
