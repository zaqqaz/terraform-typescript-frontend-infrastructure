# terraform-typescript-frontend-infrastructure

**AWS frontend infrastructure**, includes: 

- 🏢 [S3](https://aws.amazon.com/s3/) - storage for static assets
- 🛰 [Cloudfront](https://aws.amazon.com/cloudfront/) - cdn
- 🗿 [AWS Certificate Manager](https://aws.amazon.com/certificate-manager/) - SSL certificate
- 🚏 [Route 53](https://aws.amazon.com/route53/) - DNS/Domain setup
- ⛽️ [S3 Unzip lambda](https://github.com/zaqqaz/terraform-s3-unzip) - to extract archive with static assets

## How to

- Install dependencies:
```
cd terraform
npm i
```

- Build typescript and provide DomainHost and DomainName (can be equal, or DomainName can be a subdomain)
```
DomainHost="domain.com" DomainName="test.domain.com" npm run go
```

- Run terraform
```
terraform init
terraform plan
terraform apply
``` 
