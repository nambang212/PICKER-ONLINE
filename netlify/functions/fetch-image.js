// Menggunakan node-fetch versi 2 karena lebih kompatibel dengan Netlify Functions
const fetch = require('node-fetch');

exports.handler = async function(event) {
  // Ambil URL gambar dari parameter
  const imageUrl = event.queryStringParameters.url;

  // Jika tidak ada URL, kirim error
  if (!imageUrl) {
    return {
      statusCode: 400,
      body: 'Image URL is required',
    };
  }

  try {
    // Minta gambar dari server Instagram
    const response = await fetch(imageUrl);

    // Jika Instagram tidak memberikan gambar, kirim error
    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText };
    }

    // Ambil data gambar
    const imageBuffer = await response.buffer();

    // Kirim kembali gambar ke browser Anda
    return {
      statusCode: 200,
      headers: {
        'Content-Type': response.headers.get('content-type'),
      },
      body: imageBuffer.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error('Fetch error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch image' }),
    };
  }
};
