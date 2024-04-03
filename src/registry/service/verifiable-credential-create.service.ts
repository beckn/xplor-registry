import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AxiosRequestConfig } from 'axios'
import * as fs from 'fs'
import { ApiClient } from 'src/common/api-client'
import { RegistryErrors } from 'src/common/constants/error-messages'
import { RequestRoutes } from 'src/common/constants/request-routes'
import { StandardMessageResponse } from 'src/common/constants/standard-message-response.dto'
import { CredentialApiDto, IssueCredentialApiRequestDto } from '../dto/issue-credential-api-body.dto'
import { IssueCredentialRequestDto } from '../dto/issue-credential-status-request.dto'
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
  async issueCredential(issueRequest: IssueCredentialRequestDto): Promise<StandardMessageResponse | any> {
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

    if (vcResult == null) {
      throw new BadRequestException(RegistryErrors.BAD_REQUEST_CREDENTIAL)
    }

    const vcId = vcResult['credential']['id']
    if (vcId !== null) {
      // Create a file for the receiver and push it in the receiver's wallet
      const documentPath = await this.vcReadService.getVcVisualDocumentAsPath(
        vcId,
        'application/pdf',
        issueRequest.credential.templateId,
      )
      const savedFileContent = fs.readFileSync(documentPath)
      const file = {
        fieldname: 'file',
        filename: `${vcId}.pdf`,
        encoding: 'binary',
        mimetype: 'application/pdf',
        buffer: savedFileContent,
        path: documentPath,
      }
      // Make an Api Call to upload the file to Receiver's waller
    }

    return vcResult
  }

  /**
   * Verifies the credential
   */
  async verifyCredential(vcId: string): Promise<StandardMessageResponse | any> {
    const headers = {
      Accept: 'application/json',
    }

    const config: AxiosRequestConfig = {
      headers: headers,
    }
    const vcDetails = await this.apiClient.get(
      this.configService.get('SUNBIRD_VC_SERVICE_URL') +
        `${RequestRoutes.CREDENTIAL}/${vcId}${RequestRoutes.VERIFY_CREDENTIAL}`,
      config,
    )

    if (vcDetails == null) {
      throw new NotFoundException(RegistryErrors.CREDENTIAL_NOT_FOUND)
    }

    if (vcDetails['status'] == 'ISSUED') {
      return vcDetails
    } else {
      throw new UnauthorizedException(RegistryErrors.INVALID_CREDENTIAL)
    }
  }
}
