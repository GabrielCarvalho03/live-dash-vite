export function formatImageUrl(url: string) {
  console.log("formatImageUrl called with:", url);
  return url.replace(/ /g, "%20");
}
