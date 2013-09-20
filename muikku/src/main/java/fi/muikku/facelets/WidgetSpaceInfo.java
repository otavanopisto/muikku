package fi.muikku.facelets;

import java.util.List;

import fi.muikku.widgets.WidgetSpaceSizingStrategy;

public class WidgetSpaceInfo {
	
	public WidgetSpaceInfo(String name, WidgetSpaceSizingStrategy sizingStrategy, List<WidgetInfo> widgetInfos) {
		this.name = name;
		this.sizingStrategy = sizingStrategy;
		this.widgetInfos = widgetInfos;
	}
	
	public String getName() {
		return name;
	}
	
	public WidgetSpaceSizingStrategy getSizingStrategy() {
		return sizingStrategy;
	}
	
	public List<WidgetInfo> getWidgetInfos() {
		return widgetInfos;
	}
	
	private String name;
	private WidgetSpaceSizingStrategy sizingStrategy;
	private List<WidgetInfo> widgetInfos;
}