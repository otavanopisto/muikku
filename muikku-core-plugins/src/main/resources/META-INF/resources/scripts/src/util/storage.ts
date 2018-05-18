class StringStorage {
  constructor(){
    
  }
  save(key: string, value: string){
    if (!localStorage){
      return;
    }
    
    localStorage.setItem(key, value);
  }
  recover(key: string){
    if (!localStorage){
      return "";
    }
    
    return localStorage.getItem(key) || "";
  }
  clear(key: string){
    if (!localStorage){
      return;
    }
    
    localStorage.removeItem(key);
  }
}