import { useState } from "react";
import { ethers } from "ethers";
import { BigNumber } from "ethers";
// import Payments from "./payments"
import axios from "axios";
import { ImmutableXClient, Link, ERC721TokenType, ETHTokenType } from '@imtbl/imx-sdk';

async function startPayment (params) {
  try {
    // console.log(params)
    const ether = "0.035";
    const sender = params.userWallet
    const reciever = params.ownerAddress
    // const sender = params['userWallet']
    // const reciever = params['ownerAddress']
    // console.log(sender, reciever)
    // debugger

    await window.ethereum.send("eth_requestAccounts");
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    const _signer = _provider.getSigner();
    const _address = await _signer.getAddress()
    console.log(ether, _address)
    if (sender==_address){
      console.log("Same address!")
      let etherValue = ethers.utils.parseEther(ether) 
      ethers.utils.getAddress(_address);
      const tx = await _signer.sendTransaction({
        to: reciever,
        value: ethers.utils.parseEther(ether)
      });
  
      const isCompleted = await checkHash(tx, _address, etherValue);
      // setTxs([tx]);
      return isCompleted
    }
  } catch (err) {
    console.log(err.message);
  }
};

// ////////////////////////////////////////////////////////////////////////////////////////
// //// FIX THE CORS ERROR BEFORE DEPLOYMENTS

// async function getWhitelistAddress(wallet) {
//   // let prefixUrl = 'https://cors-anywhere.herokuapp.com/'
//   const preSaleUrl = 'https://2mdkcs2l0l.execute-api.us-east-2.amazonaws.com/trans/transaction';
//   let walletAddress = wallet;
//   let url = preSaleUrl + '?walletAddress=' + walletAddress;
//   // let url = prefixUrl + preSaleUrl + '?walletAddress=' + walletAddress;
//   console.log(url)
//   const isMinted = await getAddresses(url);
//   console.log(JSON.stringify(isMinted))
//   const mintable = isMinted['isMinted']
//   // console.log(mintable)
//   return mintable
// }
// async function getAddresses(url) {
//   try {
//     // const response = await axios.get(url);
//     // console.log(JSON.stringify(response));
//     const response = await axios({
//       method: 'GET', // *GET, POST, PUT, DELETE, etc.
//       url: url,
//       headers: {
//         "Content-Type": "application/json"
//       }
//     });
//     return response.data
//   } catch (error) {
//     console.error(error);
//   }
// };

// async function getData(_url, wallet) {
//   try {
//     let url = 'https://cors-anywhere.herokuapp.com/'+_url+'?walletAddress='+wallet;
//     console.log(url)
//     const responses = await axios({
//       method: 'GET', // *GET, POST, PUT, DELETE, etc.
//       url: url,
//       headers: {
//         "X-Requested-With": "fetch",
//         "orgin": 'http://localhost:3000/'
//       }
//     });
//     return responses;
//   } catch (error) {
//     console.error(error);
//   }
// }
// ////////////////////////////////////////////////////////////////////////////////////////
// //// FIX THE ABOVE CORS ERROR BEFORE DEPLOYMENTS


async function getWhitelistAddress(wallet) {

  const preSaleUrl = 'https://2mdkcs2l0l.execute-api.us-east-2.amazonaws.com/trans/transaction';
  let walletAddress = wallet;
  let url = preSaleUrl + '?walletAddress=' + walletAddress;
  console.log(url)
  const isMinted = await getAddress(url);
  console.log(JSON.stringify(isMinted))
  const mintable = isMinted['isMinted']
  // console.log(mintable)
  return mintable
};
// async function getAddresses(url) {
//   try {
//     // const response = await axios.get(url);
//     let response = {"isMinted":'false'}
//     return response
//   } catch (error) {
//     console.error(error);
//   }
// };

async function getAddress(url) {
  try {
    // const response = await axios.get(url);
    // console.log(JSON.stringify(response));

    
    
    const response = await axios({
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      url: url,
      // headers: {
        //   "Content-Type": "application/json"
        //   // "Access-Control-Allow-Origin": "http://192.168.0.232:3000/"
        // }
      });
      // response.setHeader("Access-Control-Allow-Origin", "*");
      // response.setHeader("Access-Control-Allow-Credentials", "true");
      // response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
      // response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    return response.data
  } catch (error) {
    console.error(error);
  }
};

// //////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// async function WhitelistAddress(_url, wallet) {
//   try {
//     let url = _url+'?walletAddress='+wallet;
//     console.log(url)
//     // debugger
//     const responses = await axios({
//       method: 'GET', // *GET, POST, PUT, DELETE, etc.
//       url: url,
//       headers: {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': "*"
//         }
//     });
//     console.log(responses)
//     return responses;
//   } catch (error) {
//     console.error(error);
//   }
// }

async function fromHex(str1) {
  let hex = str1.toString().substr(2);
  let str = '';
  for (let n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  return str;
};

async function getTransactionReciept(hash, addr, etherValue) {

  let infuraApiKey = 'https://ropsten.infura.io/v3/2ecaa080b94e46e49d2adbff0af8695e'//we have to change this link for mainnet
  const providerApi = new ethers.providers.JsonRpcProvider(infuraApiKey);

  const response = await providerApi.getTransaction(hash);
  // console.log(response)
  // for (let i in response){
  //   console.log(i)
  // }

  let stringHex = String(response.value._hex)
  let _value = BigNumber.from(stringHex).mul(BigNumber.from(10).pow(0));
  const send = JSON.parse(etherValue)
  const recieve = JSON.parse(_value) 
  console.log(JSON.parse(send)) // Convert it into JSON
  console.log(JSON.parse(recieve)) // Convert it into JSON
  if (send === recieve){
    console.log('Ether value send: ' + _value)
    const param = {
      isPaid : true,
      sendEtherValue: etherValue,
      recieveEtherValue: _value,
      response: response
    } 
    // return TransactioReceipt and value of ether involve in the transaction.
    return param
  }else {
    console.log('Error occured during transaction, Please contact any Official via mail if ethereum has been deducted from your account!')
    // window.location.reload(false)
  };


  // return response, _value
};


async function checkHash(hash, addr, etherValue) {
  let hashKey = hash.hash
  // console.log('Transaction Hash: '+hashKey)
  const reciept = await getTransactionReciept(hashKey, addr, etherValue);

  return reciept
};

async function startConnection (){
  try {
    if (!window.ethereum)
      throw new Error("No crypto wallet found. Please install it.");
    
    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const myAddress = await signer.getAddress()

    // console.log(myAddress)

    const linkAddress = 'https://link.ropsten.x.immutable.com';
    const link = new Link(linkAddress);
    const WALLET_ADDRESS = myAddress;
    const STARK_PUBLIC_KEY = '0x4527BE8f31E2ebFbEF4fCADDb5a17447B27d2aef'
    const { address, starkPublicKey } = await link.setup({});
    // console.log(addr) //wallet address of reciever
    localStorage.setItem(WALLET_ADDRESS, address);
    localStorage.setItem(STARK_PUBLIC_KEY, starkPublicKey);
    // console.log(address)
    // console.log(starkPublicKey)

    // await window.ethereum.send("eth_requestAccounts");
    // const provider = new ethers.providers.Web3Provider(window.ethereum);
    // const signer = provider.getSigner();
    // const myAddress = await signer.getAddress()
    // const myAddress = '0xFCE4Ec07E119fDC35481aC6B5d880935888926F3'
    // console.log(myAddress) // End User walletAddress

    // Database Injection first-step
    const isMintable = await getWhitelistAddress(address);
    console.log(isMintable)
    if (isMintable === 'false') {
      console.log('Connected => Minting')
      // The walletAddress of the Owner
      const addr = '0x5e186080CEb92E1ebbb46d84a76849CD7a66E74F';
      const params = {
        isMintable:isMintable,
        userWallet:myAddress,
        ownerAddress:addr
      }
      return JSON.stringify(params)
    }
    else {
      console.log('Connected => Already Minted')
      alert('Already minted in Presale, cannot mint again')
      window.location.reload(false);
    }

    // ethers.utils.getAddress(addr);
    // const tx = await signer.sendTransaction({
    //   to: addr,
    //   value: ethers.utils.parseEther(ether)
    // });

    // const isCompleted = await checkHash(tx, addr);
    // setTxs([tx]);

  } catch (err) {
    console.log(err.message);
  }

};

async function isEmpty(obj) {
  return Object.keys(obj).length === 0;
};

export default function App() {
  // const [error, setError] = useState();
  // const [txs, setTxs] = useState([]);
  const [counter, setcounter] = useState(0);
  const [ethPrice, setethPrice] = useState(0);

  async function max() {
    setcounter(1)
    setethPrice(0.035)
  };
  var params = {} 
  async function connectWallet() {
    // console.log(counter, ethPrice)
    // Connect Wallet Here
    const imxAddresses = await startConnection();
    params = imxAddresses
    console.log(imxAddresses) //=> sending signal.
  };
  

  async function mintIMX() {
    // Connect Wallet Here
    // console.log(params)
    // Price of the characters
    const checkEmpty = await isEmpty(params);
    if (!checkEmpty) {
      console.log(params)
      // sender = params['userWallet']
      // reciever = params['ownerAddress']
      // debugger
      const isPaidToken = await startPayment(JSON.parse(params));
      console.log(isPaidToken) 
      // True => completed.



    }else {
      alert("Please first connect your wallet!")
      window.location.reload(false);
    }

  };


  // console.warn = () => {};
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const data = new FormData(e.target);
  //   setError();
  //   // The walletAddress of the Owner
  //   const addr = '0xFCE4Ec07E119fDC35481aC6B5d880935888926F3';
  //   // Price of the characters
  //   const ether = '0.0069';
  //   await startPayment({
  //     setError,
  //     setTxs,
  //     ether: ether,
  //     addr: addr
  //   });
  // };

  return (
    <>
      <div className="header">
        <div className="logo"><img src="/images/logo.jpg" alt="" /></div>
        <nav >
        <button onClick={connectWallet}>
          <a className="navBtn">Connect Wallet</a>
          </button>
        </nav>
      </div>
      <div className="main">
        <h1>MINT PUNKS</h1>
        <div className="card">

          <div className="cardFlex1">
            <h2 className="aaa">10,000 NFTs</h2>
          </div>

          <div className="cardFlex1">
            <div className="innerCont">
              <h2>MY ETH BALANCE</h2>
              <h3>0 ETH</h3>
            </div>

            <div className="middle">
              <h2>AMOUNT</h2>
              <div className="ggg"><span>1</span></div>
              <button className="max" onClick={max}>Max</button>
            </div>
            <div className="innerCont">
              <h2>TOTAL PRICE</h2>
              <h3>0.035 ETH</h3>
            </div>
            <div className="cardFlex1 mainBTN">
              <button onClick={mintIMX}>Mint Now</button>
            </div>
            <div className="progress">
              <h2>Progress</h2>
              <div className="progresCont">
                <div className="rProgress"></div>
                <h3>100%</h3>

              </div>
            </div>
          </div>
        </div>
        <div className="darkBackground"></div>
        <img src="/images/background.jpg" className="background" alt="" />
      </div>

    </>
  );
}

// export default App;
