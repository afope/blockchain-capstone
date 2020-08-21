pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class

contract SolnSquareVerifier is ERC721MintableComplete {
    Verifier private verifierContract;
    using Counters for Counters.Counter;

    constructor(address verifierContractAddress)
    public
     {
        verifierContract = Verifier(verifierContractAddress);
    }


// TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address senderAddress;
    }


// TODO define an array of the above struct
    bytes32[] solutionsList;


// TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) private solutionsSubmitted; 

    Counters.Counter private solutionsCount;

// TODO Create an event to emit when a solution is added
    event SolutionAdded(bytes32 solutionKey, address senderAddress);



// TODO Create a function to add the solutions to the array and emit the event
    function addSolution 
    (
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) 
    public 
    {
        bytes32 solutionKey = keccak256(abi.encodePacked(a, b, c, input));
        require(solutionsSubmitted[solutionKey].index == 0, "Solution already exists");

        solutionsSubmitted[solutionKey] = Solution({
            index: solutionsSubmitted[solutionKey].index,
            senderAddress: msg.sender
        });

        solutionsCount.increment();
        emit SolutionAdded(solutionKey, msg.sender);
    }


// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly

    function mintWhenVerified 
    (
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[2] memory input
    ) 
        public
    {
        bytes32 solutionKey = keccak256(abi.encodePacked(a, b, c, input));
        require(verifierContract.verifyTx(a, b, c, input), "Incorrect Solution");
        mint(solutionsSubmitted[solutionKey].senderAddress, solutionsSubmitted[solutionKey].index);
    }

}

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>

contract Verifier {
     function verifyTx(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[2] memory input
        ) public returns (bool r) {
    }
}


  


























