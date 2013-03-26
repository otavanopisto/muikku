package fi.muikku.plugin;

import fi.tranquil.processing.EntityLookup;

public interface TranquilEntityLookups {

	public EntityLookup getBaseLookup();
	public EntityLookup getCompactLookup();
	public EntityLookup getCompleteLookup();
	
}
