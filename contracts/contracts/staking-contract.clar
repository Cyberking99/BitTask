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
;; Read-only functions

(define-read-only (get-stake (user principal))
  (map-get? stakes user)
)

(define-read-only (get-total-staked)
  (var-get total-staked)
)

(define-read-only (get-reward-pool)
  (var-get reward-pool)
)

(define-read-only (get-annual-reward-rate)
  (var-get annual-reward-rate)
)
(define-read-only (calculate-pending-rewards (user principal))
  (match (map-get? stakes user)
    stake-info
      (let
        (
          (blocks-staked (- block-height (get last-claim-block stake-info)))
          (stake-amount (get amount stake-info))
          ;; Approximate blocks per year on Stacks (assuming ~10 min per block)
          (blocks-per-year u52560)
          ;; Calculate rewards: (amount * rate * blocks) / (10000 * blocks-per-year)
          (rewards (/ (* (* stake-amount (var-get annual-reward-rate)) blocks-staked) 
                     (* u10000 blocks-per-year)))
        )
        (ok rewards)
      )
    (ok u0)
  )
)