package fi.muikku.plugins.search;

import static org.elasticsearch.node.NodeBuilder.nodeBuilder;

import java.io.IOException;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.codehaus.jackson.map.ObjectMapper;
import org.elasticsearch.action.delete.DeleteResponse;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.client.Client;
import org.elasticsearch.common.settings.ImmutableSettings.Builder;
import org.elasticsearch.node.Node;

import fi.muikku.search.SearchIndexUpdater;

@ApplicationScoped
@Stateful
public class ElasticSearchIndexUpdater implements SearchIndexUpdater {
  
  @Inject
  private Logger logger;

  @Override
  public void init() {
    Builder settings = nodeBuilder().settings();
    settings.put("cluster.routing.allocation.disk.watermark.high", "99%");
    
    node = nodeBuilder()
      .settings(settings)
      .local(true)
      .node();
    
    elasticClient = node.client();
  }
  
  @Override
  public void deinit() {
    elasticClient.close();
    node.close();
  }
  
  @Override
  public void addOrUpdateIndex(String typeName, Map<String, Object> entity) {
    ObjectMapper mapper = new ObjectMapper();
    String json;
    try {
      json = mapper.writeValueAsString(entity);
      String id = entity.get("id").toString();
      @SuppressWarnings("unused")
      IndexResponse response = elasticClient.prepareIndex("muikku", typeName, id).setSource(json).execute().actionGet();
    } catch (IOException e) {
      logger.log(Level.WARNING, "Adding to index failed because of exception", e);
    }
  }

  @Override
  public void deleteFromIndex(String typeName, String id) {
    @SuppressWarnings("unused")
    DeleteResponse response = elasticClient.prepareDelete("muikku", typeName, id).execute().actionGet();
  }

  @Override
  public String getName() {
    return "elastic-search";
  }
  
  private Client elasticClient;
  private Node node;
  
}
