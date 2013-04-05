package fi.muikku.plugin.manager;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.ServiceLoader;
import java.util.logging.Logger;

import org.sonatype.aether.artifact.Artifact;
import org.sonatype.aether.graph.Dependency;
import org.sonatype.aether.repository.RemoteRepository;
import org.sonatype.aether.resolution.ArtifactDescriptorException;
import org.sonatype.aether.resolution.ArtifactDescriptorResult;
import org.sonatype.aether.resolution.ArtifactResolutionException;
import org.sonatype.aether.resolution.VersionResolutionException;
import org.sonatype.aether.util.artifact.DefaultArtifact;

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

  public static final synchronized SingletonPluginManager initialize(ClassLoader parentClassLoader, String pluginDirectory, List<RemoteRepository> repositories) throws PluginManagerException {
    return initialize(parentClassLoader, pluginDirectory, repositories, null);
  }
  
  /** Initializes the plugin manager. Call this before any other methods.
   * 
   * @param parentClassLoader The parent class loader of the plugin manager.
   * @param repositories The URL:s of the repositories containing the plugins.
   * @param eclipseWorkspace location of Eclipse workspace. This parameter is used for development purposes only.
   * @return The plugin manager instance.
   * @throws PluginManagerException when plugin manager is already initialized
   */
  public static final synchronized SingletonPluginManager initialize(ClassLoader parentClassLoader, String pluginDirectory, List<RemoteRepository> repositories, String eclipseWorkspace) throws PluginManagerException {
    if (INSTANCE != null)
      throw new PluginManagerException("Plugin manger is already initialized");
      
    INSTANCE = new SingletonPluginManager(parentClassLoader, pluginDirectory, repositories, eclipseWorkspace);
    
    return INSTANCE;
  }

  SingletonPluginManager(ClassLoader parentClassLoader, String pluginDirectory, List<RemoteRepository> repositories, String eclipseWorkspace) throws PluginManagerException {
    this.libraryLoader = new LibraryLoader(parentClassLoader);
    mavenClient = new MavenClient(getPluginDirectory(pluginDirectory), eclipseWorkspace);
    for (RemoteRepository repository : repositories) {
      mavenClient.addRepository(repository);
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
  public void loadPluginLibrary(PluginLibraryLoadInfo loadInfo) throws PluginManagerException {
    String groupId = loadInfo.getGroupId();
    String artifactId = loadInfo.getArtifactId();
    String version = loadInfo.getVersion();
    
    try {
    	loadArtifact(new DefaultArtifact(groupId, artifactId, "jar", version), null);
    } catch (ArtifactResolutionException e) {
      throw new PluginManagerException(e);
    } catch (ArtifactDescriptorException e) {
      throw new PluginManagerException(e);
    } catch (VersionResolutionException e) {
    	throw new PluginManagerException(e);
		}
  }
  
  private void loadArtifact(Artifact artifact, List<RemoteRepository> remoteRepositories) throws PluginManagerException, ArtifactResolutionException, ArtifactDescriptorException, VersionResolutionException {
  	ArtifactDescriptorResult descriptorResult;
  	
  	if (remoteRepositories == null) {
  		descriptorResult = mavenClient.describeArtifact(artifact);
  	} else {
  		descriptorResult = mavenClient.describeArtifact(artifact, remoteRepositories);
  	}
  	
  	for (Dependency dependency : descriptorResult.getDependencies()) {
      if ("compile".equals(dependency.getScope())) {
    	  loadArtifact(dependency.getArtifact(), descriptorResult.getRepositories());
      }
    }

  	File artifactFile = mavenClient.getArtifactJarFile(descriptorResult.getArtifact());
  	 
  	if (artifactFile.isDirectory()) {
      logger.info("Loading " + artifact.getGroupId() + "." + artifact.getArtifactId() + ":" + artifact.getVersion() + " plugin folder: " + artifactFile);
			try {
			  libraryLoader.loadClassPath(artifactFile.toURI().toURL());        	
		  } catch (Exception e) {
			}
    } else {
      logger.info("Loading " + artifact.getGroupId() + "." + artifact.getArtifactId() + ":" + artifact.getVersion() + " plugin library jar: " + artifactFile);
      libraryLoader.loadJar(artifactFile);
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

  /** Returns the class loader that loads the plugins.
   * 
   * @return the class loader that loads the plugins. 
   */
  public ClassLoader getPluginsClassLoader() {
    return libraryLoader.getPluginsClassLoader();
  }
  
  private LibraryLoader libraryLoader;
  private MavenClient mavenClient;
}
 