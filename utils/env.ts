/**
 * Wrapper tipado sobre import.meta.env — evita espalhar `as string`/casts pelo código.
 */
export const env = {
  apiUrl: import.meta.env.VITE_API_URL as string,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
}
