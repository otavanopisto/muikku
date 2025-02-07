import StringStorage from "~/util/storage";
import * as React from "react";

/**
 * SessionStateComponent
 */
export default class SessionStateComponent<P, S> extends React.Component<P, S> {
  private storage: StringStorage;
  recovered: boolean;
  /**
   *
   * @param props props
   * @param namespace namespace
   * @param subnamespace subnamespace
   */
  constructor(props: P, namespace: string, subnamespace?: string) {
    super(props);

    this.storage = new StringStorage(namespace);
    if (subnamespace) {
      this.storage = this.storage.namespace(subnamespace);
    }

    this.recovered = false;
  }

  /**
   * setStateAndStore
   * @param newState nextState
   * @param namespace namespace
   */
  setStateAndStore(newState: Partial<S>, namespace?: any): void {
    let internalStorage = this.storage;
    if (namespace) {
      internalStorage = this.storage.namespace(namespace + "");
    }

    const nnewState: any = newState;
    Object.keys(nnewState).forEach((key) => {
      internalStorage.save(key, JSON.stringify(nnewState[key]));
    });
    this.setState(nnewState);
  }

  /**
   * getRecoverStoredState
   * @param base base
   * @param namespace namespace
   * @returns S
   */
  getRecoverStoredState(base: Partial<S>, namespace?: any): S {
    let internalStorage = this.storage;
    if (namespace) {
      internalStorage = this.storage.namespace(namespace + "");
    }

    const baseSerialized = JSON.stringify(base);

    const result: any = base;
    Object.keys(result).forEach((key) => {
      const recovered = JSON.parse(internalStorage.recover(key));
      if (
        (result[key] instanceof Date && typeof recovered === "string") ||
        (result[key] === null && key.toLowerCase().includes("date"))
      ) {
        result[key] = recovered ? new Date(recovered) : result[key];
      } else {
        result[key] = recovered || result[key];
      }
    });

    this.recovered = JSON.stringify(result) !== baseSerialized;

    return result;
  }

  /**
   * checkStoredAgainstThisState
   * @param base base
   * @param namespace namespace
   */
  checkStoredAgainstThisState(base: Partial<S>, namespace?: any): void {
    let internalStorage = this.storage;
    if (namespace) {
      internalStorage = this.storage.namespace(namespace + "");
    }

    const baseSerialized = JSON.stringify(base);

    const result: any = base;
    Object.keys(result).forEach((key) => {
      const recovered = JSON.parse(internalStorage.recover(key));
      if (result[key] instanceof Date && typeof recovered === "string") {
        result[key] = recovered ? new Date(recovered) : result[key];
      } else {
        result[key] = recovered || result[key];
      }
    });

    const recovered = JSON.stringify(result) !== baseSerialized;
    if (this.recovered !== recovered) {
      this.recovered = recovered;

      this.forceUpdate();
    }
  }

  /**
   * forceRecovered
   * @param newRecovered newRecovered
   */
  forceRecovered(newRecovered = true) {
    if (this.recovered !== newRecovered) {
      this.recovered = newRecovered;

      this.forceUpdate();
    }
  }

  /**
   * setStateAndClear
   * @param newState newState
   * @param namespace namespace
   * @param callback callback
   */
  setStateAndClear(
    newState: Partial<S>,
    namespace?: any,
    callback?: () => void
  ): void {
    let internalStorage = this.storage;
    if (namespace) {
      internalStorage = this.storage.namespace(namespace + "");
    }

    Object.keys(newState).forEach((key) => {
      internalStorage.clear(key);
    });
    this.recovered = false;
    this.setState(newState as S, callback);
  }

  /**
   * justClear
   * @param keys keys
   * @param namespace namespace
   */
  justClear(keys: Array<string>, namespace?: any): void {
    let internalStorage = this.storage;
    if (namespace) {
      internalStorage = this.storage.namespace(namespace + "");
    }

    keys.forEach((key) => {
      internalStorage.clear(key);
    });

    const newRecovered = false;
    if (this.recovered !== newRecovered) {
      this.recovered = newRecovered;

      this.forceUpdate();
    }
  }
}
