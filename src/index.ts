export function main(): void {
  console.log("main logs");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
