package fi.otavanopisto.muikku.plugins.communicator;

import java.util.ArrayList;
import java.util.List;

import javax.inject.Inject;

import fi.otavanopisto.muikku.i18n.LocaleController;
import fi.otavanopisto.muikku.plugins.seeker.SeekerResult;
import fi.otavanopisto.muikku.plugins.seeker.SeekerResultImpl;
import fi.otavanopisto.muikku.plugins.seeker.SeekerResultProvider;
import fi.otavanopisto.muikku.session.SessionController;

public class CommunicatorSeekerResultProvider implements SeekerResultProvider {

  @Inject
  private LocaleController localeController;

  @Inject
  private SessionController sessionController;

  @Override
  public List<SeekerResult> search(String searchTerm) {
    List<SeekerResult> result = new ArrayList<SeekerResult>();

    String searchTerms = localeController.getText(sessionController.getLocale(), "plugin.communicator.seekersearchterms").toLowerCase();

    if (searchTerms.contains(searchTerm.toLowerCase()))
      result.add(new SeekerResultImpl("communicator/communicator_seekerresult.dust"));

    return result;
  }

  @Override
  public String getName() {
    return "Communicator";
  }

  @Override
  public int getWeight() {
    return 1;
  }
}
