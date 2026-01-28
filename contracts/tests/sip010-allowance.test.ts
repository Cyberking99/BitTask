import { describe, expect, it } from 'vitest';
import { Cl } from '@stacks/transactions';

const accounts = simnet.getAccounts();
const deployer = accounts.get('deployer')!;
const alice = accounts.get('wallet_1')!;
const bob = accounts.get('wallet_2')!;

describe('SIP-010 Token - Allowance System', () => {
  it('should approve and check allowances', () => {
    const approveAmount = 5000;
    
    const approve = simnet.callPublicFn(
      'sip010-token', 
      'approve', 
      [Cl.principal(alice), Cl.uint(approveAmount)], 
      deployer
    );
    
    expect(approve.result).toBeOk(Cl.bool(true));
    
    const allowance = simnet.callReadOnlyFn(
      'sip010-token', 
      'get-allowance', 
      [Cl.principal(deployer), Cl.principal(alice)], 
      deployer
    );
    
    expect(allowance.result).toBeOk(Cl.uint(approveAmount));
  });

  it('should return zero allowance for non-approved spenders', () => {
    const allowance = simnet.callReadOnlyFn(
      'sip010-token', 
      'get-allowance', 
      [Cl.principal(deployer), Cl.principal(bob)], 
      deployer
    );
    
    expect(allowance.result).toBeOk(Cl.uint(0));
  });

  it('should update allowance when approved multiple times', () => {
    const firstApproval = 1000;
    const secondApproval = 2000;
    
    // First approval
    simnet.callPublicFn('sip010-token', 'approve', [Cl.principal(alice), Cl.uint(firstApproval)], deployer);
    
    // Second approval should overwrite
    simnet.callPublicFn('sip010-token', 'approve', [Cl.principal(alice), Cl.uint(secondApproval)], deployer);
    
    const allowance = simnet.callReadOnlyFn(
      'sip010-token', 
      'get-allowance', 
      [Cl.principal(deployer), Cl.principal(alice)], 
      deployer
    );
    
    expect(allowance.result).toBeOk(Cl.uint(secondApproval));
  });
});