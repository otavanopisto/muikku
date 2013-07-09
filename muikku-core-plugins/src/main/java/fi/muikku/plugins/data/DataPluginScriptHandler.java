package fi.muikku.plugins.data;

import java.util.Map;

public interface DataPluginScriptHandler {

	public String getName();
	public void executeScript(String uri, Map<String, String> parameters);
	
}
