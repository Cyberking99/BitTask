import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';
import { assertEquals, assertExists } from 'https://deno.land/std@0.90.0/testing/asserts.ts';

/**
 * Property-Based Tests for SIP-090 NFT Contract
 * 
 * These tests implement the correctness properties defined in the design document
 * to ensure the contract behaves correctly across all valid inputs.
 */

// **Feature: sip090-token, Property 1: Contract metadata consistency**
// **Validates: Requirements 1.2**
Clarinet.test({
    name: "Property 1: Contract metadata consistency - metadata should always be valid and consistent",
    async fn(chain: Chain, accounts: Map<string, Account>) {
        const deployer = accounts.get('deployer')!;
        
        // Test contract metadata consistency across multiple calls
        for (let i = 0; i < 100; i++) {
            let metadataBlock = chain.mineBlock([
                Tx.contractCall('sip090-nft', 'get-contract-name', [], deployer.address),
                Tx.contractCall('sip090-nft', 'get-contract-symbol', [], deployer.address),
                Tx.contractCall('sip090-nft', 'get-total-supply', [], deployer.address)
            ]);
            
            // Contract name should always be consistent
            const name = metadataBlock.receipts[0].result.expectOk();
            assertEquals(name, types.ascii("SIP090 NFT"));
            
            // Contract symbol should always be consistent  
            const symbol = metadataBlock.receipts[1].result.expectOk();
            assertEquals(symbol, types.ascii("SIP090"));
            
            // Total supply should be a valid uint
            const totalSupply = metadataBlock.receipts[2].result.expectOk();
            assertExists(totalSupply);
        }
    },
});