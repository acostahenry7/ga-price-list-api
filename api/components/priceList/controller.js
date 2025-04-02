module.exports = (injectedStore) => {
  let store = injectedStore;
  if (!store) throw new Error("No storage source available.");

  async function list(data) {
    try {
      return await store.list(data);
    } catch (error) {
      throw error;
    }
  }

  async function update(data) {
    try {
      return await store.update(data);
    } catch (error) {
      throw error;
    }
  }

  return {
    list,
    update,
  };
};
