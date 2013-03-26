package fi.muikku.schooldata;

import java.lang.annotation.Annotation;
import java.lang.reflect.ParameterizedType;
import java.util.ServiceLoader;

import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.muikku.model.base.SchoolDataSource;
import fi.muikku.model.util.SchoolDataEntity;

public abstract class SchoolDataController<T> {

  @Inject
  @Any 
  private Instance<T> schoolDataControllerSource;
  
  protected T getSchoolDataController(SchoolDataEntity schoolDataEntity) {
    return getSchoolDataController(schoolDataEntity.getDataSource());
  }
  
  protected T getSchoolDataController(SchoolDataSource dataSource) {
    ServiceLoader<SchoolDataBridgeDescriptor> ldr = ServiceLoader.load(SchoolDataBridgeDescriptor.class);
    
    for (SchoolDataBridgeDescriptor descriptor : ldr) {
      if (descriptor.getIdentifier().equals(dataSource.getIdentifier())) {
        Annotation qualifier = descriptor.getQualifier();

        Instance<T> instance = schoolDataControllerSource.select(getGenericTypeClass(), qualifier);

        return instance.get();
      }
    }

    return null;
  }

  @SuppressWarnings("unchecked")
  private Class<T> getGenericTypeClass() {
    ParameterizedType parameterizedType = (ParameterizedType) getClass().getGenericSuperclass();
    return (Class<T>) parameterizedType.getActualTypeArguments()[0];
  }
  
}
