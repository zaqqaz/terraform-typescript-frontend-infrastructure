import { S3Backend } from "cdktf/lib/backends";
import { TerraformStack } from "cdktf";
import { configuration } from "./configuration";

export function withBackend(stack: TerraformStack) {
    return new S3Backend(stack, {
        bucket: configuration.BackendBucket,
        key: configuration.BackendKey,
        region: "eu-central-1"
    });
}
