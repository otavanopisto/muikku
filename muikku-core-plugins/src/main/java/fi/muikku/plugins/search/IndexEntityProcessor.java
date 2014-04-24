package fi.muikku.plugins.search;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

import javax.ejb.Stateless;

import fi.muikku.plugins.search.annotations.IndexIgnore;
import fi.muikku.plugins.search.annotations.IndexName;
import fi.muikku.plugins.search.annotations.Indexable;

@Stateless
public class IndexEntityProcessor {

  public Map<String, Object> process(Object entity) throws IllegalArgumentException, IllegalAccessException {

    if (entity.getClass().isAnnotationPresent(Indexable.class)) {
      Map<String, Object> indexObject = new HashMap<String, Object>();
      Class<?> i = entity.getClass();
      while (i != null && i != Object.class) {
        for (Field field : i.getDeclaredFields()) {
          if (!field.isAnnotationPresent(IndexIgnore.class)) {
            field.setAccessible(true);
            if (field.isAnnotationPresent(IndexName.class)) {
              Annotation a = field.getAnnotation(IndexName.class);
              IndexName indexName = (IndexName) a;
              indexObject.put(indexName.fieldName(), field.get(entity));
            } else {
              indexObject.put(field.getName(), field.get(entity));
            }
          }
        }
        i = i.getSuperclass();
      }
      return indexObject;
    }

    return null;
  }

}
