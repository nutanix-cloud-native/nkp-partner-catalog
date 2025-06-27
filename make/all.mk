INCLUDE_DIR := $(dir $(lastword $(MAKEFILE_LIST)))

include $(INCLUDE_DIR)validate.mk
