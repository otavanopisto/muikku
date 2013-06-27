package fi.muikku.widgets;


public class WidgetSpaceSetItem {
	
	public WidgetSpaceSetItem(String name, boolean keepEmpty, WidgetSpaceSizingStrategy sizingStrategy) {
		this.sizingStrategy = sizingStrategy;
		this.keepEmpty = keepEmpty;
		this.name = name;
	}
	
	public WidgetSpaceSizingStrategy getSizingStrategy() {
		return sizingStrategy;
	}
	
	public String getName() {
		return name;
	}
	
	public boolean isKeepEmpty() {
		return keepEmpty;
	}
	
	private WidgetSpaceSizingStrategy sizingStrategy;
	private boolean keepEmpty;
	private String name;
}