async function test() {
  try {
    const url = 'http://localhost:5000/api/v1/food/zones/detect?lat=22.7244&lng=75.8739';
    console.log('Fetching:', url);
    const res = await fetch(url);
    console.log('Status:', res.status);
    const data = await res.json();
    console.log('Data:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
