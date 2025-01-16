/*
 * @Description: 
 * @Author: sky
 * @Date: 2024-11-15 17:16:43
 * @LastEditTime: 2024-11-20 14:11:19
 * @LastEditors: sky
 */
import { createRequire } from 'module';
import { execSync } from 'child_process';
import fs from 'fs';

import updatelog from './updatelog.mjs';

const require = createRequire(import.meta.url);

async function release() {
    const flag = process.argv[2] ?? 'patch';
    const packageJson = require('../package.json');
    const tauriConfPath = './src-tauri/tauri.conf.json';
    const cargoConfPath = './src-tauri/Cargo.toml';
    const pythonConfPath = './envapi/config.json';
    const tauriConf = JSON.parse(fs.readFileSync(tauriConfPath, 'utf-8'));
    const pythonConf = JSON.parse(fs.readFileSync(pythonConfPath, 'utf-8'));
    let [a, b, c] = packageJson.version.split('.').map(Number);

    if (flag === 'major') {  // Main version
        a += 1;
        b = 0;
        c = 0;
        pythonConf.APP_FORCE_UPDATE = true;  // Set to true for major version
    } else if (flag === 'minor') {  // Minor version
        b += 1;
        c = 0;
        pythonConf.APP_FORCE_UPDATE = false; 
    } else if (flag === 'patch') {  // Patch version
        c += 1;
        pythonConf.APP_FORCE_UPDATE = false; 
    } else {
        console.log(`Invalid flag "${flag}"`);
        process.exit(1);
    }

    const nextVersion = `${a}.${b}.${c}`;
    packageJson.version = nextVersion;

    const nextTag = `v${nextVersion}`;
    const newlog = await updatelog(nextTag, 'release');

    // Ensure the new logs are split into a list
    const updateLog = newlog;
    const logList = updateLog.split('\n').map(log => log.trim()).filter(log => log.length > 0);

    // Update tauri.conf.json
    tauriConf.version = nextVersion;
    fs.writeFileSync(tauriConfPath, JSON.stringify(tauriConf, null, 2));

    // Update package.json
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));

    // Update config.json
    pythonConf.APP_VERSION = nextVersion;
    pythonConf.APP_UPDATE_LOG = logList;  // Use the list of logs
    pythonConf.APP_UPDATE_LINK = `https://mirror.ghproxy.com/https://github.com/sky984-11/YunTu/releases/download/${nextTag}/YunTu_${nextTag}.apk`
    fs.writeFileSync(pythonConfPath, JSON.stringify(pythonConf, null, 2));

    // Update Cargo.toml
    const cargoConf = fs.readFileSync(cargoConfPath, 'utf-8');
    const updatedCargoConf = cargoConf.replace(/version = "(\d+\.\d+\.\d+)"/, `version = "${nextVersion}"`);
    fs.writeFileSync(cargoConfPath, updatedCargoConf);


    // Commit changes, tag, and push
    execSync('git add ./package.json ./UPDATE_LOG.md src-tauri/tauri.conf.json ./envapi/config.json src-tauri/Cargo.toml');
    execSync(`git commit -m "v${nextVersion}"`);
    execSync(`git tag -a v${nextVersion} -m "v${nextVersion}"`);
    execSync(`git push`);
    execSync(`git push origin v${nextVersion}`);
    console.log(`Publish Successfully...`);
}

release().catch(console.error);
