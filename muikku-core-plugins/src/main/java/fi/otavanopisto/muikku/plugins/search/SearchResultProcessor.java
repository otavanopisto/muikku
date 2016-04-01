package fi.otavanopisto.muikku.plugins.search;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import javax.ejb.Stateless;
import javax.enterprise.inject.Any;
import javax.enterprise.inject.Instance;
import javax.inject.Inject;

import fi.otavanopisto.muikku.plugins.seeker.SeekerResult;
import fi.otavanopisto.muikku.plugins.seeker.SeekerResultParser;
import fi.otavanopisto.muikku.search.SearchResult;

@Stateless
public class SearchResultProcessor {

  @Inject
  private Logger logger;
  
  @Inject
  @Any
  private Instance<SeekerResultParser> seekerResultParsers;
  
  public List<SeekerResult> process(SearchResult result){
    if (result.getResults().size() > 0) {
      List<SeekerResult> seekerResults = new ArrayList<SeekerResult>(); 
      for(Map<String, Object> entry : result.getResults()){
        if(!entry.containsKey("indexType")){
          logger.warning("Skipping search result without type!");
          continue;
        }
        SeekerResultParser parser = getParser((String)entry.get("indexType"));
        if(parser == null){
          logger.warning("No parser found for indexed type: "+entry.get("indexType")+", skipping entry.");
          continue;
        }
        SeekerResult parsedResult = parser.parse(entry);
        
        if (parsedResult != null)
          seekerResults.add(parsedResult);
      }
      
      return seekerResults;
    }
    return null;
  }
  
  private SeekerResultParser getParser(String indexType){
    Iterator<SeekerResultParser> i = seekerResultParsers.iterator();
    while (i.hasNext()) {
      SeekerResultParser parser = i.next();
      if(indexType.equals(parser.getIndexType())){
        return parser;
      }
    }
    return null;
  }
  
}
