import { TEST_BAR_ADDRESS } from 'constants/addresses'
import { TEST, XTEST } from 'constants/tokens'
import { useTotalSupply } from 'hooks/useTotalSupply'
import { useActiveWeb3React } from 'hooks/web3'
import JSBI from 'jsbi'
import { Currency, CurrencyAmount } from 'sdk-core/entities'
import { useTokenBalance } from 'state/wallet/hooks'

const DAILY_EMITTED_TEST = JSBI.BigInt(62500)
const YEARLY_EMITTED_TEST = JSBI.multiply(DAILY_EMITTED_TEST, JSBI.BigInt(365))

export function useEarnedTest(xTestBalance?: CurrencyAmount<Currency>) {
  const { chainId } = useActiveWeb3React()
  const totalTestToDistribute = useTokenBalance(
    chainId ? TEST_BAR_ADDRESS[chainId] : undefined,
    chainId ? TEST[chainId] : undefined
  )
  const totalXTest = useTotalSupply(chainId ? XTEST[chainId] : undefined)

  if (totalXTest?.greaterThan('0') && xTestBalance) {
    return totalTestToDistribute?.multiply(xTestBalance).divide(totalXTest)
  }
  return undefined
}

export function useStakingAPY() {
  const { chainId } = useActiveWeb3React()

  const yearlyEmission = chainId
    ? CurrencyAmount.fromRawAmount(TEST[chainId], YEARLY_EMITTED_TEST).multiply(JSBI.BigInt(10 ** 18))
    : undefined

  console.log('yearlyEmission', yearlyEmission?.toSignificant())

  const totalXTest = useTotalSupply(chainId ? XTEST[chainId] : undefined)
  console.log('TotalXTest', totalXTest?.toSignificant())
  if (yearlyEmission && totalXTest && JSBI.greaterThan(totalXTest.quotient, JSBI.BigInt('0'))) {
    return JSBI.divide(JSBI.multiply(yearlyEmission.quotient, JSBI.BigInt(100)), totalXTest.quotient)
  }
  return undefined
}
