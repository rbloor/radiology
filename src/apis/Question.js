import Api from "./Api"
import Csrf from "./Csrf"

export default {
  all() {
    return Api.get("/question")
  },

  find(id) {
    return Api.get(`/question/${id}`)
  },

  async create(form) {
    await Csrf.getCookie()
    return Api.post("/question", form)
  },

  async update(id, form) {
    await Csrf.getCookie()
    return Api.patch(`/question/${id}`, form)
  },

  async delete(id) {
    await Csrf.getCookie()
    return Api.delete(`/question/${id}`)
  }
}
