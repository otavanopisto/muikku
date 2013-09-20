package fi.muikku.facelets;

import java.util.Set;

import javax.enterprise.context.spi.CreationalContext;
import javax.enterprise.inject.spi.Bean;
import javax.enterprise.inject.spi.BeanManager;
import javax.faces.view.facelets.TagConfig;
import javax.faces.view.facelets.TagHandler;

import org.apache.deltaspike.core.api.provider.BeanManagerProvider;

import fi.muikku.controller.WidgetController;
import fi.muikku.session.SessionController;

public abstract class AbstractWidgetTagHandler extends TagHandler {

	public AbstractWidgetTagHandler(TagConfig config) {
		super(config);
	}

	protected WidgetController getWidgetController() {
		return getManagedBean(WidgetController.class);
	}
	
	protected SessionController getSessionController() {
		return getManagedBean(SessionController.class);
	}
	
	@SuppressWarnings("unchecked")
	private <T> T getManagedBean(Class<T> type) {
		BeanManager beanManager = BeanManagerProvider.getInstance().getBeanManager();
		Set<Bean<?>> beans = beanManager.getBeans(type);
    Bean<?> bean = beans.iterator().next();
    CreationalContext<?> creationalContext = beanManager.createCreationalContext(bean);
    return (T) beanManager.getReference(bean, type, creationalContext);
	}
}
