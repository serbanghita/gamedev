import Component from "./Component";

export default abstract class StateComponent extends Component
{
    public abstract onEnter(): void
    public abstract onUpdate(): void
    public abstract onExit(): void
}