package fi.muikku.plugins.grading;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import fi.muikku.controller.WidgetController;
import fi.muikku.model.widgets.Widget;
import fi.muikku.model.widgets.WidgetVisibility;
import fi.muikku.plugin.PluginDescriptor;

@ApplicationScoped
@Stateful
public class GradingPluginDescriptor implements PluginDescriptor {

  private static final String STUDENT_GRADING_DOCK_WIDGET = "dockstudentgrading";
  private static final int STUDENT_GRADING_DOCK_WIDGET_MINIMUM_SIZE = 1;
  private static final WidgetVisibility STUDENT_GRADING_DOCK_WIDGET_VISIBILITY = WidgetVisibility.AUTHENTICATED;
	private static final String STUDENT_GRADING_DOCK_WIDGET_LOCATION = fi.muikku.WidgetLocations.ENVIRONMENT_DOCK_TOP_CENTER;

  @Inject
  private WidgetController widgetController;

  @Override
  public String getName() {
    return "grading";
  }

  @Override
  public void init() {
  	Widget studentGradingDockWidget = widgetController.ensureWidget(STUDENT_GRADING_DOCK_WIDGET, STUDENT_GRADING_DOCK_WIDGET_MINIMUM_SIZE, STUDENT_GRADING_DOCK_WIDGET_VISIBILITY);
  	widgetController.ensureDefaultWidget(studentGradingDockWidget, STUDENT_GRADING_DOCK_WIDGET_LOCATION);
  }

  @Override
  public List<Class<?>> getBeans() {
  	return Collections.unmodifiableList(Arrays.asList(new Class<?>[] { 
		  /* Backing beans */ 
				
  			StudentGradingViewBackingBean.class
		}));
  }

}
