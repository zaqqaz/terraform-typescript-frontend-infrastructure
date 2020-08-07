import { Unzip } from "../.gen/modules/zaqqaz/unzip/s3";
import { TerraformResource, TerraformStack } from "cdktf";
import { S3Bucket, S3BucketObject } from "../.gen/providers/aws";
import { File } from "../.gen/providers/archive";

interface CreateDeploy {
    stack: TerraformStack;
    bucket: S3Bucket;
    unzipLambdaName: string;
}

export function createDeploy(props: CreateDeploy) {
    const { stack, bucket, unzipLambdaName } = props;
    const s3folderWithAssetsArchive = 'assetsArchive';
    const assetsArchiveName = 'assets.zip';

    const unzip = new Unzip(stack, 'unzip', {
        lambdaFunctionName: unzipLambdaName,
        srcBucket: bucket.id,
        srcPrefix: s3folderWithAssetsArchive,
        deleteSource: true
    });

    const file = new File(stack, 'staticAssets', {
        type: 'zip',
        sourceDir: `${__dirname}/../assets`,
        outputPath: `${__dirname}/../.terraform/tmp/${assetsArchiveName}`
    });

    new S3BucketObject(stack, 'DataAwsS3BucketObject', {
        bucket: bucket.id!,
        key: [s3folderWithAssetsArchive, assetsArchiveName].join('/'),
        source: file.outputPath,
        etag: file.outputMd5,

        dependsOn: [(unzip as unknown as TerraformResource)]
    });
}
