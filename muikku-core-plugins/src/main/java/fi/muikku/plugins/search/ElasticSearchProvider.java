package fi.muikku.plugins.search;

import java.io.IOException;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;

import org.codehaus.jackson.JsonGenerationException;
import org.codehaus.jackson.JsonNode;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.node.Node;

import static org.elasticsearch.node.NodeBuilder.*;

@ApplicationScoped
@Stateful
public class ElasticSearchProvider implements SearchProvider {

  private Client elasticClient;

  @PostConstruct
  public void init() {
    Node node = nodeBuilder().node();
    elasticClient = node.client();
  }

  @PreDestroy
  public void shutdown() {
    elasticClient.close();
  }

  @Override
  public Object search(String[] types, Map Query) {
    SearchResponse response = elasticClient.prepareSearch("muikku").setTypes(types).setQuery(Query).execute().actionGet();
    return response;
  }

  @Override
  public void addToIndex(Object entity) throws JsonGenerationException, JsonMappingException, IOException {
    ObjectMapper mapper = new ObjectMapper();
    String json = mapper.writeValueAsString(entity);
    JsonNode objectRoot = mapper.readTree(json);
    String id = objectRoot.get("id").asText();
    System.out.println(id);
    IndexResponse response = elasticClient.prepareIndex("muikku", entity.getClass().getSimpleName(), id).setSource(json).execute().actionGet();
  }

  @Override
  public void deleteFromIndex(Object entity) throws JsonGenerationException, JsonMappingException, IOException {
    ObjectMapper mapper = new ObjectMapper();
    String json = mapper.writeValueAsString(entity);
    JsonNode objectRoot = mapper.readTree(json);
    String id = objectRoot.path("id").getTextValue();
    DeleteResponse response = elasticClient.prepareDelete("muikku", entity.getClass().getSimpleName(), id)
        .execute()
        .actionGet();

  }

}
