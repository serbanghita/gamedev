# glhf
> Game library for 2d games written in Typescript. \
> GL HF stands for "Good luck, have fun!"

### Boostrapping a game

```ts
import {map, state, keyboard, viewport, camera, start} from "@glhf/engine";

state({ playerName: "Gali", playerScore: 0 })
map("map.tmx")
entityDef("kil.json")
entitySprite("kil.png")
entityDef("dino.json")
entitySprite("dino.png")
keyboard()
viewport({ width: 600, height: 400 })
camera({ width: 600, height: 400 })
start()

```
