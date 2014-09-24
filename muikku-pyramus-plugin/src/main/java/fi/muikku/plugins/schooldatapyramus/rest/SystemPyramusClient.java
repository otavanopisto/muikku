package fi.muikku.plugins.schooldatapyramus.rest;

import javax.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class SystemPyramusClient extends AbstractPyramusClient {

  @Override
  protected String getAccessToken() {
    // TODO: Replace with actual implementation
    return createAccessToken().getAccessToken();
  }
  
}
