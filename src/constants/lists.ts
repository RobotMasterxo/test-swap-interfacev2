// used to mark unsupported tokens, these are hosted lists of unsupported tokens

const QOM_LIST = 'https://raw.githubusercontent.com/RobotMasterxo/swap-test/testing/tokenlist.json'
const COMMUNITY_LIST = ''

export const UNSUPPORTED_LIST_URLS: string[] = []
// export const UNSUPPORTED_LIST_URLS: string[] = [BA_LIST]

// lower index == higher priority for token import
export const DEFAULT_LIST_OF_LISTS: string[] = [
  QOM_LIST,
  COMMUNITY_LIST,
  ...UNSUPPORTED_LIST_URLS, // need to load unsupported tokens as well
]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [QOM_LIST]
