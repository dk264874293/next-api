// 搭建的项目
const antd4Apps = [{
    id: '62010'
// }, {
//     id: '62011'
// }, {
//     id: '62013'
// }, {
//     id: '62014'
// }, {
//     id: '62019'
// }, {
//     id: '61208'
// }, {
//     id: '61501'
}];

// antd3 的项目
const antd3Apps = [
    // {
    //     id: '62011',
    //     // asName: 'admin-oms'
    // }, 
    // {
    //     id: '62019',
    //     // asName: 'admin-fms'
    // }, {
    //     id: '61208'
    // },
     {
        id: '62002'
    },
    //  {
    //     id: '62003'
    // }, {
    //     id: '62007'
    // }, 
    // {
    //     id: '60040',
    //     asName:'admin-crm-new'
    // },
    //  {
    //     id: '61301'
    // }, {
    //     id: '63006'
    // }
    // {
    //     id:'61208'
    // }
]
const params = {
    featureName: 'release/20230412-url',
    components: [ {
        name: '@yqn/launcher-plugin-i18n',
        version: '2.4.3-beta.5'
    }],
    appIds: [
        // ...antd4Apps,
        ...antd3Apps
    ],
    commitMsg: 'feat: 统一升级i18n',
    gitUrl: 'git@git.iyunquna.com:frontend/',
};

module.exports = params;