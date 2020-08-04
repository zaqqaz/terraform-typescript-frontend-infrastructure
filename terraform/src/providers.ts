import { AwsProvider, } from "../.gen/providers/aws";
import { TerraformStack } from "cdktf";

interface CreateProvidersProps {
    stack: TerraformStack;
}

export function createProviders(props: CreateProvidersProps) {
    const { stack } = props;

    const defaultProvider = new AwsProvider(stack, 'default', {
        region: 'eu-central-1',
    });

    // For Cloudfront ssl certificate should be created in us-east-1 region
    const acmProvider = new AwsProvider(stack, 'acm', {
        region: 'us-east-1',
        alias: 'acm'
    });

    return {
        default: defaultProvider,
        acm: acmProvider,
    }
}
