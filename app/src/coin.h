/*******************************************************************************
*  (c) 2019 Zondax GmbH
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      http://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License.
********************************************************************************/
#pragma once

#ifdef __cplusplus
extern "C" {
#endif

#include <stdint.h>
#include <stddef.h>

#define CLA                  0x55

#define HDPATH_LEN_DEFAULT   5

#define HDPATH_0_DEFAULT     (0x80000000u | 0x2cu)
#define HDPATH_1_DEFAULT     (0x80000000u | 0x14A)
#define HDPATH_2_DEFAULT     (0x80000000u | 0u)
#define HDPATH_3_DEFAULT     (0u)
#define HDPATH_4_DEFAULT     (0u)

#define PK_LEN_SECP256K1     33u

typedef enum {
    addr_secp256k1 = 0,
} address_kind_e;

#define VIEW_ADDRESS_OFFSET_SECP256K1       PK_LEN_SECP256K1
#define VIEW_ADDRESS_LAST_PAGE_DEFAULT      0

#define MENU_MAIN_APP_LINE1                "Terra"
#define MENU_MAIN_APP_LINE2                "ready"
#define APPVERSION_LINE1                   "Version:"
#define APPVERSION_LINE2                   ("v" APPVERSION)

#define CRYPTO_BLOB_SKIP_BYTES              0
#define COIN_DEFAULT_CHAINID                "columbus-5"

// In non-expert mode, the app will convert from uluna to LUNA
#define COIN_DEFAULT_DENOM_LUNA             "uluna"
#define COIN_DEFAULT_DENOM_KRT              "ukrw"
#define COIN_DEFAULT_DENOM_SDT              "usdr"
#define COIN_DEFAULT_DENOM_UST              "uusd"
#define COIN_DEFAULT_DENOM_MNT              "umnt"

#define COIN_DEFAULT_DENOM_LUNA_REPR        "LUNA"
#define COIN_DEFAULT_DENOM_KRT_REPR         "KRT"
#define COIN_DEFAULT_DENOM_SDT_REPR         "SDT"
#define COIN_DEFAULT_DENOM_UST_REPR         "UST"
#define COIN_DEFAULT_DENOM_MNT_REPR         "MNT"

#define COIN_DEFAULT_DENOM_FACTOR           6


#ifdef __cplusplus
}
#endif
