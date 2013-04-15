package fi.muikku.plugin.manager;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.ServiceLoader;
import java.util.logging.Logger;

import org.apache.maven.repository.internal.ArtifactDescriptorUtils;
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
      // Application artifact is used for detecting artifacts that are already provided by 
      // main application and should not be loaded by plugins
    	
  		addProvidedArtifact(applicationArtifact, null);
    }
  }

  private void addProvidedArtifact(Artifact artifact, List<RemoteRepository> remoteRepositories) throws PluginManagerException {
  	artifact = ArtifactDescriptorUtils.toPomArtifact(artifact);
  	
  	processedArtifacts.add(getArtifactId(artifact));
  	
  	ArtifactDescriptorResult descriptorResult = null;

  	try {
  	  if (remoteRepositories == null) {
				descriptorResult = mavenClient.describeArtifact(artifact);
  	  } else {
  	  	descriptorResult = mavenClient.describeArtifact(artifact, remoteRepositories);
  	  }
		} catch (ArtifactResolutionException | ArtifactDescriptorException | VersionResolutionException e) {
			logger.warning("Resolution of application provided artifact '" + artifact.toString() + "' failed");
		}
  	
  	if (descriptorResult != null) {
    	List<Dependency> dependencies = new ArrayList<>();
    	
    	for (Dependency dependency : descriptorResult.getDependencies()) {
    		if (!processedArtifacts.contains(getArtifactId(dependency.getArtifact()))) {
        	dependencies.add(dependency);
    		}
      }
  
    	for (Dependency dependency : dependencies) {
  			addProvidedArtifact(dependency.getArtifact(), descriptorResult.getRepositories());
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
  
  private String getArtifactId(Artifact artifact) {
  	return artifact.getGroupId() + "-" + artifact.getArtifactId();
  }
  
  private void loadArtifact(Artifact artifact, List<RemoteRepository> remoteRepositories) throws PluginManagerException, ArtifactResolutionException, ArtifactDescriptorException, VersionResolutionException {
  	processedArtifacts.add(getArtifactId(artifact));
  	
  	ArtifactDescriptorResult descriptorResult;
  	
  	if (remoteRepositories == null) {
  		descriptorResult = mavenClient.describeArtifact(artifact);
  	} else {
  		descriptorResult = mavenClient.describeArtifact(artifact, remoteRepositories);
  	}
  	
  	List<Dependency> dependencies = new ArrayList<>();
  	
  	for (Dependency dependency : descriptorResult.getDependencies()) {
      if ("compile".equals(dependency.getScope())) {
      	dependencies.add(dependency);
      } else {
      	logger.info("Marking " + getArtifactId(dependency.getArtifact()) + " as processed because it's scope is " + dependency.getScope());
      	processedArtifacts.add(getArtifactId(dependency.getArtifact()));
      }
    }

  	for (Dependency dependency : dependencies) {
  		if (!processedArtifacts.contains(getArtifactId(dependency.getArtifact()))) {
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
  
  private List<String> processedArtifacts = new ArrayList<>();
  private LibraryLoader libraryLoader;
  private MavenClient mavenClient;
}
 