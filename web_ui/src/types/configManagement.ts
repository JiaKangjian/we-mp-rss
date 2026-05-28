<<<<<<< HEAD
export interface ConfigManagement {
  config_key: string
  config_value: string
  description?: string
  created_at: string
  updated_at: string
}

export interface ConfigManagementCreate {
  config_key: string
  config_value: string
  description?: string
}

export interface ConfigManagementUpdate {
  config_value?: string
  description?: string
=======
export interface ConfigManagement {
  config_key: string
  config_value: string
  description?: string
  created_at: string
  updated_at: string
}

export interface ConfigManagementCreate {
  config_key: string
  config_value: string
  description?: string
}

export interface ConfigManagementUpdate {
  config_value?: string
  description?: string
>>>>>>> cf8b407bc0234127992336de96980c6c65f8f72b
}