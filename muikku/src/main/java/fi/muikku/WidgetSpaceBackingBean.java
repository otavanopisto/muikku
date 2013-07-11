package fi.muikku;

import javax.inject.Named;

import fi.muikku.widgets.WidgetSpaceSizingStrategy;
import fi.muikku.widgets.WidgetSpaceSet;
import fi.muikku.widgets.WidgetSpaceSetItem;

@Named
public class WidgetSpaceBackingBean {

	public String getEnvironmentHeaderLeft() {
		return WidgetLocations.ENVIRONMENT_HEADER_LEFT;
	}

	public String getEnvironmentHeaderCenter() {
		return WidgetLocations.ENVIRONMENT_HEADER_CENTER;
	}

	public String getEnvironmentHeaderRight() {
		return WidgetLocations.ENVIRONMENT_HEADER_RIGHT;
	}
	
	public WidgetSpaceSet getEnvironmentHeaderSet() {
		return new WidgetSpaceSet(
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_HEADER_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_HEADER_CENTER, true, WidgetSpaceSizingStrategy.MAXIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_HEADER_RIGHT, false, WidgetSpaceSizingStrategy.MINIMIZE)
		);
	}

	public String getEnvironmentDockTopLeft() {
		return WidgetLocations.ENVIRONMENT_DOCK_TOP_LEFT;
	}

	public String getEnvironmentDockTopCenter() {
		return WidgetLocations.ENVIRONMENT_DOCK_TOP_CENTER;
	}

	public String getEnvironmentDockTopRight() {
		return WidgetLocations.ENVIRONMENT_DOCK_TOP_RIGHT;
	}
	
	public WidgetSpaceSet getEnvironmentDockTopSet() {
		return new WidgetSpaceSet(
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_DOCK_TOP_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_DOCK_TOP_CENTER, true, WidgetSpaceSizingStrategy.MAXIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_DOCK_TOP_RIGHT, false, WidgetSpaceSizingStrategy.MINIMIZE)
		);
	}

	public String getEnvironmentContent() {
		return WidgetLocations.ENVIRONMENT_CONTENT;
	}

	public String getEnvironmentContentSidebarLeft() {
		return WidgetLocations.ENVIRONMENT_CONTENT_SIDEBAR_LEFT;
	}

	public String getEnvironmentContentSidebarRight() {
		return WidgetLocations.ENVIRONMENT_CONTENT_SIDEBAR_RIGHT;
	}
	
	public WidgetSpaceSet getEnvironmentContentSet() {
		return new WidgetSpaceSet(
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_CONTENT_SIDEBAR_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_CONTENT, true, WidgetSpaceSizingStrategy.MAXIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_CONTENT_SIDEBAR_RIGHT, false, WidgetSpaceSizingStrategy.MINIMIZE)
		);
	}

	public String getEnvironmentContentToolsTopLeft() {
		return WidgetLocations.ENVIRONMENT_CONTENT_TOOLS_TOP_LEFT;
	}

	public String getEnvironmentContentToolsTopCenter() {
		return WidgetLocations.ENVIRONMENT_CONTENT_TOOLS_TOP_CENTER;
	}

	public String getEnvironmentContentToolsTopRight() {
		return WidgetLocations.ENVIRONMENT_CONTENT_TOOLS_TOP_RIGHT;
	}
	
	public WidgetSpaceSet getEnvironmentContentToolsTopSet() {
		return new WidgetSpaceSet(
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_CONTENT_TOOLS_TOP_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_CONTENT_TOOLS_TOP_CENTER, true, WidgetSpaceSizingStrategy.MAXIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_CONTENT_TOOLS_TOP_RIGHT, false, WidgetSpaceSizingStrategy.MINIMIZE)
		);
	}

	public String getEnvironmentContentToolsBottomLeft() {
		return WidgetLocations.ENVIRONMENT_CONTENT_TOOLS_BOTTOM_LEFT;
	}

	public String getEnvironmentContentToolsBottomCenter() {
		return WidgetLocations.ENVIRONMENT_CONTENT_TOOLS_BOTTOM_CENTER;
	}

	public String getEnvironmentContentToolsBottomRight() {
		return WidgetLocations.ENVIRONMENT_CONTENT_TOOLS_BOTTOM_RIGHT;
	}
	
	public WidgetSpaceSet getEnvironmentContentToolsBottomSet() {
		return new WidgetSpaceSet(
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_CONTENT_TOOLS_BOTTOM_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_CONTENT_TOOLS_BOTTOM_CENTER, true, WidgetSpaceSizingStrategy.MAXIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_CONTENT_TOOLS_BOTTOM_RIGHT, false, WidgetSpaceSizingStrategy.MINIMIZE)
		);
	}

	public String getEnvironmentDockBottomLeft() {
		return WidgetLocations.ENVIRONMENT_DOCK_BOTTOM_LEFT;
	}

	public String getEnvironmentDockBottomCenter() {
		return WidgetLocations.ENVIRONMENT_DOCK_BOTTOM_CENTER;
	}

	public String getEnvironmentDockBottomRight() {
		return WidgetLocations.ENVIRONMENT_DOCK_BOTTOM_RIGHT;
	}
	
	public WidgetSpaceSet getEnvironmentDockBottomSet() {
		return new WidgetSpaceSet(
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_DOCK_BOTTOM_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_DOCK_BOTTOM_CENTER, true, WidgetSpaceSizingStrategy.MAXIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_DOCK_BOTTOM_RIGHT, false, WidgetSpaceSizingStrategy.MINIMIZE)
		);
	}

	public String getEnvironmentFooterLeft() {
		return WidgetLocations.ENVIRONMENT_FOOTER_LEFT;
	}

	public String getEnvironmentFooterCenter() {
		return WidgetLocations.ENVIRONMENT_FOOTER_CENTER;
	}

	public String getEnvironmentFooterRight() {
		return WidgetLocations.ENVIRONMENT_FOOTER_RIGHT;
	}
	
	public WidgetSpaceSet getEnvironmentFooterSet() {
		return new WidgetSpaceSet(
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_FOOTER_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_FOOTER_CENTER, true, WidgetSpaceSizingStrategy.MAXIMIZE),
				new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_FOOTER_RIGHT, false, WidgetSpaceSizingStrategy.MINIMIZE)
		);
	}
	
	public WidgetSpaceSet getPluginSettingsContentSet() {
	  return new WidgetSpaceSet(
	    new WidgetSpaceSetItem(WidgetLocations.SETTINGS_CONTENT_SIDEBAR_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
	    new WidgetSpaceSetItem(WidgetLocations.PLUGIN_SETTINGS_CONTENT_SIDEBAR_LEFT, false, WidgetSpaceSizingStrategy.MINIMIZE),
	    new WidgetSpaceSetItem(WidgetLocations.ENVIRONMENT_CONTENT, true, WidgetSpaceSizingStrategy.MAXIMIZE)
	  );
	}
}
