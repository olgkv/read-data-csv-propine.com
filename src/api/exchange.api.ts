class ExchangeService {
  async getRate(token: string, currency = 'USD', apiKey = null ) {
    const request = apiKey
      ? `https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=${currency}&api_key=${apiKey}`
      : `https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=${currency}`;

    const res = await fetch(request);
    if (res.ok) {
      const data = await res.json();
      // console.log(data);
      return data;
    }
  }
}

export default new ExchangeService();
