export default {
  updateHash(hash){
    return {
      type: "UPDATE_HASH",
      payload: hash
    }
  }
}