import { POSITION_EQUIVALENT } from '~/assets/scripts/constants';
import { heightToInches } from '~/assets/scripts/utils';
import type { SelectablePlayer, PlayerKey } from '~/types';

export function usePlayerFilters() {
  const filterBySearch = (players: SelectablePlayer[], searchTerm: string) => {
    return searchTerm
      ? players.filter((player) => player.info.name.toLowerCase().includes(searchTerm))
      : players;
  };

  const filterBySelection = (
    players: SelectablePlayer[],
    selectedIds: PlayerKey[],
    selectedOnly: boolean
  ) => {
    return selectedOnly ? players.filter((player) => selectedIds.includes(player.id)) : players;
  };

  const filterByHeight = (players: SelectablePlayer[], range: number[]) => {
    return players.filter((player) => {
      const height = heightToInches(player.info.height);
      return height >= Math.min(...range) && height <= Math.max(...range);
    });
  };

  const filterByWeight = (players: SelectablePlayer[], range: number[]) => {
    return players.filter((player) => {
      const weight = parseInt(player.info.weight);
      return weight >= Math.min(...range) && weight <= Math.max(...range);
    });
  };

  const filterByYears = (players: SelectablePlayer[], range: number[]) => {
    return players.filter((player) => {
      const endYear = player.info.draft[1] + player.info.experience;
      return endYear >= Math.min(...range) && endYear <= Math.max(...range);
    });
  };

  const filteredByPosition = (players: SelectablePlayer[], positions: Record<string, boolean>) => {
    const selectedPositions = Object.entries(positions)
      .filter((position) => position[1])
      .map((position) => position[0]);

    return selectedPositions.length
      ? players.filter((player) => {
          return selectedPositions.some((position) => {
            const equivalent = POSITION_EQUIVALENT[position as keyof typeof POSITION_EQUIVALENT];
            return !!equivalent && player.info.position === equivalent;
          });
        })
      : players;
  };

  return {
    filterBySearch,
    filterBySelection,
    filterByHeight,
    filterByWeight,
    filterByYears,
    filteredByPosition,
  };
}
