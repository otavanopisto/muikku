package fi.muikku.facelets;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.faces.component.UIComponent;
import javax.faces.view.facelets.CompositeFaceletHandler;
import javax.faces.view.facelets.FaceletContext;
import javax.faces.view.facelets.FaceletHandler;
import javax.faces.view.facelets.TagConfig;

import fi.muikku.widgets.WidgetSpaceSizingStrategy;

public class WidgetSpaceSetTagHandler extends AbstractWidgetTagHandler {

	public WidgetSpaceSetTagHandler(TagConfig config) {
    super(config);
  }
  
  @Override
  public void apply(FaceletContext context, UIComponent parent) throws IOException {
  	List<WidgetSpaceInfo> widgetSpaceSetInfos = new ArrayList<>();
  	Map<String, WidgetSpaceTagHandler> handlerMap = new HashMap<>();
  	
  	List<WidgetSpaceTagHandler> widgetSpaceTagHandlers = getWidgetSpaceTagHandlers();
  	for (WidgetSpaceTagHandler widgetSpaceTagHandler : widgetSpaceTagHandlers) {
  		String name = widgetSpaceTagHandler.getName(context);
  		List<WidgetInfo> widgetInfos = widgetSpaceTagHandler.getWidgetInfos();
  		widgetSpaceSetInfos.add(new WidgetSpaceInfo(name, widgetSpaceTagHandler.getSizingStrategy(context), widgetInfos));
  		handlerMap.put(name, widgetSpaceTagHandler);
  	}
  	
  	for (WidgetSpaceInfo widgetSpaceInfo : widgetSpaceSetInfos) {
  		WidgetSpaceTagHandler widgetSpaceTagHandler = handlerMap.get(widgetSpaceInfo.getName());
  		widgetSpaceTagHandler.setSize(getWidgetSpaceSize(widgetSpaceSetInfos, widgetSpaceInfo));
  		widgetSpaceTagHandler.setEmpty(widgetSpaceInfo.getWidgetInfos().size() == 0);
  	}
  	
  	this.nextHandler.apply(context, parent);
  }
  
	private int getWidgetSpaceSize(List<WidgetSpaceInfo> widgetSpaceSetInfos, WidgetSpaceInfo widgetSpaceInfo) {
		switch (widgetSpaceInfo.getSizingStrategy()) {
			case MAXIMIZE:
				return calculateWidgetSpaceMaximumSize(widgetSpaceSetInfos, widgetSpaceInfo);
			case MINIMIZE:
				return calculateWidgetSpaceMinimumSize(widgetSpaceInfo);
			case SUM:
				return calculateWidgetSpaceSummedSize(widgetSpaceInfo);
		}
		
		return -1;
	}
  
  private List<WidgetSpaceTagHandler> getWidgetSpaceTagHandlers() {
  	List<WidgetSpaceTagHandler> result = new ArrayList<>();
  	
  	if (nextHandler instanceof CompositeFaceletHandler) {
    	CompositeFaceletHandler compositeFaceletHandler = (CompositeFaceletHandler) nextHandler;
    	for (FaceletHandler faceletHandler : compositeFaceletHandler.getHandlers()) {
    		if (faceletHandler instanceof WidgetSpaceTagHandler) {
    			result.add((WidgetSpaceTagHandler) faceletHandler);
    		}
    	}
  	}
  	
  	return result;
  }
  
  private Integer calculateWidgetSpaceMinimumSize(WidgetSpaceInfo widgetSpaceInfo) {
		Integer size = 0;
		
		for (WidgetInfo widgetInfo : widgetSpaceInfo.getWidgetInfos()) {
			Integer minimumSize = widgetInfo.getMinimumSize();
			if (minimumSize > size) {
				size = minimumSize;
			}
		}
		
		return size;
	}
  
  private Integer calculateWidgetSpaceSummedSize(WidgetSpaceInfo widgetSpaceInfo) {
		Integer size = 0;
		
		for (WidgetInfo widgetInfo : widgetSpaceInfo.getWidgetInfos()) {
			size += widgetInfo.getMinimumSize();
		}
		
		return size;
	}

	private Integer calculateWidgetSpaceMaximumSize(List<WidgetSpaceInfo> widgetSpaceSetInfos, WidgetSpaceInfo widgetSpaceInfo) {
		Integer spaceLeft = 24;
		
		for (WidgetSpaceInfo widgetSpaceSetInfo : widgetSpaceSetInfos) {
			if (!widgetSpaceInfo.getName().equals(widgetSpaceSetInfo.getName())) {
				if (widgetSpaceSetInfo.getSizingStrategy() == WidgetSpaceSizingStrategy.MAXIMIZE) {
					throw new RuntimeException("Widget space sets do not support multiple maximized widget spaces yet.");
				}
				
				spaceLeft -= getWidgetSpaceSize(widgetSpaceSetInfos, widgetSpaceSetInfo);
			}
		}
		
		return spaceLeft;
	}
}
