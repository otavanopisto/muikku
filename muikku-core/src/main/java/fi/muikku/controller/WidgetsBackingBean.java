package fi.muikku.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.model.widgets.LocatedWidget;
import fi.muikku.model.widgets.WidgetVisibility;
import fi.muikku.session.SessionController;

@Named
@RequestScoped
public class WidgetsBackingBean {

	@Inject
	private SessionController sessionController;

	@Inject
	private WidgetController widgetController;

	public boolean hasWidgets(String location) {
		if (sessionController.isLoggedIn()) {
			if (widgetController.hasUserWidgets(location, sessionController.getUser())) {
				return true;
			} 
		} 
			
		return widgetController.hasDefaultWidgets(location);
	}
	
	public List<LocatedWidget> getWidgets(String location) {
		List<LocatedWidget> result = new ArrayList<>();
		boolean loggedIn = sessionController.isLoggedIn();
		
		if (loggedIn) {
      result.addAll(widgetController.listLocationUserWidgets(location, sessionController.getUser()));
    }
		
    if (result.isEmpty()) {
    	if (loggedIn) {
        result.addAll(widgetController.listLocationDefaultWidgetsByVisibilities(location, Arrays.asList(WidgetVisibility.EVERYONE, WidgetVisibility.AUTHENTICATED)));
    	} else {
        result.addAll(widgetController.listLocationDefaultWidgetsByVisibilities(location, Arrays.asList(WidgetVisibility.EVERYONE, WidgetVisibility.UNAUTHENTICATED)));
    	}
    }
    
		// TODO PK: widget order?
		return result;
	}
	
}
