let UrlGen = {
    routes: {
        authServiceUri: DDS_PORTAL_CONFIG.authServiceUri,
        baseUrl: DDS_PORTAL_CONFIG.baseUrl,
        apiPrefix: '/api/v1/',
        login: () => '/login',
        home: () => '/',
        project: (projectId) => '/#/project/' + projectId,
        folder: (folderId) => '/#/folder/' + folderId,
        file: (fileId) => '/#/file/' + fileId,
        version: (versionId) => '/#/version/' + versionId,
        agents: () => '/#/agents',
        agent: (agentId) => '/#/agent/' + agentId
    }
};

export default UrlGen;
