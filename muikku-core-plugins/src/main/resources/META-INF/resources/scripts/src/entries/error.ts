import App from "~/containers/error";
import reducer from "~/reducers/error";
import runApp from "../run";
import mainFunctionDefault from "~/util/base-main-function";

import titleActions from "~/actions/base/title";

import { updateError } from "~/actions/base/error";

(async () => {
  const store = await runApp(reducer, App, async (stor) => {
    const websocket = await mainFunctionDefault(stor);
    return { websocket };
  });

  store.dispatch(titleActions.updateTitle((window as any).MUIKKU_ERROR_TITLE));
  store.dispatch(
    updateError({
      title: (window as any).MUIKKU_ERROR_TITLE,
      description: (window as any).MUIKKU_ERROR_DESCRIPTION,
    })
  );
})();
