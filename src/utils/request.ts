export default function MyRequest<T = any>(url: string, init?: RequestInit) {
  return new Promise<T>((resolve, reject) => {
    fetch(url, init)
      .then((res) => res.json())
      .then((rey) => {
        resolve(rey);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
