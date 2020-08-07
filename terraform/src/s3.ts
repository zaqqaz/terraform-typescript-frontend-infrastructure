import {
    AwsProvider,
    CloudfrontOriginAccessIdentity,
    DataAwsIamPolicyDocument,
    S3Bucket,
    S3BucketPolicy
} from "../.gen/providers/aws";
import { TerraformStack } from "cdktf";

interface CreateS3Props {
    stack: TerraformStack;
    provider: AwsProvider;
    domainName: string;
    originAccessIdentity: CloudfrontOriginAccessIdentity;
}

export function createS3(props: CreateS3Props) {
    const {
        stack,
        provider,
        domainName,
        originAccessIdentity
    } = props;

    const bucket = new S3Bucket(stack, 'resource', {
        bucket: domainName,
        acl: "private",
        corsRule: [
            {
                allowedOrigins: [
                    "*"
                ],
                allowedMethods: [
                    "GET"
                ]
            }
        ]
    });

    const policyDocument = new DataAwsIamPolicyDocument(stack, 'bucket', {
        provider,
        statement: [
            {
                actions: [`s3:GetObject`],
                resources: [
                    `${bucket.arn}/*`
                ],
                principals: [{
                    type: "AWS",
                    identifiers: [
                        originAccessIdentity.iamArn
                    ]
                }],
            },
            {
                actions: [`s3:ListBucket`],
                resources: [
                    bucket.arn!,
                ],
                principals: [{
                    type: "AWS",
                    identifiers: [
                        originAccessIdentity.iamArn
                    ]
                }],
            }
        ],
    });

    new S3BucketPolicy(stack, 'policy',{
        bucket: bucket.id!,
        policy: policyDocument.json
    });

    return {
        bucket,
    }
}
