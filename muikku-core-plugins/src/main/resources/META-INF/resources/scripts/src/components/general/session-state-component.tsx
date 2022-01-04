import StringStorage from "~/util/storage";
import * as React from "react";

export default class SessionStateComponent<P, S> extends React.Component<P, S> {
  private storage: StringStorage;
  recovered: boolean;
  constructor(props: P, namespace: string, subnamespace?: string) {
    super(props);

    this.storage = new StringStorage(namespace);
    if (subnamespace) {
      this.storage = this.storage.namespace(subnamespace);
    }

    this.recovered = false;
  }
  setStateAndStore(newState: Partial<S>, namespace?: any): void {
    let internalStorage = this.storage;
    if (namespace) {
      internalStorage = this.storage.namespace(namespace + "");
    }

    let nnewState: any = newState;
    Object.keys(nnewState).forEach((key) => {
      internalStorage.save(key, JSON.stringify(nnewState[key]));
    });
    this.setState(nnewState);
  }
  getRecoverStoredState(base: Partial<S>, namespace?: any): S {
    let internalStorage = this.storage;
    if (namespace) {
      internalStorage = this.storage.namespace(namespace + "");
    }

    let baseSerialized = JSON.stringify(base);

    let result: any = base;
    Object.keys(result).forEach((key) => {
      result[key] = JSON.parse(internalStorage.recover(key)) || result[key];
    });

    this.recovered = JSON.stringify(result) !== baseSerialized;

    return result;
  }
  checkStoredAgainstThisState(base: Partial<S>, namespace?: any): void {
    let internalStorage = this.storage;
    if (namespace) {
      internalStorage = this.storage.namespace(namespace + "");
    }

    let baseSerialized = JSON.stringify(base);

    let result: any = base;
    Object.keys(result).forEach((key) => {
      result[key] = JSON.parse(internalStorage.recover(key)) || result[key];
    });

    let recovered = JSON.stringify(result) !== baseSerialized;
    if (this.recovered !== recovered) {
      this.recovered = recovered;

      this.forceUpdate();
    }
  }
  forceRecovered(newRecovered: boolean = true) {
    if (this.recovered !== newRecovered) {
      this.recovered = newRecovered;

      this.forceUpdate();
    }
  }
  setStateAndClear(newState: Partial<S>, namespace?: any): void {
    let internalStorage = this.storage;
    if (namespace) {
      internalStorage = this.storage.namespace(namespace + "");
    }

    Object.keys(newState).forEach((key) => {
      internalStorage.clear(key);
    });
    this.recovered = false;
    this.setState(newState as S);
  }
  justClear(keys: Array<string>, namespace?: any): void {
    let internalStorage = this.storage;
    if (namespace) {
      internalStorage = this.storage.namespace(namespace + "");
    }

    keys.forEach((key) => {
      internalStorage.clear(key);
    });

    let newRecovered = false;
    if (this.recovered !== newRecovered) {
      this.recovered = newRecovered;

      this.forceUpdate();
    }
  }
}
