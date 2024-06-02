glhf
====

![glhf.js](./docs/logo.png)

> Game library for 2d games written in Typescript. \
> GL HF stands for "Good luck, have fun!"


## Packages

* [glhf-assets](./packages/glhf-assets) - Helper to load assets files (JSON, Images).
* [glhf-bitmask](./packages/glhf-bitmask) - Bitmask library for fast bitwise operations.
* [glfh-component](./packages/glhf-component) - Generic opinionated ECS Components.
* [glhf-ecs](./packages/glhf-ecs) - ECS Library that implements the following classes Entity, Component, System, Query, World
* [glhf-fsm](./packages/glhf-fsm) - Finite State Machine implementation.
* [glhf-input](./packages/glhf-input) - Implementation of inputs like Keyboard, Mouse and Controller.
* [glhf-renderer](./packages/glhf-renderer) - Rendering UI and Canvas utilities.

## Demo

* [glhf-demo](./packages/glhf-demo) - A demo of a 2d game implementation using glhf.js library

## Development

Library is currently under development. \
You can see the progress by following me at https://www.youtube.com/@SerbanTV \
Catch me on the [Discord server](https://discord.gg/Vur9NaF) to discuss stuff about game dev, ECS, etc.

## New repo

```
npm install --save-dev eslint @eslint/js @types/eslint__js typescript typescript-eslint
```

## Bootstrapping a game (wip)

```ts
import {map, state, keyboard, viewport, camera, start} from "@glhf/engine";

// Starting an endless game.
// Goals, move the player on the screen.

map("map.tmx")
entityDef("kil.json")
entitySprite("kil.png")
keyboard()
viewport({ width: 600, height: 400 })
camera({ width: 600, height: 400 })
start()

// Starting a game with a winning and losing condition.

state({ playerName: "Gali", playerScore: 0, gameStatus: PLAYING })
map("map.tmx")
entityDef("kil.json")
entitySprite("kil.png")
entityDef("dino.json")
entitySprite("dino.png")
keyboard()
viewport({ width: 600, height: 400 })
camera({ width: 600, height: 400 })
system('gameplay system', (world) => {
  // This can have interactions between entities
  
  // Winning conditions
  
  // Losing conditions
  
  // Scoring conditions?
})
start()
```
