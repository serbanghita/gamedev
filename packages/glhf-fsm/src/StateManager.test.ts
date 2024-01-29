import StateManager, {IStateInstance, StateStatus} from "./StateManager";

describe('StateManager', () => {
    describe('getDefaultState', () => {
        class IdleState implements IStateInstance {
            status = StateStatus.NOT_STARTED;

            enter(...args: any[]): boolean {
                return false;
            }

            exit(): void {
            }

            update(): boolean {
                return true;
            }

        }
        it('getDefaultState exception', () => {
            const sm = new StateManager();
            expect(() => sm.getDefaultState()).toThrow('No "default" state has been set.');
        });
        it('getDefaultState success', () => {
            const sm = new StateManager();

            sm.registerState(
                'idle', 0, new IdleState()
            );

            sm.setDefaultStateId('idle');

            expect(sm.getDefaultState().id).toBe('idle');
            expect(sm.getDefaultState().priority).toEqual(0);
            expect(sm.getDefaultState().instance).toBeInstanceOf(IdleState);
        });
    });

});