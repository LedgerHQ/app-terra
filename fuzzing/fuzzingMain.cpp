/*******************************************************************************
*   (c) 2019 Zondax GmbH
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
#include <iostream>
#include <common/parser_common.h>
#include <common/parser.h>
#include <fstream>
#include "../tests/util/common.h"

#ifndef __AFL_LOOP
#define __AFL_LOOP(x) (0)
#endif

///
/// This file is just a fuzzing stub used by afl
///

void parse(std::istream &istream) {
    parser_context_t ctx;
    parser_error_t err;

    std::string input;
    istream >> input;

    err = parser_parse(&ctx, (const uint8_t *) input.c_str(), input.length());
    if (err != parser_ok)
        return;

    auto output = dumpUI(&ctx, 40, 40);

    for (const auto &line : output) {
        std::cout << line << std::endl;
    }
}

int main(int argc, char **argv) {
    if (argc > 1) {
        std::ifstream fin;
        fin.open(argv[1]);
        parse(fin);
    } else {
        while (__AFL_LOOP(1000)) {
            parse(std::cin);
        }
    }

    return 0;
}
