/*******************************************************************************
*  (c) 2019-2021 Zondax GmbH
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

#define CLA                  0x55

#define HDPATH_LEN_DEFAULT   5

#define HDPATH_0_DEFAULT     (0x80000000u | 0x2cu)
#define HDPATH_1_DEFAULT     (0x80000000u | 0x14A)
#define HDPATH_2_DEFAULT     (0x80000000u | 0u)
#define HDPATH_3_DEFAULT     (0u)

#define PK_LEN_SECP256K1     33u

typedef enum {
    addr_secp256k1 = 0,
} address_kind_e;

#define VIEW_ADDRESS_OFFSET_SECP256K1       PK_LEN_SECP256K1
#define VIEW_ADDRESS_LAST_PAGE_DEFAULT      0

#define MENU_MAIN_APP_LINE1                "Terra"
#define MENU_MAIN_APP_LINE2                "Ready"
#define APPVERSION_LINE1                   "Version:"
#define APPVERSION_LINE2                   ("v" APPVERSION)

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
#define COIN_DEFAULT_DENOM_TRIMMING         6

#define COIN_DENOM_MAXSIZE                  50
#define COIN_AMOUNT_MAXSIZE                 50

#define COIN_MAX_CHAINID_LEN                20
#define INDEXING_TMP_KEYSIZE 70
#define INDEXING_TMP_VALUESIZE 70
#define INDEXING_GROUPING_REF_TYPE_SIZE 70
#define INDEXING_GROUPING_REF_FROM_SIZE 70

#define MENU_MAIN_APP_LINE2_SECRET         "?"
#define COIN_SECRET_REQUIRED_CLICKS         0


#ifdef __cplusplus
}
#endif
