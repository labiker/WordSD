import { sound } from '@pixi/sound';

/** Initialise and start background loading of all assets */
export async function initAssets() {
    sound.add('sightless-storm-ii.mp3', 'app://assets/audio/sightless-storm-ii.mp3');
    sound.add('sfx_print.mp3', 'app://assets/audio/sfx_print.mp3');
}