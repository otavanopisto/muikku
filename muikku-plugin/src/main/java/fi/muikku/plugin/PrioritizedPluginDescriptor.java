package fi.muikku.plugin;

public interface PrioritizedPluginDescriptor {
  
	/**
	 * Returns initialization priority of plugin. Plugins with smaller priority is loaded first.
	 * 
	 * Value can be negative
	 * 
	 * Default priority is 0.
	 * 
	 * @return Plugin initialization priority
	 */
	public int getPriority();
	
}
