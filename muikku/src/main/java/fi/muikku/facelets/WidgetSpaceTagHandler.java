package fi.muikku.facelets;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.faces.component.UIComponent;
import javax.faces.view.facelets.CompositeFaceletHandler;
import javax.faces.view.facelets.FaceletContext;
import javax.faces.view.facelets.FaceletHandler;
import javax.faces.view.facelets.TagAttribute;
import javax.faces.view.facelets.TagConfig;

import fi.muikku.model.widgets.WidgetVisibility;
import fi.muikku.widgets.WidgetSpaceSizingStrategy;

public class WidgetSpaceTagHandler extends AbstractWidgetTagHandler {

	public WidgetSpaceTagHandler(TagConfig config) {
		super(config);
		
    nameAttribute = getAttribute("name");
		sizingAttribute = getAttribute("sizing");
		keepEmptyAttribute = getAttribute("keepEmpty");
	}

	@Override
	public void apply(FaceletContext context, UIComponent parent) throws IOException {
		if ((!empty)||(keepEmptyAttribute.getBoolean(context))) {
			// FIXME: These get added twice at postback
			
			parent.getChildren().add(new HtmlFragmentComponent(new StringBuilder()
    	  .append("<div class=")
    	  .append('"')
    	  .append("widgetSpace grid_")
    	  .append(size)
    	  .append('"')
    	  .append(" data-name=")
    	  .append('"')
    	  .append(getName(context))
    	  .append('"')
    	  .append(">").toString()));
    
    	this.nextHandler.apply(context, parent);
    
      parent.getChildren().add(new HtmlFragmentComponent( "</div>" ));
		}
	}
  
  public List<WidgetInfo> getWidgetInfos() {
  	List<WidgetInfo> widgetInfos = new ArrayList<>();
  	
		if (nextHandler instanceof CompositeFaceletHandler) {
    	CompositeFaceletHandler compositeFaceletHandler = (CompositeFaceletHandler) nextHandler;
    	for (FaceletHandler faceletHandler : compositeFaceletHandler.getHandlers()) {
    		if (faceletHandler instanceof WidgetTagHandler) {
    			WidgetInfo widgetInfo = readWidgetInfo((WidgetTagHandler) faceletHandler);
    			if (widgetInfo != null) {
    			  widgetInfos.add(widgetInfo);
    			}
    		}
    	}
		} else if (nextHandler instanceof WidgetTagHandler) {
			WidgetInfo widgetInfo = readWidgetInfo((WidgetTagHandler) nextHandler);
			if (widgetInfo != null) {
			  widgetInfos.add(widgetInfo);
			}
		}
		
		return widgetInfos;
	}

	private WidgetInfo readWidgetInfo(WidgetTagHandler widgetTagHandler) {
		String name = widgetTagHandler.getName();
		WidgetVisibility visibility = widgetTagHandler.getVisibility();
		int minimumSize = widgetTagHandler.getMinimumSize();
		
		boolean visible = visibility == WidgetVisibility.EVERYONE;
		if (!visible) {
			visible = getSessionController().isLoggedIn() == (visibility == WidgetVisibility.AUTHENTICATED);
		}
		
		if (visible) {
		  return new WidgetInfo(name, visibility, minimumSize);
		} else {
			return null;
		}
	}
	
  public void setSize(int size) {
		this.size = size;
	}
  
  public void setEmpty(boolean empty) {
  	this.empty = empty;
  }
  
	public String getName(FaceletContext facesContext) {
		return nameAttribute.getValue(facesContext);
	}
	
	public boolean getKeepEmpty(FaceletContext facesContext) {
		return keepEmptyAttribute.getBoolean(facesContext);
	}
	
	public WidgetSpaceSizingStrategy getSizingStrategy(FaceletContext facesContext) {
		return WidgetSpaceSizingStrategy.valueOf(sizingAttribute.getValue(facesContext));
	}

	private TagAttribute nameAttribute;
	private TagAttribute sizingAttribute;
	private TagAttribute keepEmptyAttribute;
	private int size;
	private boolean empty;
}
