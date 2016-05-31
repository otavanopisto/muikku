package fi.otavanopisto.muikku.plugins.announcer.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.announcer.model.Announcement;
import fi.otavanopisto.muikku.plugins.announcer.workspace.model.AnnouncementWorkspace;
import fi.otavanopisto.muikku.plugins.announcer.workspace.model.AnnouncementWorkspace_;

public class AnnouncementWorkspaceDAO extends CorePluginsDAO<AnnouncementWorkspace> {
	
  private static final long serialVersionUID = -9179843785232941193L;

  public AnnouncementWorkspace create(Announcement announcement, Long workspaceEntityId, Boolean archived) {
    AnnouncementWorkspace announcemenWorkspace = new AnnouncementWorkspace();
    announcemenWorkspace.setAnnouncement(announcement);
    announcemenWorkspace.setWorkspaceEntityId(workspaceEntityId);
    announcemenWorkspace.setArchived(archived);
    return persist(announcemenWorkspace);
  }
  
  public List<AnnouncementWorkspace> listByArchived(Boolean archived){
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AnnouncementWorkspace> criteria = criteriaBuilder.createQuery(AnnouncementWorkspace.class);
    Root<AnnouncementWorkspace> root = criteria.from(AnnouncementWorkspace.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(AnnouncementWorkspace_.archived), archived));
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<AnnouncementWorkspace> listByAnnouncementAndArchived(Announcement announcement, Boolean archived) {
    EntityManager entityManager = getEntityManager();
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<AnnouncementWorkspace> criteria = criteriaBuilder.createQuery(AnnouncementWorkspace.class);
    Root<AnnouncementWorkspace> root = criteria.from(AnnouncementWorkspace.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(AnnouncementWorkspace_.announcement), announcement),
        criteriaBuilder.equal(root.get(AnnouncementWorkspace_.archived), archived)
      )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public AnnouncementWorkspace updateArchived(AnnouncementWorkspace announcementWorkspace, Boolean archived) {
    announcementWorkspace.setArchived(archived);
    return persist(announcementWorkspace);
  }
  
  public void delete(AnnouncementWorkspace announcementWorkspace){
    super.delete(announcementWorkspace);
  }
  
}
