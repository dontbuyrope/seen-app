import { CollectablesService } from "@/services/apiService";
import { COLLECTABLE_TYPE } from "@/constants/Collectables.js";
import { computed, reactive } from "vue";


export default function useDropsWithPagination(artistId = null, perPage = 12) {
  const state = reactive({
    items: [null, null, null, null, null, null],
    perPage: perPage,
    page: 1,
    hasMore: false,
    filter: COLLECTABLE_TYPE.NONE,
    artistId,
  });

  async function load() {
    state.perPage = perPage;
    state.page = 1;
    state.hasMore = false;

    state.items = [
      null,
      null,
      null,
      null,
      null,
      null,
    ];

    const pagination = {
      perPage: state.perPage,
      page: state.page,
    };

    const filtrationOptions = { type: state.filter };
    if (artistId != null) {
      filtrationOptions.artistId = artistId;
    }

    const { data, metadata } = await CollectablesService.list(
      pagination,
      filtrationOptions,
    );

    state.items = data;
    state.hasMore =
      metadata.pagination.totalPages > state.page;
  }

  async function loadMore() {
    if (!state.hasMore) return;

    const pagination = {
      perPage: state.perPage,
      page: state.page + 1,
    };

    state.items = [
      ...state.items,
      null,
      null,
      null,
      null,
      null,
      null,
    ];

    const filtrationOptions = { type: state.filter };
    if (artistId != null) {
      filtrationOptions.artistId = artistId;
    }

    const { data, metadata } = await CollectablesService.list(
      pagination,
      filtrationOptions,
    );

    state.page += 1;
    state.items = [
      ...state.items.filter((i) => i != null),
      ...data,
    ];

    state.hasMore =
      metadata.pagination.totalPages !== state.page;
  }

  function filter(filterNft, filterTangibleNft) {
    state.filter = getFilter(filterNft, filterTangibleNft);
    load();
  }

  function getFilter(filterNft, filterTangibleNft) {
    if (filterNft && filterTangibleNft)
      return COLLECTABLE_TYPE.NONE;
    if (filterNft)
      return COLLECTABLE_TYPE.NFT;
    if (filterTangibleNft)
      return COLLECTABLE_TYPE.TANGIBLE_NFT;

    return COLLECTABLE_TYPE.TANGIBLE;
  }

  const listOfCollectables = computed(() => state.items);
  const hasMore = computed(() => state.hasMore);

  return {
    listOfCollectables,
    hasMore,
    filter,
    load,
    loadMore,
  };
}