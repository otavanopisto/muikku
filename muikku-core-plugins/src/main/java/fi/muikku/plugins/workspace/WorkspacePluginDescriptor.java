package fi.muikku.plugins.workspace;

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
public class WorkspacePluginDescriptor implements PluginDescriptor {

	private static final String MEMBERS_NAVIGATION_WIDGET_LOCATION = WidgetLocations.WORKSPACE_DOCK_TOP_LEFT;
	private static final int MEMBERS_NAVIGATION_WIDGET_MINIMUM_SIZE = 1;
	private static final WidgetVisibility MEMBERS_NAVIGATION_WIDGET_VISIBILITY = WidgetVisibility.AUTHENTICATED;
	private static final String MEMBERS_NAVIGATION_WIDGET_NAME = "workspace-navigation-members";
	
	@Inject
	private WidgetController widgetController;
	
	@Override
	public String getName() {
		return "workspace";
	}
	
	@Override
	public void init() {
		/* Default widgets for workspace */

		widgetController.ensureDefaultWidget("content", WidgetLocations.WORKSPACE_CONTENT);
		widgetController.ensureDefaultWidget("internallogin", WidgetLocations.WORKSPACE_HEADER_RIGHT);
		
		/* Members widget */
		
		Widget membersWidget = widgetController.ensureWidget(MEMBERS_NAVIGATION_WIDGET_NAME, MEMBERS_NAVIGATION_WIDGET_MINIMUM_SIZE, MEMBERS_NAVIGATION_WIDGET_VISIBILITY);
		widgetController.ensureDefaultWidget(membersWidget, MEMBERS_NAVIGATION_WIDGET_LOCATION);
	}

	@Override
	public List<Class<?>> getBeans() {
		return Collections.unmodifiableList(Arrays.asList(new Class<?>[] { 
		  /* Backing beans */ 
				
			WorkspaceViewBackingBean.class,
			WorkspaceMaterialEditorBackingBean.class,
			WorkspaceWidgetSpacesBackingBean.class
		}));
	}

}
