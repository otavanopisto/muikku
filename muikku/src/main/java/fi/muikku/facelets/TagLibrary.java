package fi.muikku.facelets;

import com.sun.faces.facelets.tag.AbstractTagLibrary;

public class TagLibrary extends AbstractTagLibrary {
	
	private static final String[] USER_TAGS = {"inputText", "inputMemo", "inputDate", "inputTime", "inputSelect", "inputCheckbox", "inputSubmit", "inputHidden"};

	public TagLibrary() {
		super("http://www.ofw.fi/xml/2013/muikku/components-taglib.xsd");
		addTagHandler("includeWidgets", IncludeWidgets.class);
		
	  for (String userTag : USER_TAGS) {
		  addUserTag(userTag);
	  }
	}
	
	private void addUserTag(String name) {
		String fileName = "META-INF/tags/" + name + ".xhtml";
		addUserTag(name, getClass().getClassLoader().getResource(fileName));
	}
	
}