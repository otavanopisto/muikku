package fi.otavanopisto.muikku.search;

import javax.enterprise.event.Observes;
import javax.enterprise.inject.spi.AnnotatedType;
import javax.enterprise.inject.spi.Extension;
import javax.enterprise.inject.spi.ProcessAnnotatedType;

import fi.otavanopisto.muikku.search.annotations.Indexable;

public class SearchConfiguratorCDIExtension implements Extension {
  
  public <T> void processAnnotatedType(@Observes ProcessAnnotatedType<T> processAnnotatedType) {
    AnnotatedType<T> annotatedType = processAnnotatedType.getAnnotatedType();
    Indexable indexable = annotatedType.getAnnotation(Indexable.class);
    if (indexable != null) {
      IndexableEntityVault.addEntity(indexable);
    }
  }
  
}

