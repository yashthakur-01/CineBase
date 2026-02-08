import axios from "axios"

// Previously fetched pages:
// Pages 1-35 (already in database)

// Current fetch: pages 36-50 (latest movies)
// Current fetch: pages 70-100 (latest movies)
// Current fetch: pages 100-150 (latest movies)
const FROM_PAGE = 190;
const TO_PAGE = 250;

const fetchData = async (x, y) => {
    try {
        for (let i = x; i < y; i++) {
            console.log(`Fetching page ${i}...`);
            let url = `http://localhost:3000/api/store/store-movies/${i}`;
            const response = await axios.get(url);
            console.log(`Page ${i} fetched:`, response.data?.message || 'Success');
        }
        console.log(`\nData fetched successfully! Pages ${x} to ${y - 1} completed.`);
        console.log("Now run embedding_generation_caller.js to embed the new movies.");

    } catch (error) {
        console.log("Error:", error.message);
    }
}

fetchData(FROM_PAGE, TO_PAGE);