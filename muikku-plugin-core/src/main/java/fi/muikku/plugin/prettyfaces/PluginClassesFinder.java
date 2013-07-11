package fi.muikku.plugin.prettyfaces;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.jar.JarEntry;
import java.util.jar.JarInputStream;

import javax.servlet.ServletContext;

import com.ocpsoft.pretty.faces.config.annotation.AbstractClassFinder;
import com.ocpsoft.pretty.faces.config.annotation.PackageFilter;
import com.ocpsoft.pretty.faces.config.annotation.PrettyAnnotationHandler;

import fi.muikku.plugin.manager.PluginClassLoader;
import fi.muikku.plugin.manager.PluginManagerException;
import fi.muikku.plugin.manager.SingletonPluginManager;

public class PluginClassesFinder extends AbstractClassFinder {

	public PluginClassesFinder(ServletContext servletContext, PackageFilter packageFilter) {
		super(servletContext, resolvePluginClassLoader(), packageFilter);
	}

	@Override
	public void findClasses(PrettyAnnotationHandler classHandler) {
		PluginClassLoader pluginClassLoader = getPluginClassLoader();

		ClassLoader originalContextClassLoader = Thread.currentThread().getContextClassLoader();
		try {
			Thread.currentThread().setContextClassLoader(pluginClassLoader);

			for (URL pluginUrl : pluginClassLoader.getURLs()) {

				if (pluginUrl.getPath().endsWith(".jar")) {
					processJarFile(pluginUrl, classHandler);
				} else {
					try {
						File file = new File(pluginUrl.toURI());
						if (file.isDirectory()) {
							processFolder(null, file, classHandler);
						}
					} catch (URISyntaxException e) {
					}
				}
			}
		} finally {
			Thread.currentThread().setContextClassLoader(originalContextClassLoader);
		}
	}

	private void processJarFile(URL pluginUrl, PrettyAnnotationHandler classHandler) {
		JarInputStream jarInputStream = null;
		
		try {
			jarInputStream = new JarInputStream(pluginUrl.openStream());
		} catch (IOException e) {
			log.warn("Error occured while trying to open jar input stream", e);
		}
		
		try {
			JarEntry jarEntry = null;
			try {
				while ((jarEntry = jarInputStream.getNextJarEntry()) != null) {
					String fileName = jarEntry.getName();
					if (fileName.endsWith(".class")) {
					  String className = getClassName(fileName);
					  processClass(className, jarInputStream, classHandler);
					}
				}
			} catch (IOException e) {
			  // Just skip the file is some IO occurs.
				log.warn("Error occured while processing jar class file", e);
			}
		} finally {
			try {
				if (jarInputStream != null) {
				  jarInputStream.close();
				}
			} catch (IOException e) {
				log.warn("Error occured while trying to close jar input stream", e);
			}
		}
	}

	private void processFolder(String packageName, File folder, PrettyAnnotationHandler classHandler) {
		for (File child : folder.listFiles()) {
			String name = child.getName();

			if (child.isDirectory()) {
				processFolder(packageName != null ? packageName + "." + name : name, child, classHandler);
			} else {
				if (name.endsWith(".class")) {
					String className = getClassName(packageName + '.' + name);

					if (mustProcessClass(className)) {
						try {
							FileInputStream classStream = new FileInputStream(child);
							try {
								processClass(className, classStream, classHandler);
							} finally {
								classStream.close();
							}
						} catch (IOException e) {
							// Just skip the file is some IO occurs.
							log.warn("Error occured while processing class file: " + className, e);
						}
					}
				}
			}
		}
	}

	private PluginClassLoader getPluginClassLoader() {
		return (PluginClassLoader) classLoader;
	}

	private static final ClassLoader resolvePluginClassLoader() {
		try {
			return SingletonPluginManager.getInstance().getPluginsClassLoader();
		} catch (PluginManagerException e) {
			return null;
		}
	}
}
