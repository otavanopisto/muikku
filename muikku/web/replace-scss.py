from os import listdir, fdopen, remove
from os.path import isfile, isdir, join
from tempfile import mkstemp
from shutil import move

litz = [
	"display",
	"flex-direction",
	"flex-wrap",
	"flex-flow",
	"order",
	"flex-grow",
	"flex-shrink",
	"flex-basis",
	"flex",
	"justify-content",
	"align-items",
	"align-self",
	"align-content"
]

litz2 = [
	[["flex", "inline-flex"], ["vp-flexbox", "vp-inline-flex"], False],
	[None, "vp-flex-direction", False],
	[None, "vp-flex-wrap", False],
	[None, "vp-flex-flow", False],
	[None, "vp-order", False],
	[None, "vp-flex-grow", False],
	[None, "vp-flex-shrink", False],
	[None, "vp-flex-basis", False],
	[None, "vp-flex", True],
	[None, "vp-align-items", False],
	[None, "vp-align-self", False],
	[None, "vp-align-content", False]
]

def getFiles(dir):
	filez = listdir(dir)
	shittyfilez = [getFiles(join(dir, f)) for f in filez if isdir(join(dir, f))];
	sheet = []
	for asubset in shittyfilez:
		for afile in asubset:
			sheet.append(afile)
	return [join(dir, f) for f in filez if isfile(join(dir, f))] + sheet

def process(line):
	if "vp-" in line or "@include" in line or ":" not in line:
		return line
	property = line.split(":")[0].strip()
	value = line.split(":")[1].replace(";","").strip()

	if (property in litz):
		index = litz.index(property)
		requiredValue = litz2[index][0]

		if requiredValue is not None and (((not isinstance(requiredValue, list)) and value != requiredValue) or (isinstance(requiredValue, list) and value not in requiredValue)):
			return line;

		newPropertyActual = litz2[index][1] if not isinstance(requiredValue, list) else litz2[index][1][requiredValue.index(value)]

		newPropertyInclude = line.split(":")[0].replace(property, "") + '@include ' + newPropertyActual
		result = newPropertyInclude
		if (requiredValue is not None):
			result += ";\n"
		else:
			if litz2[index][2]:
				result += "(" + ", ".join(list(filter(None, value.split(" ")))) + ")"
			else:
				result += "(" + value + ");\n"

		print(line + result)
		return result

	return line

for file in getFiles('./sass'):
	fh, abs_path = mkstemp()
	with fdopen(fh,'w') as new_file:
		with open(file) as old_file:
			for line in old_file:
				new_file.write(process(line))
	remove(file)
	move(abs_path, file)
