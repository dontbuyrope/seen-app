import { useDistributionContractNetworkReactive } from "@/hooks/useContract";

const useDistributionContractEvents = () => {
    const { distributionContract } = useDistributionContractNetworkReactive();
    const distributionContract = computed(() => distributionContract.value);
    const getDistributionEvents = async () => {
        return await distributionContract.queryFilter("SwapForMinimum");
    }

    return { getDistributionEvents }
}

export default useDistributionContractEvents;
