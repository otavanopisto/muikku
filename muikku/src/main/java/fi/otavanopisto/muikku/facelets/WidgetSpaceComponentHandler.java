package fi.otavanopisto.muikku.facelets;

import java.io.IOException;
import java.net.URL;

import javax.el.VariableMapper;
import javax.faces.component.UIComponent;
import javax.faces.view.facelets.ComponentConfig;
import javax.faces.view.facelets.ComponentHandler;
import javax.faces.view.facelets.FaceletContext;
import javax.faces.view.facelets.TagAttribute;
import javax.faces.view.facelets.TagException;

import org.apache.commons.codec.binary.Base64;

import com.sun.faces.facelets.el.VariableMapperWrapper;

public class WidgetSpaceComponentHandler extends ComponentHandler {

	public WidgetSpaceComponentHandler(ComponentConfig config) {
		super(config);
		
		nameAttribute = getAttribute("name");
	}

	@Override
	public void apply(FaceletContext context, UIComponent parent) throws IOException {
		StringBuilder jsfBuilder = new StringBuilder();
		
		jsfBuilder
		  .append("<ui:composition xmlns:m=\"http://www.ofw.fi/xml/2013/muikku/components-taglib.xsd\" xmlns:ui=\"http://java.sun.com/jsf/facelets\">")
		  .append("<m:includeWidgets")
		  .append(" widgets=")
		  .append('"')
		  .append('#')
		  .append("{widgetsBackingBean.getWidgets('")
  	  .append(getName(context))
  	  .append("')}")
  	  .append('"')
  	  .append("/>")
		  .append("</ui:composition>");
		
		VariableMapper orig = context.getVariableMapper();
		context.setVariableMapper(new VariableMapperWrapper(orig));
		try {
      context.includeFacelet(parent, new URL(null, "data://text/plain;base64," + Base64.encodeBase64String(jsfBuilder.toString().getBytes("UTF-8")), new DataStreamHandler()));
		} catch (IOException e) {
			throw new TagException(this.tag, "Failed to include widget space widgets");
		} finally {
			context.setVariableMapper(orig);
		}
		
		super.apply(context, parent);
	}
	
	public String getName(FaceletContext context) {	
		return nameAttribute.getValue(context);
	}

	private TagAttribute nameAttribute;
}
