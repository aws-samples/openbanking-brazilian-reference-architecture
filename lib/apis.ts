import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as apigateway from "@aws-cdk/aws-apigateway";
import { Asset } from "@aws-cdk/aws-s3-assets";
import { ConstructBase } from './base/construct-base';
import { Networking } from './networking';

export interface ApiProps {
    readonly region: string,
    readonly networking: Networking;
}

export class Apis extends ConstructBase {

    private readonly props: ApiProps;

    readonly stageName = "stub";
    readonly version = "v1";

    readonly adminApi: apigateway.SpecRestApi;
    readonly channelsApi: apigateway.SpecRestApi;
    readonly commonsApi: apigateway.SpecRestApi;
    readonly productsServicesApi: apigateway.SpecRestApi;

    constructor(scope: cdk.Construct, id: string, props: ApiProps) {
        super(scope, id);

        this.props = props;

        this.adminApi = this.createApi('admin-api');
        this.channelsApi = this.createApi('channels-api');
        this.commonsApi = this.createApi('common-api');
        this.productsServicesApi = this.createApi('products-services-api');
    }

    private createApi(type: string): apigateway.SpecRestApi {

        let specAsset = new Asset(this, `${type}-asset`, {
            path: `spec/${type}.yaml`,
        });

        let specTransformed = cdk.Fn.transform('AWS::Include', { 'Location': specAsset.s3ObjectUrl });

        let api = new apigateway.SpecRestApi(this, type, {
            apiDefinition: apigateway.ApiDefinition.fromInline(specTransformed),
            endpointTypes: [apigateway.EndpointType.PRIVATE],
            deployOptions: {
                stageName: this.stageName
            }
        });
        api.node.addDependency(this.props.networking.apigwVpce);

        return api;
    }

    public getUrl(api: apigateway.SpecRestApi): string {
        return `https://${api.restApiId}.execute-api.${this.props.region}.amazonaws.com/${this.stageName}/`
    }

}