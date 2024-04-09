import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AxiosRequestConfig } from 'axios'
import { promises as fsPromises } from 'fs'
import * as path from 'path'
import { ApiClient } from 'src/common/api-client'
import { RegistryErrors } from 'src/common/constants/error-messages'
import { ApiFileMimetype, FileUploadLocal } from 'src/common/constants/file-mimetype'
import { RequestRoutes } from 'src/common/constants/request-routes'

@Injectable()
export class VerifiableCredentialReadService {
  constructor(private readonly apiClient: ApiClient, private readonly configService: ConfigService) {}

  /**
   * Saves and returns path of retrieved VC document
   */
  async getVcVisualDocumentAsPath(vcId: string, outputType: string, vcTemplateId: string) {
    const headers = {
      Accept: outputType,
      templateId: vcTemplateId,
    }
    const config: AxiosRequestConfig = {
      responseType: 'arraybuffer',
      responseEncoding: 'binary',
      headers: headers,
    }
    const visualResult = await this.apiClient.get(
      this.configService.get(RequestRoutes.SUNBIRD_VC_SERVICE_URL) + `${RequestRoutes.CREDENTIAL}/${vcId}`,
      config,
    )

    const fileDirectory = this.configService.get(FileUploadLocal.pathConfigName)
    const filePath = path.join(__dirname, '..', fileDirectory)
    // Ensure directory existence
    if (!(await fsPromises.stat(filePath))) {
      await fsPromises.mkdir(filePath, { recursive: true }) // Create directory recursively
    }

    // Save the file
    // The output file format is pdf
    const fileName = `${vcId}.pdf`
    const fullPath = path.join(filePath, fileName)

    // Write PDF data to the file
    await fsPromises.writeFile(fullPath, visualResult, { encoding: 'binary' })
    return fullPath
  }

  /**
   * Renders the VC visual document as pdf
   */
  async getVcVisualDocument(vcId: string, outputType: string, vcTemplateId: string, res) {
    if (!outputType || !vcTemplateId) {
      throw new BadRequestException(RegistryErrors.BAD_REQUEST_CREDENTIAL)
    }

    const headers = {
      Accept: outputType,
      templateId: vcTemplateId,
      'Content-Type': outputType,
    }
    const config: AxiosRequestConfig = {
      responseType: 'arraybuffer',
      responseEncoding: 'binary',
      headers: headers,
    }
    const visualResult = await this.apiClient.get(
      this.configService.get(RequestRoutes.SUNBIRD_VC_SERVICE_URL) + `${RequestRoutes.CREDENTIAL}/${vcId}`,
      config,
    )
    const fileDirectory = '/file-uploads/'
    const filePath = path.join(__dirname, '..', fileDirectory)

    if (!(await fsPromises.stat(filePath))) {
      await fsPromises.mkdir(filePath, { recursive: true }) // Create directory recursively
    }

    // Save the file
    // The output file format is pdf
    const fileName = `${vcId}.pdf`
    const fullPath = path.join(filePath, fileName)

    // Write PDF data to the file
    await fsPromises.writeFile(fullPath, visualResult, { encoding: 'binary' })

    if (await fsPromises.stat(fullPath)) {
      res.set('Content-Type', outputType)
      res.download(fullPath, fileName)
      // Clear the file!
      setTimeout(async function () {
        await fsPromises.unlink(fullPath).catch((err) => console.error(err))
      }, 3000)
    } else {
      res.status(404).send(RegistryErrors.CREDENTIAL_NOT_FOUND)
    }
  }

  /**
   * Returns VC details by Vc Id
   */
  async getVcDetailsById(vcId: string, res): Promise<any> {
    const headers = {
      Accept: ApiFileMimetype.JSON,
    }

    const config: AxiosRequestConfig = {
      headers: headers,
    }
    const vcDetails = await this.apiClient.get(
      this.configService.get(RequestRoutes.SUNBIRD_VC_SERVICE_URL) + `${RequestRoutes.CREDENTIAL}/${vcId}`,
      config,
    )
    if (!vcDetails) {
      throw new NotFoundException(RegistryErrors.CREDENTIAL_NOT_FOUND)
    }

    res.status(200).send(vcDetails)
  }
}
