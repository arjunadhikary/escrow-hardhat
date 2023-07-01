import { ethers } from 'ethers';
import { useEffect, useRef, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';
const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [error, setError] = useState(null);
  const errorDiv = useRef(null)
  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);
      return accounts[0];
    }

    const escrowArray = JSON.parse(localStorage.getItem('escrows')) || [];
    setEscrows(escrowArray);

    getAccounts().then((account) => {
      setAccount(account);
      setSigner(provider.getSigner());
    });
  }, []);


  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    try {
      const value = ethers.BigNumber.from(
        ethers.utils.parseEther(document.getElementById('ether').value)
      );
      const accountBalance = await provider.getBalance(account);
      if (accountBalance.lt(value)) {
        console.log('Insufficient funds');
        setError('Insufficient funds');
        return false;
      }
      console.log('Deploying contract');
      const escrowContract = await deploy(signer, arbiter, beneficiary, value);

      setEscrows([...escrows, escrowContract.address]);
      localStorage.setItem(
        'escrows',
        JSON.stringify([
          ...JSON.parse(localStorage.getItem('escrows') ?? '[]'),
          escrowContract.address,
        ])
      );
    } catch (error) {
      console.log(error);
      setError(error.reason);
      errorDiv.current.style.display = 'block'
    }

  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input
            type="text"
            id="arbiter"
            value={'0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'}
          />
        </label>

        <label>
          Beneficiary Address
          <input
            type="text"
            id="beneficiary"
            value={'0x70997970C51812dc3A010C7d01b50e0d17dc79C8'}
          />
        </label>

        <label>
          Deposit Amount (in Ether)
          <input type="text" id="ether" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();
            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>
        <div id="container">
          {escrows?.map((address) => {
            console.log(address);
            return <Escrow key={address + Math.random(2)} address={address} setError={setError} errorDiv={errorDiv} />;
          })}
        </div>
      </div>

      <div ref={errorDiv} className={`error ${error ? 'show' : ''}`}>
        {error}
      </div>

    </>
  );
}

export default App;
