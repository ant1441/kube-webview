/**
 * API Paths
 */

export const NODES = '/api/v1/nodes';
export const NAMESPACES = '/api/v1/namespaces';
export function PODS(namespace) {
    if (!namespace) {
        namespace = "default";
    }
    return `api/v1/pods?namespace=${namespace}`;
}
export function SERVICES(namespace) {
    if (!namespace) {
        namespace = "default";
    }
    return `api/v1/services?namespace=${namespace}`;
}
export function INGRESS(namespace) {
    if (!namespace) {
        namespace = "default";
    }
    return `api/v1/ingress?namespace=${namespace}`;
}
export function CONFIG_MAPS(namespace) {
    if (!namespace) {
        namespace = "default";
    }
    return `api/v1/configmaps?namespace=${namespace}`;
}
export const CLUSTER_ROLE_BINDINGS = 'api/v1/clusterrolebindings';
export const COMPONENT_STATUS = 'api/v1/componentstatus';
