import {expect, test} from "jest";
import Zemu from "@zondax/zemu";
import TerraApp from "@terra-money/ledger-terra-js";
import secp256k1 from "secp256k1/elliptic";
import crypto from "crypto";

const Resolve = require("path").resolve;
const APP_PATH = Resolve("../app/bin/app.elf");

const APP_SEED = "equip will roof matter pink blind book anxiety banner elbow sun young"
const sim_options = {
    logging: true,
    start_delay: 4000,
    custom: `-s "${APP_SEED}"`, 
    X11: true
};

jest.setTimeout(30000)

const example_tx_str_basic = {
    "account_number": "108",
    "chain_id": "columbus-3",
    "fee": {
        "amount": [
            {
                "amount": "600",
                "denom": "uluna"
            }
        ],
        "gas": "200000"
    },
    "memo": "",
    "msgs": [
        {
            "type": "distribution/MsgWithdrawDelegationReward",
            "value": {
                "delegator_address": "terra1w34k53py5v5xyluazqpq65agyajavep29d9qch",
                "validator_address": "terravaloper1kn3wugetjuy4zetlq6wadchfhvu3x7407xc2yx"
            }
        },
        {
            "type": "distribution/MsgWithdrawDelegationReward",
            "value": {
                "delegator_address": "terra1w34k53py5v5xyluazqpq65agyajavep29d9qch",
                "validator_address": "terravaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9ufq6mv0"
            }
        }
    ],
    "sequence": "106"
};

const example_tx_str_expert = {
    "account_number": "108",
    "chain_id": "columbus-3",
    "fee": {
        "amount": [
            {
                "amount": "600",
                "denom": "uluna"
            }
        ],
        "gas": "200000"
    },
    "memo": "",
    "msgs": [
        {
            "type": "distribution/MsgWithdrawDelegationReward",
            "value": {
                "delegator_address": "terra1kky4yzth6gdrm8ga5zlfwhav33yr7hl8ck7clh",
                "validator_address": "terravaloper1kn3wugetjuy4zetlq6wadchfhvu3x7407xc2yx"
            }
        },
        {
            "type": "distribution/MsgWithdrawDelegationReward",
            "value": {
                "delegator_address": "terra1kky4yzth6gdrm8ga5zlfwhav33yr7hl8ck7clh",
                "validator_address": "terravaloper1sjllsnramtg3ewxqwwrwjxfgc4n4ef9ufq6mv0"
            }
        }
    ],
    "sequence": "106"
};

const example_tx_str_combined = {
    "account_number": "108",
    "chain_id": "columbus-3",
    "fee": {
        "amount": [
            {
                "amount": "600",
                "denom": "uluna"
            }
        ],
        "gas": "200000"
    },
    "memo": "",
    "msgs": [
        {
            "type": "distribution/MsgWithdrawDelegationReward",
            "value": {
                "delegator_address": "terra1w34k53py5v5xyluazqpq65agyajavep29d9qch",
                "validator_address": "terravaloper1648ynlpdw7fqa2axt0w2yp3fk542junlaujy76"
            }
        },
        {
            "type": "staking/MsgDelegate",
            "value": {
                "amount": {
                    "amount": "20139397",
                    "denom": "uluna"
                },
                "delegator_address": "terra1w34k53py5v5xyluazqpq65agyajavep29d9qch",
                "validator_address": "terravaloper1648ynlpdw7fqa2axt0w2yp3fk542junlaujy76",
            }
        }
    ],
    "sequence": "106"
};

describe('Basic checks', function () {
    it('can start and stop container', async function () {
        const sim = new Zemu(APP_PATH);
        try {
            await sim.start(sim_options);
        } finally {
            await sim.close();
        }
    });

    it('get app version', async function () {
        const sim = new Zemu(APP_PATH);
        try {
            await sim.start(sim_options);
            const app = new TerraApp(sim.getTransport());
            const resp = await app.getVersion();
            console.log(resp);

            expect(resp.return_code).toEqual(0x9000);
            expect(resp.error_message).toEqual("No errors");
            expect(resp).toHaveProperty("test_mode");
            expect(resp).toHaveProperty("major");
            expect(resp).toHaveProperty("minor");
            expect(resp).toHaveProperty("patch");
        } finally {
            await sim.close();
        }
    });

    it('get app info', async function () {
        const sim = new Zemu(APP_PATH);
        try {
            await sim.start(sim_options);
            const app = new TerraApp(sim.getTransport());
            const info = await app.appInfo();

            console.log(info)
        } finally {
            await sim.close();
        }
    });

    // it('get device info', async function () {
    //     const sim = new Zemu(APP_PATH);
    //     try {
    //         await sim.start(sim_options);
    //         const app = new TerraApp(sim.getTransport());
    //         const resp = await app.deviceInfo();

    //         console.log(resp);

    //         expect(resp.return_code).toEqual(0x9000);
    //         expect(resp.error_message).toEqual("No errors");

    //         expect(resp).toHaveProperty("targetId");
    //         expect(resp).toHaveProperty("seVersion");
    //         expect(resp).toHaveProperty("flag");
    //         expect(resp).toHaveProperty("mcuVersion");
    //     } finally {
    //         await sim.close();
    //     }
    // });

    it('get address', async function () {
        const sim = new Zemu(APP_PATH);
        try {
            await sim.start(sim_options);
            const app = new TerraApp(sim.getTransport());
            // Derivation path. First 3 items are automatically hardened!
            const path = [44, 330, 5, 0, 3];
            const resp = await app.getAddressAndPubKey(path, "terra");

            console.log(resp);

            expect(resp.return_code).toEqual(0x9000);
            expect(resp.error_message).toEqual("No errors");

            expect(resp).toHaveProperty("bech32_address");
            expect(resp).toHaveProperty("compressed_pk");

            expect(resp.bech32_address).toEqual("terra1rpml0hh6kc8g6at2lsatzkd550yc2ngnsachtt");
            expect(resp.compressed_pk.length).toEqual(33);
        } finally {
            await sim.close();
        }
    });

    function compareSnapshots(snapshotPrefixTmp, snapshotPrefixGolden, snapshotCount) {
        for (let i = 0; i < snapshotCount; i++) {
            const img1 = Zemu.LoadPng2RGB(`${snapshotPrefixTmp}${i}.png`);
            const img2 = Zemu.LoadPng2RGB(`${snapshotPrefixGolden}${i}.png`);
            expect(img1).toEqual(img2);
        }
    }

    it('show address', async function () {
        const snapshotPrefixGolden = "snapshots/show-address/";
        const snapshotPrefixTmp = "snapshots-tmp/show-address/";
        let snapshotCount = 0;

        const sim = new Zemu(APP_PATH);
        try {
            await sim.start(sim_options);
            const app = new TerraApp(sim.getTransport());

            // Derivation path. First 3 items are automatically hardened!
            const path = [44, 330, 5, 0, 3];
            const respRequest = app.showAddressAndPubKey(path, "terra");

            // We need to wait until the app responds to the APDU
            await Zemu.sleep(2000);

            // Now navigate the address / path
            await sim.snapshot(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            await sim.clickRight(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            await sim.clickRight(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            await sim.clickRight(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            await sim.clickBoth(`${snapshotPrefixTmp}${snapshotCount++}.png`);

            const resp = await respRequest;
            console.log(resp);

            compareSnapshots(snapshotPrefixTmp, snapshotPrefixGolden, snapshotCount);

            expect(resp.return_code).toEqual(0x9000);
            expect(resp.error_message).toEqual("No errors");

            expect(resp).toHaveProperty("bech32_address");
            expect(resp).toHaveProperty("compressed_pk");

            expect(resp.bech32_address).toEqual("terra1rpml0hh6kc8g6at2lsatzkd550yc2ngnsachtt");
            expect(resp.compressed_pk.length).toEqual(33);
        } finally {
            await sim.close();
        }
    });

    it('show address - HUGE', async function () {
        const sim = new Zemu(APP_PATH);
        try {
            await sim.start(sim_options);
            const app = new TerraApp(sim.getTransport());

            // Derivation path. First 3 items are automatically hardened!
            const path = [44, 330, 2147483647, 0, 4294967295];
            const resp = await app.showAddressAndPubKey(path, "terra");
            console.log(resp);

            expect(resp.return_code).toEqual(0x6985);
            expect(resp.error_message).toEqual("Conditions not satisfied");
        } finally {
            await sim.close();
        }
    });

    it('show address - HUGE - expert', async function () {
        const snapshotPrefixGolden = "snapshots/show-address-huge/";
        const snapshotPrefixTmp = "snapshots-tmp/show-address-huge/";
        let snapshotCount = 0;

        const sim = new Zemu(APP_PATH);
        try {
            await sim.start(sim_options);
            const app = new TerraApp(sim.getTransport());

            // Activate expert mode
            await sim.clickRight(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            await sim.clickBoth(`${snapshotPrefixTmp}${snapshotCount++}.png`);

            // Derivation path. First 3 items are automatically hardened!
            const path = [44, 330, 2147483647, 0, 4294967295];
            const respRequest = app.showAddressAndPubKey(path, "terra");

            // We need to wait until the app responds to the APDU
            await Zemu.sleep(2000);

            // Now navigate the address / path
            await sim.snapshot(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            await sim.clickRight(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            await sim.clickRight(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            await sim.clickRight(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            await sim.clickRight(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            await sim.clickRight(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            await sim.clickRight(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            await sim.clickBoth(`${snapshotPrefixTmp}${snapshotCount++}.png`);

            const resp = await respRequest;
            console.log(resp);

            compareSnapshots(snapshotPrefixTmp, snapshotPrefixGolden, snapshotCount);

            expect(resp.return_code).toEqual(0x9000);
            expect(resp.error_message).toEqual("No errors");

            expect(resp).toHaveProperty("bech32_address");
            expect(resp).toHaveProperty("compressed_pk");

            expect(resp.bech32_address).toEqual("terra1w546yt00vx7ed7c6kkrdy8df3r6rpln58wemg7");
            expect(resp.compressed_pk.length).toEqual(33);
        } finally {
            await sim.close();
        }
    });

    it('sign basic', async function () {
        const snapshotPrefixGolden = "snapshots/sign-basic/";
        const snapshotPrefixTmp = "snapshots-tmp/sign-basic/";
        let snapshotCount = 0;

        const sim = new Zemu(APP_PATH);
        try {
            await sim.start(sim_options);
            const app = new TerraApp(sim.getTransport());

            const path = [44, 330, 0, 0, 0];
            let tx = JSON.stringify(example_tx_str_basic);

            // get address / publickey
            const respPk = await app.getAddressAndPubKey(path, "terra");
            expect(respPk.return_code).toEqual(0x9000);
            expect(respPk.error_message).toEqual("No errors");
            console.log(respPk)

            // do not wait here..
            const signatureRequest = app.sign(path, tx);
            await Zemu.sleep(2000);

            // Reference window
            await sim.snapshot(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            for (let i = 0; i < 9; i++) {
                await sim.clickRight(Resolve(`${snapshotPrefixTmp}${snapshotCount++}.png`));
            }
            await Zemu.sleep(500);
            await sim.clickBoth();

            let resp = await signatureRequest;
            console.log(resp);

            compareSnapshots(snapshotPrefixTmp, snapshotPrefixGolden, snapshotCount);

            expect(resp.return_code).toEqual(0x9000);
            expect(resp.error_message).toEqual("No errors");

            // Now verify the signature
            const hash = crypto.createHash("sha256");
            const msgHash = Uint8Array.from(hash.update(tx).digest());

            const signatureDER = resp.signature;
            const signature = secp256k1.signatureImport(Uint8Array.from(signatureDER));

            const pk = Uint8Array.from(respPk.compressed_pk)

            const signatureOk = secp256k1.ecdsaVerify(signature, msgHash, pk);
            expect(signatureOk).toEqual(true);

        } finally {
            await sim.close();
        }
    });

    it('sign basic - combined tx', async function () {
        const snapshotPrefixGolden = "snapshots/sign-basic-combined/";
        const snapshotPrefixTmp = "snapshots-tmp/sign-basic-combined/";
        let snapshotCount = 0;

        const sim = new Zemu(APP_PATH);
        try {
            await sim.start(sim_options);
            const app = new TerraApp(sim.getTransport());

            const path = [44, 330, 0, 0, 0];
            let tx = JSON.stringify(example_tx_str_combined);

            // get address / publickey
            const respPk = await app.getAddressAndPubKey(path, "terra");
            expect(respPk.return_code).toEqual(0x9000);
            expect(respPk.error_message).toEqual("No errors");
            console.log(respPk)

            // do not wait here..
            const signatureRequest = app.sign(path, tx);

            await Zemu.sleep(3000);

            // Reference window
            await sim.snapshot(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            for (let i = 0; i < 11; i++) {
                await sim.clickRight(Resolve(`${snapshotPrefixTmp}${snapshotCount++}.png`));
            }
            await Zemu.sleep(500);
            await sim.clickBoth();

            let resp = await signatureRequest;
            console.log(resp);

            compareSnapshots(snapshotPrefixTmp, snapshotPrefixGolden, snapshotCount);

            expect(resp.return_code).toEqual(0x9000);
            expect(resp.error_message).toEqual("No errors");

            // Now verify the signature
            const hash = crypto.createHash("sha256");
            const msgHash = Uint8Array.from(hash.update(tx).digest());

            const signatureDER = resp.signature;
            const signature = secp256k1.signatureImport(Uint8Array.from(signatureDER));

            const pk = Uint8Array.from(respPk.compressed_pk)

            const signatureOk = secp256k1.ecdsaVerify(signature, msgHash, pk);
            expect(signatureOk).toEqual(true);

        } finally {
            await sim.close();
        }
    });

    it('show address and sign basic', async function () {
        const snapshotPrefixGolden = "snapshots/show-address-and-sign-basic/";
        const snapshotPrefixTmp = "snapshots-tmp/show-address-and-sign-basic/";
        let snapshotCount = 0;

        const sim = new Zemu(APP_PATH);
        try {
            await sim.start(sim_options);
            const app = new TerraApp(sim.getTransport());

            const path = [44, 330, 0, 0, 0];
            let tx = JSON.stringify(example_tx_str_basic);

            // get address / publickey
            const respRequest = app.showAddressAndPubKey(path, "terra");

            // We need to wait until the app responds to the APDU
            await Zemu.sleep(3000);

            // Now navigate the address / path
            await sim.snapshot(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            await sim.clickRight(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            await sim.clickRight(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            await sim.clickRight(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            await sim.clickBoth(`${snapshotPrefixTmp}${snapshotCount++}.png`);

            const respPk = await respRequest;
            console.log(respPk);

            expect(respPk.return_code).toEqual(0x9000);
            expect(respPk.error_message).toEqual("No errors");
            console.log(respPk)

            // do not wait here..
            const signatureRequest = app.sign(path, tx);

            await Zemu.sleep(3000);

            // Reference window
            await sim.snapshot(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            for (let i = 0; i < 9; i++) {
                await sim.clickRight(Resolve(`${snapshotPrefixTmp}${snapshotCount++}.png`));
            }
            await Zemu.sleep(500);
            await sim.clickBoth();

            let resp = await signatureRequest;
            console.log(resp);

            compareSnapshots(snapshotPrefixTmp, snapshotPrefixGolden, snapshotCount);

            expect(resp.return_code).toEqual(0x9000);
            expect(resp.error_message).toEqual("No errors");

            // Now verify the signature
            const hash = crypto.createHash("sha256");
            const msgHash = Uint8Array.from(hash.update(tx).digest());

            const signatureDER = resp.signature;
            const signature = secp256k1.signatureImport(Uint8Array.from(signatureDER));

            const pk = Uint8Array.from(respPk.compressed_pk)

            const signatureOk = secp256k1.ecdsaVerify(signature, msgHash, pk);
            expect(signatureOk).toEqual(true);

        } finally {
            await sim.close();
        }
    });

    it('sign expert', async function () {
        const snapshotPrefixGolden = "snapshots/sign-expert/";
        const snapshotPrefixTmp = "snapshots-tmp/sign-expert/";
        let snapshotCount = 0;

        const sim = new Zemu(APP_PATH);
        try {
            await sim.start(sim_options);
            const app = new TerraApp(sim.getTransport());

            const path = [44, 330, 0, 0, 0];
            let tx = JSON.stringify(example_tx_str_expert);

            // get address / publickey
            const respPk = await app.getAddressAndPubKey(path, "terra");
            expect(respPk.return_code).toEqual(0x9000);
            expect(respPk.error_message).toEqual("No errors");
            console.log(respPk);

            // enable export mode
            await sim.clickRight();
            await sim.clickBoth();

            // do not wait here..
            const signatureRequest = app.sign(path, tx);

            await Zemu.sleep(3000);

            // Reference window
            await sim.snapshot(`${snapshotPrefixTmp}${snapshotCount++}.png`);
            for (let i = 0; i < 14; i++) {
                await sim.clickRight(Resolve(`${snapshotPrefixTmp}${snapshotCount++}.png`));
            }
            await Zemu.sleep(500);
            await sim.clickBoth();
            await sim.clickBoth();
            await sim.clickBoth();

            let resp = await signatureRequest;
            console.log(resp);

            compareSnapshots(snapshotPrefixTmp, snapshotPrefixGolden, snapshotCount);

            expect(resp.return_code).toEqual(0x9000);
            expect(resp.error_message).toEqual("No errors");

            // Now verify the signature
            const hash = crypto.createHash("sha256");
            const msgHash = Uint8Array.from(hash.update(tx).digest());

            const signatureDER = resp.signature;
            const signature = secp256k1.signatureImport(Uint8Array.from(signatureDER));

            const pk = Uint8Array.from(respPk.compressed_pk)

            const signatureOk = secp256k1.ecdsaVerify(signature, msgHash, pk);
            expect(signatureOk).toEqual(true);

        } finally {
            await sim.close();
        }
    });
});
