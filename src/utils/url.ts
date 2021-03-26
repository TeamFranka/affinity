export function absoluteUrl(router: any, location: any) {
  const { href } = router.resolve(location);
  return `${process.env.VUE_APP_PUBLIC_SERVER}${href}`;
}
