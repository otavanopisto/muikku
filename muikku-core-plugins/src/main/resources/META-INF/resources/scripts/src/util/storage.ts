class StringStorage {
  private ns: string;

  constructor(namespace: string) {
    this.ns = namespace;
  }
  save(key: string, value: string): void {
    if (!localStorage) {
      return;
    }

    localStorage.setItem(this.ns + "." + key, value);
  }
  recover(key: string): any {
    if (!localStorage) {
      return null;
    }

    return localStorage.getItem(this.ns + "." + key);
  }
  clear(key: string): void {
    if (!localStorage) {
      return;
    }

    localStorage.removeItem(this.ns + "." + key);
  }
  namespace(namespace: string): StringStorage {
    return new StringStorage(this.ns + "." + namespace);
  }
}

export default StringStorage;
