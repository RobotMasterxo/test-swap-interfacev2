import React from 'react'
import { InfoCard } from 'components/InfoCard'

export function NomadWarningBanner({ style }: { style?: any }) {
  return (
    <InfoCard
      style={style}
      title="QOM TESTNET"
      description={
        <ol>
          {/* <li>
            
          </li>
          <li>
            
          </li> */}
        </ol>
      }
    />
  )
}
