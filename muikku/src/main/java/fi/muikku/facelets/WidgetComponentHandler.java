package fi.muikku.facelets;

import java.io.IOException;

import javax.el.VariableMapper;
import javax.faces.component.UIComponent;
import javax.faces.view.facelets.ComponentConfig;
import javax.faces.view.facelets.ComponentHandler;
import javax.faces.view.facelets.FaceletContext;
import javax.faces.view.facelets.TagAttribute;
import javax.faces.view.facelets.TagException;

import com.sun.faces.facelets.el.VariableMapperWrapper;

public class WidgetComponentHandler extends ComponentHandler {

	private static final String WIDGET_PATH = "/widgets/%s.xhtml";

	public WidgetComponentHandler(ComponentConfig config) {
		super(config);
		
		nameAttribute = getAttribute("name");
		sizeAttribute = getAttribute("size");
		renderedAttribute = getAttribute("rendered");
	}
	
	@Override
	public void apply(FaceletContext context, UIComponent parent) throws IOException {
		super.apply(context, parent);
		
		if (getRendered(context)) {
		  includeWidget(context, parent, getName(context));
		}
	}
	
	private void includeWidget(FaceletContext context, UIComponent parent, String widgetName) {
		String path = getWidgetPath(widgetName);
		
		VariableMapper orig = context.getVariableMapper();
		context.setVariableMapper(new VariableMapperWrapper(orig));
		try {
			this.nextHandler.apply(context, null);
			context.includeFacelet(parent, path);
		} catch (IOException e) {
			throw new TagException(this.tag, "Failed to include widget " + path);
		} finally {
			context.setVariableMapper(orig);
		}
	}
	
	private String getWidgetPath(String widgetName) {
		return String.format(WIDGET_PATH, widgetName);
	}
	
	public String getName(FaceletContext context) {	
		return nameAttribute.getValue(context);
	}

	public int getMinimumSize(FaceletContext context) {
		return sizeAttribute.getInt(context);
	}
	
	private boolean getRendered(FaceletContext context) {
		if (renderedAttribute == null) {
			return true;
		}
		
		return renderedAttribute.getBoolean(context);
	}
	
	private TagAttribute nameAttribute;
	private TagAttribute sizeAttribute;
	private TagAttribute renderedAttribute;
}
