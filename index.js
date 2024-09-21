require('dotenv').config();
const { SignProtocolClient, SpMode, EvmChains, IndexService } = require("@ethsign/sp-sdk");
const { privateKeyToAccount } = require("viem/accounts");

const getSchemaID = () => {
    const schemaId = process.env.DISABILITY_PROOF_SCHEMA_ID;
    return schemaId;
}

const getWalletAddress = () => {
    const walletAddress = process.env.WALLET_ADDRESS;
    return walletAddress.toLowerCase();
}

const getPrivateKey = () => {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("PRIVATE_KEY environment variable is not set");
    }
    if (!privateKey.startsWith('0x')) {
        throw new Error("PRIVATE_KEY must start with '0x'");
    }
    if (privateKey.length !== 66) {  // 0x + 64 characters
        throw new Error("PRIVATE_KEY must be 32 bytes long (64 characters + '0x' prefix)");
    }
    return privateKey;
};

const initializeIndexService = async () => {
    return new IndexService("testnet");
};

const initializeSignClient = async () => {
    try {
        const privateKey = getPrivateKey();

        const client = new SignProtocolClient(SpMode.OnChain, {
            chain: EvmChains.sepolia,
            account: privateKeyToAccount(privateKey),
        });

        if (!client) {
            throw new Error("Failed to initialize SignProtocolClient");
        }

        return client;
    } catch (error) {
        console.error("Error initializing SignProtocolClient:", error.message);
        throw error;
    }
};

pa = ["0x11de610f0458c8c84efda2a6facdfb782fd35618247514d44e3cd137a0c79ff1", "0xa826843dc2bb3dc9af4972381bcff02b816c3332339d797dcf9f7f3b8e2e448"];
pb = [["0x246f7a8f35d0b3eefc2938948c7e3aa9718f3c64318590bc5d2e0d7c10abcca1", "0xf97326d2869dde327ab0ef3cdc5126e13f04bd1a42b7a3994da2150ae7990c4"], ["0xce79b7cdd27fb74312e512152816450ec38017bcda782553ce390aa2263fcc1", "0x1d59d02d6bef8685f1a4eeb9dfa63c16427ec8fed51874e9380d0c378ff4e842"]];
pc = ["0x2c19786621e3b09a08eac2360e3715f623673f0018a1c4a8e989e670b7594100", "0x4ebbfac4112041d6619cefc3509cc9dfcc2191d271129af0fcb82dc1e6fe1da"];

// Function to create attestation
const createAttestation = async (signClient, schemaId, data) => {
    try {
        const attestationResponse = await signClient.createAttestation(
            {
                schemaId,
                data: {
                    walletAddress: data.walletAddress,
                    pA: data.pA,
                    pB_1: data.pB_1,
                    pB_2: data.pB_2,
                    pC: data.pC,
                    expiredDate: data.expiredDate
                },
                indexingValue: data.walletAddress,
                attester: data.walletAddress
            },
            {
                getTxHash: (txHash) => {
                    console.log("Transaction hash:", txHash);
                }
            }
        );

        console.log("Full attestation response:", JSON.stringify(attestationResponse, null, 2));
        console.log("Attestation created:", attestationResponse.attestationId);
        console.log(`https://sepolia.etherscan.io/tx/${attestationResponse.txHash}`);
        return attestationResponse.attestationId;
        
    } catch (error) {
        console.error("Error creating attestation:", error);
        throw error;
    }
};

// Function to verify attestation
const verifyAttestation = async (signClient, attestationId) => {
    try {
        const attestation = await signClient.getAttestation(attestationId);
        console.log("Attestation verified:", attestation);
        return attestation;
    } catch (error) {
        console.error("Error verifying attestation:", error);
        throw error;
    }
};

// Main function to run the entire process
const runAttestationProcess = async (signClient) => {
    try {
        // Create schema
        const schemaId = getSchemaID();
        console.log("Schema ID:", schemaId);

        // Example data
        // validUntil: one year after creation
        // what is revoked: false
        const exampleData = {
            walletAddress: getWalletAddress(),
            pA: pa,
            pB_1: pb[0],
            pB_2: pb[1],
            pC: pc,
            expiredDate: Math.floor(Date.now() / 1000) + 31536000 // Current timestamp + 1 year in seconds
        };

        // Create attestation
        const attestationId = await createAttestation(signClient, schemaId, exampleData);
        console.log("Attestation ID:", attestationId);

        // Verify attestation
        const verifiedAttestation = await verifyAttestation(signClient, attestationId);
        console.log("Verified Attestation:", verifiedAttestation);

        // Check if it's on the network
        console.log("To check if this attestation is on the network, visit:");
        // console.log(`https://sepolia.etherscan.io/tx/${verifiedAttestation}`);
    } catch (error) {
        console.error("Error in attestation process:", error);
    }
};

const querySchema = async (signClient, schemaId) => {
    try {
        const schema = await signClient.getSchema(schemaId);
        console.log("Schema Info:", JSON.stringify(schema, null, 2));
        return schema;
    } catch (error) {
        console.error("Error querying schema:", error);
        throw error;
    }
};


// // Function to query attestation
// const queryAttestation = async (indexService, attestationId) => {
//     try {
//         // /onchain_evm_11155111_
//         const attestation = await indexService.queryAttestation(`onchain_evm_11155111_${attestationId}`);
//         console.log("Attestation Info:", attestation);
//         return attestation;
//     } catch (error) {
//         console.error("Error querying attestation:", error);
//         throw error;
//     }
// };

// Not working...
const querySpecificAttestation = async (signClient, attestationId) => {
    try {
        const attestation = await signClient.getAttestation(attestationId);
        console.log("Attestation Info:", attestation);
        return attestation;
    } catch (error) {
        console.error("Error querying attestation:", error);
        throw error;
    }
};


const queryAttestationsByWalletAddress = async (indexService, walletAddress, schemaId) => {
    try {
        console.log(`Querying attestations for wallet: ${walletAddress}`);
        const queryParams = {
            mode: "onchain",
            page: 1,
            indexingValue: walletAddress,
        };

        if (schemaId) {
            queryParams.schemaId = schemaId;
        }

        console.log("Query params:", JSON.stringify(queryParams, null, 2));

        const attestations = await indexService.queryAttestationList(queryParams);

        // console.log(`Total results: ${attestations.total}`);
        // console.log("Full attestations response:", JSON.stringify(attestations, null, 2));

        return attestations;
    } catch (error) {
        console.error("Error querying attestations by wallet address:", error);
        throw error;
    }
};

async function main() {
    const walletAddress = getWalletAddress();
    const schemaId = getSchemaID();
    const indexService = await initializeIndexService();
    const signClient = await initializeSignClient();

    try {
        const res = await runAttestationProcess(signClient);
        console.log(res);
        // console.log("1. Querying specific attestation:");
        // let attestation = await querySpecificAttestation(signClient, "0x315");
        // console.log(attestation);
        // console.log("\n2. Querying attestations by wallet address:");
        // attestation = await queryAttestationsByWalletAddress(indexService, walletAddress, schemaId);
        // console.log(attestation);
        await new Promise(r => setTimeout(r, 2000));
        console.log(querySchema(signClient, schemaId))
        console.log("\n3. Querying by wallet address without schema:");
        let attestation = await queryAttestationsByWalletAddress(indexService, walletAddress);
        console.log(attestation);
        if (attestation.total > 0) {
            console.log("Attestation already exists for this wallet address");
            // return null; // Or handle this case as appropriate for your application
        }
    } catch (error) {
        console.error("Error in main:", error);
    }
}

main();