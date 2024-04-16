export const SwaggerDocs = {
  title: 'Xplor Registry',
  description: 'Registry layer for Xplore to issue, fetch and verify Credentials using Sunbird RC Layer.',
  version: '0.0.1-alpha',
  tag: 'Registry',
  route: 'api/v1',
}

export const GENERATE_USER_DID_API = {
  summary: 'Generate User DID',
  description:
    'Generates a new user DID using Sunbird RC. This did acts as a issuer/administrator for all the actions like issuing VC, creating certificate Schema in Sunbird RC.',
  successResponseCode: 201,
  successResponseMessage: 'User DID generated successfully.',
}

export const CREATE_CREDENTIAL_SCHEMA_API = {
  summary: 'Create Credential Schema',
  description:
    'Create a Schema for the credential for your VCs. This schema contains the subject details of the VC like FullName, CourseName etc.',
  successResponseCode: 201,
  successResponseMessage: 'Credential Schema created successfully.',
}

export const GET_CREDENTIAL_SCHEMA_BY_ID_API = {
  summary: 'Get Credential Schema by schema id and version',
  description: 'Returns the Schema details with the entered schema id and the version.',
  successResponseCode: 200,
  successResponseMessage: 'Credential Schema details fetched successfully.',
}

export const UPDATE_SCHEMA_STATUS_API = {
  summary: 'Update Credential Schema status',
  description: 'Returns the Updated Schema details with the updated status.',
  successResponseCode: 200,
  successResponseMessage: 'Credential Schema status updated successfully.',
}

export const UPDATE_SCHEMA_PROPERTIES_API = {
  summary: 'Update Credential Schema',
  description: 'Returns the Updated Schema details with the updated fields.',
  successResponseCode: 200,
  successResponseMessage: 'Credential Schema updated successfully.',
}

export const CREATE_CREDENTIAL_TEMPLATE_API = {
  summary: 'Create Credential Schema Template',
  description: 'Create Schema Template to render the document of the VC in pdf, html format.',
  successResponseCode: 201,
  successResponseMessage: 'Credential Template created successfully.',
}

export const GET_CREDENTIAL_TEMPLATE_API = {
  summary: 'Get Credential template by template id',
  description: 'Returns the template details with the entered template id.',
  successResponseCode: 200,
  successResponseMessage: 'Credential Schema Template details fetched successfully.',
}

export const DELETE_CREDENTIAL_TEMPLATE_API = {
  summary: 'Delete Credential template',
  description: 'Delete the template using the templateId',
  successResponseCode: 200,
  successResponseMessage: 'Credential Template deleted successfully.',
}

export const ISSUE_CREDENTIAL_API = {
  summary: 'Issue Credential',
  description:
    'Issues a new verifiable credential via Sunbird RC. Takes the Issuer details, credential certificate receiver details, subject details of the Sunbird Credential and generates a new VC and pushes it to the receiver user wallet.',
  successResponseCode: 201,
  successResponseMessage: 'Verifiable credential issued successfully.',
}

export const VERIFY_CREDENTIAL_API = {
  summary: 'Verify Credential',
  description:
    'Verifies a verifiable credential by its Id/QrCode by communicating with Sunbird RC Layer. The request contains a path for VC Id by which the VC is verified.',
  successResponseCode: 200,
  successResponseMessage: 'Verifiable credential verified successfully.',
}

export const GET_CREDENTIAL_API = {
  summary: 'Get Verifiable Credential Details by VcId',
  description:
    'Retrieves details of a verifiable credential by its ID. Returns all the details of the credential in W3C Format(Json Ld) that is generated via Sunbird RC',
  successResponseCode: 200,
  successResponseMessage: 'Verifiable credential details retrieved successfully.',
}
