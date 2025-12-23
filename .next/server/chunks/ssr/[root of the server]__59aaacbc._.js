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
"[externals]/firebase-admin/database [external] (firebase-admin/database, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("firebase-admin/database");

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
/* __next_internal_action_entry_do_not_use__ {"0058ccd4107f044ae62a70fc8e2eee88bfbe0baffe":"getVendorsFromFirestore","0086d1454012dae48d87f8b73ffe6497b833c94961":"signOut","00cf5330395e82bf8255922e76b18a7d7fd7cd3e01":"getCompanyDetailsFromRTDB","00fabfcbf6c7d5ce94aea620a37f0b27f8bc99710c":"getAllUsers","401f6e3642acf65262fa6d6423f207ff565e3c09fa":"saveCompanyDetailsToRTDB","4042fba4c964c1220f40c2e6c13f0a0d862e8d948b":"deleteVendorFromFirestore","40779c49dada2a560ce33d1bb110771da76088dfdb":"getUserProfile","40bf1e58e37d64aa62551098cfe74d13ce5ca568e6":"createUserProfile","600197aded821c9a500870fc90fb1fc9d483b962b8":"updateUserProfile","60264dd4e170d459c6d460ed6ff6579e23eea92dc5":"saveVendorToFirestore","70ca33ff81d844b3ec58711e7aa07fe89bb380c947":"updateUserRole"} */ __turbopack_context__.s({
    "createUserProfile": (()=>createUserProfile),
    "deleteVendorFromFirestore": (()=>deleteVendorFromFirestore),
    "getAllUsers": (()=>getAllUsers),
    "getCompanyDetailsFromRTDB": (()=>getCompanyDetailsFromRTDB),
    "getUserProfile": (()=>getUserProfile),
    "getVendorsFromFirestore": (()=>getVendorsFromFirestore),
    "saveCompanyDetailsToRTDB": (()=>saveCompanyDetailsToRTDB),
    "saveVendorToFirestore": (()=>saveVendorToFirestore),
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
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$database__$5b$external$5d$__$28$firebase$2d$admin$2f$database$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase-admin/database [external] (firebase-admin/database, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$database__$5b$external$5d$__$28$firebase$2d$admin$2f$database$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$database__$5b$external$5d$__$28$firebase$2d$admin$2f$database$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
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
    const serviceAccount = {
        "type": "service_account",
        "project_id": "sheetmaster-woo4-3652307-f6517",
        "private_key_id": "a0db644cb948706d89c40d6f98654459a2681c49",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDSavxwFm0FlZS1\nX133N6x1bxIGgSKj+xKs9z/CdApPxqR1lxNWxkM/r6za7XOsLADZ40+0p+KVAc6w\nSIAShJyZlxDNyEpFQNK7IUKgcg/hB+DPZrifyHXQ+32f22+v/7+Hy3HAkY9mKI1x\nTg3nZcVgKP9LnogV1EtD2b7rj6f9UbfOzOcpDGUJS4DhUMvoXEmCiczaq84pDjyL\nOJx3aNOfEtlexEISIuCU+FCOIp7s18C1Xcd81KqMh3V2WSaZ3gkcozCR5w95D4Gl\nN02OocXasmJsjEhGstV6bAkcmSLTdGF47OM2lGUcC1u7NMDj/1XYAXk3mVargL6r\njrcy+upJAgMBAAECggEAL86S8DyIJJ6pnNPAG60Qh9XmeIfagPtIcPf0CpAmz51I\nPFdI04xUNyII2ezdPR76Sob00wzZ1BUHCtJOFub+VX8XGEoLZdSmjFGwO5fut6f8\nkeK6y8LV0ddx4WIP7CLlN0sn2yK3O/S2vimHyy06PPDToDCyppMHTrEoSYjoGAuR\na+2AkePutu60iasWXQCkT4kj0PejSAMVmrrqRRwkmqRXfJ9M5XTgrDNEha5o6wgv\nxr3ZoQk6qQp+7OPGSXksk+zdg/P8MbnyYQsVNV5xz7Ls6UziBpUb2o5q5RbzYsmJ\nlZ6grNoIIX8wexCuuL2bUMdLjS5gCcvF/SnS1GOfqQKBgQDzaVM1pC/d4X3Yg51m\nSnZG2l7L6DMmJPQ3snXUSJImyJJ7kjIAmcCJHuVNQkhE2RpdWl+B8AGRDks81P+c\nqJWbM/hMjhvkH7Yv4aQ90kQrnJxPbSxWHWTZxNbyyrC7upXLI2zs/b/6DiRrOXjP\nC9s2bTDjnekYK6IwVu6e1l6pIwKBgQDdTNbnaVgq8/6QHimuuAOgyvDwD+FbGgiF\n96ocQUvmdFlWLu9G2xML5dQBmFg6EuVC6fl8WGgHQ59a7FUeBPXwCf8lDt/VHXs4\nv6nsagSyGoTakSw94yxP9aNMPrBhbZRXsrccbufup9uO6pcEso1XY+SOgj0iiog3\nu1aLckPzowKBgCTxuIJswCMiJXKmT06GQLtyS28ReCny8+o8OOwWc7BVQv5kaxhy\nPanSOaVnSQbCGOFQZSyYm/RDQiIihgVmBQcAdVBRRWRzd7h+u+nyLwybgZIAlPkh\nDvyKhsFlCDwGDtQ9NTwnK2stmFN57p8mQohZPFFf11Am10AVAbSz/rwXAoGANJbM\nAxYfo6Vz+x+P3DtScWWIuCOt9A5NtDhUrn494TgI+tgQeJAbCJrHNNHVNYfD/5DG\nfuwrXH6PYfYDjCy1nSNjBJVyT5y/6Y5yfQH8t65hn+cb0mEn6KCA+99x3tVBiU2p\nAhLA/w/Yty+8T5t2xyuv5sXAbXLqSAQ23tB6oW0CgYAtzTtjUCuy7k2uW/AdwVh4\nEKQHI11frMgCZrNBvKx/YLGkfP0uHhkykvUPY+GaaB1VWbDZjOK2raJ4V8pR9WAC\n3LJF5/tHZXfuq+Rd8w1YezPpEbC+aGUFV4z/W6SIaQLeUlB2HRFzG8h1t6Okn3m8\nsrWMg0vW515DTuUJfEr6AQ==\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-fbsvc@sheetmaster-woo4-3652307-f6517.iam.gserviceaccount.com",
        "client_id": "109409820100882232028",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40sheetmaster-woo4-3652307-f6517.iam.gserviceaccount.com"
    };
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["initializeApp"])({
        credential: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$app__$5b$external$5d$__$28$firebase$2d$admin$2f$app$2c$__esm_import$29$__["cert"])(serviceAccount),
        databaseURL: "https://sheetmaster-woo4-3652307-f6517-default-rtdb.firebaseio.com"
    });
}
function getAdminServices(app) {
    const firestore = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$firestore__$5b$external$5d$__$28$firebase$2d$admin$2f$firestore$2c$__esm_import$29$__["getFirestore"])(app);
    const auth = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$auth__$5b$external$5d$__$28$firebase$2d$admin$2f$auth$2c$__esm_import$29$__["getAuth"])(app);
    const rtdb = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin$2f$database__$5b$external$5d$__$28$firebase$2d$admin$2f$database$2c$__esm_import$29$__["getDatabase"])(app);
    return {
        firestore,
        auth,
        rtdb
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
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login');
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ saveCompanyDetailsToRTDB(details) {
    const adminApp = initializeAdminApp();
    const { rtdb } = getAdminServices(adminApp);
    try {
        const detailsRef = rtdb.ref('companyDetails/info');
        await detailsRef.set(details);
        return {
            success: true
        };
    } catch (error) {
        console.error('Failed to save company details to RTDB (Admin):', error);
        return {
            success: false,
            message: error.message || 'Failed to save company details.'
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getCompanyDetailsFromRTDB() {
    const adminApp = initializeAdminApp();
    const { rtdb } = getAdminServices(adminApp);
    try {
        const detailsRef = rtdb.ref('companyDetails/info');
        const snapshot = await detailsRef.once('value');
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
        console.error('Failed to get company details from RTDB (Admin):', error);
        return {
            success: false,
            message: error.message || 'Failed to fetch company details.'
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ saveVendorToFirestore(vendorData, vendorId) {
    const adminApp = initializeAdminApp();
    const { firestore } = getAdminServices(adminApp);
    try {
        let vendorRef;
        if (vendorId) {
            vendorRef = firestore.collection('vendors').doc(vendorId);
            await vendorRef.update(vendorData);
        } else {
            vendorRef = firestore.collection('vendors').doc();
            await vendorRef.set({
                ...vendorData,
                id: vendorRef.id
            });
        }
        return {
            success: true
        };
    } catch (error) {
        console.error('Failed to save vendor to Firestore (Admin):', error);
        return {
            success: false,
            error: error.message || 'Failed to save vendor.'
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getVendorsFromFirestore() {
    const adminApp = initializeAdminApp();
    const { firestore } = getAdminServices(adminApp);
    try {
        const vendorsRef = firestore.collection('vendors');
        const snapshot = await vendorsRef.get();
        if (!snapshot.empty) {
            const vendorsArray = snapshot.docs.map((doc)=>doc.data());
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
        console.error('Failed to get vendors from Firestore (Admin):', error);
        return {
            success: false,
            error: error.message || 'Failed to fetch vendors.'
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ deleteVendorFromFirestore(vendorId) {
    const adminApp = initializeAdminApp();
    const { firestore } = getAdminServices(adminApp);
    try {
        const vendorRef = firestore.collection('vendors').doc(vendorId);
        await vendorRef.delete();
        return {
            success: true
        };
    } catch (error) {
        console.error('Failed to delete vendor from Firestore (Admin):', error);
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
    saveVendorToFirestore,
    getVendorsFromFirestore,
    deleteVendorFromFirestore
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createUserProfile, "40bf1e58e37d64aa62551098cfe74d13ce5ca568e6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserProfile, "40779c49dada2a560ce33d1bb110771da76088dfdb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateUserProfile, "600197aded821c9a500870fc90fb1fc9d483b962b8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAllUsers, "00fabfcbf6c7d5ce94aea620a37f0b27f8bc99710c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateUserRole, "70ca33ff81d844b3ec58711e7aa07fe89bb380c947", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signOut, "0086d1454012dae48d87f8b73ffe6497b833c94961", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveCompanyDetailsToRTDB, "401f6e3642acf65262fa6d6423f207ff565e3c09fa", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCompanyDetailsFromRTDB, "00cf5330395e82bf8255922e76b18a7d7fd7cd3e01", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveVendorToFirestore, "60264dd4e170d459c6d460ed6ff6579e23eea92dc5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getVendorsFromFirestore, "0058ccd4107f044ae62a70fc8e2eee88bfbe0baffe", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(deleteVendorFromFirestore, "4042fba4c964c1220f40c2e6c13f0a0d862e8d948b", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/util [external] (util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/assert [external] (assert, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}}),
"[externals]/tty [external] (tty, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("tty", () => require("tty"));

module.exports = mod;
}}),
"[externals]/net [external] (net, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[externals]/events [external] (events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[project]/src/lib/woocommerce.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "getOrders": (()=>getOrders),
    "getProducts": (()=>getProducts),
    "updateOrderAddress": (()=>updateOrderAddress),
    "updateOrderStatus": (()=>updateOrderStatus)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$woocommerce$2f$woocommerce$2d$rest$2d$api$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@woocommerce/woocommerce-rest-api/index.js [app-rsc] (ecmascript)");
;
// This function will be called every time we need the API instance.
// This makes it robust against server hot-reloads where process.env might not be available initially.
const getWooCommerceApi = ()=>{
    const storeUrl = ("TURBOPACK compile-time value", "https://sakibtruth.com/");
    const consumerKey = ("TURBOPACK compile-time value", "ck_594c2082639e6c16e6448f472ae87600b1a376af");
    const consumerSecret = ("TURBOPACK compile-time value", "cs_47e523e093da5d068f0a9303579ecb4949802ba6");
    if ("TURBOPACK compile-time falsy", 0) {
        "TURBOPACK unreachable";
    }
    try {
        // Validate URL format before creating the instance
        new URL(storeUrl);
        return new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$woocommerce$2f$woocommerce$2d$rest$2d$api$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]({
            url: storeUrl,
            consumerKey: consumerKey,
            consumerSecret: consumerSecret,
            version: "wc/v3",
            timeout: 60000
        });
    } catch (error) {
        console.error("Failed to initialize WooCommerce API. Please check the store URL in your .env file.", error);
        if (error instanceof TypeError) {
            throw new Error(`Invalid WooCommerce store URL format: ${storeUrl}`);
        }
        throw error; // Re-throw other errors
    }
};
const formatAddress = (address)=>{
    if (!address || !Object.keys(address).some((key)=>address[key])) {
        return '';
    }
    const addressParts = [
        address.address_1,
        address.address_2,
        address.city,
        address.state,
        address.postcode,
        address.country
    ];
    return addressParts.filter((part)=>part).join(', ');
};
const mapWCOrderToAppOrder = (wcOrder)=>{
    let primaryVendorName = undefined;
    const items = (wcOrder.line_items || []).map((item)=>{
        let itemVendorName = undefined;
        if (item.sku && typeof item.sku === 'string' && item.sku.includes('-')) {
            itemVendorName = item.sku.split('-')[0];
            if (!primaryVendorName) {
                primaryVendorName = itemVendorName;
            }
        }
        return {
            itemId: String(item.product_id),
            name: item.name,
            qty: item.quantity,
            price: parseFloat(item.price),
            imageUrl: item.image?.src || '',
            vendorName: itemVendorName
        };
    });
    const subTotal = parseFloat(wcOrder.total) - parseFloat(wcOrder.total_tax);
    const billingAddress = formatAddress(wcOrder.billing);
    const shippingAddress = formatAddress(wcOrder.shipping);
    const altPhoneMeta = wcOrder.meta_data.find((m)=>m.key === '_billing_alternate_phone');
    const altPhone = altPhoneMeta ? altPhoneMeta.value : undefined;
    // Ensure timestamp is a valid ISO string, providing a fallback.
    const timestamp = wcOrder.date_created_gmt ? wcOrder.date_created_gmt + 'Z' : new Date(0).toISOString();
    return {
        id: String(wcOrder.id),
        customerName: `${wcOrder.billing.first_name} ${wcOrder.billing.last_name}`,
        phone: wcOrder.billing.phone,
        altPhone: altPhone,
        pincode: wcOrder.billing.postcode,
        gmail: wcOrder.billing.email,
        items: items,
        status: wcOrder.status,
        orderType: 'delivery',
        billingAddress: billingAddress,
        billing_city: wcOrder.billing.city,
        billing_state: wcOrder.billing.state,
        billing_country: wcOrder.billing.country,
        shippingAddress: shippingAddress,
        trackingId: wcOrder.meta_data.find((m)=>m.key === '_wc_shipment_tracking_items')?.value[0]?.tracking_number || '',
        totalAmount: parseFloat(wcOrder.total || '0'),
        subTotal: subTotal,
        taxAmount: parseFloat(wcOrder.total_tax || '0'),
        timestamp: timestamp,
        paymentMethod: wcOrder.payment_method_title,
        paymentDate: wcOrder.date_paid_gmt ? wcOrder.date_paid_gmt + 'Z' : null,
        vendorName: primaryVendorName
    };
};
const getOrders = async ()=>{
    const api = getWooCommerceApi(); // Get a fresh API instance
    try {
        let allWCOrders = [];
        let page = 1;
        const perPage = 100;
        let keepFetching = true;
        while(keepFetching){
            const response = await api.get("orders", {
                per_page: perPage,
                page: page,
                orderby: 'date',
                order: 'desc'
            });
            // Correctly check for response status. The status is on the request's response object.
            if (response?.request?.res?.statusCode !== 200) {
                const status = response?.request?.res?.statusCode;
                const statusText = response?.request?.res?.statusMessage;
                throw new Error(`Failed to fetch orders on page ${page}. Status: ${status} ${statusText}`);
            }
            const fetchedOrders = response.data;
            allWCOrders = allWCOrders.concat(fetchedOrders);
            if (fetchedOrders.length < perPage) {
                keepFetching = false;
            } else {
                page++;
            }
        }
        const orders = allWCOrders.map(mapWCOrderToAppOrder);
        return orders;
    } catch (error) {
        console.error("Error fetching data from WooCommerce:", error);
        if (error.code === 'ENOTFOUND' || error.message && error.message.includes('getaddrinfo ENOTFOUND')) {
            throw new Error(`Could not connect to WooCommerce store. Hostname not found. Please check the store URL in your .env file.`);
        }
        // Re-throw a generic but informative error for other cases.
        throw new Error('Failed to communicate with WooCommerce API. Verify store URL, keys, and network connection.');
    }
};
const updateOrderStatus = async (orderId, status)=>{
    const api = getWooCommerceApi(); // Get a fresh API instance
    try {
        const response = await api.put(`orders/${orderId}`, {
            status: status
        });
        return response.status === 200;
    } catch (error) {
        console.error(`Failed to update order ${orderId} status in WooCommerce:`, error);
        throw new Error('Failed to update order status in WooCommerce.');
    }
};
const updateOrderAddress = async (orderId, payload)=>{
    const api = getWooCommerceApi(); // Get a fresh API instance
    try {
        const data = {
            billing: {}
        };
        const fields = [
            'first_name',
            'last_name',
            'address_1',
            'address_2',
            'city',
            'state',
            'postcode',
            'country',
            'email',
            'phone'
        ];
        fields.forEach((field)=>{
            if (payload[field] !== undefined) {
                data.billing[field] = payload[field];
            }
        });
        if (payload.alternate_phone !== undefined) {
            data.meta_data = [
                {
                    key: '_billing_alternate_phone',
                    value: payload.alternate_phone
                }
            ];
        }
        if (Object.keys(data.billing).length === 0 && !data.meta_data) {
            console.log("No address data to update.");
            return true;
        }
        const response = await api.put(`orders/${orderId}`, data);
        return response.status === 200;
    } catch (error) {
        console.error(`Failed to update order ${orderId} address in WooCommerce:`, error);
        throw new Error('Failed to update order address in WooCommerce.');
    }
};
const mapWCProductToMenuItem = (product)=>{
    const isSale = product.on_sale && product.sale_price;
    return {
        id: String(product.id),
        name: product.name,
        price: parseFloat(isSale ? product.sale_price : product.regular_price || product.price || '0'),
        regularPrice: isSale && parseFloat(product.regular_price) > parseFloat(product.sale_price) ? parseFloat(product.regular_price) : undefined,
        category: product.categories.length > 0 ? product.categories[0].name : 'Uncategorized',
        imageUrl: product.images.length > 0 ? product.images[0].src : undefined,
        availability: product.stock_status === 'instock',
        description: product.short_description ? product.short_description.replace(/<[^>]*>?/gm, '') : product.description ? product.description.replace(/<[^>]*>?/gm, '') : undefined
    };
};
const getProducts = async ()=>{
    const api = getWooCommerceApi(); // Get a fresh API instance
    try {
        let allProducts = [];
        let page = 1;
        const perPage = 100;
        let keepFetching = true;
        while(keepFetching){
            const response = await api.get("products", {
                per_page: perPage,
                page: page
            });
            if (response?.request?.res?.statusCode !== 200) {
                const status = response?.request?.res?.statusCode;
                const statusText = response?.request?.res?.statusMessage;
                throw new Error(`Failed to fetch products on page ${page}. Status: ${status} ${statusText}`);
            }
            const fetchedProducts = response.data;
            allProducts = allProducts.concat(fetchedProducts);
            if (fetchedProducts.length < perPage) {
                keepFetching = false;
            } else {
                page++;
            }
        }
        const products = allProducts.map(mapWCProductToMenuItem);
        return products;
    } catch (error) {
        console.error("Error fetching products from WooCommerce:", error);
        if (error.code === 'ENOTFOUND' || error.message && error.message.includes('getaddrinfo ENOTFOUND')) {
            throw new Error(`Could not connect to WooCommerce store. Hostname not found. Please check the store URL in your .env file.`);
        }
        throw new Error('Failed to communicate with WooCommerce API to fetch products.');
    }
};
}}),
"[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"00297a05172ea2864074da52ab33dfd029b3e8f318":"getOrdersFromWooCommerce","600529d4c40d5b4637b282fe829a47ef19349e74f0":"updateOrderAddressInWooCommerce","601f181b794cd63f50dfa4b14a542bb6ac1499894b":"updateOrderStatusInWooCommerce"} */ __turbopack_context__.s({
    "getOrdersFromWooCommerce": (()=>getOrdersFromWooCommerce),
    "updateOrderAddressInWooCommerce": (()=>updateOrderAddressInWooCommerce),
    "updateOrderStatusInWooCommerce": (()=>updateOrderStatusInWooCommerce)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$woocommerce$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/woocommerce.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getOrdersFromWooCommerce() {
    try {
        const orders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$woocommerce$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getOrders"])();
        return {
            success: true,
            data: orders
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error("Server Action Error (getOrdersFromWooCommerce):", errorMessage);
        return {
            success: false,
            error: errorMessage
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ updateOrderStatusInWooCommerce(orderId, status) {
    try {
        const wasSuccessful = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$woocommerce$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateOrderStatus"])(orderId, status);
        if (wasSuccessful) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/orders'); // Revalidate the orders page to show the update
            return {
                success: true
            };
        } else {
            return {
                success: false,
                error: `Order ID ${orderId} not found or failed to update in WooCommerce.`
            };
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error("Server Action Error (updateOrderStatusInWooCommerce):", errorMessage);
        return {
            success: false,
            error: errorMessage
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ updateOrderAddressInWooCommerce(orderId, payload) {
    try {
        const wasSuccessful = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$woocommerce$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateOrderAddress"])(orderId, payload);
        if (wasSuccessful) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/orders');
            return {
                success: true
            };
        } else {
            return {
                success: false,
                error: `Order ID ${orderId} not found or failed to update address in WooCommerce.`
            };
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error("Server Action Error (updateOrderAddressInWooCommerce):", errorMessage);
        return {
            success: false,
            error: errorMessage
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getOrdersFromWooCommerce,
    updateOrderStatusInWooCommerce,
    updateOrderAddressInWooCommerce
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getOrdersFromWooCommerce, "00297a05172ea2864074da52ab33dfd029b3e8f318", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateOrderStatusInWooCommerce, "601f181b794cd63f50dfa4b14a542bb6ac1499894b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateOrderAddressInWooCommerce, "600529d4c40d5b4637b282fe829a47ef19349e74f0", null);
}}),
"[project]/.next-internal/server/app/analytics/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
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
;
;
;
}}),
"[project]/.next-internal/server/app/analytics/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/analytics/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/analytics/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "00297a05172ea2864074da52ab33dfd029b3e8f318": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getOrdersFromWooCommerce"]),
    "0058ccd4107f044ae62a70fc8e2eee88bfbe0baffe": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getVendorsFromFirestore"]),
    "0086d1454012dae48d87f8b73ffe6497b833c94961": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signOut"]),
    "00cf5330395e82bf8255922e76b18a7d7fd7cd3e01": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyDetailsFromRTDB"]),
    "00fabfcbf6c7d5ce94aea620a37f0b27f8bc99710c": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAllUsers"]),
    "401f6e3642acf65262fa6d6423f207ff565e3c09fa": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveCompanyDetailsToRTDB"]),
    "4042fba4c964c1220f40c2e6c13f0a0d862e8d948b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteVendorFromFirestore"]),
    "40779c49dada2a560ce33d1bb110771da76088dfdb": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserProfile"]),
    "40bf1e58e37d64aa62551098cfe74d13ce5ca568e6": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createUserProfile"]),
    "600197aded821c9a500870fc90fb1fc9d483b962b8": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateUserProfile"]),
    "600529d4c40d5b4637b282fe829a47ef19349e74f0": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateOrderAddressInWooCommerce"]),
    "601f181b794cd63f50dfa4b14a542bb6ac1499894b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateOrderStatusInWooCommerce"]),
    "60264dd4e170d459c6d460ed6ff6579e23eea92dc5": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveVendorToFirestore"]),
    "70ca33ff81d844b3ec58711e7aa07fe89bb380c947": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateUserRole"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/analytics/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/analytics/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "00297a05172ea2864074da52ab33dfd029b3e8f318": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00297a05172ea2864074da52ab33dfd029b3e8f318"]),
    "0058ccd4107f044ae62a70fc8e2eee88bfbe0baffe": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["0058ccd4107f044ae62a70fc8e2eee88bfbe0baffe"]),
    "0086d1454012dae48d87f8b73ffe6497b833c94961": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["0086d1454012dae48d87f8b73ffe6497b833c94961"]),
    "00cf5330395e82bf8255922e76b18a7d7fd7cd3e01": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00cf5330395e82bf8255922e76b18a7d7fd7cd3e01"]),
    "00fabfcbf6c7d5ce94aea620a37f0b27f8bc99710c": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00fabfcbf6c7d5ce94aea620a37f0b27f8bc99710c"]),
    "401f6e3642acf65262fa6d6423f207ff565e3c09fa": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["401f6e3642acf65262fa6d6423f207ff565e3c09fa"]),
    "4042fba4c964c1220f40c2e6c13f0a0d862e8d948b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["4042fba4c964c1220f40c2e6c13f0a0d862e8d948b"]),
    "40779c49dada2a560ce33d1bb110771da76088dfdb": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40779c49dada2a560ce33d1bb110771da76088dfdb"]),
    "40bf1e58e37d64aa62551098cfe74d13ce5ca568e6": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40bf1e58e37d64aa62551098cfe74d13ce5ca568e6"]),
    "600197aded821c9a500870fc90fb1fc9d483b962b8": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["600197aded821c9a500870fc90fb1fc9d483b962b8"]),
    "600529d4c40d5b4637b282fe829a47ef19349e74f0": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["600529d4c40d5b4637b282fe829a47ef19349e74f0"]),
    "601f181b794cd63f50dfa4b14a542bb6ac1499894b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["601f181b794cd63f50dfa4b14a542bb6ac1499894b"]),
    "60264dd4e170d459c6d460ed6ff6579e23eea92dc5": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["60264dd4e170d459c6d460ed6ff6579e23eea92dc5"]),
    "70ca33ff81d844b3ec58711e7aa07fe89bb380c947": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["70ca33ff81d844b3ec58711e7aa07fe89bb380c947"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/analytics/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/analytics/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$analytics$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
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
"[project]/src/app/analytics/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/analytics/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/analytics/page.tsx <module evaluation>", "default");
}}),
"[project]/src/app/analytics/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/analytics/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/analytics/page.tsx", "default");
}}),
"[project]/src/app/analytics/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$analytics$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/analytics/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$analytics$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/app/analytics/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$analytics$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/app/analytics/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/analytics/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__59aaacbc._.js.map