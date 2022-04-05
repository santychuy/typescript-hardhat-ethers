import React, { useState } from 'react';
import { ethers } from 'ethers';

import { Greeter } from '../typechain';

import GreeterArtifacts from './artifacts/contracts/Greeter.sol/Greeter.json';

const App = () => {
  const [greeting, setGreeting] = useState<string>();

  const requestAccount = async () => {
    await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
  };

  const fetchGreeting = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );

      // Aqui utilizamos el mismo provider que el signer ya que no haremos ninguna transaccion
      // y solo leeremos datos de la blockchain
      const contract = new ethers.Contract(
        '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        GreeterArtifacts.abi,
        provider
      ) as Greeter;

      const data = await contract.greet();

      console.log(data);
    }
  };

  const setNewGreeting = async () => {
    if (!greeting) return;
    if (window.ethereum) {
      await requestAccount();

      const provider = new ethers.providers.Web3Provider(
        window.ethereum as any
      );

      // Aqui necesitaremos una signer ya que haremos una transaccion dentro de la blockchain
      const signer = provider.getSigner();

      const contract = new ethers.Contract(
        '0x5FbDB2315678afecb367f032d93F642f64180aa3',
        GreeterArtifacts.abi,
        signer
      ) as Greeter;

      const transaction = await contract.setGreeting(greeting);

      await transaction.wait();

      await fetchGreeting();

      setGreeting('');
    }
  };

  return (
    <div>
      <button type="button" onClick={fetchGreeting}>
        Traer Saludo
      </button>
      <input
        type="text"
        value={greeting}
        onChange={(e) => setGreeting(e.target.value)}
        placeholder="Escribir saludo"
      />
      <button type="button" onClick={setNewGreeting}>
        Mandar nuevo valor
      </button>
    </div>
  );
};

export default App;
