declare module "*.wav";
declare module "*.gif" {
  const content: string;
  export default content;
}
