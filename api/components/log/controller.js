module.exports = (injectedStore) => {
  let store = injectedStore;
  if (!store) throw new Error("No storage source available.");

  async function list(params) {
    try {
      return await store.list(params);
    } catch (error) {
      throw error;
    }
  }

  async function create(data) {
    try {
      return await store.create(data);
    } catch (error) {
      throw error;
    }
  }

  return {
    list,
    create,
  };
};
