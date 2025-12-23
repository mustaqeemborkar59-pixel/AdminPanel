module.exports = {

"[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("firebase-admin/firestore");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/firebase-admin/app [external] (firebase-admin/app, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("firebase-admin/app");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/firebase-admin/auth [external] (firebase-admin/auth, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("firebase-admin/auth");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("firebase-admin/firestore", () => require("firebase-admin/firestore"));

module.exports = mod;
}}),
"[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
/* __next_internal_action_entry_do_not_use__ {"0086d1454012dae48d87f8b73ffe6497b833c94961":"signOut","00cf5330395e82bf8255922e76b18a7d7fd7cd3e01":"getCompanyDetailsFromRTDB","00fabfcbf6c7d5ce94aea620a37f0b27f8bc99710c":"getAllUsers","00fbe4446b847dcb1534da57fdc7bde848475e5f33":"getVendorsFromRTDB","401f6e3642acf65262fa6d6423f207ff565e3c09fa":"saveCompanyDetailsToRTDB","40779c49dada2a560ce33d1bb110771da76088dfdb":"getUserProfile","40bf1e58e37d64aa62551098cfe74d13ce5ca568e6":"createUserProfile","40cbdaff50014ed0b40014c44e27555f3e111a576b":"deleteVendorFromRTDB","600197aded821c9a500870fc90fb1fc9d483b962b8":"updateUserProfile","600c8cfbf81d5dd936bd66a95553e26a48de2f90e9":"saveVendorToRTDB","70ca33ff81d844b3ec58711e7aa07fe89bb380c947":"updateUserRole"} */ __turbopack_context__.s({
    "createUserProfile": (()=>createUserProfile),
    "deleteVendorFromRTDB": (()=>deleteVendorFromRTDB),
    "getAllUsers": (()=>getAllUsers),
    "getCompanyDetailsFromRTDB": (()=>getCompanyDetailsFromRTDB),
    "getUserProfile": (()=>getUserProfile),
    "getVendorsFromRTDB": (()=>getVendorsFromRTDB),
    "saveCompanyDetailsToRTDB": (()=>saveCompanyDetailsToRTDB),
    "saveVendorToRTDB": (()=>saveVendorToRTDB),
    "signOut": (()=>signOut),
    "updateUserProfile": (()=>updateUserProfile),
    "updateUserRole": (()=>updateUserRole)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/app [external] (firebase-admin/app, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/auth [external] (firebase-admin/auth, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
;
;
;
// Server-side initialization for Firebase Admin SDK
function initializeAdminApp() {
    const apps = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["getApps"])();
    if (apps.length > 0) {
        return apps[0];
    }
    // Use service account credentials from environment variables
    // This is more explicit and reliable than relying on auto-discovery.
    const serviceAccount = {
        projectId: ("TURBOPACK compile-time value", "sheetmaster-woo4-3652307-f6517"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // The private key must have newline characters escaped to be parsed correctly from .env
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    };
    if (!serviceAccount.projectId || !serviceAccount.clientEmail || !serviceAccount.privateKey) {
        throw new Error("Firebase Admin credentials are not set in the environment variables.");
    }
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["initializeApp"])({
        credential: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["cert"])(serviceAccount),
        databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`
    });
}
function getAdminServices(app) {
    const firestore = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["getFirestore"])(app);
    const auth = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$29$__["getAuth"])(app);
    return {
        firestore,
        auth
    };
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ createUserProfile(details) {
    const adminApp = initializeAdminApp();
    const { firestore, auth } = getAdminServices(adminApp);
    try {
        const userRef = firestore.collection('users').doc(details.uid);
        const isSuperAdmin = details.email === ("TURBOPACK compile-time value", "yasirsolkar28@gmail.com");
        const role = isSuperAdmin ? 'super-admin' : 'user';
        const userProfile = {
            uid: details.uid,
            id: details.uid,
            email: details.email || 'No email',
            displayName: details.displayName || 'New User',
            photoURL: details.photoURL || '',
            role: role
        };
        await userRef.set(userProfile, {
            merge: true
        });
        // Also set custom claim for the user role for robust security
        await auth.setCustomUserClaims(details.uid, {
            role
        });
        return {
            success: true
        };
    } catch (error) {
        console.error('Firestore Profile Creation Error on Signup (Admin):', error);
        return {
            success: false,
            message: error.message || 'Failed to create user profile in database.'
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getUserProfile(uid) {
    const adminApp = initializeAdminApp();
    const { firestore } = getAdminServices(adminApp);
    try {
        const userRef = firestore.collection('users').doc(uid);
        const docSnap = await userRef.get();
        if (docSnap.exists) {
            return {
                success: true,
                data: docSnap.data()
            };
        }
        return {
            success: false,
            message: "User profile not found."
        };
    } catch (error) {
        console.error('Failed to get user profile from Firestore (Admin):', error);
        return {
            success: false,
            message: error.message || 'Failed to fetch user profile.'
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ updateUserProfile(uid, details) {
    const adminApp = initializeAdminApp();
    const { firestore } = getAdminServices(adminApp);
    try {
        const userRef = firestore.collection('users').doc(uid);
        const docSnap = await userRef.get();
        if (docSnap.exists) {
            const updates = {};
            if (details.displayName && details.displayName !== docSnap.data()?.displayName) {
                updates.displayName = details.displayName;
            }
            if (details.photoURL && details.photoURL !== docSnap.data()?.photoURL) {
                updates.photoURL = details.photoURL;
            }
            if (Object.keys(updates).length > 0) {
                await userRef.update(updates);
            }
        }
        return {
            success: true
        };
    } catch (error) {
        console.error('Firestore Profile Update Error (Admin):', error);
        return {
            success: false,
            message: error.message || 'Failed to update user profile in database.'
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getAllUsers() {
    const adminApp = initializeAdminApp();
    const { firestore } = getAdminServices(adminApp);
    try {
        const usersRef = firestore.collection('users');
        const querySnapshot = await usersRef.get();
        const usersArray = [];
        querySnapshot.forEach((doc)=>{
            usersArray.push(doc.data());
        });
        return {
            success: true,
            data: usersArray
        };
    } catch (error) {
        console.error('Failed to get all users from Firestore (Admin):', error);
        return {
            success: false,
            message: error.message || 'Failed to fetch user profiles.'
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ updateUserRole(userId, role, vendorCode) {
    const adminApp = initializeAdminApp();
    const { firestore, auth } = getAdminServices(adminApp);
    const FieldValue = __turbopack_context__.r("[externals]/firebase-admin/firestore [external] (firebase-admin/firestore, cjs)").FieldValue;
    try {
        const userRef = firestore.collection('users').doc(userId);
        const updates = {
            role
        };
        if (role === 'vendor') {
            if (vendorCode) {
                updates.vendorCode = vendorCode;
            }
        } else {
            updates.vendorCode = FieldValue.delete();
        }
        await userRef.update(updates);
        await auth.setCustomUserClaims(userId, {
            role
        });
        return {
            success: true
        };
    } catch (error) {
        console.error('Failed to update user role (Admin):', error);
        return {
            success: false,
            message: error.message || 'Failed to update user role.'
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ signOut() {
    // This is a client-side action, so redirecting is the main purpose here.
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login');
}
// The functions below still use the client-side SDK via a different initialization.
// This is not ideal, but changing them now could introduce more errors.
// For now, we focus on fixing the main signup/login flow.
// A proper fix would be to migrate these to the Admin SDK as well if they are meant to be server-only.
// Note: Company Details are still managed via Realtime Database using the client SDK.
// This is a separate concern from the Firestore user profile migration.
async function getClientRTDB() {
    const { initializeApp: initializeClientApp, getApps: getClientApps, getApp: getClientApp } = await __turbopack_context__.r("[project]/node_modules/firebase/app/dist/index.mjs [app-rsc] (ecmascript, async loader)")(__turbopack_context__.i);
    const { getDatabase } = await __turbopack_context__.r("[project]/node_modules/firebase/database/dist/index.mjs [app-rsc] (ecmascript, async loader)")(__turbopack_context__.i);
    const { firebaseConfig } = await __turbopack_context__.r("[project]/src/firebase/config.ts [app-rsc] (ecmascript, async loader)")(__turbopack_context__.i);
    const clientApps = getClientApps();
    const appName = 'client-rtdb-app';
    const existingApp = clientApps.find((app)=>app.name === appName);
    const app = existingApp ? existingApp : initializeClientApp(firebaseConfig, appName);
    return getDatabase(app);
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ saveCompanyDetailsToRTDB(details) {
    try {
        const rtdb = await getClientRTDB();
        const { ref, set } = await __turbopack_context__.r("[project]/node_modules/firebase/database/dist/index.mjs [app-rsc] (ecmascript, async loader)")(__turbopack_context__.i);
        const detailsRef = ref(rtdb, 'companyDetails/info');
        await set(detailsRef, details);
        return {
            success: true
        };
    } catch (error) {
        console.error('Failed to save company details to RTDB:', error);
        return {
            success: false,
            message: error.message || 'Failed to save company details.'
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getCompanyDetailsFromRTDB() {
    try {
        const rtdb = await getClientRTDB();
        const { ref, get } = await __turbopack_context__.r("[project]/node_modules/firebase/database/dist/index.mjs [app-rsc] (ecmascript, async loader)")(__turbopack_context__.i);
        const detailsRef = ref(rtdb, 'companyDetails/info');
        const snapshot = await get(detailsRef);
        if (snapshot.exists()) {
            return {
                success: true,
                data: snapshot.val()
            };
        }
        return {
            success: true,
            data: undefined
        };
    } catch (error) {
        console.error('Failed to get company details from RTDB:', error);
        return {
            success: false,
            message: error.message || 'Failed to fetch company details.'
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ saveVendorToRTDB(vendorData, vendorId) {
    try {
        const rtdb = await getClientRTDB();
        const { ref, set, push, child } = await __turbopack_context__.r("[project]/node_modules/firebase/database/dist/index.mjs [app-rsc] (ecmascript, async loader)")(__turbopack_context__.i);
        const vendorsRef = ref(rtdb, 'vendors');
        let vendorRef;
        if (vendorId) {
            vendorRef = child(vendorsRef, vendorId);
        } else {
            vendorRef = push(vendorsRef);
        }
        await set(vendorRef, vendorData);
        return {
            success: true
        };
    } catch (error) {
        console.error('Failed to save vendor to RTDB:', error);
        return {
            success: false,
            error: error.message || 'Failed to save vendor.'
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getVendorsFromRTDB() {
    try {
        const rtdb = await getClientRTDB();
        const { ref, get } = await __turbopack_context__.r("[project]/node_modules/firebase/database/dist/index.mjs [app-rsc] (ecmascript, async loader)")(__turbopack_context__.i);
        const vendorsRef = ref(rtdb, 'vendors');
        const snapshot = await get(vendorsRef);
        if (snapshot.exists()) {
            const vendorsData = snapshot.val();
            const vendorsArray = Object.keys(vendorsData).map((id)=>({
                    id,
                    ...vendorsData[id]
                }));
            return {
                success: true,
                data: vendorsArray
            };
        }
        return {
            success: true,
            data: []
        };
    } catch (error) {
        console.error('Failed to get vendors from RTDB:', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch vendors.'
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ deleteVendorFromRTDB(vendorId) {
    try {
        const rtdb = await getClientRTDB();
        const { ref, remove } = await __turbopack_context__.r("[project]/node_modules/firebase/database/dist/index.mjs [app-rsc] (ecmascript, async loader)")(__turbopack_context__.i);
        const vendorRef = ref(rtdb, `vendors/${vendorId}`);
        await remove(vendorRef);
        return {
            success: true
        };
    } catch (error) {
        console.error('Failed to delete vendor from RTDB:', error);
        return {
            success: false,
            error: error.message || 'Failed to delete vendor.'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createUserProfile,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    updateUserRole,
    signOut,
    saveCompanyDetailsToRTDB,
    getCompanyDetailsFromRTDB,
    saveVendorToRTDB,
    getVendorsFromRTDB,
    deleteVendorFromRTDB
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createUserProfile, "40bf1e58e37d64aa62551098cfe74d13ce5ca568e6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserProfile, "40779c49dada2a560ce33d1bb110771da76088dfdb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateUserProfile, "600197aded821c9a500870fc90fb1fc9d483b962b8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAllUsers, "00fabfcbf6c7d5ce94aea620a37f0b27f8bc99710c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateUserRole, "70ca33ff81d844b3ec58711e7aa07fe89bb380c947", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signOut, "0086d1454012dae48d87f8b73ffe6497b833c94961", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveCompanyDetailsToRTDB, "401f6e3642acf65262fa6d6423f207ff565e3c09fa", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCompanyDetailsFromRTDB, "00cf5330395e82bf8255922e76b18a7d7fd7cd3e01", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveVendorToRTDB, "600c8cfbf81d5dd936bd66a95553e26a48de2f90e9", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getVendorsFromRTDB, "00fbe4446b847dcb1534da57fdc7bde848475e5f33", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteVendorFromRTDB, "40cbdaff50014ed0b40014c44e27555f3e111a576b", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/admins/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
;
;
;
;
;
;
;
;
;
;
;
}}),
"[project]/.next-internal/server/app/admins/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admins$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admins/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/admins/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "0086d1454012dae48d87f8b73ffe6497b833c94961": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signOut"]),
    "00cf5330395e82bf8255922e76b18a7d7fd7cd3e01": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyDetailsFromRTDB"]),
    "00fabfcbf6c7d5ce94aea620a37f0b27f8bc99710c": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAllUsers"]),
    "00fbe4446b847dcb1534da57fdc7bde848475e5f33": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getVendorsFromRTDB"]),
    "401f6e3642acf65262fa6d6423f207ff565e3c09fa": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveCompanyDetailsToRTDB"]),
    "40779c49dada2a560ce33d1bb110771da76088dfdb": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserProfile"]),
    "40bf1e58e37d64aa62551098cfe74d13ce5ca568e6": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createUserProfile"]),
    "40cbdaff50014ed0b40014c44e27555f3e111a576b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteVendorFromRTDB"]),
    "600197aded821c9a500870fc90fb1fc9d483b962b8": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateUserProfile"]),
    "600c8cfbf81d5dd936bd66a95553e26a48de2f90e9": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveVendorToRTDB"]),
    "70ca33ff81d844b3ec58711e7aa07fe89bb380c947": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateUserRole"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admins$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admins/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/admins/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "0086d1454012dae48d87f8b73ffe6497b833c94961": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admins$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["0086d1454012dae48d87f8b73ffe6497b833c94961"]),
    "00cf5330395e82bf8255922e76b18a7d7fd7cd3e01": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admins$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00cf5330395e82bf8255922e76b18a7d7fd7cd3e01"]),
    "00fabfcbf6c7d5ce94aea620a37f0b27f8bc99710c": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admins$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00fabfcbf6c7d5ce94aea620a37f0b27f8bc99710c"]),
    "00fbe4446b847dcb1534da57fdc7bde848475e5f33": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admins$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00fbe4446b847dcb1534da57fdc7bde848475e5f33"]),
    "401f6e3642acf65262fa6d6423f207ff565e3c09fa": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admins$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["401f6e3642acf65262fa6d6423f207ff565e3c09fa"]),
    "40779c49dada2a560ce33d1bb110771da76088dfdb": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admins$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40779c49dada2a560ce33d1bb110771da76088dfdb"]),
    "40bf1e58e37d64aa62551098cfe74d13ce5ca568e6": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admins$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40bf1e58e37d64aa62551098cfe74d13ce5ca568e6"]),
    "40cbdaff50014ed0b40014c44e27555f3e111a576b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admins$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40cbdaff50014ed0b40014c44e27555f3e111a576b"]),
    "600197aded821c9a500870fc90fb1fc9d483b962b8": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admins$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["600197aded821c9a500870fc90fb1fc9d483b962b8"]),
    "600c8cfbf81d5dd936bd66a95553e26a48de2f90e9": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admins$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["600c8cfbf81d5dd936bd66a95553e26a48de2f90e9"]),
    "70ca33ff81d844b3ec58711e7aa07fe89bb380c947": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admins$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["70ca33ff81d844b3ec58711e7aa07fe89bb380c947"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admins$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admins/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admins$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/admins/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admins$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admins$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admins$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$admins$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/admins/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/admins/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/admins/page.tsx <module evaluation>", "default");
}}),
"[project]/src/app/admins/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/admins/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/admins/page.tsx", "default");
}}),
"[project]/src/app/admins/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admins$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/admins/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admins$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/app/admins/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$admins$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/app/admins/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/admins/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__31cb2621._.js.map