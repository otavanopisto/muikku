package fi.otavanopisto.muikku.plugins.search;

import java.util.List;
import java.util.Set;

import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.search.AbstractWorkspaceSearchBuilder;
import fi.otavanopisto.muikku.search.IndexedWorkspace;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.search.SearchResults;

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

  @Override
  public SearchResults<List<IndexedWorkspace>> searchTyped() {
    return elastic.searchIndexedWorkspaces(
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

  @Override
  public Set<SchoolDataIdentifier> listDistinctWorkspaceCurriculums() {
    return elastic.listDistinctWorkspaceCurriculums(getOrganizationRestrictions(), getAccesses(), getAccessUser());
  }

  @Override
  public Set<SchoolDataIdentifier> listDistinctWorkspaceEducationTypes() {
    return elastic.listDistinctWorkspaceEducationTypes(getOrganizationRestrictions(), getAccesses(), getAccessUser());
  }

  private ElasticSearchProvider elastic;

}
