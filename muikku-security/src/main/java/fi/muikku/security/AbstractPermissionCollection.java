package fi.muikku.security;

import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.List;

public class AbstractPermissionCollection {

  protected List<String> listPermissions(Class<?> collectionClass) {
    List<String> permissions = new ArrayList<String>();
    Field[] declaredFields = collectionClass.getDeclaredFields();

    for (Field field : declaredFields) {
      if (Modifier.isStatic(field.getModifiers())) {
        if (field.getType().equals(String.class) && (field.getAnnotation(Scope.class) != null)) {
          try {
            permissions.add(field.getName());
          } catch (Exception e) {
            e.printStackTrace();
          }
        }
      }
    }
    
    return permissions;
  }

  protected String getPermissionScope(Class<?> collectionClass, String permission) throws NoSuchFieldException {
    Scope scopeAnnotation = collectionClass.getField(permission).getAnnotation(Scope.class);

    if (scopeAnnotation != null)
      return scopeAnnotation.value();
    else
      return null;
  }
  
}
