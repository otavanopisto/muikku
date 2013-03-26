package fi.muikku.plugin.jpa;

import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Produces;
import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;

import fi.muikku.plugin.PluginPersistence;

public class EntityManagerProducer {

	@Inject
	@PluginPersistence
	private EntityManagerFactory entityManagerFactory;
	
	@Produces	
	@PluginPersistence
	@Dependent
	public EntityManager produceEntityManager() {
		EntityManager entityManager = entityManagerFactory.createEntityManager();
		return entityManager;
	}

}
