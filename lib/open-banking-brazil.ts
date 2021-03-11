import * as cdk from '@aws-cdk/core';
import { Apis } from './apis';
import { Networking } from './networking';
import { Proxy } from './proxy';

export class OpenBankingBrazil extends cdk.Stack {

  readonly networking: Networking;
  readonly apis: Apis;
  readonly proxy: Proxy;

  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    this.networking = new Networking(this, 'Networking', {
      region: this.region
    })

    this.apis = new Apis(this, 'Apis', {
      region: this.region,
      networking: this.networking
    });

    this.proxy = new Proxy(this, 'Proxy', {
      region: this.region,
      networking: this.networking,
      apis: this.apis
    });

  }

}
