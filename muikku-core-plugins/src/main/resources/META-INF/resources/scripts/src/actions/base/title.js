export default {
  updateTitle(newTitle){
    document.title = newTitle;
    return {
      type: 'UPDATE_TITLE',
      payload: newTitle
    }
  }
}