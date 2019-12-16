/*******************************************************************************
*   (c) 2018 ZondaX GmbH
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

#include <ctype.h>
#include <string.h>
#include "hexutils.h"

uint8_t hex2dec(char c, char *out) {
    c = (char) tolower((int)c);

    if (!isxdigit((int)c)) {
        return -1;
    }

    if (isdigit((int)c)) {
        *out = c - '0';
        return 0;
    }

    *out = c - 'a' + 10;
    return 0;
}

size_t parseHexString(const char *s, uint8_t *out) {
    size_t len = strlen(s);
    if (len % 2 == 1) {
        return 0;
    }

    for (size_t i = 0; i < len; i += 2) {
        char tmp1, tmp2;
        if (hex2dec(s[i], &tmp1))
            return 0;
        if (hex2dec(s[i + 1], &tmp2))
            return 0;

        out[i >> 1u] = (tmp1 << 4u) + tmp2;
    }

    return len >> 1u;
};
