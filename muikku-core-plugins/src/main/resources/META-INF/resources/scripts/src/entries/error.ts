import App from "~/containers/error";
import reducer from "~/reducers/error";
import runApp from "../run";
import mainFunctionDefault from "~/util/base-main-function";
import { updateError } from "~/actions/base/error";

(async () => {
  const store = await runApp(reducer, App, async (stor) => {
    const websocket = await mainFunctionDefault(stor);
    return { websocket };
  });

  store.dispatch(
    updateError({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      title: (window as any).MUIKKU_ERROR_TITLE,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      description: (window as any).MUIKKU_ERROR_DESCRIPTION,
    })
  );
})();
