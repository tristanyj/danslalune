import type { Player, SelectablePlayer, PlayerKey, PlayerFilters } from '~/types';
import {
  DEFAULT_PLAYER_IDS,
  HEIGHT_RANGE,
  WEIGHT_RANGE,
  YEARS_RANGE,
  PLAYER_SORT_OPTIONS,
  DEFAULT_PLAYER_FILTERS,
} from '~/assets/scripts/constants';

import { isDefaultRange } from '~/assets/scripts/utils';

export const usePlayerConfigStore = defineStore('config/player', () => {
  const configStore = useConfigStore();
  const { searchInput } = storeToRefs(configStore);

  const {
    filterBySearch,
    filterByHeight,
    filterByWeight,
    filterBySelection,
    filterByYears,
    filteredByPosition,
  } = usePlayerFilters();

  const {
    sortByName,
    sortByWinShares,
    sortByHeight,
    sortByWeight,
    sortByExperience,
    sortByDraftYear,
  } = usePlayerSort();

  // --------------------------------
  // State
  // --------------------------------

  const players = ref<Player[]>([]);
  const selectedPlayerIds = ref<PlayerKey[]>([...DEFAULT_PLAYER_IDS]);

  const currentSort = ref(PLAYER_SORT_OPTIONS[1]);
  const isSortAscending = ref(false);

  const filters = ref<PlayerFilters>(DEFAULT_PLAYER_FILTERS);

  // --------------------------------
  // Computed
  // --------------------------------

  const isLoaded = computed(() => players.value.length > 0);

  const selectedPlayers = computed(() =>
    players.value.filter((player) => selectedPlayerIds.value.includes(player.id))
  );

  const selectablePlayers = computed<SelectablePlayer[]>(() => {
    return players.value.map(({ id, color, info, stats }) => ({
      id,
      color,
      info,
      winShares: stats['regular_season.advanced.win_shares'],
    }));
  });

  const filteredPlayers = computed(() => {
    const searchTerm = searchInput.value.toLowerCase();

    let result = selectablePlayers.value;

    result = filterBySearch(result, searchTerm);
    result = filterBySelection(result, selectedPlayerIds.value, filters.value.selectedOnly);
    result = filterByHeight(result, filters.value.heightRange);
    result = filterByWeight(result, filters.value.weightRange);
    result = filterByYears(result, filters.value.yearsRange);
    result = filteredByPosition(result, filters.value.positions);

    return result;
  });

  const isFiltered = computed(() => {
    return (
      filters.value.selectedOnly ||
      !isDefaultRange(filters.value.heightRange, HEIGHT_RANGE) ||
      !isDefaultRange(filters.value.weightRange, WEIGHT_RANGE) ||
      !isDefaultRange(filters.value.yearsRange, YEARS_RANGE) ||
      Object.values(filters.value.positions).some((position) => !position)
    );
  });

  const sortedPlayers = computed(() => {
    const copy = [...filteredPlayers.value];

    switch (currentSort.value.key) {
      case 'name':
        return sortByName(copy, isSortAscending.value);
      case 'win-shares':
        return sortByWinShares(copy, isSortAscending.value);
      case 'height':
        return sortByHeight(copy, isSortAscending.value);
      case 'weight':
        return sortByWeight(copy, isSortAscending.value);
      case 'experience':
        return sortByExperience(copy, isSortAscending.value);
      case 'draft-year':
        return sortByDraftYear(copy, isSortAscending.value);
      default:
        return copy;
    }
  });

  // --------------------------------
  // Methods
  // --------------------------------

  const setPlayers = (d: Player[]) => {
    players.value = d.map((player) => ({
      ...player,
      info: {
        ...player.info,
        nickname: player.info.nickname.split(',')[0],
        teams: typeof player.info.teams === 'string' ? [player.info.teams] : player.info.teams,
        draft: player.id === 'malonmo01' ? [5, 1976] : player.info.draft,
      },
    }));
  };

  const setSelectedPlayerIds = (newselectedPlayerIds: PlayerKey[]) => {
    selectedPlayerIds.value = newselectedPlayerIds;
  };

  const restoreDefaultPlayerSelection = () => {
    selectedPlayerIds.value = [...DEFAULT_PLAYER_IDS];
  };

  const clearFilters = () => {
    filters.value = JSON.parse(JSON.stringify(DEFAULT_PLAYER_FILTERS));
  };

  const clearSelection = () => {
    selectedPlayerIds.value = [];
  };

  const selectAllFilteredPlayers = () => {
    setSelectedPlayerIds(
      [...selectedPlayerIds.value, ...filteredPlayers.value.map((player) => player.id)].filter(
        (id, index, self) => self.indexOf(id) === index
      )
    );
  };

  return {
    isLoaded,
    selectedPlayerIds,
    selectablePlayers,
    selectedPlayers,
    currentSort,
    isSortAscending,
    filters,
    isFiltered,
    filteredPlayers,
    sortedPlayers,
    setPlayers,
    setSelectedPlayerIds,
    restoreDefaultPlayerSelection,
    selectAllFilteredPlayers,
    clearFilters,
    clearSelection,
  };
});
