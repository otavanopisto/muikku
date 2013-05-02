package fi.muikku.tranquil;

import java.lang.reflect.Type;
import java.util.Set;

import javax.enterprise.context.spi.CreationalContext;
import javax.enterprise.inject.spi.Bean;
import javax.enterprise.inject.spi.BeanManager;

import org.apache.deltaspike.core.api.provider.BeanManagerProvider;

import fi.tranquil.TranquilEntityResolver;

public abstract class AbstractTranquilEntityResolver extends BeanManagerProvider implements TranquilEntityResolver {
  
  protected Object getManagedBean(Type beanType) {
    BeanManager beanManager = getBeanManager();
    Set<Bean<?>> beans = beanManager.getBeans(beanType);
    Bean<?> bean = beans.iterator().next();
    CreationalContext<?> creationalContext = beanManager.createCreationalContext(bean);
    return beanManager.getReference(bean, beanType, creationalContext);
  }
  
}
