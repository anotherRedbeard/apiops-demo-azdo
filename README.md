# apiops-demo-azdo
There is my repo for implementing APIOps with a GH repo and AzDO pipelines

## Prerequisites

- You will need to create a new client_id and secret on an existing or new service principal.
  - Here is the command to create the new service principal

    ```# Bash script
      az ad sp create-for-rbac --name myServicePrincipalName1 --role reader --scopes /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRG1
    ```

- Create variables for each of these items in the AzDO variable group:

    | Secret Name | Description |
    | ------------- | ----------- |
    |AZURE_CLIENT_ID|The client id of the service principal|
    |AZURE_CLIENT_SECRET|The client secret of the service principal|
    |AZURE_SUBSCRIPTION_ID|The subscription id of the APIM resource |
    |AZURE_TENANT_ID|The tenant id of the service principal|

    | Variable Name | Description |
    | ------------- | ----------- |
    |APIM_INSTANCE_NAME |The name of the APIM instance to migrate from |
    |RESOURCE_GROUP_NAME|The name of the resource group the APIM instance is in|
