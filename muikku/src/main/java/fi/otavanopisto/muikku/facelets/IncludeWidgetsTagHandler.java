package fi.otavanopisto.muikku.facelets;

import java.io.IOException;
import java.net.URL;
import java.util.List;

import javax.el.VariableMapper;
import javax.faces.component.UIComponent;
import javax.faces.view.facelets.FaceletContext;
import javax.faces.view.facelets.TagAttribute;
import javax.faces.view.facelets.TagConfig;
import javax.faces.view.facelets.TagHandler;

import org.apache.commons.codec.binary.Base64;

import com.sun.faces.facelets.el.VariableMapperWrapper;

import fi.otavanopisto.muikku.model.widgets.LocatedWidget;
import fi.otavanopisto.muikku.model.widgets.Widget;

public class IncludeWidgetsTagHandler extends TagHandler {

	public IncludeWidgetsTagHandler(TagConfig config) {
		super(config);
		
		widgetsAttribute = getAttribute("widgets");
	}
	
	@Override
	public void apply(FaceletContext context, UIComponent parent) throws IOException {
		includeWidget(context, parent);
	}
	
	private void includeWidget(FaceletContext context, UIComponent parent) throws IOException {
		StringBuilder jsfBuilder = new StringBuilder();
		
		List<LocatedWidget> widgets = getWidgets(context);

		jsfBuilder.append("<ui:composition xmlns:m=\"http://www.ofw.fi/xml/2013/muikku/components-taglib.xsd\" xmlns:ui=\"http://java.sun.com/jsf/facelets\">");

		for (LocatedWidget widget : widgets) {
  		appendWidgetJsf(jsfBuilder, widget.getWidget());
		}
  		
		jsfBuilder.append("</ui:composition>");

		VariableMapper orig = context.getVariableMapper();
		context.setVariableMapper(new VariableMapperWrapper(orig));
		try {
			this.nextHandler.apply(context, parent);
      context.includeFacelet(parent, new URL(null, "data://text/plain;base64," + Base64.encodeBase64String(jsfBuilder.toString().getBytes("UTF-8")), new DataStreamHandler()));
		} finally {
			context.setVariableMapper(orig);
		}
	}
	
	private void appendWidgetJsf(StringBuilder jsfBuilder, Widget widget) {
		jsfBuilder
  	  .append("<m:widget")
  	  .append(" name=")
  	  .append('"')
  	  .append(widget.getName())
  	  .append('"')
  	  .append(" size=")
  	  .append('"')
  	  .append(widget.getMinimumSize())
  	  .append('"');
  	
  	switch (widget.getVisibility()) {
  		case AUTHENTICATED:
  			jsfBuilder.append(" rendered=")
  		  .append('"')
  		  .append("#{sessionBackingBean.loggedIn}")
  		  .append('"');
  		break;
  		case UNAUTHENTICATED:
  			jsfBuilder.append(" rendered=")
    		  .append('"')
    		  .append("#{!sessionBackingBean.loggedIn}")
    		  .append('"');
  		break;
  		default:
  			break;
  	}
	
	  jsfBuilder.append("/>");
	}
	
	@SuppressWarnings("unchecked")
	private List<LocatedWidget> getWidgets(FaceletContext context) {
		return (List<LocatedWidget>) widgetsAttribute.getObject(context, List.class);
	}
	
	private TagAttribute widgetsAttribute;
}
