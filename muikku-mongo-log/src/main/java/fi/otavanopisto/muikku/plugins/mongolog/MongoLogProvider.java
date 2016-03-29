package fi.otavanopisto.muikku.plugins.mongolog;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.codehaus.jackson.map.ObjectMapper;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.MongoCredential;
import com.mongodb.MongoTimeoutException;
import com.mongodb.ServerAddress;
import com.mongodb.util.JSON;

import fi.otavanopisto.muikku.controller.PluginSettingsController;
import fi.otavanopisto.muikku.plugins.commonlog.LogProvider;

@ApplicationScoped
public class MongoLogProvider implements LogProvider {
  
  private boolean enabled = true;

  @Inject
  private Logger logger;

  @Inject
  private PluginSettingsController pluginSettingsController;

  @PostConstruct
  public void init() {
    String user = pluginSettingsController.getPluginSetting("mongo-log", "database.user");
    String password = pluginSettingsController.getPluginSetting("mongo-log", "database.password");
    String host = pluginSettingsController.getPluginSetting("mongo-log", "database.host");
    String port = pluginSettingsController.getPluginSetting("mongo-log", "database.port");
    String database = pluginSettingsController.getPluginSetting("mongo-log", "database.name");

    try {
      if (StringUtils.isNotBlank(user) && StringUtils.isNotBlank(password) && StringUtils.isNumeric(port) && 
          StringUtils.isNotBlank(host) && StringUtils.isNotBlank(database)) {
        MongoCredential credential = MongoCredential.createMongoCRCredential(user, database, password.toCharArray());
        ServerAddress addr = new ServerAddress(host, NumberUtils.createInteger(port));
        mongo = new MongoClient(addr, Arrays.asList(credential));
        db = mongo.getDB(database);
      } else {
        logger.warning("Could not initialize mongo log because some of the settings were missing");
      }
    } catch (Exception e) {
      logger.warning("Cannot initialize connection to mongoDB");
      enabled = false;
    }
  }

  @PreDestroy
  public void deinit() {
    mongo.close();
  }

  @Override
  public void log(String collection, Object data) {
    if (!enabled) {
      return;
    }

    DBCollection c = db.getCollection(collection);
    try {
      String json = new ObjectMapper().writeValueAsString(data);
      DBObject o = (DBObject) JSON.parse(json);
      c.insert(o);
    } catch (IOException e) {
      logger.log(Level.WARNING, "Error while converting data to json");
    } catch (MongoTimeoutException e) {
      logger.warning("Connection to mongoDB timed out!, disabling logging to mongoDB");
      enabled = false;
    }
  }

  @SuppressWarnings("unchecked")
  @Override
  public ArrayList<HashMap<String, Object>> getLogEntries(String collection, Map<String, Object> query, int count) {
    if (!enabled) {
      return null;
    }

    try {
      DBCollection c = db.getCollection(collection);
      BasicDBObject queryObject = new BasicDBObject();
      queryObject.putAll(query);
      DBCursor cursor = c.find(queryObject).sort(new BasicDBObject("time", -1)).limit(count);
      ArrayList<HashMap<String, Object>> results = new ArrayList<HashMap<String, Object>>();
      while (cursor.hasNext()) {
        results.add((HashMap<String, Object>) cursor.next().toMap());
      }
      return results;
    } catch (MongoTimeoutException e) {
      logger.warning("Connection to mongoDB timed out!, disabling logging to mongoDB");
      enabled = false;
      return null;
    }
  }

  @Override
  public String getName() {
    return "mongo-provider";
  }

  private MongoClient mongo;
  private DB db;
}
