package fi.otavanopisto.muikku.facelets;

import javax.faces.component.FacesComponent;
import javax.faces.component.UIComponentBase;

@FacesComponent ("fi.otavanopisto.muikku.facelet.Widget")
public class WidgetComponent extends UIComponentBase {

	@Override
	public boolean getRendersChildren() {
		return false;
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
	
	public int getSize() {
		return size;
	}
	
	public void setSize(int size) {
		this.size = size;
	}
	
	private String name;
	private int size;
}
