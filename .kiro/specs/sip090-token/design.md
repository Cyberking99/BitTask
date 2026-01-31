# SIP-090 Token Contract Design

## Overview

This design document outlines the implementation of a SIP-090 compliant NFT contract for the Stacks blockchain. The contract will provide a standard interface for non-fungible tokens, ensuring compatibility with existing Stacks ecosystem tools, wallets, and marketplaces.

## Architecture

The SIP-090 token contract follows a modular architecture with clear separation of concerns:

- **Core Token Logic**: Handles minting, burning, and ownership tracking
- **Transfer Logic**: Manages token transfers and approval mechanisms  
- **Metadata Management**: Stores and retrieves token metadata URIs
- **Access Control**: Ensures only authorized principals can perform restricted operations
- **Event System**: Emits standardized events for ecosystem integration

## Components and Interfaces

### Core Contract Functions

**Required SIP-090 Interface Functions:**
- `get-last-token-id() -> (response uint uint)`
- `get-token-uri(token-id uint) -> (response (optional (string-ascii 256)) uint)`
- `get-owner(token-id uint) -> (response (optional principal) uint)`
- `transfer(token-id uint, sender principal, recipient principal) -> (response bool uint)`

**Additional Management Functions:**
- `mint(recipient principal, token-uri (string-ascii 256)) -> (response uint uint)`
- `set-token-uri(token-id uint, uri (string-ascii 256)) -> (response bool uint)`
- `get-balance(owner principal) -> (response uint uint)`
- `get-approved(token-id uint) -> (response (optional principal) uint)`
- `approve(spender principal, token-id uint) -> (response bool uint)`

### Data Models

**Token Storage:**
```clarity
;; Maps token ID to owner
(define-map token-owners uint principal)

;; Maps token ID to metadata URI
(define-map token-uris uint (string-ascii 256))

;; Maps token ID to approved operator
(define-map token-approvals uint principal)

;; Maps owner to token count
(define-map owner-balances principal uint)

;; Contract metadata
(define-data-var contract-owner principal tx-sender)
(define-data-var last-token-id uint u0)
(define-data-var token-name (string-ascii 32) "SIP090 Token")
(define-data-var token-symbol (string-ascii 10) "SIP090")
```

**Error Codes:**
```clarity
(define-constant ERR-NOT-AUTHORIZED (err u401))
(define-constant ERR-NOT-FOUND (err u404))
(define-constant ERR-ALREADY-EXISTS (err u409))
(define-constant ERR-INVALID-RECIPIENT (err u400))
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After reviewing the prework analysis, several properties can be consolidated to eliminate redundancy:

- Properties 2.1 and 2.4 both test transfer state updates - combining into comprehensive transfer property
- Properties 1.3, 1.4, and 5.2 all test query functions - can be unified into query consistency property  
- Properties 4.1, 4.3, and 4.5 all test minting behavior - combining into comprehensive mint property
- Properties 3.1 and 3.3 both test approval state - combining into approval consistency property

**Property 1: Contract metadata consistency**
*For any* contract state, querying contract name, symbol, and total supply should return consistent, valid metadata
**Validates: Requirements 1.2**

**Property 2: Token query consistency** 
*For any* valid token ID, get-owner and get-token-uri should return the correct owner and URI respectively
**Validates: Requirements 1.3, 1.4, 5.2**

**Property 3: Last token ID accuracy**
*For any* contract state, get-last-token-id should return the highest minted token ID
**Validates: Requirements 1.5**

**Property 4: Transfer ownership update**
*For any* valid token transfer by the owner, the ownership should update correctly and be queryable immediately
**Validates: Requirements 2.1, 2.4, 2.5**

**Property 5: Unauthorized transfer rejection**
*For any* transfer attempt by a non-owner without approval, the transaction should be rejected
**Validates: Requirements 2.2**

**Property 6: Invalid recipient rejection**
*For any* transfer to an invalid principal, the transaction should be rejected
**Validates: Requirements 2.3**

**Property 7: Approval management consistency**
*For any* token owner approving an operator, the approval should be recorded and queryable accurately
**Validates: Requirements 3.1, 3.3**

**Property 8: Approved operator transfer**
*For any* approved operator, they should be able to transfer tokens on behalf of the owner
**Validates: Requirements 3.2**

**Property 9: Approval revocation**
*For any* approval that is revoked, the operator should no longer be able to transfer the token
**Validates: Requirements 3.4**

**Property 10: Transfer clears approvals**
*For any* token transfer, existing approvals for that token should be automatically cleared
**Validates: Requirements 3.5**

**Property 11: Mint creates token correctly**
*For any* mint operation by the contract owner, a new token should be created with correct ID, owner, and incremented supply
**Validates: Requirements 4.1, 4.3, 4.5**

**Property 12: Unauthorized mint rejection**
*For any* mint attempt by a non-owner, the transaction should be rejected
**Validates: Requirements 4.2**

**Property 13: Mint event emission**
*For any* successful mint, a Transfer event should be emitted from none to the recipient
**Validates: Requirements 4.4**

**Property 14: Token existence accuracy**
*For any* token ID, the existence check should accurately reflect whether the token has been minted
**Validates: Requirements 5.1**

**Property 15: Balance accuracy**
*For any* principal, the balance should accurately reflect the number of tokens they own
**Validates: Requirements 5.3**

**Property 16: Token ID sequencing**
*For any* sequence of mints, token IDs should be sequential starting from 1
**Validates: Requirements 5.4**

## Error Handling

The contract implements comprehensive error handling with specific error codes:

- **ERR-NOT-AUTHORIZED (u401)**: Returned when a principal attempts an operation they're not authorized for
- **ERR-NOT-FOUND (u404)**: Returned when querying non-existent tokens or invalid data
- **ERR-ALREADY-EXISTS (u409)**: Returned when attempting to create something that already exists
- **ERR-INVALID-RECIPIENT (u400)**: Returned when transfer recipient is invalid

All public functions return response types with appropriate error codes, ensuring calling contracts can handle failures gracefully.

## Testing Strategy

**Dual testing approach requirements**:

The testing strategy combines unit testing and property-based testing for comprehensive coverage:

- **Unit tests** verify specific examples, edge cases, and error conditions
- **Property tests** verify universal properties that should hold across all inputs
- Together they provide comprehensive coverage: unit tests catch concrete bugs, property tests verify general correctness

**Unit testing requirements**:

Unit tests will cover:
- Specific examples demonstrating correct SIP-090 compliance
- Edge cases like minting to contract addresses
- Error conditions and proper error code returns
- Integration between different contract functions

**Property-based testing requirements**:

- Use **fast-check** library for TypeScript-based property testing with Clarinet
- Configure each property-based test to run a minimum of 100 iterations
- Tag each property-based test with format: '**Feature: sip090-token, Property {number}: {property_text}**'
- Each correctness property must be implemented by a single property-based test
- Property tests will generate random token IDs, principals, and URIs to verify universal behavior