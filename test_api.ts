async function main() {
  const payload = {
    vendor: {
      name: "Test Vendor " + Date.now(),
      ownerName: "Test Owner",
      email: `test${Date.now()}@example.com`,
      phone: "1234567890",
      whatsappPhone: "1234567890",
      cityId: "c4a518cd-bb8a-4fbd-8060-379a4e269297", // Arif Wala from previous output
      // townId optional
    },
    vehicles: [
      {
        title: "Test Vehicle",
        brand: "e2ffcf59-8699-4b18-a766-a15072ecf4b6", // City brand from previous output
        type: "90f13795-57b0-40d0-a56c-79f7bfa93c3f", // Sedan from previous output
        images: ["http://example.com/image.jpg"],
        priceWithinCity: "5000",
        priceOutOfCity: "8000",
        features: ["AC"],
      },
    ],
  };

  try {
    const response = await fetch("http://localhost:3000/api/public/list-car", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("API Error:", response.status, text);
      return;
    }

    const data = await response.json();
    console.log("API Success:", data);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

main();
