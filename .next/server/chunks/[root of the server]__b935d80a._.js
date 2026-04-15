module.exports = {

"[project]/.next-internal/server/app/api/orders/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route.runtime.dev.js [external] (next/dist/compiled/next-server/app-route.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/@opentelemetry/api [external] (@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("@opentelemetry/api", () => require("@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page.runtime.dev.js [external] (next/dist/compiled/next-server/app-page.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/app/api/orders/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ {"40e21cf157b98e5862f6b3610dde210e5c8e75968b":"GET"} */ __turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-route] (ecmascript)");
;
;
;
// Robust mapping function to prevent crashes from unexpected data.
// This function remains unchanged as it's not part of the fetching logic.
const mapWCOrderToAppOrder = (order)=>{
    try {
        const lineItems = (order.line_items || []).map((item)=>{
            // The vendor code is the part of the SKU before the first hyphen.
            const sku = item.sku || '';
            const vendorCode = sku.split('-')[0] || undefined;
            return {
                itemId: String(item.product_id),
                name: item.name || 'Unknown Item',
                sku: item.sku || undefined,
                qty: item.quantity || 0,
                price: parseFloat(item.price || '0'),
                imageUrl: item.image?.src,
                vendorName: vendorCode
            };
        });
        const getMetaValue = (key)=>{
            const meta = (order.meta_data || []).find((m)=>m.key === key);
            return meta ? meta.value : undefined;
        };
        const statusMap = {
            'pending': 'pending',
            'processing': 'processing',
            'on-hold': 'hold',
            'completed': 'completed',
            'cancelled': 'cancelled',
            'failed': 'failed',
            'refunded': 'failed',
            'queue': 'queue',
            'dispatch': 'dispatch',
            'wc-in-transit': 'in-transit'
        };
        const appStatus = statusMap[order.status] || 'pending';
        const formatAddress = (addr)=>{
            if (!addr) return '';
            const parts = [
                addr.address_1,
                addr.address_2,
                addr.city,
                addr.state,
                addr.postcode,
                addr.country
            ];
            return parts.filter(Boolean).join(', ');
        };
        const subTotal = lineItems.reduce((sum, item)=>sum + item.price * item.qty, 0);
        return {
            id: String(order.id),
            parentId: order.parent_id || 0,
            customerName: `${order.billing?.first_name || ''} ${order.billing?.last_name || ''}`.trim() || 'N/A',
            phone: order.billing?.phone,
            altPhone: getMetaValue('_billing_alternate_phone'),
            pincode: order.billing?.postcode,
            gmail: order.billing?.email,
            items: lineItems,
            status: appStatus,
            orderType: 'delivery',
            billingAddress: formatAddress(order.billing),
            billing_city: order.billing?.city,
            billing_state: order.billing?.state,
            billing_country: order.billing?.country,
            shippingAddress: formatAddress(order.shipping),
            trackingId: getMetaValue('_wc_shipment_tracking_items')?.[0]?.tracking_number,
            totalAmount: parseFloat(order.total || '0'),
            taxAmount: parseFloat(order.total_tax || '0'),
            subTotal: subTotal,
            timestamp: order.date_created_gmt ? `${order.date_created_gmt}Z` : new Date().toISOString(),
            paymentMethod: 'card',
            paymentDate: order.date_paid_gmt ? `${order.date_paid_gmt}Z` : null,
            vendorName: lineItems.length > 0 ? lineItems[0].vendorName : undefined
        };
    } catch (error) {
        console.error(`Error mapping order ID ${order.id}:`, error);
        return null; // Return null if a single order fails to map
    }
};
async function /*#__TURBOPACK_DISABLE_EXPORT_MERGING__*/ GET(request) {
    // STEP 1 & 3: Read server-side credentials
    const storeUrl = process.env.WOOCOMMERCE_STORE_URL;
    const consumerKey = process.env.WOOCOMMERCE_CONSUMER_KEY;
    const consumerSecret = process.env.WOOCOMMERCE_CONSUMER_SECRET;
    if (!storeUrl || !consumerKey || !consumerSecret) {
        const errorMessage = 'WooCommerce API credentials are not configured on the server. Please check the WOOCOMMERCE_STORE_URL, WOOCOMMERCE_CONSUMER_KEY, and WOOCOMMERCE_CONSUMER_SECRET in your .env file.';
        console.error("Connection Error:", errorMessage);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: errorMessage
        }, {
            status: 500
        });
    }
    try {
        new URL(storeUrl);
    } catch (e) {
        const errorMessage = `Invalid WooCommerce URL format in .env file: ${storeUrl}. It should be the base URL of your WordPress site (e.g., https://yourstore.com).`;
        console.error("Configuration Error:", errorMessage);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: errorMessage
        }, {
            status: 500
        });
    }
    // STEP 3: Manually construct the API call
    const { searchParams } = new URL(request.url);
    const apiParams = new URLSearchParams({
        per_page: '100',
        orderby: 'date',
        order: 'desc',
        consumer_key: consumerKey,
        consumer_secret: consumerSecret
    });
    // Forward relevant params from the client to the WooCommerce API
    if (searchParams.get('status') && searchParams.get('status') !== 'any') {
        apiParams.set('status', searchParams.get('status'));
    } else {
        apiParams.set('status', [
            'pending',
            'processing',
            'on-hold',
            'completed',
            'cancelled',
            'failed',
            'queue',
            'dispatch',
            'wc-in-transit'
        ].join(','));
    }
    if (searchParams.get('after')) apiParams.set('after', searchParams.get('after'));
    if (searchParams.get('before')) apiParams.set('before', searchParams.get('before'));
    if (searchParams.get('modified_after')) apiParams.set('modified_after', searchParams.get('modified_after'));
    if (searchParams.get('modified_before')) apiParams.set('modified_before', searchParams.get('modified_before'));
    if (searchParams.get('search')) apiParams.set('search', searchParams.get('search'));
    if (searchParams.get('page')) apiParams.set('page', searchParams.get('page'));
    const apiEndpoint = `${storeUrl.replace(/\/+$/, '')}/wp-json/wc/v3/orders`;
    const requestUrl = `${apiEndpoint}?${apiParams.toString()}`;
    let response;
    try {
        response = await fetch(requestUrl, {
            // Prevent caching of API responses
            cache: 'no-store'
        });
    } catch (networkError) {
        console.error("Network Error connecting to WooCommerce:", networkError);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: `Network error while trying to connect to your store. Please check the server's internet connection and the store URL. Details: ${networkError.message}`
        }, {
            status: 500
        });
    }
    // STEP 3 & 5: Read response as text first to check for HTML
    const responseText = await response.text();
    if (responseText.trim().startsWith('<')) {
        console.error("Received HTML response instead of JSON from WooCommerce. URL:", storeUrl);
        console.error("Raw HTML Response:", responseText.substring(0, 500) + '...'); // Log first 500 chars
        const errorMessage = `The WooCommerce API returned an HTML page instead of JSON data. This usually means the 'WOOCOMMERCE_STORE_URL' is incorrect, or a plugin/server issue is interfering. Please verify the URL is your base WordPress URL (e.g., https://yourstore.com).`;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: errorMessage
        }, {
            status: 500
        });
    }
    let fetchedOrders;
    try {
        fetchedOrders = JSON.parse(responseText);
    } catch (jsonError) {
        console.error("Failed to parse JSON response from WooCommerce.");
        console.error("Raw Response Text:", responseText);
        const errorMessage = `The WooCommerce API returned a response that was not valid JSON. This could indicate a server error on your store's side. Please check your WooCommerce status logs.`;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: errorMessage
        }, {
            status: 500
        });
    }
    // Handle cases where the API returns an error object instead of an order list
    if (fetchedOrders.code && fetchedOrders.message) {
        console.error("WooCommerce API Error:", fetchedOrders);
        let detail = fetchedOrders.message;
        if (fetchedOrders.code === 'woocommerce_rest_authentication_error') {
            detail = "Authentication failed. Please check your Consumer Key and Secret.";
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: `WooCommerce API Error: ${detail}`
        }, {
            status: 500
        });
    }
    // STEP 3: Map and return the data
    const mappedOrders = fetchedOrders.map((order)=>mapWCOrderToAppOrder(order)).filter((order)=>order !== null);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(mappedOrders);
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    GET
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["registerServerReference"])(GET, "40e21cf157b98e5862f6b3610dde210e5c8e75968b", null);
}}),

};

//# sourceMappingURL=%5Broot%20of%20the%20server%5D__b935d80a._.js.map