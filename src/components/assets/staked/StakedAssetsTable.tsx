import { AutoColumn } from 'components/Column'
import { CurrencyLogoFromList } from 'components/CurrencyLogo/CurrencyLogoFromList'
import { HRDark } from 'components/HR/HR'
import QuestionHelper from 'components/QuestionHelper'
import { AutoRow } from 'components/Row'
import { useEarnedTest } from 'components/stake/stake-hooks'
import { TokenAndUSDCBalance, TokenLogo } from 'components/stake/StakingBalance'
import { TEST , XTEST } from 'constants/tokens'
import usePrevious from 'hooks/usePrevious'
import { useUSDCValue } from 'hooks/useUSDCPrice'
import { useActiveWeb3React } from 'hooks/web3'
import React from 'react'
import { useTokenBalance } from 'state/wallet/hooks'
import { TYPE } from 'theme'
import { CountUp } from 'use-count-up'
import { AssetRow, AssetsContainer, AssetsTableHeaderContainer, AssetsTableHeaderText } from '../AssetsTable'

export const StakedAssetRow = ({
  asset,
  assetName,
  assetHelper,
  amount,
  positionValue,
}: {
  asset: React.ReactNode | any | undefined
  assetName: string
  amount: any
  positionValue: any
  assetHelper?: string
}) => (
  <AssetRow to="/stake">
    <AutoRow gap="0%" justify={'space-between'}>
      <AutoColumn justify="start" style={{ width: '33%' }}>
        <TokenLogo>
          <CurrencyLogoFromList currency={asset ?? undefined} size={'24px'} />
          <TYPE.body fontSize={20} fontWeight={500} margin={'10px'}>
            {assetName}
          </TYPE.body>
          {!!assetHelper && <QuestionHelper text={assetHelper} />}
        </TokenLogo>
      </AutoColumn>
      <AutoColumn justify="center" style={{ width: '33%' }}>
        <TokenAndUSDCBalance>{amount}</TokenAndUSDCBalance>
      </AutoColumn>
      <AutoColumn justify="end" style={{ width: '33%' }}>
        <TokenAndUSDCBalance>{positionValue}</TokenAndUSDCBalance>
      </AutoColumn>
    </AutoRow>
    <HRDark />
  </AssetRow>
)

const StakedAssetsTable = () => {
  const { account, chainId } = useActiveWeb3React()
  const token = chainId ? TEST[chainId] : undefined
  const xToken = chainId ? XTEST[chainId] : undefined
  const xtestBalance = useTokenBalance(account ?? undefined, xToken)
  const earnedTest = useEarnedTest(xtestBalance)
  const earnedTestUSDCValue = useUSDCValue(earnedTest)

  const countUpXTestBalance = xtestBalance?.toSignificant() ?? '0'
  const countUpXTestBalancePrevious = usePrevious(countUpXTestBalance) ?? '0'
  const countUpEarnedTestBalanceUSDC = earnedTestUSDCValue?.toSignificant() ?? '0'
  const countUpEarnedTestBalanceUSDCPrevious = usePrevious(countUpEarnedTestBalanceUSDC) ?? '0'

  const countUpEarnedTestBalance = earnedTest?.toSignificant() ?? '0'
  const countUpEarnedTestBalancePrevious = usePrevious(countUpEarnedTestBalance) ?? '0'

  return (
    <AssetsContainer>
      <AssetsTableHeaderContainer justify={'space-between'}>
        <AssetsTableHeaderText>Staked Asset</AssetsTableHeaderText>
        <AssetsTableHeaderText>Equivalent Amount</AssetsTableHeaderText>
        <AssetsTableHeaderText>Position Value</AssetsTableHeaderText>
      </AssetsTableHeaderContainer>
      <AssetRow to="/stake" style={{ cursor: 'pointer' }}>
        <AutoRow gap="0%" justify={'space-between'}>
          <AutoColumn justify="start" style={{ width: '33%', display: 'flex' }}>
            <TokenLogo>
              <CurrencyLogoFromList currency={xToken ?? undefined} size={'24px'} />
              <TYPE.body fontSize={20} fontWeight={500} margin={'10px'}>
                xTest
              </TYPE.body>
              {/* {!!assetHelper && <QuestionHelper text={assetHelper} />} */}
            </TokenLogo>
            <TokenAndUSDCBalance>
              <CountUp
                key={xtestBalance?.toFixed(0)}
                isCounting
                decimalPlaces={2}
                start={parseFloat(countUpXTestBalancePrevious)}
                end={parseFloat(countUpXTestBalance)}
                thousandsSeparator={','}
                duration={1}
              />
            </TokenAndUSDCBalance>
          </AutoColumn>
          <AutoColumn justify="center" style={{ width: '33%', display: 'flex' }}>
            <TokenLogo>
              <CurrencyLogoFromList currency={token ?? undefined} size={'24px'} />
              <TYPE.body fontSize={20} fontWeight={500} margin={'10px'}>
                Staked TEST
              </TYPE.body>
              <QuestionHelper
                text={`${earnedTest?.toFixed(
                  2
                )} TEST is available upon unstaking ${xtestBalance?.toSignificant()} xTest.`}
              />
            </TokenLogo>
            <TokenAndUSDCBalance style={{ marginLeft: 12 }}>
              {earnedTest ? (
                <CountUp
                  key={earnedTest?.toFixed(0)}
                  isCounting
                  decimalPlaces={2}
                  start={parseFloat(countUpEarnedTestBalancePrevious)}
                  end={parseFloat(countUpEarnedTestBalance)}
                  thousandsSeparator={','}
                  duration={1}
                />
              ) : (
                `     `
              )}
            </TokenAndUSDCBalance>
          </AutoColumn>
          <AutoColumn justify="end" style={{ width: '33%' }}>
            <TokenAndUSDCBalance>
              {' '}
              <span style={{ color: '#27D2EA', fontSize: '14px', paddingLeft: '5px' }}>
                <span>$</span>
                {earnedTestUSDCValue ? (
                  <CountUp
                    key={earnedTestUSDCValue?.toFixed(0)}
                    isCounting
                    decimalPlaces={2}
                    start={parseFloat(countUpEarnedTestBalanceUSDCPrevious)}
                    end={parseFloat(countUpEarnedTestBalanceUSDC)}
                    thousandsSeparator={','}
                    duration={1}
                  />
                ) : (
                  `     `
                )}
              </span>
            </TokenAndUSDCBalance>
          </AutoColumn>
        </AutoRow>
        <HRDark />
      </AssetRow>
    </AssetsContainer>
  )
}

export default StakedAssetsTable
