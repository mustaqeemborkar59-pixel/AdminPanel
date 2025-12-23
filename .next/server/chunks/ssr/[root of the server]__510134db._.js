module.exports = {

"[externals]/util [external] (util, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}}),
"[externals]/crypto [external] (crypto, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}}),
"[externals]/process [external] (process, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("process", () => require("process"));

module.exports = mod;
}}),
"[externals]/tls [external] (tls, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}}),
"[externals]/fs [external] (fs, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}}),
"[externals]/os [external] (os, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}}),
"[externals]/net [external] (net, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}}),
"[externals]/events [external] (events, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}}),
"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/http2 [external] (http2, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http2", () => require("http2"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/dns [external] (dns, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"0086d1454012dae48d87f8b73ffe6497b833c94961":"signOut","00cf5330395e82bf8255922e76b18a7d7fd7cd3e01":"getCompanyDetailsFromRTDB","00fabfcbf6c7d5ce94aea620a37f0b27f8bc99710c":"getAllUsers","401f6e3642acf65262fa6d6423f207ff565e3c09fa":"saveCompanyDetailsToRTDB","40779c49dada2a560ce33d1bb110771da76088dfdb":"getUserProfile","40bf1e58e37d64aa62551098cfe74d13ce5ca568e6":"createUserProfile","600197aded821c9a500870fc90fb1fc9d483b962b8":"updateUserProfile","70ca33ff81d844b3ec58711e7aa07fe89bb380c947":"updateUserRole"} */ __turbopack_context__.s({
    "createUserProfile": (()=>createUserProfile),
    "getAllUsers": (()=>getAllUsers),
    "getCompanyDetailsFromRTDB": (()=>getCompanyDetailsFromRTDB),
    "getUserProfile": (()=>getUserProfile),
    "saveCompanyDetailsToRTDB": (()=>saveCompanyDetailsToRTDB),
    "signOut": (()=>signOut),
    "updateUserProfile": (()=>updateUserProfile),
    "updateUserRole": (()=>updateUserRole)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/lib/firebase'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-rsc] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ createUserProfile(details) {
    try {
        const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(db, `users/${details.uid}`);
        // Check if the signing-up user is the super admin based on the .env file
        const isSuperAdmin = details.email === ("TURBOPACK compile-time value", "yasirsolkar28@gmail.com");
        // Explicitly set the role to 'super-admin' if it is, otherwise default to 'user'
        const userProfile = {
            uid: details.uid,
            email: details.email || 'No email',
            displayName: details.displayName || 'New User',
            photoURL: details.photoURL || '',
            role: isSuperAdmin ? 'super-admin' : 'user'
        };
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["setDoc"])(userRef, userProfile, {
            merge: true
        });
        return {
            success: true
        };
    } catch (error) {
        console.error('Firestore Profile Creation Error on Signup:', error);
        return {
            success: false,
            message: error.message || 'Failed to create user profile in database.'
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getUserProfile(uid) {
    try {
        const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(db, `users/${uid}`);
        const docSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDoc"])(userRef);
        if (docSnap.exists()) {
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
        console.error('Failed to get user profile from Firestore:', error);
        return {
            success: false,
            message: error.message || 'Failed to fetch user profile.'
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ updateUserProfile(uid, details) {
    try {
        const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(db, `users/${uid}`);
        const docSnap = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDoc"])(userRef);
        if (docSnap.exists()) {
            const updates = {};
            if (details.displayName && details.displayName !== docSnap.data().displayName) {
                updates.displayName = details.displayName;
            }
            if (details.photoURL && details.photoURL !== docSnap.data().photoURL) {
                updates.photoURL = details.photoURL;
            }
            if (Object.keys(updates).length > 0) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateDoc"])(userRef, updates);
            }
        }
        return {
            success: true
        };
    } catch (error) {
        console.error('Firestore Profile Update Error on Login:', error);
        return {
            success: false,
            message: error.message || 'Failed to update user profile in database.'
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ getAllUsers() {
    try {
        const usersRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["collection"])(db, 'users');
        const querySnapshot = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDocs"])(usersRef);
        const usersArray = [];
        querySnapshot.forEach((doc)=>{
            usersArray.push(doc.data());
        });
        return {
            success: true,
            data: usersArray
        };
    } catch (error) {
        console.error('Failed to get all users from Firestore:', error);
        return {
            success: false,
            message: error.message || 'Failed to fetch user profiles.'
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ updateUserRole(userId, role, vendorCode) {
    try {
        const userRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["doc"])(db, `users/${userId}`);
        const updates = {
            role
        };
        if (role === 'vendor') {
            if (vendorCode) {
                updates.vendorCode = vendorCode;
            }
        } else {
            // If the role is changed to anything other than 'vendor', remove the vendorCode.
            updates.vendorCode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["deleteField"])(); // Use deleteField() to remove the field in Firestore
        }
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateDoc"])(userRef, updates);
        return {
            success: true
        };
    } catch (error) {
        console.error('Failed to update user role in Firestore:', error);
        return {
            success: false,
            message: error.message || 'Failed to update user role.'
        };
    }
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ signOut() {
    try {
    // Firebase signOut is client-side. This server action is for server-initiated redirects.
    } catch (error) {
        console.error('SignOut Server Action Error:', error);
    }
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])('/login');
}
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ saveCompanyDetailsToRTDB(details) {
    // This function still uses RTDB as it's not part of the user profile migration.
    // It can be migrated later if needed.
    const { rtdb } = await (()=>{
        const e = new Error("Cannot find module '@/lib/firebase'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    })();
    if (!rtdb) {
        return {
            success: false,
            message: "Realtime Database is not configured."
        };
    }
    try {
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
    // This function still uses RTDB.
    const { rtdb } = await (()=>{
        const e = new Error("Cannot find module '@/lib/firebase'");
        e.code = 'MODULE_NOT_FOUND';
        throw e;
    })();
    if (!rtdb) {
        return {
            success: false,
            message: "Realtime Database is not configured."
        };
    }
    try {
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
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    createUserProfile,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    updateUserRole,
    signOut,
    saveCompanyDetailsToRTDB,
    getCompanyDetailsFromRTDB
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createUserProfile, "40bf1e58e37d64aa62551098cfe74d13ce5ca568e6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getUserProfile, "40779c49dada2a560ce33d1bb110771da76088dfdb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateUserProfile, "600197aded821c9a500870fc90fb1fc9d483b962b8", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getAllUsers, "00fabfcbf6c7d5ce94aea620a37f0b27f8bc99710c", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateUserRole, "70ca33ff81d844b3ec58711e7aa07fe89bb380c947", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(signOut, "0086d1454012dae48d87f8b73ffe6497b833c94961", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(saveCompanyDetailsToRTDB, "401f6e3642acf65262fa6d6423f207ff565e3c09fa", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCompanyDetailsFromRTDB, "00cf5330395e82bf8255922e76b18a7d7fd7cd3e01", null);
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

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
// Check if the required environment variables are available at runtime.
const isWooCommerceConfigured = ()=>{
    return ("TURBOPACK compile-time value", "https://sakibtruth.com/") && ("TURBOPACK compile-time value", "https://sakibtruth.com/") !== 'https://your-store-url.com' && ("TURBOPACK compile-time value", "ck_594c2082639e6c16e6448f472ae87600b1a376af") && ("TURBOPACK compile-time value", "cs_47e523e093da5d068f0a9303579ecb4949802ba6");
};
let api;
if (isWooCommerceConfigured()) {
    try {
        // Basic validation to ensure the URL is somewhat valid before initializing
        new URL(("TURBOPACK compile-time value", "https://sakibtruth.com/"));
        api = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$woocommerce$2f$woocommerce$2d$rest$2d$api$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"]({
            url: ("TURBOPACK compile-time value", "https://sakibtruth.com/"),
            consumerKey: ("TURBOPACK compile-time value", "ck_594c2082639e6c16e6448f472ae87600b1a376af"),
            consumerSecret: ("TURBOPACK compile-time value", "cs_47e523e093da5d068f0a9303579ecb4949802ba6"),
            version: "wc/v3",
            timeout: 60000
        });
    } catch (error) {
        console.error("Failed to initialize WooCommerce API. Please check the store URL in your .env file.", error);
        api = undefined;
    }
}
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
    const items = wcOrder.line_items.map((item)=>{
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
    // Find alternate phone from meta data
    const altPhoneMeta = wcOrder.meta_data.find((m)=>m.key === '_billing_alternate_phone');
    const altPhone = altPhoneMeta ? altPhoneMeta.value : undefined;
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
        totalAmount: parseFloat(wcOrder.total),
        subTotal: subTotal,
        taxAmount: parseFloat(wcOrder.total_tax),
        timestamp: wcOrder.date_created_gmt + 'Z',
        paymentMethod: wcOrder.payment_method_title,
        paymentDate: wcOrder.date_paid_gmt ? wcOrder.date_paid_gmt + 'Z' : null,
        vendorName: primaryVendorName
    };
};
const getOrders = async ()=>{
    if (!api || !isWooCommerceConfigured()) {
        // Throw an error that will be caught by the server action and displayed to the user.
        throw new Error('WooCommerce environment variables are not set correctly. Please check your .env file and ensure WOOCOMMERCE_STORE_URL, WOOCOMMERCE_CONSUMER_KEY, and WOOCOMMERCE_CONSUMER_SECRET are set correctly.');
    }
    try {
        let allWCOrders = [];
        let page = 1;
        const perPage = 100; // Max per_page is 100
        let keepFetching = true;
        while(keepFetching){
            const response = await api.get("orders", {
                per_page: perPage,
                page: page,
                orderby: 'date',
                order: 'desc'
            });
            if (response.status !== 200) {
                throw new Error(`Failed to fetch orders on page ${page}: ${response.statusText}`);
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
        if (error.code === 'ENOTFOUND' || error.message.includes('getaddrinfo ENOTFOUND')) {
            throw new Error(`Could not connect to WooCommerce store. Hostname not found. Please check the store URL in your .env file: ${process.env.WOOCOMMERCE_STORE_URL}`);
        }
        if (error.message.includes('Failed to parse URL')) {
            throw new Error(`Invalid WooCommerce store URL. Please check the format in your .env file: ${process.env.WOOCOMMERCE_STORE_URL}`);
        }
        // Re-throw a generic but informative error for other cases.
        throw new Error('Failed to communicate with WooCommerce API. Verify store URL, keys, and network connection.');
    }
};
const updateOrderStatus = async (orderId, status)=>{
    if (!api) {
        console.error('WooCommerce API is not configured. Cannot update order status.');
        return false;
    }
    try {
        const response = await api.put(`orders/${orderId}`, {
            status: status
        });
        return response.status === 200;
    } catch (error) {
        console.error(`Failed to update order ${orderId} status in WooCommerce:`, error);
        // You could re-throw a more specific error here to be handled by the server action
        throw new Error('Failed to update order status in WooCommerce.');
    }
};
const updateOrderAddress = async (orderId, payload)=>{
    if (!api) {
        console.error('WooCommerce API is not configured. Cannot update order address.');
        return false;
    }
    try {
        const data = {
            billing: {}
        };
        // Map all possible fields from the payload to the billing object
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
            // Allow empty strings to clear a field in WC
            if (payload[field] !== undefined) {
                data.billing[field] = payload[field];
            }
        });
        // Handle alternate phone as meta data
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
            return true; // Nothing to update, so we can consider it successful.
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
        // If it's on sale, price is the sale_price. Otherwise, it's the regular_price (or the price field as a fallback).
        price: parseFloat(isSale ? product.sale_price : product.regular_price || product.price || '0'),
        // Only set regularPrice if the item is on sale and the prices are different.
        regularPrice: isSale && parseFloat(product.regular_price) > parseFloat(product.sale_price) ? parseFloat(product.regular_price) : undefined,
        category: product.categories.length > 0 ? product.categories[0].name : 'Uncategorized',
        imageUrl: product.images.length > 0 ? product.images[0].src : undefined,
        availability: product.stock_status === 'instock',
        description: product.short_description ? product.short_description.replace(/<[^>]*>?/gm, '') : product.description ? product.description.replace(/<[^>]*>?/gm, '') : undefined
    };
};
const getProducts = async ()=>{
    if (!api || !isWooCommerceConfigured()) {
        throw new Error('WooCommerce environment variables are not set correctly.');
    }
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
            if (response.status !== 200) {
                throw new Error(`Failed to fetch products on page ${page}: ${response.statusText}`);
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
        if (error.code === 'ENOTFOUND' || error.message.includes('getaddrinfo ENOTFOUND')) {
            throw new Error(`Could not connect to WooCommerce store. Hostname not found. Please check the store URL in your .env file: ${process.env.WOOCOMMERCE_STORE_URL}`);
        }
        if (error.message.includes('Failed to parse URL')) {
            throw new Error(`Invalid WooCommerce store URL. Please check the format in your .env file: ${process.env.WOOCOMMERCE_STORE_URL}`);
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
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
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
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00297a05172ea2864074da52ab33dfd029b3e8f318": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getOrdersFromWooCommerce"]),
    "0086d1454012dae48d87f8b73ffe6497b833c94961": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["signOut"]),
    "00cf5330395e82bf8255922e76b18a7d7fd7cd3e01": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCompanyDetailsFromRTDB"]),
    "00fabfcbf6c7d5ce94aea620a37f0b27f8bc99710c": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getAllUsers"]),
    "401f6e3642acf65262fa6d6423f207ff565e3c09fa": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["saveCompanyDetailsToRTDB"]),
    "40779c49dada2a560ce33d1bb110771da76088dfdb": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserProfile"]),
    "40bf1e58e37d64aa62551098cfe74d13ce5ca568e6": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createUserProfile"]),
    "600197aded821c9a500870fc90fb1fc9d483b962b8": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateUserProfile"]),
    "600529d4c40d5b4637b282fe829a47ef19349e74f0": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateOrderAddressInWooCommerce"]),
    "601f181b794cd63f50dfa4b14a542bb6ac1499894b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateOrderStatusInWooCommerce"]),
    "70ca33ff81d844b3ec58711e7aa07fe89bb380c947": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateUserRole"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
}}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "00297a05172ea2864074da52ab33dfd029b3e8f318": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00297a05172ea2864074da52ab33dfd029b3e8f318"]),
    "0086d1454012dae48d87f8b73ffe6497b833c94961": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["0086d1454012dae48d87f8b73ffe6497b833c94961"]),
    "00cf5330395e82bf8255922e76b18a7d7fd7cd3e01": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00cf5330395e82bf8255922e76b18a7d7fd7cd3e01"]),
    "00fabfcbf6c7d5ce94aea620a37f0b27f8bc99710c": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00fabfcbf6c7d5ce94aea620a37f0b27f8bc99710c"]),
    "401f6e3642acf65262fa6d6423f207ff565e3c09fa": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["401f6e3642acf65262fa6d6423f207ff565e3c09fa"]),
    "40779c49dada2a560ce33d1bb110771da76088dfdb": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40779c49dada2a560ce33d1bb110771da76088dfdb"]),
    "40bf1e58e37d64aa62551098cfe74d13ce5ca568e6": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["40bf1e58e37d64aa62551098cfe74d13ce5ca568e6"]),
    "600197aded821c9a500870fc90fb1fc9d483b962b8": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["600197aded821c9a500870fc90fb1fc9d483b962b8"]),
    "600529d4c40d5b4637b282fe829a47ef19349e74f0": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["600529d4c40d5b4637b282fe829a47ef19349e74f0"]),
    "601f181b794cd63f50dfa4b14a542bb6ac1499894b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["601f181b794cd63f50dfa4b14a542bb6ac1499894b"]),
    "70ca33ff81d844b3ec58711e7aa07fe89bb380c947": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["70ca33ff81d844b3ec58711e7aa07fe89bb380c947"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$auth$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$orders$2f$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/auth/actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/app/orders/actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
}}),
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
"[project]/src/app/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/page.tsx <module evaluation>", "default");
}}),
"[project]/src/app/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/page.tsx", "default");
}}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/app/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__510134db._.js.map