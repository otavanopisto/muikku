package fi.otavanopisto.muikku.dao;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.PreDestroy;
import javax.enterprise.context.RequestScoped;

@RequestScoped
public class MuikkuInjectionMonitor {

  @PreDestroy
  public void preDestroy() {
    System.out.println("==== Conversation start ====");
    for (String key : num.keySet()) {
      System.out.println(String.format("%s %d", key, num.get(key)));
    }
    System.out.println("==== Conversation end ====");
  }
  
  public void add(String key) {
    Long val = 1L;
    if (num.containsKey(key)) {
      val = num.get(key) + 1;
    } 
    num.put(key, val);
  }
  
  public void add(String classz, String from) {
    String key = String.format("%s -> %s", from, classz);
    add(key);
  }
  
  private Map<String, Long> num = new HashMap<>();
}
