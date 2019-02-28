package fi.otavanopisto.muikku.plugins.workspace.dao;

import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalComment;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalComment_;
import fi.otavanopisto.muikku.plugins.workspace.model.WorkspaceJournalEntry;

public class WorkspaceJournalCommentDAO extends CorePluginsDAO<WorkspaceJournalComment> {

  private static final long serialVersionUID = 6109091554861451825L;

  public WorkspaceJournalComment create(WorkspaceJournalEntry journalEntry, UserEntity author, String comment) {
    WorkspaceJournalComment journalComment = new WorkspaceJournalComment();
    journalComment.setComment(comment);
    journalComment.setCreated(new Date());
    journalComment.setCreator(author.getId());
    journalComment.setJournalEntry(journalEntry);
    journalComment.setArchived(Boolean.FALSE);
    return persist(journalComment);
  }

  public WorkspaceJournalComment create(WorkspaceJournalEntry journalEntry, WorkspaceJournalComment parent, UserEntity author, String comment) {
    WorkspaceJournalComment journalComment = new WorkspaceJournalComment();
    journalComment.setComment(comment);
    journalComment.setCreated(new Date());
    journalComment.setCreator(author.getId());
    journalComment.setJournalEntry(journalEntry);
    journalComment.setParent(parent);
    journalComment.setArchived(Boolean.FALSE);
    return persist(journalComment);
  }
  
  public WorkspaceJournalComment updateComment(WorkspaceJournalComment journalComment, String comment) {
    journalComment.setComment(comment);
    return persist(journalComment);
  }

  public List<WorkspaceJournalComment> listByJournalEntryAndArchived(WorkspaceJournalEntry journalEntry, Boolean archived) {
    EntityManager entityManager = getEntityManager();
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<WorkspaceJournalComment> criteria = criteriaBuilder.createQuery(WorkspaceJournalComment.class);
    Root<WorkspaceJournalComment> root = criteria.from(WorkspaceJournalComment.class);
    criteria.select(root);
    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(root.get(WorkspaceJournalComment_.journalEntry), journalEntry),
        criteriaBuilder.equal(root.get(WorkspaceJournalComment_.archived), Boolean.FALSE)
      )
    );
    return entityManager.createQuery(criteria).getResultList();
  }

}