from tkinter import Tk, Label, Button, Entry, StringVar
import subprocess
import os
from os.path import expanduser
import signal

class GUI:

	def __init__(self, main):
		main.protocol("WM_DELETE_WINDOW", self.onClose)
		self.main = main
		main.title("Redeploy script that Actually Works")

		wildFlyLocationLabel = Label(main, text="Wildfly location path", font=("Ubuntu", 18))
		wildFlyLocationLabel.pack()

		self.wildFlyLocation = Entry(main, font=("Ubuntu", 18))
		self.wildFlyLocation.pack()

		buildArgsLabel = Label(main, text="Maven muikku profile", font=("Ubuntu", 18))
		buildArgsLabel.pack()

		self.buildArgs = Entry(main, font=("Ubuntu", 18))
		self.buildArgs.pack()

		self.runButton = Button(main, text="run", command=self.run, font=("Ubuntu", 18))
		self.runButton.pack()

		#self.mavenBuildButton = Button(main, text="Maven build", command=self.mavenBuild, font=("Ubuntu", 18))
		#self.mavenBuildButton.pack()

		#self.mavenPyramusBuildButton = Button(main, text="Maven pyramus build", command=self.mavenPyramusBuild, font=("Ubuntu", 18))
		#self.mavenPyramusBuildButton.pack()

		#self.deployButton = Button(main, text="Deploy", command=self.deployMuikku, font=("Ubuntu", 18))
		#self.deployButton.pack()

		#self.deployPyramusButton = Button(main, text="Deploy pyramus", command=self.deployPyramus, font=("Ubuntu", 18))
		#self.deployPyramusButton.pack()

		#self.ultraDupaClean = Button(main, text="Ultra dupa clean and deploy", command=self.ultraDupaClean, font=("Ubuntu", 18))
		#self.ultraDupaClean.pack()


		self.status = StringVar()
		self.statusLabel = Label(main, textvariable=self.status, font=("Ubuntu", 18))
		self.statusLabel.pack()

		self.getValues()

		#self.startWildfly()

		self.setStatus("Ready")

	def onClose(self):
		self.stopWildfly();
		self.main.destroy();

	def getValues(self):
		try:
			self.setStatus("Reading Config...")
			file = open("./rconfig", "r")
			readFile = file.read();
			self.wildFlyLocation.insert(0, readFile.split("\n")[0])
			self.buildArgs.insert(0, readFile.split("\n")[1])
			file.close()
		except:
			pass

	def setStatus(self, text):
		self.status.set(text)
		self.statusLabel.update_idletasks()

	def startWildfly(self):
		wildFlyLocation = self.wildFlyLocation.get()
		self.wildFlyProcess = subprocess.Popen([wildFlyLocation + "/bin/standalone.sh"], shell=True, preexec_fn=os.setsid);

	def stopWildfly(self):
		self.wildFlyProcess.kill()
		os.killpg(self.wildFlyProcess.pid, signal.SIGTERM)

	def mavenBuild(self):
		self.setStatus("Building...");
		self.save();
		process = ["mvn", "clean", "install", "-f", "../../../../../../../../pom.xml"]
		buildArgs = self.buildArgs.get();
		if (buildArgs):
			process.append("-P" + buildArgs)
		subprocess.call(process)
		self.deployMuikku()
		self.setStatus("Ready")

	def mavenPyramusBuild(self):
		self.setStatus("Building...");
		self.save();
		process = ["mvn", "clean", "install", "-f", "../../../../../../../../../pyramus/pom.xml"]
		subprocess.call(process)
		self.deployPyramus()
		self.setStatus("Ready")

	def deployMuikku(self):
		mName = [f for f in os.listdir(expanduser("~/.m2/repository/fi/otavanopisto/muikku/muikku")) if os.path.isdir(expanduser("~/.m2/repository/fi/otavanopisto/muikku/muikku/" + f)) and f.endswith("SNAPSHOT")][0]
		mNameActual = [f for f in os.listdir(expanduser("~/.m2/repository/fi/otavanopisto/muikku/muikku/" + mName)) if os.path.isfile(expanduser("~/.m2/repository/fi/otavanopisto/muikku/muikku/" + mName + "/" + f)) and f.endswith(".war")][0];
		self.deploy(expanduser("~/.m2/repository/fi/otavanopisto/muikku/muikku/" + mName + "/" + mNameActual), mNameActual)

	def deployPyramus(self):
		mName = [f for f in os.listdir(expanduser("~/.m2/repository/fi/otavanopisto/pyramus/pyramus")) if os.path.isdir(expanduser("~/.m2/repository/fi/otavanopisto/pyramus/pyramus/" + f)) and f.endswith("SNAPSHOT")][0]
		mNameActual = [f for f in os.listdir(expanduser("~/.m2/repository/fi/otavanopisto/pyramus/pyramus/" + mName)) if os.path.isfile(expanduser("~/.m2/repository/fi/otavanopisto/pyramus/pyramus/" + mName + "/" + f)) and f.endswith(".war")][0];
		self.deploy(expanduser("~/.m2/repository/fi/otavanopisto/pyramus/pyramus/" + mName + "/" + mNameActual), mNameActual)

	def deploy(self, thing, thingName):
		self.setStatus("Deploying...");
		self.save()
		wildFlyLocation = self.wildFlyLocation.get()
		subprocess.call(["mkdir", wildFlyLocation + "/standalone/deployments/" + thingName])
		subprocess.call(["unzip", "-o", thing, "-d", wildFlyLocation + "/standalone/deployments/" + thingName])
		if (thingName.startswith("muikku")):
			coreName = [f for f in os.listdir(wildFlyLocation + "/standalone/deployments/" + thingName + "/WEB-INF/lib/") if os.path.isfile(wildFlyLocation + "/standalone/deployments/" + thingName + "/WEB-INF/lib/" + f) and f.startswith("core-plugins") and not f.startswith("core-plugins-persistence")][0]
			subprocess.call(["unzip", "-o", wildFlyLocation + "/standalone/deployments/" + thingName + "/WEB-INF/lib/" + coreName , "-d", wildFlyLocation + "/standalone/deployments/" + thingName  + "/WEB-INF/lib/" + coreName.replace(".jar", "")]);
		subprocess.call(["touch", wildFlyLocation + "/standalone/deployments/" + thingName + ".dodeploy"])
		self.setStatus("Ready")

	def ultraDupaClean(self):
		wildFlyLocation = self.wildFlyLocation.get()
		subprocess.call(["rm", "-r", "~/.m2/repository/fi/otavanopisto/"])
		for f in os.listdir(wildFlyLocation + "/standalone/deployments"):
			subprocess.call(["rm", "-r", wildFlyLocation + "/standalone/deployments/" + f])
		self.mavenBuild()
		self.mavenPyramusBuild()
		self.run()

	def save(self):
		wildFlyLocation = self.wildFlyLocation.get()
		buildArgs = self.buildArgs.get()
		file = open("./rconfig", "w")
		file.write(wildFlyLocation + "\n" + buildArgs)
		file.close()		

	def run(self):
		self.save();

		wildFlyLocation = self.wildFlyLocation.get()

		mName = [f for f in os.listdir(wildFlyLocation + "/standalone/deployments/") if os.path.isdir(wildFlyLocation + "/standalone/deployments/" + f) and f.startswith("muikku")][0]
		coreName = [f for f in os.listdir(wildFlyLocation + "/standalone/deployments/" + mName + "/WEB-INF/lib/") if os.path.isdir(wildFlyLocation + "/standalone/deployments/" + mName + "/WEB-INF/lib/" + f) and f.startswith("core-plugins") and not f.startswith("core-plugins-persistence")][0]

		self.setStatus("Compiling...")
		subprocess.call(["npm","run","install"])

		self.setStatus("Publishing...")
		subprocess.call(["cp","-r","../dist",wildFlyLocation + "/standalone/deployments/" + mName + "/WEB-INF/lib/" + coreName + "/META-INF/resources/scripts"])

		self.setStatus("Ready")

root = Tk()
root.tk.call('tk', 'scaling', 2.0)
root.geometry('1024x768+0+0')
gui = GUI(root)
root.mainloop()
