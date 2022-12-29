import { ButtonPrimary } from 'components/Button'
import { AutoColumn } from 'components/Column'

import StakingModal from './StakingModal'
import UnstakingModal from './UnstakingModal'
import styled from 'styled-components'

import { TEST, XTEST } from 'constants/tokens'
import { useActiveWeb3React } from 'hooks/web3'
import React, { useState } from 'react'
import { useTokenBalance } from 'state/wallet/hooks'
import { TYPE } from '../../theme'
import { AutoRow, RowBetween } from '../../components/Row'
import { CurrencyLogoFromList } from '../../components/CurrencyLogo/CurrencyLogoFromList'
import { HRDark } from '../../components/HR/HR'

import { useEarnedTest, useStakingAPY } from 'components/stake/stake-hooks'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { CurrencyAmount } from 'sdk-core/entities'
import { useUSDCValue } from '../../hooks/useUSDCPrice'
import { FarmYield } from '../farm/FarmYield'
import JSBI from 'jsbi'
import { CountUp } from 'use-count-up'
import QuestionHelper from '../QuestionHelper'
import { Glow } from '../../pages/AppBody'
import usePrevious from '../../hooks/usePrevious'

export const TokenAndUSDCBalance = styled.div`
  display: flex;
  align-items: center;
`

export function StakingBalance() {
  const { account, chainId } = useActiveWeb3React()
  const token = chainId ? TEST[chainId] : undefined
  const xToken = chainId ? XTEST[chainId] : undefined
  const testusionBalance = useTokenBalance(account ?? undefined, token)
  const testusionUSDCValue = useUSDCValue(testusionBalance)
  const xtestBalance = useTokenBalance(account ?? undefined, xToken)
  const earnedTest = useEarnedTest(xtestBalance)
  const earnedTestUSDCValue = useUSDCValue(earnedTest)
  const xTestContractBalance = useTokenBalance(chainId ? XTEST[chainId].address : undefined, token)
  const xTestContractUSDCBalance = useUSDCValue(xTestContractBalance)
  const emission = token ? CurrencyAmount.fromRawAmount(token, 62500e18) : undefined

  const emissionPerSecond = token ? CurrencyAmount.fromRawAmount(token, 0.72337962963e18) : undefined

  const apr =
    emission && xTestContractBalance
      ? emission
          ?.divide(xTestContractBalance ? xTestContractBalance : JSBI.BigInt(1))
          .multiply(100)
          .multiply(365).quotient
      : JSBI.BigInt(0)

  const ratio = useEarnedTest(xToken ? CurrencyAmount.fromRawAmount(xToken, 10 ** xToken.decimals) : undefined)
  const ratioPrevious = usePrevious(parseFloat(ratio ? ratio?.toSignificant() : '0'))
  const apy = useStakingAPY()

  const countUpTestBalance = testusionBalance?.toSignificant() ?? '0'
  const countUpTestBalancePrevious = usePrevious(countUpTestBalance) ?? '0'

  const countUpTestBalanceUSDC = testusionUSDCValue?.toSignificant() ?? '0'
  const countUpTestBalanceUSDCPrevious = usePrevious(countUpTestBalanceUSDC) ?? '0'

  const countUpXTestBalance = xtestBalance?.toSignificant() ?? '0'
  const countUpXTestBalancePrevious = usePrevious(countUpXTestBalance) ?? '0'

  const countUpEarnedTestBalanceUSDC = earnedTestUSDCValue?.toSignificant() ?? '0'
  const countUpEarnedTestBalanceUSDCPrevious = usePrevious(countUpEarnedTestBalanceUSDC) ?? '0'

  const countUpEarnedTestBalance = earnedTest?.toSignificant() ?? '0'
  const countUpEarnedTestBalancePrevious = usePrevious(countUpEarnedTestBalance) ?? '0'

  const [stakingModalOpen, setStakingModalOpen] = useState(false)
  const [unstakeModalOpen, setUnstakeModalOpen] = useState(false)
  console.log(apy)
  return (
    <>
      <FarmYield
        apr={apr}
        totalDeposits={xTestContractBalance}
        totalDepositsInUSD={xTestContractUSDCBalance}
        yourDeposits={earnedTest}
        yourDepositsInUSD={earnedTestUSDCValue}
        primaryEmissionPerSecond={emissionPerSecond}
        emissionTimeframe={'daily'}
      />

      <BalanceRow>
        <BalanceColumn justify={`stretch`}>
          <RowBetween>
            <AutoColumn justify={'start'}>
              <TYPE.largeHeader color={'primary1'} marginBottom={`15px`}>
                Your Balances
              </TYPE.largeHeader>
            </AutoColumn>
            <AutoColumn justify={'end'}>
              <TYPE.largeHeader color={'primary1'} marginBottom={`10px`}>
                <TokenLogo>
                  <DoubleCurrencyLogo currency0={xToken} currency1={token} size={16} />
                  <TYPE.body fontSize={16} fontWeight={500} margin={'10px'}>
                    TEST / xTEST Ratio:{' '}
                    <span style={{ color: '#27D2EA', fontSize: '14px', paddingLeft: '7px' }}>
                      {ratio ? (
                        <CountUp
                          key={ratio?.toSignificant()}
                          isCounting
                          decimalPlaces={4}
                          start={ratioPrevious}
                          end={parseFloat(ratio?.toSignificant())}
                          thousandsSeparator={','}
                          duration={1}
                        />
                      ) : (
                        `     `
                      )}
                    </span>
                  </TYPE.body>
                  <QuestionHelper text={`Unstaking 1 xTEST will earn ${ratio?.toSignificant()} TEST`} />
                </TokenLogo>
              </TYPE.largeHeader>
            </AutoColumn>
          </RowBetween>
          <HRDark />
          <RowBetween>
            <AutoColumn justify={'start'}>
              <TokenLogo>
                <CurrencyLogoFromList currency={token ?? undefined} size={'24px'} />
                <TYPE.body fontSize={20} fontWeight={500} margin={'10px'}>
                  TEST
                </TYPE.body>
              </TokenLogo>
            </AutoColumn>
            <AutoColumn justify={'end'}>
              <TokenAndUSDCBalance>
                {testusionBalance?.toSignificant() ? (
                  <CountUp
                    key={testusionBalance?.toSignificant()}
                    isCounting
                    decimalPlaces={4}
                    start={parseFloat(countUpTestBalancePrevious)}
                    end={parseFloat(countUpTestBalance)}
                    thousandsSeparator={','}
                    duration={1}
                  />
                ) : (
                  <></>
                )}
                <span style={{ color: '#27D2EA', fontSize: '14px', paddingLeft: '5px' }}>
                  <span>$</span>
                  {testusionUSDCValue ? (
                    <CountUp
                      key={testusionUSDCValue?.toFixed(0)}
                      isCounting
                      decimalPlaces={2}
                      start={parseFloat(countUpTestBalanceUSDCPrevious)}
                      end={parseFloat(countUpTestBalanceUSDC)}
                      thousandsSeparator={','}
                      duration={1}
                    />
                  ) : (
                    `     `
                  )}
                </span>
              </TokenAndUSDCBalance>
            </AutoColumn>
          </RowBetween>
          <HRDark />
          <RowBetween>
            <AutoColumn justify={'start'}>
              <TokenLogo>
                <CurrencyLogoFromList currency={xToken ?? undefined} size={'24px'} />
                <TYPE.body fontSize={20} fontWeight={500} margin={'10px'}>
                  xTEST
                </TYPE.body>
              </TokenLogo>
            </AutoColumn>

            <AutoColumn justify={'end'}>
              <TokenAndUSDCBalance>
                {xtestBalance ? (
                  <CountUp
                    key={xtestBalance?.toFixed(0)}
                    isCounting
                    decimalPlaces={4}
                    start={parseFloat(countUpXTestBalancePrevious)}
                    end={parseFloat(countUpXTestBalance)}
                    thousandsSeparator={','}
                    duration={1}
                  />
                ) : (
                  `     `
                )}
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
          </RowBetween>
          <HRDark />
          <RowBetween>
            <AutoColumn justify={'start'}>
              <TokenLogo>
                <CurrencyLogoFromList currency={token ?? undefined} size={'24px'} />
                <TYPE.body fontSize={20} fontWeight={500} margin={'10px'}>
                  Staked TEST
                </TYPE.body>
                <QuestionHelper
                  text={`${earnedTest?.toFixed(
                    2
                  )} TEST is available upon unstaking ${xtestBalance?.toSignificant()} xTEST.`}
                />
              </TokenLogo>
            </AutoColumn>

            <AutoColumn justify={'end'}>
              <TokenAndUSDCBalance>
                {earnedTest ? (
                  <CountUp
                    key={earnedTest?.toFixed(0)}
                    isCounting
                    decimalPlaces={4}
                    start={parseFloat(countUpEarnedTestBalancePrevious)}
                    end={parseFloat(countUpEarnedTestBalance)}
                    thousandsSeparator={','}
                    duration={1}
                  />
                ) : (
                  `     `
                )}
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
          </RowBetween>
        </BalanceColumn>
      </BalanceRow>

      <ButtonRow justify={'space-between'}>
        <AutoColumn justify={'stretch'}>
          <ButtonPrimary
            padding="8px"
            borderRadius="8px"
            width="140px"
            disabled={!testusionBalance?.greaterThan('0')}
            onClick={() => setStakingModalOpen(true)}
          >
            Stake
          </ButtonPrimary>
        </AutoColumn>
        <AutoColumn justify={'stretch'}>
          <ButtonPrimary
            padding="8px"
            borderRadius="8px"
            width="140px"
            disabled={!xtestBalance?.greaterThan('0')}
            onClick={() => setUnstakeModalOpen(true)}
          >
            Unstake
          </ButtonPrimary>
        </AutoColumn>
      </ButtonRow>

      <StakingModal
        isOpen={stakingModalOpen}
        onDismiss={() => setStakingModalOpen(false)}
        availableAmount={testusionBalance}
        currencyToAdd={xToken}
      />
      <UnstakingModal
        isOpen={unstakeModalOpen}
        onDismiss={() => setUnstakeModalOpen(false)}
        availableAmount={xtestBalance}
      />
    </>
  )
}

const BalanceRow = styled(RowBetween)`
  background: ${({ theme }) =>
    `linear-gradient(90deg, ${theme.darkTransparent} 0%, ${theme.secondary1_30} 50%, ${theme.darkTransparent} 100%);`};
  border: 1px solid rgba(12, 92, 146, 0.7);
  box-shadow: 0 0 5px rgba(39, 210, 234, 0.1), 0 0 7px rgba(39, 210, 234, 0.3);
  border-radius: 8px;
  padding: 2% 5%;
  font-size: 22px;
  backdrop-filter: blur(4px) saturate(150%);
  ${Glow}
`

const BalanceColumn = styled(AutoColumn)`
  width: 100%;
`

export const TokenLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const ButtonRow = styled(AutoRow)`
  width: 50%;
`
