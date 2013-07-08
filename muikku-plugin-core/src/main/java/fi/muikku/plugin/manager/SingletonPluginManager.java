package fi.muikku.plugin.manager;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ServiceLoader;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.sonatype.aether.artifact.Artifact;
import org.sonatype.aether.collection.DependencyCollectionException;
import org.sonatype.aether.graph.DependencyNode;
import org.sonatype.aether.graph.Exclusion;
import org.sonatype.aether.repository.RemoteRepository;
import org.sonatype.aether.resolution.ArtifactResult;
import org.sonatype.aether.resolution.DependencyResolutionException;
import org.sonatype.aether.resolution.VersionResolutionException;
import org.sonatype.aether.util.artifact.ArtifacIdUtils;
import org.sonatype.aether.util.artifact.DefaultArtifact;

import fi.muikku.plugin.PluginLibraryInfo;
import fi.muikku.plugin.PluginDescriptor;
import fi.muikku.plugin.PluginLibraryDescriptor;
import fi.muikku.plugin.RESTPluginDescriptor;
import fi.muikku.plugin.maven.MavenClient;

/** 
 * The class responsible for managing plugins.
 */
public class SingletonPluginManager {
  
	private Logger logger = Logger.getLogger(getClass().getName());
  private static SingletonPluginManager INSTANCE = null;

  /** 
   * Returns the (singleton) instance of the plugin manager.
   * 
   * @return The (singleton) instance of the plugin manager. 
   * @throws PluginManagerException if plugin manager is not initialized
   */
  public static final synchronized SingletonPluginManager getInstance() throws PluginManagerException {
    if (INSTANCE == null)
      throw new PluginManagerException("Plugin manger not initialized");

    return INSTANCE;
  }

  public static final synchronized SingletonPluginManager initialize(ClassLoader parentClassLoader, String pluginDirectory, Artifact applicationArtifact, List<RemoteRepository> repositories) throws PluginManagerException {
    return initialize(parentClassLoader, pluginDirectory, applicationArtifact, repositories, null);
  }
  
  /**
   * Initializes the plugin manager. Call this before any other methods.
   * 
   * @param parentClassLoader The parent class loader of the plugin manager.
   * @param pluginDirectory local plugin Maven repository path
   * @param applicationArtifact application's artifact. Used for reading application provided artifacts (may be null)
   * @param repositories The URL:s of the repositories containing the plugins.
   * @param eclipseWorkspace location of Eclipse workspace. This parameter is used for development purposes only.
   * @return The plugin manager instance.
   * @throws PluginManagerException when plugin manager is already initialized
   */
  public static final synchronized SingletonPluginManager initialize(ClassLoader parentClassLoader, String pluginDirectory, Artifact applicationArtifact, List<RemoteRepository> repositories, String eclipseWorkspace) throws PluginManagerException {
    if (INSTANCE != null)
      throw new PluginManagerException("Plugin manger is already initialized");
      
    INSTANCE = new SingletonPluginManager(parentClassLoader, pluginDirectory, applicationArtifact, repositories, eclipseWorkspace);
    
    return INSTANCE;
  }

  SingletonPluginManager(ClassLoader parentClassLoader, String pluginDirectory, Artifact applicationArtifact, List<RemoteRepository> repositories, String eclipseWorkspace) throws PluginManagerException {
    this.libraryLoader = new LibraryLoader(parentClassLoader);
    mavenClient = new MavenClient(getPluginDirectory(pluginDirectory), eclipseWorkspace);
    for (RemoteRepository repository : repositories) {
      mavenClient.addRepository(repository);
    }    
    
    if (applicationArtifact != null) {
      try {
  			List<ArtifactResult> artifactResults = mavenClient.resolveDependencies(applicationArtifact, "compile", new ArrayList<Exclusion>());
  
  			for (ArtifactResult artifactResult : artifactResults) {
  				DependencyNode node = artifactResult.getRequest().getDependencyNode();
  				if (!artifactResult.isResolved()) {
  					logger.warning("Failed to resolve application provided dependency " + node.getDependency());
  				}
  
  				Exclusion exclusion = new Exclusion(artifactResult.getArtifact().getGroupId(), artifactResult.getArtifact().getArtifactId(), artifactResult.getArtifact().getClassifier(), artifactResult.getArtifact().getExtension());
  				applicationProvidedArtifacts.add(exclusion);
  			}
  		} catch (DependencyCollectionException | DependencyResolutionException e) {
  			throw new PluginManagerException(e);
  		}
    }
  }
  
  /** Adds a repository to fetch plugins from.
   * 
   * @param url The URL of the repository to add.
   */
  public void addRepository(RemoteRepository remoteRepository) {
    mavenClient.addRepository(remoteRepository);
  }
  
  /** Removes a plugin repository from the plugin manager.
   * 
   * @param url The URL of the repository to remove.
   */
  public void removeRepository(String url) {
    mavenClient.removeRepository(url);
  }
  
  private File getPluginDirectory(String pluginDirectory) throws PluginManagerException {
    File pluginDirectoryFile = new File(pluginDirectory);
    
    // TODO: Check if it's a directory
    // TODO: Proper error handling
    
    if (pluginDirectoryFile.exists()) {
      if (pluginDirectoryFile.canRead() && pluginDirectoryFile.canWrite()) {
        return pluginDirectoryFile;
      } else {
        throw new PluginManagerException("Plugin directory missing read and/or write permissions");
      }
    } else {
      if (!pluginDirectoryFile.mkdir()) {
        throw new PluginManagerException("Failed to create new plugin directory");
      } else {
        return pluginDirectoryFile;
      }
    }
  }
  
  /** Loads a plugin library using Maven.
   * 
   * @param loadInfo plugin library loading information.
   * @throws PluginManagerException 
   * @throws VersionResolutionException 
   */
  public void loadPluginLibrary(PluginLibraryInfo loadInfo) throws PluginManagerException {
    String groupId = loadInfo.getGroupId();
    String artifactId = loadInfo.getArtifactId();
    String version = loadInfo.getVersion();
    
    loadedPluginLibraryInfos.add(loadInfo);
    
    try {
    	Artifact libraryArtifact = new DefaultArtifact(groupId, artifactId, "jar", version);
    	
			List<ArtifactResult> resolvedDependencies = mavenClient.resolveDependencies(libraryArtifact, "compile", applicationProvidedArtifacts);
			for (ArtifactResult resolvedDependency : resolvedDependencies) {
				if (resolvedDependency.isResolved()) {
					File artifactFile = mavenClient.getArtifactJarFile(resolvedDependency.getArtifact());
					
					if (artifactFile.isDirectory()) {
	          logger.info("Loading " + ArtifacIdUtils.toId(resolvedDependency.getArtifact()) + " plugin folder: " + artifactFile);
	    			try {
	    			  libraryLoader.loadClassPath(artifactFile.toURI().toURL());        	
	    		  } catch (Exception e) {
	    		  	logger.log(Level.WARNING, "Error occurred while loading plugin folder " + artifactFile, e);
	    			}
	        } else {
	          logger.info("Loading " + ArtifacIdUtils.toId(resolvedDependency.getArtifact()) + " plugin library jar: " + artifactFile);
	          libraryLoader.loadJar(artifactFile);
	      	}
				} else {
					logger.warning("Could not resolve " + ArtifacIdUtils.toId(libraryArtifact) + " -plugin dependency: " + ArtifacIdUtils.toId(resolvedDependency.getArtifact()));
				}
			}
		} catch (DependencyCollectionException | DependencyResolutionException e) {
			throw new PluginManagerException(e);
		}
  }

	public List<PluginLibraryDescriptor> discoverPluginLibraries() {
  	List<PluginLibraryDescriptor> result = new ArrayList<>();
  	ServiceLoader<PluginLibraryDescriptor> pluginLibraryLoader = ServiceLoader.load(PluginLibraryDescriptor.class, libraryLoader.getPluginsClassLoader());
  	for (PluginLibraryDescriptor pluginLibraryDescriptor : pluginLibraryLoader) {
  		result.add(pluginLibraryDescriptor);
  	}
  	
  	return result;
  }
  
  public List<Class<?>> getRESTServices() throws PluginManagerException {
  	List<Class<?>> result = new ArrayList<>();
  	
  	try {
    	List<PluginLibraryDescriptor> pluginLibraries = discoverPluginLibraries();
    	for (PluginLibraryDescriptor pluginLibrary : pluginLibraries) {
    		for (Class<? extends PluginDescriptor> pluginClass : pluginLibrary.getPlugins()) {
				  if (RESTPluginDescriptor.class.isAssignableFrom(pluginClass)) {
				  	RESTPluginDescriptor plugin = (RESTPluginDescriptor) pluginClass.newInstance();
				  	for (Class<?> service : plugin.getRESTServices()) {
  				  	result.add(service);
				  	}
				  }
    		}
    	}
    	
    	return result;
  	} catch (InstantiationException | IllegalAccessException e) {
			throw new PluginManagerException(e);
		}
  }
  
  public PluginLibraryDescriptor getLibraryDescriptorOfPluginDescriptor(PluginDescriptor pluginDescriptor) {
    Class<? extends PluginDescriptor> pluginDescriptorClass = pluginDescriptor.getClass();
    
    if (libraryByPlugin.isEmpty()) {
      for (PluginLibraryDescriptor pluginLibraryDescriptor : discoverPluginLibraries()) {
        for (Class<? extends PluginDescriptor> pdClass: pluginLibraryDescriptor.getPlugins()) {
          libraryByPlugin.put(pdClass, pluginLibraryDescriptor);
        }
      }
    }
    
    return libraryByPlugin.get(pluginDescriptorClass);
  }
  
  public List<PluginLibraryInfo> getLoadedPluginLibraryInfos() {
    return Collections.unmodifiableList(loadedPluginLibraryInfos);
  }

  /** Returns the class loader that loads the plugins.
   * 
   * @return the class loader that loads the plugins. 
   */
  public ClassLoader getPluginsClassLoader() {
    return libraryLoader.getPluginsClassLoader();
  }
  
  private List<Exclusion> applicationProvidedArtifacts = new ArrayList<>();
  private LibraryLoader libraryLoader;
  private MavenClient mavenClient;
  private List<PluginLibraryInfo> loadedPluginLibraryInfos = new ArrayList<>();
  private Map<Class<? extends PluginDescriptor>, PluginLibraryDescriptor> libraryByPlugin = new HashMap<>();
}