import { S3Backend } from "cdktf/lib/backends";
import { TerraformStack } from "cdktf";

export function withBackend(stack: TerraformStack) {
    return new S3Backend(stack, {
        bucket: "terraform.ux.by",
        key: "terraform-typescript-frontend-infrastructure",
        region: "eu-central-1"
    });
}
