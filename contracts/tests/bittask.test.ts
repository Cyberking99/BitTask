
import { describe, it, expect } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const wallet1 = accounts.get("wallet_1")!;

describe('bittask contract', () => {
    it('ensure that user can create a task', () => {
        const amount = 1000;
        const deadline = 50;
        const { result } = simnet.callPublicFn(
            'bittask',
            'create-task',
            [
                Cl.stringAscii("Test Task"),
                Cl.stringAscii("Description of the task"),
                Cl.uint(amount),
                Cl.uint(simnet.blockHeight + 50)
            ],
            wallet1
        );
        expect(result).toBeOk(Cl.uint(1));
    });

    it('ensure that task creation fails with zero amount', () => {
        const amount = 0;
        const { result } = simnet.callPublicFn(
            'bittask',
            'create-task',
            [
                Cl.stringAscii("Test Task"),
                Cl.stringAscii("Description of the task"),
                Cl.uint(amount),
                Cl.uint(simnet.blockHeight + 50)
            ],
            wallet1
        );
        expect(result).toBeErr(Cl.uint(100)); // ERR-ZERO-AMOUNT
    });

    it('ensure that task creation fails with past deadline', () => {
        const amount = 1000;
        const { result } = simnet.callPublicFn(
            'bittask',
            'create-task',
            [
                Cl.stringAscii("Test Task"),
                Cl.stringAscii("Description"),
                Cl.uint(amount),
                Cl.uint(simnet.blockHeight)
            ],
            wallet1
        );
        expect(result).toBeErr(Cl.uint(103)); // ERR-PAST-DEADLINE
    });

    it('ensure that task data is stored correctly', () => {
        const amount = 500;
        const deadline = simnet.blockHeight + 100;

        simnet.callPublicFn(
            'bittask',
            'create-task',
            [
                Cl.stringAscii("Task 2"),
                Cl.stringAscii("Desc 2"),
                Cl.uint(amount),
                Cl.uint(deadline)
            ],
            wallet1
        );

        const task = simnet.callReadOnlyFn(
            'bittask',
            'get-task',
            [Cl.uint(1)],
            deployer
        );

        expect(task.result).toBeSome(Cl.tuple({
            title: Cl.stringAscii("Task 2"),
            description: Cl.stringAscii("Desc 2"),
            creator: Cl.principal(wallet1),
            worker: Cl.none(),
            amount: Cl.uint(amount),
            deadline: Cl.uint(deadline),
            status: Cl.stringAscii("open"),
            'created-at': Cl.uint(simnet.blockHeight)
        }));
    });
});
