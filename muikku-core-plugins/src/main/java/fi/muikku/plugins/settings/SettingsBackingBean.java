package fi.muikku.plugins.settings;

import java.util.List;

import javax.enterprise.context.Dependent;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.controller.UserController;
import fi.muikku.model.users.UserImpl;
import fi.muikku.widgets.WidgetSpaceSet;
import fi.muikku.widgets.WidgetSpaceSetItem;
import fi.muikku.widgets.WidgetSpaceSizingStrategy;

@Named
@Dependent
public class SettingsBackingBean {
	
	@Inject
	private UserController userController;

	public WidgetSpaceSet getContentWidgetSpaceSet() {
		return new WidgetSpaceSet(
				new WidgetSpaceSetItem(WidgetLocations.SETTINGS_CONTENT_SIDEBAR_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
				new WidgetSpaceSetItem(fi.muikku.WidgetLocations.ENVIRONMENT_CONTENT, true, WidgetSpaceSizingStrategy.MAXIMIZE)
		);
	}
	
	public List<UserImpl> getAllUsers() {
		List<UserImpl> users = userController.listAllUsers();
		return users;
	}

}

