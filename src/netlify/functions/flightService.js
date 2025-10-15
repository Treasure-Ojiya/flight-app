export async function handler() {
  const apiUrl =
    "https://freeapi.miniprojectideas.com/api/FlightBooking/GetAllFlights";

  try {
    const res = await fetch(apiUrl);
    const data = await res.json();
    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify(data),
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
}
