# Finite State Machine
> Finite State Machine that supports registering custom states, state priority and queued states.
> This is a package part of the glhf.js library but can be used independently.


## Usage

**Registering states**

```typescript
import StateManager from "./StateManager";

const sm = new StateManager();
sm.registerState(new IdleState('idle', 99, true)); // default state.
sm.registerState(new IdleState('attack', 1));
sm.registerState(new IdleState('walk', 2));

sm.update();
```

Registered states have to extend the class `State` where you can implement your custom actions by extending the methods:

```
    enter(...args: any[]);
    exit()
    update()
```

**Triggering a State**

```typescript
sm.triggerState('attack', ...params);
```

**Queueing states**

```typescript
sm.queueState('tell_story_a', ...params);
sm.queueState('smoke_a_cigar', ...params);
```