import * as cdk from '@aws-cdk/core';

export abstract class ConstructBase extends cdk.Construct {

    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);
    }

    protected output(id: string, value: string) {
        let output = new cdk.CfnOutput(this, id, {
            value: value
        });
        output.overrideLogicalId(id);
    }

    protected outputAndExport(id: string, value: string, exportName: string) {
        let output = new cdk.CfnOutput(this, id, {
            value: value,
            exportName: exportName
        });
        output.overrideLogicalId(id);
    }
}