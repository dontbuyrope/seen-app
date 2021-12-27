import {watchEffect, reactive, markRaw, ref, watch} from "vue";

import useWeb3 from "@/connectors/hooks"
import {getContract} from "@/services/utils"
import ERC20_ABI from "@/constants/abis/erc20.json"
import TANGIBLE_V1_ABI from "@/constants/abis/tangibleABI.json"
import ENGLISH_AUCTION_V1_ABI from "@/constants/abis/englishAuctionABI.json"
import ENGLISH_AUCTION_V2_ABI from "@/constants/abis/englishAuctionV2ABI.json"
import OPEN_EDITION_V2_ABI from "@/constants/abis/openEditionV2ABI.json"
import NFT_SALE_V1_ABI from "@/constants/abis/NFTSaleABI.json"
import XSEEN_ABI from "@/constants/abis/xseenABI.json"
import CLAIM_ABI from "@/constants/abis/claimABI.json"
import SEEN_NFT_ABI from "@/constants/abis/SeenNFT.json"
import DISTRIBUTION_ABI from "@/constants/abis/distributionABI.json"
// V3
import ACCESS_CONTROLLER_ABI from "@/constants/abis/v3/accessControllerABI.json"
import SEEN_AUCTION_BUILDER_V3 from "@/constants/abis/v3/auctionBuilderABI"
import SEEN_AUCTION_RUNNER_V3 from "@/constants/abis/v3/auctionRunnerABI"
import SEEN_AUCTION_ENDER_V3 from "@/constants/abis/v3/auctionEnderABI"
import SEEN_SALE_BUILDER_V3 from "@/constants/abis/v3/saleBuilderABI"
import SEEN_SALE_RUNNER_V3 from "@/constants/abis/v3/saleRunnerABI"
import SEEN_SALE_ENDER_V3 from "@/constants/abis/v3/saleEnderABI"
import SEEN_NFT_ABI_V3 from "@/constants/abis/v3/seenHausNFTABI"
import SEEN_TICKETER_ABI_V3 from "@/constants/abis/v3/ticketerABI"
import SEEN_MARKET_CLERK_V3 from "@/constants/abis/v3/marketClerkABI"
import SEEN_MARKET_CONFIG_V3 from "@/constants/abis/v3/marketConfigABI"
import { 
    chainIdToAccessController,
    chainIdToSeenNFT,
    chainIdToMarketDiamond,
    chainIdToDistributionPool,
} from '@/constants/ContractAddressesV3.js'
import VRF_SALE_V2_ABI from "@/constants/abis/vrfSaleV2ABI.json"
import RANDOMNESS_CONSUMER_VRF_ABI from "@/constants/abis/randomnessConsumerVRFABI.json"
import {Web3Provider, WebSocketProvider} from "@ethersproject/providers"

function useContract(address, ABI, withSignerIfPossible = true) {
    const {account, provider} = useWeb3()
    const library = provider.value
        ? new Web3Provider(provider.value)
        : new WebSocketProvider(process.env.VUE_APP_NETWORK_URL)

    try {
        return getContract(address, ABI, library, withSignerIfPossible && account.value ? account.value : undefined)
    } catch (error) {
        console.error('Failed to get contract', error)
        return null
    }
}

export function useTokenContract(tokenAddress, withSignerIfPossible) {
    return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible)
}

export function useV1AuctionContract(contract, withSignerIfPossible) {
    return useContract(contract, ENGLISH_AUCTION_V1_ABI, withSignerIfPossible)
}

export function useV2AuctionContract(contract, withSignerIfPossible) {
    return useContract(contract, ENGLISH_AUCTION_V2_ABI, withSignerIfPossible)
}

export function useV2OpenEditionContract(contract, withSignerIfPossible) {
    return useContract(contract, OPEN_EDITION_V2_ABI, withSignerIfPossible)
}

export function useV2VRFSaleContract(contract, withSignerIfPossible) {
    return useContract(contract, VRF_SALE_V2_ABI, withSignerIfPossible)
}

export function useRandomNumberConsumerContract(contract, withSignerIfPossible) {
    return useContract(contract, RANDOMNESS_CONSUMER_VRF_ABI, withSignerIfPossible)
}

export function useV1NftContract(contract, withSignerIfPossible) {
    return useContract(contract, NFT_SALE_V1_ABI, withSignerIfPossible)
}

export function useV1TangibleContract(contract, withSignerIfPossible) {
    return useContract(contract, TANGIBLE_V1_ABI, withSignerIfPossible)
}

export function useStakingContract(withSignerIfPossible) {
    const contractAddress = process.env.VUE_APP_XSEEN_CONTRACT_ADDRESS
    return useContract(contractAddress, XSEEN_ABI, withSignerIfPossible)
}

export function useSEENContract(withSignerIfPossible) {
    const contractAddress = "0xca3fe04c7ee111f0bbb02c328c699226acf9fd33";
    return useContract(contractAddress, ERC20_ABI, withSignerIfPossible)
}

export function useSeenNFTContract(contract, withSignerIfPossible) {
    return useContract(contract, SEEN_NFT_ABI, withSignerIfPossible)
}

export function useClaimContract(contractAddress, withSignerIfPossible) {
    return useContract(contractAddress, CLAIM_ABI, withSignerIfPossible);
}

const distributionContract = ref(null);
export const useDistributionContractNetworkReactive = async (withSignerIfPossible) => {
    const { chainId } = await useWeb3();
    let contractAddress = chainIdToDistributionPool(chainId.value);
    distributionContract.value = contractAddress ? useContract(contractAddress, DISTRIBUTION_ABI, withSignerIfPossible) : null;

    watch(chainId, async () => {
        contractAddress = chainIdToDistributionPool(chainId.value);
        distributionContract.value = contractAddress ? useContract(contractAddress, DISTRIBUTION_ABI, withSignerIfPossible) : null;
    })

    return {
        distributionContract
    }
}

const accessControllerContract = ref(null);
export const useAccessControllerContractNetworkReactive = async (withSignerIfPossible) => {
    const { chainId } = await useWeb3();
    let contractAddress = chainIdToAccessController(chainId.value);
    accessControllerContract.value = contractAddress ? useContract(contractAddress, ACCESS_CONTROLLER_ABI, withSignerIfPossible) : null;

    watch(chainId, async () => {
        let contractAddress = chainIdToAccessController(chainId.value);
        accessControllerContract.value = contractAddress ? useContract(contractAddress, ACCESS_CONTROLLER_ABI, withSignerIfPossible) : null;
    });

    return {
        accessControllerContract
    }
}

const nftContract = ref(null);
export const useV3NftContractNetworkReactive = async (withSignerIfPossible) => {
    const { chainId } = await useWeb3();
    let contractAddress = chainIdToSeenNFT(chainId.value);
    nftContract.value = contractAddress ? useContract(contractAddress, SEEN_NFT_ABI_V3, withSignerIfPossible) : null;

    watch(chainId, async () => {
        contractAddress = chainIdToSeenNFT(chainId.value);
        nftContract.value = contractAddress ? useContract(contractAddress, SEEN_NFT_ABI_V3, withSignerIfPossible) : null;
    });

    return {
        nftContract
    }
}

const auctionBuilderContract = ref(null);
export const useV3AuctionBuilderContractNetworkReactive = async (withSignerIfPossible) => {
    const { chainId } = await useWeb3();
    let contractAddress = chainIdToMarketDiamond(chainId.value);
    auctionBuilderContract.value = contractAddress ? await useContract(contractAddress, SEEN_AUCTION_BUILDER_V3, withSignerIfPossible) : null;

    watch(chainId, async () => {
        contractAddress = chainIdToMarketDiamond(chainId.value);
        auctionBuilderContract.value = contractAddress ? await useContract(contractAddress, SEEN_AUCTION_BUILDER_V3, withSignerIfPossible) : null;
    });

    return {
        auctionBuilderContract
    }
}

const auctionRunnerContract = ref(null);
export const useV3AuctionRunnerContractNetworkReactive = async (withSignerIfPossible) => {
    const { chainId } = await useWeb3();
    let contractAddress = chainIdToMarketDiamond(chainId.value);
    auctionRunnerContract.value = contractAddress ? await useContract(contractAddress, SEEN_AUCTION_RUNNER_V3, withSignerIfPossible) : null;

    watch(chainId, async () => {
        contractAddress = chainIdToMarketDiamond(chainId.value);
        auctionRunnerContract.value = contractAddress ? await useContract(contractAddress, SEEN_AUCTION_RUNNER_V3, withSignerIfPossible) : null;
    });

    return {
        auctionRunnerContract
    }
}

const auctionEnderContract = ref(null);
export const useV3AuctionEnderContractNetworkReactive = async (withSignerIfPossible) => {
    const { chainId } = await useWeb3();
    let contractAddress = chainIdToMarketDiamond(chainId.value);
    auctionEnderContract.value = contractAddress ? await useContract(contractAddress, SEEN_AUCTION_ENDER_V3, withSignerIfPossible) : null;

    watch(chainId, async () => {
        contractAddress = chainIdToMarketDiamond(chainId.value);
        auctionEnderContract.value = contractAddress ? await useContract(contractAddress, SEEN_AUCTION_ENDER_V3, withSignerIfPossible) : null;
    });

    return {
        auctionEnderContract
    }
}

const saleBuilderContract = ref(null);
export const useV3SaleBuilderContractNetworkReactive = async (withSignerIfPossible) => {
    const { chainId } = await useWeb3();
    let contractAddress = chainIdToMarketDiamond(chainId.value);
    saleBuilderContract.value = contractAddress ? await useContract(contractAddress, SEEN_SALE_BUILDER_V3, withSignerIfPossible) : null;

    watch(chainId, async () => {
        contractAddress = chainIdToMarketDiamond(chainId.value);
        saleBuilderContract.value = contractAddress ? await useContract(contractAddress, SEEN_SALE_BUILDER_V3, withSignerIfPossible) : null;
    });

    return {
        saleBuilderContract
    }
}

const saleRunnerContract = ref(null);
export const useV3SaleRunnerContractNetworkReactive = async (withSignerIfPossible) => {
    const { chainId } = await useWeb3();
    let contractAddress = chainIdToMarketDiamond(chainId.value);
    saleRunnerContract.value = contractAddress ? await useContract(contractAddress, SEEN_SALE_RUNNER_V3, withSignerIfPossible) : null;

    watch(chainId, async () => {
        contractAddress = chainIdToMarketDiamond(chainId.value);
        saleRunnerContract.value = contractAddress ? await useContract(contractAddress, SEEN_SALE_RUNNER_V3, withSignerIfPossible) : null;
    });

    return {
        saleRunnerContract
    }
}

const saleEnderContract = ref(null);
export const useV3SaleEnderContractNetworkReactive = async (withSignerIfPossible) => {
    const { chainId } = await useWeb3();
    let contractAddress = chainIdToMarketDiamond(chainId.value);
    saleEnderContract.value = contractAddress ? await useContract(contractAddress, SEEN_SALE_ENDER_V3, withSignerIfPossible) : null;

    watch(chainId, async () => {
        contractAddress = chainIdToMarketDiamond(chainId.value);
        saleEnderContract.value = contractAddress ? await useContract(contractAddress, SEEN_SALE_ENDER_V3, withSignerIfPossible) : null;
    });

    return {
        saleEnderContract
    }
}

const marketClerkContract = ref(null);
export const useV3MarketClerkContractNetworkReactive = async (withSignerIfPossible) => {
    const { chainId } = await useWeb3();
    let contractAddress = chainIdToMarketDiamond(chainId.value);
    marketClerkContract.value = contractAddress ? await useContract(contractAddress, SEEN_MARKET_CLERK_V3, withSignerIfPossible) : null;

    watch(chainId, async () => {
        contractAddress = chainIdToMarketDiamond(chainId.value);
        marketClerkContract.value = contractAddress ? await useContract(contractAddress, SEEN_MARKET_CLERK_V3, withSignerIfPossible) : null;
    });

    return {
      marketClerkContract
    }
}

const marketConfigContract = ref(null);
export const useV3MarketConfigContractNetworkReactive = async (withSignerIfPossible) => {
    const { chainId } = await useWeb3();
    let contractAddress = chainIdToMarketDiamond(chainId.value);
    marketConfigContract.value = contractAddress ? await useContract(contractAddress, SEEN_MARKET_CONFIG_V3, withSignerIfPossible) : null;

    watch(chainId, async () => {
        contractAddress = chainIdToMarketDiamond(chainId.value);
        marketConfigContract.value = contractAddress ? await useContract(contractAddress, SEEN_MARKET_CONFIG_V3, withSignerIfPossible) : null;
    });

    return {
        marketConfigContract
    }
}

const ticketerContract = ref(null);
export const useV3TicketerContractNetworkReactive = async (withSignerIfPossible, ticketerAddress) => {
    const { chainId } = await useWeb3();
    ticketerContract.value = ticketerAddress ? await useContract(ticketerAddress, SEEN_TICKETER_ABI_V3, withSignerIfPossible) : null;

    watch(chainId, async () => {
      ticketerContract.value = ticketerAddress ? await useContract(ticketerAddress, SEEN_TICKETER_ABI_V3, withSignerIfPossible) : null;
    });

    return {
        ticketerContract
    }
}