package fi.muikku.facelets;

import fi.muikku.model.widgets.WidgetVisibility;

public class WidgetInfo {

	public WidgetInfo(String name, WidgetVisibility visibility, int minimumSize) {
		this.name = name;
		this.visibility = visibility;
		this.minimumSize = minimumSize;
	}

	public String getName() {
		return name;
	}

	public WidgetVisibility getVisibility() {
		return visibility;
	}
	
	public int getMinimumSize() {
		return minimumSize;
	}

	private String name;
	private WidgetVisibility visibility;
	private int minimumSize;
}
