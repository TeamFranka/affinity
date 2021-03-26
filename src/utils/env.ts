export function getCypressEntry(key: string): any {
  if (window && (window as any).CYPRESS && (window as any).CYPRESS[key]) {
    // hack for testing
    return (window as any).CYPRESS[key];
  }

  return null;
}

export function popCypressEntry(key: string): any {
  const value = getCypressEntry(key);
  if (window && (window as any).CYPRESS && (window as any).CYPRESS[key]) {
    delete (window as any).CYPRESS[key];
  }

  return value;
}
