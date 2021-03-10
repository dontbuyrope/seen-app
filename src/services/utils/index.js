import {Contract} from '@ethersproject/contracts';
import {getAddress} from '@ethersproject/address';
import {AddressZero} from '@ethersproject/constants';
import {BigNumber} from '@ethersproject/bignumber';

/**
 *
 * @param value
 * @return {string|boolean}
 */
export function isAddress(value) {
    try {
        return getAddress(value)
    } catch {
        return false
    }
}

/**
 *
 * @type {{"1": string, "3": string, "4": string, "42": string}}
 */
const ETHERSCAN_PREFIXES = {
    1: '',
    3: 'ropsten.',
    4: 'rinkeby.',
    42: 'kovan.'
}

/**
 *
 * @param chainId
 * @param data
 * @param type
 * @return {string}
 */
export function getEtherscanLink(
    chainId,
    data,
    type
) {
    const prefix = `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`

    switch (type) {
        case 'transaction': {
            return `${prefix}/tx/${data}`
        }
        case 'token': {
            return `${prefix}/token/${data}`
        }
        case 'block': {
            return `${prefix}/block/${data}`
        }
        case 'address':
        default: {
            return `${prefix}/address/${data}`
        }
    }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
/**
 *
 * @param address
 * @param chars
 * @return {string}
 */
export function shortenAddress(address, chars = 4) {
    const parsed = isAddress(address)
    if (!parsed) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }
    return `${parsed.substring(0, chars + 2)}...${parsed.substring(42 - chars)}`
}

// add 10%
/**
 *
 * @param value
 * @return {BigNumber}
 */
export function calculateGasMargin(value) {
    return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000))
}


// account is not optional
/**
 *
 * @param library
 * @param account
 * @return {JsonRpcSigner}
 */
export function getSigner(library, account) {
    return library.getSigner(account).connectUnchecked()
}

// account is optional
/**
 *
 * @param library
 * @param account
 * @return {*}
 */
export function getProviderOrSigner(library, account) {
    return account ? getSigner(library, account) : library
}

// account is optional
/**
 *
 * @param address
 * @param ABI
 * @param library
 * @param account
 * @return {Contract}
 */
export function getContract(address, ABI, library, account) {
    if (!isAddress(address) || address === AddressZero) {
        throw Error(`Invalid 'address' parameter '${address}'.`)
    }

    return new Contract(address, ABI, getProviderOrSigner(library, account))
}

export function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}