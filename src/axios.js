import axios from 'axios';
const integrate=axios.create({
    baseURL:`${import.meta.env.BASE_URL}/api`,
    headers:{'Content-Type':'application.json'},
});
export default integrate;