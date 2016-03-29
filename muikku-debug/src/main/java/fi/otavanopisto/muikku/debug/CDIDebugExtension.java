package fi.otavanopisto.muikku.debug;

import java.lang.annotation.Annotation;
import java.lang.reflect.Modifier;

import javax.enterprise.event.Observes;
import javax.enterprise.inject.spi.AnnotatedType;
import javax.enterprise.inject.spi.Extension;
import javax.enterprise.inject.spi.ProcessAnnotatedType;

public class CDIDebugExtension implements Extension {
  
  public <T> void processAnnotatedType(
      @Observes ProcessAnnotatedType<T> processAnnotatedType) {

    AnnotatedType<T> annotatedType = processAnnotatedType
        .getAnnotatedType();
    
    if (Modifier.isPublic(annotatedType.getJavaClass().getModifiers()) && !Modifier.isStatic(annotatedType.getJavaClass().getModifiers()) && !Modifier.isAbstract(annotatedType.getJavaClass().getModifiers())) {
    
      Annotation debugAnnotation = new Annotation() {
        @Override
        public Class<? extends Annotation> annotationType() {
          return CDIDebug.class;
        }
      };
        
      AnnotatedTypeWrapper<T> wrapper = new AnnotatedTypeWrapper<T>(
          annotatedType, annotatedType.getAnnotations());
      wrapper.addAnnotation(debugAnnotation);
  
      processAnnotatedType.setAnnotatedType(wrapper);
    }
  }
  
}