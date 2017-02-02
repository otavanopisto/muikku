SCSS_FILES=$(wildcard sass/*.scss)
SOURCES=$(filter-out sass/_%,$(SCSS_FILES))
TARGETS=$(SOURCES:sass/%.scss=css/%.css)

.PHONY: all
all: $(TARGETS)

css/%.css: sass/%.scss
	sassc $< $@
