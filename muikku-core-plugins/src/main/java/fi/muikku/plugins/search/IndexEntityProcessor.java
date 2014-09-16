package fi.muikku.plugins.search;

import java.beans.IntrospectionException;
import java.beans.PropertyDescriptor;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;

import javax.ejb.Stateless;

import fi.muikku.plugins.search.annotations.IndexId;
import fi.muikku.plugins.search.annotations.IndexIgnore;
import fi.muikku.plugins.search.annotations.IndexField;
import fi.muikku.plugins.search.annotations.Indexable;

@Stateless
public class IndexEntityProcessor {

  public Map<String, Object> process(Object entity) throws IllegalArgumentException, IllegalAccessException, IntrospectionException, InvocationTargetException, IndexIdMissingException {

    if (entity.getClass().isAnnotationPresent(Indexable.class)) {
      Map<String, Object> indexObject = new HashMap<String, Object>();
      Class<?> currentEntityClass = entity.getClass();
      boolean hasId = false;
      while (currentEntityClass != null && currentEntityClass != Object.class) {
        for (Field field : currentEntityClass.getDeclaredFields()) {
          if (!field.isAnnotationPresent(IndexIgnore.class)) {
            String fieldName = field.getName();
            if (field.isAnnotationPresent(IndexField.class)) {
              IndexField indexName = field.getAnnotation(IndexField.class);
              fieldName = indexName.Name();
              if(fieldName == ""){
                fieldName = field.getName();
              }
            }
            if(field.isAnnotationPresent(IndexId.class)) {
              hasId = true;
              fieldName = "id";
            }
            /*PropertyDescriptor fieldPropertyDescriptor = new PropertyDescriptor(field.getName(), currentEntityClass);*/
            Object fieldValue;
            /*if (fieldPropertyDescriptor.getReadMethod() != null) {
              fieldValue = fieldPropertyDescriptor.getReadMethod().invoke(entity);
            } else {*/
              field.setAccessible(true);
              fieldValue = field.get(entity);
            //}
            indexObject.put(fieldName, fieldValue);
          }
        }
        currentEntityClass = currentEntityClass.getSuperclass();
      }
      if(!hasId){
        throw new IndexIdMissingException("Indexable object is missing an id."); 
      }
      return indexObject;
    }

    return null;
  }

}
