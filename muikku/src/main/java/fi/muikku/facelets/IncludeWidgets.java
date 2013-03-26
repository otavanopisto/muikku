package fi.muikku.facelets;

import java.io.IOException;
import java.util.List;

import javax.el.VariableMapper;
import javax.faces.component.UIComponent;
import javax.faces.view.facelets.FaceletContext;
import javax.faces.view.facelets.TagAttribute;
import javax.faces.view.facelets.TagAttributeException;
import javax.faces.view.facelets.TagConfig;
import javax.faces.view.facelets.TagHandler;
import javax.inject.Inject;

import com.sun.faces.facelets.el.VariableMapperWrapper;

import fi.muikku.model.widgets.LocatedWidget;
import fi.muikku.session.SessionController;

public class IncludeWidgets extends TagHandler {
	
	private static final String WIDGET_PATH = "/widgets/%s.xhtml";

	@Inject
	private SessionController sessionController;
	
	public IncludeWidgets(TagConfig config) {
		super(config);
		
		widgets = getAttribute("widgets");
	}
	
	private String getWidgetPath(LocatedWidget locatedWidget) {
		return String.format(WIDGET_PATH, locatedWidget.getWidget().getName());
	}

	@Override
	public void apply(FaceletContext context, UIComponent parent) throws IOException {
		@SuppressWarnings("unchecked")
		List<LocatedWidget> locatedWidgets = (List<LocatedWidget>) widgets.getObject(context, List.class);
		for (LocatedWidget locatedWidget : locatedWidgets) {
			includeWidget(context, parent, locatedWidget);
		}
	}
	
	private void includeWidget(FaceletContext context, UIComponent parent, LocatedWidget locatedWidget) {
		String path = getWidgetPath(locatedWidget);
		
		VariableMapper orig = context.getVariableMapper();
		context.setVariableMapper(new VariableMapperWrapper(orig));
		try {
			this.nextHandler.apply(context, null);
			context.includeFacelet(parent, path);
		} catch (IOException e) {
			throw new TagAttributeException(this.tag, this.widgets, "Could not find widget: " + path);
		} finally {
			context.setVariableMapper(orig);
		}
	}
	
	private TagAttribute widgets;
	
}
