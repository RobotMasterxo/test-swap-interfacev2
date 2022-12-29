import { Qom } from './tokens'

describe('Ether', () => {
  it('static constructor uses cache', () => {
    expect(Qom.onChain(1) === Qom.onChain(1)).toEqual(true)
  })
  it('caches once per chain ID', () => {
    expect(Qom.onChain(1) !== Qom.onChain(2)).toEqual(true)
  })
  it('#equals returns false for diff chains', () => {
    expect(Qom.onChain(1).equals(Qom.onChain(2))).toEqual(false)
  })
  it('#equals returns true for same chains', () => {
    expect(Qom.onChain(1).equals(Qom.onChain(1))).toEqual(true)
  })
})
