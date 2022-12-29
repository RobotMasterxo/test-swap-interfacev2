import { ChainId } from './chains'
import { Token } from '../sdk-core/entities/token'
import { NativeCurrency } from '../sdk-core/entities/nativeCurrency'
import invariant from 'tiny-invariant'
import { WETH9_ADDRESS } from './addresses'

export const WQOM = {
  // Mainly for unit tests
  1: new Token(1, WETH9_ADDRESS[4], 18, 'WQOM', 'Wrapped QOM'),
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, WETH9_ADDRESS[ChainId.MAINNET], 18, 'QOM', 'Wrapped QOM'),
  [ChainId.TESTNET]: new Token(ChainId.TESTNET, WETH9_ADDRESS[ChainId.TESTNET], 18, 'WQOM', 'Wrapped QOM'),
  [ChainId.RINKEBY]: new Token(ChainId.RINKEBY, WETH9_ADDRESS[ChainId.RINKEBY], 18, 'WQOM', 'Wrapped QOM'),
}
export const WETH9 = WQOM

export class Qom extends NativeCurrency {
  protected constructor(chainId: number) {
    super(chainId, 18, 'QOM', 'Qomtest')
  }

  public get wrapped(): Token {
    const weth9 = WQOM[this.chainId as ChainId]
    invariant(!!weth9, 'WRAPPED')
    return weth9
  }

  private static _etherCache: { [chainId: number]: Qom } = {}

  public static onChain(chainId: number): Qom {
    return this._etherCache[chainId] ?? (this._etherCache[chainId] = new Qom(chainId))
  }

  public equals(other: NativeCurrency | Token): boolean {
    return other.isNative && other.chainId === this.chainId
  }
}
