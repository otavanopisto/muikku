package fi.muikku;

public class WidgetLocations {

	// Locations

	public static final String ENVIRONMENT_HEADER = "environment.header";
	public static final String ENVIRONMENT_DOCK_TOP = "environment.dock-top";
	public static final String ENVIRONMENT_CONTENT = "environment.content";
	public static final String ENVIRONMENT_CONTENT_TOOLS_TOP = "environment.content-tools-top";
	public static final String ENVIRONMENT_CONTENT_TOOLS_BOTTOM = "environment.content-tools-bottom";
	public static final String ENVIRONMENT_CONTENT_SIDEBAR_LEFT = "environment.content-sidebar-left";
	public static final String ENVIRONMENT_CONTENT_SIDEBAR_RIGHT = "environment.content-sidebar-right";
	public static final String ENVIRONMENT_DOCK_BOTTOM = "environment.dock-bottom";
	public static final String ENVIRONMENT_FOOTER = "environment.footer";
	
	// Sublocations
	
	public static final String[] ENVIRONMENT_HEADER_SUBLOCATIONS = { "left", "center", "right" };
	public static final String[] ENVIRONMENT_DOCK_TOP_SUBLOCATIONS = { "left", "center", "right" };
	public static final String[] ENVIRONMENT_CONTENT_TOOLS_TOP_SUBLOCATIONS = { "left", "center", "right" };
	public static final String[] ENVIRONMENT_CONTENT_TOOLS_BOTTOM_SUBLOCATIONS = { "left", "center", "right" };
	public static final String[] ENVIRONMENT_DOCK_BOTTOM_SUBLOCATIONS = { "left", "center", "right" };
	public static final String[] ENVIRONMENT_FOOTER_SUBLOCATIONS = { "left", "center", "right" };

	public static String[] getTopLevel() {
		return new String[]{
			ENVIRONMENT_HEADER, 
			ENVIRONMENT_DOCK_TOP, 
			ENVIRONMENT_CONTENT, 
			ENVIRONMENT_CONTENT_TOOLS_TOP,
			ENVIRONMENT_CONTENT_TOOLS_BOTTOM,
			ENVIRONMENT_CONTENT_SIDEBAR_LEFT,
			ENVIRONMENT_CONTENT_SIDEBAR_RIGHT,
			ENVIRONMENT_DOCK_BOTTOM,
			ENVIRONMENT_FOOTER
		};
	}
	
	public static String[] getAll() {
		return mergeArrays(
		  new String[]{
  			ENVIRONMENT_CONTENT, 
  			ENVIRONMENT_CONTENT_SIDEBAR_LEFT,
  			ENVIRONMENT_CONTENT_SIDEBAR_RIGHT
  		}, 
  		withSubLocations(ENVIRONMENT_HEADER, ENVIRONMENT_HEADER_SUBLOCATIONS),
  		withSubLocations(ENVIRONMENT_DOCK_TOP, ENVIRONMENT_DOCK_TOP_SUBLOCATIONS),
  		withSubLocations(ENVIRONMENT_CONTENT_TOOLS_TOP, ENVIRONMENT_CONTENT_TOOLS_TOP_SUBLOCATIONS),
  		withSubLocations(ENVIRONMENT_CONTENT_TOOLS_BOTTOM, ENVIRONMENT_CONTENT_TOOLS_BOTTOM_SUBLOCATIONS),
  		withSubLocations(ENVIRONMENT_DOCK_BOTTOM, ENVIRONMENT_DOCK_BOTTOM_SUBLOCATIONS),
  		withSubLocations(ENVIRONMENT_FOOTER, ENVIRONMENT_FOOTER_SUBLOCATIONS)
    );
	}
	
	private static String[] mergeArrays(String[]... arrays) {
		int length = 0;
		for (String[] array : arrays) {
			length += array.length;
		}
		
		String[] result = new String[length];
		int offset = 0;
		for (String[] array : arrays) {
			int arrayLength = array.length;
			for (int i = 0; i < arrayLength; i++) {
				result[i + offset] = array[i];
			}
			offset += arrayLength;
		}
		
		return result;
	}
	
	private static String[] withSubLocations(String location, String[] sublocations) {
		String[] result = new String[sublocations.length + 1];
		result[0] = location;
		
		for (int i = 0, l = sublocations.length; i < l; i++) {
			result[i + 1] = new StringBuilder(location).append('.').append(sublocations[i]).toString();		
		}
		
		return result;
	}
}
