package fi.otavanopisto.muikku.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.otavanopisto.muikku.model.widgets.LocatedWidget;
import fi.otavanopisto.muikku.model.widgets.WidgetVisibility;
import fi.otavanopisto.muikku.session.SessionController;

@Named
@RequestScoped
public class WidgetsBackingBean {

	@Inject
	private SessionController sessionController;

	@Inject
	private WidgetController widgetController;
	
	public List<LocatedWidget> getWidgets(String location) {
		List<LocatedWidget> result = new ArrayList<>();
		boolean loggedIn = sessionController.isLoggedIn();
		
		if (loggedIn) {
      result.addAll(widgetController.listWidgetSpaceUserWidgets(location, sessionController.getLoggedUserEntity()));
    }
		
    if (result.isEmpty()) {
    	if (loggedIn) {
        result.addAll(widgetController.listWidgetSpaceDefaultWidgetsByVisibilities(location, Arrays.asList(WidgetVisibility.EVERYONE, WidgetVisibility.AUTHENTICATED)));
    	} else {
        result.addAll(widgetController.listWidgetSpaceDefaultWidgetsByVisibilities(location, Arrays.asList(WidgetVisibility.EVERYONE, WidgetVisibility.UNAUTHENTICATED)));
    	}
    }
    
		// TODO PK: widget order?
		return result;
	}
	
}
