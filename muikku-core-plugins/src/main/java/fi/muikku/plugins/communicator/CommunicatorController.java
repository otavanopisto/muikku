package fi.muikku.plugins.communicator;

import java.util.Date;
import java.util.List;

import javax.ejb.Stateful;
import javax.enterprise.context.Dependent;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;
import javax.inject.Named;

import fi.muikku.dao.courses.CourseEntityDAO;
import fi.muikku.dao.forum.ForumThreadDAO;
import fi.muikku.dao.forum.ForumThreadReplyDAO;
import fi.muikku.dao.users.UserEntityDAO;
import fi.muikku.dao.wall.CourseWallDAO;
import fi.muikku.dao.wall.EnvironmentWallDAO;
import fi.muikku.dao.wall.UserWallDAO;
import fi.muikku.dao.wall.WallDAO;
import fi.muikku.dao.wall.WallEntryDAO;
import fi.muikku.dao.wall.WallEntryGuidanceRequestItemDAO;
import fi.muikku.dao.wall.WallEntryItemDAO;
import fi.muikku.dao.wall.WallEntryReplyDAO;
import fi.muikku.dao.wall.WallEntryTextItemDAO;
import fi.muikku.dao.wall.subscription.ForumAreaSubscriptionDAO;
import fi.muikku.dao.wall.subscription.UserWallSubscriptionDAO;
import fi.muikku.dao.wall.subscription.WallSubscriptionDAO;
import fi.muikku.model.stub.users.UserEntity;
import fi.muikku.plugins.communicator.dao.CommunicatorMessageDAO;
import fi.muikku.plugins.communicator.dao.CommunicatorMessageIdDAO;
import fi.muikku.plugins.communicator.dao.CommunicatorMessageRecipientDAO;
import fi.muikku.plugins.communicator.model.CommunicatorMessage;
import fi.muikku.plugins.communicator.model.CommunicatorMessageId;
import fi.muikku.plugins.communicator.model.CommunicatorMessageRecipient;
import fi.muikku.schooldata.CourseSchoolDataController;
import fi.muikku.schooldata.UserSchoolDataController;
import fi.muikku.session.SessionController;
import fi.tranquil.Tranquility;

@Dependent
@Stateful
@Named("Communicator")
public class CommunicatorController {
  @Inject
  private UserEntityDAO userDAO;

  @Inject
  private WallDAO wallDAO;

  @Inject
  private WallEntryDAO wallEntryDAO;

  @Inject
  private UserWallDAO userWallDAO;

  @Inject
  private UserWallSubscriptionDAO userWallLinkDAO;

  @Inject
  private ForumAreaSubscriptionDAO forumAreaSubscriptionDAO;
  
  @Inject
  private WallSubscriptionDAO wallSubscriptionDAO;

  @Inject
  private SessionController sessionController;

  @Inject
  private CourseEntityDAO courseDAO;
  
  @Inject
  private CourseWallDAO courseWallDAO;
  
  @Inject
  private WallEntryReplyDAO wallEntryCommentDAO;
  
  @Inject
  private WallEntryItemDAO abstractWallEntryItemDAO;
  
  @Inject
  private EnvironmentWallDAO environmentWallDAO;
  
  @Inject
  private UserSchoolDataController userController;
  
  @Inject
  private CourseSchoolDataController courseSchoolDataController;

  @Inject
  private ForumThreadDAO forumThreadDAO;
  
  @Inject
  private ForumThreadReplyDAO forumThreadReplyDAO;
  
  @Inject
  private WallEntryTextItemDAO wallEntryTextItemDAO;

  @Inject
  private WallEntryGuidanceRequestItemDAO wallEntryGuidanceRequestItemDAO; 

  @Inject
  private WallEntryReplyDAO wallEntryReplyDAO;

  @Inject
  private CommunicatorMessageDAO communicatorMessageDAO;
  
  @Inject
  private CommunicatorMessageRecipientDAO communicatorMessageRecipientDAO;

  @Inject
  private CommunicatorMessageIdDAO communicatorMessageIdDAO;
  
  /**
   * 
   * @param user
   * @return
   */

  public List<CommunicatorMessage> listReceivedItems(UserEntity userEntity) {
    return communicatorMessageDAO.listFirstMessagesByRecipient(userEntity);
  }
  
  public void TEST_MAIL_SEND() {
    CommunicatorMessageId communicatorMessageId = communicatorMessageIdDAO.create();
    
    CommunicatorMessage message = communicatorMessageDAO.create(communicatorMessageId, sessionController.getUser().getId(), 
        "Test mail", "Testing mail creation", new Date());
    communicatorMessageRecipientDAO.create(message, sessionController.getUser().getId());

    message = communicatorMessageDAO.create(communicatorMessageId, sessionController.getUser().getId(), 
        "Re: Test mail", "Reply to mail creation", new Date());
    communicatorMessageRecipientDAO.create(message, sessionController.getUser().getId());
  }

  public CommunicatorMessageId createMessageId() {
    return communicatorMessageIdDAO.create();
  }
  
  public CommunicatorMessage createMessage(CommunicatorMessageId communicatorMessageId, UserEntity sender, List<UserEntity> recipients, 
      String caption, String content) {
    CommunicatorMessage message = communicatorMessageDAO.create(communicatorMessageId, sender.getId(), caption, content, new Date());
    
    for (UserEntity recipient : recipients) {
      communicatorMessageRecipientDAO.create(message, recipient.getId());
    }
    
    return message;
  }

  public CommunicatorMessageId findCommunicatorMessageId(Long communicatorMessageId) {
    return communicatorMessageIdDAO.findById(communicatorMessageId);
  }

  public List<CommunicatorMessage> listInboxMessagesByMessageId(UserEntity user, CommunicatorMessageId messageId) {
    return communicatorMessageDAO.listMessagesByRecipientAndMessageId(user, messageId);
  }

  public CommunicatorMessage findCommunicatorMessageById(Long communicatorMessageId) {
    return communicatorMessageDAO.findById(communicatorMessageId);
  }
  
  public List<CommunicatorMessageRecipient> listCommunicatorMessageRecipients(CommunicatorMessage communicatorMessage) {
    return communicatorMessageRecipientDAO.listByMessage(communicatorMessage);
  }

  public Long countMessagesByRecipientAndMessageId(UserEntity recipient, CommunicatorMessageId communicatorMessageId) {
    return communicatorMessageDAO.countMessagesByRecipientAndMessageId(recipient, communicatorMessageId);
  }
  
}
