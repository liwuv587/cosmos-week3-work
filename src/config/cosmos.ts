const osmosis = {
	"rpc": "https://rpc-celestia-testnet-mocha.keplr.app",
	"rest": "https://lcd-celestia-testnet-mocha.keplr.app",
	"chainId": "mocha",
	"chainName": "Celestia Testnet",
	"chainSymbolImageUrl": "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/celestiatestnet/images/celestia.svg",
	"stakeCurrency": {
	  "coinDenom": "TIA",
	  "coinMinimalDenom": "utia",
	  "coinDecimals": 6,
	  "coinGeckoId": "celestia"
	},
	"bip44": {
	  "coinType": 118
	},
	"bech32Config": {
	  "bech32PrefixAccAddr": "celestia",
	  "bech32PrefixAccPub": "celestiapub",
	  "bech32PrefixValAddr": "celestiavaloper",
	  "bech32PrefixValPub": "celestiavaloperpub",
	  "bech32PrefixConsAddr": "celestiavalcons",
	  "bech32PrefixConsPub": "celestiavalconspub"
	},
	"currencies": [
	  {
		"coinDenom": "TIA",
		"coinMinimalDenom": "utia",
		"coinDecimals": 6,
		"coinGeckoId": "celestia"
	  }
	],
	"feeCurrencies": [
	  {
		"coinDenom": "TIA",
		"coinMinimalDenom": "utia",
		"coinDecimals": 6,
		"coinGeckoId": "celestia"
	  }
	],
	"features": [],
	"beta": true
  }
export default osmosis;
