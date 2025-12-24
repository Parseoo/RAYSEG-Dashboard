import axios from "axios"

export async function GetAllPropertyApi() {
    return await axios.get("http://localhost:3000/property")
}

export async function GetPropertyApi(id: number) {
    return await axios.get(`http://localhost:3000/property/${id}`)
}
