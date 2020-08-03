import { Construct } from 'constructs';
import { App, TerraformStack } from 'cdktf';
import {
    AwsProvider,
    DataAwsIamPolicyDocument,
    Route53Record,
    Route53Zone,
    S3Bucket,
} from "./.gen/providers/aws";
import { S3Backend } from "cdktf/lib/backends";

const domainHost = "ux.by";
const domainName = "test-typescript.ux.by";

class MyStack extends TerraformStack {
    constructor(scope: Construct, name: string) {
        super(scope, name);

        new AwsProvider(this, 'aws', {
            region: 'eu-central-1'
        });

        new DataAwsIamPolicyDocument(this, 'bucket', {
            statement: [{
                actions: [`s3:GetObject`],
                resources: [`arn:aws:s3:::${domainName}/*`],
            }]
        });

        const bucket = new S3Bucket(this, 'resource', {
            bucket: domainName,
            acl: "public-read",
            website: [{
                indexDocument: "index.html",
                errorDocument: "error.html"
            }]
        });

        const route53Zone = new Route53Zone(this, 'zone', {
            name: domainHost
        });

        new Route53Record(this, domainHost, {
            zoneId: route53Zone.zoneId,
            name: domainName,
            type: 'A',

            alias: [
                {
                    evaluateTargetHealth: true,
                    name: bucket.websiteDomain!,
                    zoneId: bucket.hostedZoneId!
                }
            ]
        })

    }
}

const app = new App();
const stack = new MyStack(app, 'terraform');
app.synth();

new S3Backend(stack, {
    bucket: "terraform.ux.by",
    key: "terraform-typescript-frontend-infrastructure",
    region: "eu-central-1"
});
