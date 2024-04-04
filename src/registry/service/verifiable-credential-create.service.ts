import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AxiosRequestConfig } from 'axios'
import { ApiClient } from 'src/common/api-client'
import { RegistryErrors } from 'src/common/constants/error-messages'
import { ApiFileMimetype } from 'src/common/constants/file-mimetype'
import { RequestRoutes } from 'src/common/constants/request-routes'
import { CredentialApiDto, IssueCredentialApiRequestDto } from 'src/registry/dto/issue-credential-api-body.dto'
import { IssueCredentialRequestDto } from 'src/registry/dto/issue-credential-status-request.dto'
import { VerifiableCredentialReadService } from './verifiable-credential-read.service'

@Injectable()
export class VerifiableCredentialCreateService {
  constructor(
    private readonly apiClient: ApiClient,
    private readonly vcReadService: VerifiableCredentialReadService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Issues a VC to the user and pushes to user's wallet
   */
  async issueCredential(issueRequest: IssueCredentialRequestDto): Promise<any> {
    const requestBody = await new IssueCredentialApiRequestDto(
      new CredentialApiDto(
        issueRequest.credential.context,
        issueRequest.credential.type,
        issueRequest.issuerId,
        new Date().toISOString(),
        issueRequest.credential.expirationDate,
        issueRequest.credential.credentialSubject,
      ),
      issueRequest.credential.schemaId,
      issueRequest.credential.schemaVersion,
      issueRequest.credential.tags,
      issueRequest.credential.organization,
    )
    const vcResult = await this.apiClient.post(
      this.configService.get('SUNBIRD_VC_SERVICE_URL') + RequestRoutes.ISSUE_CREDENTIAL,
      requestBody,
    )

    if (!vcResult) {
      throw new BadRequestException(RegistryErrors.BAD_REQUEST_CREDENTIAL)
    }

    const vcId = vcResult['credential']['id']
    if (vcId !== null) {
      // TODO: Make an Api Call to upload the file to Receiver's waller
    }

    return vcResult
  }

  /**
   * Verifies the credential
   */
  async verifyCredential(vcId: string): Promise<any> {
    const headers = {
      Accept: ApiFileMimetype.PDF,
    }

    const config: AxiosRequestConfig = {
      headers: headers,
    }
    const vcDetails = await this.apiClient.get(
      this.configService.get('SUNBIRD_VC_SERVICE_URL') +
        `${RequestRoutes.CREDENTIAL}/${vcId}${RequestRoutes.VERIFY_CREDENTIAL}`,
      config,
    )

    if (!vcDetails) {
      throw new NotFoundException(RegistryErrors.CREDENTIAL_NOT_FOUND)
    }

    if (vcDetails['status'] === 'ISSUED') {
      return vcDetails
    } else {
      throw new UnauthorizedException(RegistryErrors.INVALID_CREDENTIAL)
    }
  }
}
