package fi.otavanopisto.muikku.plugins.search;

import static org.elasticsearch.index.query.QueryBuilders.boolQuery;
import static org.elasticsearch.index.query.QueryBuilders.existsQuery;
import static org.elasticsearch.index.query.QueryBuilders.idsQuery;
import static org.elasticsearch.index.query.QueryBuilders.prefixQuery;
import static org.elasticsearch.index.query.QueryBuilders.rangeQuery;
import static org.elasticsearch.index.query.QueryBuilders.termQuery;
import static org.elasticsearch.index.query.QueryBuilders.termsQuery;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoField;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpHost;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.Requests;
import org.elasticsearch.client.RestClient;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.document.DocumentField;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.IdsQueryBuilder;
import org.elasticsearch.index.query.Operator;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.aggregations.AggregationBuilder;
import org.elasticsearch.search.aggregations.AggregationBuilders;
import org.elasticsearch.search.aggregations.bucket.terms.Terms;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.sort.SortOrder;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JSR310Module;

import fi.otavanopisto.muikku.model.users.EnvironmentRoleArchetype;
import fi.otavanopisto.muikku.model.users.OrganizationEntity;
import fi.otavanopisto.muikku.model.users.UserEntity;
import fi.otavanopisto.muikku.model.workspace.WorkspaceAccess;
import fi.otavanopisto.muikku.model.workspace.WorkspaceEntity;
import fi.otavanopisto.muikku.schooldata.SchoolDataIdentifier;
import fi.otavanopisto.muikku.schooldata.WorkspaceEntityController;
import fi.otavanopisto.muikku.schooldata.entity.UserGroup;
import fi.otavanopisto.muikku.search.CommunicatorMessageSearchBuilder;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessage;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessageRecipient;
import fi.otavanopisto.muikku.search.IndexedCommunicatorMessageSender;
import fi.otavanopisto.muikku.search.IndexedUser;
import fi.otavanopisto.muikku.search.IndexedWorkspace;
import fi.otavanopisto.muikku.search.SearchProvider;
import fi.otavanopisto.muikku.search.SearchResult;
import fi.otavanopisto.muikku.search.SearchResults;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder;
import fi.otavanopisto.muikku.search.WorkspaceSearchBuilder.OrganizationRestriction;
import fi.otavanopisto.muikku.session.SessionController;

@ApplicationScoped
public class ElasticSearchProvider implements SearchProvider {
  
  public static final String MUIKKU_COMMUNICATORMESSAGE_INDEX = IndexedCommunicatorMessage.INDEX_NAME;
  public static final String MUIKKU_USER_INDEX = IndexedUser.INDEX_NAME;
  public static final String MUIKKU_USERGROUP_INDEX = UserGroup.INDEX_NAME;
  public static final String MUIKKU_WORKSPACE_INDEX = IndexedWorkspace.INDEX_NAME;
  
  @Inject
  private Logger logger;

  @Inject
  private WorkspaceEntityController workspaceEntityController;

  @Inject
  private SessionController sessionController;

  @Override
  public void init() {
    String portNumberProperty = System.getProperty("elasticsearch.node.port");
    int portNumber;
    if (portNumberProperty != null) {
      portNumber = Integer.decode(portNumberProperty);
    } else {
      portNumber = 9200;
    }

    elasticClient = new RestHighLevelClient(
        RestClient.builder(new HttpHost("localhost", portNumber, "http")));    
  }

  @Override
  public void deinit() {
    try {
      elasticClient.close();
    } catch (IOException e) {
      logger.log(Level.SEVERE, "Failed to shutdown elastic connection.", e);
    }
  }

  private String sanitizeSearchString(String query) {
    if (query == null)
      return null;

    // TODO: query_string search for case insensitive searches??
    // http://stackoverflow.com/questions/17266830/case-insensitivity-does-not-work
    String ret = query.toLowerCase();

    // Escape special characters including elastic's control characters and some other additions
    String escapedCharacters = Pattern.quote("\\/+-&|!(){}[]^~*?:" + ".,");

    ret = ret.replaceAll(String.format("([%s])", escapedCharacters), " ");

    // Trims and removes double spaces (incl. tabs etc)
    ret = StringUtils.normalizeSpace(ret);

    return ret;
  }

  /**
   * Shortcut to run a search with elasticClient when searchSourceBuilder needs to be modified (f.ex. sorts).
   */
  private SearchResponse searchRequest(String index, SearchSourceBuilder searchSourceBuilder) throws IOException {
    SearchRequest searchRequest = Requests.searchRequest(index);
    searchRequest.source(searchSourceBuilder);

    return elasticClient.search(searchRequest, RequestOptions.DEFAULT);
  }

  /**
   * Shortcut for the most basic search - search with given query from given index
   */
  private SearchResponse searchRequest(String index, QueryBuilder query) throws IOException {
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
        .query(query);

    return searchRequest(index, searchSourceBuilder);
  }

  /**
   * Shortcut for search with given query from given index with paging parameters.
   */
  private SearchResponse searchRequest(String index, QueryBuilder query, int from, int size) throws IOException {
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
        .query(query)
        .from(from)
        .size(size);
    
    return searchRequest(index, searchSourceBuilder);
  }

  @Override
  public SearchResult findWorkspace(SchoolDataIdentifier identifier) {
    BoolQueryBuilder query = boolQuery().must(termQuery("identifier", identifier.toId()));

    try {
      SearchResponse response = searchRequest(MUIKKU_WORKSPACE_INDEX, query);

      List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
      SearchHits searchHits = response.getHits();
      long totalHitCount = searchHits.getTotalHits().value;
      SearchHit[] results = searchHits.getHits();
      for (SearchHit hit : results) {
        Map<String, Object> hitSource = hit.getSourceAsMap();
        if (hitSource == null){
          hitSource = new HashMap<>();
          for(String key : hit.getFields().keySet()){
            hitSource.put(key, hit.getFields().get(key).getValue().toString());
          }
        }
        hitSource.put("indexType", "Workspace");
        searchResults.add(hitSource);
      }
      return new SearchResult(0, searchResults, totalHitCount);
    } catch (IOException e) {
      logger.log(Level.SEVERE, String.format("Workspace not found with identifier %s.", identifier), e);
      return new SearchResult(0, new ArrayList<Map<String, Object>>(), 0);
    }
  }

  @Override
  public SearchResult findUser(SchoolDataIdentifier identifier, boolean includeInactive) {

    // Query that checks activity based on user having a study end date set

    BoolQueryBuilder query = boolQuery();
    if (!includeInactive) {
      query.mustNot(existsQuery("studyEndDate"));
    }
    
    IdsQueryBuilder includeIdsQuery = idsQuery();
    includeIdsQuery.addIds(String.format("%s/%s", identifier.getIdentifier(), identifier.getDataSource()));
    query.must(includeIdsQuery);
    
    try {
      SearchResponse response = searchRequest(MUIKKU_USER_INDEX, query);

      List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
      SearchHits searchHits = response.getHits();
      long totalHitCount = searchHits.getTotalHits().value;
      SearchHit[] results = searchHits.getHits();
      for (SearchHit hit : results) {
        Map<String, Object> hitSource = hit.getSourceAsMap();
        if(hitSource == null){
          hitSource = new HashMap<>();
          for(String key : hit.getFields().keySet()){
            hitSource.put(key, hit.getFields().get(key).getValue().toString());
          }
        }
        hitSource.put("indexType", "User");
        searchResults.add(hitSource);
      }
      return new SearchResult(0, searchResults, totalHitCount);
    } catch (IOException e) {
      logger.log(Level.SEVERE, String.format("User not found by identifier %s.", identifier), e);
      return new SearchResult(0, Collections.emptyList(), 0);
    }
  }

  @Override
  public SearchResult searchUsers(List<OrganizationEntity> organizations, Set<SchoolDataIdentifier> studyProgrammeIdentifiers, String text, String[] textFields, Collection<EnvironmentRoleArchetype> roles,
      Collection<Long> groups, Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers,
      Boolean includeInactiveStudents, Boolean includeHidden, Boolean onlyDefaultUsers, int start, int maxResults,
      Collection<String> fields, Collection<SchoolDataIdentifier> excludeSchoolDataIdentifiers,
      Date startedStudiesBefore, Date studyTimeEndsBefore, boolean joinGroupsAndWorkspaces) {
    try {
      long now = OffsetDateTime.now().toEpochSecond();

      if (CollectionUtils.isEmpty(organizations)) {
        throw new IllegalArgumentException("Cannot search with no organizations specified.");
      }

      text = sanitizeSearchString(text);

      BoolQueryBuilder query = boolQuery();

      if (!Boolean.TRUE.equals(includeHidden)) {
        query.mustNot(termQuery("hidden", true));
      }

      if (Boolean.TRUE.equals(onlyDefaultUsers)) {
        query.filter(termQuery("isDefaultIdentifier", true));
      }

      if (StringUtils.isNotBlank(text) && !ArrayUtils.isEmpty(textFields)) {
        String[] words = text.split(" ");
        for (int i = 0; i < words.length; i++) {
          if (StringUtils.isNotBlank(words[i])) {
            BoolQueryBuilder fieldBuilder = boolQuery();
            for (String textField : textFields) {
              fieldBuilder.should(prefixQuery(textField, words[i]));
            }
            query.must(fieldBuilder);
          }
        }
      }

      if (excludeSchoolDataIdentifiers != null) {
        IdsQueryBuilder excludeIdsQuery = idsQuery();
        
        for (SchoolDataIdentifier excludeSchoolDataIdentifier : excludeSchoolDataIdentifiers) {
          excludeIdsQuery.addIds(String.format("%s/%s", excludeSchoolDataIdentifier.getIdentifier(), excludeSchoolDataIdentifier.getDataSource()));
        }
        query.mustNot(excludeIdsQuery);
      }

      if (startedStudiesBefore != null) {
        query.filter(rangeQuery("studyStartDate").lt((long) startedStudiesBefore.getTime() / 1000));
      }

      if (studyTimeEndsBefore != null) {
        query.filter(rangeQuery("studyTimeEnd").lt((long) studyTimeEndsBefore.getTime() / 1000));
      }

      if (roles != null) {
        List<String> roleNames = new ArrayList<>(roles.size());
        for (EnvironmentRoleArchetype role : roles) {
          roleNames.add(archetypeToIndexString(role));
        }

        query.filter(termsQuery("roles", roleNames.toArray(new String[0])));
      }

      Set<String> organizationIdentifiers = organizations
          .stream()
          .filter(Objects::nonNull).map(organization -> String.format("%s-%s", organization.getDataSource().getIdentifier(), organization.getIdentifier()))
          .collect(Collectors.toSet());
      if (CollectionUtils.isNotEmpty(organizationIdentifiers)) {
        query.filter(termsQuery("organizationIdentifier", organizationIdentifiers.toArray()));
      }
      
      // #6250: Limit search to given study programmes only (note that the search should only be about students in this case)
      
      if (studyProgrammeIdentifiers != null && !studyProgrammeIdentifiers.isEmpty()) {
        Set<String> studyProgrammeStrings = studyProgrammeIdentifiers.stream().map(SchoolDataIdentifier::toId).collect(Collectors.toSet());
        query.filter(termsQuery("studyProgrammeIdentifier", studyProgrammeStrings.toArray()));
      }

      // #6170: If both group and workspace filters have been provided, possibly treat them as a join rather than an intersection
      
      if (groups != null && workspaces != null && joinGroupsAndWorkspaces) {
        query.filter(
            boolQuery()
            .should(termsQuery("groups", ArrayUtils.toPrimitive(groups.toArray(new Long[0]))))
            .should(termsQuery("workspaces", ArrayUtils.toPrimitive(workspaces.toArray(new Long[0]))))
          );
      }
      else {
        if (groups != null) {
          query.filter(termsQuery("groups", ArrayUtils.toPrimitive(groups.toArray(new Long[0]))));
        }

        if (workspaces != null) {
          query.filter(termsQuery("workspaces", ArrayUtils.toPrimitive(workspaces.toArray(new Long[0]))));
        }
      }

      if (userIdentifiers != null) {
        IdsQueryBuilder includeIdsQuery = idsQuery();
        for (SchoolDataIdentifier userIdentifier : userIdentifiers) {
          includeIdsQuery.addIds(String.format("%s/%s", userIdentifier.getIdentifier(), userIdentifier.getDataSource()));
        }
        query.filter(includeIdsQuery);
      }

      if (includeInactiveStudents == false) {
        /**
         * List only active users.
         *
         * Active user is
         * - staff member (teacher, manager, study guider, study programme leader, administrator)
         * - student that has study start date (in the past) and no study end date
         * - student that has study start date (in the past) and study end date in the future
         * - student that has no study start and end date but belongs to an active workspace
         *
         * Active workspace is
         * - published and
         * - either has no start/end date or current date falls between them
         */

        Set<Long> activeWorkspaceEntityIds = getActiveWorkspaces();

        query.filter(
          boolQuery()
          .should(termsQuery("roles",
              archetypeToIndexString(EnvironmentRoleArchetype.TEACHER),
              archetypeToIndexString(EnvironmentRoleArchetype.MANAGER),
              archetypeToIndexString(EnvironmentRoleArchetype.STUDY_GUIDER),
              archetypeToIndexString(EnvironmentRoleArchetype.STUDY_PROGRAMME_LEADER),
              archetypeToIndexString(EnvironmentRoleArchetype.ADMINISTRATOR))
            )
            .should(boolQuery()
              .must(termQuery("roles", archetypeToIndexString(EnvironmentRoleArchetype.STUDENT)))
              .must(existsQuery("studyStartDate"))
              .must(rangeQuery("studyStartDate").lte(now))
              .mustNot(existsQuery("studyEndDate"))
            )
            .should(boolQuery()
              .must(termQuery("roles", archetypeToIndexString(EnvironmentRoleArchetype.STUDENT)))
              .must(existsQuery("studyStartDate"))
              .must(rangeQuery("studyStartDate").lte(now))
              .must(existsQuery("studyEndDate"))
              .must(rangeQuery("studyEndDate").gte(now))
            )
            .should(boolQuery()
              .must(termQuery("roles", archetypeToIndexString(EnvironmentRoleArchetype.STUDENT)))
              .mustNot(existsQuery("studyEndDate"))
              .mustNot(existsQuery("studyStartDate"))
              .must(termsQuery("workspaces", ArrayUtils.toPrimitive(activeWorkspaceEntityIds.toArray(new Long[0]))))
            )
        );
      }
      
      SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
          .query(query)
          .from(start)
          .size(maxResults)
          .sort("lastName.untouched", SortOrder.ASC)
          .sort("firstName.untouched", SortOrder.ASC);

      if (CollectionUtils.isNotEmpty(fields)) {
        fields.forEach(field -> searchSourceBuilder.fetchField(field)); // TODO Stored vs docfield vs fetchfield?
      }
      
      SearchResponse response = searchRequest(MUIKKU_USER_INDEX, searchSourceBuilder);
      
      List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
      SearchHits searchHits = response.getHits();
      long totalHitCount = searchHits.getTotalHits().value;
      SearchHit[] results = searchHits.getHits();
      for (SearchHit hit : results) {
        Map<String, Object> hitSource = hit.getSourceAsMap();
        if(hitSource == null){
          hitSource = new HashMap<>();
          for(String key : hit.getFields().keySet()){
            hitSource.put(key, hit.getFields().get(key).getValue().toString());
          }
        }
        hitSource.put("indexType", "User");
        searchResults.add(hitSource);
      }

      SearchResult result = new SearchResult(start, searchResults, totalHitCount);
      return result;
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResult(0, new ArrayList<Map<String,Object>>(), 0);
    }
  }

  @Override
  public SearchResult searchUsers(List<OrganizationEntity> organizations, Set<SchoolDataIdentifier> studyProgrammeIdentifiers, String text, String[] textFields, Collection<EnvironmentRoleArchetype> roles,
      Collection<Long> groups, Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers,
      Boolean includeInactiveStudents, Boolean includeHidden, Boolean onlyDefaultUsers, int start, int maxResults,
      Collection<String> fields, Collection<SchoolDataIdentifier> excludeSchoolDataIdentifiers, Date startedStudiesBefore, boolean joinGroupsAndWorkspaces) {
    return searchUsers(organizations, studyProgrammeIdentifiers, text, textFields, roles, groups, workspaces, userIdentifiers, includeInactiveStudents, includeHidden,
        onlyDefaultUsers, start, maxResults, fields, excludeSchoolDataIdentifiers, startedStudiesBefore, null, joinGroupsAndWorkspaces);
  }

  @Override
  public SearchResult searchUsers(List<OrganizationEntity> organizations, Set<SchoolDataIdentifier> studyProgrammeIdentifiers, String text, String[] textFields, Collection<EnvironmentRoleArchetype> roles,
      Collection<Long> groups, Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers,
      Boolean includeInactiveStudents, Boolean includeHidden, Boolean onlyDefaultUsers, int start, int maxResults, boolean joinGroupsAndWorkspaces) {
    return searchUsers(organizations, studyProgrammeIdentifiers, text, textFields, roles, groups, workspaces, userIdentifiers, includeInactiveStudents, includeHidden,
        onlyDefaultUsers, start, maxResults, null, null, null, joinGroupsAndWorkspaces);
  }

  @Override
  public SearchResult searchUsers(List<OrganizationEntity> organizations, Set<SchoolDataIdentifier> studyProgrammeIdentifiers, String text, String[] textFields, Collection<EnvironmentRoleArchetype> roles,
      Collection<Long> groups, Collection<Long> workspaces, Collection<SchoolDataIdentifier> userIdentifiers,
      Boolean includeInactiveStudents, Boolean includeHidden, Boolean onlyDefaultUsers, int start, int maxResults, Collection<String> fields,
      boolean joinGroupsAndWorkspaces) {
    return searchUsers(organizations, studyProgrammeIdentifiers, text, textFields, roles, groups, workspaces, userIdentifiers, includeInactiveStudents, includeHidden,
        onlyDefaultUsers, start, maxResults, fields, null, null, joinGroupsAndWorkspaces);
  }

  /**
   * Returns the string representation of archetype the way it is indexed.
   * @param  
   * 
   * @return the string representation of archetype the way it is indexed
   */
  private String archetypeToIndexString(EnvironmentRoleArchetype archetype) {
    return archetype.name();
  }
  
  private Set<Long> getActiveWorkspaces() {

    long now = OffsetDateTime.now().with(ChronoField.MILLI_OF_DAY, 0).toInstant().toEpochMilli() / 1000;

    BoolQueryBuilder query = boolQuery();

    query.must(termQuery("published", Boolean.TRUE));
    query.must(
      boolQuery()
        .should(boolQuery()
          .mustNot(existsQuery("beginDate"))
          .mustNot(existsQuery("endDate"))
        )
        .should(boolQuery()
          .must(existsQuery("beginDate"))
          .must(existsQuery("endDate"))
          .must(rangeQuery("beginDate").lte(now))
          .must(rangeQuery("endDate").gte(now))
        )
    );

    // TODO: this very likely needs to use Scroll API - 10000 is default max
    
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
        .query(query)
        .fetchSource(false)
        .size(10000);

    try {
      SearchResponse response = searchRequest(MUIKKU_WORKSPACE_INDEX, searchSourceBuilder);

      SearchHit[] hits = response.getHits().getHits();
      Set<SchoolDataIdentifier> identifiers = new HashSet<>();
      
      for (SearchHit hit : hits) {
        String[] id = hit.getId().split("/", 2);
        if (id.length == 2) {
          String dataSource = id[1];
          String identifier = id[0];
          identifiers.add(new SchoolDataIdentifier(identifier, dataSource));
        }
      }
      
      return workspaceEntityController.findWorkspaceEntityIdsByIdentifiers(identifiers);
    } catch (IOException e) {
      logger.log(Level.SEVERE, "Failed to fetch active workspaces.", e);
      return Collections.emptySet();
    }
  }

  @Override
  public SearchResult searchWorkspaces(SchoolDataIdentifier subjectIdentifier, int courseNumber) {

    BoolQueryBuilder query = boolQuery();
    query.must(termQuery("published", Boolean.TRUE));
    query.must(termQuery("subjects.subjectIdentifier", subjectIdentifier.toId()));
    query.must(termQuery("subjects.courseNumber", courseNumber));
    
    try {
      SearchResponse response = searchRequest(MUIKKU_WORKSPACE_INDEX, query, 0, 50);
      
      List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
      SearchHits searchHits = response.getHits();
      SearchHit[] results = searchHits.getHits();
      long totalHits = searchHits.getTotalHits().value;
      for (SearchHit hit : results) {
        Map<String, Object> hitSource = hit.getSourceAsMap();
        hitSource.put("indexType", "Workspace");
        searchResults.add(hitSource);
      }
      
      return new SearchResult(0, searchResults, totalHits);
    } catch (IOException e) {
      logger.log(Level.SEVERE, String.format("Failed to search workspaces for subject %s.", subjectIdentifier), e);
      return new SearchResult(0, Collections.emptyList(), 0);
    }
  }

  private BoolQueryBuilder prepareWorkspaceSearchQuery(
      List<SchoolDataIdentifier> subjects,
      List<SchoolDataIdentifier> identifiers,
      List<SchoolDataIdentifier> educationTypes,
      List<SchoolDataIdentifier> curriculumIdentifiers,
      Collection<OrganizationRestriction> organizationRestrictions,
      String freeText,
      Collection<WorkspaceAccess> accesses,
      SchoolDataIdentifier accessUser) {

    BoolQueryBuilder query = boolQuery();

    freeText = sanitizeSearchString(freeText);

    if (accesses != null) {
      BoolQueryBuilder accessQuery = boolQuery();
      for (WorkspaceAccess access : accesses) {
        switch (access) {
          case LOGGED_IN:
          case ANYONE:
            accessQuery.should(termQuery("access", access));
          break;
          case MEMBERS_ONLY:
            BoolQueryBuilder memberQuery = boolQuery();
            IdsQueryBuilder idsQuery = idsQuery();
            for (SchoolDataIdentifier userWorkspace : getUserWorkspaces(accessUser)) {
              idsQuery.addIds(String.format("%s/%s", userWorkspace.getIdentifier(), userWorkspace.getDataSource()));
            }
            memberQuery.must(idsQuery);
            memberQuery.must(termQuery("access", access));
            accessQuery.should(memberQuery);
          break;
        }
      }
      query.must(accessQuery);
    }

    if (CollectionUtils.isNotEmpty(subjects)) {
      List<String> subjectIds = subjects.stream().map(SchoolDataIdentifier::toId).collect(Collectors.toList());
      query.must(termsQuery("subjects.subjectIdentifier", subjectIds));
    }

    if (CollectionUtils.isNotEmpty(educationTypes)) {
      List<String> educationTypeIds = educationTypes.stream().map(SchoolDataIdentifier::toId).collect(Collectors.toList());
      query.must(termsQuery("educationTypeIdentifier", educationTypeIds));
    }

    if (CollectionUtils.isNotEmpty(curriculumIdentifiers)) {
      List<String> curriculumIds = curriculumIdentifiers.stream().map(SchoolDataIdentifier::toId).collect(Collectors.toList());
      query.must(boolQuery()
          .should(termsQuery("curriculumIdentifiers", curriculumIds))
          .should(boolQuery().mustNot(existsQuery("curriculumIdentifiers")))
          .minimumShouldMatch(1));
    }

    BoolQueryBuilder organizationQuery = boolQuery();

    for (OrganizationRestriction organizationRestriction : organizationRestrictions) {
      SchoolDataIdentifier organizationIdentifier = organizationRestriction.getOrganizationIdentifier();

      BoolQueryBuilder organizationRestrictionQuery = boolQuery().must(termQuery("organizationIdentifier", organizationIdentifier.toId()));

      switch (organizationRestriction.getPublicityRestriction()) {
        case ONLY_PUBLISHED:
          organizationRestrictionQuery = organizationRestrictionQuery.must(termQuery("published", Boolean.TRUE));
        break;
        case ONLY_UNPUBLISHED:
          organizationRestrictionQuery = organizationRestrictionQuery.must(termQuery("published", Boolean.FALSE));
        break;
        case LIST_ALL:
        break;
      }

      switch (organizationRestriction.getTemplateRestriction()) {
        case ONLY_WORKSPACES:
          organizationRestrictionQuery.must(termQuery("isTemplate", Boolean.FALSE));
        break;
        case ONLY_TEMPLATES:
          organizationRestrictionQuery.must(termQuery("isTemplate", Boolean.TRUE));
        break;
        case LIST_ALL:
          // No restrictions
        break;
      }

      organizationQuery.should(organizationRestrictionQuery);
    }

    query.must(organizationQuery.minimumShouldMatch(1));

    if (identifiers != null) {
      List<String> identifiersStrList = identifiers.stream()
          .map(SchoolDataIdentifier::toId)
          .collect(Collectors.toList());
      query.must(termsQuery("identifier", identifiersStrList));
    }

    if (StringUtils.isNotBlank(freeText)) {
      String[] words = freeText.split(" ");
      for (int i = 0; i < words.length; i++) {
        if (StringUtils.isNotBlank(words[i])) {
          query.must(boolQuery()
              .should(prefixQuery("name", words[i]))
              .should(prefixQuery("description", words[i]))
              .should(prefixQuery("subjects.subjectName", words[i]))
              .should(prefixQuery("staffMembers.firstName", words[i]))
              .should(prefixQuery("staffMembers.lastName", words[i]))
              );
        }
      }
    }

    return query;
  }

  @Override
  public SearchResult searchWorkspaces(
      List<SchoolDataIdentifier> subjects,
      List<SchoolDataIdentifier> identifiers,
      List<SchoolDataIdentifier> educationTypes,
      List<SchoolDataIdentifier> curriculumIdentifiers,
      Collection<OrganizationRestriction> organizationRestrictions,
      String freeText,
      Collection<WorkspaceAccess> accesses,
      SchoolDataIdentifier accessUser,
      int start,
      int maxResults,
      List<Sort> sorts) {

    if ((identifiers != null && identifiers.isEmpty()) || CollectionUtils.isEmpty(organizationRestrictions)) {
      return new SearchResult(0, new ArrayList<Map<String,Object>>(), 0);
    }

    BoolQueryBuilder query = prepareWorkspaceSearchQuery(subjects, identifiers, educationTypes, curriculumIdentifiers, organizationRestrictions, freeText, accesses, accessUser);

    try {
      SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
          .query(query)
          .from(start)
          .size(maxResults);

      if (sorts != null && !sorts.isEmpty()) {
        for (Sort sort : sorts) {
          searchSourceBuilder.sort(sort.getField(), SortOrder.valueOf(sort.getOrder().name()));
        }
      }

      SearchResponse response = searchRequest(MUIKKU_WORKSPACE_INDEX, searchSourceBuilder);
      
      List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
      SearchHits searchHits = response.getHits();
      long totalHitCount = searchHits.getTotalHits().value;
      SearchHit[] results = searchHits.getHits();
      for (SearchHit hit : results) {
        Map<String, Object> hitSource = hit.getSourceAsMap();
        hitSource.put("indexType", "Workspace");
        searchResults.add(hitSource);
      }

      SearchResult result = new SearchResult(start, searchResults, totalHitCount);
      return result;
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResult(0, new ArrayList<Map<String,Object>>(), 0);
    }
  }
  
  @Override
  public SearchResult searchWorkspacesSignupEnd() {

    BoolQueryBuilder query = boolQuery();
    query.must(termQuery("published", Boolean.TRUE));
    query.must(termQuery("access", WorkspaceAccess.LOGGED_IN));
    
    query.must(rangeQuery("signupEnd").lt(OffsetDateTime.now().minusDays(1).toEpochSecond()));

    try {
      SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
          .query(query)
          .from(0)
          .size(50);
    
      SearchResponse response = searchRequest(MUIKKU_WORKSPACE_INDEX, searchSourceBuilder);
    
      List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
      SearchHits searchHits = response.getHits();
      SearchHit[] results = searchHits.getHits();
      long totalHits = searchHits.getTotalHits().value;
      for (SearchHit hit : results) {
        Map<String, Object> hitSource = hit.getSourceAsMap();
        hitSource.put("indexType", hit.getType());
        searchResults.add(hitSource);
      }
    
      SearchResult result = new SearchResult(0, searchResults, totalHits);
      return result;
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResult(0, new ArrayList<Map<String,Object>>(), 0);
    }
  }

  @Override
  public SearchResults<List<IndexedWorkspace>> searchIndexedWorkspaces(
      List<SchoolDataIdentifier> subjects,
      List<SchoolDataIdentifier> identifiers,
      List<SchoolDataIdentifier> educationTypes,
      List<SchoolDataIdentifier> curriculumIdentifiers,
      Collection<OrganizationRestriction> organizationRestrictions,
      String freeText,
      Collection<WorkspaceAccess> accesses,
      SchoolDataIdentifier accessUser,
      int start,
      int maxResults,
      List<Sort> sorts) {

    if ((identifiers != null && identifiers.isEmpty()) || CollectionUtils.isEmpty(organizationRestrictions)) {
      return new SearchResults<List<IndexedWorkspace>>(0, new ArrayList<IndexedWorkspace>(), 0);
    }

    try {
      BoolQueryBuilder query = prepareWorkspaceSearchQuery(subjects, identifiers, educationTypes, curriculumIdentifiers, organizationRestrictions, freeText, accesses, accessUser);

      SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
          .query(query)
          .from(start)
          .size(maxResults);

      if (sorts != null && !sorts.isEmpty()) {
        for (Sort sort : sorts) {
          searchSourceBuilder.sort(sort.getField(), SortOrder.valueOf(sort.getOrder().name()));
        }
      }

      SearchResponse response = searchRequest(MUIKKU_WORKSPACE_INDEX, searchSourceBuilder);
      
      SearchHits searchHits = response.getHits();
      long totalHitCount = searchHits.getTotalHits().value;
      
      ObjectMapper objectMapper = new ObjectMapper();
      objectMapper.registerModule(new JSR310Module());
      SearchHit[] results = searchHits.getHits();
      List<IndexedWorkspace> searchResults = Arrays.stream(results)
          .map(hit -> {
            String source = hit.getSourceAsString();
            try {
              return objectMapper.readValue(source, IndexedWorkspace.class);
            }
            catch (Exception e) {
              String documentId = hit != null ? hit.getId() : null;
              logger.log(Level.SEVERE, String.format("Couldn't parse indexed workspace (id: %s)", documentId), e);
            }
            return null;
          })
          .collect(Collectors.toList());

      return new SearchResults<List<IndexedWorkspace>>(start, searchResults, totalHitCount);

    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResults<List<IndexedWorkspace>>(0, new ArrayList<IndexedWorkspace>(), 0);
    }
  }

  @Override
  public WorkspaceSearchBuilder searchWorkspaces() {
    return new ElasticWorkspaceSearchBuilder(this);
  }

  @Override
  public Set<SchoolDataIdentifier> listDistinctWorkspaceCurriculums(Collection<OrganizationRestriction> organizationRestrictions, Collection<WorkspaceAccess> accesses, SchoolDataIdentifier accessUser) {
    QueryBuilder query = prepareWorkspaceSearchQuery(null, null, null, null, organizationRestrictions, null, accesses, accessUser);
    return aggregateDistinctFieldIdentifiers(query, MUIKKU_WORKSPACE_INDEX, "curriculumIdentifiers");
  }

  @Override
  public Set<SchoolDataIdentifier> listDistinctWorkspaceEducationTypes(Collection<OrganizationRestriction> organizationRestrictions, Collection<WorkspaceAccess> accesses, SchoolDataIdentifier accessUser) {
    QueryBuilder query = prepareWorkspaceSearchQuery(null, null, null, null, organizationRestrictions, null, accesses, accessUser);
    return aggregateDistinctFieldIdentifiers(query, MUIKKU_WORKSPACE_INDEX, "educationTypeIdentifier");
  }
  
  /**
   * Lists distinct SchoolDataIdentifiers from given aggregateField. Use query to limit 
   * the scope of documents matched or use MatchAllQuery to match all documents.
   * 
   * @param query query to specify which documents are used from index
   * @param index index where the documents are taken from
   * @param aggregateField the field to be aggregated, these need to be stored in SchoolDataIdentifier.id format
   * @return list of distinct identifiers
   */
  private Set<SchoolDataIdentifier> aggregateDistinctFieldIdentifiers(QueryBuilder query, final String index, final String aggregateField) {
    AggregationBuilder curriculumAggregation = AggregationBuilders
        .terms(aggregateField)
        .field(aggregateField)
        .size(100);
    
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
        .query(query)
        .size(0) // Size is 0 as we're not interesed in the documents itself, only the aggregations
        .aggregation(curriculumAggregation);

    SearchRequest searchRequest = Requests.searchRequest(index);
    searchRequest.source(searchSourceBuilder);

    try {
      SearchResponse searchResponse = elasticClient.search(searchRequest, RequestOptions.DEFAULT);
      Terms aggregation = searchResponse.getAggregations().get(aggregateField);

      return aggregation.getBuckets().stream()
        .map(bucket -> SchoolDataIdentifier.fromId(bucket.getKeyAsString()))
        .collect(Collectors.toSet());
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return null;
    }
  }
  
  private Set<SchoolDataIdentifier> getUserWorkspaces(SchoolDataIdentifier userIdentifier) {
    Set<SchoolDataIdentifier> result = new HashSet<>();
    
    IdsQueryBuilder query = idsQuery();
    query.addIds(String.format("%s/%s", userIdentifier.getIdentifier(), userIdentifier.getDataSource()));

    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
        .query(query)
        .fetchField("workspaces") // fetch/stored/docvalue?
        .size(1);

    try {
      SearchResponse response = searchRequest(MUIKKU_USER_INDEX, searchSourceBuilder);

      SearchHit[] hits = response.getHits().getHits();
      for (SearchHit hit : hits) {
        Map<String, DocumentField> fields = hit.getFields();
        DocumentField workspaceField = fields.get("workspaces");
        if (workspaceField != null && workspaceField.getValues() != null) {
          for (Object value : workspaceField.getValues()) {
            if (value instanceof Number) {
              Long workspaceEntityId = ((Number) value).longValue();
              WorkspaceEntity workspaceEntity = workspaceEntityController.findWorkspaceEntityById(workspaceEntityId);
              if (workspaceEntity != null) {
                result.add(workspaceEntity.schoolDataIdentifier());
              }
            }
          }
        }
      }
      
      return result;
    } catch (IOException e) {
      logger.log(Level.SEVERE, String.format("Failed to fetch workspaces for user %s.", userIdentifier));
      return null;
    }
  }

  @Override
  public CommunicatorMessageSearchBuilder searchCommunicatorMessages() {
    return new ElasticCommunicatorMessageSearchBuilder(this);
  }

  @Override
  public IndexedCommunicatorMessage findCommunicatorMessage(Long communicatorMessageId) {
    if (communicatorMessageId == null) {
      throw new IllegalArgumentException();
    }
    
    IdsQueryBuilder query = idsQuery();
    query.addIds(String.valueOf(communicatorMessageId));
    
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
        .query(query)
        .size(1);

    try {
      SearchResponse response = searchRequest(MUIKKU_COMMUNICATORMESSAGE_INDEX, searchSourceBuilder);

      SearchHit[] results = response.getHits().getHits();

      // Technically never possible, but check anyways for errors
      if (results.length > 1) {
        logger.log(Level.SEVERE, String.format("Found multiple messages (id: %d)", communicatorMessageId));
        return null;
      }

      if (results.length == 1) {
        SearchHit hit = results[0];
        String source = hit.getSourceAsString();
        try {
          ObjectMapper objectMapper = new ObjectMapper();
          return objectMapper.readValue(source, IndexedCommunicatorMessage.class);
        }
        catch (Exception e) {
          String documentId = hit != null ? hit.getId() : null;
          logger.log(Level.SEVERE, String.format("Couldn't parse indexed communicator message (id: %s)", documentId), e);
          return null;
        }
      }
    } catch (IOException e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
    }
    
    return null;
  }

  @Override
  public SearchResults<List<IndexedCommunicatorMessage>> searchCommunicatorMessages(
      String queryString,
      long senderId,
      IndexedCommunicatorMessageSender sender,
      List<IndexedCommunicatorMessageRecipient> recipients,
      Date created,
      Set<Long> tags,
      int start,
      int maxResults,
      List<Sort> sorts) {
    BoolQueryBuilder query = boolQuery();

    UserEntity loggedUser = sessionController.getLoggedUserEntity();
    Long loggedUserId = loggedUser.getId();
    String loggedUserIdStr = String.valueOf(loggedUserId);

    queryString = sanitizeSearchString(queryString);
    queryString = prepareQueryString(queryString);

    query.must(boolQuery()
        .must(
            boolQuery()
              .should(
                  QueryBuilders.queryStringQuery(queryString)
                      .defaultOperator(Operator.AND)
                      .field("caption")
                      .field("message")
                      .field("sender.firstName")
                      .field("sender.nickName")
                      .field("sender.lastName")
                      .field("recipients.firstName")
                      .field("recipients.nickName")
                      .field("recipients.lastName")
                      .field("groupRecipients.groupName")
              )
              .should(
                  boolQuery()
                    .must(QueryBuilders.queryStringQuery(queryString)
                        .defaultOperator(Operator.AND)
                        .field("caption")
                        .field("message")
                        .field("sender.firstName")
                        .field("sender.nickName")
                        .field("sender.lastName")
                        .field("recipients.firstName")
                        .field("recipients.nickName")
                        .field("recipients.lastName")
                        .field("groupRecipients.groupName")
                        .field("sender.labels.label")
                    )
                    .must(termsQuery("sender.userEntityId", loggedUserIdStr))
              )
              .should(
                  boolQuery()
                    .must(QueryBuilders.queryStringQuery(queryString)
                        .defaultOperator(Operator.AND)
                        .field("caption")
                        .field("message")
                        .field("sender.firstName")
                        .field("sender.nickName")
                        .field("sender.lastName")
                        .field("recipients.firstName")
                        .field("recipients.nickName")
                        .field("recipients.lastName")
                        .field("groupRecipients.groupName")
                        .field("recipients.labels.label")
                    )
                    .must(termsQuery("recipients.userEntityId", loggedUserIdStr))
              )
              .should(
                  boolQuery()
                    .must(QueryBuilders.queryStringQuery(queryString)
                        .defaultOperator(Operator.AND)
                        .field("caption")
                        .field("message")
                        .field("sender.firstName")
                        .field("sender.nickName")
                        .field("sender.lastName")
                        .field("recipients.firstName")
                        .field("recipients.nickName")
                        .field("recipients.lastName")
                        .field("groupRecipients.groupName")
                        .field("groupRecipients.recipients.labels.label")
                    )
                    .must(termsQuery("groupRecipients.recipients.userEntityId", loggedUserIdStr))
              )
              .minimumShouldMatch(1)
        )
        .should(
            boolQuery()
              .must(termQuery("sender.userEntityId", loggedUserIdStr))
              .must(termQuery("sender.archivedBySender", Boolean.FALSE)))
        .should(
            boolQuery()
              .must(termQuery("recipients.userEntityId", loggedUserIdStr))
              .must(termQuery("recipients.archivedByReceiver", Boolean.FALSE)))
        .should(
            boolQuery()
              .must(termQuery("groupRecipients.recipients.userEntityId", loggedUserIdStr))
              .must(termQuery("groupRecipients.recipients.archivedByReceiver", Boolean.FALSE)))
        .minimumShouldMatch(1));
    
    try {
      SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder()
          .query(query)
          .from(start)
          .size(maxResults);

      if (CollectionUtils.isNotEmpty(sorts)) {
        sorts.forEach(sort -> searchSourceBuilder.sort(sort.getField(), SortOrder.valueOf(sort.getOrder().name())));
      }
      
      SearchResponse response = searchRequest(MUIKKU_COMMUNICATORMESSAGE_INDEX, searchSourceBuilder);
      
      SearchHits searchHits = response.getHits();
      long totalHitCount = searchHits.getTotalHits().value;
      
      ObjectMapper objectMapper = new ObjectMapper();
      SearchHit[] results = searchHits.getHits();
      List<IndexedCommunicatorMessage> searchResults = Arrays.stream(results)
          .map(hit -> {
            String source = hit.getSourceAsString();
            try {
              return objectMapper.readValue(source, IndexedCommunicatorMessage.class);
            }
            catch (Exception e) {
              String documentId = hit != null ? hit.getId() : null;
              logger.log(Level.SEVERE, String.format("Couldn't parse indexed communicator message (id: %s)", documentId), e);
            }
            return null;
          })
          .collect(Collectors.toList());

      SearchResults<List<IndexedCommunicatorMessage>> result = new SearchResults<List<IndexedCommunicatorMessage>>(start, searchResults, totalHitCount);
      return result;

    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResults<List<IndexedCommunicatorMessage>>(0, new ArrayList<IndexedCommunicatorMessage>(), 0);
    }
  }

  private String prepareQueryString(String queryString) {
    String prepared = queryString.trim();
    while (prepared.contains("  ")) {
      prepared = prepared.replace("  ", " ");
    }
    prepared = prepared.replace(" ", "* ");
    return prepared + "*";
  }

  @Override
  public SearchResult findUserGroup(SchoolDataIdentifier identifier) {

    BoolQueryBuilder query = boolQuery();
    IdsQueryBuilder includeIdsQuery = idsQuery();
    includeIdsQuery.addIds(String.format("%s/%s", identifier.getIdentifier(), identifier.getDataSource()));
    query.must(includeIdsQuery);

    // Search
    
    try {
      SearchResponse response = searchRequest(MUIKKU_USERGROUP_INDEX, query);

      List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
      SearchHits searchHits = response.getHits();
      long totalHitCount = searchHits.getTotalHits().value;
      SearchHit[] results = searchHits.getHits();
      for (SearchHit hit : results) {
        Map<String, Object> hitSource = hit.getSourceAsMap();
        if(hitSource == null){
          hitSource = new HashMap<>();
          for(String key : hit.getFields().keySet()){
            hitSource.put(key, hit.getFields().get(key).getValue().toString());
          }
        }
        hitSource.put("indexType", "UserGroup");
        searchResults.add(hitSource);
      }
      return new SearchResult(0, searchResults, totalHitCount);
    } catch (IOException e) {
      logger.log(Level.SEVERE, String.format("UserGroup not found by identifier %s.", identifier), e);
      return new SearchResult(0, Collections.emptyList(), 0);
    }
  }

  @Override
  public SearchResult searchUserGroups(String query, String archetype, List<OrganizationEntity> organizations, int start, int maxResults) {
    try {
      if (CollectionUtils.isEmpty(organizations)) {
        throw new IllegalArgumentException("Cannot search with no organizations specified.");
      }

      query = sanitizeSearchString(query);

      BoolQueryBuilder boolQuery = boolQuery();

      if (StringUtils.isNotBlank(query)) {
        String[] words = query.split(" ");
        for (int i = 0; i < words.length; i++) {
          if (StringUtils.isNotBlank(words[i])) {
            boolQuery.must(prefixQuery("name", words[i]));
          }
        }
      }

      if (StringUtils.isNotBlank(archetype)) {
        boolQuery.must(termQuery("archetype", StringUtils.lowerCase(archetype)));
      }

      Set<String> organizationIdentifiers = organizations
          .stream()
          .filter(Objects::nonNull).map(organization -> String.format("%s-%s", organization.getDataSource().getIdentifier(), organization.getIdentifier()))
          .collect(Collectors.toSet());
      if (CollectionUtils.isNotEmpty(organizationIdentifiers)) {
        boolQuery.must(termsQuery("organizationIdentifier", organizationIdentifiers.toArray()));
      }

      SearchResponse response = searchRequest(MUIKKU_USERGROUP_INDEX, boolQuery, start, maxResults);
      
      List<Map<String, Object>> searchResults = new ArrayList<Map<String, Object>>();
      SearchHits searchHits = response.getHits();
      long totalHitCount = searchHits.getTotalHits().value;
      SearchHit[] results = searchHits.getHits();
      for (SearchHit hit : results) {
        Map<String, Object> hitSource = hit.getSourceAsMap();
        hitSource.put("indexType", "UserGroup");
        searchResults.add(hitSource);
      }

      SearchResult result = new SearchResult(start, searchResults, totalHitCount);
      return result;
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return new SearchResult(0, new ArrayList<Map<String,Object>>(), 0);
    }
  }

  @Override
  public long countActiveStudents(OrganizationEntity organizationEntity) {
    long now = OffsetDateTime.now().toEpochSecond();
    String organizationIdentifier = String.format("%s-%s",
        organizationEntity.getDataSource().getIdentifier(), organizationEntity.getIdentifier());

    BoolQueryBuilder query = boolQuery();
    query.must(termsQuery("organizationIdentifier.untouched", organizationIdentifier));
    query.must(termQuery("isDefaultIdentifier", true));
    query.must(termsQuery("roles", archetypeToIndexString(EnvironmentRoleArchetype.STUDENT)));

    Set<Long> activeWorkspaceEntityIds = getActiveWorkspaces();
    query.must(
      boolQuery()
        .should(boolQuery()
          .must(existsQuery("studyStartDate"))
          .must(rangeQuery("studyStartDate").lte(now))
          .mustNot(existsQuery("studyEndDate"))
        )
        .should(boolQuery()
          .must(existsQuery("studyStartDate"))
          .must(rangeQuery("studyStartDate").lte(now))
          .must(existsQuery("studyEndDate"))
          .must(rangeQuery("studyEndDate").gte(now))
        )
        .should(boolQuery()
          .mustNot(existsQuery("studyEndDate"))
          .mustNot(existsQuery("studyStartDate"))
          .must(termsQuery("workspaces", ArrayUtils.toPrimitive(activeWorkspaceEntityIds.toArray(new Long[0]))))
        )
    );

    try {
      SearchResponse response = searchRequest(MUIKKU_USER_INDEX, query, 0, 1);
  
      return response.getHits().getTotalHits().value;
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return 0;
    }
  }

  @Override
  public long countInactiveStudents(OrganizationEntity organizationEntity) {
    long now = OffsetDateTime.now().toEpochSecond();
    String organizationIdentifier = String.format("%s-%s",
        organizationEntity.getDataSource().getIdentifier(), organizationEntity.getIdentifier());

    BoolQueryBuilder query = boolQuery();
    query.must(termsQuery("organizationIdentifier.untouched", organizationIdentifier));
    query.must(termQuery("isDefaultIdentifier", true));
    query.must(termsQuery("roles", archetypeToIndexString(EnvironmentRoleArchetype.STUDENT)));

    Set<Long> activeWorkspaceEntityIds = getActiveWorkspaces();
    query.must(
      boolQuery()
        .should(boolQuery()
          .must(existsQuery("studyStartDate"))
          .must(rangeQuery("studyStartDate").gte(now))
          .mustNot(existsQuery("studyEndDate"))
        )
        .should(boolQuery()
          .must(existsQuery("studyEndDate"))
          .must(rangeQuery("studyEndDate").lte(now))
        )
        .should(boolQuery()
          .mustNot(existsQuery("studyEndDate"))
          .mustNot(existsQuery("studyStartDate"))
          .mustNot(termsQuery("workspaces", ArrayUtils.toPrimitive(activeWorkspaceEntityIds.toArray(new Long[0]))))
        )
    );

    try {
      SearchResponse response = searchRequest(MUIKKU_USER_INDEX, query, 0, 1);
      
      return response.getHits().getTotalHits().value;
    } catch (Exception e) {
      logger.log(Level.SEVERE, "ElasticSearch query failed unexpectedly", e);
      return 0;
    }
  }

  @Override
  public String getName() {
    return "elastic-search";
  }

  private RestHighLevelClient elasticClient;

}
