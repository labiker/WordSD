# WordSD — 2D Game Engine Based On PixiJS

![wordsd_github_logo](https://github.com/labiker/WordSD/assets/49630998/12ad2a25-e914-4c31-9dfe-91ad8c2d5b1f)

[![Discord](https://badgen.net/badge/icon/discord?icon=discord&label)](https://discord.gg/xVVk5hdkXK)
[![Electron Forge](https://badgen.net/badge/Electron%20Forge/6.3.0/green?icon=https://www.electronjs.org/assets/img/logo.svg)](https://www.electronforge.io/config/configuration)
[![PixiJS](https://badgen.net/badge/PixiJS/7.2.4/green)](https://pixijs.download/v7.2.4/docs/index.html)

Welcome to WordSD!

WordSD is a 2D game engine based entirely on PixiJS.

It provides the necessary features needed to develop text adventure games.

Different from traditional game engines, it pursues a new way of game development.

WordSeed is currently in its infancy, and anyone interested in developing a game engine is welcome to join!

## Current features
* Modular development

  All the modules in the project are independent of each other and interact directly with PixiJS. Therefore, you can modify and import the modules of this project into your own PixiJS game according to your own needs.

* Full-screen dialog

  ![image](https://github.com/labiker/WordSD/assets/49630998/3574149f-c919-4025-8e6d-dc40790f35dd)

  Ability to print text verbatim. Contains the necessary keyboard events and mouse click events. Options offer more possibilities for your story. With multiple text types, it will significantly improve the readability of your own game.

* Back log (record Pixi.Text automatically)

  ![image](https://github.com/labiker/WordSD/assets/49630998/2cfac082-7308-47f0-81a3-9e65e021c434)

  Historical text is recorded fully automatically, and some properties (such as color) can be inherited from the original text. Well-equipped mouse click and scroll wheel events are in line with the usage habits of users of traditional text adventure games.

## How to start
* Node JS
* yarn

If you don't already have Node.js and yarn, go install them. Then, in the folder where you have cloned the repository, install the dependencies using yarn:

```sh
yarn
```

Then, to start the engine, run:

```sh
yarn run start
```
