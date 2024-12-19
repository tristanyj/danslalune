import { heightToInches } from '~/assets/scripts/utils';
import type { SelectablePlayer } from '~/types';

export function usePlayerSort() {
  const sortByName = (players: SelectablePlayer[], isSortAscending: boolean) => {
    return players.sort((a, b) => {
      const [aFirstName, aLastName] = a.info.name.split(' ');
      const [bFirstName, bLastName] = b.info.name.split(' ');

      return isSortAscending
        ? aLastName.localeCompare(bLastName) || aFirstName.localeCompare(bFirstName)
        : bLastName.localeCompare(aLastName) || bFirstName.localeCompare(bFirstName);
    });
  };

  const sortByWinShares = (players: SelectablePlayer[], isSortAscending: boolean) => {
    return players.sort((a, b) => {
      return isSortAscending ? a.winShares - b.winShares : b.winShares - a.winShares;
    });
  };

  const sortByHeight = (players: SelectablePlayer[], isSortAscending: boolean) => {
    return players.sort((a, b) => {
      const aHeight = heightToInches(a.info.height);
      const bHeight = heightToInches(b.info.height);

      return isSortAscending ? aHeight - bHeight : bHeight - aHeight;
    });
  };

  const sortByWeight = (players: SelectablePlayer[], isSortAscending: boolean) => {
    return players.sort((a, b) => {
      const aWeight = parseInt(a.info.weight);
      const bWeight = parseInt(b.info.weight);

      return isSortAscending ? aWeight - bWeight : bWeight - aWeight;
    });
  };

  const sortByExperience = (players: SelectablePlayer[], isSortAscending: boolean) => {
    return players.sort((a, b) => {
      return isSortAscending
        ? a.info.experience - b.info.experience
        : b.info.experience - a.info.experience;
    });
  };

  const sortByDraftYear = (players: SelectablePlayer[], isSortAscending: boolean) => {
    return players.sort((a, b) => {
      return isSortAscending
        ? a.info.draft[1] - b.info.draft[1]
        : b.info.draft[1] - a.info.draft[1];
    });
  };

  return {
    sortByName,
    sortByWinShares,
    sortByHeight,
    sortByWeight,
    sortByExperience,
    sortByDraftYear,
  };
}
