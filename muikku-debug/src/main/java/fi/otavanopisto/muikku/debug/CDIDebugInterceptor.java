package fi.otavanopisto.muikku.debug;

import java.io.Serializable;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.interceptor.Interceptor;
import javax.interceptor.InvocationContext;

@Interceptor
@CDIDebug
public class CDIDebugInterceptor implements Serializable {
  
  private static final long serialVersionUID = -8455795437241618598L;
  private static final int THRESHOLD = 30; 

  private static CDIDebugRecorder cdiDebugCollector = new CDIDebugRecorder();

  @PostConstruct
  public void postConstruct(InvocationContext ctx) {
    Object target = ctx.getTarget();
    cdiDebugCollector.recordConstruct(target.getClass());
  }
  
  @PreDestroy
  public void preDestroy(InvocationContext ctx) {
    cdiDebugCollector.recordDestroy(ctx.getTarget().getClass());
    cdiDebugCollector.dumpRecords(THRESHOLD);
  }
  
}
