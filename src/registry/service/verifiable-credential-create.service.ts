import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AxiosRequestConfig } from 'axios'
import { ApiClient } from '../../common/api-client'
import { VcType } from '../../common/constants/enums'
import { RegistryErrors } from '../../common/constants/error-messages'
import { ApiFileMimetype } from '../../common/constants/file-mimetype'
import { RequestRoutes } from '../../common/constants/request-routes'
import { CredentialApiDto, IssueCredentialApiRequestDto } from '../../registry/dto/issue-credential-api-body.dto'
import { IssueCredentialRequestDto } from '../../registry/dto/issue-credential-status-request.dto'
import {
  SELF_ISSUED_ORGANIZATION_NAME,
  SELF_ISSUED_SCHEMA_ID,
  SELF_ISSUED_SCHEMA_TAG,
  SELF_ISSUED_SCHEMA_VERSION,
  WALLET_SERVICE_URL,
} from '../../common/constants/name-constants'
import { SELF_ISSUED_VC_CONTEXT } from '../../config/vc-schema.config'
import { generateCurrentIsoTime, generateVCExpirationDate } from '../../utils/file.utils'
import { CreateCredentialRequestDto } from '../dto/create-credential-request.dto'
import { PushVCRequestBodyDto } from '../dto/push-vc-request-body.dto'
import { VerifiableCredentialReadService } from './verifiable-credential-read.service'
import { RegistryMessages } from '../../common/constants/message.constants'
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
      this.configService.get(RequestRoutes.SUNBIRD_VC_SERVICE_URL) + RequestRoutes.ISSUE_CREDENTIAL,
      requestBody,
    )

    if (!vcResult) {
      throw new BadRequestException(RegistryErrors.BAD_REQUEST_CREDENTIAL)
    }

    const pushVCRequestBody = new PushVCRequestBodyDto(
      vcResult?.credential?.id,
      issueRequest.credentialReceiver.walletId,
      VcType.RECEIVED,
      issueRequest.credential.credentialSubject['type'],
      issueRequest.credential.credentialIconUrl,
      issueRequest.credential.templateId,
      issueRequest.credentialReceiver.tags,
      issueRequest.credentialReceiver.vcName,
    )
    // Push this VC to User's wallet
    await this.apiClient.post(
      this.configService.get(WALLET_SERVICE_URL) + RequestRoutes.PUSH_CREDENTIAL_TO_WALLET,
      pushVCRequestBody,
    )
    return vcResult
  }

  /**
   * Creates a VC and returns the VC details
   */
  async createSelfCredential(issueRequest: CreateCredentialRequestDto): Promise<any> {
    const requestBody = await new IssueCredentialApiRequestDto(
      new CredentialApiDto(
        SELF_ISSUED_VC_CONTEXT,
        ['VerifiableCredential', this.configService.get(SELF_ISSUED_SCHEMA_TAG)],
        issueRequest.issuerId,
        generateCurrentIsoTime(),
        generateVCExpirationDate(100),
        {
          id: `did:${this.configService.get(SELF_ISSUED_ORGANIZATION_NAME)}`,
          type: this.configService.get(SELF_ISSUED_SCHEMA_TAG),
          certificateLink: issueRequest.credential.certificateLink,
        },
      ),
      this.configService.get(SELF_ISSUED_SCHEMA_ID),
      this.configService.get(SELF_ISSUED_SCHEMA_VERSION),
      issueRequest.credential.tags,
      this.configService.get(SELF_ISSUED_ORGANIZATION_NAME),
    )
    const vcResult = await this.apiClient.post(
      this.configService.get(RequestRoutes.SUNBIRD_VC_SERVICE_URL) + RequestRoutes.ISSUE_CREDENTIAL,
      requestBody,
    )
    if (!vcResult) {
      throw new BadRequestException(RegistryErrors.BAD_REQUEST_CREDENTIAL)
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
      this.configService.get(RequestRoutes.SUNBIRD_VC_SERVICE_URL) +
        `${RequestRoutes.CREDENTIAL}/${vcId}${RequestRoutes.VERIFY_CREDENTIAL}`,
      config,
    )

    if (!vcDetails) {
      throw new NotFoundException(RegistryErrors.CREDENTIAL_NOT_FOUND)
    }

    if (vcDetails['status'] === 'ISSUED') {
      return { success: true, message: RegistryMessages.VERIFY_SUCCESS_MESSAGE }
    } else {
      throw new UnauthorizedException(RegistryErrors.INVALID_CREDENTIAL)
    }
  }
}
