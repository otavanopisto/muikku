package fi.muikku.facelets;

import java.io.IOException;

import javax.faces.component.UIComponentBase;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;

public class HtmlFragmentComponent extends UIComponentBase {
	
	public HtmlFragmentComponent(String html) {
		this.html = html;
	}
	
	public void encodeEnd(FacesContext ctx) throws IOException {
  	ResponseWriter w = ctx.getResponseWriter();
  	w.write(html);
  }
	
	@Override
	public String getFamily() {
		return getClass().getPackage().toString();
	}
	
	private String html;
}