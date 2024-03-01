package fi.otavanopisto.muikku.plugins.communicator.dao;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Subquery;

import fi.otavanopisto.muikku.model.base.Tag;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.communicator.CommunicatorFolderType;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageCategory;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageIdLabel_;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageId_;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessageRecipient_;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage_;


public class CommunicatorMessageDAO extends CorePluginsDAO<CommunicatorMessage> {
	
  private static final long serialVersionUID = -8721990589622544635L;

  public CommunicatorMessage create(CommunicatorMessageId communicatorMessageId, Long sender,
      CommunicatorMessageCategory category, String caption, String content, Date created, Set<Tag> tags) {
    CommunicatorMessage msg = new CommunicatorMessage();
    
    int s = tags != null ? tags.size() : 0;
    Set<Long> tagIds = new HashSet<Long>(s);
    
    if (tags != null) {
      for (Tag t : tags)
        tagIds.add(t.getId());
    }

    msg.setCommunicatorMessageId(communicatorMessageId);
    msg.setSender(sender);
    msg.setCategory(category);
    msg.setCaption(caption);
    msg.setContent(content);
    msg.setCreated(created);
    msg.setTags(tagIds);
    msg.setArchivedBySender(false);
    msg.setTrashedBySender(false);
    
    getEntityManager().persist(msg);
    
    return msg;
  }

  private List<CommunicatorThreadBasicInfo> listUserThreadBasicInfos(UserEntity userEntity, CommunicatorFolderType type, CommunicatorLabel label) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorThreadBasicInfo> criteria = criteriaBuilder.createQuery(CommunicatorThreadBasicInfo.class);
    
    switch (type) {
      case UNREAD: {
        Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
        Join<CommunicatorMessageRecipient, CommunicatorMessage> messageJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);
        criteria.multiselect(messageJoin.get(CommunicatorMessage_.communicatorMessageId), criteriaBuilder.greatest(messageJoin.get(CommunicatorMessage_.created)));
        criteria.where(
          criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), userEntity.getId()),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.readByReceiver), Boolean.FALSE),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.trashedByReceiver), Boolean.FALSE),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
          )
        );
        criteria.groupBy(messageJoin.get(CommunicatorMessage_.communicatorMessageId));
      } 
      break;
      
      case LABEL: {
        Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
        Join<CommunicatorMessageRecipient, CommunicatorMessage> messageJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);
        Join<CommunicatorMessage, CommunicatorMessageId> threadJoin = messageJoin.join(CommunicatorMessage_.communicatorMessageId);
        criteria.multiselect(messageJoin.get(CommunicatorMessage_.communicatorMessageId), criteriaBuilder.greatest(messageJoin.get(CommunicatorMessage_.created)));
        Root<CommunicatorMessageIdLabel> labelRoot = criteria.from(CommunicatorMessageIdLabel.class);

        criteria.where(
          criteriaBuilder.and(
            criteriaBuilder.equal(labelRoot.get(CommunicatorMessageIdLabel_.communicatorMessageId), threadJoin.get(CommunicatorMessageId_.id)),
            criteriaBuilder.equal(labelRoot.get(CommunicatorMessageIdLabel_.label), label),
            
            criteriaBuilder.or(
              criteriaBuilder.and(
                criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), userEntity.getId()),
                criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.trashedByReceiver), Boolean.FALSE),
                criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
              ),
              criteriaBuilder.and(
                criteriaBuilder.equal(messageJoin.get(CommunicatorMessage_.sender), userEntity.getId()),
                criteriaBuilder.equal(messageJoin.get(CommunicatorMessage_.trashedBySender), Boolean.FALSE),
                criteriaBuilder.equal(messageJoin.get(CommunicatorMessage_.archivedBySender), Boolean.FALSE)
              )
            )
          )
        );
        criteria.groupBy(messageJoin.get(CommunicatorMessage_.communicatorMessageId));
      }
      break;

      case SENT: {
        Root<CommunicatorMessage> root = criteria.from(CommunicatorMessage.class);
        criteria.multiselect(root.get(CommunicatorMessage_.communicatorMessageId), criteriaBuilder.greatest(root.get(CommunicatorMessage_.created)));
        criteria.where(
          criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorMessage_.sender), userEntity.getId()),
            criteriaBuilder.equal(root.get(CommunicatorMessage_.archivedBySender), Boolean.FALSE),
            criteriaBuilder.equal(root.get(CommunicatorMessage_.trashedBySender), Boolean.FALSE)
          )
        );
        criteria.groupBy(root.get(CommunicatorMessage_.communicatorMessageId));
      }
      break;

      case INBOX: {
        Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
        Join<CommunicatorMessageRecipient, CommunicatorMessage> messageJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);
        criteria.multiselect(messageJoin.get(CommunicatorMessage_.communicatorMessageId), criteriaBuilder.greatest(messageJoin.get(CommunicatorMessage_.created)));
        criteria.where(
          criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), userEntity.getId()),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.trashedByReceiver), Boolean.FALSE),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
          )
        );
        criteria.groupBy(messageJoin.get(CommunicatorMessage_.communicatorMessageId));
      }
      break;
      
      case TRASH: {
        Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
        Join<CommunicatorMessageRecipient, CommunicatorMessage> messageJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);
        criteria.multiselect(messageJoin.get(CommunicatorMessage_.communicatorMessageId), criteriaBuilder.greatest(messageJoin.get(CommunicatorMessage_.created)));
        criteria.where(
          criteriaBuilder.or(
            criteriaBuilder.and(
              criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), userEntity.getId()),
              criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.trashedByReceiver), type == CommunicatorFolderType.TRASH),
              criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
            ),
            criteriaBuilder.and(
              criteriaBuilder.equal(messageJoin.get(CommunicatorMessage_.sender), userEntity.getId()),
              criteriaBuilder.equal(messageJoin.get(CommunicatorMessage_.trashedBySender), type == CommunicatorFolderType.TRASH),
              criteriaBuilder.equal(messageJoin.get(CommunicatorMessage_.archivedBySender), Boolean.FALSE)
            )
          )
        );
        criteria.groupBy(messageJoin.get(CommunicatorMessage_.communicatorMessageId));
      }
      break;
    }

    List<CommunicatorThreadBasicInfo> threads = entityManager.createQuery(criteria).getResultList();
    
    Collections.sort(threads, new Comparator<CommunicatorThreadBasicInfo>() {
      @Override
      public int compare(CommunicatorThreadBasicInfo o1, CommunicatorThreadBasicInfo o2) {
        return o2.getLatestThread().compareTo(o1.getLatestThread());
      }
    });
    
    return threads;
  }
  
  public CommunicatorMessageId findOlderThreadId(UserEntity userEntity, CommunicatorMessageId threadId, CommunicatorFolderType type, CommunicatorLabel label) {
    List<CommunicatorThreadBasicInfo> threads = listUserThreadBasicInfos(userEntity, type, label);
    
    int index = 0;
    while ((index < threads.size()) && (!Objects.equals(threadId.getId(), threads.get(index).getThreadId().getId()))) {
      index++;
    }

    // Next, older thread
    if ((index >= 0) && (index < threads.size() - 1))
      return threads.get(index + 1).getThreadId();
    else
      return null;
  }

  public CommunicatorMessageId findNewerThreadId(UserEntity userEntity, CommunicatorMessageId threadId, CommunicatorFolderType type, CommunicatorLabel label) {
    List<CommunicatorThreadBasicInfo> threads = listUserThreadBasicInfos(userEntity, type, label);
    
    int index = 0;
    while ((index < threads.size()) && (!Objects.equals(threadId.getId(), threads.get(index).getThreadId().getId()))) {
      index++;
    }

    // Previous, newer thread
    if ((index > 0) && (index < threads.size()))
      return threads.get(index - 1).getThreadId();
    else
      return null;
  }
  
  public List<CommunicatorMessage> listThreadsInTrash(UserEntity user, Integer firstResult, Integer maxResults) {
    EntityManager entityManager = getEntityManager();
    
    // Trashed sent messages
    
    CriteriaBuilder messageCriteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> messageCriteria = messageCriteriaBuilder.createQuery(CommunicatorMessage.class);
    Root<CommunicatorMessage> messageRoot = messageCriteria.from(CommunicatorMessage.class);
    messageCriteria.select(messageRoot);
    List<Predicate> messagePredicates = new ArrayList<Predicate>();
    messagePredicates.add(messageCriteriaBuilder.equal(messageRoot.get(CommunicatorMessage_.sender), user.getId()));
    messagePredicates.add(messageCriteriaBuilder.equal(messageRoot.get(CommunicatorMessage_.trashedBySender), Boolean.TRUE));
    messagePredicates.add(messageCriteriaBuilder.equal(messageRoot.get(CommunicatorMessage_.archivedBySender), Boolean.FALSE));
    messageCriteria.where(messageCriteriaBuilder.and(messagePredicates.toArray(new Predicate[0])));
    List<CommunicatorMessage> trashedMessages = entityManager.createQuery(messageCriteria).getResultList();
    
    // Trashed received messages
    
    CriteriaBuilder recipientCriteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> recipientCriteria = recipientCriteriaBuilder.createQuery(CommunicatorMessage.class);
    Root<CommunicatorMessageRecipient> recipientRoot = recipientCriteria.from(CommunicatorMessageRecipient.class);
    recipientCriteria.select(recipientRoot.get(CommunicatorMessageRecipient_.communicatorMessage));
    List<Predicate> recipientPredicates = new ArrayList<Predicate>();
    recipientPredicates.add(recipientCriteriaBuilder.equal(recipientRoot.get(CommunicatorMessageRecipient_.recipient), user.getId()));
    recipientPredicates.add(recipientCriteriaBuilder.equal(recipientRoot.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE));
    recipientPredicates.add(recipientCriteriaBuilder.equal(recipientRoot.get(CommunicatorMessageRecipient_.trashedByReceiver), Boolean.TRUE));
    recipientCriteria.where(recipientCriteriaBuilder.and(recipientPredicates.toArray(new Predicate[0])));
    List<CommunicatorMessage> trashedReceivedMessages = entityManager.createQuery(recipientCriteria).getResultList();
    trashedMessages.addAll(trashedReceivedMessages);
    
    // Sort by thread, latest message in thread first
    
    Comparator<CommunicatorMessage> comparator = new Comparator<CommunicatorMessage>() {
      @Override
      public int compare(CommunicatorMessage o1, final CommunicatorMessage o2) {
        int result = o1.getCommunicatorMessageId().getId().compareTo(o2.getCommunicatorMessageId().getId());
        return result == 0 ? o2.getCreated().compareTo(o1.getCreated()) : result;
      }
    };
    trashedMessages.sort(comparator);
    
    // Filter to only the latest message in each thread
    
    if (!trashedMessages.isEmpty()) {
      int i = 0;
      while (i < trashedMessages.size()) {
        while (i < trashedMessages.size() - 1 && trashedMessages.get(i).getCommunicatorMessageId().getId().equals(trashedMessages.get(i + 1).getCommunicatorMessageId().getId())) {
          trashedMessages.remove(i + 1);
        }
        i++;
      }
      
      // Sort by latest message
      
      trashedMessages.sort(Comparator.comparing(CommunicatorMessage::getCreated).reversed());
    }
    
    // Return requested subset
    
    return trashedMessages.subList(firstResult, Math.min(trashedMessages.size(), firstResult + maxResults));
  }
  
  public List<CommunicatorMessage> listThreadsInLabelFolder(UserEntity user, CommunicatorLabel label, Integer firstResult, Integer maxResults) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);

    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> messageJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);
    Join<CommunicatorMessage, CommunicatorMessageId> threadJoin = messageJoin.join(CommunicatorMessage_.communicatorMessageId);
    Root<CommunicatorMessageIdLabel> labelJoin = criteria.from(CommunicatorMessageIdLabel.class);
    
    // SubQuery finds the latest date in a thread when linked to the main query 
    // and thus allows finding the latest message in the thread.
    Subquery<Date> subQuery = criteria.subquery(Date.class);
    Root<CommunicatorMessageRecipient> subQueryRoot = subQuery.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> subMessageJoin = subQueryRoot.join(CommunicatorMessageRecipient_.communicatorMessage);
    Join<CommunicatorMessage, CommunicatorMessageId> subThreadJoin = subMessageJoin.join(CommunicatorMessage_.communicatorMessageId);
    Root<CommunicatorMessageIdLabel> subLabelJoin = criteria.from(CommunicatorMessageIdLabel.class);

    subQuery.select(criteriaBuilder.greatest(subMessageJoin.get(CommunicatorMessage_.created)));

    subQuery.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(subMessageJoin.get(CommunicatorMessage_.communicatorMessageId), messageJoin.get(CommunicatorMessage_.communicatorMessageId)),

        criteriaBuilder.equal(subLabelJoin.get(CommunicatorMessageIdLabel_.communicatorMessageId), subThreadJoin.get(CommunicatorMessageId_.id)),
        criteriaBuilder.equal(subLabelJoin.get(CommunicatorMessageIdLabel_.label), label),
        
        criteriaBuilder.or(
          criteriaBuilder.and(
            criteriaBuilder.equal(subQueryRoot.get(CommunicatorMessageRecipient_.recipient), user.getId()),
            criteriaBuilder.equal(subQueryRoot.get(CommunicatorMessageRecipient_.trashedByReceiver), Boolean.FALSE),
            criteriaBuilder.equal(subQueryRoot.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
          ),
          criteriaBuilder.and(
            criteriaBuilder.equal(subMessageJoin.get(CommunicatorMessage_.sender), user.getId()),
            criteriaBuilder.equal(subMessageJoin.get(CommunicatorMessage_.trashedBySender), Boolean.FALSE),
            criteriaBuilder.equal(subMessageJoin.get(CommunicatorMessage_.archivedBySender), Boolean.FALSE)
          )
        )
      )
    );
    
    criteria.select(messageJoin);

    criteria.where(
      criteriaBuilder.and(
        criteriaBuilder.equal(messageJoin.get(CommunicatorMessage_.created), subQuery),

        criteriaBuilder.equal(labelJoin.get(CommunicatorMessageIdLabel_.communicatorMessageId), threadJoin.get(CommunicatorMessageId_.id)),
        criteriaBuilder.equal(labelJoin.get(CommunicatorMessageIdLabel_.label), label),

        criteriaBuilder.or(
          criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), user.getId()),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.trashedByReceiver), Boolean.FALSE),
            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
          ),
          criteriaBuilder.and(
            criteriaBuilder.equal(messageJoin.get(CommunicatorMessage_.sender), user.getId()),
            criteriaBuilder.equal(messageJoin.get(CommunicatorMessage_.trashedBySender), Boolean.FALSE),
            criteriaBuilder.equal(messageJoin.get(CommunicatorMessage_.archivedBySender), Boolean.FALSE)
          )
        )
      )
    );

    criteria.groupBy(threadJoin);

    criteria.orderBy(criteriaBuilder.desc(
      messageJoin.get(CommunicatorMessage_.created)
    ));
    
    TypedQuery<CommunicatorMessage> query = entityManager.createQuery(criteria);
    
    query.setFirstResult(firstResult);
    query.setMaxResults(maxResults);
    
    return query.getResultList();
  }
  
  public List<CommunicatorMessage> listThreadsInInbox(UserEntity recipient, CommunicatorLabel label, boolean onlyUnread, Integer firstResult, Integer maxResults) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> messageJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);
    Join<CommunicatorMessage, CommunicatorMessageId> threadJoin = messageJoin.join(CommunicatorMessage_.communicatorMessageId);
    
    criteria.select(messageJoin);

    // SubQuery finds the latest date in a thread when linked to the main query 
    // and thus allows finding the latest message in the thread.
    Subquery<Date> subQuery = criteria.subquery(Date.class);
    Root<CommunicatorMessageRecipient> subQueryRoot = subQuery.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> subMessageJoin = subQueryRoot.join(CommunicatorMessageRecipient_.communicatorMessage);
    Join<CommunicatorMessage, CommunicatorMessageId> subThreadJoin = subMessageJoin.join(CommunicatorMessage_.communicatorMessageId);

    subQuery.select(criteriaBuilder.greatest(subMessageJoin.get(CommunicatorMessage_.created)));

    List<Predicate> subQueryPredicates = new ArrayList<Predicate>();
    subQueryPredicates.add(criteriaBuilder.equal(subMessageJoin.get(CommunicatorMessage_.communicatorMessageId), messageJoin.get(CommunicatorMessage_.communicatorMessageId)));
    subQueryPredicates.add(criteriaBuilder.equal(subQueryRoot.get(CommunicatorMessageRecipient_.recipient), recipient.getId()));
    subQueryPredicates.add(criteriaBuilder.equal(subQueryRoot.get(CommunicatorMessageRecipient_.trashedByReceiver), Boolean.FALSE));
    subQueryPredicates.add(criteriaBuilder.equal(subQueryRoot.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE));
    if (onlyUnread)
      subQueryPredicates.add(criteriaBuilder.equal(subQueryRoot.get(CommunicatorMessageRecipient_.readByReceiver), Boolean.FALSE));
    if (label != null) {
      Root<CommunicatorMessageIdLabel> subLabelRoot = criteria.from(CommunicatorMessageIdLabel.class);
      subQueryPredicates.add(subThreadJoin.in(subLabelRoot.get(CommunicatorMessageIdLabel_.communicatorMessageId)));
      subQueryPredicates.add(criteriaBuilder.equal(subLabelRoot.get(CommunicatorMessageIdLabel_.label), label));
    }      
    subQuery.where(criteriaBuilder.and(subQueryPredicates.toArray(new Predicate[0])));

    // Main Query
    
    List<Predicate> predicates = new ArrayList<Predicate>();
    predicates.add(criteriaBuilder.equal(messageJoin.get(CommunicatorMessage_.created), subQuery));
    predicates.add(criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), recipient.getId()));
    predicates.add(criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.trashedByReceiver), Boolean.FALSE));
    predicates.add(criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE));
    if (onlyUnread)
      predicates.add(criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.readByReceiver), Boolean.FALSE));
    if (label != null) {
      Root<CommunicatorMessageIdLabel> labelRoot = criteria.from(CommunicatorMessageIdLabel.class);
      predicates.add(threadJoin.in(labelRoot.get(CommunicatorMessageIdLabel_.communicatorMessageId)));
      predicates.add(criteriaBuilder.equal(labelRoot.get(CommunicatorMessageIdLabel_.label), label));
    }
    criteria.where(criteriaBuilder.and(predicates.toArray(new Predicate[0])));
    
    criteria.groupBy(threadJoin);
    
    criteria.orderBy(criteriaBuilder.desc(
      messageJoin.get(CommunicatorMessage_.created)
    ));
    
    TypedQuery<CommunicatorMessage> query = entityManager.createQuery(criteria);
    
    query.setFirstResult(firstResult);
    query.setMaxResults(maxResults);
    
    return query.getResultList();
  }
  
  public List<CommunicatorMessage> listThreadsInSent(UserEntity sender, Integer firstResult, Integer maxResults) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
    Root<CommunicatorMessage> root = criteria.from(CommunicatorMessage.class);
    
    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorMessage_.sender), sender.getId()),
            criteriaBuilder.equal(root.get(CommunicatorMessage_.trashedBySender), Boolean.FALSE),
            criteriaBuilder.equal(root.get(CommunicatorMessage_.archivedBySender), Boolean.FALSE)
        )
    );
    criteria.groupBy(root.get(CommunicatorMessage_.communicatorMessageId));
    
    criteria.orderBy(criteriaBuilder.desc(criteriaBuilder.greatest(root.get(CommunicatorMessage_.created))));
    
    TypedQuery<CommunicatorMessage> query = entityManager.createQuery(criteria);
    query.setFirstResult(firstResult);
    query.setMaxResults(maxResults);
    
    return query.getResultList();
  }

  public List<CommunicatorMessage> listMessagesInThread(UserEntity user, CommunicatorMessageId communicatorMessageId, boolean trashed, boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();

    CriteriaQuery<CommunicatorMessage> criteria;
    Root<CommunicatorMessage> CommunicatorMessage;
    criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
    CommunicatorMessage = criteria.from(CommunicatorMessage.class);
    Root<CommunicatorMessageRecipient> recipient = criteria.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> recipientMessage = 
        criteriaBuilder.treat(recipient.join(CommunicatorMessageRecipient_.communicatorMessage), CommunicatorMessage.class);
    criteria.select(CommunicatorMessage);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(CommunicatorMessage.get(CommunicatorMessage_.id), recipientMessage.get(CommunicatorMessage_.id)),
            criteriaBuilder.equal(recipientMessage.get(CommunicatorMessage_.communicatorMessageId), communicatorMessageId),
            criteriaBuilder.equal(recipient.get(CommunicatorMessageRecipient_.recipient), user.getId()),
            criteriaBuilder.equal(recipient.get(CommunicatorMessageRecipient_.trashedByReceiver), trashed),
            criteriaBuilder.equal(recipient.get(CommunicatorMessageRecipient_.archivedByReceiver), archived)
        )
    );
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<CommunicatorMessage> listMessagesInThread(UserEntity user, CommunicatorMessageId communicatorMessageId) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();

    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
    Root<CommunicatorMessageRecipient> recipient = criteria.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> communicatorMessage = recipient.join(CommunicatorMessageRecipient_.communicatorMessage);
    
    criteria.select(communicatorMessage);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(communicatorMessage.get(CommunicatorMessage_.communicatorMessageId), communicatorMessageId),
            criteriaBuilder.equal(recipient.get(CommunicatorMessageRecipient_.recipient), user.getId())
        )
    );
    return entityManager.createQuery(criteria).getResultList();
  }
  
  /**
   * Returns the number of messages the user can see in a thread in either inbox/sent or in trash
   * depending on the value of trashed parameter.
   * 
   * @param user
   * @param communicatorMessageId
   * @param trashed
   * @return
   */
  public Long countMessagesByUserAndMessageId(UserEntity user, CommunicatorMessageId communicatorMessageId, boolean trashed) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
    Join<CommunicatorMessageRecipient, CommunicatorMessage> msgJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);

    criteria.select(criteriaBuilder.countDistinct(msgJoin));
    
    criteria.where(
        criteriaBuilder.or(
          criteriaBuilder.and(
              criteriaBuilder.equal(msgJoin.get(CommunicatorMessage_.communicatorMessageId), communicatorMessageId),
              criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), user.getId()),
              criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.trashedByReceiver), trashed),
              criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
          ),
          criteriaBuilder.and(
              criteriaBuilder.equal(msgJoin.get(CommunicatorMessage_.communicatorMessageId), communicatorMessageId),
              criteriaBuilder.equal(msgJoin.get(CommunicatorMessage_.sender), user.getId()),
              criteriaBuilder.equal(msgJoin.get(CommunicatorMessage_.trashedBySender), trashed),
              criteriaBuilder.equal(msgJoin.get(CommunicatorMessage_.archivedBySender), Boolean.FALSE)
          )
        )
    );
    
    return entityManager.createQuery(criteria).getSingleResult();
  }

  /**
   * Returns the maximum value of the id field of CommunicatorMessage.
   * 
   * @return the max id
   */
  public Long getMaximumCommunicatorMessageId() {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
    Root<CommunicatorMessage> root = criteria.from(CommunicatorMessage.class);

    criteria.select(criteriaBuilder.max(root.get(CommunicatorMessage_.id)));
    
    return entityManager.createQuery(criteria).getSingleResult();
  }

  /**
   * Return messages in reverse id order starting from the highest id (included in results).
   * 
   * @param highestId message with highest id
   * @param maxResults maximum results to return
   * @return messages in reverse order starting from the highest index
   */
  public List<CommunicatorMessage> listAllMessagesInReverseFromId(Long highestId, int maxResults) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
    Root<CommunicatorMessage> root = criteria.from(CommunicatorMessage.class);

    criteria.select(root).orderBy(criteriaBuilder.desc(root.get(CommunicatorMessage_.id)));
    criteria.where(
        criteriaBuilder.lessThanOrEqualTo(root.get(CommunicatorMessage_.id), highestId)
    );
    
    return entityManager.createQuery(criteria).setMaxResults(maxResults).getResultList();
  }
  
  public List<CommunicatorMessage> listMessagesInSentThread(UserEntity sender, CommunicatorMessageId communicatorMessageId, boolean trashed, boolean archived) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
    Root<CommunicatorMessage> root = criteria.from(CommunicatorMessage.class);

    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorMessage_.communicatorMessageId), communicatorMessageId),
            criteriaBuilder.equal(root.get(CommunicatorMessage_.sender), sender.getId()),
            criteriaBuilder.equal(root.get(CommunicatorMessage_.trashedBySender), trashed),
            criteriaBuilder.equal(root.get(CommunicatorMessage_.archivedBySender), archived)
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }
  
  public List<CommunicatorMessage> listMessagesInSentThread(UserEntity sender, CommunicatorMessageId communicatorMessageId) {
    EntityManager entityManager = getEntityManager(); 
    
    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
    Root<CommunicatorMessage> root = criteria.from(CommunicatorMessage.class);

    criteria.select(root);
    criteria.where(
        criteriaBuilder.and(
            criteriaBuilder.equal(root.get(CommunicatorMessage_.communicatorMessageId), communicatorMessageId),
            criteriaBuilder.equal(root.get(CommunicatorMessage_.sender), sender.getId())
        )
    );
    
    return entityManager.createQuery(criteria).getResultList();
  }

  public CommunicatorMessage updateTrashedBySender(CommunicatorMessage msg, boolean trashed) {
    msg.setTrashedBySender(trashed);
    
    getEntityManager().persist(msg);
    
    return msg;
  }

  public CommunicatorMessage updateArchivedBySender(CommunicatorMessage msg, boolean archived) {
    msg.setArchivedBySender(archived);
    
    getEntityManager().persist(msg);
    
    return msg;
  }

  @Override
  public void delete(CommunicatorMessage e) {
    super.delete(e);
  }

}