package fi.otavanopisto.muikku.plugins.search;

import fi.otavanopisto.muikku.search.AbstractWorkspaceSearchBuilder;
import fi.otavanopisto.muikku.search.SearchResult;

public class ElasticWorkspaceSearchBuilder extends AbstractWorkspaceSearchBuilder {

  public ElasticWorkspaceSearchBuilder(ElasticSearchProvider elastic) {
    this.elastic = elastic;
  }
  
  @Override
  public SearchResult search() {
    return elastic.searchWorkspaces(
        getSubjects(),
        getWorkspaceIdentifiers(),
        getEducationTypeIdentifiers(),
        getCurriculumIdentifiers(),
        getOrganizationRestrictions(),
        getFreeText(),
        getAccesses(),
        getAccessUser(),
        getFirstResult(),
        getMaxResults(),
        getSorts()
    );
  }

  private ElasticSearchProvider elastic;
}
