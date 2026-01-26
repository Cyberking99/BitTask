;; Staking Contract for Stacks Blockchain
;; This contract allows users to stake STX tokens and earn rewards

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-enough-balance (err u101))
(define-constant err-no-stake (err u102))
(define-constant err-already-staked (err u103))
(define-constant err-minimum-stake (err u104))
(define-constant err-reward-pool-empty (err u105))

;; Minimum stake amount (1 STX = 1,000,000 micro-STX)
(define-constant minimum-stake u1000000)
;; Data Variables
(define-data-var total-staked uint u0)
(define-data-var reward-pool uint u0)
(define-data-var annual-reward-rate uint u1000) ;; 10% = 1000 basis points
;; Data Maps
(define-map stakes
  principal
  {
    amount: uint,
    stake-block: uint,
    last-claim-block: uint
  }
)

(define-map user-rewards
  principal
  uint
)