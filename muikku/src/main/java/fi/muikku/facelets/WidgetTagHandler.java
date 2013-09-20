package fi.muikku.facelets;

import java.io.IOException;

import javax.el.VariableMapper;
import javax.faces.component.UIComponent;
import javax.faces.view.facelets.FaceletContext;
import javax.faces.view.facelets.TagAttribute;
import javax.faces.view.facelets.TagConfig;
import javax.faces.view.facelets.TagException;

import com.sun.faces.facelets.el.VariableMapperWrapper;

import fi.muikku.model.widgets.WidgetVisibility;

public class WidgetTagHandler extends AbstractWidgetTagHandler {

	private static final String WIDGET_PATH = "/widgets/%s.xhtml";

	public WidgetTagHandler(TagConfig config) {
		super(config);
		
		nameAttribute = getAttribute("name");
		minSizeAttribute = getAttribute("min-size");
		visibilityAttribute = getAttribute("visibility");
	}

	@Override
	public void apply(FaceletContext context, UIComponent parent) throws IOException {
		WidgetVisibility visibility = getVisibility();
		boolean visible = visibility == WidgetVisibility.EVERYONE;
		if (!visible) {
			visible = getSessionController().isLoggedIn() == (visibility == WidgetVisibility.AUTHENTICATED);
		}
 		
		if (visible) {
		  includeWidget(context, parent, getName());
		}
	}
	
  private String getWidgetPath(String widgetName) {
		return String.format(WIDGET_PATH, widgetName);
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
	
	public String getName() {
		return nameAttribute.getValue();
	}
	
	public WidgetVisibility getVisibility() {
		return WidgetVisibility.valueOf(visibilityAttribute.getValue());
	}
	
	public int getMinimumSize() {
		return minSizeAttribute.getInt(null);
	}
	
	private TagAttribute nameAttribute;
	private TagAttribute minSizeAttribute;
	private TagAttribute visibilityAttribute;
}
