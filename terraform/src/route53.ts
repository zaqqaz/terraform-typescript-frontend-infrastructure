import { AcmCertificate, CloudfrontDistribution, Route53Record, Route53Zone } from "../.gen/providers/aws";
import { TerraformStack } from "cdktf";

interface CreateRoute53Props {
    stack: TerraformStack;
    domainHost: string;
    domainName: string;
    cloudfrontDistribution: CloudfrontDistribution;
}

export function createRoute53(props: CreateRoute53Props) {
    const { stack, domainHost, domainName, cloudfrontDistribution } = props;

    const route53Zone = new Route53Zone(stack, 'zone', {
        name: domainHost
    });

    const route53Record = new Route53Record(stack, 'domain', {
        zoneId: route53Zone.zoneId,
        name: domainName,
        type: 'A',

        alias: [
            {
                evaluateTargetHealth: false,
                name: cloudfrontDistribution.domainName,
                zoneId: cloudfrontDistribution.hostedZoneId
            }
        ]
    });

    return {
        route53Zone,
        route53Record,
    }
}


interface CreateRoute53CertificateValidationProps {
    stack: TerraformStack;
    acmCertificate: AcmCertificate;
    route53Zone: Route53Zone;
}

export function createRoute53CertificateValidation(props: CreateRoute53CertificateValidationProps) {
    const { stack, acmCertificate, route53Zone } = props;

    return new Route53Record(stack, 'certificateValidation', {
        zoneId: route53Zone.zoneId,
        name: acmCertificate.domainValidationOptions('0').resourceRecordName,
        type: acmCertificate.domainValidationOptions('0').resourceRecordType,
        records: [
            acmCertificate.domainValidationOptions('0').resourceRecordValue
        ],
        ttl: 60
    });
}
