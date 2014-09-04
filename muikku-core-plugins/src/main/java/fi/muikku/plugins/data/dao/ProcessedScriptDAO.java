package fi.muikku.plugins.data.dao;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.data.model.ProcessedScript;
import fi.muikku.plugins.data.model.ProcessedScript_;

public class ProcessedScriptDAO extends CorePluginsDAO<ProcessedScript> {

	private static final long serialVersionUID = 7519257748266826253L;

	public ProcessedScript create(String url) {
		ProcessedScript processedScript = new ProcessedScript();
		processedScript.setUrl(url);
		getEntityManager().persist(processedScript);
		
		return processedScript;
	}

	public ProcessedScript findByUrl(String url) {
		EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<ProcessedScript> criteria = criteriaBuilder.createQuery(ProcessedScript.class);
    Root<ProcessedScript> root = criteria.from(ProcessedScript.class);
    criteria.select(root);
    criteria.where(
        criteriaBuilder.equal(root.get(ProcessedScript_.url), url)
    );
    
    return getSingleResult(entityManager.createQuery(criteria));
	}
	
}