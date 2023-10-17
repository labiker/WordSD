import { sound } from '@pixi/sound';

/** Initialise and start background loading of all assets */
export async function initAssets() {
    // Load sound assets
    sound.add('primary-button-press', 'app://assets/audio/primary-button-press.wav');
    sound.add('sightless-storm-ii', 'app://assets/audio/sightless-storm-ii.mp3');
    sound.add('sfx_print', 'app://assets/audio/sfx_print.mp3');
}
