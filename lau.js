Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefinitions = exports.getDefaultConfig = void 0;
const utils_1 = require("./utils");
const defaultUrl = "http://localhost:4242/api/client/features";
const defaultToken = "default:development.unleash-insecure-api-token";
const supportedSpecVersion = "4.2.0";
console.log(process.env);
const getDefaultConfig = (defaultAppName = "nextjs") => {
    const baseUrl = (0, utils_1.removeTrailingSlash)(process.env.UNLEASH_SERVER_API_URL ||
        process.env.NEXT_PUBLIC_UNLEASH_SERVER_API_URL);
    const envToken = process.env.UNLEASH_SERVER_API_TOKEN;
    const instanceId = process.env.UNLEASH_SERVER_INSTANCE_ID;
    let token = undefined;
    if (envToken) {
        token = envToken;
    }
    else if (!instanceId) {
        token = defaultToken;
    }
    return {
        appName: process.env.UNLEASH_APP_NAME ||
            process.env.NEXT_PUBLIC_UNLEASH_APP_NAME ||
            defaultAppName,
        url: baseUrl ? `${baseUrl}/client/features` : defaultUrl,
        ...(token ? { token } : {}),
        ...(instanceId ? { instanceId } : {}),
        fetchOptions: {},
    };
};
exports.getDefaultConfig = getDefaultConfig;
/**
 * Fetch Server-side feature flags definitions from Unleash API
 *
 * If you provide `url` in the config parameter, it should be a full endpoint path:
 * @example getDefinitions({ url: `http://localhost:4242/api/client/features` })
 */
const getDefinitions = async (config) => {
    const { appName, url, token, instanceId, fetchOptions } = {
        ...(0, exports.getDefaultConfig)(),
        ...(config || {}),
    };
    if (url === defaultUrl) {
        console.warn("Using fallback Unleash API URL (http://localhost:4242/api).", "Provide a URL or set UNLEASH_SERVER_API_URL environment variable.");
    }
    if (token === defaultToken) {
        console.error("Using fallback default token. Pass token or set UNLEASH_SERVER_API_TOKEN environment variable.");
    }
    const fetchUrl = new URL(url);
    const sendAuthorizationToken = !instanceId || token !== defaultToken;
    const headers = {
        "Content-Type": "application/json",
        "UNLEASH-APPNAME": appName,
        "User-Agent": appName,
        "Unleash-Client-Spec": supportedSpecVersion,
        // "UNLEASH-SERVERLESS-CLIENT": "TRUE", // TODO: Add serverless client without registration
        ...(instanceId ? { "UNLEASH-INSTANCEID": instanceId } : {}),
        ...(fetchOptions.headers || {}),
        ...(sendAuthorizationToken ? { Authorization: token } : {}),
    };
    const response = await fetch(fetchUrl.toString(), {
        ...fetchOptions,
        headers,
    });
    return response?.json();
};
exports.getDefinitions = getDefinitions;
