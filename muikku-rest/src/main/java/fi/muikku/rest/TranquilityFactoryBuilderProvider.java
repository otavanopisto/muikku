package fi.muikku.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.enterprise.inject.Produces;

import fi.tranquil.TranquilityBuilderFactory;
import fi.tranquil.processing.EntityLookup;
import fi.tranquil.processing.PropertyAccessor;
import fi.tranquil.processing.TranquilityEntityFactory;

public class TranquilityFactoryBuilderProvider {
	
  @Produces
  @ApplicationScoped
  public TranquilityBuilderFactory produceTranquilityFactory() throws IOException, InstantiationException, IllegalAccessException {

  	List<EntityLookup> baseLookups = new ArrayList<>();
  	List<EntityLookup> compactLookups = new ArrayList<>();
  	List<EntityLookup> completeLookups = new ArrayList<>();
  	
  	// School Data
  	baseLookups.add(fi.muikku.schooldata.local.tranquil.BaseLookup.class.newInstance());
  	compactLookups.add(fi.muikku.schooldata.local.tranquil.CompactLookup.class.newInstance());
  	completeLookups.add(fi.muikku.schooldata.local.tranquil.CompleteLookup.class.newInstance());

  	// Persistence
  	baseLookups.add(fi.muikku.persistence.tranquil.BaseLookup.class.newInstance());
		compactLookups.add(fi.muikku.persistence.tranquil.CompactLookup.class.newInstance());
		completeLookups.add(fi.muikku.persistence.tranquil.CompleteLookup.class.newInstance());
  	
  	EntityLookupDelegate baseLookupDelegate = new EntityLookupDelegate(baseLookups);
  	EntityLookupDelegate compactLookupDelegate = new EntityLookupDelegate(compactLookups);
  	EntityLookupDelegate completeLookupDelegate = new EntityLookupDelegate(completeLookups);
  	
  	
  	return new TranquilityBuilderFactory(new PropertyAccessor(), 
  	  new TranquilityEntityFactory(baseLookupDelegate, compactLookupDelegate, completeLookupDelegate
  	));       
  }
  
  private class EntityLookupDelegate implements EntityLookup {
  	
  	public EntityLookupDelegate(List<EntityLookup> entityLookups) {
  		this.entityLookups = entityLookups;
		}

		@Override
		public Class<?> findTranquilModel(Class<?> entity) {
			
			for (EntityLookup entityLookup : entityLookups) {
				Class<?> tranquilModel = entityLookup.findTranquilModel(entity);
				if (tranquilModel != null)
					return tranquilModel;
			}
			
			return null;
		}

		private List<EntityLookup> entityLookups = new ArrayList<>();
  }
}
