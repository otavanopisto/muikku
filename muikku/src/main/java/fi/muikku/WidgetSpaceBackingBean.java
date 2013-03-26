package fi.muikku;

import javax.inject.Named;

@Named
public class WidgetSpaceBackingBean {

	public String getEnvironmentHeader() {
		return WidgetLocations.ENVIRONMENT_HEADER;
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

	public String getEnvironmentContentToolsBottom() {
		return WidgetLocations.ENVIRONMENT_CONTENT_TOOLS_BOTTOM;
	}

	public String getEnvironmentContentToolsTop() {
		return WidgetLocations.ENVIRONMENT_CONTENT_TOOLS_TOP;
	}

	public String getEnvironmentDockBottom() {
		return WidgetLocations.ENVIRONMENT_DOCK_BOTTOM;
	}

	public String[] getEnvironmentHeaderSublocations() {
		return WidgetLocations.ENVIRONMENT_HEADER_SUBLOCATIONS;
	}

	public String[] getEnvironmentDockBottomSublocations() {
		return WidgetLocations.ENVIRONMENT_DOCK_BOTTOM_SUBLOCATIONS;
	}

	public String getEnvironmentDockTop() {
		return WidgetLocations.ENVIRONMENT_DOCK_TOP;
	}

	public String getEnvironmentFooter() {
		return WidgetLocations.ENVIRONMENT_FOOTER;
	}

	public String[] getEnvironmentDockTopSublocations() {
		return WidgetLocations.ENVIRONMENT_DOCK_TOP_SUBLOCATIONS;
	}

	public String[] getEnvironmentContentToolsTopSublocations() {
		return WidgetLocations.ENVIRONMENT_CONTENT_TOOLS_TOP_SUBLOCATIONS;
	}

	public String[] getEnvironmentContentToolsBottomSublocations() {
		return WidgetLocations.ENVIRONMENT_CONTENT_TOOLS_BOTTOM_SUBLOCATIONS;
	}

	public String[] getEnvironmentFooterSublocations() {
		return WidgetLocations.ENVIRONMENT_FOOTER_SUBLOCATIONS;
	}

}
