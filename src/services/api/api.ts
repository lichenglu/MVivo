import { ApiResponse, ApisauceInstance, create } from "apisauce"

import { ApiConfig, DEFAULT_API_CONFIG } from "./api-config"
import { getGeneralApiProblem } from "./api-problem"
import * as Types from "./api.types"

/**
 * Manages all requests to the API.
 */
export class Api {
  /**
   * Configurable options.
   */
  public config: ApiConfig

  /**
   * The underlying apisauce instance which performs the requests.
   */
  private apisauce: ApisauceInstance

  /**
   * Creates the api.
   *
   * @param config The configuration to use.
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
  }

  /**
   * Sets up the API.  This will be called during the bootup
   * sequence and will happen before the first React component
   * is mounted.
   *
   * Be as quick as possible in here.
   */
  public setup() {
    // construct the apisauce instance
    this.apisauce = create({
      baseURL: this.config.url,
      headers: {
        Accept: "application/json",
      },
      timeout: this.config.timeout,
    })
  }

  /**
   * Gets a list of repos.
   */
  public async getRepo(repo: string): Promise<Types.GetRepoResult> {
    // make the api call
    const response: ApiResponse<any> = await this.apisauce.get(`/repos/${repo}`)

    // the typical ways to die when calling an api
    if (!response.ok) {
      const problem = getGeneralApiProblem(response)
      if (problem) return problem
    }

    // transform the data into the format we are expecting
    try {
      const resultRepo: Types.Repo = {
        id: response.data.id,
        name: response.data.name,
        owner: response.data.owner.login,
      }
      return { kind: "ok", repo: resultRepo }
    } catch {
      return { kind: "bad-data" }
    }
  }
}
