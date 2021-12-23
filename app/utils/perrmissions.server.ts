// const Actions = {
//     MESSAGE_CREATE: 1,
//     MESSAGE_READ: 2,
//     SERVER_CREATE: 4,
//     SERVER_READ: 8,
// }

// function checkPermission(permission, action) {
//     return !!(permission & action);
// }

// function checkAllPermissions(permission) {

//     let all = { ...Actions };
    
//     Object.keys(all).forEach(key => {
//         all[key] = checkPermission(permission, all[key]);
//     });

//     return all;

// }

// function addPermission(permission, action) {
//     return permission | action;
// }

// function removePermission(permission, action) {
//     return permission & ~action;
// }

export {};