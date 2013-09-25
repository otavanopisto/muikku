package fi.muikku;

import javax.inject.Named;

import fi.muikku.widgets.WidgetSpaceSizingStrategy;
import fi.muikku.widgets.WidgetSpaceSet;
import fi.muikku.widgets.WidgetSpaceSetItem;

@Named
public class WidgetSpaceBackingBean {

	public WidgetSpaceSet getPluginSettingsContentSet() {
	  return new WidgetSpaceSet(
	    new WidgetSpaceSetItem(WidgetLocations.SETTINGS_CONTENT_SIDEBAR_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
	    new WidgetSpaceSetItem(WidgetLocations.PLUGIN_SETTINGS_CONTENT_SIDEBAR_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
	    new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_CONTENT, true, WidgetSpaceSizingStrategy.MAXIMIZE)
	  );
	}
}
