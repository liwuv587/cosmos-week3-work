import type { ChainInfo } from "@keplr-wallet/types";
import React, { useEffect, useState } from "react";
import osmo from "../config/osmosis";
import {
	DeliverTxResponse,
	SigningStargateClient,
} from "@cosmjs/stargate";
import { useInterval } from "../Hooks/useInterval";
function Keplr() {
	const [chain, setChain] = useState<ChainInfo>(osmo);
	const [selected, setSelected] = useState<string>("OSMO");
	const [client, setClient] = useState<SigningStargateClient>();
	const [address, setAddress] = useState<string>();

	const [balance, setBalance] = useState<any>();
	const [recipent, setRecipent] = useState<any>(
		"osmo1r9ufesd4ja09g4rcxxetpx675eu09m45q05wv7"
	);
	const [tx, setTx] = useState<any>();
	const [sendHash, setSendHash] = useState<any>();
	const [txRes, setTxRes] = useState<any>();




	const [timestamp, setTimestamp] = useState(0);
	useInterval(() => setTimestamp(new Date().getTime()), 3000);


	// 初始化 chain
	useEffect(() => {
		connectWallet();
	}, [chain]);

	// 查余额
	useEffect(() => {
		if (!address && !client) return;
		getBalances();
	}, [timestamp, address, client, sendHash]);

	// 连接keplr钱包  Todo
	const connectWallet = async () => {

		if (!window.keplr) {
			alert("Please install keplr extension");
		} else {
			const chainId = chain.chainId;

			// Enabling before using the Keplr is recommended.
			// This method will ask the user whether to allow access if they haven't visited this website.
			// Also, it will request that the user unlock the wallet if the wallet is locked.
			await window.keplr.enable(chainId);

			const offlineSigner = window.keplr.getOfflineSigner(chainId);

			// You can get the address/public keys by `getAccounts` method.
			// It can return the array of address/public key.
			// But, currently, Keplr extension manages only one address/public key pair.
			// XXX: This line is needed to set the sender address for SigningCosmosClient.
			offlineSigner.getAccounts().then((accounts) => {
				setAddress(accounts[0].address)
			});


			// Initialize the gaia api with the offline signer that is injected by Keplr extension.
			// 	const cosmJS = new SigningCosmosClient(
			// 		chain.rpc,
			// 		accounts[0].address,
			// 		offlineSigner,
			// 	);


			const client = await SigningStargateClient.connectWithSigner(
				chain.rpc,
				offlineSigner
			);
			setClient(client)
		}


	};

	// 余额查询  Todo
	const getBalances = async () => {
		client.getBalance(address, chain.stakeCurrency.coinMinimalDenom).then(setBalance)
	};

	// txhash查询  Todo
	const getTx = async () => {

		if (!sendHash) {
			return;
		}
		client.getTx(sendHash).then((tx) => { 
			setTxRes(tx);
		})
	};

	// 转账 Todo
	const sendToken = async () => {
		let amount = 10;
		amount *= Math.pow(10, chain.stakeCurrency.coinDecimals);
		const amountFinal = {
			denom: chain.feeCurrencies[0].coinMinimalDenom,
			amount: amount.toString(),
		};
		const fee = {
			amount: [
				{
					denom: chain.feeCurrencies[0].coinMinimalDenom,
					amount: "5000",
				},
			],
			gas: "200000",
		};

		client.sendTokens(
			address,
			recipent,
			[amountFinal],
			fee,
			"liwuv587"
		).then((txRes: DeliverTxResponse) => {
			setSendHash(txRes.transactionHash)
		});
	};

	return (
		<div className="keplr">
			<h2>Keplr Wallet</h2>
			<label>
				<span>
					Chain: &nbsp;
					<select
						className="select"
						value={selected}
						onChange={(e) => setSelected(e.target.value)}
					>
						<option value="OSMO">OSMO</option>
						<option value="SPX">SPX</option>
					</select>
				</span>{" "}
				&nbsp;
				<button onClick={connectWallet}>
					{address ? "已连接" : "连接keplr"}
				</button>
			</label>
			<div className="weight">地址：{address}</div>
			<div className="weight">
				<span style={{ whiteSpace: "nowrap" }}>余额: &nbsp;</span>
				<div>
					{balance?.amount && (
						<>
							<span>
								{parseFloat(
									String(Number(balance?.amount) / Math.pow(10, 6))
								).toFixed(2)}
							</span>
							<span> {balance?.denom}</span>
						</>
					)}
				</div>
			</div>
			<hr />
			<label>1、sendTokens() & broadcastTx</label>
			<div>
				<input
					type="text"
					value={recipent}
					placeholder="address"
					style={{ width: "350px" }}
					onChange={(e) => setRecipent(e.target.value)}
				/>
				&nbsp;
				<button onClick={sendToken}>
					发送 10 {chain.feeCurrencies[0].coinMinimalDenom}
				</button>
			</div>
			<label>2、getTx()</label>
			<div>
				<input value={sendHash} readOnly style={{ width: "350px" }} />
				&nbsp;
				<button onClick={getTx}>查询</button>
			</div>
			<div className="tx">
				{txRes && (
					<>
						<div>height:{txRes?.height} </div>
						<div>gasUsed:{txRes?.gasUsed} </div>
						<div>gasWanted:{txRes?.gasWanted} </div>
					</>
				)}
			</div>
		</div>
	);
}

export default Keplr;
