MAIN_SCSS_FILES=$(wildcard sass/*.scss)
MAIN_SOURCES=$(filter-out sass/_%,$(MAIN_SCSS_FILES))
MAIN_TARGETS=$(MAIN_SOURCES:sass/%.scss=css/%.css)

FLEX_SCSS_FILES=$(wildcard sass/flex/*.scss)
FLEX_SOURCES=$(filter-out sass/flex/_%,$(FLEX_SCSS_FILES))
FLEX_TARGETS=$(FLEX_SOURCES:sass/flex/%.scss=css/flex/%.css)

.PHONY: all
all: $(MAIN_TARGETS) $(FLEX_TARGETS)

css/%.css: sass/%.scss
	sassc $< $@

css/flex/%.css: sass/flex/%.scss
	sassc $< $@
