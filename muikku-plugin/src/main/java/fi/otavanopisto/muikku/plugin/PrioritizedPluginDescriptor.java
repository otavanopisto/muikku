package fi.otavanopisto.muikku.plugin;

public interface PrioritizedPluginDescriptor {
  
  public static final int FIRST = -10;
  public static final int NORMAL = 0;
  public static final int LAST = 10;
  
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
