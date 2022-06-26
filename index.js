import { abi, contractAddress } from "./constants.js";
const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const input = document.getElementById("ethAmount");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");
fundButton.onclick = fund;
connectButton.onclick = connect;
balanceButton.onclick=getBalance
withdrawButton.onclick=withdraw
async function connect() {
  if (typeof window.ethereum !== undefined) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (error) {
      console.log(error.message);
    }
    connectButton.innerHTML = "connected";
  } else {
    connectButton.innerHTML = "Please install metamask";
  }
}

async function fund() {
  const ethAmount =input.value
  console.log(`Funding with ${ethAmount}...`);
  if (typeof window.ethereum !== undefined) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
         const transactionResponse = await contract.fund({
           value: ethers.utils.parseEther(ethAmount),
         });
         //wait for tx to finish
        await listenForTransactionMine(transactionResponse,provider)
        console.log("done")
    } catch (error) {
      console.log(error);
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask";
  }
}

function listenForTransactionMine(transactionResponse,provider){
  console.log(`Mining ${transactionResponse.hash}...`)
  return new Promise((resolve,reject)=>{
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations`
        );
        resolve()
      });
     
  })

}

async function getBalance() {
 if (typeof window.ethereum !== undefined) {
 const provider = new ethers.providers.Web3Provider(window.ethereum);
  const balance=await provider.getBalance(contractAddress)
  console.log(ethers.utils.formatEther(balance))
 }
}
async function withdraw(){
  if(typeof window.ethereum !== undefined){
     console.log("withdrawing....");
    const provider=new ethers.providers.Web3Provider(window.ethereum)
    const signer=await provider.getSigner()
    const contract=new ethers.Contract(contractAddress,abi,signer)
   
    try {
      const transactionResponse=await contract.withdraw()
      await listenForTransactionMine(transactionResponse,provider)
      console.log("Done!!!")
    } catch (error) {
      console.log(error)
    }
  }
}