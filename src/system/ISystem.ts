import { Container } from 'pixi.js';

/* eslint-disable no-unused-vars */

/** Define the structure of a system which can be added to a game. */
export interface ISystem {
    /** A unique identifier for the system. */
    SYSTEM_ID: string;
    /** The container instance that is the root of all visuals in this system */
    view: Container
    /** Method called when the system is initialized. Called only once when the system is instantiated. */
    init?: () => void;
    /** Method called when the system is awakened. Called every time the game is started. */
    awake?: () => void;
    /** Method called when the system's game logic starts. Called every time the game is started. */
    start?: () => void;
    /** Method called every time the game updates, with the delta time passed as argument. Called multiple times during gameplay. */
    update?: (delta: number) => void;
    /** Method called when the system's game logic needs to end. Called every time the game has ended. */
    end?: () => void;
    /** Method called to reset the system. Called every time the game has ended. */
    reset?: () => void;
    /** Method called when the system is resized, with the new width and height passed as arguments. Called every time the screen has resized. */
    resize?: (w: number, h: number) => void;
}
