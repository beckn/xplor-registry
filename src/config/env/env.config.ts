export default () => ({
  REGISTRY_SERVICE_URL: process.env.REGISTRY_SERVICE_URL,
  SUNBIRD_IDENTITY_SERVICE_URL: process.env.SUNBIRD_IDENTITY_SERVICE_URL,
  SUNBIRD_VC_SERVICE_URL: process.env.SUNBIRD_VC_SERVICE_URL,
  SUNBIRD_SCHEMA_SERVICE_URL: process.env.SUNBIRD_SCHEMA_SERVICE_URL,
  FILE_STORE_LOCAL_PATH: process.env.FILE_STORE_LOCAL_PATH,
  SELF_ISSUED_SCHEMA_ID: process.env.SELF_ISSUED_SCHEMA_ID,
  SELF_ISSUED_SCHEMA_CONTEXT: process.env.SELF_ISSUED_SCHEMA_CONTEXT,
  SELF_ISSUED_ORGANIZATION_NAME: process.env.SELF_ISSUED_ORGANIZATION_NAME,
  SELF_ISSUED_SCHEMA_TAG: process.env.SELF_ISSUED_SCHEMA_TAG,
})