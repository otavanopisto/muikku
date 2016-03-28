package fi.otavanopisto.muikku.debug;

public class CDIDebugRecord {

  public CDIDebugRecord(Class<?> beanClass, Integer allocated) {
    this.beanClass = beanClass;
    this.allocated = allocated;
  }
  
  public Class<?> getBeanClass() {
    return beanClass;
  }
  
  public Integer getAllocations() {
    return allocated;
  }
  
  public void addAllocation() {
    allocated++;
  }
  
  public void removeAllocation() {
    allocated--; 
  }
  
  private Class<?> beanClass;
  private Integer allocated;
}
