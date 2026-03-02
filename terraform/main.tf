# Data sources for pre-existing infrastructure
data "azurerm_resource_group" "rg" {
  name = var.resource_group
}

data "azurerm_container_app_environment" "env" {
  name                = var.container_apps_env_name
  resource_group_name = data.azurerm_resource_group.rg.name
}

data "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = data.azurerm_resource_group.rg.name
}

locals {
  container_app_name_base = trim(
    regexreplace(
      regexreplace(lower(var.container_app_name), "[^a-z0-9-]", "-"),
      "-+",
      "-"
    ),
    "-"
  )
  container_app_name_prefixed = length(local.container_app_name_base) == 0 ? "app" : (
    can(regex("^[a-z]", local.container_app_name_base)) ? local.container_app_name_base : "app-${local.container_app_name_base}"
  )
  container_app_name = trim(substr(local.container_app_name_prefixed, 0, 32), "-")
}

# Container App
resource "azurerm_container_app" "app" {
  name                         = local.container_app_name
  container_app_environment_id = data.azurerm_container_app_environment.env.id
  resource_group_name          = data.azurerm_resource_group.rg.name
  revision_mode                = "Single"

  registry {
    server               = data.azurerm_container_registry.acr.login_server
    username             = data.azurerm_container_registry.acr.admin_username
    password_secret_name = "acr-password"
  }

  secret {
    name  = "acr-password"
    value = data.azurerm_container_registry.acr.admin_password
  }

  ingress {
    external_enabled = true
    target_port      = 3000

    traffic_weight {
      latest_revision = true
      percentage      = 100
    }
  }

  template {
    min_replicas = 0
    max_replicas = 1

    container {
      name   = local.container_app_name
      image  = "mcr.microsoft.com/k8se/quickstart:latest"
      cpu    = 0.5
      memory = "1Gi"

      env {
        name  = "NODE_ENV"
        value = "production"
      }
      env {
        name  = "PORT"
        value = "3000"
      }
      env {
        name  = "HOSTNAME"
        value = "0.0.0.0"
      }
    }
  }

  lifecycle {
    ignore_changes = [
      template[0].container[0].image
    ]
  }
}
