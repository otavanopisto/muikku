package fi.muikku.controller;

import java.util.ArrayList;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.inject.Inject;

import fi.muikku.dao.widgets.DefaultWidgetDAO;
import fi.muikku.dao.widgets.UserWidgetDAO;
import fi.muikku.dao.widgets.WidgetDAO;
import fi.muikku.dao.widgets.WidgetLocationDAO;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.widgets.DefaultWidget;
import fi.muikku.model.widgets.UserWidget;
import fi.muikku.model.widgets.Widget;
import fi.muikku.model.widgets.WidgetLocation;
import fi.muikku.model.widgets.WidgetVisibility;

@Dependent
@Stateful
public class WidgetController {

  @Inject
  private WidgetDAO widgetDAO;

  @Inject
  private WidgetLocationDAO widgetLocationDAO;

  @Inject
  private UserWidgetDAO userWidgetDAO;

  @Inject
  private DefaultWidgetDAO defaultWidgetDAO;

  /* Widget */

  public Widget createWidget(String name, Integer minimumSize, WidgetVisibility visibility) {
    return widgetDAO.create(name, minimumSize, visibility);
  }

  public Widget findWidget(String name) {
    return widgetDAO.findByName(name);
  }

  public Widget ensureWidget(String name, Integer minimumSize, WidgetVisibility visibility) {
		Widget widget = findWidget(name);
		if (widget == null) {
			widget = createWidget(name, minimumSize, visibility);
		}
		
		return widget;
	}

  /* WidgetLocation */
  
  public WidgetLocation createWidgetLocation(String name) {
		return widgetLocationDAO.create(name);
	}

  public WidgetLocation findWidgetLocation(String name) {
    return widgetLocationDAO.findByName(name);
  }
  
  public WidgetLocation ensureWidgetLocation(String name) {
  	WidgetLocation widgetLocation = findWidgetLocation(name);
  	if (widgetLocation == null) {
  		widgetLocation = createWidgetLocation(name);
  	}
  	
  	return widgetLocation;
  }

  /* UserWidget */

  public UserWidget createUserWidget(Widget widget,
      WidgetLocation widgetLocation, UserEntity userEntity) {
    return userWidgetDAO.create(widget, widgetLocation, userEntity);
  }

  public UserWidget findUserWidget(Widget widget, WidgetLocation location,
      UserEntity userEntity) {
    return userWidgetDAO.findByWidgetLocationAndUser(widget, location,
        userEntity);
  }

  public UserWidget findUserWidget(Widget widget, String locationName,
      UserEntity userEntity) {
    return findUserWidget(widget, findWidgetLocation(locationName), userEntity);
  }

  public List<UserWidget> listLocationUserWidgets(WidgetLocation location,
      UserEntity userEntity) {
    return userWidgetDAO.listByLocationAndUser(location, userEntity);
  }

  public List<UserWidget> listLocationUserWidgets(String locationName, UserEntity userEntity) {
    return listLocationUserWidgets(findWidgetLocation(locationName), userEntity);
  }

  public boolean hasUserWidgets(WidgetLocation location, UserEntity user) {
    return userWidgetDAO.countByLocationAndUser(location, user) > 0;
  }
  
	public boolean hasUserWidgets(String location, UserEntity user) {
		return hasUserWidgets(findWidgetLocation(location), user);
	}


  /* DefaultWidget */

  public DefaultWidget createDefaultWidget(Widget widget, WidgetLocation widgetLocation) {
    return defaultWidgetDAO.create(widget, widgetLocation);
  }
  
  public DefaultWidget createDefaultWidget(WidgetLocation location, Widget widget) {
		return defaultWidgetDAO.create(widget, location);
	}

  public DefaultWidget findDefaultWidget(Widget widget, WidgetLocation location) {
    return defaultWidgetDAO.findByWidgetAndLocation(widget, location);
  }
  
  public List<DefaultWidget> listLocationDefaultWidgetsByVisibilities(WidgetLocation location, List<WidgetVisibility> visibilities) {
  	List<DefaultWidget> result = new ArrayList<>();
  	
  	List<DefaultWidget> defaultWidgets = defaultWidgetDAO.listByLocation(location);
  	for (DefaultWidget defaultWidget : defaultWidgets) {
  		if (visibilities.contains(defaultWidget.getWidget().getVisibility())) {
  			result.add(defaultWidget);
  		}
  	}
  	
  	return result;
  }
  
  public List<DefaultWidget> listLocationDefaultWidgetsByVisibilities(String location, List<WidgetVisibility> visibilities) {
  	return listLocationDefaultWidgetsByVisibilities(findWidgetLocation(location), visibilities);
  }
  
  public boolean hasDefaultWidgets(WidgetLocation location) {
  	return defaultWidgetDAO.countByLocation(location) > 0;
  }

	public boolean hasDefaultWidgets(String location) {
		return hasDefaultWidgets(findWidgetLocation(location));
	}

	public void ensureDefaultWidget(Widget widget, String location) {
		WidgetLocation widgetLocation = findWidgetLocation(location);
		if (widgetLocation == null) {
			widgetLocation = createWidgetLocation(location);
		}
		
		DefaultWidget defaultWidget = findDefaultWidget(widget, widgetLocation);
		if (defaultWidget == null) {
			defaultWidget = createDefaultWidget(widgetLocation, widget);
		}
	}
	
	public void ensureDefaultWidget(String widgetName, String location) {
		Widget widget = findWidget(widgetName);
		if (widget != null) {
		  ensureDefaultWidget(widget, location);
		}
	}
	
	public void ensureDefaultWidget(String widgetName, WidgetLocation widgetLocation) {
		Widget widget = findWidget(widgetName);
		if (widget != null) {
  		DefaultWidget defaultWidget = findDefaultWidget(widget, widgetLocation);
  		if (defaultWidget == null) {
  			defaultWidget = createDefaultWidget(widgetLocation, widget);
  		}
		}
	}
	
	
}
