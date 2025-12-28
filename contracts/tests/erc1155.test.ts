import { describe, expect, it, beforeEach } from "vitest";
import { Cl } from "@stacks/transactions";

const accounts = simnet.getAccounts();
const deployer = accounts.get("deployer")!;
const alice = accounts.get("wallet_1")!;
const bob = accounts.get("wallet_2")!;
const charlie = accounts.get("wallet_3")!;

describe("ERC1155 Multi-Token Contract", () => {
  beforeEach(() => {
    // Deploy the contract before each test
    simnet.deployContract("erc1155", "contracts/erc1155.clar", null, deployer);
  });

  describe("Contract Initialization", () => {
    it("should initialize with correct owner", () => {
      const result = simnet.callReadOnlyFn(
        "erc1155",
        "get-contract-owner",
        [],
        deployer
      );
      expect(result.result).toBeOk(Cl.principal(deployer));
    });

    it("should start with next token ID as 1", () => {
      const result = simnet.callReadOnlyFn(
        "erc1155",
        "get-next-token-id",
        [],
        deployer
      );
      expect(result.result).toBeOk(Cl.uint(1));
    });

    it("should not be paused initially", () => {
      const result = simnet.callReadOnlyFn(
        "erc1155",
        "is-paused",
        [],
        deployer
      );
      expect(result.result).toBeOk(Cl.bool(false));
    });
  });
});