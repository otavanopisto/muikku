package fi.muikku.plugins.workspace.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.muikku.model.workspace.WorkspaceEntity;
import fi.muikku.plugins.CorePluginsDAO;
import fi.muikku.plugins.workspace.model.WorkspaceJournalEntry;
import fi.muikku.plugins.workspace.model.WorkspaceJournalEntry_;

public class WorkspaceJournalEntryDAO extends CorePluginsDAO<WorkspaceJournalEntry> {

  private static final long serialVersionUID = 63917373561361361L;

  public WorkspaceJournalEntry create(WorkspaceEntity workspaceEntity, String html, String title) {
    WorkspaceJournalEntry journalEntry = new WorkspaceJournalEntry();
    journalEntry.setWorkspaceEntityId(workspaceEntity.getId());
    journalEntry.setHtml(html);
    journalEntry.setTitle(title);
    return persist(journalEntry);
  }

  public List<WorkspaceJournalEntry> listByWorkspaceEntityId(Long workspaceEntityId) {
    EntityManager entityManager = getEntityManager();

    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceJournalEntry> criteria = criteriaBuilder.createQuery(WorkspaceJournalEntry.class);
    Root<WorkspaceJournalEntry> root = criteria.from(WorkspaceJournalEntry.class);
    criteria.select(root);
    criteria.where(criteriaBuilder.equal(root.get(WorkspaceJournalEntry_.workspaceEntityId), workspaceEntityId));

    return entityManager.createQuery(criteria).getResultList();
  }
}
