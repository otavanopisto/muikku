MAIN_SCSS_FILES=$(wildcard sass/*.scss)
MAIN_SOURCES=$(filter-out sass/_%,$(MAIN_SCSS_FILES))
MAIN_TARGETS=$(MAIN_SOURCES:sass/%.scss=css/%.css)

DEPRECATED_SCSS_FILES=$(wildcard sass/deprecated/*.scss)
DEPRECATED_SOURCES=$(filter-out sass/deprecated/_%,$(FLEX_SCSS_FILES))
DEPRECATED_TARGETS=$(FLEX_SOURCES:sass/deprecated/%.scss=css/deprecated/%.css)

FLEX_SCSS_FILES=$(wildcard sass/deprecated/flex/*.scss)
FLEX_SOURCES=$(filter-out sass/deprecated/flex/_%,$(FLEX_SCSS_FILES))
FLEX_TARGETS=$(FLEX_SOURCES:sass/deprecated/flex/%.scss=css/deprecated/flex/%.css)

.PHONY: all
all: $(MAIN_TARGETS) $(DEPRECATED_TARGETS) $(FLEX_TARGETS)

css/%.css: sass/%.scss
	sassc $< $@
	
css/deprecated/%.css: sass/deprecated/%.scss
	sassc $< $@ -I sass/deprecated -I sass

css/deprecated/flex/%.css: sass/deprecated/flex/%.scss
	sassc $< $@ -I sass/deprecated/flex -I sass/deprecated
