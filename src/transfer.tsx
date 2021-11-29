
import { Link, ImmutableXClient, ImmutableMethodResults, ERC721TokenType, ETHTokenType, ImmutableRollupStatus, ERC20TokenType } from '@imtbl/imx-sdk';
import { useEffect, useState } from 'react';
require('dotenv').config();

interface BridgingProps {
  client: ImmutableXClient,
  link: Link,
  wallet: string
}

const Transfer = ({client, link, wallet}: BridgingProps) => {
  // withdrawals
  const [preparingWithdrawals, setPreparingWithdrawals] = useState<ImmutableMethodResults.ImmutableGetWithdrawalsResult>(Object);
  const [readyWithdrawals, setReadyWithdrawals] = useState<ImmutableMethodResults.ImmutableGetWithdrawalsResult>(Object);
  const [completedWithdrawals, setCompletedWithdrawals] = useState<ImmutableMethodResults.ImmutableGetWithdrawalsResult>(Object);
  // eth
  const [depositAmount, setDepositAmount] = useState('');
  const [prepareAmount, setPrepareAmount] = useState('');
  // nft
  const [depositTokenId, setDepositTokenId] = useState('');
  const [depositTokenAddress, setDepositTokenAddress] = useState('');
  const [prepareTokenId, setPrepareTokenId] = useState('');
  const [prepareTokenAddress, setPrepareTokenAddress] = useState('');
  const [completeTokenId, setCompleteTokenId] = useState('');
  const [completeTokenAddress, setCompleteTokenAddress] = useState('');

  useEffect(() => {
    load()
  }, [])

  async function load(): Promise<void> {
    setPreparingWithdrawals(await client.getWithdrawals({
      user: wallet,
      rollup_status: ImmutableRollupStatus.included
    })) // included in batch awaiting confirmation
    setReadyWithdrawals(await client.getWithdrawals({
      user: wallet,
      rollup_status: ImmutableRollupStatus.confirmed,
      withdrawn_to_wallet: false
    })) // confirmed on-chain in a batch and ready to be withdrawn
    setCompletedWithdrawals(await client.getWithdrawals({
      user: wallet,
      withdrawn_to_wallet: true
    })) // confirmed on-chain in a batch and already withdrawn to L1 wallet
  };

  // deposit an NFT
  async function transferNFT() {
    // await link.deposit({
    //   type: ERC721TokenType.ERC721,
    //   tokenId: depositTokenId,
    //   tokenAddress: depositTokenAddress
    // })

    const transferResponsePayload:any = await link.transfer([
        // {
        //   tokenId: '800',
        //   type: ERC721TokenType.ERC721,
        //   tokenAddress: '0xa56166871f9d816b00350fc3433f4c46291de17e',
        //   toAddress: depositTokenAddress,
        // },
        {
          amount: '0.23',
          type: ETHTokenType.ETH,
          toAddress: depositTokenAddress,
        },
      ]);

      console.log(transferResponsePayload)
  }

  // deposit eth
  async function depositETH() {
    await link.deposit({
      type: ETHTokenType.ETH,
      amount: depositAmount,
    })
  };

  // prepare an NFT withdrawal
  async function prepareWithdrawalNFT() {
    await link.prepareWithdrawal({
      type: ERC721TokenType.ERC721,
      tokenId: prepareTokenId,
      tokenAddress: prepareTokenAddress
    })
  };

  // prepare an eth withdrawal
  async function prepareWithdrawalETH() {
    await link.prepareWithdrawal({
      type: ETHTokenType.ETH,
      amount: prepareAmount,
    })
  };

  // complete an NFT withdrawal
  async function completeWithdrawalNFT() {
    await link.completeWithdrawal({
      type: ERC721TokenType.ERC721,
      tokenId: completeTokenId,
      tokenAddress: completeTokenAddress
    })
  };

  // complete an eth withdrawal
  async function completeWithdrawalETH() {
    await link.completeWithdrawal({
      type: ETHTokenType.ETH,
    })
  };

  return (
    <div>
      <div>
        ERC721:
        <br/><br/>
        <div>
         Transfer NFT:
          <br/>
          <label>
            To Token Address:
            <input type="text" value={depositTokenAddress} onChange={e => setDepositTokenAddress(e.target.value)} />
          </label>
          <button onClick={transferNFT}>Transfer NFT</button>
        </div>
        <br/><br/>
      </div>
    </div>
  );
}

export default Transfer;
