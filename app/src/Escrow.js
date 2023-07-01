import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { approve } from "./App";
import escrowAbi from './escrowAbi.json';

export default function Escrow({
  address,
  setError,
  errorDiv
}) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const [escrowContract, setEscrowContract] = useState(null)
  const [signer, setSigner] = useState();

  const [escrowDetails, setEscrowDetails] = useState({})


  useEffect(() => {
    const setContractDetails = async () => {
      try {
        setSigner(provider.getSigner());
        const escrowContract = new ethers.BaseContract(
          address,
          escrowAbi.abi,
          provider.getSigner()
        );
        setEscrowContract(escrowContract)

        setEscrowDetails({
          address,
          arbiter: await escrowContract.arbiter(),
          beneficiary: await escrowContract.beneficiary(),
          value: (await provider.getBalance(address)).toString(),
        })
      } catch (error) {
        console.log(error);

        setError(error.code + '\t' + error.method)
        errorDiv.current.style.display = 'block'


      }

    }

    setContractDetails();

  }, [])
  return (
    <div className="existing-contract">
      <ul className="fields">
        <li>
          <div> Arbiter </div>
          <div> {escrowDetails.arbiter} </div>
        </li>
        <li>
          <div> Beneficiary </div>
          <div> {escrowDetails.beneficiary} </div>
        </li>
        <li>
          <div> Value </div>
          <div> {escrowDetails.value} </div>
        </li>
        <div
          className="button"
          id={address}
          onClick={async (e) => {
            e.preventDefault();

            escrowContract.on('Approved', () => {
              document.getElementById(escrowContract.address).className =
                'complete';
              document.getElementById(escrowContract.address).innerText =
                "✓ It's been approved!";

              const newSetOfContracts = JSON.parse(localStorage.getItem('escrow')).filter(address => address !== escrowContract.address)
              localStorage.setItem(JSON.stringify([newSetOfContracts]))
            });

            try {
              const approveTxn = await escrowContract.approve({
                gasLimit: 1000000,
              });
              await approveTxn.wait();
            } catch (error) {
              console.log(error);
              setError(error.message)
              errorDiv.current.style.display = 'block'


            }

          }}
        >
          Approve
        </div>
      </ul>
    </div>
  );
}
