package fi.muikku.controller;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import fi.muikku.dao.widgets.DefaultWidgetDAO;
import fi.muikku.dao.widgets.UserWidgetDAO;
import fi.muikku.dao.widgets.WidgetDAO;
import fi.muikku.dao.widgets.WidgetSpaceDAO;
import fi.muikku.model.users.UserEntity;
import fi.muikku.model.widgets.DefaultWidget;
import fi.muikku.model.widgets.UserWidget;
import fi.muikku.model.widgets.Widget;
import fi.muikku.model.widgets.WidgetSpace;
import fi.muikku.model.widgets.WidgetVisibility;

public class WidgetController {

  @Inject
  private WidgetDAO widgetDAO;

  @Inject
  private WidgetSpaceDAO widgetSpaceDAO;

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

  /* WidgetSpace */
  
  public WidgetSpace createWidgetSpace(String name) {
		return widgetSpaceDAO.create(name);
	}

  public WidgetSpace findWidgetSpace(String name) {
    return widgetSpaceDAO.findByName(name);
  }
  
  public WidgetSpace ensureWidgetSpace(String name) {
  	WidgetSpace widgetSpace = findWidgetSpace(name);
  	if (widgetSpace == null) {
  		widgetSpace = createWidgetSpace(name);
  	}
  	
  	return widgetSpace;
  }

  /* UserWidget */

  public UserWidget createUserWidget(Widget widget,
      WidgetSpace widgetSpace, UserEntity userEntity) {
    return userWidgetDAO.create(widget, widgetSpace, userEntity);
  }

  public UserWidget findUserWidget(Widget widget, WidgetSpace widgetSpace, UserEntity userEntity) {
    return userWidgetDAO.findByWidgetSpaceAndUser(widget, widgetSpace, userEntity);
  }

  public UserWidget findUserWidget(Widget widget, String widgetSpaceName, UserEntity userEntity) {
    return findUserWidget(widget, findWidgetSpace(widgetSpaceName), userEntity);
  }

  public List<UserWidget> listWidgetSpaceUserWidgets(WidgetSpace widgetSpace, UserEntity userEntity) {
    return userWidgetDAO.listByWidgetSpaceAndUser(widgetSpace, userEntity);
  }

  public List<UserWidget> listWidgetSpaceUserWidgets(String widgetSpaceName, UserEntity userEntity) {
    return listWidgetSpaceUserWidgets(findWidgetSpace(widgetSpaceName), userEntity);
  }

  public boolean hasUserWidgets(WidgetSpace widgetSpace, UserEntity user) {
    return userWidgetDAO.countByWidgetSpaceAndUser(widgetSpace, user) > 0;
  }
  
	public boolean hasUserWidgets(String widgetSpaceName, UserEntity user) {
		return hasUserWidgets(findWidgetSpace(widgetSpaceName), user);
	}


  /* DefaultWidget */

  public DefaultWidget createDefaultWidget(Widget widget, WidgetSpace widgetSpace) {
    return defaultWidgetDAO.create(widget, widgetSpace);
  }
  
  public DefaultWidget createDefaultWidget(WidgetSpace widgetSpace, Widget widget) {
		return defaultWidgetDAO.create(widget, widgetSpace);
	}

  public DefaultWidget findDefaultWidget(Widget widget, WidgetSpace widgetSpace) {
    return defaultWidgetDAO.findByWidgetAndWidgetSpace(widget, widgetSpace);
  }
  
  public List<DefaultWidget> listWidgetSpaceDefaultWidgetsByVisibilities(WidgetSpace widgetSpace, List<WidgetVisibility> visibilities) {
  	List<DefaultWidget> result = new ArrayList<>();
  	
  	List<DefaultWidget> defaultWidgets = defaultWidgetDAO.listByWidgetSpace(widgetSpace);
  	for (DefaultWidget defaultWidget : defaultWidgets) {
  		if (visibilities.contains(defaultWidget.getWidget().getVisibility())) {
  			result.add(defaultWidget);
  		}
  	}
  	
  	return result;
  }
  
  public List<DefaultWidget> listWidgetSpaceDefaultWidgetsByVisibilities(String widgetSpaceName, List<WidgetVisibility> visibilities) {
  	return listWidgetSpaceDefaultWidgetsByVisibilities(findWidgetSpace(widgetSpaceName), visibilities);
  }
  
  public boolean hasDefaultWidgets(WidgetSpace widgetSpace) {
  	return defaultWidgetDAO.countByWidgetSpace(widgetSpace) > 0;
  }

	public boolean hasDefaultWidgets(String widgetSpaceName) {
		return hasDefaultWidgets(findWidgetSpace(widgetSpaceName));
	}

	public void ensureDefaultWidget(Widget widget, String widgetSpaceName) {
		WidgetSpace widgetSpace = findWidgetSpace(widgetSpaceName);
		if (widgetSpace == null) {
			widgetSpace = createWidgetSpace(widgetSpaceName);
		}
		
		DefaultWidget defaultWidget = findDefaultWidget(widget, widgetSpace);
		if (defaultWidget == null) {
			defaultWidget = createDefaultWidget(widgetSpace, widget);
		}
	}
	
	public void ensureDefaultWidget(String widgetName, String widgetSpaceName) {
		Widget widget = findWidget(widgetName);
		if (widget != null) {
		  ensureDefaultWidget(widget, widgetSpaceName);
		}
	}
	
	public void ensureDefaultWidget(String widgetName, WidgetSpace widgetSpace) {
		Widget widget = findWidget(widgetName);
		if (widget != null) {
  		DefaultWidget defaultWidget = findDefaultWidget(widget, widgetSpace);
  		if (defaultWidget == null) {
  			defaultWidget = createDefaultWidget(widgetSpace, widget);
  		}
		}
	}
	
	
}
