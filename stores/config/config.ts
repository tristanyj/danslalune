export const useConfigStore = defineStore('config/config', () => {
  const searchInput = ref('');

  return {
    searchInput,
  };
});
