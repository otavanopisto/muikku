package fi.otavanopisto.muikku.search;

import java.beans.IntrospectionException;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;

import fi.otavanopisto.muikku.search.annotations.IndexField;
import fi.otavanopisto.muikku.search.annotations.IndexId;
import fi.otavanopisto.muikku.search.annotations.IndexIgnore;
import fi.otavanopisto.muikku.search.annotations.Indexable;

@Stateless
public class IndexEntityProcessor {
  
  @Inject
  private Logger logger;

  public Map<String, Object> process(Object entity) throws IllegalArgumentException, IllegalAccessException, IntrospectionException, InvocationTargetException,
      IndexIdMissingException {

    if (isIndexable(entity)) {
      String id = getEnitityId(entity);
      if (StringUtils.isBlank(id)) {
        throw new IndexIdMissingException("Indexable object is missing an id.");
      }
      
      Map<String, Object> indexObject = new HashMap<String, Object>();
      
      indexObject.put("id", id);
      
      for (Method indexableGetter : getIndexableGetters(entity)) {
        String fieldName = StringUtils.uncapitalize(indexableGetter.getName().substring(3));
        IndexField indexField = findIndexField(indexableGetter);
        
        if (indexField != null) {
          if (indexField.skip()) {
            continue;
          }
          
          String name = indexField.name();
          if (StringUtils.isNotBlank(name)) {
            fieldName = name;
          }
        }
        
        Object fieldValue = indexableGetter.invoke(entity);
        indexObject.put(fieldName, fieldValue);
      }

      return indexObject;
    }

    return null;
  }
  
  private IndexField findIndexField(Method method) {
    IndexField indexField = method.getAnnotation(IndexField.class);
    if (indexField != null) {
      return indexField;
    }
    
    Class<?> declaringClass = method.getDeclaringClass();
    if (declaringClass != null) {
      if ((declaringClass.getSuperclass() != null) && (!declaringClass.getSuperclass().equals(Object.class))) {
        Class<?> superclass = declaringClass.getSuperclass();
        
        try {
          Method superclassMethod = superclass.getMethod(method.getName());
          indexField = superclassMethod.getAnnotation(IndexField.class);
          if (indexField != null) {
            return indexField;
          }
        } catch (NoSuchMethodException | SecurityException e) {
        }
      }
      
      for (Class<?> declaringClassInterface : declaringClass.getInterfaces()) {
        try {
          Method declaringClassInterfaceMethod = declaringClassInterface.getMethod(method.getName());
          indexField = declaringClassInterfaceMethod.getAnnotation(IndexField.class);
          if (indexField != null) {
            return indexField;
          }
        } catch (NoSuchMethodException | SecurityException e) {
        }
      }
    }
    
    return null;
  }

  private boolean isIndexable(Object entity) {
    if (entity != null) {
      return isIndexable(entity.getClass()); 
    }
    
    return false;
  }

  private boolean isIndexable(Class<?> clazz) {
    if (clazz.isAnnotationPresent(Indexable.class))  {
      return true;
    }      
    
    for (Class<?> entityInterface : clazz.getInterfaces()) {
      if (entityInterface.isAnnotationPresent(Indexable.class))  {
        return true;
      }     
    }
    
    if ((clazz.getSuperclass() != null) && (!Object.class.equals(clazz))) {
      return isIndexable(clazz.getSuperclass());
    }
    
    return false;
  }

  private String getEnitityId(Object entity) {
    Method method = getEntityIdMethod(entity);
    if (method != null) {
      try {
        return method.invoke(entity).toString();
      } catch (IllegalAccessException | IllegalArgumentException | InvocationTargetException e) {
        logger.log(Level.SEVERE, "Could not invoke Indexable IndexId getter", e);
      }
    }
    
    Field field = getEntityIdField(entity);
    if (field != null) {
      try {
        field.setAccessible(true);
        return field.get(entity).toString();
      } catch (IllegalArgumentException | IllegalAccessException e) {
        logger.log(Level.SEVERE, "Could not get Indexable IndexId field value", e);
      }
    }
    
    return null;
  }
  
  private Method getEntityIdMethod(Object entity) {
    Class<?> currentEntityClass = entity.getClass();
    
    while (currentEntityClass != null && currentEntityClass != Object.class) {
      Method method = getMethodByAnnotation(currentEntityClass, IndexId.class);
      if (method != null) {
        return method;
      }
            
      for (Class<?> currentEntityClassInterface : currentEntityClass.getInterfaces()) {
        Method interfaceMethod = getMethodByAnnotation(currentEntityClassInterface, IndexId.class);
        if (interfaceMethod != null) {
          return interfaceMethod;
        }
      }
      
      currentEntityClass = currentEntityClass.getSuperclass();
    }
    
    return null;
  }
  
  private List<Method> getIndexableGetters(Object entity) {
    List<Method> result = new ArrayList<>();
    
    Class<?> currentEntityClass = entity.getClass();
    
    while (currentEntityClass != null && currentEntityClass != Object.class) {
      for (Method method : currentEntityClass.getDeclaredMethods()) {
        if (method.isAnnotationPresent(IndexIgnore.class)) {
          continue;
        }
        
        if (method.isAnnotationPresent(IndexId.class)) {
          continue;
        }
        
        if (StringUtils.startsWith(method.getName(), "get")) {
          result.add(method);
        }
      }
            
      currentEntityClass = currentEntityClass.getSuperclass();
    }
    
    return result;
  }
  
  private Field getEntityIdField(Object entity) {
    Class<?> currentEntityClass = entity.getClass();
    while (currentEntityClass != null && currentEntityClass != Object.class) {
      Field field = getFieldByAnnotation(currentEntityClass, IndexId.class);
      if (field != null) {
        return field;
      }
      
      currentEntityClass = currentEntityClass.getSuperclass();
    }
    
    return null;
  }
  
  private Method getMethodByAnnotation(Class<?> clazz, Class<? extends Annotation> annotationClass) {
    for (Method method : clazz.getDeclaredMethods()) {
      if (method.isAnnotationPresent(annotationClass)) {
        return method;
      }
    }
    
    return null;
  }
  
  private Field getFieldByAnnotation(Class<?> clazz, Class<? extends Annotation> annotationClass) {
    for (Field field : clazz.getDeclaredFields()) {
      if (field.isAnnotationPresent(annotationClass)) {
        return field;
      }
    }
    
    return null;
  }

}
