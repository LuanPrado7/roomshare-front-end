import axios, {Method} from "axios";

export const executeRequest = (endpoint: string, method : Method, body? : any) => {
    const headers = { 'Content-Type' : 'application/json'} as any;

    const token = localStorage.getItem('accessToken');
    if(token){
        headers['Authorization'] = "Bearer " + token;
    }

    headers['Access-Control-Allow-Origin'] = "*";
    headers['Access-Control-Allow-Headers'] = "Origin, X-Requested-With, Content-Type, Accept, Authorization";
    if(method == "OPTIONS") {
        headers['Access-Control-Allow-Methods'] = "PUT, POST, PATCH, DELETE, GET";
    }

    const URL = (method == 'GET' ? 'http://localhost:5002/api/v1/' : 'http://localhost:5000/api/v1/') + endpoint;
    console.log(`executando: ${URL}, metodo: ${method} e body: ${body}`);

    return axios.request({
        url : URL,
        method,
        data: body? body : '',
        headers,
        timeout: 30000
    });
}