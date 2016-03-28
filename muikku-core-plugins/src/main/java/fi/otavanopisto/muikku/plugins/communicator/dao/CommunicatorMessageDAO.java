package fi.otavanopisto.muikku.plugins.communicator.dao;


import fi.otavanopisto.muikku.plugins.CorePluginsDAO;
import fi.otavanopisto.muikku.plugins.communicator.model.CommunicatorMessage;


public class CommunicatorMessageDAO extends CorePluginsDAO<CommunicatorMessage> {
	
  private static final long serialVersionUID = -8721990589622544635L;

//  public CommunicatorMessage create(CommunicatorMessageId communicatorMessageId, Long sender,
//      String caption, String content, Date created, Set<Tag> tags) {
//    CommunicatorMessage msg = new CommunicatorMessage();
//    
//    Set<Long> tagIds = new HashSet<Long>(tags.size());
//    for (Tag t : tags)
//      tagIds.add(t.getId());
//
//    msg.setCommunicatorMessageId(communicatorMessageId);
//    msg.setSender(sender);
//    msg.setCaption(caption);
//    msg.setContent(content);
//    msg.setCreated(created);
//    msg.setTags(tagIds);
//    
//    getEntityManager().persist(msg);
//    
//    return msg;
//  }
// 
//  public List<CommunicatorMessage> listFirstMessagesByRecipient(UserEntity recipient) {
//    EntityManager entityManager = getEntityManager(); 
//    
//    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
//    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
//    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
//    Join<CommunicatorMessageRecipient, CommunicatorMessage> msgJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);
//
//    criteria.select(msgJoin);
//    criteria.where(
//        criteriaBuilder.and(
//            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), recipient.getId()),
//            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
//        )
//    );
//    criteria.groupBy(msgJoin.get(CommunicatorMessage_.communicatorMessageId));
//    
//    return entityManager.createQuery(criteria).getResultList();
//  }
//
//  public List<CommunicatorMessage> listFirstMessagesBySender(UserEntity sender) {
//    EntityManager entityManager = getEntityManager(); 
//    
//    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
//    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
//    Root<CommunicatorMessage> root = criteria.from(CommunicatorMessage.class);
//
//    criteria.select(root);
//    criteria.where(
//        criteriaBuilder.and(
//            criteriaBuilder.equal(root.get(CommunicatorMessage_.sender), sender.getId()),
//            criteriaBuilder.equal(root.get(CommunicatorMessage_.archivedBySender), Boolean.FALSE)
//        )
//    );
//    criteria.groupBy(root.get(CommunicatorMessage_.communicatorMessageId));
//    
//    return entityManager.createQuery(criteria).getResultList();
//  }
//
//  public List<CommunicatorMessage> listMessagesByRecipientAndMessageId(UserEntity recipient, CommunicatorMessageId communicatorMessageId) {
//    EntityManager entityManager = getEntityManager(); 
//    
//    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
//    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
//    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
//    Join<CommunicatorMessageRecipient, CommunicatorMessage> msgJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);
//
//    criteria.select(msgJoin);
//    criteria.where(
//        criteriaBuilder.and(
//            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), recipient.getId()),
//            criteriaBuilder.equal(msgJoin.get(CommunicatorMessage_.communicatorMessageId), communicatorMessageId),
//            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
//        )
//    );
//    
//    return entityManager.createQuery(criteria).getResultList();
//  }
//  
//  public List<CommunicatorMessage> listFirstBySender(UserEntity sender) {
//    EntityManager entityManager = getEntityManager(); 
//    
//    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
//    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
//    Root<CommunicatorMessage> root = criteria.from(CommunicatorMessage.class);
//
//    criteria.select(root);
//    criteria.where(
//        criteriaBuilder.and(
//            criteriaBuilder.equal(root.get(CommunicatorMessage_.sender), sender.getId()),
//            criteriaBuilder.equal(root.get(CommunicatorMessage_.archivedBySender), Boolean.FALSE)
//        )
//    );
//    criteria.groupBy(root.get(CommunicatorMessage_.communicatorMessageId));
//    
//    return entityManager.createQuery(criteria).getResultList();
//  }
//
//  public Long countMessagesByRecipientAndMessageId(UserEntity recipient, CommunicatorMessageId communicatorMessageId) {
//    EntityManager entityManager = getEntityManager(); 
//    
//    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
//    CriteriaQuery<Long> criteria = criteriaBuilder.createQuery(Long.class);
//    Root<CommunicatorMessageRecipient> root = criteria.from(CommunicatorMessageRecipient.class);
//    Join<CommunicatorMessageRecipient, CommunicatorMessage> msgJoin = root.join(CommunicatorMessageRecipient_.communicatorMessage);
//
//    criteria.select(criteriaBuilder.count(root));
//    
//    criteria.where(
//        criteriaBuilder.and(
//            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.recipient), recipient.getId()),
//            criteriaBuilder.equal(msgJoin.get(CommunicatorMessage_.communicatorMessageId), communicatorMessageId),
//            criteriaBuilder.equal(root.get(CommunicatorMessageRecipient_.archivedByReceiver), Boolean.FALSE)
//        )
//    );
//    
//    return entityManager.createQuery(criteria).getSingleResult();
//  }
//
//  public List<CommunicatorMessage> listBySenderAndMessageId(UserEntity sender, CommunicatorMessageId messageId) {
//    EntityManager entityManager = getEntityManager(); 
//    
//    CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
//    CriteriaQuery<CommunicatorMessage> criteria = criteriaBuilder.createQuery(CommunicatorMessage.class);
//    Root<CommunicatorMessage> root = criteria.from(CommunicatorMessage.class);
//
//    criteria.select(root);
//    criteria.where(
//        criteriaBuilder.and(
//            criteriaBuilder.equal(root.get(CommunicatorMessage_.sender), sender.getId()),
//            criteriaBuilder.equal(root.get(CommunicatorMessage_.archivedBySender), Boolean.FALSE)
//        )
//    );
//    
//    return entityManager.createQuery(criteria).getResultList();
//  }
//
//  public CommunicatorMessage archiveSent(CommunicatorMessage msg) {
//    msg.setArchivedBySender(true);
//    
//    getEntityManager().persist(msg);
//    
//    return msg;
//  }
  
}
