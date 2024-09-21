const { ethers } = require("ethers");
require('dotenv').config();
// Connect to the Gnosis RPC
const provider = new ethers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/ZpSQS6vyXH8u3kbBREGuB9A6MDwpBkug");

const privateKey = process.env.PRIVATE_KEY; // Your wallet's private key
const wallet = new ethers.Wallet(privateKey, provider);

// Address of the contract that manages attestations
const contractAddress = process.env.CONTRACT_ADDRESS;

// ABI for the contract (simplified for this example)
const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "AttestationCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "AttestationRevoked",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "createAttestation",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "attester",
                "type": "address"
            },
            {
                "internalType": "uint64",
                "name": "schemaId",
                "type": "uint64"
            },
            {
                "internalType": "uint64",
                "name": "attestationId",
                "type": "uint64"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "name": "didReceiveAttestation",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "attester",
                "type": "address"
            },
            {
                "internalType": "uint64",
                "name": "schemaId",
                "type": "uint64"
            },
            {
                "internalType": "uint64",
                "name": "attestationId",
                "type": "uint64"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "name": "didReceiveRevocation",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "revokeAttestation",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "admin",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "attester",
                "type": "address"
            },
            {
                "internalType": "uint64",
                "name": "schemaId",
                "type": "uint64"
            },
            {
                "internalType": "uint64",
                "name": "attestationId",
                "type": "uint64"
            },
            {
                "internalType": "contract IERC20",
                "name": "resolverFeeERC20Token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "resolverFeeERC20Amount",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "name": "didReceiveAttestation",
        "outputs": [],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "attester",
                "type": "address"
            },
            {
                "internalType": "uint64",
                "name": "schemaId",
                "type": "uint64"
            },
            {
                "internalType": "uint64",
                "name": "attestationId",
                "type": "uint64"
            },
            {
                "internalType": "contract IERC20",
                "name": "resolverFeeERC20Token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "resolverFeeERC20Amount",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "",
                "type": "bytes"
            }
        ],
        "name": "didReceiveRevocation",
        "outputs": [],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "userAttestations",
        "outputs": [
            {
                "internalType": "bool",
                "name": "hasAttestation",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

// Create contract instance
const contract = new ethers.Contract(contractAddress, abi, wallet);

// Function to revoke an attestation
async function revokeAttestation(address) {
    try {
        console.log(contract);
        // const gasEstimate = await contract.estimateGas.revokeAttestation(userAddress);
        console.log(contract.userAttestations);
        const tx = await contract.revokeAttestation(userAddress);
        await tx.wait();
        // console.log("Attestation revoked successfully.");
    } catch (error) {
        console.error("Error revoking attestation:", error);
    }
}

// Example usage
const attesterAddress = "0xD96D8871222Bd7E28607574B2e3a509bA7912761";
const schemaId = process.env.DISABILITY_PROOF_SCHEMA_ID; // Replace with your schema ID
const attestationId = 0x331; // Replace with your attestation ID
revokeAttestation("0x1234867870193456789312345678901234567890");
