from tkinter import Tk, Label, Button, Entry, StringVar
import subprocess
import os

class GUI:
	def __init__(self, main):
		self.main = main
		main.title("Redeploy script that Actually Works")

		wildFlyLocationLabel = Label(main, text="Wildfly location path", font=("Ubuntu", 18))
		wildFlyLocationLabel.pack()

		self.wildFlyLocation = Entry(main, font=("Ubuntu", 18))
		self.wildFlyLocation.pack()

		self.runButton = Button(main, text="run", command=self.run, font=("Ubuntu", 18))
		self.runButton.pack()

		self.status = StringVar()
		self.statusLabel = Label(main, textvariable=self.status, font=("Ubuntu", 18))
		self.statusLabel.pack()

		self.getValue()

		self.setStatus("Ready")

	def getValue(self):
		try:
			self.setStatus("Reading Config...")
			file = open("./rconfig", "r")
			self.wildFlyLocation.insert(0, file.read())
			file.close()
		except:
			pass

	def setStatus(self, text):
		self.status.set(text)
		self.statusLabel.update_idletasks()

	def run(self):
		self.setStatus("Reading Config...")
		wildFlyLocation = self.wildFlyLocation.get();
		file = open("./rconfig", "w")
		file.write(wildFlyLocation)
		file.close()

		mName = [f for f in os.listdir(wildFlyLocation + "/standalone/deployments/") if os.path.isdir(wildFlyLocation + "/standalone/deployments/" + f) and f.startswith("muikku")][0]
		coreName = [f for f in os.listdir(wildFlyLocation + "/standalone/deployments/" + mName + "/WEB-INF/lib/") if os.path.isdir(wildFlyLocation + "/standalone/deployments/" + mName + "/WEB-INF/lib/" + f) and f.startswith("core-plugins") and not f.startswith("core-plugins-persistence")][0]

		self.setStatus("Compiling...")
		subprocess.call(["npm","run","install"])

		self.setStatus("Publishing...")
		subprocess.call(["cp","-r","../dist",wildFlyLocation + "/standalone/deployments/" + mName + "/WEB-INF/lib/" + coreName + "/META-INF/resources/scripts"])

		self.setStatus("Ready")

root = Tk()
root.tk.call('tk', 'scaling', 2.0)
root.geometry('640x480+0+0')
gui = GUI(root)
root.mainloop()
