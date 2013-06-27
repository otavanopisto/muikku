package fi.muikku.widgets;


public class WidgetSpaceSet {
	
	public WidgetSpaceSet(WidgetSpaceSetItem... items) {
		this.items = items;
	}
	
	public WidgetSpaceSetItem[] getItems() {
		return items;
	}
	
	private WidgetSpaceSetItem[] items;
}