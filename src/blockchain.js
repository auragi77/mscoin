const  CryptoJS = require("crypto-js");

class Block{
    constructor(index, hash, previousHash, timestamp, data){
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = timestamp;
        this.data = data;
    }
}

const genesisBlock = new Block(
    0,
    "2C4CEB90344F20CC4C77D626247AED3ED530C1AEE3E6E85AD494498B17414CAC",
    null,
    1520312194926,
    "This is the genesis!!"
);

let blockchain = [genesisBlock];

const getLastBlock = () => blockchain[blockchain.length -1];

const getTimestamp = () => new Date().getTime() /1000;

const getBlockchain = () => blockchain;

const createHash = (index, previousHash, timestamp,data) =>
    CryptoJS.SHA256(index + previousHash + timestamp +JSON.stringify(data)).toString();

const createNewBlock = data =>{
    const previousBlock = getLastBlock();
    const newBlockIndex = previousBlock.index +1;
    const newTimestamp = getTimestamp();
    const newHash = createHash(newBlockIndex, previousBlock.hash, newTimestamp, data);
    const newBlock = new Block(
        newBlockIndex,
        newHash,
        previousBlock.hash,
        newTimestamp,
        data
    );
    console.log(newBlock);
    addBlockToChain(newBlock);
    return newBlock;

}

const getBlocksHash = block =>
    createHash(block.index, block.previousHash, block.timestamp,block.data);

const isNewBlockValid =(candidateBlock, latestBlock) =>{
    if(!isNewStructureValid(candidateBlock)){
        console.log("The candidate block structure is not valid");
        return false;
    }else if (latestBlock.index +1 !== candidateBlock.index){  // index check
        console.log("The candidate block doesn't have a valid indes");
        return false;
    }else if(latestBlock.hash !== candidateBlock.previousHash){  // hash check
        console.log("The previousHash of the candidate block is not the hash of the lastest block");
        return false;
    }else if(getBlocksHash(candidateBlock) !== candidateBlock.hash){
        console.log("The hash of this block is invalid");
        return false;
    }
    return true;
}

const isNewStructureValid = block =>{
    console.log(typeof block.index === "number");
    console.log(typeof block.hash === "string");
    console.log(typeof block.previousHash === "string");
    console.log(typeof block.timestamp ==="number");
    console.log(typeof block.data === "string");
    return(
        typeof block.index === "number" &&
        typeof block.hash === "string" &&
        typeof block.previousHash === "string" &&
        typeof block.timestamp ==="number" &&
        typeof block.data === "string"
    );
};

const isChainValid =(candidateChain) =>{
    const isGenesisValid = block =>{
        return JSON.stringify(block) === JSON.stringify(genesisBlock);
    };
    if (!isGenesisValid(candidateChain[0])){
        console.log("The candidateChains's genesisBlock is not the same as our genesisBlock");
        return false;
    }
    for (let i=1;i < candidateChain.length;i++){
        console.log(candidateBlock[i].previousHash +"   "+ candidateBlock[i-1].hash );
        if(!isNewBlockValid(candidateChain[i],candidateChain[i - 1])){         
            return false;
        }
    }
    return true;
};

const replaceChain = candidateBlock =>{
    if(isChainValid(candidateBlock) && candidateBlock.length > getBlockchain.length){
        blockchain = candidateBlock;
        return true;
    }else{
        return false;
    }
};


const addBlockToChain = candidateBlock =>{
    if(isNewBlockValid(candidateBlock, getLastBlock())){
        getBlockchain().push(candidateBlock);
        return true;
    }else{
        return false;
    }
};

module.exports={
    getBlockchain,
    createNewBlock
};