package fi.muikku;

public class WidgetLocations {

	// Environment Locations

	public static final String ENVIRONMENT_HEADER_LEFT = "environment.header.left";
	public static final String ENVIRONMENT_HEADER_CENTER = "environment.header.center";
	public static final String ENVIRONMENT_HEADER_RIGHT = "environment.header.right";	
	public static final String ENVIRONMENT_DOCK_TOP_LEFT = "environment.dock-top.left";
	public static final String ENVIRONMENT_DOCK_TOP_CENTER = "environment.dock-top.center";
	public static final String ENVIRONMENT_DOCK_TOP_RIGHT = "environment.dock-top.right";
	public static final String ENVIRONMENT_CONTENT = "environment.content";
	public static final String ENVIRONMENT_CONTENT_TOOLS_TOP_LEFT = "environment.content-tools-top.left";
	public static final String ENVIRONMENT_CONTENT_TOOLS_TOP_CENTER = "environment.content-tools-top.center";
	public static final String ENVIRONMENT_CONTENT_TOOLS_TOP_RIGHT = "environment.content-tools-top.right";
	public static final String ENVIRONMENT_CONTENT_TOOLS_BOTTOM_LEFT = "environment.content-tools-bottom.left";
	public static final String ENVIRONMENT_CONTENT_TOOLS_BOTTOM_CENTER = "environment.content-tools-bottom.center";
	public static final String ENVIRONMENT_CONTENT_TOOLS_BOTTOM_RIGHT = "environment.content-tools-bottom.right";
	public static final String ENVIRONMENT_CONTENT_SIDEBAR_LEFT = "environment.content-sidebar.left";
	public static final String ENVIRONMENT_CONTENT_SIDEBAR_RIGHT = "environment.content-sidebar.right";
	public static final String ENVIRONMENT_DOCK_BOTTOM_LEFT = "environment.dock-bottom.left";
	public static final String ENVIRONMENT_DOCK_BOTTOM_CENTER = "environment.dock-bottom.center";
	public static final String ENVIRONMENT_DOCK_BOTTOM_RIGHT = "environment.dock-bottom.right";
	public static final String ENVIRONMENT_FOOTER_LEFT = "environment.footer.left";
	public static final String ENVIRONMENT_FOOTER_CENTER = "environment.footer.center";
	public static final String ENVIRONMENT_FOOTER_RIGHT = "environment.footer.right";
	
	// Plugin Settings Locations (TODO: move to plugin)
	
	public static final String SETTINGS_CONTENT_SIDEBAR_LEFT = "settings.content-sidebar.left";
	public static final String PLUGIN_SETTINGS_CONTENT_SIDEBAR_LEFT = "plugin-settings.content-sidebar.left";

	public static String[] getAll() {
		return new String[] {
			ENVIRONMENT_HEADER_LEFT,
			ENVIRONMENT_HEADER_CENTER,
			ENVIRONMENT_HEADER_RIGHT,
			ENVIRONMENT_DOCK_TOP_LEFT,
			ENVIRONMENT_DOCK_TOP_CENTER,
			ENVIRONMENT_DOCK_TOP_RIGHT,
			ENVIRONMENT_CONTENT,
		  ENVIRONMENT_CONTENT_TOOLS_TOP_LEFT,
			ENVIRONMENT_CONTENT_TOOLS_TOP_CENTER,
			ENVIRONMENT_CONTENT_TOOLS_TOP_RIGHT,
			ENVIRONMENT_CONTENT_TOOLS_BOTTOM_LEFT,
			ENVIRONMENT_CONTENT_TOOLS_BOTTOM_CENTER,
			ENVIRONMENT_CONTENT_TOOLS_BOTTOM_RIGHT,
			ENVIRONMENT_CONTENT_SIDEBAR_LEFT,
			ENVIRONMENT_CONTENT_SIDEBAR_RIGHT,
			ENVIRONMENT_DOCK_BOTTOM_LEFT,
			ENVIRONMENT_DOCK_BOTTOM_CENTER,
			ENVIRONMENT_DOCK_BOTTOM_RIGHT,
			ENVIRONMENT_FOOTER_LEFT,
			ENVIRONMENT_FOOTER_CENTER,
			ENVIRONMENT_FOOTER_RIGHT
		};
	}
}
