package fi.muikku.plugin;

import fi.tranquil.processing.EntityLookup;

public class TranquilEntityLookupsImpl implements TranquilEntityLookups {

	public TranquilEntityLookupsImpl(Class<? extends EntityLookup> baseLookupClass, Class<? extends EntityLookup> compactLookupClass, Class<? extends EntityLookup> completeLookupClass) throws InstantiationException, IllegalAccessException {
		baseLookup = baseLookupClass.newInstance();
		compactLookup = compactLookupClass.newInstance();
		completeLookup = completeLookupClass.newInstance();
	}
	
	@Override
	public EntityLookup getBaseLookup() {
		return baseLookup;
	}
	
	@Override
	public EntityLookup getCompactLookup() {
		return compactLookup;
	}
	
	@Override
	public EntityLookup getCompleteLookup() {
		return completeLookup;
	};
	
	private EntityLookup baseLookup;
	private EntityLookup compactLookup;
	private EntityLookup completeLookup;
}
