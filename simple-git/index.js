const fs = require('fs');
const simpleGit = require('simple-git');
const params = require('./params.js');
const execCli = require('child_process').exec;
const git = simpleGit();

const { appIds, gitUrl, featureName, components, commitMsg } = params;

const checkoutMaster = async ({ git, appId, featureName }, cb) => {
    // console.log(`正在检查${appId}是否在master分支`);
    // const status = await git.status();
    // console.log('status','origin/' + featureName)
    // if (status.current !== 'origin/' + featureName) { // 则切换到master分支
        await git.checkout('origin/' + featureName);
    // }
    // console.log('status.current ',await git.status() )
    // 拉取最新代码
    // await git.pull();
    // const d = new Date();//feat/${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}-${d.getHours()}${d.getMinutes()}-
    // const reallyBranchName = `feat/${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}-${d.getHours()}${d.getMinutes()}-${featureName}`;
    // await git.checkoutLocalBranch(reallyBranchName);
    cb && cb(featureName);
};

const Update = (appId) => {
    return {
        checkoutMaster,
        getPackageInfo: () => {
            return require('./' + appId + '/package.json');
        },
        execCmd: (cmd, cb) => {
            execCli(cmd, function(err, stdout, stderr) {
                if (err) {
                    console.log(stderr);
                    return;
                }
                cb && cb();
            });
        }
    };
};


const readPackageInfo = () => {
    appIds.map(({ id, asName }) => {
        try {
            const UpdateObj = Update(asName || id); // 获取到当前的更新信息
            UpdateObj.checkoutMaster({
                git: simpleGit(`./${asName || id}`),
                appId: id,
                featureName
            }, (reallyBranchName) => {
                console.log(`${id}项目的master分支已经是最新代码...`);
                const package = UpdateObj.getPackageInfo();
                const { dependencies } = package;
                let u_c_s = []; // 要升级的组件
                components.map(({name, version}) => {
                    if (Object.keys(dependencies).some(k => k === name)) {
                        u_c_s.push(`${name}@${version}`);
                    }
                });
                let cmd = '';
                if (u_c_s.length) { // 说明有需要升级的包
                    cmd = `pnpm add ${u_c_s.join(' ')}`
                }
                if (cmd) {
                    const appDir = `cd ${asName || id} &&`;
                    // 执行升级的命令
                    console.log(`${id}项目正在安装依赖。。`);
                    UpdateObj.execCmd(appDir + ' pnpm i', async () => {
                        console.log(`${id}项目依赖安装完成，开始更新最新的包...`);
                        console.log('UpdateObj', UpdateObj, `${appDir} ${cmd}`)
                        await UpdateObj.execCmd(`${appDir} ${cmd}`, () => {
                            const SGit = simpleGit(`./${asName || id}`)
                            console.log('git', SGit, git)
                            SGit
                            .add('./*')
                            .commit(commitMsg)
                            .addRemote('origin/' + reallyBranchName, `${gitUrl}${asName || id}.git`)
                            .push(['-u', 'origin', reallyBranchName], () => console.log(`${id}项目依赖更新成功，项目已经推送到了远端`));
                        });
                    });
                    // 
                }
            }); // 切换到master分支，并拉取最新代码, 后创建临时分支
        } catch (e) {
            console.log(`${id}项目下没有找到对应的update.js 文件!`);
        }
    });
}

// 先下载下所有的项目
const cloneApps = () => {
    console.log('开始clone项目。。。');
    appIds.map(({ id, asName }) => {
        fs.access(`./${asName || id}/package.json`, fs.constants.F_OK, async err => {
            if (err) { // 说明没有该项目
                await git.clone(`${gitUrl}${asName || id}.git`);
            }
            if (id === appIds[appIds.length - 1].id) {
                console.log(`所有项目 clone 成功！`);
                readPackageInfo();
            }
        });
    });
}


cloneApps();