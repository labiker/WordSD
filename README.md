# WordSD — 2D Game Engine Based On PixiJS

![wordsd_github_logo](https://github.com/labiker/WordSD/assets/49630998/12ad2a25-e914-4c31-9dfe-91ad8c2d5b1f)

[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/xVVk5hdkXK)
[![Electron Forge](https://badgen.net/badge/Electron%20Forge/6.3.0/green?icon=https://www.electronjs.org/assets/img/logo.svg)](https://www.electronforge.io/config/configuration)
[![PixiJS](https://badgen.net/badge/PixiJS/7.3.0/green)](https://pixijs.download/v7.3.0/docs/index.html)

Welcome to WordSD!

WordSD is a 2D game engine based entirely on PixiJS.

It provides the necessary features needed to develop text adventure games.

WordSeed is currently in its infancy, and anyone interested in developing a game engine is welcome to join!

## Current features

- Full-screen dialog

  ![image](https://github.com/labiker/WordSD/assets/49630998/3574149f-c919-4025-8e6d-dc40790f35dd)

  Able to simulate typing effects and print text verbatim.

  Contains the necessary keyboard events and mouse click events.
  
  Options offer more possibilities for your story. 
  
  With multiple text types, it will significantly improve the readability of your own game.

- Back log (record Pixi.Text automatically)

  ![image](https://github.com/labiker/WordSD/assets/49630998/29c59b2a-d039-4036-93ba-442b453642c7)

  Historical text is recorded fully automatically, and some properties (such as color) can be inherited from the original text.
 
  Well-equipped mouse click and scroll wheel events are in line with the usage habits of users of traditional text adventure games.

  The scroll bar can display the position of the current text in the context and can be dragged to adjust the view.

- File reading protocol

  ```ts
  import { sound } from '@pixi/sound';
  
  /** Initialise and start loading of all assets */
  export async function initAssets() {
      // Load sound assets
      sound.add('sightless-storm-ii', 'app://assets/audio/sightless-storm-ii.mp3');
      sound.add('sfx_print', 'app://assets/audio/sfx_print.mp3');
  }
  ```

  Customized a file reading protocol that follows [generic URI syntax](https://datatracker.ietf.org/doc/html/rfc3986#section-3), and set up packaging code for the `assets` folder in the root directory.

  You can put any asset you want to use into this directory and read it using a custom protocol.

- Audio

  ```ts
  import { bgm, sfx } from '../module/audio';
  
  bgm.play('sightless-storm-ii');
  // ...
  sfx.play('sfx_print', { loop: true });
  // ...
  sfx.stop('sfx_print');
  ```

  The audio module has been added referring to PixiJS's [open-games](https://github.com/pixijs/open-games) repository. 

  You can refer to the official game code to use audio in this project.

## How to start

- Node JS
- yarn

If you don't already have Node.js and yarn, go install them. Then, in the folder where you have cloned the repository, install the dependencies using yarn:

```sh
yarn
```

Then, to start the engine, run:

```sh
yarn run start
```
