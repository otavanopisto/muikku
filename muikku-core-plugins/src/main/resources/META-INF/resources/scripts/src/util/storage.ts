/**
 * StringStorage
 */
class StringStorage {
  private ns: string;

  /**
   * constructor
   * @param namespace namespace
   */
  constructor(namespace: string) {
    this.ns = namespace;
  }

  /**
   * save
   * @param key key
   * @param value value
   */
  save(key: string, value: string): void {
    if (!localStorage) {
      return;
    }

    localStorage.setItem(this.ns + "." + key, value);
  }

  /**
   * recover
   * @param key key
   */
  recover(key: string): any {
    if (!localStorage) {
      return null;
    }

    return localStorage.getItem(this.ns + "." + key);
  }

  /**
   * clear
   * @param key key
   */
  clear(key: string): void {
    if (!localStorage) {
      return;
    }

    localStorage.removeItem(this.ns + "." + key);
  }

  /**
   * namespace
   * @param namespace namespace
   */
  namespace(namespace: string): StringStorage {
    return new StringStorage(this.ns + "." + namespace);
  }
}

export default StringStorage;
