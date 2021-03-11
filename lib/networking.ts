import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import { ConstructBase } from './base/construct-base';


export interface NetworkingProps {
    readonly region: string;
}

export class Networking extends ConstructBase {

    readonly props: NetworkingProps;

    readonly vpc: ec2.Vpc;
    readonly apigwVpce: ec2.VpcEndpoint;

    constructor(scope: cdk.Construct, id: string, props: NetworkingProps) {
        super(scope, id);

        this.props = props;
        
        this.vpc = this.createVpc();
        this.apigwVpce = this.createApigwVpcEndpoint();
    }

    private createVpc(): ec2.Vpc {
        let vpc = new ec2.Vpc(this, 'vpc', {
            maxAzs: 2,
            cidr: '172.29.0.0/16'
        });
        this.output('VpcId', vpc.vpcId);

        return vpc;
    }

    private createApigwVpcEndpoint(): ec2.VpcEndpoint {
        let vpce = new ec2.InterfaceVpcEndpoint(this, 'ApigwVpce', {
            service: {
                name: `com.amazonaws.${this.props.region}.execute-api`,
                port: 443
            },
            vpc: this.vpc,
            open: true,
            privateDnsEnabled: true
        });

        let vpceId = vpce.node.defaultChild as ec2.CfnVPCEndpoint
        vpceId.overrideLogicalId('ApigwVpce')

        this.output('ApigwVpceId', vpce.vpcEndpointId);

        return vpce;
    }

}