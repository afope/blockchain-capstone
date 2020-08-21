const assert = require("chai").assert;
const truffleAssert = require('truffle-assertions');

const SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
const Verifier = artifacts.require("verifier");

contract("SolnSquareVerifier", (accounts) => {

    let owner = accounts[0];
 
    const proof = {
        "proof": {
            "a": ["0x08505233d9d451c14eb13ce69767614b12b89d80f16bf4fa034a045aeee30129", "0x2b2a3b706a1116f6d70274706709a8757a0d55c9ac2f80b331d75a0a23b16ae1"],
            "b": [["0x129df650c95e0f69d97b6b4cf350bacecb52a6483e6e072a12efbf57e15400b7", "0x06dbaa4cc3113b577a04931984659ec4a7ed1ee412351dfa2a716d601e23ad7a"], ["0x0fce197b8e4dc28aa4de78d4d7517547ca2b7a5433abdfda626022bfcb492997", "0x2b0d1a3630cfaee1ed98d57e9f9b0ece490db55b44a5cc529687322b0c73e742"]],
            "c": ["0x1b059bc071874392f470ea3a6b6f18ed8e03748365ac2428e881c7a2ce4eb05d", "0x0b3ec14b9f9d63dbd069e642f2c301bc848dd8592c78b06e936f506f96d58ab4"]
        },
        "inputs": ["0x0000000000000000000000000000000000000000000000000000000000000009", "0x0000000000000000000000000000000000000000000000000000000000000001"]
    }
    const TOKEN_NAME = "Test Token";
    const TOKEN_SYMBOL = "TT";

    describe("SolnSquareVerifier", function () {
      beforeEach(async function () {
        const VerifierContract = await Verifier.new({ from: owner });
        this.contract = await SolnSquareVerifier.new(VerifierContract.address,   TOKEN_NAME,
            TOKEN_SYMBOL,{ from: owner });
      });

    // Test if a new solution can be added for contract - SolnSquareVerifier
    it("adds new solution with correct proof", async function () {
        let tx = await this.contract.addSolution(
          proof.proof.a,
          proof.proof.b,
          proof.proof.c,
          proof.inputs,
          { from: owner }
        );

        truffleAssert.eventEmitted(tx, 'SolutionAdded', (ev) => {
            return ev.senderAddress == owner;
        });
      });


      // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
      it("mints new token with correct proof", async function () {

        let address_to = accounts[1];
        let tokenID = 1;

        await this.contract.mintWhenVerified(
            address_to,
            tokenID,
            proof.proof.a,
            proof.proof.b,
            proof.proof.c,
            proof.inputs, 
            {from: owner}
        )

        const tokenOwner = await this.contract.ownerOf(tokenID);
        assert.equal(tokenOwner, address_to, "Minter is token owner");
      });


    });
  });

    
