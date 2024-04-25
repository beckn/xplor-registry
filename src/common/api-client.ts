import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { GrafanaLoggerService } from '../grafana/service/grafana.service'
import { InternalMessages } from './constants/message.constants'

// Interface defining the implementation of REST methods
export interface ApiImplementation {
  get: (url: string, config?: AxiosRequestConfig) => Promise<any>
  post: (url: string, data?: any, config?: AxiosRequestConfig) => Promise<any>
  put: (url: string, data?: any, config?: AxiosRequestConfig) => Promise<any>
  delete: (url: string, config?: AxiosRequestConfig) => Promise<any>
}

export class ApiClient implements ApiImplementation {
  private readonly axiosInstance: AxiosInstance

  constructor(baseURL?: string) {
    this.axiosInstance = axios.create({ baseURL })
  }

  async get(url: string, config?: AxiosRequestConfig): Promise<any> {
    try {
      const response = await this.axiosInstance.get(url, config)
      return response.data
    } catch (error) {
      new GrafanaLoggerService().sendDebug({
        message: `${InternalMessages.GET_REQUEST} ${error}`,
        methodName: this.get.name,
      })
    }
  }

  async post(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    try {
      const response = await this.axiosInstance.post(url, data, config)
      return response.data
    } catch (error) {
      new GrafanaLoggerService().sendDebug({
        message: `${InternalMessages.POST_REQUEST} ${error}`,
        methodName: this.get.name,
      })
    }
  }

  async put(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    try {
      const response = await this.axiosInstance.put(url, data, config)
      return response.data
    } catch (error) {
      new GrafanaLoggerService().sendDebug({
        message: `${InternalMessages.PUT_REQUEST} ${error}`,
        methodName: this.get.name,
      })
    }
  }

  async delete(url: string, config?: AxiosRequestConfig): Promise<any> {
    try {
      const response = await this.axiosInstance.delete(url, config)
      return response.data
    } catch (error) {
      new GrafanaLoggerService().sendDebug({
        message: `${InternalMessages.DELETE_REQUEST} ${error}`,
        methodName: this.get.name,
      })
    }
  }
}
