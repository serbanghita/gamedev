import Entity from "../Entity";

export function render(entity: Entity) {
    console.log('render', entity);
}

export function loop(now: DOMHighResTimeStamp) {
    console.log('loop', now);
    window.requestAnimationFrame(loop);
}