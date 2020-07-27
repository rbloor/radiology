import axios from "axios"

let Api = axios.create({
  baseURL: "https://radiology.api.ryanbloor.co.uk/api"
})

Api.defaults.withCredentials = true

export default Api
