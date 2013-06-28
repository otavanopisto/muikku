package fi.muikku.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.enterprise.context.RequestScoped;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.model.widgets.LocatedWidget;
import fi.muikku.model.widgets.WidgetVisibility;
import fi.muikku.session.SessionController;
import fi.muikku.widgets.WidgetSpaceSet;
import fi.muikku.widgets.WidgetSpaceSetItem;
import fi.muikku.widgets.WidgetSpaceSizingStrategy;

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
	
	public int getWidgetSpaceSize(WidgetSpaceSet widgetSpaceSet, WidgetSpaceSetItem widgetSpaceSetItem) {
		Integer size = getCalculatedWidgetSpaceSize(widgetSpaceSetItem.getName());
		if (size != null) {
			return size;
		} else {
			switch (widgetSpaceSetItem.getSizingStrategy()) {
				case MAXIMIZE:
					size = calculateWidgetSpaceMaximumSize(widgetSpaceSet, widgetSpaceSetItem);
				break;
				case MINIMIZE:
					size = calculateWidgetSpaceMinimumSize(widgetSpaceSetItem);
				break;
				case SUM:
					size = calculateWidgetSpaceSummedSize(widgetSpaceSetItem);
				break;
			}
			
			storeCalculatedWidgetSpaceSize(widgetSpaceSetItem.getName(), size);
		}

		return size;
	}
	
	private Integer calculateWidgetSpaceMinimumSize(WidgetSpaceSetItem widgetSpaceSetItem) {
		Integer size = 0;
		
		List<LocatedWidget> widgetSpaceWidgets = getWidgets(widgetSpaceSetItem.getName());
		for (LocatedWidget locatedWidget : widgetSpaceWidgets) {
			Integer minimumSize = locatedWidget.getWidget().getMinimumSize();
			if (minimumSize > size) {
				size = minimumSize;
			}
		}
		
		return size;
	}
	
	private Integer calculateWidgetSpaceSummedSize(WidgetSpaceSetItem widgetSpaceSetItem) {
		Integer size = 0;
		
		List<LocatedWidget> widgetSpaceWidgets = getWidgets(widgetSpaceSetItem.getName());
		for (LocatedWidget locatedWidget : widgetSpaceWidgets) {
			size += locatedWidget.getWidget().getMinimumSize();
		}
		
		return size;
	}

	private Integer calculateWidgetSpaceMaximumSize(WidgetSpaceSet widgetSpaceSet, WidgetSpaceSetItem widgetSpaceSetItem) {
		Integer spaceLeft = 24;
		
		for (WidgetSpaceSetItem item : widgetSpaceSet.getItems()) {
			if (!item.getName().equals(widgetSpaceSetItem.getName())) {
				if (item.getSizingStrategy() == WidgetSpaceSizingStrategy.MAXIMIZE) {
					throw new RuntimeException("Widget space sets do not support multiple maximized widget spaces yet.");
				}
				
				spaceLeft -= getWidgetSpaceSize(widgetSpaceSet, item);
			}
		}
		
		return spaceLeft;
	}

	private Integer getCalculatedWidgetSpaceSize(String name) {
		if (widgetSpaceSize != null) {
			return widgetSpaceSize.get(name);
		}
		
		return null;
	}
	
	private void storeCalculatedWidgetSpaceSize(String name, Integer size) {
		if (widgetSpaceSize == null) {
			widgetSpaceSize = new HashMap<>();
		}
		
		widgetSpaceSize.put(name, size);
	}
	
	private Map<String, Integer> widgetSpaceSize;
}
