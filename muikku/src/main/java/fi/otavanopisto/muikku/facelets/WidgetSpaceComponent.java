package fi.otavanopisto.muikku.facelets;

import java.io.IOException;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponentBase;
import javax.faces.context.FacesContext;
import javax.faces.context.ResponseWriter;

import fi.otavanopisto.muikku.widgets.WidgetSpaceSizingStrategy;

@FacesComponent ("fi.otavanopisto.muikku.facelet.WidgetSpace")
public class WidgetSpaceComponent extends UIComponentBase {

	@Override
	public boolean getRendersChildren() {
		return true;
	}
	
	@Override
	public void encodeBegin(FacesContext context) throws IOException {
		if (getKeepEmpty() || (!isEmpty())) {
  		ResponseWriter writer = context.getResponseWriter();
  		writer.write("<div class=");
  		writer.write('"');
//  		if (getChildren().size() != 0)
  		  writer.write("widgetSpace grid_");
//  		else
//  		  writer.write("widgetSpace container_");
  	  writer.write(String.valueOf( getSize() ));
  	  if (getStyleClass() != null) {
  	    writer.write(" ");
  	    writer.write(getStyleClass());
  	  }
  	  writer.write('"');
  	  writer.write(" data-name=");
  	  writer.write('"');
  	  writer.write(getName());
  	  writer.write('"');
  	  writer.write(">");
		}
	}
	
	@Override
	public void encodeEnd(FacesContext context) throws IOException {
		if (getKeepEmpty() || (!isEmpty())) {
  		ResponseWriter writer = context.getResponseWriter();
  		writer.write("</div>");
		}
	}
	
	@Override
	public String getFamily() {
		return getClass().getPackage().toString();
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public Boolean getKeepEmpty() {
		return keepEmpty;
	}
	
	public void setKeepEmpty(Boolean keepEmpty) {
		this.keepEmpty = keepEmpty;
	}
	
	public WidgetSpaceSizingStrategy getSizing() {
		return sizing;
	}
	
	public void setSizing(WidgetSpaceSizingStrategy sizing) {
		this.sizing = sizing;
	}
	
	public void setEmpty(boolean empty) {
		this.empty = empty;
	}
	
	public int getSize() {
		return size;
	}

	public void setSize(int size) {
		this.size = size;
	}

	public boolean isEmpty() {
		return empty;
	}
	
	public String getStyleClass() {
    return styleClass;
  }

  public void setStyleClass(String styleClass) {
    this.styleClass = styleClass;
  }

  private String styleClass;
	private String name;
	private Boolean keepEmpty;
	private WidgetSpaceSizingStrategy sizing;
	private int size = 0;
	private boolean empty = true;
}
