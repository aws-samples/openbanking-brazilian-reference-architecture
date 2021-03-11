#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { OpenBankingBrazil } from '../lib/open-banking-brazil';

const app = new cdk.App();
new OpenBankingBrazil(app, 'OpenBankingBrazil');
