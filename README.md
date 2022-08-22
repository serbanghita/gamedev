# glhf
> Game library for 2d games written in Typescript. \
> GL HF stands for "Good luck, have fun!"

### Boostrapping a game

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
