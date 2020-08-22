const fs = require('fs');
require('dotenv').config(); // Store environment-specific variable from '.env' to process.env
const ERC721MintableComplete = JSON.parse(fs.readFileSync('./build/contracts/ERC721MintableComplete.json'))
const HDWalletProvider = require("@truffle/hdwallet-provider");
const web3 = require('web3')
const MNEMONIC = process.env.MNEMONIC
const INFURA_KEY = process.env.INFURA_KEY
const NFT_ABI = ERC721MintableComplete.abi
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS
const OWNER_ADDRESS = process.env.OWNER_ADDRESS
const NETWORK = process.env.NETWORK
const NUM_TOKENS = 5
const to_address = "0x432767d0853A7605Cc3396DA96b859De1F667C4d"
if (!MNEMONIC || !INFURA_KEY || !OWNER_ADDRESS || !NETWORK) {
    console.error("Please set a mnemonic, infura key, owner, network, and contract address.")
    return
}
async function main() {
    const provider = new HDWalletProvider(MNEMONIC, `https://${NETWORK}.infura.io/v3/${INFURA_KEY}`)
    const web3Instance = new web3(
        provider
    )
    if (NFT_CONTRACT_ADDRESS) {
        const contract = new web3Instance.eth.Contract(NFT_ABI, NFT_CONTRACT_ADDRESS, { gasLimit: "1000000" })
        for (var i = 0; i < NUM_TOKENS; i++) {
            const result = await contract.methods.mint
                                                    (
                                                        to_address,
                                                        1
                                                    ).send({ from: OWNER_ADDRESS });
            console.log("Minted token. Transaction: " + result.transactionHash)
        }
    }
}
main()