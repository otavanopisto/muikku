package fi.otavanopisto.muikku.plugins.seeker;

import java.util.List;

public interface SeekerResultProvider {
  String getName();
  List<SeekerResult> search(String searchTerm);
  int getWeight();
}
