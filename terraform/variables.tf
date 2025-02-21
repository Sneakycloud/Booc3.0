variable app_name {
  default = "BoocApp"
}

output app_name {
  value       = var.app_name
}


variable location {
  default = "westeurope"
}

variable "kubernetes_version" {
  default = "1.31.2"
}