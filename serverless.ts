
const handlerName = process.env.HANDLER_NAME || 'handler';

const serverless = {
    service: 'test-service',
    plugins: [
        'serverless-bundle',
        'serverless-localstack',
        'serverless-prune-plugin',
    ],
    provider: {
        name: 'aws',
        deploymentMethod: 'direct',
        runtime: 'nodejs18.x',
        memorySize: '${self:custom.memorySize.${opt:stage, self:provider.stage}}' as unknown as number,
        versionFunctions: '${self:custom.versioning.${opt:stage, self:provider.stage}}' as unknown as boolean,
        endpointType: '${self:custom.endpointType.${opt:stage, self:provider.stage}}',
    },
    custom: {
        bundle: {
            sourcemaps: false,
                linting: false,
                tsconfig: './tsconfig.app.json',
                ignorePackages: [
                'superagent-proxy',
                'class-transformer/storage',
                'cache-manager',
                'class-transformer',
                'class-validator',
                '@nestjs/websockets/socket-module',
                '@nestjs/microservices/microservices-module',
                '@nestjs/microservices',
            ],
                minifyOptions: {
                keepNames: true,
            },
        },
        dbIamRole: 'mongo-connection-${opt:stage, self:provider.stage}-role',
            enable: {
            local: false,
                dev: false,
                prod: true,
        },
        versioning: {
            local: false,
                dev: true,
                prod: true,
        },
        localstack: {
            host: 'http://localhost',
                debug: true,
                edgePort: 4566,
                stages: ['local'],
        },
        memorySize: {
            local: 256,
            dev: 1024,
            prod: 1024,
        },
        prune: {
            automatic: true,
                number: 3,
        },
        endpointType: {
            local: 'REGIONAL',
                dev: 'REGIONAL',
                prod: 'EDGE',
        },
    },
    package: {
        individually: true,
    },
    functions: {
        api: {
            timeout: 30,
            handler: `src/serverless.${handlerName}`,
            events: [
                {
                    http: {
                        method: 'ANY',
                        path: '/',
                    },
                },
                {
                    http: {
                        method: 'ANY',
                        path: '/{any+}',
                    },
                },
            ],
        },
    }
}

module.exports = serverless;
