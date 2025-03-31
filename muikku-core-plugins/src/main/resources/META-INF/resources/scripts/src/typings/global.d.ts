declare module "*.wav";
declare module "*.gif" {
  const content: string;
  export default content;
}

declare module "*.png" {
  const content: string;
  export default content;
}
