# WordSD — 2D Game Engine Based On PixiJS

![wordsd_github_logo](https://github.com/labiker/WordSD/assets/49630998/12ad2a25-e914-4c31-9dfe-91ad8c2d5b1f)

[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/xVVk5hdkXK)
[![Electron Forge](https://badgen.net/badge/Electron%20Forge/7.1.0/green?icon=https://www.electronjs.org/assets/img/logo.svg)](https://www.electronforge.io/config/configuration)
[![PixiJS](https://badgen.net/badge/PixiJS/7.3.2/green)](https://pixijs.download/v7.3.2/docs/index.html)

Welcome to WordSD!

WordSD is a 2D game engine based entirely on [PixiJS](https://pixijs.com/).

It provides the necessary features needed to develop text adventure games.

WordSD is currently in its infancy, and anyone interested in developing a game engine is welcome to join!

## Why develop WordSD?

I am an AVG enthusiast, and for a long time I have been trying to write a JavaScript-like language using the [Kirikiri](https://web.archive.org/web/20171216224325/http://kikyou.info/tvp) engine to develop games. 

However, the `TJS2` programming language used by Kirikiri does not support many functions that are convenient for programmers to develop a software like the current `JavaScript` and `TypeScript`.

In addition, the update progress of Kirikiri-related open source projects has been slow in recent years, and the atmosphere of the domestic Kirikiri game development community has become rigid, so I've given up on using the Kirikiri engine.

Nevertheless, after using the `HTML5` engine `PixiJS` for a period of time, I found that its functions are very complete, its update speed is very fast, and its related game development components are also very comprehensive.

It is very suitable for developing AVG, so I came up with the idea of using it to develop a AVG and a game engine similar to Kirikiri but with personal characteristics, so I started developing WordSD.

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
  import { image } from '../core/image';
  import { Assets } from 'pixi.js';

  /** Initialise and start loading of all assets */
  export async function initAssets() {
      // Load sound assets
      sound.add('sightless_storm_ii', 'app://assets/audio/sightless_storm_ii.mp3');
      sound.add('sfx_print', 'app://assets/audio/sfx_print.mp3');

      // Load image assets
      await image.add('player', 'img://player.png');
      await image.add('play_btn_up', 'img://play_btn_up.png');

      // Load font assets
      await Assets.load('app://assets/fonts/Ma_Shan_Zheng/Ma_Shan_Zheng.ttf');
      await Assets.load('app://assets/fonts/ZCOOL_XiaoWei/ZCOOL_XiaoWei.ttf');
  }
  ```

  Customized a file reading protocol that follows [generic URI syntax](https://datatracker.ietf.org/doc/html/rfc3986#section-3), and set up packaging code for the `assets` folder in the root directory.

  You can put any asset you want to use into this directory and read it using a custom protocol.

- Audio

  ```ts
  import { bgm, sfx } from '../module/audio';
  
  bgm.play('sightless_storm_ii');
  // ...
  sfx.play('sfx_print', { loop: true });
  // ...
  sfx.stop('sfx_print');
  ```

  The audio module has been added referring to PixiJS's [open-games](https://github.com/pixijs/open-games) repository. 

  You can refer to the official game code to use audio in this project.

- Image

  ```ts
  const player = new Sprit(image.find('player'));
  ```

  The method of importing and using image is similar to sound. You need to use the `image.add` function to import the texture in advance, and then use the `image.find` function to obtain it. Note that the `image.add` function is an `async` function.

  Or,

  ```ts
  const player = Sprit.from('img://player.png');
  ```

  This method is to read the image under the specified path through a custom protocol, and also needs to read the resource into the cache in advance through the `image.add` function.

- Font

  ```ts
  const title = new Text('WordSD');
  title.style.fontFamily = 'Ma Shan Zheng';
  ```

  Font materials are imported through [Assets](https://pixijs.com/guides/components/assets).

  It should be noted that when using imported fonts, the corresponding key may be different from the file name. 
  
  For example, the key of `Ma_Shan_Zheng.ttf` will be set to `Ma Shan Zheng` and the key of `ZCOOL_XiaoWei.ttf` will be set to `Zcool Xiaowei`. 
  
  The rule is that `-` and `_` will be replaced with `space`, and then spaces are used to divide strings. Only the first letter of each string will be capitalized.
  
  In addition, there are other rules, please see the [relevant source code](https://github.com/pixijs/pixijs/blob/dev/packages/assets/src/loader/parsers/loadWebFont.ts) for details.

## How to start

- Node JS
- yarn

If you don't already have Node.js and yarn, go install them. Then, in the folder where you have cloned the repository, install the dependencies using yarn:

```sh
yarn
```

Then, to start the engine, run:

```sh
yarn start
```
