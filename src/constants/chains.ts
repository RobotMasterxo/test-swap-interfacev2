export enum ChainId {
  MAINNET = 7668378,
  TESTNET = 7668378,
  RINKEBY = 4,
}

export const NETWORK_URLS: {
  [chainId in ChainId]: string
} = {
  [ChainId.MAINNET]: `https://rpc.testnet.qom.one	`,
  [ChainId.TESTNET]: `https://rpc.testnet.qom.one`,
  // From Metamask
  [ChainId.RINKEBY]: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
}
