import { Story } from '@storybook/react/types-6-0'
import React from 'react'
import { ATOM, OSMOSIS } from '../../constants/tokens'
import Component, { DoubleCurrencyLogoProps } from './index'

export default {
  title: 'DoubleCurrencyLogo',
  decorators: [],
}

const Template: Story<DoubleCurrencyLogoProps> = (args) => <Component {...args} />

export const DoubleCurrencyLogo = Template.bind({})
DoubleCurrencyLogo.args = {
  currency0: ATOM[7668378],
  currency1: OSMOSIS[7668378],
  size: 220,
}
