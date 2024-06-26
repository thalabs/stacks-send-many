import { p2tr } from '@scure/btc-signer';
import { BufferCV, SomeCV, callReadOnlyFunction } from '@stacks/transactions';
import { BitcoinNetwork, MAINNET, REGTEST, TESTNET } from 'sbtc';
import { NETWORK, mainnet, testnet } from './constants';

export async function getSbtcWalletAddress(assetContract: string) {
  const [contractAddress, contractName] = assetContract.split('.');

  const {
    value: { buffer: publicKey },
  } = (await callReadOnlyFunction({
    contractAddress,
    contractName,
    functionName: 'get-bitcoin-wallet-public-key',
    functionArgs: [],
    senderAddress: contractAddress,
    network: NETWORK,
  })) as SomeCV<BufferCV>;

  let bitcoinNetwork: BitcoinNetwork = REGTEST;
  if (mainnet) {
    bitcoinNetwork = MAINNET;
  } else if (testnet) {
    bitcoinNetwork = TESTNET;
  }

  const addr = p2tr(
    publicKey.length === 33 ? publicKey.subarray(1) : publicKey, // strip y byte
    undefined,
    bitcoinNetwork
  );
  console.log(addr);
  return addr;
}
