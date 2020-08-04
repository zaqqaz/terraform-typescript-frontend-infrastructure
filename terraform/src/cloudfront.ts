import {
    AcmCertificate,
    CloudfrontDistribution,
    CloudfrontOriginAccessIdentity,
    S3Bucket
} from "../.gen/providers/aws";
import { TerraformStack } from "cdktf";

interface CreateCloudfrontProps {
    stack: TerraformStack;
    domainName: string;
    s3Bucket: S3Bucket;
    originAccessIdentity: CloudfrontOriginAccessIdentity;
    acmCertificate: AcmCertificate;
}

export function createCloudfront(props: CreateCloudfrontProps) {
    const { stack, domainName, s3Bucket, originAccessIdentity, acmCertificate } = props;

    return new CloudfrontDistribution(stack, 'cloudfront', {
        origin: [{
            domainName: s3Bucket.bucketRegionalDomainName,
            originId: domainName,
            s3OriginConfig: [{
                originAccessIdentity: originAccessIdentity.cloudfrontAccessIdentityPath,
            }]
        }],
        enabled: true,
        defaultRootObject: 'index.html',
        customErrorResponse: [
            {
                errorCode: 404,
                responseCode: 202,
                responsePagePath: 'index.html'
            }
        ],
        defaultCacheBehavior: [
            {
                viewerProtocolPolicy: "redirect-to-https",
                compress: true,
                allowedMethods: ["GET", "HEAD", "OPTIONS"],
                cachedMethods: ["GET", "HEAD", "OPTIONS"],
                targetOriginId: domainName,
                minTtl: 0,
                defaultTtl: 86400,
                maxTtl: 31536000,

                forwardedValues: [{
                    queryString: false,
                    cookies: [{
                        forward: "none"
                    }]
                }]
            }
        ],
        orderedCacheBehavior: [
            {
                pathPattern: 'index.html',
                allowedMethods: ["GET", "HEAD", "OPTIONS"],
                cachedMethods: ["GET", "HEAD", "OPTIONS"],
                targetOriginId: domainName,
                forwardedValues: [{
                    queryString: false,
                    headers: ['Origin'],
                    cookies: [{
                        forward: "none"
                    }]
                }],
                defaultTtl: 0,
                compress: true,
                viewerProtocolPolicy: "redirect-to-https",
            }
        ],
        aliases: [domainName],
        restrictions: [{
            geoRestriction: [{
                restrictionType: 'none',
            }]
        }],
        viewerCertificate: [{
            acmCertificateArn: acmCertificate.arn,
            sslSupportMethod: "sni-only",
        }]
    });
}

interface CreateOriginAccessIdentityProps {
    stack: TerraformStack;
}

export function createOriginAccessIdentity(props: CreateOriginAccessIdentityProps) {
    const { stack } = props;
    return new CloudfrontOriginAccessIdentity(stack, 'origin_access_identity')
}
