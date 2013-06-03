package fi.muikku.plugins.seeker;

import java.util.List;

public interface SeekerResultProvider {

  List<SeekerResult> search(String searchTerm);
}
