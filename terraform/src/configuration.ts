export const configuration = {
    DomainHost: process.env.DomainHost!,
    DomainName: process.env.DomainName!,
    BackendBucket: process.env.BackendBucket!,
    BackendKey: process.env.BackendKey || "terraform-typescript-frontend-infrastructure.json",
    UnzipLambdaName: process.env.UnzipLambdaName || "unzipTTFI"
};
