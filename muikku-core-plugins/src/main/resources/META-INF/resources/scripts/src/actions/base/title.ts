import {UPDATE_TITLE} from '~/actions';

export default {
  updateTitle(newTitle: string):UPDATE_TITLE{
    document.title = newTitle;
    return {
      type: 'UPDATE_TITLE',
      payload: newTitle
    }
  }
}