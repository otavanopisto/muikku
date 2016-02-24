package fi.muikku.plugins.forum;

import javax.inject.Inject;

import fi.muikku.model.users.UserEntity;
import fi.muikku.plugins.forum.model.ForumArea;
import fi.muikku.security.UserContextResolver;
import fi.muikku.users.UserEntityController;
import fi.otavanopisto.security.ContextReference;

public class ForumAreaOwnerContextResolverImpl implements UserContextResolver {

  @Inject
  private UserEntityController userEntityController;
  
  @Override
  public boolean handlesContextReference(ContextReference contextReference) {
    return ForumArea.class.isInstance(contextReference);
  }

  @Override
  public UserEntity resolveUser(ContextReference contextReference) {
    ForumArea forumArea = (ForumArea) contextReference;
    return userEntityController.findUserEntityById(forumArea.getOwner());
  }
  
}
