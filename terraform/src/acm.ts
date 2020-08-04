import { TerraformStack } from "cdktf";
import { AcmCertificate, AcmCertificateValidation, AwsProvider, Route53Record } from "../.gen/providers/aws";

interface CreateAcmCertificateProps {
    stack: TerraformStack;
    provider: AwsProvider;
    domainHost: string;
}

export function createAcmCertificate(props: CreateAcmCertificateProps) {
    const { stack, provider, domainHost } = props;

    const certificate = new AcmCertificate(stack, 'AcmCertificate', {
        provider,
        domainName: domainHost,
        subjectAlternativeNames: [
            `*.${domainHost}`,
        ],
        validationMethod: 'DNS',
        lifecycle: {
            createBeforeDestroy: true,
        }
    });

    return certificate;
}


interface CreateAcmCertificateValidationProps {
    stack: TerraformStack;
    provider: AwsProvider;
    route53Record: Route53Record;
    certificate: AcmCertificate;
}

export function createAcmCertificateValidation(props: CreateAcmCertificateValidationProps) {
    const { stack, provider, route53Record, certificate } = props;

    return new AcmCertificateValidation(stack, 'AcmCertificateValidation', {
        provider,
        certificateArn: certificate.arn,
        validationRecordFqdns: [route53Record.fqdn]
    });
}
