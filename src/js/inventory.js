export default () => {
    return import('./inventoryStyles').then(
        () => Promise.all([
            import('@redhat-cloud-services/frontend-components-inventory'),
            import('./inventoryDetail')
        ]).then(([data, { componentsMapper }]) => {
            return {
                ...data,
                inventoryConnector: (store) => data.inventoryConnector(store, componentsMapper)
            };
        })
    );
};
