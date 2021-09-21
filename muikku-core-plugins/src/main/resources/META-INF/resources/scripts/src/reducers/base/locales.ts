//TODO this reducer uses the api that interacts with the DOM in order to
//retrieve data, please fix in next versions
import $ from '~/lib/jquery';
import {ActionType} from "~/actions";

export interface LocaleListType {
  available: {
    name: string,
    locale: string
  }[],
  current: string
}

export default function locales(state={
    available: $.makeArray($("#language-picker a").map((index: number, element: HTMLElement)=>{
    return {
      name: $(element).text().trim(),
      locale: $(element).data('locale')
    }
  })),
  current: $("#locale").text()
}, action: ActionType): LocaleListType {
  if (action.type === 'SET_LOCALE'){
    $('#language-picker a[data-locale="' + action.payload + '"]').click();
    return Object.assign({}, state, {current: action.payload});
  }
  return state;
}
