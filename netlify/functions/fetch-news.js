exports.handler = async function (event, context) {
  const query = event.queryStringParameters.q || "";
  const category = event.queryStringParameters.category || ""; // yeni kateqoriya parametri
  const API_KEY = "0ea2bdb2e0714ed0a010339f866ae4b0";

  // Əgər kateqoriya verilibsə, `top-headlines` endpointini istifadə et, yoxsa everything endpoint
  let url = "";

  if (category) {
    // category varsa, top-headlines endpointindən istifadə edirik
    url = `https://newsapi.org/v2/top-headlines?category=${encodeURIComponent(category)}&apiKey=${API_KEY}&pageSize=100&language=en`;
    if (query) {
      url += `&q=${encodeURIComponent(query)}`;  // Axtarış sözü də əlavə oluna bilər
    }
  } else {
    // category yoxdursa, everything endpointini istifadə et
    const qParam = query || "news";
    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(qParam)}&apiKey=${API_KEY}&pageSize=100&language=en&sortBy=publishedAt`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Data daxilində xəbərlərə category əlavə etmək lazım ola bilər (top-headlines endpoint-də kateqoriya olmaya bilər)
    // Ona görə hər xəbərə category əlavə edək, əgər category verilibsə:
    if (category && data.articles) {
      data.articles = data.articles.map(article => ({
        ...article,
        category: category
      }));
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
