import { License } from "@shared/types";
import { get, post } from "../request";
import { APIResponse, fallback } from "../response";


function license() {
  async function create(data: License.Create.Request): Promise<APIResponse<License.Create.Response>> {
    return await post(License.Create.path, data, fallback("Failed to create license"));
  }

  async function remove(data: License.Delete.Request): Promise<APIResponse<License.Delete.Response>> {
    return await post(License.Delete.path, data, fallback("Failed to delete license"));
  }

  async function update(data: License.Update.Request): Promise<APIResponse<License.Update.Response>> {
    return await post(License.Update.path, data, fallback("Failed to update license"));
  }

  async function getAll(): Promise<APIResponse<License.GetAll.Response>> {
    return await post(License.GetAll.path, {}, fallback("Failed to load licenses"));
  }

  return {
    create,
    remove,
    update,
    getAll,
  };
}

export const licenseAgent = license();