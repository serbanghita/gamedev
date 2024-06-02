import StateManager from "./StateManager";
import spyOn = jest.spyOn;
import State, {StateStatus} from "./State";

describe('StateManager', () => {
    class IdleState extends State {

        enter(...args: any[]): boolean {
            super.enter(args);
            return false;
        }

        exit(): void {
            super.exit();
        }

        update(): boolean {
            super.update();
            return true;
        }
    }

    class AttackState extends State
    {
        enter(...args: any[]): boolean {
            super.enter(args);
            return false;
        }

        exit(): void {
            super.exit();
        }

        update(): boolean {
            super.update();
            return true;
        }
    }

    class HealingState extends State {

        enter(...args: any[]): boolean {
            super.enter(args);
            return false;
        }

        exit(): void {
            super.exit();
        }

        update(): boolean {
            super.update();
            if (this.tick === 2) {
                this.exit();
            }
            return true;
        }
    }

    it('registerState', () => {
        const sm = new StateManager();
        sm.registerState(new IdleState('idle', 0, true));

        const state = sm.getState('idle');

        expect(state).toBeInstanceOf(IdleState);
        expect(state.id).toBe('idle');
        expect(state.priority).toEqual(0);
        expect(state.isDefault).toBe(true);
    });

    it('getState', () => {
        const sm = new StateManager();
        expect(() => sm.getState('abcd')).toThrowError('Requested state abcd is not registered.');
    });

    describe('getCurrentState', () => {
        it('exception', () => {
            const sm = new StateManager();
            sm.registerState(new IdleState('idle', 0, true));

            expect(() => sm.getCurrentState()).toThrowError(`No "current" state has been set yet.`);
        });

        it('success', () => {
            const sm = new StateManager();
            sm.registerState(new IdleState('idle', 0, true));
            sm.update();

            expect(sm.getCurrentState()).toBeInstanceOf(IdleState);
            expect(sm.getCurrentState()).toMatchObject({
                id: 'idle',
                status: StateStatus.STARTED
            });

            sm.update();

            expect(sm.getCurrentState()).toBeInstanceOf(IdleState);
            expect(sm.getCurrentState()).toMatchObject({
                id: 'idle',
                status: StateStatus.RUNNING
            });

        });
    });

    describe('getDefaultState', () => {
        it('exception', () => {
            const sm = new StateManager();
            expect(() => sm.getDefaultState()).toThrow('No "default" state has been set.');
        });
        it('success', () => {
            const sm = new StateManager();

            sm.registerState(new IdleState('idle', 0, true));

            expect(sm.getDefaultState()).toBeInstanceOf(IdleState);
            expect(sm.getDefaultState().id).toBe('idle');
            expect(sm.getDefaultState().priority).toEqual(0);
            expect(sm.getDefaultState().isDefault).toBe(true);
        });
    });

    it('unregisterStateWithName', () => {
        const sm = new StateManager();
        sm.registerState(new IdleState('idle', 0, true));

        sm.unregisterStateWithName('idle');

        expect(() => sm.getState('idle')).toThrowError('Requested state idle is not registered.');
            expect(() => sm.getDefaultState()).toThrowError('No "default" state has been set.');
        expect(() => sm.getCurrentState()).toThrowError('No "current" state has been set yet.');
    });

    describe('triggerState', () => {
        it('non-existent state returns false', () => {
            const sm = new StateManager();
            expect(sm.triggerState('abc')).toBe(false);
        });

        it('if no current State exist then set the new triggered state and ENTER it', () => {
            const sm = new StateManager();
            const idleStateInstance = new IdleState('idle', 99);
            const idleSpyOnEnter = spyOn(idleStateInstance, 'enter');

            sm.registerState(idleStateInstance);

            expect(sm.triggerState('idle')).toBe(true);
            expect(sm.getCurrentState()).toBeInstanceOf(IdleState);
            expect(idleSpyOnEnter).toHaveBeenCalled();
        });

        it('attempting to trigger a state with lower priority than the current RUNNING state will return false', () => {
            const sm = new StateManager();
            const idleStateInstance = new IdleState('idle', 99, true);
            const attackStateInstance = new AttackState('attack', 1);

            sm.registerState(idleStateInstance);
            sm.registerState(attackStateInstance);

            expect(sm.triggerState('attack')).toBe(true);
            expect(sm.triggerState('idle')).toBe(false);
        });

        it('a State with higher priority stops the current state, and starts the new state', () => {

            const sm = new StateManager();
            const idleStateInstance = new IdleState('idle', 99, true);
            const idleSpyOnEnter = spyOn(idleStateInstance, 'enter');
            const idleSpyOnUpdate = spyOn(idleStateInstance, 'update');
            const idleSpyOnExit = spyOn(idleStateInstance, 'exit');
            sm.registerState(idleStateInstance);

            const attackStateInstance = new AttackState('attack', 1);
            const attackSpyOnEnter = spyOn(attackStateInstance, 'enter');
            const attackSpyOnUpdate = spyOn(attackStateInstance, 'update');
            const attackSpyOnExit = spyOn(attackStateInstance, 'exit');
            sm.registerState(attackStateInstance);

            expect(sm.getState('idle')).toBeInstanceOf(IdleState);
            expect(sm.getState('attack')).toBeInstanceOf(AttackState);
            expect(sm.getDefaultState()).toBeInstanceOf(IdleState);

            sm.update();

            expect(idleSpyOnEnter).toHaveBeenCalled();
            expect(idleSpyOnUpdate).not.toHaveBeenCalled();

            sm.update();

            expect(idleSpyOnEnter).toHaveBeenCalledTimes(1);
            expect(idleSpyOnUpdate).toHaveBeenCalledTimes(1);

            sm.update();

            expect(idleSpyOnEnter).toHaveBeenCalledTimes(1);
            expect(idleSpyOnUpdate).toHaveBeenCalledTimes(2);

            sm.triggerState('attack', 1, 2);

            expect(attackSpyOnEnter).toHaveBeenCalledWith(1, 2);

        });
    });

    describe('queue', () => {
        it('empty', () => {
            const sm = new StateManager();
            sm.queueState('first').queueState('second').queueState('third');

            expect(sm.hasQueue()).toBe(true);
            sm.emptyQueue();
            expect(sm.hasQueue()).toBe(false);
        });

        it('add a new state', () => {
            const sm = new StateManager();
            const idleStateInstance = new IdleState('idle', 99, true);
            const healingStateInstance = new HealingState('healing', 2);
            const attackStateInstance = new AttackState('attack', 1);
            sm.registerState(idleStateInstance);
            sm.registerState(healingStateInstance);
            sm.registerState(attackStateInstance);

            sm.triggerState('healing');
            sm.update();
            sm.update();

            sm.queueState('idle');

            sm.update();

            expect(sm.hasQueue()).toBe(false);
            expect(sm.getCurrentState()).toBeInstanceOf(IdleState);

            sm.queueState('attack');

            sm.update();
            // @note: At the moment queued States cannot override current running States even if
            // they have a higher priority. Subject to change.
            expect(sm.hasQueue()).toBe(true);
            expect(sm.getCurrentState()).toBeInstanceOf(IdleState);

        });

        it('adding a new unknown state will trigger the default state', () => {
            const sm = new StateManager();
            const idleStateInstance = new IdleState('idle', 99, true);
            const healingStateInstance = new HealingState('healing', 2);
            sm.registerState(idleStateInstance);
            sm.registerState(healingStateInstance);
            sm.update();
            sm.triggerState('healing');
            sm.queueState('unknown');
            sm.update();
            sm.update();
            sm.update();

            expect(sm.hasQueue()).toBe(false);
            expect(sm.getCurrentState()).toBeInstanceOf(IdleState);

        });
    });

});