var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const account_owner = accounts[0];
    const account_one = accounts[1];
    const account_two = accounts[2];
    const NUMBER_OF_TOKENS = 5;
    const TOKEN_NAME = "Test Token";
    const TOKEN_SYMBOL = "TTN";
    const BASETOKENURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(TOKEN_NAME, TOKEN_SYMBOL, {from: account_owner});

            // TODO: mint multiple tokens
            for (let i = 1; i <= NUMBER_OF_TOKENS; i++) {
                await this.contract.mint(accounts[i], i);
              }
        })

        it('should return total supply', async function () { 
            let result = await this.contract.totalSupply();
            assert.equal(result, NUMBER_OF_TOKENS, "Incorrect total supply");
        })

        it('should get token balance', async function () { 
            let result = await this.contract.balanceOf(account_one);
            assert.equal(result, 1, "Incorrect token balance");
    
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const tokenID = 1;
            let result = await this.contract.tokenURI(tokenID);
            assert.equal(result, BASETOKENURI + tokenID, "Incorrect token uri");
        })

        it('should transfer token from one owner to another', async function () { 
            const tokenID = 1;
            try {
              await this.contract.transferFrom(account_one, account_two, tokenID, {
                from: account_one,
              });
            } catch (e) {
              console.log(e.message);
            }
      
            let owner = await this.contract.ownerOf(tokenID);
            assert.equal(owner, account_two, "Incorrect transfer token");
        });
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new(TOKEN_NAME, TOKEN_SYMBOL, {from: account_owner});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let mintRejected = false;
            const tokenID = 1;
            try {
              mintRejected = await this.contract.mint(accounts[2], tokenID, {
                from: accounts[3],
              });
            } catch (e) {
              mintRejected = true;
            }
            assert.equal(mintRejected, true, "Only owner can mint token");
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.getOwner();
            assert.equal(owner, account_owner, "Incorrect account owner");
        })

    });
});


