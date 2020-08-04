import { Unzip } from "../.gen/modules/zaqqaz/unzip/s3";
import { TerraformResource, TerraformStack } from "cdktf";
import { S3Bucket, S3BucketObject } from "../.gen/providers/aws";

interface CreateDeploy {
    stack: TerraformStack;
    bucket: S3Bucket;
}

export function createDeploy(props: CreateDeploy) {
    const { stack, bucket } = props;
    const s3folderWithAssetsArchive = 'assetsArchive';
    const assetsArchiveName = 'assets.zip';

    const unzip = new Unzip(stack, 'unzip', {
        srcBucket: bucket.id,
        srcPrefix: s3folderWithAssetsArchive,
        deleteSource: true
    });

    new S3BucketObject(stack, 'DataAwsS3BucketObject', {
        bucket: bucket.id!,
        key: [s3folderWithAssetsArchive, assetsArchiveName].join('/'),

        source: `${__dirname}/../assets`,
        dependsOn: [(unzip as unknown as TerraformResource)]
    });
}
