import {parseArgs, format} from 'node:util';
// Keep the public JSON channel clean during Chromium downloads and renderer logs.
console.log = console.info = (...args: unknown[]) => {process.stderr.write(format(...args) + '\n');};
import {execute} from './production';

try {
  const {positionals, values} = parseArgs({allowPositionals: true, options: {
    title: {type: 'string'}, license: {type: 'string'}, language: {type: 'string'}, purpose: {type: 'string'},
    briefing: {type: 'string'},
    audio: {type: 'string'}, alignment: {type: 'string'}, origin: {type: 'string'}, 'audio-license': {type: 'string'}, attribution: {type: 'string'},
    target: {type: 'string'}, decision: {type: 'string'}, reviewer: {type: 'string'}, notes: {type: 'string'}, digest: {type: 'string'},
    'asset-origin': {type: 'string'}, 'asset-license': {type: 'string'}, font: {type: 'string'}, image: {type: 'string'}, frame: {type: 'string'}, output: {type: 'string'},
  }});
  if (positionals.length !== 2) throw new Error('Usage: npm run video -- <init|status|import-briefing|import-audio|preview|review|render|validate|frame> <run> [options]');
  const result = await execute(positionals[0], positionals[1], values);
  process.stdout.write(JSON.stringify(result, null, 2) + '\n');
} catch (error) {
  process.stderr.write(JSON.stringify({status: 'failed', error: error instanceof Error ? error.message : String(error)}) + '\n');
  process.exitCode = 1;
}
