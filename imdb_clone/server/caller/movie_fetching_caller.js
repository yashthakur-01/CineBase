import axios from "axios"

const fetchData = async(x,y) => {
    try {
        for(let i = x;i<y;i++){
            let url = `http://localhost:3000/store-movies/${i}`;
            const response = await axios.get(url)
        }
        console.log("Data fetched successfully");

    } catch (error) {
        console.log(error);
    }
}

fetchData(30,35);