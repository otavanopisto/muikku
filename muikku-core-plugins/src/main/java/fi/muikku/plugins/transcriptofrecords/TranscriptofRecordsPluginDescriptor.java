package fi.muikku.plugins.transcriptofrecords;

import java.util.ArrayList;
import java.util.List;
import java.util.ResourceBundle;

import org.apache.commons.lang3.LocaleUtils;

import fi.muikku.i18n.LocaleBundle;
import fi.muikku.i18n.LocaleLocation;
import fi.muikku.plugin.LocalizedPluginDescriptor;
import fi.muikku.plugin.PluginDescriptor;




public class TranscriptofRecordsPluginDescriptor implements PluginDescriptor, LocalizedPluginDescriptor {
	
	  @Override
	  public void init() {
	  }
	  
		@Override
		public String getName() {
			return "transcriptofrecords";
		}

	  @Override
	  public List<LocaleBundle> getLocaleBundles() {
	    List<LocaleBundle> bundles = new ArrayList<LocaleBundle>();
	    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.transcriptofrecords.TranscriptofRecordsPlugin", LocaleUtils.toLocale("fi"))));
	    bundles.add(new LocaleBundle(LocaleLocation.APPLICATION, ResourceBundle.getBundle("fi.muikku.plugins.transcriptofrecords.TranscriptofRecordsPlugin", LocaleUtils.toLocale("en"))));
	    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.transcriptofrecords.TranscriptofRecordsJsPlugin", LocaleUtils.toLocale("fi"))));
	    bundles.add(new LocaleBundle(LocaleLocation.JAVASCRIPT, ResourceBundle.getBundle("fi.muikku.plugins.transcriptofrecords.TranscriptofRecordsJsPlugin", LocaleUtils.toLocale("en"))));
	    return bundles;
	  }
}