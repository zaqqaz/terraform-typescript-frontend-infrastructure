import { Construct } from 'constructs';
import { App, TerraformStack } from 'cdktf';
import { withBackend } from "./src/backend";
import { createProviders } from "./src/providers";
import { createS3 } from "./src/s3";
import { createOriginAccessIdentity, createCloudfront } from "./src/cloudfront";
import { createAcmCertificate, createAcmCertificateValidation } from "./src/acm";
import { createRoute53, createRoute53CertificateValidation } from "./src/route53";
import { createDeploy } from "./src/deploy";
import { configuration } from "./src/configuration";

class Infrastructure extends TerraformStack {
    constructor(scope: Construct, name: string) {
        super(scope, name);

        const providers = createProviders({ stack: this });

        const originAccessIdentity = createOriginAccessIdentity({ stack: this });

        const { bucket } = createS3({
            stack: this,
            provider: providers.default,
            originAccessIdentity,
            domainName: configuration.DomainName,
        });

        const acmCertificate = createAcmCertificate({
            stack: this,
            provider: providers.acm,
            domainHost: configuration.DomainHost,
        });

        const cloudfrontDistribution = createCloudfront({
            stack: this,
            domainName: configuration.DomainName,
            originAccessIdentity,
            s3Bucket: bucket,
            acmCertificate,
        });

        const {
            route53Zone,
        } = createRoute53({
            stack: this,
            domainHost: configuration.DomainHost,
            domainName: configuration.DomainName,
            cloudfrontDistribution
        });

        const route53ValidationRecord = createRoute53CertificateValidation({
            stack: this,
            route53Zone,
            acmCertificate
        });

        createAcmCertificateValidation({
            stack: this,
            provider: providers.acm,
            route53Record: route53ValidationRecord,
            certificate: acmCertificate
        });

        createDeploy({
            stack: this,
            bucket,
            unzipLambdaName: configuration.UnzipLambdaName
        });
    }
}

const app = new App();
withBackend(new Infrastructure(app, 'terraform'));

app.synth();
