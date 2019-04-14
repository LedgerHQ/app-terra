#*******************************************************************************
#   Ledger App
#   (c) 2017 Ledger
#   (c) 2018 ZondaX GmbH
#
#  Licensed under the Apache License, Version 2.0 (the "License");
#  you may not use this file except in compliance with the License.
#  You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
#  Unless required by applicable law or agreed to in writing, software
#  distributed under the License is distributed on an "AS IS" BASIS,
#  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
#  See the License for the specific language governing permissions and
#  limitations under the License.
#*******************************************************************************

ifeq ($(BOLOS_SDK),)
$(error BOLOS_SDK is not set)
endif

dummy_submodules := $(shell git submodule update --init --recursive)

SCRIPT_LD:=$(CURDIR)/script.ld

include $(BOLOS_SDK)/Makefile.defines

# Main app configuration
APPNAME = "Terra"
APPVERSION_M=1
APPVERSION_N=3
APPVERSION_P=2

APP_LOAD_PARAMS = --appFlags 0x00 --delete $(COMMON_LOAD_PARAMS) --path "44'/118'"
ICONNAME=$(CURDIR)/icon.gif

############
# Platform

DEFINES   += UNUSED\(x\)=\(void\)x

APPVERSION=$(APPVERSION_M).$(APPVERSION_N).$(APPVERSION_P)
DEFINES   += APPVERSION=\"$(APPVERSION)\"

DEFINES += OS_IO_SEPROXYHAL IO_SEPROXYHAL_BUFFER_SIZE_B=128
DEFINES += HAVE_IO_USB HAVE_L4_USBLIB IO_USB_MAX_ENDPOINTS=7 IO_HID_EP_LENGTH=64 HAVE_USB_APDU

DEFINES += HAVE_BAGL HAVE_SPRINTF
DEFINES += PRINTF\(...\)=
DEFINES += HAVE_IO_USB HAVE_L4_USBLIB IO_USB_MAX_ENDPOINTS=7 IO_HID_EP_LENGTH=64 HAVE_USB_APDU

DEFINES += LEDGER_MAJOR_VERSION=$(APPVERSION_M) LEDGER_MINOR_VERSION=$(APPVERSION_N) LEDGER_PATCH_VERSION=$(APPVERSION_P)

SDK_SOURCE_PATH += lib_u2f
DEFINES   += HAVE_U2F HAVE_IO_U2F
DEFINES   += USB_SEGMENT_SIZE=64
DEFINES   += U2F_PROXY_MAGIC=\"CSM\"
DEFINES   += U2F_MAX_MESSAGE_SIZE=264 #257+5+2

DEFINES   += HAVE_BOLOS_APP_STACK_CANARY
DEFINES   += LEDGER_SPECIFIC

#Feature temporarily disabled
#DEFINES += TESTING_ENABLED
#DEFINES += FEATURE_ED25519

# Compiler, assembler, and linker

ifneq ($(BOLOS_ENV),)
$(info BOLOS_ENV=$(BOLOS_ENV))
CLANGPATH := $(BOLOS_ENV)/clang-arm-fropi/bin/
GCCPATH := $(BOLOS_ENV)/gcc-arm-none-eabi-5_3-2016q1/bin/
else
$(info BOLOS_ENV is not set: falling back to CLANGPATH and GCCPATH)
endif

ifeq ($(CLANGPATH),)
$(info CLANGPATH is not set: clang will be used from PATH)
endif

ifeq ($(GCCPATH),)
$(info GCCPATH is not set: arm-none-eabi-* will be used from PATH)
endif

#########################

CC := $(CLANGPATH)clang
CFLAGS += -O3 -Os

AS := $(GCCPATH)arm-none-eabi-gcc
AFLAGS +=

LD       := $(GCCPATH)arm-none-eabi-gcc
LDFLAGS  += -O3 -s
LDLIBS   += -lm -lgcc -lc

##########################

APP_SOURCE_PATH += src deps/jsmn/src deps/ledger-zxlib/include deps/ledger-zxlib/src
SDK_SOURCE_PATH += lib_stusb lib_u2f lib_stusb_impl

#include $(BOLOS_SDK)/Makefile.glyphs

all: default

load:
	python -m ledgerblue.loadApp $(APP_LOAD_PARAMS)

delete:
	python -m ledgerblue.deleteApp $(COMMON_DELETE_PARAMS)

package:
	./pkgdemo.sh ${APPNAME} ${APPVERSION} ${ICONNAME}

# Import generic rules from the SDK

include $(BOLOS_SDK)/Makefile.rules

#add dependency on custom makefile filename
dep/%.d: %.c Makefile.genericwallet


listvariants:
	@echo VARIANTS COIN terra
