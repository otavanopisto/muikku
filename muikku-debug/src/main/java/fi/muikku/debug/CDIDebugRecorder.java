package fi.muikku.debug;

import java.lang.annotation.Annotation;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.enterprise.inject.spi.BeanManager;
import javax.inject.Qualifier;
import javax.naming.InitialContext;
import javax.naming.NamingException;

public class CDIDebugRecorder {
  
  public CDIDebugRecorder() {
    records = new HashMap<>();
  }

  public synchronized void recordConstruct(Class<?> beanClass) {
    if (beanClass.getName().contains("$Proxy$_$$_WeldSubclass")) {
      beanClass = beanClass.getSuperclass();
    }
    
    CDIDebugRecord sample = records.get(beanClass.getName());
    
    if (sample == null) {
      records.put(beanClass.getName(), new CDIDebugRecord(beanClass, 1));
    } else {
      sample.addAllocation();
    }
  }

  public synchronized void recordDestroy(Class<?> beanClass) {
    if (beanClass.getName().contains("$Proxy$_$$_WeldSubclass")) {
      beanClass = beanClass.getSuperclass();
    }

    records.get(beanClass.getName()).removeAllocation();
  }
  
  public synchronized void dumpRecords(int allocationThreshold) {
    if (!records.isEmpty()) {
      Logger.getLogger(CDIDebugRecorder.class.getName()).log(Level.FINEST, String.format("Dumping beans allocated over %d times", allocationThreshold));
        
      for (String className : records.keySet()) {
        CDIDebugRecord sample = records.get(className);
        if (sample.getAllocations() >= allocationThreshold) {
          Logger.getLogger(CDIDebugRecorder.class.getName()).log(Level.FINEST, String.format("  Bean %s allocated %d times", sample.getBeanClass().getName(), sample.getAllocations()));
        }
        
      }
    }
  }
  
  public synchronized int getAllocationCount(Class<?> beanClass) {
    if (beanClass.getName().contains("$Proxy$_$$_WeldSubclass")) {
      beanClass = beanClass.getSuperclass();
    }

    CDIDebugRecord record = records.get(beanClass.getName());
    if (record != null) {
      return record.getAllocations();
    }
    
    return 0;
  }

  @SuppressWarnings("unused")
  private Annotation[] getQualifiers(Class<?> beanClass) {
    List<Annotation> result = new ArrayList<>();
    
    for (Annotation annotation : beanClass.getAnnotations()) {
      if (annotation.annotationType().isAnnotationPresent(Qualifier.class)) {
        result.add(annotation);
      }
    }
    
    return result.toArray(new Annotation[0]);
  }

  @SuppressWarnings("unused")
  private BeanManager getBeanManager() {
    try {
      return (BeanManager) new InitialContext().lookup("java:comp/BeanManager");
    } catch (NamingException e) {
      return null;
    }
  }

  private Map<String, CDIDebugRecord> records;
}
