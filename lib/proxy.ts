import * as cdk from '@aws-cdk/core';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import { Protocol } from "@aws-cdk/aws-elasticloadbalancingv2"
import { DockerImageAsset } from "@aws-cdk/aws-ecr-assets";
import * as ecsPatterns from "@aws-cdk/aws-ecs-patterns";
import { ConstructBase } from './base/construct-base';
import { Apis } from './apis';
import { Networking } from './networking';

export interface ProxyProps {
    readonly region: string;
    readonly networking: Networking;
    readonly apis: Apis;
}

export class Proxy extends ConstructBase {

    readonly props: ProxyProps;

    readonly cluster: ecs.Cluster;
    readonly service: ecsPatterns.NetworkLoadBalancedFargateService;

    constructor(scope: cdk.Construct, id: string, props: ProxyProps) {
        super(scope, id);

        this.props = props;

        this.cluster = this.createCluster();
        this.service = this.createService();
    }

    private createCluster(): ecs.Cluster {
        let cluster = new ecs.Cluster(this, 'ProxyCluster', {
            vpc: this.props.networking.vpc
        });
        this.output('ProxyClusterARN', cluster.clusterArn);
        return cluster;
    }

    private createService(): ecsPatterns.NetworkLoadBalancedFargateService {
        let dockerImage = new DockerImageAsset(this, 'ProxyDockerImage', {
            directory: "proxy"
        });

        let service = new ecsPatterns.NetworkLoadBalancedFargateService(this, 'ProxyService', {
            cluster: this.cluster,
            listenerPort: 443,
            cpu: 256,
            memoryLimitMiB: 512,
            healthCheckGracePeriod: cdk.Duration.seconds(10),
            taskImageOptions: {
                image: ecs.ContainerImage.fromDockerImageAsset(dockerImage),
                containerPort: 443,
                environment: {
                    "VERSION": this.props.apis.version,
                    "COMMON_API": this.props.apis.getUrl(this.props.apis.commonsApi),
                    "CHANNELS_API": this.props.apis.getUrl(this.props.apis.channelsApi),
                    "PRODUCTS_SERVICES_API": this.props.apis.getUrl(this.props.apis.productsServicesApi),
                    "ADMIN_API": this.props.apis.getUrl(this.props.apis.adminApi)
                }
            }
        });

        service.targetGroup.configureHealthCheck({
            path: "/health",
            port: "80",
            protocol: Protocol.HTTP
        });

        service.targetGroup.setAttribute('deregistration_delay.timeout_seconds', '0');
        
        service.service.connections.allowFromAnyIpv4(ec2.Port.tcp(443));
        service.service.connections.allowFrom(ec2.Peer.ipv4(this.props.networking.vpc.vpcCidrBlock), ec2.Port.tcp(80));

        return service;
    }
}