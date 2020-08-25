import Api from "./Api"
import Csrf from "./Csrf"

export default {
  async createOrUpdate(data) {
    await Csrf.getCookie()
    return Api.post(`/submission/createOrUpdate`, data)
  }
}
