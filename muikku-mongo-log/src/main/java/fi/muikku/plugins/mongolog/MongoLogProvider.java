package fi.muikku.plugins.mongolog;

import java.io.IOException;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.ejb.Stateful;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.codehaus.jackson.map.ObjectMapper;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.ServerAddress;
import com.mongodb.util.JSON;

import fi.muikku.plugins.commonlog.LogProvider;

@ApplicationScoped
@Stateful
public class MongoLogProvider implements LogProvider {

  private static final String DB_NAME = "muikku"; // TODO: Make configurable
  private static final String DB_HOST = "kahana.mongohq.com";
  private static final String DB_USER = "muikku";
  private static final String DB_PASSWORD = "muikku";
  private static final int DB_PORT = 10066;

  @Inject
  private Logger logger;

  @PostConstruct
  public void init() throws UnknownHostException {
    if (DB_USER != "" && DB_PASSWORD != "") {
      MongoCredential credential = MongoCredential.createMongoCRCredential(DB_USER, DB_NAME, DB_PASSWORD.toCharArray());
      ServerAddress addr = new ServerAddress(DB_HOST, DB_PORT);
      mongo = new MongoClient(addr, Arrays.asList(credential));
      db = mongo.getDB(DB_NAME);
    }
  }

  @Override
  public void log(String collection, Object data) {
    DBCollection c = db.getCollection(collection);
    try {
      String json = new ObjectMapper().writeValueAsString(data);
      DBObject o = (DBObject) JSON.parse(json);
      c.insert(o);
    } catch (IOException e) {
      logger.log(Level.WARNING, "Error while converting data to json");
    }

  }

  @SuppressWarnings("unchecked")
  @Override
  public ArrayList<HashMap<String, Object>> getLogEntries(String collection, Map<String, Object> query, int count) {
    DBCollection c = db.getCollection(collection);
    BasicDBObject queryObject = new BasicDBObject();
    queryObject.putAll(query);
    DBCursor cursor = c.find(queryObject).sort(new BasicDBObject("time", -1)).limit(count);
    ArrayList<HashMap<String, Object>> results = new ArrayList<HashMap<String, Object>>();
    while (cursor.hasNext()) {
      results.add((HashMap<String, Object>) cursor.next().toMap());
    }

    return results;
  }

  @Override
  public String getName() {
    return "mongo-provider";
  }

  private MongoClient mongo;
  private DB db;

}
